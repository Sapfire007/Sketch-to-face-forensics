import { useState } from "react";
import { motion } from "framer-motion";

const samples = [
  { sketch: "/assets/sketch-1.jpg", photo: "/assets/photo-1.png" },
  { sketch: "/assets/sketch-2.jpg", photo: "/assets/photo-2.png" },
  { sketch: "/assets/sketch-3.jpg", photo: "/assets/photo-3.jpeg" },
  { sketch: "/assets/sketch-4.jpg", photo: "/assets/photo-4.png" },
  { sketch: "/assets/sketch-5.jpg", photo: "/assets/photo-5.png" },
  { sketch: "/assets/sketch-6.jpg", photo: "/assets/photo-6.png" },
];

const GalleryCard = ({ sketch, photo, index }: { sketch: string; photo: string; index: number }) => {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ delay: index * 0.08, duration: 0.5 }}
      className="group relative aspect-square rounded-2xl overflow-hidden border border-border shadow-sm cursor-pointer"
      style={{ perspective: "800px" }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocus={() => setHovered(true)}
      onBlur={() => setHovered(false)}
      tabIndex={0}
      role="button"
      aria-label={`Gallery item ${index + 1}: hover to see transformation`}
    >
      <motion.div
        className="absolute inset-0"
        animate={{ rotateY: hovered ? 180 : 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        style={{ transformStyle: "preserve-3d" }}
      >
        {/* Front — sketch */}
        <div className="absolute inset-0" style={{ backfaceVisibility: "hidden" }}>
          <img src={sketch} alt="Sketch" className="w-full h-full object-cover" loading="lazy" />
          <div className="absolute bottom-3 left-3 px-2.5 py-1 rounded-md bg-foreground/70 text-card text-xs font-medium">
            Sketch
          </div>
        </div>
        {/* Back — photo */}
        <div className="absolute inset-0" style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}>
          <img src={photo} alt="Generated photo" className="w-full h-full object-cover" loading="lazy" />
          <div className="absolute bottom-3 left-3 px-2.5 py-1 rounded-md bg-primary/80 text-primary-foreground text-xs font-medium">
            Generated
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

const SampleGallery = () => (
  <section className="py-20 px-6">
    <div className="container mx-auto max-w-5xl">
      <h2 className="text-3xl font-bold text-center text-foreground mb-4">See What's Possible</h2>
      <p className="text-center text-muted-foreground mb-12">Hover over cards to see the transformation</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {samples.map((s, i) => (
          <GalleryCard key={i} sketch={s.sketch} photo={s.photo} index={i} />
        ))}
      </div>
    </div>
  </section>
);

export default SampleGallery;
