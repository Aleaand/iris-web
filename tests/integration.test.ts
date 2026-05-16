import { describe, it, expect } from 'vitest';
import { irisApi } from '../lib/api';

describe('Integración REAL: Añadir pasajero a base de datos', () => {

  const REAL_TOKEN = process.env.TEST_TOKEN || "MI_TOKEN";

  it('debe registrar un pasajero real en el servidor (Requiere Token)', async () => {
    if (REAL_TOKEN === "MI_TOKEN") {
      console.warn("Saltando test real: No se ha proporcionado un TOKEN válido.");
      return;
    }

    const pasajeroReal = {
      name: "Explorador",
      primarylastname: "Real",
      document_number: "TEST-" + Math.floor(Math.random() * 1000000),
      document_country: "ESP",
      birth_date: "1990-01-01",
      blood_type: "O+",
      allergies: "Ninguna",
      physical_fitness: "Apto"
    };

    try {
      console.log("Enviando petición real a:", process.env.NEXT_PUBLIC_API_URL);
      const response = await irisApi.createPassenger(REAL_TOKEN, pasajeroReal);

      console.log("Respuesta recibida:", response);

      expect(response).toBeDefined();
      expect(response.id || response.datos?.id).toBeDefined();

      console.log("¡ÉXITO! El pasajero se ha guardado en la base de datos real con ID:", response.id || response.datos?.id);
    } catch (err: any) {
      console.error("ERROR REAL DEL SERVIDOR:", err.message);
      throw err;
    }
  });
});
