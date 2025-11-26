import { supabase } from '../config/supabase';
import { MedicalRecord, CreateMedicalRecordInput, UpdateMedicalRecordInput } from '../types/medical_record';
import { AppError } from '../middleware/errorHandler';


export class MedicalService {
    async getAllMedicalRecords(): Promise<MedicalRecord[]> {
            const { data, error} = await supabase
            .from('medical_records')
            .select('*')
            .order('created_at', { ascending: false });
            
            if (error) {
                throw new AppError('Failed to fetch medical records', 500);
            }
            return data || [];
    }

    async getMedicalRecordsByPetId(petId: string): Promise<MedicalRecord[]> {
        const {data, error} = await supabase.from('medical_records')
        .select('*')
        .eq('pet_id', petId)
        .order('created_at', { ascending: false })
        
        if (error) {
            if (error.code === 'PGRST116') {
                // No rows returned
                return [];
            }
            throw new AppError('Failed to fetch medical records', 500);
        }
        return data || [];
    } 

    async getMedicalRecordById(id: string): Promise<MedicalRecord | null> {
        const {data, error} = await supabase.from('medical_records')
        .select('*')
        .eq('id', id)
        .single()

        if (error) {
            if (error.code === 'PGRST116') {
                // No rows returned
                return null;
            }
            throw new AppError('Failed to fetch medical records', 500);
        }
        return data || null  
    }

    async createMedicalRecord(input: CreateMedicalRecordInput): Promise<MedicalRecord> {
        const{data, error} = await supabase.from('medical_records')
        .insert([input])
        .select()
        .single()

        if (error) {
            throw new AppError('Failed to create medical record', 500)
        }

        if (!data){
            throw new AppError("Failed to create medical record: No data returned", 500)
        }
        return data
    }

    async updateMedicalRecord(id: string, input: UpdateMedicalRecordInput): Promise<MedicalRecord> {
        const {data, error} = await supabase
        .from('medical_records')
        .update(input)
        .eq('id', id)
        .select()
        .single()

        if (error) {
            throw new AppError('Failed to update medical record', 500)
        }

        if (!data){
            throw new AppError('Medical record not found', 404)
        }
        return data
    }

    async deleteMedicalRecord(id: string): Promise<void> {
        const {error} = await supabase.from('medical_records').delete().eq('id', id)

        if (error) {
            throw new AppError('Failed to delete medical record', 500)
        }
    }
}

export const medicalService = new MedicalService();