import { Github, Linkedin, Twitter } from "lucide-react";

const Footer = () => (
  <footer className="py-10 px-6 border-t border-border">
    <div className="container mx-auto flex flex-col items-center gap-4 text-center">
      <div className="flex items-center gap-5">
        <a href="https://github.com/Sapfire007" target="_blank" rel="noopener noreferrer" aria-label="GitHub" className="text-muted-foreground hover:text-foreground transition-colors">
          <Github className="w-5 h-5" />
        </a>
        <a href="https://www.linkedin.com/in/saptarshi-bose-a09436313/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="text-muted-foreground hover:text-foreground transition-colors">
          <Linkedin className="w-5 h-5" />
        </a>
        <a href="https://x.com/sapfire955" target="_blank" rel="noopener noreferrer" aria-label="Twitter" className="text-muted-foreground hover:text-foreground transition-colors">
          <Twitter className="w-5 h-5" />
        </a>
      </div>
      <p className="text-sm text-muted-foreground">
        Dataset credit: <a href="https://www.kaggle.com/datasets/arbazkhan971/cuhk-face-sketch-database-cufs" target="_blank" rel="noopener noreferrer" className="underline hover:text-foreground transition-colors">CUHK Face Sketch Database</a>
      </p>
      <p className="text-xs text-muted-foreground/60">
        © {new Date().getFullYear()} MLC, VIT-AP. All rights reserved.
      </p>
    </div>
  </footer>
);

export default Footer;
