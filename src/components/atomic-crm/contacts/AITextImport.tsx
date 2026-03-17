import { useState } from "react";
import { useCreate, useNotify } from "ra-core";
import { Brain, Loader2, CheckCircle, ClipboardPaste } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { parseBulkContactsFromText, hasAIProvider } from "../ai/aiService";

/**
 * AI-powered bulk contact import from pasted text (Excel, Word, email lists).
 * Parses free-form text into structured contacts and imports them to the CRM.
 */
export const AITextImport = () => {
  const [text, setText] = useState("");
  const [parsed, setParsed] = useState<any[]>([]);
  const [step, setStep] = useState<"input" | "preview" | "importing" | "done">("input");
  const [loading, setLoading] = useState(false);
  const [imported, setImported] = useState(0);
  const notify = useNotify();
  const [create] = useCreate();

  const hasKey = hasAIProvider();

  const handleParse = async () => {
    if (!text.trim()) return;
    setLoading(true);
    try {
      const contacts = await parseBulkContactsFromText(text);
      if (contacts.length === 0) {
        notify("לא נמצאו אנשי קשר בטקסט. נסה פורמט אחר.", { type: "warning" });
        return;
      }
      setParsed(contacts);
      setStep("preview");
    } catch {
      notify("שגיאה בניתוח AI. בדוק מפתח API.", { type: "error" });
    } finally {
      setLoading(false);
    }
  };

  const handleImport = async () => {
    setStep("importing");
    let count = 0;
    for (const c of parsed) {
      try {
        const [firstName, ...rest] = (c.first_name || c.name || "").split(" ");
        await create(
          "contacts",
          {
            data: {
              first_name: firstName || "לא ידוע",
              last_name: rest.join(" ") || c.last_name || "",
              title: c.title || "",
              department: c.department || "",
              background: c.notes || "",
              research_focus: c.research_focus || "",
              email_jsonb: c.email ? [{ email: c.email, type: "Work" }] : [],
              phone_jsonb: c.phone ? [{ number: c.phone, type: "Work" }] : [],
              tags: [],
              has_newsletter: false,
            },
          },
          { returnPromise: true }
        );
        count++;
        setImported(count);
      } catch {
        // Continue on single failure
      }
    }
    setStep("done");
    notify(`יובאו ${count} אנשי קשר בהצלחה`, { type: "success" });
  };

  const handleReset = () => {
    setText("");
    setParsed([]);
    setImported(0);
    setStep("input");
  };

  return (
    <Card className="mt-6 border-primary/20">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <Brain className="size-5 text-primary" />
          ייבוא AI מטקסט
          <Badge variant="outline" className="text-xs ml-auto">
            {hasKey ? "מוכן" : "דרוש מפתח API"}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {!hasKey && (
          <p className="text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded p-3">
            הגדר <code>VITE_GEMINI_API_KEY</code> ב-<code>.env.local</code> כדי להשתמש בייבוא AI.
          </p>
        )}

        {step === "input" && (
          <>
            <p className="text-sm text-muted-foreground">
              הדבק רשימת אנשי קשר מאקסל, מייל, או מסמך Word. ה-AI יזהה ויבנה את הנתונים אוטומטית.
            </p>
            <Textarea
              placeholder="שם | תפקיד | מחלקה | אימייל | טלפון&#10;דן כהן | פרופסור | מדעי המחשב | dan@bgu.ac.il | 050-1234567&#10;..."
              value={text}
              onChange={(e) => setText(e.target.value)}
              rows={8}
              className="font-mono text-sm"
              dir="ltr"
            />
            <div className="flex justify-end gap-2">
              <Button
                onClick={handleParse}
                disabled={!text.trim() || loading || !hasKey}
              >
                {loading ? (
                  <><Loader2 className="size-4 mr-2 animate-spin" />מנתח...</>
                ) : (
                  <><ClipboardPaste className="size-4 mr-2" />נתח עם AI</>
                )}
              </Button>
            </div>
          </>
        )}

        {step === "preview" && (
          <>
            <p className="text-sm">
              <span className="font-semibold text-primary">{parsed.length}</span> אנשי קשר זוהו — בדוק לפני הייבוא:
            </p>
            <div className="max-h-48 overflow-y-auto border rounded-lg divide-y text-sm">
              {parsed.map((c, i) => (
                <div key={i} className="px-3 py-2 flex gap-3">
                  <span className="font-medium min-w-32">{c.first_name} {c.last_name}</span>
                  <span className="text-muted-foreground truncate">{c.title} · {c.department}</span>
                </div>
              ))}
            </div>
            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={handleReset}>חזור</Button>
              <Button onClick={handleImport}>
                יבא {parsed.length} אנשי קשר
              </Button>
            </div>
          </>
        )}

        {step === "importing" && (
          <div className="text-center py-4">
            <Loader2 className="size-8 animate-spin mx-auto text-primary mb-2" />
            <p className="text-sm text-muted-foreground">מייבא... {imported}/{parsed.length}</p>
          </div>
        )}

        {step === "done" && (
          <div className="text-center py-4">
            <CheckCircle className="size-8 text-green-500 mx-auto mb-2" />
            <p className="text-sm font-medium">יובאו {imported} אנשי קשר בהצלחה!</p>
            <Button variant="outline" className="mt-3" onClick={handleReset}>ייבוא חדש</Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
