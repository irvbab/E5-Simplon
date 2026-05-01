const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

// --- CONFIGURATION SWAGGER ---
const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'API CRUD Utilisateurs - Examen E5',
            version: '1.0.0',
            description: 'Gestion complète des utilisateurs (Create, Read, Update, Delete)',
        },
        servers: [{ url: `http://localhost:${port}` }],
    },
    apis: ['./server.js'],
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// --- CONNEXION BASE ---
const dbPath = path.join(__dirname, 'database.db');
const db = new sqlite3.Database(dbPath, (err) => {
    if (!err) {
        console.log(`✅ Base connectée`);
        db.run(`CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nom TEXT, prenom TEXT, code_postal TEXT, adresse TEXT, email TEXT UNIQUE
        )`);
    }
});

// --- ROUTES CRUD DOCUMENTÉES ---

/**
 * @openapi
 * /api/users:
 *   get:
 *     summary: Liste tous les utilisateurs (READ)
 *     responses:
 *       200:
 *         description: Succès
 */
app.get('/api/users', (req, res) => {
    // ⚠️ SABOTAGE VOLONTAIRE :
    // On simule un processus qui ferme la base (ex: maintenance ou crash d'un autre module)
    db.close((err) => {
        if (err) console.error(err.message);
        console.log("⚠️ État critique : Connexion SQLite fermée manuellement.");
    });

    // On tente quand même la requête
    db.all("SELECT * FROM users", [], (err, rows) => {
        if (err) {
            // Ici, le serveur va normalement afficher "SQLITE_MISUSE"
            console.error("🔥 Erreur système :", err.message);
            return res.status(500).json({ error: "Database error", detail: err.message });
        }
        res.json(rows);
    });
});
/**
 * @openapi
 * /api/users:
 *   post:
 *     summary: Ajouter un utilisateur (CREATE)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nom: {type: string}
 *               prenom: {type: string}
 *               code_postal: {type: string}
 *               adresse: {type: string}
 *               email: {type: string}
 *     responses:
 *       201:
 *         description: Utilisateur créé
 */
app.post('/api/users', (req, res) => {
    const { nom, prenom, code_postal, adresse, email } = req.body;
    const sql = `INSERT INTO users (nom, prenom, code_postal, adresse, email) VALUES (?, ?, ?, ?, ?)`;
    db.run(sql, [nom, prenom, code_postal, adresse, email], function(err) {
        if (err) return res.status(400).json({ error: err.message });
        res.status(201).json({ id: this.lastID, message: "Utilisateur créé !" });
    });
});

/**
 * @openapi
 * /api/users/{id}:
 *   put:
 *     summary: Modifier un utilisateur (UPDATE)
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nom: {type: string}
 *               prenom: {type: string}
 *     responses:
 *       200:
 *         description: Mis à jour avec succès
 */
app.put('/api/users/:id', (req, res) => {
    const { nom, prenom, code_postal, adresse, email } = req.body;
    const sql = `UPDATE users SET nom=?, prenom=?, code_postal=?, adresse=?, email=? WHERE id=?`;
    db.run(sql, [nom, prenom, code_postal, adresse, email, req.params.id], function(err) {
        if (err) return res.status(400).json({ error: err.message });
        res.json({ message: "Utilisateur modifié avec succès" });
    });
});

/**
 * @openapi
 * /api/users/{id}:
 *   delete:
 *     summary: Supprimer un utilisateur (DELETE)
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *     responses:
 *       200:
 *         description: Supprimé
 */
app.delete('/api/users/:id', (req, res) => {
    db.run(`DELETE FROM users WHERE id = ?`, req.params.id, function(err) {
        if (err) return res.status(400).json({ error: err.message });
        res.json({ message: "Utilisateur supprimé" });
    });
});

app.listen(port, () => {
    console.log(`🚀 Serveur : http://localhost:${port}`);
    console.log(`📖 Swagger : http://localhost:${port}/api-docs`);
});