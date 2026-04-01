import { useState, useEffect } from "react";
import { db } from "./firebase";
import { collection, addDoc, getDocs, deleteDoc, doc, serverTimestamp } from "firebase/firestore";
import "./App.css";

function App() {
  const [note, setNote] = useState("");
  const [notes, setNotes] = useState([]);
  const [message, setMessage] = useState("");

  const notesCollection = collection(db, "notes");

  const fetchNotes = async () => {
    try {
      const data = await getDocs(notesCollection);
      setNotes(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    } catch (error) {
      console.error("Error fetching notes:", error);
    }
  };

  const addNote = async () => {
    try {
      await addDoc(notesCollection, { text: note, createdAt: serverTimestamp() });
      setNote("");
      setMessage("✅ Note saved successfully!");
      setTimeout(() => setMessage(""), 2000);
      fetchNotes();
    } catch (error) {
      console.error("Error adding note:", error);
      setMessage("❌ Error saving note!");
      setTimeout(() => setMessage(""), 2000);
    }
  };

  const deleteNote = async (id) => {
    try {
      const noteDoc = doc(db, "notes", id);
      await deleteDoc(noteDoc);
      setMessage("🗑️ Note deleted!");
      setTimeout(() => setMessage(""), 2000);
      fetchNotes();
    } catch (error) {
      console.error("Error deleting note:", error);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  return (
    <div className="container">
      <h1>📝 My Notes App</h1>
      <p>Store your notes in the cloud!</p>
      {message && <p className="message">{message}</p>}
      <div className="input-section">
        <input
          type="text"
          placeholder="What's on your mind?"
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />
        <button onClick={addNote}>Add Note</button>
      </div>
      <h2>Your Notes ({notes.length})</h2>
      <div className="notes">
        {notes.map((n) => (
          <div key={n.id} className="note">
            <p>{n.text}</p>
            <button className="delete" onClick={() => deleteNote(n.id)}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;