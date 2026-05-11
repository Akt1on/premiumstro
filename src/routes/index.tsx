import { createFileRoute } from "@tanstack/react-router";
import { SmoothScroll } from "@/components/site/SmoothScroll";
import { NoiseOverlay } from "@/components/site/NoiseOverlay";
import { Header } from "@/components/site/Header";
import { Hero } from "@/components/site/Hero";
import { About } from "@/components/site/About";
import { Services } from "@/components/site/Services";
import { AsphaltCompare } from "@/components/site/AsphaltCompare";
import { MachineryShowcase } from "@/components/site/MachineryShowcase";
import { Materials } from "@/components/site/Materials";
import { Projects } from "@/components/site/Projects";
import { Process } from "@/components/site/Process";
import { Contact } from "@/components/site/Contact";
import { Footer } from "@/components/site/Footer";
import { CookieBanner } from "@/components/site/CookieBanner";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  return (
    <>
      <SmoothScroll />
      <NoiseOverlay />
      <Header />
      <main className="bg-asphalt text-foreground">
        <Hero />
        <About />
        <Services />
        <AsphaltCompare />
        <MachineryShowcase />
        <Materials />
        <Projects />
        <Process />
        <Contact />
      </main>
      <Footer />
      <CookieBanner />
    </>
  );
}
