import { LayoutTextFlip } from "./ui/layout-text-flip";
import { motion } from "framer-motion";

export function LayoutTextFlipDemo() {
  return (
    <div>
      <motion.div className="relative mx-4 my-4 flex flex-col items-center justify-center gap-4 text-center sm:mx-0 sm:mb-0 sm:flex-row">
        <LayoutTextFlip
          text="Make your Resume 10x"
          words={[
            "Stronger",
            "Smarter",
            "Faster",
            "Sharper",
            "Sleeker",
            "Wiser",
          ]}
        />
      </motion.div>
      <p className="mt-4 text-center text-base text-neutral-600 dark:text-neutral-400">
        elevate your career with AI-enhanced LaTeX resumes
      </p>
    
    </div>
  );
}