import { Reservation, Space } from './space.model';

export interface ReservationResponse {
  status: string;
  data: {
    reservation: Reservation;
  };
}

export interface ReservationsResponse {
  status: string;
  data: {
    reservations: Reservation[];
  };
}

export interface CreateReservationRequest {
  space_id: number;
  title: string;
  description?: string;
  start_time: string;
  end_time: string;
}

export interface UpdateReservationRequest {
  space_id?: number;
  title?: string;
  description?: string;
  start_time?: string;
  end_time?: string;
  status?: 'pending' | 'confirmed' | 'cancelled';
}

