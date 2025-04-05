

// import { useEffect, useState } from "react";
// import "./App.css";

// function App() {
//   const [messages, setMessages] = useState([]);
//   const [name, setName] = useState("");
//   const [text, setText] = useState("");

//   useEffect(() => {
//     fetch("http://localhost:3050/liste_abrufen")
//       .then((res) => res.json())
//       .then((data) => {
//         const messagesWithAnimation = data.map((msg) => ({
//           ...msg,
//           animate: "fade-in",
//         }));
//         setMessages(messagesWithAnimation);
//       });
//   }, []);

//   const addMessage = () => {
//     if (!text.trim()) return;

//     fetch("http://localhost:3050/add", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ name, text }),
//     })
//       .then((res) => res.json())
//       .then((newMessage) => {
//         setMessages((prev) => [
//           ...prev,
//           { ...newMessage, animate: "fade-in" },
//         ]);
//       });

//     setName("");
//     setText("");
//   };

//   const deleteMessage = (id) => {
//     setMessages((prev) =>
//       prev.map((msg) =>
//         msg.id === id ? { ...msg, animate: "fade-out" } : msg
//       )
//     );

//     setTimeout(() => {
//       fetch(`http://localhost:3050/delete/${id}`, { method: "DELETE" }).then(
//         () => {
//           setMessages((prev) => prev.filter((msg) => msg.id !== id));
//         }
//       );
//     }, 1000); // Nach 1 Sekunde endgültig löschen
//   };

//   return (
//     <>
//       <h1>📖 Gästebuch</h1>
//       <div className="box">
//         <div className="box1">
//           <div className="box2">
//             <input
//               value={name}
//               onChange={(e) => setName(e.target.value)}
//               placeholder="Name (optional)"
//             />
//             <button id="hin" disabled={!text.trim()} onClick={addMessage}>
//               Hinzufügen
//             </button>
//           </div>
//           <textarea
//             value={text}
//             onChange={(e) => setText(e.target.value)}
//             placeholder="Nachricht eingeben..."
//           />
//         </div>
//       </div>

//       <div className="box3">
//         <ul>
//           {messages.map(({ id, name, text, created_at, animate }) => (
//             <li key={id} className={animate}>
//               <strong>{name || "Anonym"}:</strong> {text} <br />
//               <small>{new Date(created_at).toLocaleString()}</small>
//               <button onClick={() => deleteMessage(id)}>🗑 Löschen</button>
//             </li>
//           ))}
//         </ul>
//       </div>
//     </>
//   );
// }

// export default App;


import { useEffect, useState } from "react"; // Importiere React Hooks für den Status und Seiteneffekte
import "./App.css"; // Importiere die CSS-Datei für das Styling

function App() {
  // Definiere State-Variablen für Nachrichten, Name und Text
  const [messages, setMessages] = useState([]); // Liste aller Nachrichten
  const [name, setName] = useState(""); // Name des Benutzers (optional)
  const [text, setText] = useState(""); // Text der Nachricht

  // useEffect wird einmal beim Laden der Seite ausgeführt
  useEffect(() => {
    fetch("http://localhost:3050/liste_abrufen") // Anfrage an das Backend senden
      .then((res) => res.json()) // Antwort als JSON verarbeiten
      .then((data) => {
        // Animationseffekt für jede Nachricht hinzufügen
        const messagesWithAnimation = data.map((msg) => ({
          ...msg,
          animate: "fade-in", // CSS-Animation beim Erscheinen
        }));
        setMessages(messagesWithAnimation); // Nachrichten im State speichern
      });
  }, []); // Das leere Array sorgt dafür, dass es nur einmal beim Laden ausgeführt wird

  // Funktion zum Hinzufügen einer Nachricht
  const addMessage = () => {
    if (!text.trim()) return; // Falls der Text leer ist, keine Nachricht senden

    fetch("http://localhost:3050/add", {
      method: "POST", // HTTP-POST-Methode für das Senden von Daten
      headers: { "Content-Type": "application/json" }, // JSON-Header setzen
      body: JSON.stringify({ name, text }), // Nachrichtendaten in JSON umwandeln
    })
      .then((res) => res.json()) // Antwort verarbeiten
      .then((newMessage) => {
        // Neue Nachricht mit Animation hinzufügen
        setMessages((prev) => [
          ...prev,
          { ...newMessage, animate: "fade-in" },
        ]);
      });

    setName(""); // Name-Eingabe leeren
    setText(""); // Text-Eingabe leeren
  };

  // Funktion zum Löschen einer Nachricht
  const deleteMessage = (id) => {
    // Animation für das Entfernen der Nachricht setzen
    setMessages((prev) =>
      prev.map((msg) =>
        msg.id === id ? { ...msg, animate: "fade-out" } : msg
      )
    );

    setTimeout(() => {
      fetch(`http://localhost:3050/delete/${id}`, { method: "DELETE" }) // DELETE-Anfrage senden
        .then(() => {
          setMessages((prev) => prev.filter((msg) => msg.id !== id)); // Nachricht aus der Liste entfernen
        });
    }, 1000); // 1 Sekunde warten, bevor die Nachricht endgültig entfernt wird
  };

  return (
    <>
      <h1>📖 Gästebuch</h1>

      {/* Eingabeformular für Nachrichten */}
      <div className="box">
        <div className="box1">
          <div className="box2">
            <input
              value={name} // Wert aus dem State nehmen
              onChange={(e) => setName(e.target.value)} // Name aktualisieren
              placeholder="Name (optional)"
            />
            <button id="hin" disabled={!text.trim()} onClick={addMessage}>
              Hinzufügen
            </button>
          </div>
          <textarea
            value={text} // Wert aus dem State nehmen
            onChange={(e) => setText(e.target.value)} // Nachrichtentext aktualisieren
            placeholder="Nachricht eingeben..."
          />
        </div>
      </div>

      {/* Bereich für die angezeigten Nachrichten */}
      <div className="box3">
        <ul>
          {messages.map(({ id, name, text, created_at, animate }) => (
            <li key={id} className={animate}>
              <strong>{name || "Anonym"}:</strong> {text} <br />
              <small>{new Date(created_at).toLocaleString()}</small>
              <button onClick={() => deleteMessage(id)}>🗑 Löschen</button>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}

export default App; // Exportiere die App-Komponente

