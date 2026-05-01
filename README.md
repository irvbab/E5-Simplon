📄 Documentation de Maintenance - API CRUD Utilisateurs
Ce dépôt contient une application de démonstration pour l'épreuve E5. L'objectif est de présenter un scénario de maintenance corrective sur une API Node.js/Express connectée à une base de données SQLite.

🚨 Scénario de Panne (Incident SQLITE_MISUSE)
Description de l'incident
Une panne critique a été identifiée sur le point d'accès (endpoint) GET /api/users. Le serveur démarre normalement et l'interface Swagger est accessible, mais toute tentative de récupération des données se solde par une erreur système.

Diagnostic
Erreur renvoyée : 500 Internal Server Error

Message terminal : SQLITE_MISUSE: Database is closed

Cause identifiée : Une rupture de flux asynchrone provoquée par une fermeture prématurée de la connexion à la base de données (db.close()) avant l'exécution de la requête SQL.

Reproduction de la panne
Lancer le serveur : node server.js.

Accéder à Swagger : http://localhost:3000/api-docs.

Exécuter la requête GET /api/users.

Constater le crash partiel de la route dans les logs.

🛠️ Solution : Mise en place d'un Middleware de Résilience
Au lieu d'une simple correction de syntaxe, la solution retenue consiste à sécuriser l'architecture de l'API pour prévenir ce type de comportement à l'avenir.

1. Création d'un Middleware de Santé (Health Check)
J'ai implémenté une fonction intermédiaire qui vérifie l'état de l'objet de connexion db avant d'autoriser l'accès aux routes CRUD.

JavaScript
const checkDatabaseState = (req, res, next) => {
    if (!db || !db.open) {
        return res.status(503).json({
            error: "Service Unavailable",
            message: "La connexion à la base de données a été perdue."
        });
    }
    next();
};
2. Application aux routes
Le middleware est inséré en amont des contrôleurs pour garantir qu'aucune requête ne soit envoyée à une base de données indisponible.

3. Résultat
L'application est désormais résiliente. Si la base de données est déconnectée, l'utilisateur reçoit un code HTTP 503 (standard pour une indisponibilité temporaire) au lieu d'une erreur système brute.