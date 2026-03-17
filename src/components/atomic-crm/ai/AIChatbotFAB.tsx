import { useState } from "react";
import { useGetList } from "ra-core";
import { Bot, X, Send, Loader2, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { chatWithCRMData, hasAIProvider } from "../ai/aiService";
import type { Contact } from "../types";

interface Message {
  role: "user" | "assistant";
  text: string;
}

/**
 * Floating AI Chatbot — bottom-right FAB.
 * Allows asking questions about your CRM data in natural language.
 */
export const AIChatbotFAB = () => {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);

  // Load a summary of contacts for context
  const { data: contacts } = useGetList<Contact>("contacts", {
    pagination: { page: 1, perPage: 100 },
    sort: { field: "last_seen", order: "DESC" },
  });

  const buildContext = () => {
    if (!contacts?.length) return "אין נתוני קשרים זמינים.";
    const sample = contacts.slice(0, 50);
    return `יש ${contacts.length} אנשי קשר במערכת. לדוגמה:\n` +
      sample.map(c =>
        `- ${c.first_name} ${c.last_name} | ${c.title || ""} | ${c.department || ""} | ציון: ${c.priority || "לא מדורג"}`
      ).join("\n");
  };

  const handleSend = async () => {
    if (!input.trim() || loading) return;
    const userMsg = input.trim();
    setInput("");
    setMessages(prev => [...prev, { role: "user", text: userMsg }]);
    setLoading(true);
    try {
      const answer = await chatWithCRMData(userMsg, buildContext());
      setMessages(prev => [
        ...prev,
        { role: "assistant", text: answer || "לא הצלחתי לענות. נסה שוב." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (!hasAIProvider()) return null;

  return (
    <div className="fixed bottom-6 left-6 z-50 flex flex-col items-end gap-3">
      {open && (
        <div className="w-80 rounded-2xl border bg-background shadow-2xl flex flex-col overflow-hidden"
          style={{ maxHeight: "480px" }}>
          {/* Header */}
          <div className="flex items-center gap-2 px-4 py-3 bg-primary text-primary-foreground">
            <Bot className="size-5" />
            <span className="font-semibold text-sm flex-1">AI עוזר CRM</span>
            <button onClick={() => setOpen(false)} className="opacity-70 hover:opacity-100">
              <ChevronDown className="size-5" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-3 space-y-3 min-h-48 max-h-72">
            {messages.length === 0 && (
              <p className="text-xs text-muted-foreground text-center pt-4">
                שאל אותי על אנשי הקשר שלך.<br />
                לדוגמה: "כמה פרופסורים יש?" או "מי טרם קיבל מייל?"
              </p>
            )}
            {messages.map((msg, i) => (
              <div key={i}
                className={`text-sm rounded-xl px-3 py-2 max-w-72 ${
                  msg.role === "user"
                    ? "bg-primary text-primary-foreground mr-auto"
                    : "bg-muted text-foreground ml-auto"
                }`}
              >
                {msg.text}
              </div>
            ))}
            {loading && (
              <div className="bg-muted rounded-xl px-3 py-2 ml-auto max-w-24 flex justify-center">
                <Loader2 className="size-4 animate-spin text-muted-foreground" />
              </div>
            )}
          </div>

          {/* Input */}
          <div className="border-t p-3 flex gap-2">
            <Textarea
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKey}
              placeholder="שאל שאלה..."
              rows={1}
              className="resize-none text-sm min-h-9"
              dir="rtl"
            />
            <Button size="icon" onClick={handleSend} disabled={!input.trim() || loading} className="shrink-0">
              <Send className="size-4" />
            </Button>
          </div>
        </div>
      )}

      {/* FAB Button */}
      <Button
        onClick={() => setOpen(o => !o)}
        size="icon"
        className="size-14 rounded-full shadow-lg"
        title="פתח עוזר AI"
      >
        {open ? <X className="size-6" /> : <Bot className="size-6" />}
      </Button>
    </div>
  );
};
