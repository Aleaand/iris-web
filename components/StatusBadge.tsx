"use client";

interface StatusBadgeProps {
  status: string;
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  const getColors = () => {
    switch (status) {
      case 'Confirmada':
      case 'confirmed':
      case 'paid':
        return 'bg-green-500/10 text-green-400 border-green-500/20';
      case 'Pendiente':
      case 'pending':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
      case 'En Tránsito':
        return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      case 'Cancelada':
        return 'bg-red-500/10 text-red-400 border-red-500/20';
      case 'Solicitando Cancelación...':
      case 'Solicitando Cancelación':
      case 'Solicitando cancelación...':
      case 'Solicitando cancelación':
        return 'bg-red-500/10 text-red-400 border-red-500/20';
      case 'Solicitando Upgrade...':
      case 'Solicitando Upgrade':
      case 'Solicitando upgrade...':
      case 'Solicitando upgrade':
        return 'bg-purple-500/10 text-purple-400 border-purple-500/20';
      case 'Solicitando Modificación...':
      case 'Solicitando Modificación':
      case 'Solicitando modificar...':
      case 'Solicitando modificar':
        return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      default:
        return 'bg-slate-500/10 text-slate-400 border-slate-500/20';
    }
  };

  return (
    <span className={`px-2.5 py-0.5 rounded-full border text-[9px] font-bold uppercase tracking-widest ${getColors()}`}>
      {status}
    </span>
  );
}
