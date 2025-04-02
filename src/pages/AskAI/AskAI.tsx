import { useState } from "react";
import axios from "axios";
import "../AskAI/ask-ai.css";

const AskAI = () => {
    const [question, setQuestion] = useState("");
    const [answer, setAnswer] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleAsk = async () => {
        if (!question.trim()) {
            setError("Digite sua pergunta...");
            return;
        }

        setLoading(true);
        setError("");
        setAnswer("");

        try {
            const response = await axios.post("http://localhost:3000/agroSync/ask-ai", {
                question,
            });

            setAnswer(response.data.answer);
        } catch (err) {
            setError("Algo deu errado. Tente novamente!");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="ask-ai-container">
            <div className="ask-ai-box">
                <h1 className="ask-ai-title">Pergunte sobre sua plantação 🌱</h1>
                <textarea
                    className="ask-ai-textarea"
                    rows={3}
                    placeholder="Digite sua dúvida..."
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                />
                <button
                    className="ask-ai-button"
                    onClick={handleAsk}
                    disabled={loading}
                >
                    {loading ? "Consultando a IA..." : "Perguntar"}
                </button>
                {error && <p className="ask-ai-error">{error}</p>}
                {answer && <div className="ask-ai-answer">{answer}</div>}
            </div>
        </div>
    );
};

export default AskAI;
