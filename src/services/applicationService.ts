import { supabase } from '../config/supabase';
import { Application, ApplicationStatus } from '../types/application';
import {
  CreateApplicationInput,
  UpdateApplicationInput,
} from '../validators/applicationValidator';
import { AppError } from '../middleware/errorHandler';
import { petService } from './petService';

export class ApplicationService {
  /**
   * Get all applications
   */
  async getAllApplications(): Promise<Application[]> {
    const { data, error } = await supabase
      .from('applications')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      throw new AppError(`Failed to fetch applications: ${error.message}`, 500);
    }

    return data || [];
  }

  /**
   * Get an application by ID
   */
  async getApplicationById(id: string): Promise<Application | null> {
    const { data, error } = await supabase
      .from('applications')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        // No rows returned
        return null;
      }
      throw new AppError(`Failed to fetch application: ${error.message}`, 500);
    }

    return data;
  }

  /**
   * Get all applications for a specific pet
   */
  async getApplicationsByPetId(petId: string): Promise<Application[]> {
    const { data, error } = await supabase
      .from('applications')
      .select('*')
      .eq('pet_id', petId)
      .order('created_at', { ascending: false });

    if (error) {
      throw new AppError(
        `Failed to fetch applications for pet: ${error.message}`,
        500
      );
    }

    return data || [];
  }

  /**
   * Create a new application
   */
  async createApplication(input: CreateApplicationInput): Promise<Application> {
    // Verify pet exists
    const pet = await petService.getPetById(input.pet_id);
    if (!pet) {
      throw new AppError('Pet not found', 404);
    }

    // Check if pet is available
    if (pet.status !== 'available') {
      throw new AppError(
        `Pet is not available for adoption. Current status: ${pet.status}`,
        400
      );
    }

    const { data, error } = await supabase
      .from('applications')
      .insert([input])
      .select()
      .single();

    if (error) {
      throw new AppError(`Failed to create application: ${error.message}`, 500);
    }

    if (!data) {
      throw new AppError('Failed to create application: No data returned', 500);
    }

    return data;
  }

  /**
   * Update an application by ID
   */
  async updateApplication(
    id: string,
    input: UpdateApplicationInput
  ): Promise<Application> {
    const { data, error } = await supabase
      .from('applications')
      .update(input)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw new AppError(`Failed to update application: ${error.message}`, 500);
    }

    if (!data) {
      throw new AppError('Application not found', 404);
    }

    return data;
  }

  /**
   * Delete an application by ID
   */
  async deleteApplication(id: string): Promise<void> {
    const { error } = await supabase
      .from('applications')
      .delete()
      .eq('id', id);

    if (error) {
      throw new AppError(`Failed to delete application: ${error.message}`, 500);
    }
  }

  /**
   * Approve an application
   * This will:
   * 1. Update the application status to 'approved'
   * 2. Update the pet's status to 'adopted'
   * 3. Optionally reject other pending applications for the same pet
   */
  async approveApplication(
    id: string,
    rejectOtherApplications: boolean = true
  ): Promise<Application> {
    // Get the application
    const application = await this.getApplicationById(id);
    if (!application) {
      throw new AppError('Application not found', 404);
    }

    if (application.status === 'approved') {
      throw new AppError('Application is already approved', 400);
    }

    if (application.status !== 'pending') {
      throw new AppError(
        `Cannot approve application with status: ${application.status}`,
        400
      );
    }

    // Update application status to approved
    const { data: updatedApplication, error: updateError } = await supabase
      .from('applications')
      .update({ status: 'approved' })
      .eq('id', id)
      .select()
      .single();

    if (updateError) {
      throw new AppError(
        `Failed to approve application: ${updateError.message}`,
        500
      );
    }

    if (!updatedApplication) {
      throw new AppError('Failed to approve application: No data returned', 500);
    }

    // Update pet status to adopted
    try {
      await petService.updatePet(application.pet_id, { status: 'adopted' });
    } catch (error) {
      // Rollback application status if pet update fails
      await supabase
        .from('applications')
        .update({ status: 'pending' })
        .eq('id', id);
      throw new AppError(
        `Failed to update pet status: ${error instanceof Error ? error.message : 'Unknown error'}`,
        500
      );
    }

    // Optionally reject other pending applications for the same pet
    if (rejectOtherApplications) {
      await supabase
        .from('applications')
        .update({ status: 'rejected' })
        .eq('pet_id', application.pet_id)
        .eq('status', 'pending')
        .neq('id', id);
    }

    return updatedApplication;
  }

  /**
   * Get applications by status
   */
  async getApplicationsByStatus(
    status: ApplicationStatus
  ): Promise<Application[]> {
    const { data, error } = await supabase
      .from('applications')
      .select('*')
      .eq('status', status)
      .order('created_at', { ascending: false });

    if (error) {
      throw new AppError(
        `Failed to fetch applications by status: ${error.message}`,
        500
      );
    }

    return data || [];
  }
}

export const applicationService = new ApplicationService();

