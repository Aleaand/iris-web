const URL_BASE_API = process.env.NEXT_PUBLIC_API_URL;
const CONTROL_IRIS_URL = process.env.NEXT_PUBLIC_CONTROL_IRIS_URL;

export async function apiFetch(
  endpoint: string,
  opciones?: RequestInit,
  token?: string
) {
  const url = `${URL_BASE_API}${endpoint}`;

  const cabeceras = new Headers(opciones?.headers);
  cabeceras.set('Content-Type', 'application/json');
  if (token) {
    cabeceras.set('Authorization', `Bearer ${token}`);
  }

  const respuesta = await fetch(url, {
    ...opciones,
    headers: cabeceras,
  });

  if (!respuesta.ok) {
    const errorDatos = await respuesta.json().catch(() => ({ mensaje: 'Error desconocido' }));
    throw new Error(errorDatos.mensaje || `Error ${respuesta.status}: ${respuesta.statusText}`);
  }

  return respuesta.json();
}

export async function apiFetchArchivo(
  endpoint: string,
  formulario: FormData,
  token: string
) {
  const url = `${URL_BASE_API}${endpoint}`;
  const respuesta = await fetch(url, {
    ...opcionesDeFetchArchivo(formulario, token)
  });
  if (!respuesta.ok) {
    const errorDatos = await respuesta.json().catch(() => ({ mensaje: 'Error desconocido' }));
    throw new Error(errorDatos.mensaje || `Error ${respuesta.status}`);
  }
  return respuesta.json();
}

function opcionesDeFetchArchivo(formulario: FormData, token: string) {
  return {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: formulario,
  };
}

export const irisApi = {
  getFlights: () => apiFetch('/flights'),
  searchFlights: (parametros: string) => apiFetch(`/flights/search?${parametros}`),
  searchFlightsNearby: (parametros: string) => apiFetch(`/flights/search?${parametros}&nearby=3`),


  getDestinations: () => apiFetch('/destinations'),
  getDestination: (slug: string) => apiFetch(`/destinations/${slug}`),
  getLocations: () => apiFetch('/locations'),

  login: (credenciales: Record<string, unknown>) =>
    apiFetch('/auth/login', { method: 'POST', body: JSON.stringify(credenciales) }),
  register: (datos: Record<string, unknown>) =>
    apiFetch('/auth/register', { method: 'POST', body: JSON.stringify(datos) }),
  forgotPassword: (email: string) =>
    apiFetch('/auth/forgot-password', { method: 'POST', body: JSON.stringify({ email }) }),
  resetPassword: (datos: Record<string, unknown>) =>
    apiFetch('/auth/reset-password', { method: 'POST', body: JSON.stringify(datos) }),

  getProfile: (token: string) => apiFetch('/me', {}, token),
  updateProfile: (token: string, datos: Record<string, unknown>) =>
    apiFetch('/me', { method: 'PUT', body: JSON.stringify(datos) }, token),
  changePassword: (token: string, datos: Record<string, unknown>) =>
    apiFetch('/me/password', { method: 'PUT', body: JSON.stringify(datos) }, token),
  deleteAccount: (token: string) =>
    apiFetch('/me', { method: 'DELETE' }, token),

  getManagerProfile: (token: string) => apiFetch('/me/manager', {}, token),

  getReservations: (token: string) => apiFetch('/me/reservations', {}, token),
  createFullBooking: (token: string, datos: Record<string, unknown>) =>
    apiFetch('/me/reservations', { method: 'POST', body: JSON.stringify(datos) }, token),
  getReservationDetails: (token: string, id: number) =>
    apiFetch(`/me/reservations/${id}`, {}, token),

  getPassengers: (token: string) => apiFetch('/me/passengers', {}, token),
  createPassenger: (token: string, datos: Record<string, unknown>) =>
    apiFetch('/me/passengers', { method: 'POST', body: JSON.stringify(datos) }, token),
  updatePassenger: (token: string, id: number, datos: Record<string, unknown>) =>
    apiFetch(`/me/passengers/${id}`, { method: 'PUT', body: JSON.stringify(datos) }, token),
  deletePassenger: (token: string, id: number) =>
    apiFetch(`/me/passengers/${id}`, { method: 'DELETE' }, token),

  getMessages: (token: string) => apiFetch('/me/messages', {}, token),
  sendMessage: (token: string, contenido: string, type: string = 'nota_cliente', zoom_link: string | null = null) =>
    apiFetch('/me/messages', {
      method: 'POST',
      body: JSON.stringify({
        mensaje: contenido,
        contenido,
        type,
        zoom_link
      })
    }, token),
  cancelMeeting: (token: string, id: number) =>
    apiFetch(`/me/messages/${id}`, { method: 'DELETE' }, token),
  getAvailability: (token: string) => apiFetch('/me/manager/availability', {}, token),

  getDocuments: (token: string) => apiFetch('/me/documents', {}, token),
  uploadDocument: (token: string, formulario: FormData) => {
    const url = `${URL_BASE_API}/me/documents`;
    return fetch(url, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: formulario,
    }).then(res => {
      if (!res.ok) throw new Error("Error al subir documento");
      return res.json();
    });
  },

  getPayments: (token: string) => apiFetch('/me/payments', {}, token),
  createPaymentIntent: (token: string, reserva_id: number) =>
    apiFetch('/payments/create-intent', { method: 'POST', body: JSON.stringify({ reserva_id }) }, token),
  downloadInvoice: (token: string, payment_id: number) =>
    apiFetch(`/payments/${payment_id}/invoice`, {}, token),

  getHotels: (city?: string) => apiFetch(`/hotels${city ? `?city=${city}` : ''}`),
  getTransfers: () => apiFetch('/terrestrial-flights'),
  getTariffs: () => apiFetch('/tariffs'),

  sendContact: (datos: Record<string, unknown>) =>
    apiFetch('/contact', { method: 'POST', body: JSON.stringify(datos) }),

  createManagerTask: async (token: string, datos: {
    title: string;
    type: 'passport' | 'training' | 'booking_request';
    client_name: string;
    reservation_id?: number;
    description?: string;
    priority?: string;
  }) => {
    const url = `${CONTROL_IRIS_URL}/api/tasks`;
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(datos),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || err.mensaje || 'Error al crear tarea en control-iris');
    }
    return res.json();
  },

  createTask: async (datos: Record<string, any>, token: string) => {
    return apiFetch('/me/tasks', {
      method: 'POST',
      body: JSON.stringify(datos)
    }, token);
  }
};

export type { };
