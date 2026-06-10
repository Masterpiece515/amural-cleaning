import Hero from "@/components/Hero";
import Services from "@/components/Services";
import WhyUs from "@/components/WhyUs";
import BeforeAfter from "@/components/BeforeAfter";
import HowWeWork from "@/components/HowWeWork";
import Reviews from "@/components/Reviews";
import CTA from "@/components/CTA";

export default function Home() {
  return (
    <main>
      <Hero />
      <Services />
      <WhyUs />
      <BeforeAfter />
      <HowWeWork />
      <Reviews />
      <CTA />
    </main>
  );
}
