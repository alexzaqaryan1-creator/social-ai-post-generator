import { NavBar } from "@/components/layout/NavBar";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/sections/Hero";
import { Features } from "@/components/sections/Features";
import { HowItWorks } from "@/components/sections/HowItWorks";
import { DemoPreview } from "@/components/sections/DemoPreview";
import { GeneratorTool } from "@/components/generator/GeneratorTool";
import { FAQ } from "@/components/sections/FAQ";

export default function Home() {
  return (
    <div id="top">
      <NavBar />
      <main>
        <Hero />
        <GeneratorTool />
        <Features />
        <HowItWorks />
        <DemoPreview />
        <FAQ />
      </main>
      <Footer />
    </div>
  );
}
