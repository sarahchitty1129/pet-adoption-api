import { supabase } from '../config/supabase';
import { Pet, CreatePetInput, UpdatePetInput, PetStatus } from '../types/pet';
import { AppError } from '../middleware/errorHandler';

export class PetService {
  /**
   * Get all pets
   */
  async getAllPets(): Promise<Pet[]> {
    const { data, error } = await supabase
      .from('pets')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      throw new AppError(`Failed to fetch pets: ${error.message}`, 500);
    }

    return data || [];
  }

  /**
   * Get available pets (status = 'available')
   */
  async getAvailablePets(): Promise<Pet[]> {
    const { data, error } = await supabase
      .from('pets')
      .select('*')
      .eq('status', 'available')
      .order('created_at', { ascending: false });

    if (error) {
      throw new AppError(`Failed to fetch available pets: ${error.message}`, 500);
    }

    return data || [];
  }

  /**
   * Get a pet by ID
   */
  async getPetById(id: string): Promise<Pet | null> {
    const { data, error } = await supabase
      .from('pets')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        // No rows returned
        return null;
      }
      throw new AppError(`Failed to fetch pet: ${error.message}`, 500);
    }

    return data;
  }

  /**
   * Create a new pet
   */
  async createPet(input: CreatePetInput): Promise<Pet> {
    const { data, error } = await supabase
      .from('pets')
      .insert([input])
      .select()
      .single();

    if (error) {
      throw new AppError(`Failed to create pet: ${error.message}`, 500);
    }

    if (!data) {
      throw new AppError('Failed to create pet: No data returned', 500);
    }

    return data;
  }

  /**
   * Update a pet by ID
   */
  async updatePet(id: string, input: UpdatePetInput): Promise<Pet> {
    const { data, error } = await supabase
      .from('pets')
      .update(input)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw new AppError(`Failed to update pet: ${error.message}`, 500);
    }

    if (!data) {
      throw new AppError('Pet not found', 404);
    }

    return data;
  }

  /**
   * Delete a pet by ID
   */
  async deletePet(id: string): Promise<void> {
    const { error } = await supabase
      .from('pets')
      .delete()
      .eq('id', id);

    if (error) {
      throw new AppError(`Failed to delete pet: ${error.message}`, 500);
    }
  }

  /**
   * Get pets by status
   */
  async getPetsByStatus(status: PetStatus): Promise<Pet[]> {
    const { data, error } = await supabase
      .from('pets')
      .select('*')
      .eq('status', status)
      .order('created_at', { ascending: false });

    if (error) {
      throw new AppError(`Failed to fetch pets by status: ${error.message}`, 500);
    }

    return data || [];
  }

  /**
   * Get pets by type
   */
  async getPetsByType(type: string): Promise<Pet[]> {
    const { data, error } = await supabase
      .from('pets')
      .select('*')
      .eq('type', type)
      .order('created_at', { ascending: false });

    if (error) {
      throw new AppError(`Failed to fetch pets by type: ${error.message}`, 500);
    }

    return data || [];
  }
}

export const petService = new PetService();


