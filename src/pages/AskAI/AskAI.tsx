import { useState, useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import api from '../../service/api';
import { Send, Bot, User, Leaf, AlertCircle } from 'lucide-react';

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
    if (!question.trim()) { setError("Digite sua pergunta..."); return; }
    setError("");
    setLoading(true);
    const newMessages = [...messages, { role: "user", content: question } as const];
    setMessages(newMessages);
    setQuestion("");
    try {
      const response = await api.post("/ask-ai", { question });
      setMessages([...newMessages, { role: "assistant", content: response.data.answer }]);
    } catch {
      setError("Algo deu errado. Tente novamente!");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleAsk(); }
  };

  useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, loading]);

  return (
    <div className="flex flex-col h-[calc(100vh-130px)] max-h-[780px] animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-3 mb-5">
        <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center">
          <Leaf size={20} className="text-emerald-600" />
        </div>
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">Assistente AgroSync</h1>
          <p className="text-xs text-slate-500">Pergunte sobre sua plantação, cultivo ou manejo</p>
        </div>
      </div>

      {/* Chat window */}
      <div className="flex-1 overflow-y-auto bg-slate-50 rounded-xl border border-slate-200 p-4 flex flex-col gap-4">
        {messages.length === 0 && !loading && (
          <div className="flex flex-col items-center justify-center flex-1 text-center gap-3 py-12 text-slate-400">
            <Bot size={40} className="text-slate-300" />
            <p className="text-sm font-medium">Nenhuma conversa ainda.<br />Faça sua primeira pergunta!</p>
          </div>
        )}

        {messages.map((msg, i) => (
          <div key={i} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0
              ${msg.role === 'user' ? 'bg-emerald-500 text-white' : 'bg-white border border-slate-200 text-slate-600'}`}>
              {msg.role === 'user' ? <User size={15} /> : <Bot size={15} />}
            </div>
            <div className={`max-w-[78%] px-4 py-3 rounded-2xl text-sm leading-relaxed
              ${msg.role === 'user'
                ? 'bg-emerald-500 text-white rounded-tr-sm'
                : 'bg-white border border-slate-200 text-slate-800 rounded-tl-sm shadow-sm'}`}>
              <div className="prose prose-sm max-w-none prose-p:my-1">
                <ReactMarkdown>{msg.content}</ReactMarkdown>
              </div>
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-full flex items-center justify-center bg-white border border-slate-200 text-slate-600">
              <Bot size={15} />
            </div>
            <div className="px-4 py-3 bg-white border border-slate-200 rounded-2xl rounded-tl-sm shadow-sm">
              <div className="flex gap-1.5">
                <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{animationDelay:'0ms'}} />
                <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{animationDelay:'150ms'}} />
                <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{animationDelay:'300ms'}} />
              </div>
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Error */}
      {error && (
        <div className="flex items-center gap-2 mt-2 px-3 py-2 bg-red-50 border border-red-200 text-red-600 text-xs font-medium rounded-lg">
          <AlertCircle size={14} /> {error}
        </div>
      )}

      {/* Input area */}
      <div className="flex gap-3 mt-3">
        <textarea
          rows={2}
          placeholder="Digite sua dúvida... (Enter para enviar)"
          value={question}
          onChange={e => setQuestion(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={loading}
          className="flex-1 px-4 py-3 rounded-xl border border-slate-200 bg-white text-sm text-slate-900 resize-none focus:outline-none focus:ring-2 focus:ring-emerald-400 transition disabled:opacity-60"
        />
        <button onClick={handleAsk} disabled={loading || !question.trim()}
          className="self-end px-5 py-3 bg-emerald-500 text-white font-semibold text-sm rounded-xl hover:bg-emerald-600 transition shadow-sm disabled:opacity-50 flex items-center gap-2">
          <Send size={16} /> Enviar
        </button>
      </div>
    </div>
  );
};

export default AskAI;
