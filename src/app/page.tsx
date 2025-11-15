"use client";

import React from "react";
import { LayoutTextFlipDemo } from "@/components/LayoutTextFlip";
import { BentoGridSecondDemo } from "@/components/bentobox";
import { Pricing2 } from "@/components/pricing2";
import { FeatureSteps } from "@/components/feature-section";
import { InfiniteMovingCardsDemo } from "@/components/Testimonials";

const featureList = [
  { step: "Step 1", title: "Introduction", content: "Learn the basics of our product in this first step.", image: "/images/feature1.png" },
  { step: "Step 2", title: "Advanced Features", content: "Explore the advanced features available to you.", image: "/images/feature2.png" },
  { step: "Step 3", title: "Get Started", content: "Start using the product with a detailed walkthrough.", image: "/images/feature3.png" },
  { step: "Step 4", title: "Get Started", content: "Start using the product with a detailed walkthrough.", image: "/images/feature4.png" },
];

export default function Home() {
  return (
    <div className="w-full">
      <div className="flex flex-row gap-6">
        <div className="flex-[4]">
          <LayoutTextFlipDemo />
        </div>
        <div className="flex-[6]">
          <BentoGridSecondDemo />
        </div>
      </div>

      <div className="mt-6">
        <FeatureSteps features={featureList} />
      </div>
      <div className="mt-6">
        <InfiniteMovingCardsDemo />
      </div>
      <div>
        <Pricing2 />
      </div>
    </div>
  );
}
