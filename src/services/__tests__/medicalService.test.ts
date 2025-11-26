import { MedicalService } from '../medicalService';
import { supabase } from '../../config/supabase';
import { AppError } from '../../middleware/errorHandler';
import { MedicalRecord } from '../../types/medical_record';

jest.mock('../../config/supabase');

const mockSupabase = supabase as jest.Mocked<typeof supabase>;
// const mockMedicalService = medicalService as jest.Mocked<typeof medicalService>;

describe('MedicalService', () => {
    let medicalService: MedicalService;

    beforeEach(() => {
        medicalService = new MedicalService();
        jest.clearAllMocks();
    });

    describe('getAllMedicalRecords', () => {
        it('should return all medical records successfully', async () => {
            const mockMedicalRecords: MedicalRecord[] = [
                {
                    id: '1',
                    pet_id: 'pet-1',
                    date: "2024-01-01",
                    procedure: "shots",
                    vet_name: "Dr. Sarah Chitty",
                    notes: "None",
                    cost: "100",
                    created_at: "2024-01-01T00:00:00Z",
                    updated_at: "2024-01-01T00:00:00Z"
                }
            ]

            const mockOrder = jest.fn().mockResolvedValue({data: mockMedicalRecords, error: null});
            const mockSelect = jest.fn().mockReturnValue({order: mockOrder});
            mockSupabase.from.mockReturnValue({select: mockSelect} as any);

            const result = await medicalService.getAllMedicalRecords();

            expect(result).toEqual(mockMedicalRecords);
            expect(mockSupabase.from).toHaveBeenCalledWith('medical_records');
            expect(mockSelect).toHaveBeenCalledWith('*');
            expect(mockOrder).toHaveBeenCalledWith('created_at', {ascending: false});
        })

        it('should throw AppError when Supabase returns an error', async () => {
            const mockError = {message: 'Database error', code: 'PGRST_ERROR'};
            const mockOrder = jest.fn().mockResolvedValue({data: null, error: mockError});
            const mockSelect = jest.fn().mockReturnValue({order: mockOrder});
            mockSupabase.from.mockReturnValue({select: mockSelect} as any);

            await expect(medicalService.getAllMedicalRecords()).rejects.toThrow(AppError);
            await expect(medicalService.getAllMedicalRecords()).rejects.toThrow('Failed to fetch medical records');
        });

        it('should return empty array when data is null', async () => {
            const mockOrder = jest.fn().mockResolvedValue({data: null, error: null});
            const mockSelect = jest.fn().mockReturnValue({order: mockOrder});
            mockSupabase.from.mockReturnValue({select: mockSelect} as any);

            const result = await medicalService.getAllMedicalRecords();
            expect(result).toEqual([]);
        });
    })

    describe('getMedicalRecordsByPetId', () => {
        it('should return medical records by pet id successfully', async () => {
            const mockMedicalRecords: MedicalRecord[] = [
                {
                    id: '1',
                    pet_id: 'pet-1',
                    date: "2024-01-01",
                    procedure: "shots",
                    vet_name: "Dr. Sarah Chitty",
                    notes: "None",
                    cost: "100",
                    created_at: "2024-01-01T00:00:00Z",
                    updated_at: "2024-01-01T00:00:00Z"
                }
            ]
            const mockOrder = jest.fn().mockResolvedValue({data: mockMedicalRecords, error: null});
            const mockEq = jest.fn().mockReturnValue({ order: mockOrder });
            const mockSelect = jest.fn().mockReturnValue({ eq: mockEq });
            mockSupabase.from.mockReturnValue({select: mockSelect} as any);

            const result = await medicalService.getMedicalRecordsByPetId('pet-1');
            expect(result).toEqual(mockMedicalRecords);
            expect(mockEq).toHaveBeenCalledWith('pet_id', 'pet-1');
        });
        it('should throw AppError when Supabase returns an error', async () => {
            const mockError = {message: 'Database error', code: 'PGRST_ERROR'};
            const mockOrder = jest.fn().mockResolvedValue({data: null, error: mockError});
            const mockEq = jest.fn().mockReturnValue({ order: mockOrder });
            const mockSelect = jest.fn().mockReturnValue({ eq: mockEq });
            mockSupabase.from.mockReturnValue({select: mockSelect} as any);
            await expect(medicalService.getMedicalRecordsByPetId('pet-1')).rejects.toThrow(AppError);
            await expect(medicalService.getMedicalRecordsByPetId('pet-1')).rejects.toThrow('Failed to fetch medical records');
        });

    }); 

    describe('createMedicalRecord', () => {

        it('should create medical record successfully', async () => {
            const mockMedicalRecord: MedicalRecord = {
                id: '1',
                pet_id: 'pet-1',
                date: "2024-01-01",
                procedure: "shots",
                vet_name: "Dr. Sarah Chitty",
                notes: "None",
                cost: "100",
                created_at: "2024-01-01T00:00:00Z",
                updated_at: "2024-01-01T00:00:00Z"
            }
            const mockSingle = jest.fn().mockResolvedValue({data: mockMedicalRecord, error: null});
            const mockSelect = jest.fn().mockReturnValue({single: mockSingle});
            const mockInsert = jest.fn().mockReturnValue({select: mockSelect});
            mockSupabase.from.mockReturnValue({insert: mockInsert} as any);
            const result = await medicalService.createMedicalRecord(mockMedicalRecord);
            expect(result).toEqual(mockMedicalRecord);
            expect(mockInsert).toHaveBeenCalledWith([mockMedicalRecord]);
        });

        it('should throw AppError when Supabase returns an error', async () => {
            const mockMedicalRecord: MedicalRecord = {
                id: '1',
                pet_id: 'pet-1',
                date: "2024-01-01",
                procedure: "shots",
                vet_name: "Dr. Sarah Chitty",
                notes: "None",
                cost: "100",
                created_at: "2024-01-01T00:00:00Z",
                updated_at: "2024-01-01T00:00:00Z"
            }
            const mockError = {message: 'Database error', code: 'PGRST_ERROR'};
            const mockSingle = jest.fn().mockResolvedValue({data: null, error: mockError});
            const mockSelect = jest.fn().mockReturnValue({single: mockSingle});
            const mockInsert = jest.fn().mockReturnValue({select: mockSelect});
            mockSupabase.from.mockReturnValue({insert: mockInsert} as any);
            await expect(medicalService.createMedicalRecord(mockMedicalRecord)).rejects.toThrow(AppError);
            await expect(medicalService.createMedicalRecord(mockMedicalRecord)).rejects.toThrow('Failed to create medical record');
        });

        it('should throw AppError when no data returned', async () => {
            const mockMedicalRecord: MedicalRecord = {
                id: '1',
                pet_id: 'pet-1',
                date: "2024-01-01",
                procedure: "shots",
                vet_name: "Dr. Sarah Chitty",
                notes: "None",
                cost: "100",
                created_at: "2024-01-01T00:00:00Z",
                updated_at: "2024-01-01T00:00:00Z"
            }
            const mockSingle = jest.fn().mockResolvedValue({data: null, error: null});
            const mockSelect = jest.fn().mockReturnValue({single: mockSingle});
            const mockInsert = jest.fn().mockReturnValue({select: mockSelect});
            mockSupabase.from.mockReturnValue({insert: mockInsert} as any);
            await expect(medicalService.createMedicalRecord(mockMedicalRecord)).rejects.toThrow(AppError);
            await expect(medicalService.createMedicalRecord(mockMedicalRecord)).rejects.toThrow('Failed to create medical record: No data returned');
        });
    });

    describe('updateMedicalRecord', () => {
        it('should update medical record successfully', async () => {
            const mockMedicalRecord: MedicalRecord = {
                id: '1',
                pet_id: 'pet-1',
                date: "2024-01-01",
                procedure: "shots",
                vet_name: "Dr. Sarah Chitty",
                notes: "None",
                cost: "100",
                created_at: "2024-01-01T00:00:00Z",
                updated_at: "2024-01-01T00:00:00Z"
            }
            const mockSingle = jest.fn().mockResolvedValue({data: mockMedicalRecord, error: null});
            const mockSelect = jest.fn().mockReturnValue({single: mockSingle});
            const mockEq = jest.fn().mockReturnValue({select: mockSelect});
            const mockUpdate = jest.fn().mockReturnValue({eq: mockEq});
            mockSupabase.from.mockReturnValue({update: mockUpdate} as any);
            const result = await medicalService.updateMedicalRecord('1', mockMedicalRecord);
            expect(result).toEqual(mockMedicalRecord);
            expect(mockUpdate).toHaveBeenCalledWith(mockMedicalRecord);
            expect(mockEq).toHaveBeenCalledWith('id', '1');
        });
        
        it('should throw AppError when Supabase returns an error', async () => {
            const mockMedicalRecord: MedicalRecord = {
                id: '1',
                pet_id: 'pet-1',
                date: "2024-01-01",
                procedure: "shots",
                vet_name: "Dr. Sarah Chitty",
                notes: "None",
                cost: "100",
                created_at: "2024-01-01T00:00:00Z",
                updated_at: "2024-01-01T00:00:00Z"
            }
            const mockError = {message: 'Database error', code: 'PGRST_ERROR'};
            const mockSingle = jest.fn().mockResolvedValue({data: null, error: mockError});
            const mockSelect = jest.fn().mockReturnValue({single: mockSingle});
            const mockEq = jest.fn().mockReturnValue({select: mockSelect});
            const mockUpdate = jest.fn().mockReturnValue({eq: mockEq});
            mockSupabase.from.mockReturnValue({update: mockUpdate} as any);
            await expect(medicalService.updateMedicalRecord('1', mockMedicalRecord)).rejects.toThrow(AppError);
            await expect(medicalService.updateMedicalRecord('1', mockMedicalRecord)).rejects.toThrow('Failed to update medical record');
        });

        it('should throw AppError when no data returned', async () => {
            const mockMedicalRecord: MedicalRecord = {
                id: '1',
                pet_id: 'pet-1',
                date: "2024-01-01",
                procedure: "shots",
                vet_name: "Dr. Sarah Chitty",
                notes: "None",
                cost: "100",
                created_at: "2024-01-01T00:00:00Z",
                updated_at: "2024-01-01T00:00:00Z"
            }
            const mockSingle = jest.fn().mockResolvedValue({data: null, error: null});
            const mockSelect = jest.fn().mockReturnValue({single: mockSingle});
            const mockEq = jest.fn().mockReturnValue({select: mockSelect});
            const mockUpdate = jest.fn().mockReturnValue({eq: mockEq});
            mockSupabase.from.mockReturnValue({update: mockUpdate} as any);
            await expect(medicalService.updateMedicalRecord('1', mockMedicalRecord)).rejects.toThrow(AppError);
            await expect(medicalService.updateMedicalRecord('1', mockMedicalRecord)).rejects.toThrow('Medical record not found');
        });
    });

    describe('deleteMedicalRecord', () => {
        it('should delete medical record successfully', async () => {
            const mockEq = jest.fn().mockReturnValue({error: null});
            const mockDelete = jest.fn().mockReturnValue({eq: mockEq});
            mockSupabase.from.mockReturnValue({delete: mockDelete} as any);
            await medicalService.deleteMedicalRecord('1');
            expect(mockDelete).toHaveBeenCalled();
            expect(mockEq).toHaveBeenCalledWith('id', '1');

        });
        
        it('should throw AppError when Supabase returns an error', async () => {
            const mockError = {message: 'Database error', code: 'PGRST_ERROR'};
            const mockEq = jest.fn().mockReturnValue({error: mockError});
            const mockDelete = jest.fn().mockReturnValue({eq: mockEq});
            mockSupabase.from.mockReturnValue({delete: mockDelete} as any);
            await expect(medicalService.deleteMedicalRecord('1')).rejects.toThrow(AppError);
            await expect(medicalService.deleteMedicalRecord('1')).rejects.toThrow('Failed to delete medical record');
        });

        it('should throw AppError when no data returned', async () => {
            const mockError = { message: 'Delete failed', code: 'PGRST_ERROR' };
            const mockEq = jest.fn().mockReturnValue({error: mockError});
            const mockDelete = jest.fn().mockReturnValue({eq: mockEq});
            mockSupabase.from.mockReturnValue({delete: mockDelete} as any);
            await expect(medicalService.deleteMedicalRecord('1')).rejects.toThrow(AppError);
            await expect(medicalService.deleteMedicalRecord('1')).rejects.toThrow('Failed to delete medical record');
        });
    });
});