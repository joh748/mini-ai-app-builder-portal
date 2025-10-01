import { useState } from "react";
import styles from "../styles/global.css"

export default function ChatUI({ requirement, onUpdated }) {
  const [messages, setMessages] = useState(requirement.chatHistory || []);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);


  const sendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const newUserMsg = { role: "user", message: input };
    setMessages((prev) => [...prev, newUserMsg]);
    setLoading(true);

    try {
      const res = await fetch("http://localhost:5000/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          conversationId: requirement._id,
          message: input,
        }),
      });

      const updatedRequirement = await res.json();
      setMessages(updatedRequirement.chatHistory || []);
      onUpdated(updatedRequirement);

    } catch (err) {
      console.error("❌ Chat error:", err);
    } finally {
      setInput("");
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-2xl max-h-screen flex flex-col p-6 m-4 rounded-2xl shadow-lg bg-[var(--dark-blue-primary-color-1)]">
      <h2 className="text-2xl font-bold mb-4 text-[var(--nectar-accent-color)]">
        Requirement Chat
      </h2>

      <div className="flex-1 overflow-y-auto p-3 mb-4 rounded-lg
        bg-[var(--black-secondary-color-1)] text-[var(--white-primary-color-1)]">
        {messages.map((msg, idx) => (
          <div key={idx} className={`mb-2 ${msg.role === "user" ? "text-right" : "text-left"}`}>
            <span
              className={`inline-block px-3 py-2 rounded-lg ${
                msg.role === "user"
                  ? "bg-blue-500 text-white"
                  : "bg-[var(--dark-blue-primary-color-1)] text-gray-300"
              }`}
            >
              {msg.message}
            </span>
          </div>
        ))}
      </div>

      <form onSubmit={sendMessage} className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Refine requirements..."
          className="flex-1 p-3 rounded-lg border focus:outline-none
            border-[var(--nectar-accent-color)]
            bg-[var(--black-secondary-color-1)]
            text-[var(--white-primary-color-1)]"
        />
        <button
          type="submit"
          disabled={loading}
          className="py-2 px-4 rounded-lg font-semibold"
        >
          {loading ? "..." : "Send"}
        </button>
      </form>
    </div>
  );
}
