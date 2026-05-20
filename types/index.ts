export interface Destination {
  id: number;
  name: string;
  slug: string;
  description: string;
  distance_au: string;
  max_distance_au?: string;
  temperature: string;
  gravity: string;
  image_query: string;
}

export interface Protocol {
  id: 'direct' | 'aptitude' | 'omni';
  name: string;
  definition: string;
  services: string[];
  price_multiplier: number;
  is_recommended?: boolean;
}

export interface Flight {
  id: number;
  code: string;
  destination_id: number;
  destination_name?: string;
  origin: string;
  origin_name?: string;
  departure_date: string;
  arrival_date: string;
  ship_name: string;
  starship_name?: string;
  base_price: number;
  available_seats: number;
  seat_type: 'Nova' | 'Supernova';
  destination?: Destination;
}

export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  avatar?: string;
  assigned_manager_id?: number;
}

export interface Reservation {
  id: number;
  locator: string;
  id_locator?: string;
  user_id: number;
  flight_id: number | null;
  status: 'Pendiente' | 'Confirmada' | 'En Tránsito' | 'Cancelada' | 'confirmed' | 'pending';
  total_price: number;
  payment_status: 'Pendiente' | 'Pagado' | 'Reembolsado' | 'paid' | 'pending';
  flight?: Flight;
  flights?: Flight[];
  passenger_names?: string;
  protocol_id?: string;
  services?: string[];
}

export interface Passenger {
  id: number;
  reservation_id?: number;
  name: string;
  nombre?: string;
  primarylastname: string;
  apellido1?: string;
  secondarylastname?: string;
  apellido2?: string;
  document_number: string;
  dni?: string;
  document_country: string;
  pais?: string;
  birth_date: string;
  fecha_nacimiento?: string;
  blood_type?: string;
  allergies?: string;
  physical_fitness: string;
  iris_passport_number?: string;
  iris_passport_expiration?: string;
  training_certificate_date?: string;
  training_certificate_status?: string;
  passport_photo?: string;
  passport_status: string;
  passport_pdf?: string;
  ofac_status?: string;
  seat_type?: 'Nova' | 'Supernova';
  training_mode?: 'none' | 'request' | 'completed';
  passport_mode?: 'none' | 'request' | 'completed';
  training_dates?: string[];
  training_city?: string;
}

export interface Message {
  id: number;
  client_id: number;
  gestor_id: number;
  sender_type: 'user' | 'manager';
  type: 'llamada' | 'videollamada' | 'email' | 'nota_cliente' | 'otro';
  notes: string;
  zoom_link?: string;
  created_at: string;
  is_read?: boolean;
}

export interface Hotel {
  id: number;
  location_id?: number;
  name: string;
  city: string;
  category: number;
  price_per_night: number;
  image_url?: string;
  description?: string;
}

export interface Transfer {
  id: number;
  location_id?: number;
  type: 'air' | 'vip';
  origin: string;
  destination: string;
  price: number;
  description?: string;
}

export interface BookingSession {
  origin: string;
  destination_id: string;
  departure_date: string;
  return_date?: string;
  passengers: number;
  seat_type: 'Nova' | 'Supernova';
  selectedOutbound?: Flight;
  selectedReturn?: Flight;
  addTraining: boolean;
  trainingPrice: number;
  addPassport: boolean;
  passportPrice: number;
  selectedHotel?: Hotel;
  hotelNights: number;
  addAirTransfer: boolean;
  addVipTransfer: boolean;
  totalPrice: number;
}

export interface Payment {
  id: number;
  reservation_id: number;
  amount: number;
  currency: string;
  status: 'Pendiente' | 'Pagado' | 'Reembolsado';
  stripe_payment_id?: string;
  invoice_url?: string;
  created_at: string;
  description?: string;
  reservation?: Reservation;
}

export interface ManagerProfile {
  id: number;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
}