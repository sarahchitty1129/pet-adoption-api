import { Request, Response, NextFunction } from 'express';
import { MedicalRecord, CreateMedicalRecordInput, UpdateMedicalRecordInput } from '../types/medical_record';
import { AppError } from '../middleware/errorHandler';
import { medicalService } from '../services/medicalService';


export class MedicalRecordsController {
    async getAllMedicalRecords(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const medicalRecords = await medicalService.getAllMedicalRecords()
            res.status(200).json({
                status: 'success',
                data: medicalRecords
            })
        } catch (error){
            next(error)
        }
    }
    async getMedicalRecordById(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { id } = req.params;
            const medicalRecord = await medicalService.getMedicalRecordById(id);
      
            if (!medicalRecord) {
              throw new AppError('medical Record not found', 404);
            }
      
            res.status(200).json({
              status: 'success',
              data: medicalRecord,
            });
          } catch (error) {
            next(error);
          }
        }

    async createMedicalRecord(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const input : CreateMedicalRecordInput= req.body;
            const medicalRecord = await medicalService.createMedicalRecord(input)
            res.status(201).json({
                status: 'success',
                data: medicalRecord
            })
        } catch (error){
            next(error)
        }
    }

    async updateMedicalRecord(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { id } = req.params;
            const input : UpdateMedicalRecordInput = req.body;
            const medicalRecord = await medicalService.updateMedicalRecord(id, input)
            res.status(200).json({
                status: 'success',
                data: medicalRecord
            })
        } catch (error){
            next(error)
        }
    }

    async deleteMedicalRecord(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { id } = req.params;
            await medicalService.deleteMedicalRecord(id)
            res.status(204).send()
        } catch (error){
            next(error)
        }
    }
}

export const medicalRecordsController = new MedicalRecordsController();