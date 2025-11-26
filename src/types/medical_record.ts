export interface MedicalRecord {
    id: string;
    pet_id: string;
    date: string;
    procedure: string;
    vet_name: string;
    notes?: string | null;
    cost?: string | null;
    created_at: string;
    updated_at: string;
}

export interface CreateMedicalRecordInput {
    pet_id: string;
    date: string;
    procedure: string;
    vet_name: string;
    notes?: string | null;
    cost?: string | null;
}

export type UpdateMedicalRecordInput = Partial<CreateMedicalRecordInput>