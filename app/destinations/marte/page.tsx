import Navbar from "@/components/Navbar";
import Starfield from "@/components/Starfield";

export default function MartePage() {
  return (
    <main className="min-h-screen bg-[#06040d] text-white flex flex-col items-center justify-center">
      <Starfield />
      <Navbar />
      <h1 className="text-6xl font-bold uppercase tracking-tighter">Marte</h1>
      <p className="mt-4 text-slate-400">Página en construcción para el planeta rojo.</p>
    </main>
  );
}
