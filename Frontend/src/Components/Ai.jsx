import { useState, useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import "./Ai.css";
import { FaArrowUp } from "react-icons/fa";
import { RiPauseCircleFill } from "react-icons/ri";

const Ai = () => {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessages] = useState([]);
  const messagesEndRef = useRef(null);

  // Scroll to bottom when response updates
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [message]);

  // ✅ Ask AI function
  const handleAsk = async () => {
    if (!prompt.trim()) return;

    const userMessage = prompt;

    // ✅ 1. Add USER message immediately
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
    setPrompt("");
    setLoading(true);
    try {
      const res = await fetch("https://ai-assistant-rdo9.onrender.com/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMessage }),
      });

      const data = await res.json();

      const cleanText = (data.reply || "No response from AI").trimStart();

      // ✅ 2. Create EMPTY AI message for typing
      setMessages((prev) => [...prev, { role: "ai", content: "" }]);

      let currentText = "";

      // ✅ 3. Typing animation into LAST ai message
      for (let i = 0; i < cleanText.length; i++) {
        currentText += cleanText[i];

        setMessages((prev) => {
          const updated = [...prev];
          updated[updated.length - 1].content = currentText;
          return updated;
        });

        await new Promise((r) => setTimeout(r, 10));
      }
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { role: "ai", content: "❌ Error connecting to backend." },
      ]);
    }

    setLoading(false);
  };

  // ✅ Handle Enter key to send
  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleAsk();
    }
  };

  // ✅ Auto-resize textarea
  const handleTextareaChange = (e) => {
    setPrompt(e.target.value);

    // Auto-resize
    e.target.style.height = "auto";
    e.target.style.height = Math.min(e.target.scrollHeight, 200) + "px";
  };

  return (
    <div id="Assistant">
      {/* ✅ Response Section - Moved to top for proper layout */}
      <div className="response-container">
        {message.map((msg, index) => (
          <div
            key={index}
            className={msg.role === "user" ? "user-message" : "ai-response"}
          >
            <h3>{msg.role === "user" ? "🧑 You:" : "💭 AI Response:"}</h3>

            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {msg.content}
            </ReactMarkdown>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* ✅ Input Textarea */}
      <textarea
        rows="1"
        placeholder="AI Assistant..."
        value={prompt}
        onChange={handleTextareaChange}
        onKeyDown={handleKeyPress}
        disabled={loading}
      />

      {/* ✅ Ask Button */}
      <button
        onClick={handleAsk}
        disabled={loading || !prompt.trim()}
        className={!prompt.trim() ? "blurred" : ""}
      >
        {loading ? <RiPauseCircleFill /> : <FaArrowUp />}
      </button>
    </div>
  );
};

export default Ai;
