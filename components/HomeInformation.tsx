import { useEffect, useState } from "react";
import { getNasaImages } from "@/lib/nasa";
const DEFAULT_IMAGES = {
  destinos: "https://images-assets.nasa.gov/image/art002e008486/art002e008486~orig.jpg",
  tulado: "https://images-assets.nasa.gov/image/GSFC_20180203_2018-7006_032/GSFC_20180203_2018-7006_032~orig.jpg",
  flexibilidad: "https://images-assets.nasa.gov/image/PIA09579/PIA09579~orig.jpg",
};

export default function HomeInformation() {
  const [images, setImages] = useState(DEFAULT_IMAGES);

  useEffect(() => {
    async function loadNasaImages() {
      try {
        const [res1, res2, res3] = await Promise.all([
          getNasaImages("art002e008486", 1),
          getNasaImages("GSFC_20180203_2018-7006_032", 1),
          getNasaImages("PIA09579", 1),
        ]);

        setImages({
          destinos: res1[0]?.url || DEFAULT_IMAGES.destinos,
          tulado: res2[0]?.url || DEFAULT_IMAGES.tulado,
          flexibilidad: res3[0]?.url || DEFAULT_IMAGES.flexibilidad,
        });
      } catch (err) {
        console.error("Error fetching live NASA API images, using fallbacks:", err);
      }
    }
    loadNasaImages();
  }, []);

  return (
    <section className="relative w-full bg-[#06040d] pb-32 px-6 overflow-hidden border-t border-white/5 z-30">
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[500px] h-[500px] bg-purple-500/5 blur-[120px] rounded-full pointer-events-none animate-pulse" />
      <div className="absolute top-1/3 right-1/4 -translate-y-1/2 w-[500px] h-[500px] bg-indigo-500/5 blur-[120px] rounded-full pointer-events-none animate-pulse" />
      <div className="max-w-6xl mx-auto relative z-10">
        <div className="text-center space-y-4 mb-20">
          <span className="text-[10px] tracking-[0.4em] text-purple-400 font-mono font-semibold uppercase block animate-pulse">
            VIVE LA EXPERIENCIA DE UN VIAJE INIGUALABLE
          </span>
          <p className="text-slate-400 text-xs md:text-sm uppercase tracking-[0.2em] font-light max-w-2xl mx-auto leading-relaxed">
            En Iris, transformamos el anhelo de explorar el universo en una realidad accesible. Diseñamos cada detalle con un enfoque centrado en ti, garantizando no solo un viaje, sino el inicio de una aventura que cambiará tu perspectiva para siempre.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="relative bg-white/[0.07] backdrop-blur-xl border border-purple-400/10 rounded-3xl shadow-[0_0_50px_-12px_rgba(99,102,241,0.25)] min-h-[460px] flex flex-col justify-between transition-all duration-500 overflow-hidden">
            <div className="p-8 space-y-4">
              <h3 className="text-xl md:text-2xl font-black tracking-[0.1em] text-white uppercase font-sans">
                Destinos Inmersivos
              </h3>
              <p className="text-slate-200 text-[15px] md:text-base leading-relaxed font-light">
                <span className="font-bold text-white block mb-2">Explora los confines de la galaxia.</span>
                Accede a los vuelos más exclusivos del universo bajo los más altos estándares de confort y hospitalidad. Una experiencia de élite, diseñada al alcance de las estrellas.
              </p>
            </div>
            <div className="w-full h-48 overflow-hidden rounded-b-[22px] border-t border-white/10 relative bg-slate-950">
              <img
                src={images.destinos}
                alt="Destinos Inmersivos - NASA API"
                className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src = DEFAULT_IMAGES.destinos;
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#06040d]/60 to-transparent pointer-events-none" />
            </div>
          </div>
          <div className="relative bg-white/[0.07] backdrop-blur-xl border border-purple-400/10 rounded-3xl shadow-[0_0_50px_-12px_rgba(168,85,247,0.15)] min-h-[460px] flex flex-col justify-between transition-all duration-500 overflow-hidden">
            <div className="p-8 space-y-4">
              <h3 className="text-xl md:text-2xl font-black tracking-[0.1em] text-white uppercase font-sans">
                A Tu Lado
              </h3>
              <p className="text-slate-200 text-[15px] md:text-base leading-relaxed font-light">
                <span className="font-bold text-white block mb-2">Tu propia tripulación en la Tierra.</span>
                Un gestor personal coordinará de forma directa cada detalle logístico, técnico y burocrático de tu viaje para que tu única ocupación sea disfrutar del cosmos.
              </p>
            </div>
            <div className="w-full h-48 overflow-hidden rounded-b-[22px] border-t border-white/10 relative bg-slate-950">
              <img
                src={images.tulado}
                alt="A tu lado - NASA API"
                className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src = DEFAULT_IMAGES.tulado;
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#06040d]/60 to-transparent pointer-events-none" />
            </div>
          </div>
          <div className="relative bg-white/[0.07] backdrop-blur-xl border border-purple-400/10 rounded-3xl shadow-[0_0_50px_-12px_rgba(99,102,241,0.25)] min-h-[460px] flex flex-col justify-between transition-all duration-500 overflow-hidden">
            <div className="p-8 space-y-4">
              <h3 className="text-xl md:text-2xl font-black tracking-[0.1em] text-white uppercase font-sans">
                Flexibilidad Estelar
              </h3>
              <p className="text-slate-200 text-[15px] md:text-base leading-relaxed font-light">
                <span className="font-bold text-white block mb-2">Diseñado para adaptarse a tu ritmo.</span>
                Elige la comodidad absoluta de nuestros paquetes exclusivos llave en mano o parametriza cada detalle de la misión si eres un viajero meticuloso.
              </p>
            </div>
            <div className="w-full h-48 overflow-hidden rounded-b-[22px] border-t border-white/10 relative bg-slate-950">
              <img
                src={images.flexibilidad}
                alt="Flexibilidad Estelar - NASA API"
                className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src = DEFAULT_IMAGES.flexibilidad;
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#06040d]/60 to-transparent pointer-events-none" />
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
