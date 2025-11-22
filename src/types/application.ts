export type ApplicationStatus = 'pending' | 'approved' | 'rejected' | 'withdrawn';

export interface Application {
  id: string;
  pet_id: string;
  applicant_name: string;
  applicant_email: string;
  applicant_phone?: string | null;
  applicant_address?: string | null;
  application_text?: string | null;
  status: ApplicationStatus;
  created_at: string;
  updated_at: string;
}

export interface CreateApplicationInput {
  pet_id: string;
  applicant_name: string;
  applicant_email: string;
  applicant_phone?: string;
  applicant_address?: string;
  application_text?: string;
  status?: ApplicationStatus;
}

export interface UpdateApplicationInput {
  applicant_name?: string;
  applicant_email?: string;
  applicant_phone?: string;
  applicant_address?: string;
  application_text?: string;
  status?: ApplicationStatus;
}

