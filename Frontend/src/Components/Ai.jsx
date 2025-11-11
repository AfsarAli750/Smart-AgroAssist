import { useState, useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import "./Ai.css";
import { FaArrowUp } from "react-icons/fa";
import { RiPauseCircleFill } from "react-icons/ri";

const Ai = () => {
  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // Scroll to bottom when response updates
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [response]);

  // ✅ Ask AI function
  const handleAsk = async () => {
    if (!prompt.trim()) return;
    setLoading(true);
    setResponse("");

    try {
      const res = await fetch("https://ai-assistant-rdo9.onrender.com/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: prompt }),
      });

      const data = await res.json();

      if (res.ok) {
        const cleanText = (data.reply || "No response from AI").trimStart();

        // ✅ Smooth typing animation
        let currentText = "";
        for (let i = 0; i < cleanText.length; i++) {
          currentText += cleanText[i];
          setResponse(currentText);
          await new Promise((r) => setTimeout(r, 10)); // Reduced delay for better UX
        }
      } else {
        setResponse(`❌ Error: ${data.error || "Unknown error"}`);
      }
    } catch (err) {
      console.error(err);
      setResponse("❌ Error connecting to backend. Please try again later.");
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
      {response && (
        <div className="response-container">
          <div className="ai-response">
            <h3>🧠 AI Response:</h3>
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {response}
            </ReactMarkdown>
          </div>
          <div ref={messagesEndRef} /> {/* For scrolling */}
        </div>
      )}

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
