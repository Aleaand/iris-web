import { describe, it, expect, vi } from 'vitest';
import { irisApi } from '../lib/api';

/**
 * Pruebas unitarias para el Proceso de Reserva (Booking) y operaciones asociadas.
 * Utilizamos Vitest para simular (mockear) las peticiones HTTP globales (fetch) y validar
 * el comportamiento esperado de la API de Iris Aerospace.
 */
describe('Proceso de Reserva y Operaciones del Portal', () => {

  // Simulamos un Token de autenticación de prueba
  const MOCK_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.dummy_token_booking";

  // 1. TEST: Creación exitosa de una Reserva Completa
  it('debe crear una reserva completa con vuelos y servicios extras exitosamente', async () => {
    // Datos simulados de la reserva que envía el frontend
    const datosReserva = {
      space_flight_id: 12,
      seat_class: "Premium",
      passengers: [
        { name: "Carlos", primarylastname: "Méndez", document_number: "12345678X" }
      ],
      extra_services: {
        has_hotel: true,
        hotel_id: 3,
        has_vip: true,
        has_training: true
      }
    };

    // Simulamos la respuesta exitosa del servidor backend
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        mensaje: "Reserva creada con éxito",
        datos: {
          id: 56,
          locator: "IRIS-56X",
          total_price: 15400,
          status: "Pendiente",
          ...datosReserva
        }
      })
    });

    // Ejecutamos la llamada al servicio de la API
    const response = await irisApi.createFullBooking(MOCK_TOKEN, datosReserva);

    // Validamos que la estructura de respuesta sea correcta
    expect(response).toBeDefined();
    expect(response.datos).toBeDefined();
    expect(response.datos.id).toBe(56);
    expect(response.datos.locator).toBe("IRIS-56X");
    expect(response.datos.total_price).toBe(15400);
    expect(response.datos.status).toBe("Pendiente");
    expect(response.mensaje).toContain("éxito");

    console.log("Test pasado: Creación de reserva exitosa simulada correctamente.");
  });

  // 2. TEST: Fallo en la Reserva por Datos Inválidos o Incompletos
  it('debe fallar al intentar reservar si el vuelo o clase no son válidos (Validación)', async () => {
    const reservaInvalida = {
      space_flight_id: null, // Campo inválido
      seat_class: ""
    };

    // Simulamos una respuesta de error 400 (Bad Request) del servidor
    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 400,
      json: async () => ({ mensaje: "El ID de vuelo espacial y la clase de asiento son obligatorios" })
    });

    // Validamos que la API lance la excepción esperada
    await expect(irisApi.createFullBooking(MOCK_TOKEN, reservaInvalida as any))
      .rejects.toThrow(/obligatorios/);

    console.log("Test pasado: El sistema rechaza correctamente peticiones de reserva incompletas.");
  });

  // 3. TEST: Obtención del Historial de Reservas del Usuario
  it('debe recuperar el listado de reservas del cliente autentificado', async () => {
    // Simulamos un listado de reservas
    const reservasSimuladas = {
      datos: [
        { id: 1, locator: "TRN-902", status: "Confirmada", total_price: 3500 },
        { id: 2, locator: "PAS-332", status: "Pendiente", total_price: 120 }
      ]
    };

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => reservasSimuladas
    });

    const response = await irisApi.getReservations(MOCK_TOKEN);

    expect(response).toBeDefined();
    expect(response.datos).toBeInstanceOf(Array);
    expect(response.datos.length).toBe(2);
    expect(response.datos[0].locator).toBe("TRN-902");
    expect(response.datos[1].status).toBe("Pendiente");

    console.log("Test pasado: Historial de reservas recuperado exitosamente.");
  });

  // 4. TEST: Obtención de Detalles de una Reserva Específica
  it('debe recuperar los detalles específicos de una reserva', async () => {
    const detalleSimulado = {
      id: 56,
      status: "Confirmada",
      locator: "IRIS-56X",
      flight: {
        flight_code: "EX-101",
        departure_date: "2026-09-12T14:00:00Z",
        arrival_date: "2026-09-15T18:00:00Z",
        starship: { name: "Iris Vanguard" },
        origin: { name: "Tierra" },
        destination: { name: "Marte" }
      },
      price_snapshot: {
        space_flight_price: 15000,
        hotel_price: 400
      }
    };

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ datos: detalleSimulado })
    });

    const response = await irisApi.getReservationDetails(MOCK_TOKEN, 56);

    expect(response).toBeDefined();
    expect(response.datos).toBeDefined();
    expect(response.datos.flight.flight_code).toBe("EX-101");
    expect(response.datos.flight.starship.name).toBe("Iris Vanguard");
    expect(response.datos.flight.origin.name).toBe("Tierra");
    expect(response.datos.status).toBe("Confirmada");

    console.log("Test pasado: Detalles de la reserva recuperados y validados correctamente.");
  });

  // 5. TEST: Envío de Tarea Administrativa (Cancelación/Upgrade/Modificación)
  it('debe registrar una tarea administrativa de gestión (Cancelación/Upgrade/Modificación)', async () => {
    const nuevaTarea = {
      title: "[GESTIÓN RESERVA] Solicitud de Cancelación - Reserva #56",
      type: "general",
      description: "El cliente solicita cancelar su reserva. Verificar seguro de reembolso.",
      priority: "high",
      reservation_id: 56
    };

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        mensaje: "Tarea de gestión creada con éxito",
        id: 402,
        datos: nuevaTarea
      })
    });

    const response = await irisApi.createTask(nuevaTarea, MOCK_TOKEN);

    expect(response).toBeDefined();
    expect(response.id).toBe(402);
    expect(response.mensaje).toContain("éxito");

    console.log("Test pasado: Tarea administrativa de gestión de reserva creada con éxito.");
  });

  // 6. TEST: Envío de Mensaje de Aviso al Chat
  it('debe enviar un mensaje automatizado de aviso al chat del gestor', async () => {
    const contenidoMensaje = "He solicitado la cancelación de la reserva #56.";

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        mensaje: "Mensaje enviado correctamente",
        id: 777,
        datos: {
          contenido: contenidoMensaje,
          type: "nota_cliente"
        }
      })
    });

    const response = await irisApi.sendMessage(MOCK_TOKEN, contenidoMensaje);

    expect(response).toBeDefined();
    expect(response.id).toBe(777);
    expect(response.datos.contenido).toBe(contenidoMensaje);

    console.log("Test pasado: Mensaje de aviso enviado de forma correcta al chat del gestor.");
  });
});
