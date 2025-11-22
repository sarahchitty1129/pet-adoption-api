import { ApplicationService } from '../applicationService';
import { supabase } from '../../config/supabase';
import { petService } from '../petService';
import { AppError } from '../../middleware/errorHandler';
import { Application, ApplicationStatus } from '../../types/application';

// Mock dependencies
jest.mock('../../config/supabase');
jest.mock('../petService');

const mockSupabase = supabase as jest.Mocked<typeof supabase>;
const mockPetService = petService as jest.Mocked<typeof petService>;

describe('ApplicationService', () => {
  let applicationService: ApplicationService;

  beforeEach(() => {
    applicationService = new ApplicationService();
    jest.clearAllMocks();
  });

  describe('getAllApplications', () => {
    it('should return all applications successfully', async () => {
      const mockApplications: Application[] = [
        {
          id: '1',
          pet_id: 'pet-1',
          applicant_name: 'John Doe',
          applicant_email: 'john@example.com',
          status: 'pending',
          created_at: '2024-01-01T00:00:00Z',
          updated_at: '2024-01-01T00:00:00Z',
        },
      ];

      const mockOrder = jest.fn().mockResolvedValue({ data: mockApplications, error: null });
      const mockSelect = jest.fn().mockReturnValue({ order: mockOrder });
      mockSupabase.from.mockReturnValue({ select: mockSelect } as any);

      const result = await applicationService.getAllApplications();

      expect(result).toEqual(mockApplications);
      expect(mockSupabase.from).toHaveBeenCalledWith('applications');
      expect(mockSelect).toHaveBeenCalledWith('*');
      expect(mockOrder).toHaveBeenCalledWith('created_at', { ascending: false });
    });

    it('should throw AppError when Supabase returns an error', async () => {
      const mockError = { message: 'Database error', code: 'PGRST_ERROR' };

      const mockOrder = jest.fn().mockResolvedValue({ data: null, error: mockError });
      const mockSelect = jest.fn().mockReturnValue({ order: mockOrder });
      mockSupabase.from.mockReturnValue({ select: mockSelect } as any);

      await expect(applicationService.getAllApplications()).rejects.toThrow(AppError);
      await expect(applicationService.getAllApplications()).rejects.toThrow(
        'Failed to fetch applications: Database error'
      );
    });

    it('should return empty array when data is null', async () => {
      const mockOrder = jest.fn().mockResolvedValue({ data: null, error: null });
      const mockSelect = jest.fn().mockReturnValue({ order: mockOrder });
      mockSupabase.from.mockReturnValue({ select: mockSelect } as any);

      const result = await applicationService.getAllApplications();

      expect(result).toEqual([]);
    });
  });

  describe('getApplicationById', () => {
    it('should return application by ID successfully', async () => {
      const mockApplication: Application = {
        id: '1',
        pet_id: 'pet-1',
        applicant_name: 'John Doe',
        applicant_email: 'john@example.com',
        status: 'pending',
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z',
      };

      const mockSingle = jest.fn().mockResolvedValue({ data: mockApplication, error: null });
      const mockEq = jest.fn().mockReturnValue({ single: mockSingle });
      const mockSelect = jest.fn().mockReturnValue({ eq: mockEq });
      mockSupabase.from.mockReturnValue({ select: mockSelect } as any);

      const result = await applicationService.getApplicationById('1');

      expect(result).toEqual(mockApplication);
      expect(mockEq).toHaveBeenCalledWith('id', '1');
    });

    it('should return null when application not found', async () => {
      const mockError = { message: 'Not found', code: 'PGRST116' };

      const mockSingle = jest.fn().mockResolvedValue({ data: null, error: mockError });
      const mockEq = jest.fn().mockReturnValue({ single: mockSingle });
      const mockSelect = jest.fn().mockReturnValue({ eq: mockEq });
      mockSupabase.from.mockReturnValue({ select: mockSelect } as any);

      const result = await applicationService.getApplicationById('1');

      expect(result).toBeNull();
    });

    it('should throw AppError for other errors', async () => {
      const mockError = { message: 'Database error', code: 'PGRST_ERROR' };

      const mockSingle = jest.fn().mockResolvedValue({ data: null, error: mockError });
      const mockEq = jest.fn().mockReturnValue({ single: mockSingle });
      const mockSelect = jest.fn().mockReturnValue({ eq: mockEq });
      mockSupabase.from.mockReturnValue({ select: mockSelect } as any);

      await expect(applicationService.getApplicationById('1')).rejects.toThrow(AppError);
    });
  });

  describe('getApplicationsByPetId', () => {
    it('should return applications for a specific pet', async () => {
      const mockApplications: Application[] = [
        {
          id: '1',
          pet_id: 'pet-1',
          applicant_name: 'John Doe',
          applicant_email: 'john@example.com',
          status: 'pending',
          created_at: '2024-01-01T00:00:00Z',
          updated_at: '2024-01-01T00:00:00Z',
        },
      ];

      const mockOrder = jest.fn().mockResolvedValue({ data: mockApplications, error: null });
      const mockEq = jest.fn().mockReturnValue({ order: mockOrder });
      const mockSelect = jest.fn().mockReturnValue({ eq: mockEq });
      mockSupabase.from.mockReturnValue({ select: mockSelect } as any);

      const result = await applicationService.getApplicationsByPetId('pet-1');

      expect(result).toEqual(mockApplications);
      expect(mockEq).toHaveBeenCalledWith('pet_id', 'pet-1');
    });

    it('should throw AppError when Supabase returns an error', async () => {
      const mockError = { message: 'Database error', code: 'PGRST_ERROR' };

      const mockOrder = jest.fn().mockResolvedValue({ data: null, error: mockError });
      const mockEq = jest.fn().mockReturnValue({ order: mockOrder });
      const mockSelect = jest.fn().mockReturnValue({ eq: mockEq });
      mockSupabase.from.mockReturnValue({ select: mockSelect } as any);

      await expect(applicationService.getApplicationsByPetId('pet-1')).rejects.toThrow(AppError);
    });
  });

  describe('createApplication', () => {
    const mockInput = {
      pet_id: 'pet-1',
      applicant_name: 'John Doe',
      applicant_email: 'john@example.com',
      status: 'pending' as const,
    };

    const mockPet = {
      id: 'pet-1',
      name: 'Fluffy',
      type: 'dog' as const,
      status: 'available' as const,
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z',
    };

    it('should create application successfully', async () => {
      const mockApplication: Application = {
        id: '1',
        ...mockInput,
        status: 'pending',
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z',
      };

      mockPetService.getPetById.mockResolvedValue(mockPet);

      const mockSingle = jest.fn().mockResolvedValue({ data: mockApplication, error: null });
      const mockSelect = jest.fn().mockReturnValue({ single: mockSingle });
      const mockInsert = jest.fn().mockReturnValue({ select: mockSelect });
      mockSupabase.from.mockReturnValue({ insert: mockInsert } as any);

      const result = await applicationService.createApplication(mockInput);

      expect(result).toEqual(mockApplication);
      expect(mockPetService.getPetById).toHaveBeenCalledWith('pet-1');
      expect(mockInsert).toHaveBeenCalledWith([mockInput]);
    });

    it('should throw AppError when pet not found', async () => {
      mockPetService.getPetById.mockResolvedValue(null);

      await expect(applicationService.createApplication(mockInput)).rejects.toThrow(AppError);
      await expect(applicationService.createApplication(mockInput)).rejects.toThrow('Pet not found');
    });

    it('should throw AppError when pet is not available', async () => {
      const unavailablePet = { ...mockPet, status: 'adopted' as const };
      mockPetService.getPetById.mockResolvedValue(unavailablePet);

      await expect(applicationService.createApplication(mockInput)).rejects.toThrow(AppError);
      await expect(applicationService.createApplication(mockInput)).rejects.toThrow(
        'Pet is not available for adoption'
      );
    });

    it('should throw AppError when Supabase insert fails', async () => {
      mockPetService.getPetById.mockResolvedValue(mockPet);

      const mockError = { message: 'Insert failed', code: 'PGRST_ERROR' };
      const mockSingle = jest.fn().mockResolvedValue({ data: null, error: mockError });
      const mockSelect = jest.fn().mockReturnValue({ single: mockSingle });
      const mockInsert = jest.fn().mockReturnValue({ select: mockSelect });
      mockSupabase.from.mockReturnValue({ insert: mockInsert } as any);

      await expect(applicationService.createApplication(mockInput)).rejects.toThrow(AppError);
    });

    it('should throw AppError when no data returned', async () => {
      mockPetService.getPetById.mockResolvedValue(mockPet);

      const mockSingle = jest.fn().mockResolvedValue({ data: null, error: null });
      const mockSelect = jest.fn().mockReturnValue({ single: mockSingle });
      const mockInsert = jest.fn().mockReturnValue({ select: mockSelect });
      mockSupabase.from.mockReturnValue({ insert: mockInsert } as any);

      await expect(applicationService.createApplication(mockInput)).rejects.toThrow(AppError);
      await expect(applicationService.createApplication(mockInput)).rejects.toThrow(
        'Failed to create application: No data returned'
      );
    });
  });

  describe('updateApplication', () => {
    const mockUpdateInput = {
      applicant_name: 'Jane Doe',
    };

    it('should update application successfully', async () => {
      const mockUpdatedApplication: Application = {
        id: '1',
        pet_id: 'pet-1',
        applicant_name: 'Jane Doe',
        applicant_email: 'jane@example.com',
        status: 'pending',
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z',
      };

      const mockSingle = jest.fn().mockResolvedValue({ data: mockUpdatedApplication, error: null });
      const mockSelect = jest.fn().mockReturnValue({ single: mockSingle });
      const mockEq = jest.fn().mockReturnValue({ select: mockSelect });
      const mockUpdate = jest.fn().mockReturnValue({ eq: mockEq });
      mockSupabase.from.mockReturnValue({ update: mockUpdate } as any);

      const result = await applicationService.updateApplication('1', mockUpdateInput);

      expect(result).toEqual(mockUpdatedApplication);
      expect(mockUpdate).toHaveBeenCalledWith(mockUpdateInput);
      expect(mockEq).toHaveBeenCalledWith('id', '1');
    });

    it('should throw AppError when application not found', async () => {
      const mockSingle = jest.fn().mockResolvedValue({ data: null, error: null });
      const mockSelect = jest.fn().mockReturnValue({ single: mockSingle });
      const mockEq = jest.fn().mockReturnValue({ select: mockSelect });
      const mockUpdate = jest.fn().mockReturnValue({ eq: mockEq });
      mockSupabase.from.mockReturnValue({ update: mockUpdate } as any);

      await expect(applicationService.updateApplication('1', mockUpdateInput)).rejects.toThrow(AppError);
      await expect(applicationService.updateApplication('1', mockUpdateInput)).rejects.toThrow(
        'Application not found'
      );
    });

    it('should throw AppError when Supabase update fails', async () => {
      const mockError = { message: 'Update failed', code: 'PGRST_ERROR' };

      const mockSingle = jest.fn().mockResolvedValue({ data: null, error: mockError });
      const mockSelect = jest.fn().mockReturnValue({ single: mockSingle });
      const mockEq = jest.fn().mockReturnValue({ select: mockSelect });
      const mockUpdate = jest.fn().mockReturnValue({ eq: mockEq });
      mockSupabase.from.mockReturnValue({ update: mockUpdate } as any);

      await expect(applicationService.updateApplication('1', mockUpdateInput)).rejects.toThrow(AppError);
    });
  });

  describe('deleteApplication', () => {
    it('should delete application successfully', async () => {
      const mockEq = jest.fn().mockResolvedValue({ error: null });
      const mockDelete = jest.fn().mockReturnValue({ eq: mockEq });
      mockSupabase.from.mockReturnValue({ delete: mockDelete } as any);

      await applicationService.deleteApplication('1');

      expect(mockDelete).toHaveBeenCalled();
      expect(mockEq).toHaveBeenCalledWith('id', '1');
    });

    it('should throw AppError when Supabase delete fails', async () => {
      const mockError = { message: 'Delete failed', code: 'PGRST_ERROR' };

      const mockEq = jest.fn().mockResolvedValue({ error: mockError });
      const mockDelete = jest.fn().mockReturnValue({ eq: mockEq });
      mockSupabase.from.mockReturnValue({ delete: mockDelete } as any);

      await expect(applicationService.deleteApplication('1')).rejects.toThrow(AppError);
    });
  });

  describe('approveApplication', () => {
    const mockApplication: Application = {
      id: '1',
      pet_id: 'pet-1',
      applicant_name: 'John Doe',
      applicant_email: 'john@example.com',
      status: 'pending',
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z',
    };

    it('should approve application successfully and update pet status', async () => {
      const mockUpdatedApplication: Application = {
        ...mockApplication,
        status: 'approved',
      };

      // Mock getApplicationById (called internally)
      const mockGetSingle = jest.fn().mockResolvedValue({ data: mockApplication, error: null });
      const mockGetEq = jest.fn().mockReturnValue({ single: mockGetSingle });
      const mockGetSelect = jest.fn().mockReturnValue({ eq: mockGetEq });

      // Mock update application to approved
      const mockUpdateSingle = jest.fn().mockResolvedValue({ data: mockUpdatedApplication, error: null });
      const mockUpdateSelect = jest.fn().mockReturnValue({ single: mockUpdateSingle });
      const mockUpdateEq = jest.fn().mockReturnValue({ select: mockUpdateSelect });

      // Mock reject other applications
      const mockRejectUpdate = jest.fn().mockResolvedValue({ error: null });
      const mockRejectNeq = jest.fn().mockReturnValue({ update: mockRejectUpdate });
      const mockRejectEq2 = jest.fn().mockReturnValue({ neq: mockRejectNeq });
      const mockRejectEq1 = jest.fn().mockReturnValue({ eq: mockRejectEq2 });

      let updateCallCount = 0;
      mockSupabase.from.mockImplementation((table: string) => {
        if (table === 'applications') {
          return {
            select: mockGetSelect,
            update: jest.fn().mockImplementation((data: any) => {
              updateCallCount++;
              if (updateCallCount === 1 && data.status === 'approved') {
                // First update: approve the application
                return { eq: mockUpdateEq };
              } else if (updateCallCount === 2 && data.status === 'rejected') {
                // Second update: reject other applications
                return { eq: mockRejectEq1 };
              }
              return { eq: jest.fn() };
            }),
          } as any;
        }
        return {} as any;
      });

      mockPetService.updatePet.mockResolvedValue({
        id: 'pet-1',
        name: 'Fluffy',
        type: 'dog' as const,
        status: 'adopted' as const,
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z',
      });

      const result = await applicationService.approveApplication('1', true);

      expect(result).toEqual(mockUpdatedApplication);
      expect(mockPetService.updatePet).toHaveBeenCalledWith('pet-1', { status: 'adopted' });
    });

    it('should throw AppError when application not found', async () => {
      const mockGetSingle = jest.fn().mockResolvedValue({ data: null, error: { code: 'PGRST116' } });
      const mockGetEq = jest.fn().mockReturnValue({ single: mockGetSingle });
      const mockGetSelect = jest.fn().mockReturnValue({ eq: mockGetEq });
      mockSupabase.from.mockReturnValue({ select: mockGetSelect } as any);

      await expect(applicationService.approveApplication('1')).rejects.toThrow(AppError);
      await expect(applicationService.approveApplication('1')).rejects.toThrow('Application not found');
    });

    it('should throw AppError when application is already approved', async () => {
      const approvedApplication: Application = {
        ...mockApplication,
        status: 'approved',
      };

      const mockGetSingle = jest.fn().mockResolvedValue({ data: approvedApplication, error: null });
      const mockGetEq = jest.fn().mockReturnValue({ single: mockGetSingle });
      const mockGetSelect = jest.fn().mockReturnValue({ eq: mockGetEq });
      mockSupabase.from.mockReturnValue({ select: mockGetSelect } as any);

      await expect(applicationService.approveApplication('1')).rejects.toThrow(AppError);
      await expect(applicationService.approveApplication('1')).rejects.toThrow(
        'Application is already approved'
      );
    });

    it('should throw AppError when application status is not pending', async () => {
      const rejectedApplication: Application = {
        ...mockApplication,
        status: 'rejected',
      };

      const mockGetSingle = jest.fn().mockResolvedValue({ data: rejectedApplication, error: null });
      const mockGetEq = jest.fn().mockReturnValue({ single: mockGetSingle });
      const mockGetSelect = jest.fn().mockReturnValue({ eq: mockGetEq });
      mockSupabase.from.mockReturnValue({ select: mockGetSelect } as any);

      await expect(applicationService.approveApplication('1')).rejects.toThrow(AppError);
      await expect(applicationService.approveApplication('1')).rejects.toThrow(
        'Cannot approve application with status: rejected'
      );
    });

    it('should rollback application status if pet update fails', async () => {
      const mockUpdatedApplication: Application = {
        ...mockApplication,
        status: 'approved',
      };

      const mockGetSingle = jest.fn().mockResolvedValue({ data: mockApplication, error: null });
      const mockGetEq = jest.fn().mockReturnValue({ single: mockGetSingle });
      const mockGetSelect = jest.fn().mockReturnValue({ eq: mockGetEq });

      const mockUpdateSingle = jest.fn().mockResolvedValue({ data: mockUpdatedApplication, error: null });
      const mockUpdateSelect = jest.fn().mockReturnValue({ single: mockUpdateSingle });
      const mockUpdateEq = jest.fn().mockReturnValue({ select: mockUpdateSelect });

      const mockRollbackEq = jest.fn().mockResolvedValue({ error: null });

      let updateCallCount = 0;
      mockSupabase.from.mockImplementation((table: string) => {
        if (table === 'applications') {
          return {
            select: mockGetSelect,
            update: jest.fn().mockImplementation((data: any) => {
              updateCallCount++;
              if (updateCallCount === 1 && data.status === 'approved') {
                return { eq: mockUpdateEq };
              } else if (updateCallCount === 2 && data.status === 'pending') {
                // Rollback
                return { eq: mockRollbackEq };
              }
              return { eq: jest.fn() };
            }),
          } as any;
        }
        return {} as any;
      });

      mockPetService.updatePet.mockRejectedValue(new Error('Pet update failed'));

      await expect(applicationService.approveApplication('1')).rejects.toThrow(AppError);
      expect(mockPetService.updatePet).toHaveBeenCalledWith('pet-1', { status: 'adopted' });
    });

    it('should not reject other applications when rejectOtherApplications is false', async () => {
      const mockUpdatedApplication: Application = {
        ...mockApplication,
        status: 'approved',
      };

      const mockGetSingle = jest.fn().mockResolvedValue({ data: mockApplication, error: null });
      const mockGetEq = jest.fn().mockReturnValue({ single: mockGetSingle });
      const mockGetSelect = jest.fn().mockReturnValue({ eq: mockGetEq });

      const mockUpdateSingle = jest.fn().mockResolvedValue({ data: mockUpdatedApplication, error: null });
      const mockUpdateSelect = jest.fn().mockReturnValue({ single: mockUpdateSingle });
      const mockUpdateEq = jest.fn().mockReturnValue({ select: mockUpdateSelect });

      mockSupabase.from.mockReturnValue({
        select: mockGetSelect,
        update: jest.fn().mockReturnValue({ eq: mockUpdateEq }),
      } as any);

      mockPetService.updatePet.mockResolvedValue({
        id: 'pet-1',
        name: 'Fluffy',
        type: 'dog' as const,
        status: 'adopted' as const,
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z',
      });

      const result = await applicationService.approveApplication('1', false);

      expect(result).toEqual(mockUpdatedApplication);
      expect(mockPetService.updatePet).toHaveBeenCalledWith('pet-1', { status: 'adopted' });
    });
  });

  describe('getApplicationsByStatus', () => {
    it('should return applications by status', async () => {
      const mockApplications: Application[] = [
        {
          id: '1',
          pet_id: 'pet-1',
          applicant_name: 'John Doe',
          applicant_email: 'john@example.com',
          status: 'pending',
          created_at: '2024-01-01T00:00:00Z',
          updated_at: '2024-01-01T00:00:00Z',
        },
      ];

      const mockOrder = jest.fn().mockResolvedValue({ data: mockApplications, error: null });
      const mockEq = jest.fn().mockReturnValue({ order: mockOrder });
      const mockSelect = jest.fn().mockReturnValue({ eq: mockEq });
      mockSupabase.from.mockReturnValue({ select: mockSelect } as any);

      const result = await applicationService.getApplicationsByStatus('pending');

      expect(result).toEqual(mockApplications);
      expect(mockEq).toHaveBeenCalledWith('status', 'pending');
    });

    it('should throw AppError when Supabase returns an error', async () => {
      const mockError = { message: 'Database error', code: 'PGRST_ERROR' };

      const mockOrder = jest.fn().mockResolvedValue({ data: null, error: mockError });
      const mockEq = jest.fn().mockReturnValue({ order: mockOrder });
      const mockSelect = jest.fn().mockReturnValue({ eq: mockEq });
      mockSupabase.from.mockReturnValue({ select: mockSelect } as any);

      await expect(applicationService.getApplicationsByStatus('pending')).rejects.toThrow(AppError);
    });
  });
});

