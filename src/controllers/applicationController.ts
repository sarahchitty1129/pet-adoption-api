import { Request, Response, NextFunction } from 'express';
import { applicationService } from '../services/applicationService';
import { ApplicationStatus } from '../types/application';
import {
  CreateApplicationInput,
  UpdateApplicationInput,
} from '../validators/applicationValidator';
import { AppError } from '../middleware/errorHandler';

export class ApplicationController {
  /**
   * GET /api/applications?status=pending&pet_id=xxx
   * Get all applications with optional filtering by status and/or pet_id
   */
  async getAllApplications(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { status, pet_id } = req.query;
      let applications;

      // Validate status if provided
      if (status) {
        const statusStr = status as string;
        const validStatuses: ApplicationStatus[] = [
          'pending',
          'approved',
          'rejected',
          'withdrawn',
        ];
        if (!validStatuses.includes(statusStr as ApplicationStatus)) {
          throw new AppError(
            `Invalid status. Must be one of: ${validStatuses.join(', ')}`,
            400
          );
        }
      }

      // If both status and pet_id are provided
      if (status && pet_id) {
        const statusApps = await applicationService.getApplicationsByStatus(
          status as ApplicationStatus
        );
        applications = statusApps.filter(
          (app) => app.pet_id === (pet_id as string)
        );
      } else if (status) {
        // Filter by status only
        applications = await applicationService.getApplicationsByStatus(
          status as ApplicationStatus
        );
      } else if (pet_id) {
        // Filter by pet_id only
        applications = await applicationService.getApplicationsByPetId(
          pet_id as string
        );
      } else {
        // No filters, get all applications
        applications = await applicationService.getAllApplications();
      }

      res.status(200).json({
        status: 'success',
        data: applications,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/applications/:id
   * Get an application by ID
   */
  async getApplicationById(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { id } = req.params;
      const application = await applicationService.getApplicationById(id);

      if (!application) {
        throw new AppError('Application not found', 404);
      }

      res.status(200).json({
        status: 'success',
        data: application,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/applications
   * Create a new application
   */
  async createApplication(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const input: CreateApplicationInput = req.body;
      const application = await applicationService.createApplication(input);

      res.status(201).json({
        status: 'success',
        data: application,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * PATCH /api/applications/:id
   * Update an application by ID
   */
  async updateApplication(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { id } = req.params;
      const input: UpdateApplicationInput = req.body;
      const application = await applicationService.updateApplication(id, input);

      res.status(200).json({
        status: 'success',
        data: application,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * DELETE /api/applications/:id
   * Delete an application by ID
   */
  async deleteApplication(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { id } = req.params;
      await applicationService.deleteApplication(id);

      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/applications/:id/approve
   * Approve an application
   */
  async approveApplication(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { id } = req.params;
      const { rejectOtherApplications } = req.body;
      
      // Default to true if not specified
      const shouldRejectOthers =
        rejectOtherApplications !== undefined
          ? Boolean(rejectOtherApplications)
          : true;

      const application = await applicationService.approveApplication(
        id,
        shouldRejectOthers
      );

      res.status(200).json({
        status: 'success',
        data: application,
        message: 'Application approved and pet status updated to adopted',
      });
    } catch (error) {
      next(error);
    }
  }
}

export const applicationController = new ApplicationController();

