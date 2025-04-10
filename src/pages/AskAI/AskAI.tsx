import { useState, useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import axios from "axios";
import "../AskAI/ask-ai.css";

interface Message {
    role: "user" | "assistant";
    content: string;
}

const AskAI = () => {
    const [question, setQuestion] = useState("");
    const [messages, setMessages] = useState<Message[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const chatEndRef = useRef<HTMLDivElement>(null);

    const handleAsk = async () => {
        if (!question.trim()) {
            setError("Digite sua pergunta...");
            return;
        }

        setError("");
        setLoading(true);

        const newMessages = [...messages, { role: "user", content: question } as const];
        setMessages(newMessages);
        setQuestion("");

        try {
            const response = await axios.post("http://localhost:3000/agroSync/ask-ai", {
                question,
            });

            setMessages([
                ...newMessages,
                { role: "assistant", content: response.data.answer },
            ]);
        } catch (err) {
            console.error(err);
            setError("Algo deu errado. Tente novamente!");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, loading]);

    return (
        <div className="chat-container">
            <h1 className="chat-title">Pergunte sobre sua plantação 🌿</h1>
            <div className="chat-box">
                {messages.map((msg, index) => (
                    <div
                        key={index}
                        className={`chat-message ${msg.role === "user" ? "user" : "assistant"}`}
                    >
                        <ReactMarkdown>{msg.content}</ReactMarkdown>
                    </div>
                ))}
                {loading && (
                    <div className="chat-message assistant">
                        <span className="typing">Digitando...</span>
                    </div>
                )}
                <div ref={chatEndRef} />
            </div>

            <div className="chat-input-area">
                <textarea
                    className="chat-input"
                    rows={2}
                    placeholder="Digite sua dúvida..."
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                />
                <button
                    className="chat-button"
                    onClick={handleAsk}
                    disabled={loading}
                >
                    Enviar
                </button>
            </div>

            {error && <p className="chat-error">{error}</p>}
        </div>
    );
};

export default AskAI;
