import { describe, it, expect, vi } from 'vitest';
import { irisApi } from '../lib/api';

describe('Añadir pasajero al cliente autentificado', () => {

  // Simulo un token válido
  const MOCK_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.dummy_token";

  it('debe registrar un nuevo pasajero con éxito en la base de datos', async () => {
    const nuevoPasajero = {
      name: "Pasajero",
      primarylastname: "Prueba",
      document_number: "4545232B",
      document_country: "ESP",
      birth_date: "1930-08-05",
      blood_type: "O+",
      allergies: "Ninguna",
      physical_fitness: "Apto"
    };

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        mensaje: "Pasajero registrado con éxito",
        id: 999,
        datos: { ...nuevoPasajero, id: 999 }
      })
    });

    const response = await irisApi.createPassenger(MOCK_TOKEN, nuevoPasajero);

    expect(response).toBeDefined();
    expect(response.id || response.datos?.id).toBe(999);
    expect(response.mensaje || response.message).toContain("éxito");

    console.log("Test pasado: Pasajero registrado y vinculado al cliente.");
  });

  it('debe fallar si faltan campos obligatorios (Validación)', async () => {
    const pasajeroIncompleto = {
      name: "Nombre"
    };
    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 400,
      json: async () => ({ mensaje: "El apellido y el documento son obligatorios" })
    });

    await expect(irisApi.createPassenger(MOCK_TOKEN, pasajeroIncompleto as any))
      .rejects.toThrow(/obligatorios/);

    console.log("Test pasado: El sistema rechaza datos incompletos correctamente.");
  });
});