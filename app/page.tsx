import { About } from "@/components/About";
import { Footer } from "@/components/Footer";
import { Hero } from "@/components/Hero";
import { ParallaxDebugProvider } from "@/components/ParallaxDebug";
import { ScrollParallax } from "@/components/ScrollParallax";
import { StretchBand } from "@/components/StretchBand";
import { Work } from "@/components/Work";

export default function Home() {
  return (
    <ParallaxDebugProvider>
      <ScrollParallax />
      {/*
        One flat layer (document order):
        Section 1 (Hero) → fuchsia stretch → Section 2 (Work) → fuchsia stretch → About
      */}
      <main>
        <Hero />
        <StretchBand after="hero" below="work" />
        <Work />
        <StretchBand after="work" below="about" />
        <About />
      </main>
      <Footer />
    </ParallaxDebugProvider>
  );
}
