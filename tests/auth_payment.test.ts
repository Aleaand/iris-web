import { describe, it, expect, vi } from 'vitest';
import { irisApi } from '../lib/api';

/**
 * Pruebas unitarias para el Registro de Usuarios (Auth) y la Pasarela de Pagos (Payments).
 * Simula las llamadas a los endpoints del servidor para validar tanto el flujo de registro y acceso
 * como la creación de intentos de pago en la pasarela de pagos.
 */
describe('Flujos de Registro de Usuarios y Pasarela de Pagos', () => {

  // Token simulado de autenticación
  const MOCK_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.dummy_token_auth_payment";

  // SECCIÓN A: PRUEBAS DE REGISTRO E INICIO DE SESIÓN
  describe('Servicio de Autenticación (Registro y Login)', () => {

    // 1. TEST: Registro de Usuario Exitoso
    it('debe registrar un nuevo usuario con éxito y retornar sus credenciales iniciales', async () => {
      const nuevoUsuario = {
        name: "Alejandra",
        primarylastname: "Gómez",
        email: "alejandra@iris.com",
        password: "SuperSecurePassword123",
        phone: "+34 600 000 000"
      };

      // Mockeamos la respuesta exitosa del registro en el backend
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
          mensaje: "Usuario registrado de forma exitosa",
          datos: {
            id: 15,
            name: nuevoUsuario.name,
            email: nuevoUsuario.email,
            created_at: "2026-05-21T21:00:00Z"
          }
        })
      });

      const response = await irisApi.register(nuevoUsuario);

      // Aserciones de validación
      expect(response).toBeDefined();
      expect(response.datos).toBeDefined();
      expect(response.datos.id).toBe(15);
      expect(response.datos.email).toBe("alejandra@iris.com");
      expect(response.mensaje).toContain("exitosa");

      console.log("Test pasado: Registro de nuevo usuario validado con éxito.");
    });

    // 2. TEST: Fallo por Email Duplicado en Registro
    it('debe denegar el registro si el correo electrónico ya se encuentra registrado', async () => {
      const usuarioDuplicado = {
        name: "Pedro",
        primarylastname: "Sanz",
        email: "correo_existente@iris.com",
        password: "Password123"
      };

      // Simulamos un error de conflicto 409 (Conflict / Correo Duplicado)
      global.fetch = vi.fn().mockResolvedValue({
        ok: false,
        status: 409,
        json: async () => ({ mensaje: "El correo electrónico ya está en uso" })
      });

      // Validamos que el método lance el error del backend
      await expect(irisApi.register(usuarioDuplicado))
        .rejects.toThrow(/ya está en uso/);

      console.log("Test pasado: Validación correcta contra correos duplicados en registro.");
    });

    // 3. TEST: Inicio de Sesión Exitoso (Login)
    it('debe autenticar al usuario y retornar un Token JWT de acceso', async () => {
      const credenciales = {
        email: "alejandra@iris.com",
        password: "SuperSecurePassword123"
      };

      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
          mensaje: "Inicio de sesión correcto",
          token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.real_jwt_token",
          user: {
            id: 15,
            name: "Alejandra",
            email: "alejandra@iris.com"
          }
        })
      });

      const response = await irisApi.login(credenciales);

      expect(response).toBeDefined();
      expect(response.token).toBe("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.real_jwt_token");
      expect(response.user.id).toBe(15);

      console.log("Test pasado: Inicio de sesión y verificación de token JWT correctos.");
    });
  });

  // SECCIÓN B: PRUEBAS DE LA PASARELA DE PAGOS
  describe('Pasarela de Pagos (Stripe / Procesamiento de Cobros)', () => {

    // 1. TEST: Crear Intento de Pago Exitoso
    it('debe generar un Client Secret para la pasarela de pagos al iniciar una transacción', async () => {
      const reservaId = 56;

      // Mockeamos la respuesta del backend que se conecta con la API de Stripe
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
          clientSecret: "pi_3M34F2LkdIwHu7ix_secret_DummyClientSecretVal",
          paymentIntentId: "pi_3M34F2LkdIwHu7ix",
          amount: 15400,
          currency: "eur",
          reserva_id: reservaId
        })
      });

      const response = await irisApi.createPaymentIntent(MOCK_TOKEN, reservaId);

      // Verificamos que la pasarela de pagos retorne el Client Secret y los metadatos necesarios
      expect(response).toBeDefined();
      expect(response.clientSecret).toBeDefined();
      expect(response.clientSecret).toContain("secret_");
      expect(response.amount).toBe(15400);
      expect(response.currency).toBe("eur");

      console.log("Test pasado: Intento de pago y Client Secret de la pasarela generados correctamente.");
    });

    // 2. TEST: Fallo en Pago si la Reserva ya está Pagada
    it('debe fallar al crear un intento de pago si la reserva ya ha sido liquidada previamente', async () => {
      const reservaYaPagadaId = 99;

      // Simulamos que el backend rechaza procesar pagos sobre facturas ya saldadas
      global.fetch = vi.fn().mockResolvedValue({
        ok: false,
        status: 400,
        json: async () => ({ mensaje: "Esta reserva ya ha sido pagada en su totalidad" })
      });

      await expect(irisApi.createPaymentIntent(MOCK_TOKEN, reservaYaPagadaId))
        .rejects.toThrow(/ya ha sido pagada/);

      console.log("Test pasado: La pasarela rechaza correctamente transacciones duplicadas.");
    });

    // 3. TEST: Obtener Historial de Transacciones de Pago
    it('debe recuperar el listado de recibos y facturas abonadas por el cliente', async () => {
      const pagosSimulados = {
        datos: [
          {
            id: 88,
            reserva_id: 56,
            amount: 15400,
            status: "succeeded",
            payment_method: "tarjeta_visa",
            created_at: "2026-05-21T21:15:00Z"
          }
        ]
      };

      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => pagosSimulados
      });

      const response = await irisApi.getPayments(MOCK_TOKEN);

      expect(response).toBeDefined();
      expect(response.datos).toBeInstanceOf(Array);
      expect(response.datos.length).toBe(1);
      expect(response.datos[0].status).toBe("succeeded");
      expect(response.datos[0].payment_method).toBe("tarjeta_visa");

      console.log("Test pasado: Historial de transacciones de pago recuperado con éxito.");
    });
  });
});
