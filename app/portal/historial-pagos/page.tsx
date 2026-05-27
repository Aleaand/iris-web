"use client";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { CreditCard, Download, Loader2, Search, ArrowUpRight, CheckCircle2, Clock, AlertCircle, FileText } from "lucide-react";
import { irisApi } from "@/lib/api";
import { Payment } from "@/types";
import { motion, AnimatePresence } from "framer-motion";
import { formatPrice } from "@/lib/utils";
import jsPDF from "jspdf";

export default function PagosPage() {
  const { data: session } = useSession();
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, startDate, endDate]);

  useEffect(() => {
    async function loadPayments() {
      if (!session?.user) return;
      const token = (session.user as any).accessToken;
      try {
        const data = await irisApi.getPayments(token);
        setPayments(data.datos || []);
      } catch (error) {
        console.error("Error loading payments:", error);
      } finally {
        setLoading(false);
      }
    }
    loadPayments();
  }, [session]);

  const filteredPayments = payments.filter(p => {
    const description = p.description || '';
    const reservationId = p.reservation_id?.toString() || '';
    const date = new Date(p.created_at);

    const matchesSearch = description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      reservationId.includes(searchQuery);

    const start = startDate ? new Date(startDate) : null;
    const end = endDate ? new Date(endDate) : null;
    if (end) end.setHours(23, 59, 59);

    const matchesDate = (!start || date >= start) && (!end || date <= end);

    return matchesSearch && matchesDate;
  });

  const getStatusStyles = (status: string) => {
    switch (status) {
      case 'Pagado':
        return { color: 'text-green-400', bg: 'bg-green-500/10', border: 'border-green-500/20', icon: CheckCircle2 };
      case 'Pendiente':
        return { color: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/20', icon: Clock };
      case 'Reembolsado':
        return { color: 'text-slate-400', bg: 'bg-white/5', border: 'border-white/10', icon: AlertCircle };
      default:
        return { color: 'text-slate-500', bg: 'bg-white/5', border: 'border-white/10', icon: Clock };
    }
  };



  const handleDownloadReport = () => {
    const doc = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4"
    });

    doc.setFillColor(15, 10, 30);
    doc.rect(0, 0, 210, 40, "F");

    doc.setFillColor(147, 51, 234);
    doc.rect(0, 40, 210, 1.5, "F");

    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(22);
    doc.text("IRIS AEROSPACE", 15, 20);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(168, 85, 247);
    doc.text("CENTRO DE OPERACIONES ORBITALES", 15, 26);

    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.text("INFORME FINANCIERO", 195, 20, { align: "right" });

    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(203, 213, 225);
    doc.text(`AÑO 2026 • REF: #IR-${Math.floor(100000 + Math.random() * 900000)}`, 195, 26, { align: "right" });

    doc.setTextColor(15, 23, 42);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.text("DETALLES DEL CLIENTE", 15, 55);

    doc.setDrawColor(226, 232, 240);
    doc.line(15, 57, 195, 57);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(71, 85, 105);
    doc.text(`Nombre: ${session?.user?.name || "Explorador Iris"}`, 15, 64);
    doc.text(`Email: ${session?.user?.email || "N/A"}`, 15, 70);
    doc.text(`ID Cliente: #USR-${String((session?.user as any)?.id || 0).padStart(6, '0')}`, 15, 76);

    doc.text(`Fecha Emisión: ${new Date().toLocaleDateString('es-ES', { day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}`, 195, 64, { align: "right" });
    doc.text(`Estado General: Activo`, 195, 70, { align: "right" });
    doc.text(`Puerto de Lanzamiento: Base Cañaveral`, 195, 76, { align: "right" });

    const startY = 88;
    doc.setFillColor(15, 10, 30);
    doc.rect(15, startY, 180, 8, "F");

    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8.5);
    doc.text("Fecha", 18, startY + 5.5);
    doc.text("Concepto / Descripción", 40, startY + 5.5);
    doc.text("ID Reserva", 108, startY + 5.5);
    doc.text("Transacción", 132, startY + 5.5);
    doc.text("Estado", 168, startY + 5.5);
    doc.text("Importe", 192, startY + 5.5, { align: "right" });

    let currentY = startY + 8;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);

    filteredPayments.forEach((p, idx) => {
      if (idx % 2 === 0) {
        doc.setFillColor(248, 250, 252);
        doc.rect(15, currentY, 180, 8, "F");
      }

      doc.setDrawColor(241, 245, 249);
      doc.line(15, currentY + 8, 195, currentY + 8);

      doc.setTextColor(71, 85, 105);
      doc.text(p.created_at ? new Date(p.created_at).toLocaleDateString('es-ES') : 'Pendiente', 18, currentY + 5);
      doc.text(p.description || "Reserva Orbital", 40, currentY + 5);
      doc.text(`#${p.reservation_id}`, 108, currentY + 5);

      const tx = p.stripe_payment_id ? `${p.stripe_payment_id.slice(0, 10)}...` : 'N/A';
      doc.text(tx, 132, currentY + 5);

      if (p.status === 'Pagado') {
        doc.setTextColor(16, 185, 129);
      } else if (p.status === 'Pendiente') {
        doc.setTextColor(245, 158, 11);
      } else {
        doc.setTextColor(148, 163, 184);
      }
      doc.text(p.status, 168, currentY + 5);

      doc.setTextColor(15, 23, 42);
      doc.setFont("helvetica", "bold");
      doc.text(`${formatPrice(p.amount || 0)} €`, 192, currentY + 5, { align: "right" });
      doc.setFont("helvetica", "normal");

      currentY += 8;
    });

    currentY += 6;

    const totalAmount = filteredPayments.reduce((sum, p) => p.status !== 'Reembolsado' ? sum + Number(p.amount || 0) : sum, 0);

    doc.setFillColor(241, 245, 249);
    doc.rect(125, currentY, 70, 18, "F");
    doc.setDrawColor(226, 232, 240);
    doc.rect(125, currentY, 70, 18, "S");

    doc.setTextColor(100, 116, 139);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.text("TOTAL INVERTIDO:", 129, currentY + 6);

    doc.setTextColor(147, 51, 234);
    doc.setFontSize(14);
    doc.text(`${formatPrice(totalAmount)} €`, 191, currentY + 12, { align: "right" });

    doc.setTextColor(148, 163, 184);
    doc.setFont("helvetica", "italic");
    doc.setFontSize(7.5);
    doc.text("* Excluye importes reembolsados de reservas canceladas.", 15, currentY + 6);
    doc.text("Este documento sirve como comprobante de transacciones realizadas.", 15, currentY + 11);

    const footerY = 280;
    doc.setDrawColor(226, 232, 240);
    doc.line(15, footerY - 5, 195, footerY - 5);

    doc.setTextColor(148, 163, 184);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7);
    doc.text("Iris Aerospace Corporation S.A. • Centro de Control de Cabo Cañaveral • www.irisaerospace.com", 15, footerY);
    doc.text("Todos los derechos reservados. Copia oficial firmada digitalmente.", 195, footerY, { align: "right" });

    doc.save(`Iris_Informe_Financiero_2026_${session?.user?.name?.replace(/\s/g, '_')}.pdf`);
  };

  const totalPages = Math.ceil(filteredPayments.length / itemsPerPage);
  const paginatedPayments = filteredPayments.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 size={48} className="text-purple-500 animate-spin mb-4" />
        <p className="mono-text text-[10px] uppercase tracking-[0.3em] text-slate-500">Sincronizando con pasarela de pado de Stripe...</p>
      </div>
    );
  }

  return (
    <div className="animate-fade-in space-y-10 pb-20">

      {/* Header */}
      <header className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 mb-4">
            <CreditCard size={10} className="text-purple-400" />
            <span className="mono-text text-[8px] uppercase tracking-widest text-purple-300">Terminal de Transacciones</span>
          </div>
          <h1 className="text-5xl font-bold text-white tracking-tight">
            Mis <span className="text-transparent bg-clip-text bg-linear-to-r from-purple-400 to-indigo-400 italic">Pagos</span>
          </h1>
          <p className="text-slate-500 mt-2 text-sm font-light">Historial de facturación y estado de tus depósitos orbitales.</p>
        </div>
      </header>

      {/* Search and Date Filters */}
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="flex-1 flex items-center bg-white/[0.02] border border-white/5 rounded-2xl px-6 py-4 backdrop-blur-md">
          <Search size={18} className="text-slate-600 mr-4" />
          <input
            type="text"
            placeholder="Buscar por concepto o ID de reserva..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-transparent border-none outline-none text-white text-sm w-full placeholder:text-slate-700"
          />
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex items-center bg-white/[0.02] border border-white/5 rounded-2xl px-4 py-2 backdrop-blur-md">
            <span className="mono-text text-[8px] text-slate-500 uppercase mr-3">Desde</span>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="bg-transparent border-none outline-none text-white text-xs color-scheme-dark"
            />
          </div>
          <div className="flex items-center bg-white/[0.02] border border-white/5 rounded-2xl px-4 py-2 backdrop-blur-md">
            <span className="mono-text text-[8px] text-slate-500 uppercase mr-3">Hasta</span>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="bg-transparent border-none outline-none text-white text-xs color-scheme-dark"
            />
          </div>
          {(startDate || endDate) && (
            <button
              onClick={() => { setStartDate(""); setEndDate(""); }}
              className="px-4 py-2 rounded-xl bg-red-500/10 text-red-400 text-[9px] uppercase font-bold hover:bg-red-500/20 transition-all border border-red-500/20"
            >
              Limpiar
            </button>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="card-purple rounded-[2.5rem] overflow-hidden border-white/5">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-white/5 bg-white/[0.02]">
                <th className="px-8 py-6 mono-text text-[9px] text-slate-500 uppercase tracking-[0.2em]">Fecha</th>
                <th className="px-8 py-6 mono-text text-[9px] text-slate-500 uppercase tracking-[0.2em]">Concepto</th>
                <th className="px-8 py-6 mono-text text-[9px] text-slate-500 uppercase tracking-[0.2em]">ID Reserva</th>
                <th className="px-8 py-6 mono-text text-[9px] text-slate-500 uppercase tracking-[0.2em]">Importe</th>
                <th className="px-8 py-6 mono-text text-[9px] text-slate-500 uppercase tracking-[0.2em]">Estado</th>
                <th className="px-8 py-6 mono-text text-[9px] text-slate-500 uppercase tracking-[0.2em] text-right">Factura</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {paginatedPayments.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-8 py-20 text-center">
                    <p className="text-slate-600 text-sm font-light">No se han encontrado registros de pago.</p>
                  </td>
                </tr>
              ) : (
                paginatedPayments.map((p) => {
                  const styles = getStatusStyles(p.status);
                  const StatusIcon = styles.icon;
                  return (
                    <motion.tr
                      key={p.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="hover:bg-white/[0.02] transition-colors group"
                    >
                      <td className="px-8 py-6 text-sm text-slate-400">
                        {p.created_at ? new Date(p.created_at).toLocaleDateString() : 'Pendiente'}
                      </td>
                      <td className="px-8 py-6">
                        <p className="text-white font-medium text-sm">{p.description || "Reserva Orbital"}</p>
                        <p className="text-slate-600 text-[10px] mt-0.5">Transacción: {p.stripe_payment_id ? `${p.stripe_payment_id.slice(0, 12)}...` : 'ID Pendiente'}</p>
                      </td>
                      <td className="px-8 py-6">
                        <span className="mono-text text-[10px] text-purple-400 font-bold bg-purple-500/10 px-2 py-1 rounded-md">
                          #{p.reservation_id}
                        </span>
                      </td>
                      <td className="px-8 py-6">
                        <span className={`text-white font-bold ${p.status === 'Reembolsado' ? 'line-through opacity-50' : ''}`}>
                          €{formatPrice(p.amount || 0)}
                        </span>
                        {p.status === 'Reembolsado' && (
                          <span className="ml-2 text-[10px] text-slate-500 italic">(Reembolsado)</span>
                        )}
                      </td>
                      <td className="px-8 py-6">
                        <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full ${styles.bg} ${styles.border} ${styles.color}`}>
                          <StatusIcon size={12} />
                          <span className="text-[9px] font-bold uppercase tracking-widest">{p.status}</span>
                        </div>
                      </td>
                      <td className="px-8 py-6 text-right">
                        {p.invoice_url ? (
                          <button
                            onClick={() => window.open(p.invoice_url, '_blank')}
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-[9px] uppercase tracking-widest font-bold hover:bg-white/10 transition-all"
                          >
                            <FileText size={14} /> Recibo
                          </button>
                        ) : (
                          <span className="text-[9px] text-slate-700 uppercase tracking-widest font-bold">No disponible</span>
                        )}
                      </td>
                    </motion.tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Paginación */}
        {totalPages > 1 && (
          <div className="p-6 border-t border-white/5 flex items-center justify-between bg-white/[0.01]">
            <p className="text-[10px] text-slate-500 uppercase tracking-widest font-medium">
              Página {currentPage} de {totalPages}
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-[9px] uppercase tracking-widest font-bold disabled:opacity-20 hover:bg-white/10 transition-all"
              >
                Anterior
              </button>
              <button
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-[9px] uppercase tracking-widest font-bold disabled:opacity-20 hover:bg-white/10 transition-all"
              >
                Siguiente
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Security Banner */}
      <div className="flex flex-col md:flex-row items-center justify-between p-8 rounded-[2rem] bg-indigo-600/5 border border-indigo-500/10">
        <div className="flex items-center gap-4 mb-4 md:mb-0">
          <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 flex items-center justify-center text-indigo-400">
            <Download size={24} />
          </div>
          <div>
            <h4 className="text-white font-bold text-sm">¿Necesitas un informe?</h4>
            <p className="text-slate-500 text-xs font-light">Puedes descargar un resumen anual de tus pagos.</p>
          </div>
        </div>
        <button
          onClick={handleDownloadReport}
          className="px-8 py-3 rounded-full bg-white text-black font-bold text-[10px] uppercase tracking-widest hover:bg-indigo-600 hover:text-white transition-all shadow-xl shadow-white/10"
        >
          Descargar
        </button>
      </div>

    </div>
  );
}
