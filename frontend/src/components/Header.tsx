import { useState, useEffect } from "react";
import { Pencil, Camera, Star } from "lucide-react";
import { motion } from "framer-motion";

const Header = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-background/80 backdrop-blur-xl shadow-[0_1px_3px_hsl(var(--foreground)/0.06)]"
          : "bg-transparent"
      }`}
    >
      <div className="container mx-auto flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-2.5">
          <div className="relative flex items-center justify-center w-9 h-9 rounded-lg bg-primary/10">
            <Pencil className="w-4 h-4 text-primary absolute -translate-x-0.5 -translate-y-0.5" />
            <Camera className="w-4 h-4 text-primary absolute translate-x-0.5 translate-y-0.5 opacity-60" />
          </div>
          <span className="text-xl font-bold tracking-tight text-foreground">
            SketchForge
          </span>
        </div>

        <motion.a
          href="https://github.com/Sapfire007/Sketch-to-face-forensics"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-4 py-2 rounded-lg border border-border bg-card text-sm font-medium text-foreground hover:border-primary/30 transition-all duration-200"
          whileHover={{ scale: 1.03, y: -1 }}
          whileTap={{ scale: 0.98 }}
        >
          <Star className="w-4 h-4 text-accent" />
          Star on GitHub
        </motion.a>
      </div>
    </header>
  );
};

export default Header;
