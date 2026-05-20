"use client";
import { useEffect, useState, useRef } from "react";
import Navbar from "@/components/Navbar";
import Starfield from "@/components/Starfield";
import HomeHeroLoader from "@/components/HomeHeroLoader";
import HomeHeroNarrative from "@/components/HomeHeroNarrative";
import HomeHeroScrollPrompt from "@/components/HomeHeroScrollPrompt";
import HomeInformation from "@/components/HomeInformation";
import HomeFleet from "@/components/HomeFleet";
import dynamic from "next/dynamic";
import { irisApi } from "@/lib/api";
import { Destination } from "@/types";
import { getNasaImages } from "@/lib/nasa";

const HomeDestination = dynamic(() => import("@/components/HomeDestination"), {
  ssr: false,
});

export default function Home() {
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [nasaImages, setNasaImages] = useState<Record<string, string>>({});

  // HERO
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const [showLoader, setShowLoader] = useState(true);
  const [loadProgress, setLoadProgress] = useState(0);
  const imageCount = 41;
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);

  const targetFrameRef = useRef(0);
  const currentFrameRef = useRef(0);
  const lastFrameRef = useRef<number>(-1);
  const [activePhase, setActivePhase] = useState(1);
  const activePhaseRef = useRef(1);
  const [isMobile, setIsMobile] = useState(false);
  const [typedText1, setTypedText1] = useState("*@ ?&%#@&*?+ @% %*#&?, &%?#@*$&.");
  const [typedText2, setTypedText2] = useState("");
  const [typedText3, setTypedText3] = useState("");
  const containerRef = useRef<HTMLElement | null>(null);
  const h1Ref = useRef<HTMLHeadingElement | null>(null);
  const arrowRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        const destData = await irisApi.getDestinations();
        const dests = destData.datos || [];
        setDestinations(dests);
        const imagePromises = dests.slice(0, 3).map(async (d: Destination) => {
          const images = await getNasaImages(d.name, 1);
          return { name: d.name, url: images[0]?.url || "/img/placeholder_space.jpg" };
        });

        const imageResults = await Promise.all(imagePromises);
        const imageMap = imageResults.reduce((acc, curr) => {
          acc[curr.name] = curr.url;
          return acc;
        }, {} as Record<string, string>);

        setNasaImages(imageMap);
      } catch (err) {
        console.error("Error cargando datos:", err);
      }
    }
    loadData();
  }, []);

  // Responsive para mobile
  useEffect(() => {
    if (typeof window !== "undefined") {
      const checkMobile = () => {
        setIsMobile(window.innerWidth < 768);
      };
      checkMobile();
      window.addEventListener("resize", checkMobile);
      return () => window.removeEventListener("resize", checkMobile);
    }
  }, []);

  useEffect(() => {
    // Bypass para mobile
    if (isMobile) {
      setLoadProgress(100);
      setImagesLoaded(true);
      setShowLoader(false);
      setActivePhase(3);
      activePhaseRef.current = 3;

      const singleImg = new window.Image();
      singleImg.src = `/img/hero/hero_040.jpg`;
      singleImg.onload = () => {
        imagesRef.current = [singleImg];
        requestAnimationFrame(() => drawFrame(0));
      };
      return;
    }

    let loadedCount = 0;
    const tempImages: HTMLImageElement[] = [];

    for (let i = 0; i < imageCount; i++) {
      const img = new window.Image();
      const padded = String(i).padStart(3, "0");
      img.src = `/img/hero/hero_${padded}.jpg`;

      img.onload = () => {
        loadedCount++;
        const progress = Math.round((loadedCount / imageCount) * 100);
        setLoadProgress(progress);
        if (i === 0) {
          requestAnimationFrame(() => drawFrame(0));
        }

        if (loadedCount === imageCount) {
          setImagesLoaded(true);
        }
      };

      img.onerror = () => {
        loadedCount++;
        const progress = Math.round((loadedCount / imageCount) * 100);
        setLoadProgress(progress);
        if (loadedCount === imageCount) {
          setImagesLoaded(true);
        }
      };

      tempImages.push(img);
    }
    imagesRef.current = tempImages;
  }, [isMobile]);

  // Transición de carga
  useEffect(() => {
    if (imagesLoaded) {
      const timer = setTimeout(() => {
        setShowLoader(false);
      }, 700);
      return () => clearTimeout(timer);
    }
  }, [imagesLoaded]);

  //Efecto que carga en aerospace
  useEffect(() => {
    if (typeof window !== "undefined" && window.location.hash === "#aerospace") {
      if (imagesLoaded) {
        const timer = setTimeout(() => {
          window.scrollTo({
            top: window.innerHeight * 1.2,
          });
        }, 100);
        return () => clearTimeout(timer);
      }
    }
  }, [imagesLoaded]);

  const drawFrame = (index: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const img = isMobile ? imagesRef.current[0] : imagesRef.current[index];
    if (!img || !img.complete) return;

    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();

    if (canvas.width !== rect.width * dpr || canvas.height !== rect.height * dpr) {
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const canvasWidth = canvas.width;
    const canvasHeight = canvas.height;
    const imgWidth = img.width;
    const imgHeight = img.height;
    const ratio = Math.max(canvasWidth / imgWidth, canvasHeight / imgHeight);
    const newWidth = imgWidth * ratio;
    const newHeight = imgHeight * ratio;
    const x = (canvasWidth - newWidth) / 2;
    const y = (canvasHeight - newHeight) / 2;
    ctx.drawImage(img, x, y, newWidth, newHeight);
  };


  useEffect(() => {
    const handleResize = () => {
      const activeFrame = lastFrameRef.current >= 0 ? lastFrameRef.current : 0;
      drawFrame(activeFrame);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (isMobile) return;
    let animId: number;
    const loop = () => {
      const diff = targetFrameRef.current - currentFrameRef.current;
      if (lastFrameRef.current === -1) {
        drawFrame(0);
        lastFrameRef.current = 0;
      }
      if (Math.abs(diff) > 0.01) {
        currentFrameRef.current += diff * 0.12;
        const roundedFrame = Math.min(imageCount - 1, Math.max(0, Math.round(currentFrameRef.current)));
        if (roundedFrame !== lastFrameRef.current) {
          drawFrame(roundedFrame);
          lastFrameRef.current = roundedFrame;
        }
        // Determinar umbrales de fase narrativa
        let newPhase = 1;
        if (currentFrameRef.current >= 14 && currentFrameRef.current < 28) {
          newPhase = 2;
        } else if (currentFrameRef.current >= 28) {
          newPhase = 3;
        }
        if (newPhase !== activePhaseRef.current) {
          activePhaseRef.current = newPhase;
          setActivePhase(newPhase);
        }
        //Estilo del header y el pulso
        if (h1Ref.current) {
          const progress = currentFrameRef.current / (imageCount - 1);
          const scale = 1 - progress * 0.12;
          const yShift = -progress * 40;
          h1Ref.current.style.transform = `scale(${scale}) translateY(${yShift}px)`;
        }

        if (arrowRef.current) {
          const progress = currentFrameRef.current / (imageCount - 1);
          const arrowOpacity = Math.max(0, 1 - progress * 4);
          arrowRef.current.style.opacity = String(arrowOpacity);
          arrowRef.current.style.pointerEvents = arrowOpacity > 0.1 ? "auto" : "none";
        }
      }

      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, [isMobile]);

  useEffect(() => {
    if (isMobile) {
      if (activePhaseRef.current !== 3) {
        activePhaseRef.current = 3;
        setActivePhase(3);
      }
      return;
    }

    if (!imagesLoaded) return;

    const handleScroll = () => {
      const container = containerRef.current;
      if (!container || !canvasRef.current) return;

      const rect = container.getBoundingClientRect();
      const scrollTop = -rect.top;
      const totalScrollableHeight = rect.height - window.innerHeight;
      let progress = scrollTop / totalScrollableHeight;
      progress = Math.max(0, Math.min(1, progress));
      const frameIndex = Math.min(imageCount - 1, Math.max(0, Math.floor(progress * imageCount)));
      targetFrameRef.current = frameIndex;
      if (h1Ref.current) {
        const scale = 1 - progress * 0.12;
        const yShift = -progress * 40;
        h1Ref.current.style.transform = `scale(${scale}) translateY(${yShift}px)`;
      }
      if (arrowRef.current) {
        const arrowOpacity = Math.max(0, 1 - progress * 4);
        arrowRef.current.style.opacity = String(arrowOpacity);
        arrowRef.current.style.pointerEvents = arrowOpacity > 0.1 ? "auto" : "none";
      }
      let newPhase = 1;
      if (progress >= 0.33 && progress < 0.68) {
        newPhase = 2;
      } else if (progress >= 0.68) {
        newPhase = 3;
      }

      if (newPhase !== activePhaseRef.current) {
        activePhaseRef.current = newPhase;
        setActivePhase(newPhase);
      }
    };

    handleScroll();

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [imagesLoaded, isMobile]);

  useEffect(() => {
    if (showLoader) return;

    let intervalId: NodeJS.Timeout;
    let delayTimer: NodeJS.Timeout;

    if (activePhase === 1) {
      const text = "EL UNIVERSO TE LLAMA, RESPONDE.";
      let index = 0;
      setTypedText2("");
      setTypedText3("");

      const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ#@$&%+?*";

      delayTimer = setTimeout(() => {
        intervalId = setInterval(() => {
          let scrambled = "";
          for (let i = 0; i < text.length; i++) {
            if (i < index) {
              scrambled += text[i];
            } else if (text[i] === " " || text[i] === "," || text[i] === ".") {
              scrambled += text[i];
            } else {
              scrambled += chars[Math.floor(Math.random() * chars.length)];
            }
          }
          setTypedText1(scrambled);

          index += 1;
          if (index > text.length) {
            clearInterval(intervalId);
          }
        }, 15);
      }, 1000);
    } else if (activePhase === 2) {
      const text = "MÁS ALLÁ DEL HORIZONTE, TU DESTINO TE ESPERA.";
      let index = 0;
      setTypedText1("");
      setTypedText2("");
      setTypedText3("");

      const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ#@$&%+?*";
      intervalId = setInterval(() => {
        let scrambled = "";
        for (let i = 0; i < text.length; i++) {
          if (i < index) {
            scrambled += text[i];
          } else if (text[i] === " " || text[i] === "," || text[i] === ".") {
            scrambled += text[i];
          } else {
            scrambled += chars[Math.floor(Math.random() * chars.length)];
          }
        }
        setTypedText2(scrambled);

        index += 1;
        if (index > text.length) {
          clearInterval(intervalId);
        }
      }, 15);
    } else if (activePhase === 3) {
      const text = "TU BOLETO DE ENTRADA HACIA LA INFINIDAD DEL COSMOS.";
      let index = 0;
      setTypedText1("");
      setTypedText2("");
      setTypedText3("");

      const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ#@$&%+?*";
      intervalId = setInterval(() => {
        let scrambled = "";
        for (let i = 0; i < text.length; i++) {
          if (i < index) {
            scrambled += text[i];
          } else if (text[i] === " " || text[i] === "," || text[i] === ".") {
            scrambled += text[i];
          } else {
            scrambled += chars[Math.floor(Math.random() * chars.length)];
          }
        }
        setTypedText3(scrambled);

        index += 1;
        if (index > text.length) {
          clearInterval(intervalId);
        }
      }, 12);
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
      if (delayTimer) clearTimeout(delayTimer);
    };
  }, [activePhase, showLoader]);

  const handleScrollClick = () => {
    window.scrollTo({
      top: window.innerHeight * 1.2,
      behavior: "smooth",
    });
  };

  return (
    <main className="relative w-full h-auto bg-[#06040d] text-white select-none">
      <section ref={containerRef} className="relative w-full h-[220vh]">
        <HomeHeroLoader show={showLoader} progress={loadProgress} loaded={imagesLoaded} />
        <div className="sticky top-0 h-screen w-full overflow-hidden flex flex-col items-center justify-center">
          <canvas ref={canvasRef} className="absolute inset-0 w-full h-full object-cover z-0" />

          <div
            className={`absolute top-0 left-0 w-full z-40 transition-all duration-500 transform ${activePhase === 3 ? "opacity-100 translate-y-0 pointer-events-auto" : "opacity-0 -translate-y-4 pointer-events-none"
              }`}
          >
            <Navbar />
          </div>

          <div className="absolute inset-0 z-10 bg-gradient-to-b from-[#06040d]/80 via-transparent to-[#06040d] pointer-events-none" />
          <div className="absolute inset-0 z-10 bg-gradient-to-r from-[#06040d]/40 via-transparent to-[#06040d]/40 pointer-events-none" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[140vw] h-[140vw] bg-linear-to-tr from-purple-900/10 via-transparent to-transparent opacity-20 blur-[120px] animate-slow-spin z-10 pointer-events-none" />

          <HomeHeroNarrative
            activePhase={activePhase}
            typedText1={typedText1}
            typedText2={typedText2}
            typedText3={typedText3}
            h1Ref={h1Ref}
          />

          <HomeHeroScrollPrompt
            activePhase={activePhase}
            arrowRef={arrowRef as any}
            onClick={handleScrollClick}
          />
        </div>
      </section>
      <HomeInformation />
      <HomeDestination />
      <HomeFleet />
    </main>
  );
}
