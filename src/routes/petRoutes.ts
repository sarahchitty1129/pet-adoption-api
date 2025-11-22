import { Router } from 'express';
import { petController } from '../controllers/petController';

const router = Router();

// Get all pets (with optional query parameters: ?status=available&type=dog)
router.get('/', petController.getAllPets.bind(petController));

// Get applications for a specific pet (must be before /:id route)
router.get('/:id/applications', petController.getPetApplications.bind(petController));

// Get pet by ID
router.get('/:id', petController.getPetById.bind(petController));

// Create a new pet
router.post('/', petController.createPet.bind(petController));

// Update a pet
router.patch('/:id', petController.updatePet.bind(petController));

// Delete a pet
router.delete('/:id', petController.deletePet.bind(petController));

export default router;

