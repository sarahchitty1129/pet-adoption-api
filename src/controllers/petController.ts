import { Request, Response, NextFunction } from 'express';
import { petService } from '../services/petService';
import { applicationService } from '../services/applicationService';
import { CreatePetInput, UpdatePetInput, PetStatus } from '../types/pet';
import { AppError } from '../middleware/errorHandler';

export class PetController {
  /**
   * GET /api/pets?status=available&type=dog
   * Get all pets with optional filtering by status and/or type
   */
  async getAllPets(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { status, type } = req.query;
      let pets;

      // Validate status if provided
      if (status) {
        const statusStr = status as string;
        const validStatuses: PetStatus[] = ['available', 'pending', 'adopted', 'not_available'];
        if (!validStatuses.includes(statusStr as PetStatus)) {
          throw new AppError(
            `Invalid status. Must be one of: ${validStatuses.join(', ')}`,
            400
          );
        }
      }

      // If both status and type are provided, filter by status first, then filter by type
      if (status && type) {
        const statusPets = await petService.getPetsByStatus(status as PetStatus);
        pets = statusPets.filter((pet) => pet.type === type);
      } else if (status) {
        // Filter by status only
        pets = await petService.getPetsByStatus(status as PetStatus);
      } else if (type) {
        // Filter by type only
        pets = await petService.getPetsByType(type as string);
      } else {
        // No filters, get all pets
        pets = await petService.getAllPets();
      }

      res.status(200).json({
        status: 'success',
        data: pets,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/pets/:id
   * Get a pet by ID
   */
  async getPetById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const pet = await petService.getPetById(id);

      if (!pet) {
        throw new AppError('Pet not found', 404);
      }

      res.status(200).json({
        status: 'success',
        data: pet,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/pets
   * Create a new pet
   */
  async createPet(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const input: CreatePetInput = req.body;
      const pet = await petService.createPet(input);

      res.status(201).json({
        status: 'success',
        data: pet,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * PATCH /api/pets/:id
   * Update a pet by ID
   */
  async updatePet(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const input: UpdatePetInput = req.body;
      const pet = await petService.updatePet(id, input);

      res.status(200).json({
        status: 'success',
        data: pet,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * DELETE /api/pets/:id
   * Delete a pet by ID
   */
  async deletePet(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      await petService.deletePet(id);

      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/pets/:id/applications
   * Get all applications for a specific pet
   */
  async getPetApplications(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { id } = req.params;

      // Verify pet exists
      const pet = await petService.getPetById(id);
      if (!pet) {
        throw new AppError('Pet not found', 404);
      }

      // Get applications for this pet
      const applications = await applicationService.getApplicationsByPetId(id);

      res.status(200).json({
        status: 'success',
        data: applications,
      });
    } catch (error) {
      next(error);
    }
  }
}

export const petController = new PetController();

