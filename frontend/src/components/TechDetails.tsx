import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";

const techStack = [
  "TensorFlow 2.x",
  "Keras U-Net",
  "FastAPI",
  "React",
  "Tailwind CSS",
  "Framer Motion",
];

const TechDetails = () => (
  <section className="py-16 px-6 bg-muted/30">
    <div className="container mx-auto max-w-2xl">
      <Accordion type="single" collapsible>
        <AccordionItem value="tech" className="border-border">
          <AccordionTrigger className="text-lg font-semibold text-foreground hover:no-underline">
            Built With
          </AccordionTrigger>
          <AccordionContent>
            <div className="flex flex-wrap gap-2 mb-4">
              {techStack.map((t) => (
                <Badge key={t} variant="secondary" className="font-mono text-xs">
                  {t}
                </Badge>
              ))}
            </div>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>Trained on <span className="font-medium text-foreground">38,496</span> augmented face sketch-photo pairs.</p>
              <p>Dataset: CUHK Face Sketch Database (CUFS)</p>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  </section>
);

export default TechDetails;
