export interface Space {
  id: number;
  name: string;
  description?: string;
  capacity: number;
  location?: string;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
  reservations?: Reservation[];
}

export interface SpacesResponse {
  status: string;
  data: {
    spaces: Space[];
  };
}

export interface SpaceResponse {
  status: string;
  data: {
    space: Space;
  };
}

export interface Reservation {
  id: number;
  user_id: number;
  space_id: number;
  title: string;
  description?: string;
  start_time: string;
  end_time: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  created_at?: string;
  updated_at?: string;
  user?: any;
  space?: Space;
}


