import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2026-04-22.dahlia" as any,
});

export async function POST(solicitud: NextRequest) {
  try {
    const { importe, idReserva, descripcion } = await solicitud.json();

    if (!importe || importe <= 0) {
      return NextResponse.json(
        { error: "El importe debe ser mayor que cero." },
        { status: 400 }
      );
    }

    const importeEnCentimos = Math.round(importe * 100);
    const intentoPago = await stripe.paymentIntents.create({
      amount: importeEnCentimos,
      currency: "eur",
      description: descripcion ?? `Reserva Iris Aerospace #${idReserva ?? "sin-id"}`,
      metadata: {
        id_reserva: String(idReserva ?? ""),
        plataforma: "iris-web",
      },
      automatic_payment_methods: { enabled: true },
    });

    return NextResponse.json({
      clientSecret: intentoPago.client_secret,
      idIntentoPago: intentoPago.id,
    });
  } catch (err: unknown) {
    const mensaje = err instanceof Error ? err.message : "Error interno del servidor";
    console.error("[Stripe] Error al crear PaymentIntent:", mensaje);
    return NextResponse.json({ error: mensaje }, { status: 500 });
  }
}
