import { LayoutTextFlip } from "./ui/layout-text-flip";
import { motion } from "framer-motion";

export function LayoutTextFlipDemo() {
  return (
    <div>
      <motion.div className="relative mx-4 my-4 flex flex-col items-center justify-center gap-4 text-center sm:mx-0 sm:mb-0 sm:flex-row">
        <LayoutTextFlip
          text="Make your Resume 10x"
          words={[
            "Smarter",
            "Sharper",
            "Sleeker",
            "Refined",
            "Polished",
          ]}
        />
      </motion.div>
      <p className="mt-4 text-center text-base text-neutral-600 dark:text-neutral-400">
        elevates your career with AI-enhanced, precision-crafted LaTeX resumes tailored to your strengths.
Stand out with clean, modern, and professional designs built to impress top recruiters.
      </p>
    
    </div>
  );
}