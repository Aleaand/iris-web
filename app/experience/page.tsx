import Navbar from "@/components/Navbar";
import { Shield, Sparkles, Zap, Award, Users, Globe } from "lucide-react";
import Image from "next/image";

export default function ExperiencePage() {
  return (
    <main className="min-h-screen relative overflow-hidden bg-[#110e20]">      <Navbar />

      {/* Hero */}
      <section className="relative z-10 pt-48 pb-32 px-8 text-center max-w-4xl mx-auto">
        <h1 className="text-7xl md:text-8xl font-bold text-white tracking-tighter mb-10 leading-[0.9]">
          En construcción
        </h1>
      </section>
    </main>
  );
}
