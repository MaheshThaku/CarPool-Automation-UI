import Container from "@/components/ui/Container";

import SafetyCard from "./SafetyCard";
import SafetyHighlight from "./SafetyHighlight";

import { safetyFeatures } from "./safety.data";

export default function Safety() {
  return (
    <section
      className="py-16 bg-[var(--surface)]"
    >
      <Container>
        <div className="mb-12">
          <h2
            className="text-3xl font-bold text-[var(--heading)]"
          >
            Safety You Can Trust
          </h2>

          <p
            className="mt-3 text-[var(--text-light)]"
          >
            Travel confidently with trusted
            profiles and built-in safety tools.
          </p>
        </div>

        <div
          className="grid gap-8 lg:grid-cols-[2fr_1fr]"
        >
          <div
            className="grid grid-cols-2 gap-5 md:grid-cols-3"
          >
            {safetyFeatures.map((item) => (
              <SafetyCard
                key={item.title}
                {...item}
              />
            ))}
          </div>

          <SafetyHighlight />
        </div>
      </Container>
    </section>
  );
}