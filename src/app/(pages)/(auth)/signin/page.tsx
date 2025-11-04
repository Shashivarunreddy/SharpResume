"use client";

import Link from "next/link";

import { Github, Chrome } from "lucide-react";
import { BackgroundLines } from "@/components/ui/background-lines";
import { ShineBorder } from "@/components/ui/shine-border";

export default function SignInPage() {
  

  const onGoogle = () => {};
  const onGithub = () => {};

  return (
    <BackgroundLines
      className="min-h-screen bg-zinc-900 text-zinc-200 relative"
      svgOptions={{ duration: 12 }}
    >
      <div className="flex items-center justify-center min-h-screen px-4">
        <div className="relative rounded-xl transition-all duration-300 ease-out hover:scale-[1.02] hover:shadow-2xl hover:border-white/20">
          {/* Shine Border */}
          <ShineBorder
            borderWidth={2}
            duration={12}
            shineColor={["#6EE7B7", "#3B82F6", "#A855F7"]}
            className="rounded-xl"
          />

          {/* Card */}
          <div className="relative z-10 w-80 mx-auto bg-black/40 backdrop-blur-md p-6 rounded-xl border border-white/10">
            <h1 className="text-2xl font-semibold tracking-tight text-white">
              Sign in
            </h1>
            <p className="mt-2 text-sm text-zinc-400">
              Continue with one of the providers below.
            </p>

            <div className="space-y-3 mt-6">
              <button
                onClick={onGoogle}
                className="flex w-full items-center justify-center gap-2 rounded-md border border-white/10 px-4 py-3 text-sm font-medium transition hover:bg-white/5 focus:outline-none focus:ring-2 focus:ring-white/20"
              >
                <Chrome size={18} />
                Sign in with Google
              </button>

              <button
                onClick={onGithub}
                className="flex w-full items-center justify-center gap-2 rounded-md border border-white/10 px-4 py-3 text-sm font-medium transition hover:bg-white/5 focus:outline-none focus:ring-2 focus:ring-white/20"
              >
                <Github size={18} />
                Sign in with GitHub
              </button>
            </div>

            <p className="mt-6 text-center text-sm text-zinc-400">
              Don’t have an account?{" "}
              <Link
                href="/sign-up"
                className="underline decoration-white/30 underline-offset-4 hover:decoration-white"
              >
                Create one
              </Link>
            </p>
          </div>
        </div>
      </div>
    </BackgroundLines>
  );
}
