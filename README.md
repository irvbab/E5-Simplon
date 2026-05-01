\# 📄 Documentation de Maintenance - API CRUD Utilisateurs



Ce dépôt contient une application de démonstration pour l'épreuve E5. L'objectif est de présenter un scénario de maintenance corrective sur une API Node.js/Express connectée à une base de données SQLite.



\---



\## 🚨 Scénario de Panne (Incident SQLITE\_MISUSE)



\### Description de l'incident

Une panne critique a été identifiée sur le point d'accès (endpoint) `GET /api/users`. Le serveur démarre normalement et l'interface Swagger est accessible, mais toute tentative de récupération des données se solde par une erreur système.



\### Diagnostic

\* \*\*Erreur renvoyée\*\* : `500 Internal Server Error`\[cite: 1].

\* \*\*Message terminal\*\* : `SQLITE\_MISUSE: Database is closed`\[cite: 1].

\* \*\*Cause identifiée\*\* : Une rupture de flux asynchrone provoquée par une fermeture prématurée de la connexion à la base de données (`db.close()`) avant l'exécution de la requête SQL\[cite: 1].



\### Reproduction de la panne

1\. Lancer le serveur : `node server.js`.

2\. Accéder à Swagger : `http://localhost:3000/api-docs`.

3\. Exécuter la requête `GET /api/users`.

4\. Constater le crash partiel de la route dans les logs\[cite: 1].



\---



\## 🛠️ Solution : Mise en place d'un Middleware de Résilience



Au lieu d'une simple correction de syntaxe, la solution retenue consiste à sécuriser l'architecture de l'API pour prévenir ce type de comportement à l'avenir\[cite: 1].



\### 1. Création d'un Middleware de Santé (Health Check)

J'ai implémenté une fonction intermédiaire qui vérifie l'état de l'objet de connexion `db` avant d'autoriser l'accès aux routes CRUD\[cite: 1].

```javascript

const checkDatabaseState = (req, res, next) => {

&#x20;   if (!db || !db.open) {

&#x20;       return res.status(503).json({

&#x20;           error: "Service Unavailable",

&#x20;           message: "La connexion à la base de données a été perdue."

&#x20;       });

&#x20;   }

&#x20;   next();

};

