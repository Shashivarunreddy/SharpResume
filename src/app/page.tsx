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
    <div className="min-h-screen bg-white text-black">
      {/* Top Navbar */}
      {/* <Navbar /> */}

      {/* Main Content */}
      <main className="flex flex-col items-center justify-center p-8 pt-24">
        <h1 className="text-4xl font-bold mb-6 text-gray-900">
          Welcome to <span className="text-blue-600">Resume Analyzer</span>
        </h1>
        <p className="text-lg mb-6 text-gray-700">
          Analyze and improve your resume with AI-powered insights.
        </p>

        {/* Components */}
        <div className="w-full max-w-4xl space-y-8">
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
