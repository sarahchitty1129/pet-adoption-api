import { Router } from 'express';
import { applicationController } from '../controllers/applicationController';
import { validate } from '../middleware/validation';
import {
  createApplicationSchema,
  updateApplicationSchema,
} from '../validators/applicationValidator';

const router = Router();

// Get all applications (with optional query parameters: ?status=pending&pet_id=xxx)
router.get('/', applicationController.getAllApplications.bind(applicationController));

// Approve an application
router.post('/:id/approve', applicationController.approveApplication.bind(applicationController));

// Get application by ID
router.get('/:id', applicationController.getApplicationById.bind(applicationController));

// Create a new application (with validation)
router.post(
  '/',
  validate(createApplicationSchema),
  applicationController.createApplication.bind(applicationController)
);

// Update an application (with validation)
router.patch(
  '/:id',
  validate(updateApplicationSchema),
  applicationController.updateApplication.bind(applicationController)
);

// Delete an application
router.delete('/:id', applicationController.deleteApplication.bind(applicationController));

export default router;

