

// const express = require('express');
// const bodyParser = require('body-parser');
// const cors = require('cors');
// require('dotenv').config();
// const { Pool } = require('pg');

// const app = express();
// const port = 3050;

// app.use(cors());
// app.use(bodyParser.json());

// const pool = new Pool({
//     user: process.env.DB_USER,
//     host: process.env.DB_HOST,
//     database: process.env.DB_NAME,
//     password: process.env.DB_PASSWORD,
//     port: process.env.DB_PORT,
// });

// const checkDBConnection = async () => {
//     let retries = 5;
//     while (retries) {
//         try {
//             await pool.query("SELECT 1");
//             console.log("✅ DB Verbindung erfolgreich!");
//             return;
//         } catch (err) {
//             console.log(`⏳ Warte auf Datenbank... (${retries} Versuche übrig)`);
//             retries--;
//             await new Promise((res) => setTimeout(res, 5000));
//         }
//     }
//     console.error("❌ Keine Verbindung zur Datenbank!");
//     process.exit(1);
// };

// const createTable = async () => {
//     const client = await pool.connect();
//     try {
//         await client.query(`
//             CREATE TABLE IF NOT EXISTS messages (
//                 id SERIAL PRIMARY KEY,
//                 name VARCHAR(50) NULL,
//                 text TEXT NOT NULL,
//                 created_at TIMESTAMP DEFAULT NOW()
//             );
//         `);
//         console.log("✅ Table 'messages' bereit!");
//     } catch (err) {
//         console.error("❌ Fehler beim Erstellen der Tabelle:", err);
//     } finally {
//         client.release();
//     }
// };

// checkDBConnection().then(createTable);

// app.get('/', (req, res) => {
//     res.send('Willkommen im Gästebuch-Backend!');
// });

// app.get('/liste_abrufen', async (req, res) => {
//     try {
//         const result = await pool.query('SELECT * FROM messages ORDER BY created_at DESC');
//         res.json(result.rows);
//     } catch (error) {
//         console.error("Fehler beim Abrufen der Liste:", error);
//         res.status(500).json({ error: "Fehler beim Laden der Einträge" });
//     }
// });

// app.post('/add', async (req, res) => {
//     try {
//         const { name, text } = req.body;
//         const result = await pool.query(
//             'INSERT INTO messages (name, text) VALUES ($1, $2) RETURNING *',
//             [name || null, text]
//         );
//         res.json(result.rows[0]);
//     } catch (error) {
//         console.error("Fehler beim Hinzufügen:", error);
//         res.status(500).json({ error: "Fehler beim Speichern" });
//     }
// });

// app.delete('/delete/:id', async (req, res) => {
//     try {
//         const result = await pool.query('DELETE FROM messages WHERE id = $1 RETURNING *', [req.params.id]);
//         res.json(result.rows);
//     } catch (error) {
//         console.error("Fehler beim Löschen:", error);
//         res.status(500).json({ error: "Fehler beim Löschen" });
//     }
// });

// app.listen(port, "0.0.0.0", () => {
//     console.log(`🚀 Server läuft auf http://localhost:${port}`);
// });



// Importieren der benötigten Module
const express = require('express');   // Express.js für den Server
const bodyParser = require('body-parser');  // Middleware zum Verarbeiten von JSON-Anfragen
const cors = require('cors');  // Erlaubt Anfragen von anderen Domains (CORS)
require('dotenv').config();  // Lädt Umgebungsvariablen aus der .env-Datei
const { Pool } = require('pg');  // PostgreSQL-Datenbankverbindung

// Erstellen einer Express-Anwendung
const app = express();
const port = 3050;  // Der Server läuft auf Port 3050

// Middleware für CORS und JSON-Daten
app.use(cors());  // Erlaubt Cross-Origin-Requests (z. B. von einer anderen Webseite)
app.use(bodyParser.json());  // Erlaubt das Parsen von JSON-Daten im Request-Body

// Verbindung zur PostgreSQL-Datenbank herstellen
const pool = new Pool({
    user: process.env.DB_USER,  // Benutzername aus der .env-Datei
    host: process.env.DB_HOST,  // Hostname (z. B. localhost)
    database: process.env.DB_NAME,  // Name der Datenbank
    password: process.env.DB_PASSWORD,  // Passwort für die Datenbank
    port: process.env.DB_PORT,  // Port für die Datenbankverbindung
});

// Funktion zur Überprüfung der Datenbankverbindung mit Wiederholungsversuchen
const checkDBConnection = async () => {
    let retries = 5;  // Anzahl der maximalen Versuche
    while (retries) {
        try {
            await pool.query("SELECT 1");  // Testabfrage an die Datenbank
            console.log("✅ DB Verbindung erfolgreich!");
            return;
        } catch (err) {
            console.log(`⏳ Warte auf Datenbank... (${retries} Versuche übrig)`);
            retries--;  // Einen Versuch abziehen
            await new Promise((res) => setTimeout(res, 5000));  // 5 Sekunden warten
        }
    }
    console.error("❌ Keine Verbindung zur Datenbank!");
    process.exit(1);  // Server beenden, wenn keine Verbindung möglich ist
};

// Funktion zum Erstellen der Tabelle, falls sie nicht existiert
const createTable = async () => {
    const client = await pool.connect();  // Verbindung zur Datenbank herstellen
    try {
        await client.query(`
            CREATE TABLE IF NOT EXISTS messages (
                id SERIAL PRIMARY KEY,  -- Automatische ID (wird automatisch hochgezählt)
                name VARCHAR(50) NULL,  -- Name des Benutzers (kann leer sein)
                text TEXT NOT NULL,  -- Die Nachricht (muss vorhanden sein)
                created_at TIMESTAMP DEFAULT NOW()  -- Zeitstempel mit Standardwert 'Jetzt'
            );
        `);
        console.log("✅ Table 'messages' bereit!");
    } catch (err) {
        console.error("❌ Fehler beim Erstellen der Tabelle:", err);
    } finally {
        client.release();  // Verbindung zur Datenbank freigeben
    }
};

// Erst Verbindung prüfen, dann die Tabelle erstellen
checkDBConnection().then(createTable);

// Standardroute (Startseite)
app.get('/', (req, res) => {
    res.send('Willkommen im Gästebuch-Backend!');  // Antwortet mit einer Willkommensnachricht
});

// Route zum Abrufen aller Nachrichten
app.get('/liste_abrufen', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM messages ORDER BY created_at DESC');  
        // Holen aller Nachrichten, sortiert nach Datum (neueste zuerst)
        res.json(result.rows);  // Rückgabe der Nachrichten als JSON
    } catch (error) {
        console.error("Fehler beim Abrufen der Liste:", error);
        res.status(500).json({ error: "Fehler beim Laden der Einträge" });
    }
});

// Route zum Hinzufügen einer neuen Nachricht
app.post('/add', async (req, res) => {
    try {
        const { name, text } = req.body;  // Daten aus dem Request-Body extrahieren
        const result = await pool.query(
            'INSERT INTO messages (name, text) VALUES ($1, $2) RETURNING *', 
            [name || null, text]  // Falls kein Name angegeben ist, wird NULL gespeichert
        );
        res.json(result.rows[0]);  // Rückgabe der gespeicherten Nachricht als JSON
    } catch (error) {
        console.error("Fehler beim Hinzufügen:", error);
        res.status(500).json({ error: "Fehler beim Speichern" });
    }
});

// Route zum Löschen einer Nachricht anhand der ID
app.delete('/delete/:id', async (req, res) => {
    try {
        const result = await pool.query('DELETE FROM messages WHERE id = $1 RETURNING *', 
            [req.params.id]  // Die ID aus der URL wird als Parameter genutzt
        );
        res.json(result.rows);  // Rückgabe der gelöschten Nachricht als JSON
    } catch (error) {
        console.error("Fehler beim Löschen:", error);
        res.status(500).json({ error: "Fehler beim Löschen" });
    }
});

// Starten des Servers
app.listen(port, "0.0.0.0", () => {
    console.log(`🚀 Server läuft auf http://localhost:${port}`);
});
