import { Router } from 'express';
import {medicalRecordsController} from '../controllers/medicalRecordsController';

const router = Router();

router.get('/', medicalRecordsController.getAllMedicalRecords.bind(medicalRecordsController));
router.get('/:id', medicalRecordsController.getMedicalRecordById.bind(medicalRecordsController));
router.post('/', medicalRecordsController.createMedicalRecord.bind(medicalRecordsController));
router.patch('/:id', medicalRecordsController.updateMedicalRecord.bind(medicalRecordsController));
router.delete('/:id', medicalRecordsController.deleteMedicalRecord.bind(medicalRecordsController));

export default router;