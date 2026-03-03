import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, X, Image, Sparkles, Download, Loader2, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";

type GenerateState = "idle" | "uploading" | "processing" | "generating" | "complete";

const exampleSketches = [
  "/assets/example-sketch-1.jpg",
  "/assets/example-sketch-2.jpg",
  "/assets/example-sketch-3.jpg",
];

const stageLabels: Record<GenerateState, string> = {
  idle: "",
  uploading: "Uploading sketch...",
  processing: "Processing image...",
  generating: "Generating photo...",
  complete: "Complete!",
};

const stageProgress: Record<GenerateState, number> = {
  idle: 0,
  uploading: 25,
  processing: 50,
  generating: 75,
  complete: 100,
};

const UploadInterface = () => {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [result, setResult] = useState<string | null>(null);
  const [state, setState] = useState<GenerateState>("idle");
  const { toast } = useToast();

  const onDrop = useCallback((accepted: File[]) => {
    const f = accepted[0];
    if (!f) return;
    if (f.size > 10 * 1024 * 1024) {
      toast({ title: "File too large", description: "Please upload an image under 10MB", variant: "destructive" });
      return;
    }
    setFile(f);
    setPreview(URL.createObjectURL(f));
    setResult(null);
    setState("idle");
  }, [toast]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [".png", ".jpg", ".jpeg"] },
    maxFiles: 1,
  });

  const clearFile = () => {
    setFile(null);
    setPreview(null);
    setResult(null);
    setState("idle");
  };

  const loadExample = async (url: string) => {
    try {
      const res = await fetch(url);
      const blob = await res.blob();
      const f = new File([blob], `example-${Date.now()}.jpg`, { type: blob.type || "image/jpeg" });
      setFile(f);
      setPreview(URL.createObjectURL(f));
      setResult(null);
      setState("idle");
    } catch {
      toast({ title: "Failed to load example", variant: "destructive" });
    }
  };

  const handleGenerate = async () => {
    if (!file) return;
    setState("uploading");
    try {
      const formData = new FormData();
      formData.append("sketch", file);
      setState("processing");
      const res = await fetch(`${import.meta.env.VITE_MODEL_API_URL}/generate`, {
        method: "POST",
        body: formData,
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.detail || `Server error: ${res.status}`);
      }
      setState("generating");
      const data = await res.json();
      setResult(data.image);
      setState("complete");
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : "Unknown error occurred";
      toast({ title: "Generation failed", description: message, variant: "destructive" });
      setState("idle");
    }
  };

  const handleDownload = () => {
    if (!result) return;
    const a = document.createElement("a");
    a.href = result;
    a.download = "sketchforge-result.png";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const isGenerating = state !== "idle" && state !== "complete";

  return (
    <section id="upload-section" className="py-20 px-6">
      <div className="container mx-auto max-w-5xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Left — Upload */}
          <div>
            <h2 className="text-xl font-bold text-foreground mb-4">Upload Your Sketch</h2>
            
            {!preview ? (
              <div
                {...getRootProps()}
                className={`relative flex flex-col items-center justify-center w-full aspect-square rounded-2xl border-2 border-dashed transition-all duration-300 cursor-pointer ${
                  isDragActive
                    ? "border-primary bg-primary/5 shadow-[0_0_30px_hsl(var(--primary)/0.12)]"
                    : "border-border hover:border-primary/40 bg-card"
                }`}
              >
                <input {...getInputProps()} aria-label="Upload sketch image" />
                <Upload className={`w-10 h-10 mb-4 transition-colors ${isDragActive ? "text-primary" : "text-muted-foreground"}`} />
                <p className="text-sm font-medium text-foreground">
                  Drag & drop your sketch here
                </p>
                <p className="text-xs text-muted-foreground mt-1">or click to browse</p>
                <span className="mt-4 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-muted text-xs text-muted-foreground font-medium">
                  PNG, JPG, JPEG · Max 10MB
                </span>
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                className="relative w-full aspect-square rounded-2xl overflow-hidden border border-border bg-card shadow-sm"
              >
                <img src={preview} alt="Uploaded sketch preview" className="w-full h-full object-cover" />
                <button
                  onClick={clearFile}
                  className="absolute top-3 right-3 w-8 h-8 rounded-full bg-foreground/70 text-card flex items-center justify-center hover:bg-foreground/90 transition-colors"
                  aria-label="Remove uploaded image"
                >
                  <X className="w-4 h-4" />
                </button>
                {file && (
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-foreground/60 to-transparent p-4">
                    <p className="text-card text-sm font-medium truncate">{file.name}</p>
                    <p className="text-card/70 text-xs">{(file.size / 1024).toFixed(0)} KB</p>
                  </div>
                )}
              </motion.div>
            )}

            <div className="mt-5">
              <p className="text-sm text-muted-foreground mb-2.5">Or try an example:</p>
              <div className="flex gap-3">
                {exampleSketches.map((src, i) => (
                  <button
                    key={i}
                    onClick={() => loadExample(src)}
                    className="w-16 h-16 rounded-xl overflow-hidden border-2 border-border hover:border-primary/50 transition-all duration-200 hover:scale-105"
                    aria-label={`Load example sketch ${i + 1}`}
                  >
                    <img src={src} alt={`Example sketch ${i + 1}`} className="w-full h-full object-cover" loading="lazy" />
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right — Result */}
          <div>
            <h2 className="text-xl font-bold text-foreground mb-4">Generated Photo</h2>
            <div className="relative w-full aspect-square rounded-2xl border border-border bg-card overflow-hidden">
              <AnimatePresence mode="wait">
                {!result && state === "idle" && (
                  <motion.div
                    key="empty"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex flex-col items-center justify-center h-full text-muted-foreground"
                  >
                    <Image className="w-10 h-10 mb-3 opacity-40" />
                    <p className="text-sm">Your result will appear here</p>
                  </motion.div>
                )}

                {isGenerating && (
                  <motion.div
                    key="loading"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex flex-col items-center justify-center h-full"
                  >
                    <div className="w-3/4 h-3/4 rounded-xl bg-gradient-to-r from-muted via-muted-foreground/10 to-muted bg-[length:200%_100%] animate-shimmer" />
                    <p className="mt-4 text-sm text-muted-foreground font-medium">
                      {stageLabels[state]}
                    </p>
                  </motion.div>
                )}

                {result && state === "complete" && (
                  <motion.img
                    key="result"
                    src={result}
                    alt="AI generated photo result"
                    className="w-full h-full object-cover"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                  />
                )}
              </AnimatePresence>
            </div>

            {result && (
              <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="mt-4">
                <Button
                  onClick={handleDownload}
                  variant="outline"
                  className="w-full gap-2 border-border hover:border-primary/30"
                >
                  <Download className="w-4 h-4" />
                  Download Result
                </Button>
              </motion.div>
            )}
          </div>
        </div>

        {/* Generate Button */}
        <div className="mt-10 flex flex-col items-center gap-4">
          <motion.div whileHover={!isGenerating && preview ? { scale: 1.02 } : {}} whileTap={!isGenerating && preview ? { scale: 0.98 } : {}}>
            <Button
              onClick={handleGenerate}
              disabled={!file || isGenerating}
              size="lg"
              className="px-10 py-6 text-base font-semibold gap-2.5 bg-primary text-primary-foreground hover:bg-primary/90 shadow-[0_4px_14px_hsl(var(--primary)/0.3)] hover:shadow-[0_6px_20px_hsl(var(--primary)/0.4)] disabled:shadow-none transition-all duration-200"
            >
              {state === "idle" && <Sparkles className="w-5 h-5" />}
              {isGenerating && <Loader2 className="w-5 h-5 animate-spin" />}
              {state === "complete" && (
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 500 }}>
                  <Check className="w-5 h-5" />
                </motion.div>
              )}
              {state === "idle" && "Generate Photo"}
              {isGenerating && "Generating..."}
              {state === "complete" && "Generated!"}
            </Button>
          </motion.div>

          {/* Progress bar */}
          <AnimatePresence>
            {(isGenerating || state === "complete") && (
              <motion.div
                initial={{ opacity: 0, width: "60%" }}
                animate={{ opacity: 1, width: "100%" }}
                exit={{ opacity: 0 }}
                className="w-full max-w-md"
              >
                <Progress value={stageProgress[state]} className="h-1.5" />
                <div className="flex justify-between mt-2 text-[11px] text-muted-foreground">
                  {(["uploading", "processing", "generating", "complete"] as const).map((s) => (
                    <span
                      key={s}
                      className={`transition-colors ${
                        stageProgress[state] >= stageProgress[s] ? "text-primary font-medium" : ""
                      }`}
                    >
                      {s === "complete" ? "Complete" : s.charAt(0).toUpperCase() + s.slice(1)}
                    </span>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};

export default UploadInterface;
