import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import { getNasaImages } from "@/lib/nasa";
import { irisApi } from "@/lib/api";
import { Destination, Flight } from "@/types";
import Image from "next/image";
import Link from "next/link";
import { ChevronRight, Rocket, Camera } from "lucide-react";

export async function generateMetadata(
  { params }: { params: { slug: string } }
): Promise<Metadata> {
  try {
    const destino: Destination = await irisApi.getDestination(params.slug);
    const imagenesNasa = await getNasaImages(destino.image_query || destino.name, 1);
    const urlImagen = imagenesNasa[0]?.url ?? "";
    return {
      title: `${destino.name} — Iris Aerospace`,
      description: destino.description?.slice(0, 160) ?? `Expedición a ${destino.name} con Iris Aerospace.`,
      openGraph: {
        title: `${destino.name} — Iris Aerospace`,
        description: destino.description?.slice(0, 160) ?? `Expedición a ${destino.name}.`,
        images: urlImagen ? [{ url: urlImagen, width: 1200, height: 630, alt: destino.name }] : [],
        type: "website",
      },
      twitter: {
        card: "summary_large_image",
        title: `${destino.name} — Iris Aerospace`,
        description: destino.description?.slice(0, 160) ?? "",
        images: urlImagen ? [urlImagen] : [],
      },
    };
  } catch {
    return { title: "Destino — Iris Aerospace" };
  }
}

export async function generateStaticParams() {
  try {
    const destinos = await irisApi.getDestinations();
    return destinos.map((d: Destination) => ({ slug: d.slug }));
  } catch {
    return [];
  }
}

export default async function DestinationPage({ params }: { params: { slug: string } }) {
  const { slug } = params;
  const destino: Destination = await irisApi.getDestination(slug);
  const [imagenesNasa, vuelosRespuesta] = await Promise.all([
    getNasaImages(destino.image_query || destino.name, 6),
    irisApi.searchFlights(`destination_id=${destino.id}`)
  ]);

  const vuelos: Flight[] = vuelosRespuesta?.data ?? vuelosRespuesta ?? [];
  const destination = destino;
  const nasaImages = imagenesNasa;
  const flights = vuelos;

  return (
    <main className="min-h-screen relative bg-[#110e20] overflow-x-hidden">
      <Navbar />

      {/* Hero Section con Imagen de la NASA de fondo */}
      <section className="relative h-[70vh] flex items-center justify-center overflow-hidden">
        <Image
          src={nasaImages[0]?.url || "https://images-assets.nasa.gov/image/PIA23893/PIA23893~thumb.jpg"}
          alt={destination.name}
          fill
          className="object-cover opacity-40 blur-[2px]"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#110e20]/50 to-[#110e20]" />

        <div className="relative z-10 text-center px-6 animate-fade-in">
          <h1 className="text-8xl md:text-[12rem] font-bold tracking-tighter text-white uppercase leading-none opacity-90">
            {destination.name}
          </h1>
          <div className="flex items-center justify-center gap-8 mt-8">
            <div className="flex flex-col items-center">
              <span className="mono-text text-[9px] text-purple-400 uppercase tracking-widest mb-2">Distancia</span>
              <span className="text-xl font-light text-white">{destination.distance_au} AU</span>
            </div>
            <div className="w-px h-10 bg-white/10" />
            <div className="flex flex-col items-center">
              <span className="mono-text text-[9px] text-purple-400 uppercase tracking-widest mb-2">Temperatura</span>
              <span className="text-xl font-light text-white">{destination.temperature}</span>
            </div>
            <div className="w-px h-10 bg-white/10" />
            <div className="flex flex-col items-center">
              <span className="mono-text text-[9px] text-purple-400 uppercase tracking-widest mb-2">Gravedad</span>
              <span className="text-xl font-light text-white">{destination.gravity}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Contenido Detallado */}
      <section className="relative z-10 max-w-6xl mx-auto px-8 pb-32 -mt-20">
        <div className="grid md:grid-cols-3 gap-12">

          {/* Columna Principal: Descripción y Galería */}
          <div className="md:col-span-2 space-y-16">
            <div className="card-purple p-12 rounded-[3rem]">
              <h2 className="text-2xl font-bold text-white mb-6 uppercase tracking-wider">Sobre el destino</h2>
              <p className="text-slate-400 text-lg font-light leading-relaxed">
                {destination.description}
              </p>
            </div>

            {/* Galería NASA */}
            <div>
              <div className="flex items-center gap-3 mb-8">
                <Camera size={20} className="text-purple-500" />
                <h2 className="text-2xl font-bold text-white uppercase tracking-widest">Galería Orbital</h2>
                <span className="text-[10px] text-slate-600 mono-text uppercase tracking-widest ml-4">Vía NASA API</span>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {nasaImages.map((img, i) => (
                  <div key={i} className="aspect-square relative rounded-2xl overflow-hidden group border border-white/5 bg-white/5">
                    <Image
                      src={img.url}
                      alt={img.title}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-500 opacity-80"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Columna Lateral: Booking y Vuelos */}
          <div className="space-y-8">
            <div className="card-purple p-8 rounded-[2.5rem] sticky top-32">
              <div className="flex items-center gap-2 mb-6">
                <Rocket size={16} className="text-purple-400" />
                <span className="mono-text text-[9px] text-purple-400 uppercase tracking-widest font-bold">Vuelos Disponibles</span>
              </div>

              {flights.length > 0 ? (
                <div className="space-y-4 mb-8">
                  {flights.slice(0, 3).map((vuelo) => (
                    <div key={vuelo.id} className="p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-purple-500/30 transition-all">
                      <div className="flex justify-between items-start mb-2">
                        <span className="mono-text text-[8px] text-purple-400 font-bold uppercase">{vuelo.code}</span>
                        <span className="text-white font-bold text-sm">€{vuelo.base_price.toLocaleString()}</span>
                      </div>
                      <p className="text-white text-xs font-medium">{new Date(vuelo.departure_date).toLocaleDateString()}</p>
                      <p className="text-slate-500 text-[10px]">{vuelo.ship_name || "Starship"}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-6 border-b border-white/5 mb-8">
                  <p className="text-slate-500 text-sm font-light italic">
                    Consultando próximas misiones hacia {destination.name}...
                  </p>
                </div>
              )}

              <Link
                href={`/booking?destination_id=${destination.id}`}
                className="w-full py-4 bg-linear-to-r from-purple-600 to-indigo-600 rounded-full text-white font-bold text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 hover:shadow-[0_0_30px_rgba(147,51,234,0.3)] transition-all"
              >
                Reservar Mi Plaza <ChevronRight size={14} />
              </Link>
            </div>
          </div>

        </div>
      </section>
    </main>
  );
}
