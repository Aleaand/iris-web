"use client";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";

const variantesTransicion = {
  oculto: {
    opacity: 0,
    y: 12,
    filter: "blur(4px)",
  },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      duration: 0.45,
      ease: [0.22, 1, 0.36, 1],
    },
  },
  saliendo: {
    opacity: 0,
    y: -8,
    filter: "blur(2px)",
    transition: {
      duration: 0.25,
      ease: "easeIn",
    },
  },
};

interface PropsTransicionPagina {
  children: React.ReactNode;
}

export default function TransicionPagina({ children }: PropsTransicionPagina) {
  const rutaActual = usePathname();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={rutaActual}
        variants={variantesTransicion as any}
        initial="oculto"
        animate="visible"
        exit="saliendo"
        className="flex-grow flex flex-col"
        style={{ isolation: "isolate" }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
