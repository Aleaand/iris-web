import Navbar from "@/components/Navbar";
import Starfield from "@/components/Starfield";

export default function LayoutPortal({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen relative overflow-hidden bg-[#06040d]">
      <Starfield />
      <Navbar />

      <main className="relative z-10 pt-36 pb-20 px-6 sm:px-8">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-600/5 aurora-blur rounded-full pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-indigo-600/5 aurora-blur rounded-full pointer-events-none" />
        <div className="max-w-6xl mx-auto relative z-10">
          {children}
        </div>
      </main>

    </div>
  );
}
