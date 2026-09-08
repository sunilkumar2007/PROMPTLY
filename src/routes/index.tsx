import { createFileRoute } from "@tanstack/react-router";
import { Navigation } from "@/components/landing/navigation";
import { Hero } from "@/components/landing/hero";
import { FeaturedResources } from "@/components/landing/featured-resources";
import { Features } from "@/components/landing/features";
import { HowItWorks } from "@/components/landing/how-it-works";
import { TrustedBy } from "@/components/landing/trusted-by";
import { Statistics } from "@/components/landing/statistics";
import { Categories } from "@/components/landing/categories";
import { CreatorShowcase } from "@/components/landing/creator-showcase";
import { Testimonials } from "@/components/landing/testimonials";
import { FAQ } from "@/components/landing/faq";
import { Footer } from "@/components/landing/footer";

export const Route = createFileRoute("/")({
  head: () => ({
    title: "Promptly — AI Project Execution Platform",
    meta: [
      {
        name: "description",
        content:
          "From Idea → Structured Phases → AI Prompts → Execution → Working Product. Discover curated AI prompts, code architectures, and multi-model execution workflows.",
      },
    ],
  }),
  component: PromptlyLandingPage,
});

function PromptlyLandingPage() {
  return (
    <div className="min-h-screen bg-white text-black selection:bg-black selection:text-white font-sans">
      <Navigation />
      <Hero />
      <FeaturedResources />
      <Features />
      <HowItWorks />
      <Categories />
      <CreatorShowcase />
      <Statistics />
      <TrustedBy />
      <Testimonials />
      <FAQ />
      <Footer />
    </div>
  );
}