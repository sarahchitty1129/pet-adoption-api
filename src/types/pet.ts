export type PetType = 'dog' | 'cat' | 'bird' | 'rabbit' | 'hamster' | 'other';
export type PetStatus = 'available' | 'pending' | 'adopted' | 'not_available';

export interface Pet {
  id: string;
  name: string;
  type: PetType;
  breed?: string | null;
  age?: number | null;
  gender?: string | null;
  size?: string | null;
  color?: string | null;
  description?: string | null;
  status: PetStatus;
  image_url?: string | null;
  created_at: string;
  updated_at: string;
}

export interface CreatePetInput {
  name: string;
  type: PetType;
  breed?: string;
  age?: number;
  gender?: string;
  size?: string;
  color?: string;
  description?: string;
  status?: PetStatus;
  image_url?: string;
}

export interface UpdatePetInput {
  name?: string;
  type?: PetType;
  breed?: string;
  age?: number;
  gender?: string;
  size?: string;
  color?: string;
  description?: string;
  status?: PetStatus;
  image_url?: string;
}

