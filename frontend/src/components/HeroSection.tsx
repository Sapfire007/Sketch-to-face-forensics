import { motion } from "framer-motion";
import { ArrowDown } from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

const samplePairs = [
  { sketch: "/assets/sketch-1.jpg", photo: "/assets/photo-1.png" },
  { sketch: "/assets/sketch-2.jpg", photo: "/assets/photo-2.png" },
  { sketch: "/assets/sketch-3.jpg", photo: "/assets/photo-3.jpeg" },
];

const HeroSection = () => {
  const [currentPair, setCurrentPair] = useState(0);
  const [sliderPos, setSliderPos] = useState(50);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      if (!isDragging) {
        setCurrentPair((p) => (p + 1) % samplePairs.length);
        setSliderPos(50);
      }
    }, 5000);
    return () => clearInterval(interval);
  }, [isDragging]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const pos = ((e.clientX - rect.left) / rect.width) * 100;
    setSliderPos(Math.max(5, Math.min(95, pos)));
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const pos = ((e.touches[0].clientX - rect.left) / rect.width) * 100;
    setSliderPos(Math.max(5, Math.min(95, pos)));
  };

  const scrollToUpload = () => {
    document.getElementById("upload-section")?.scrollIntoView({ behavior: "smooth" });
  };

  const pair = samplePairs[currentPair];

  return (
    <section className="relative pt-32 pb-20 px-6 overflow-hidden noise-overlay">
      <div className="absolute inset-0 bg-gradient-to-b from-primary/[0.03] to-transparent pointer-events-none" />
      
      <div className="container mx-auto text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-foreground leading-[1.1] max-w-3xl mx-auto">
            Transform Your Sketches Into{" "}
            <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              Photorealistic Images
            </span>
          </h1>
          <p className="mt-6 text-lg sm:text-xl text-muted-foreground max-w-xl mx-auto leading-relaxed">
            Powered by deep learning. Upload a sketch, get a photo in seconds.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="mt-12 max-w-lg mx-auto"
        >
          <div
            className="relative w-full aspect-square rounded-2xl overflow-hidden shadow-[0_25px_60px_-12px_hsl(var(--primary)/0.15)] border border-border/50 cursor-ew-resize select-none"
            onMouseDown={() => setIsDragging(true)}
            onMouseUp={() => setIsDragging(false)}
            onMouseLeave={() => setIsDragging(false)}
            onMouseMove={handleMouseMove}
            onTouchStart={() => setIsDragging(true)}
            onTouchEnd={() => setIsDragging(false)}
            onTouchMove={handleTouchMove}
            role="slider"
            aria-label="Before and after comparison slider"
            aria-valuenow={Math.round(sliderPos)}
          >
            <img
              src={pair.photo}
              alt="AI generated photo"
              className="absolute inset-0 w-full h-full object-cover"
              loading="lazy"
            />
            <div
              className="absolute inset-0 overflow-hidden"
              style={{ width: `${sliderPos}%` }}
            >
              <img
                src={pair.sketch}
                alt="Original sketch"
                className="absolute inset-0 w-full h-full object-cover"
                style={{ width: `${(100 / sliderPos) * 100}%`, maxWidth: "none" }}
                loading="lazy"
              />
            </div>
            <div
              className="absolute top-0 bottom-0 w-1 bg-card shadow-lg z-10"
              style={{ left: `${sliderPos}%`, transform: "translateX(-50%)" }}
            >
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-card shadow-lg border-2 border-primary flex items-center justify-center">
                <span className="text-primary text-xs font-bold">⇔</span>
              </div>
            </div>
            <div className="absolute top-3 left-3 px-2.5 py-1 rounded-md bg-foreground/70 text-card text-xs font-medium z-10">
              Sketch
            </div>
            <div className="absolute top-3 right-3 px-2.5 py-1 rounded-md bg-foreground/70 text-card text-xs font-medium z-10">
              Photo
            </div>
          </div>

          <div className="flex justify-center gap-2 mt-4">
            {samplePairs.map((_, i) => (
              <button
                key={i}
                onClick={() => { setCurrentPair(i); setSliderPos(50); }}
                className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                  i === currentPair ? "bg-primary scale-125" : "bg-border hover:bg-muted-foreground/40"
                }`}
                aria-label={`View example ${i + 1}`}
              />
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-10"
        >
          <Button
            onClick={scrollToUpload}
            size="lg"
            className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-[0_4px_14px_hsl(var(--primary)/0.3)] hover:shadow-[0_6px_20px_hsl(var(--primary)/0.4)] transition-all duration-200 text-base font-semibold px-8 gap-2"
          >
            Try It Now
            <ArrowDown className="w-4 h-4 animate-bounce" />
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
