import { Upload, Cpu, Download } from "lucide-react";
import { motion } from "framer-motion";

const steps = [
  {
    icon: Upload,
    title: "Upload Your Sketch",
    description: "Draw or upload a sketch of any face",
  },
  {
    icon: Cpu,
    title: "AI Processes",
    description: "Our U-Net model transforms your sketch",
  },
  {
    icon: Download,
    title: "Download Result",
    description: "Get your photorealistic image instantly",
  },
];

const HowItWorks = () => (
  <section className="py-20 px-6 bg-muted/30 noise-overlay">
    <div className="container mx-auto max-w-4xl relative z-10">
      <h2 className="text-3xl font-bold text-center text-foreground mb-12">How It Works</h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
        {steps.map((step, i) => (
          <motion.div
            key={step.title}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ delay: i * 0.15, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col items-center text-center p-6 rounded-2xl bg-card border border-border shadow-sm hover:shadow-md transition-shadow duration-300"
          >
            <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
              <step.icon className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">{step.title}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{step.description}</p>
            {i < steps.length - 1 && (
              <div className="hidden sm:block absolute" />
            )}
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default HowItWorks;
