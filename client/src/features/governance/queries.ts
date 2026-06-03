import queryClient from "@/config/query-client";
import { CACHE_KEYS } from "@/constants/common";
import { authService } from "@/services";
import { ISector, IUserOption } from "@/services/auth.service";
import {
  permissionService,
  questionnaireService,
  roleService,
  userIdentityService,
  vendorService,
} from "@/services/governance";
import { useMutation, useQuery } from "@tanstack/react-query";

export const useGetAllRoleTypes = () => {
  return useQuery({
    queryKey: [CACHE_KEYS.ROLE_TYPE],
    queryFn: roleService.getAllRoleTypes,
  });
};

export const useCreateRoleType = () => {
  return useMutation({
    mutationFn: roleService.createNewRoleType,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [CACHE_KEYS.ROLE_TYPE],
      });
    },
  });
};

export const useUpdateRoleType = () => {
  return useMutation({
    mutationFn: roleService.updateRoleTypeById,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [CACHE_KEYS.ROLE_TYPE],
      });
    },
  });
};

export const useDeleteRoleType = () => {
  return useMutation({
    mutationFn: roleService.deleteRoleTypeById,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [CACHE_KEYS.ROLE_TYPE],
      });
    },
  });
};

//user options
export const useGetAllUserOptions = () => {
  return useQuery({
    queryKey: [CACHE_KEYS.USER, "ALL"],
    queryFn: authService.getAllUsers,
    select(data) {
      if (data?.data) {
        return data?.data?.map((item) => {
          return {
            value: item.pkid,
            label: `${item.name} (${item.email})`,
            original: item,
          };
        });
      }

      return [] as IStrFormLabel<IUserOption>[];
    },
  });
};

export const useGetAllSectorOptions = () => {
  return useQuery({
    queryKey: [CACHE_KEYS.SECTOR, "ALL"],
    queryFn: authService.getAllSectors,
    select(data) {
      if (data?.data) {
        return data?.data?.map((item) => {
          return {
            value: item.pkid,
            label: `${item.name}`,
            original: item,
          };
        });
      }

      return [] as IStrFormLabel<ISector>[];
    },
  });
};

export const useGetAllRoleTypeOptions = () => {
  return useQuery({
    queryKey: [CACHE_KEYS.ROLE_TYPE, "ALL"],
    queryFn: roleService.getAllRoleTypes,
    select(data) {
      if (data?.data) {
        return data?.data?.map((item) => {
          return {
            value: item.pkid,
            label: `${item.name}`,
            original: item,
          };
        });
      }

      return [] as IStrFormLabel<ISector>[];
    },
  });
};

export const useGetAllUserIdentity = () => {
  return useQuery({
    queryKey: [CACHE_KEYS.USER_IDENTITY],
    queryFn: userIdentityService.getAllRecords,
  });
};

export const useCreateUserIdentity = () => {
  return useMutation({
    mutationFn: userIdentityService.createRecord,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [CACHE_KEYS.USER_IDENTITY],
      });
    },
  });
};

export const useUpdateUserIdentity = () => {
  return useMutation({
    mutationFn: userIdentityService.updateRecordById,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [CACHE_KEYS.USER_IDENTITY],
      });
    },
  });
};

export const useDeleteUserIdentity = () => {
  return useMutation({
    mutationFn: userIdentityService.deleteRecordById,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [CACHE_KEYS.USER_IDENTITY],
      });
    },
  });
};

export const useGetAllRoles = () => {
  return useQuery({
    queryKey: [CACHE_KEYS.ROLE],
    queryFn: roleService.getAllRoles,
  });
};

export const useCreateNewRole = () => {
  return useMutation({
    mutationFn: roleService.createNewRole,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [CACHE_KEYS.ROLE],
      });
    },
  });
};

export const useUpdateRoleById = () => {
  return useMutation({
    mutationFn: roleService.updateRoleById,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [CACHE_KEYS.ROLE],
      });
    },
  });
};

export const useDeleteRoleById = () => {
  return useMutation({
    mutationFn: roleService.deleteRoleById,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [CACHE_KEYS.ROLE],
      });
    },
  });
};

// -------------- Governance Module ------------

//--------- Vendor ----------
export const useGetAllVendors = () => {
  return useQuery({
    queryKey: [CACHE_KEYS.VENDOR],
    queryFn: vendorService.getAllRecords,
  });
};

export const useCreateNewVendor = () => {
  return useMutation({
    mutationFn: vendorService.createRecord,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [CACHE_KEYS.VENDOR],
      });
    },
  });
};

export const useUpdateVendorById = () => {
  return useMutation({
    mutationFn: vendorService.updateRecordById,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [CACHE_KEYS.VENDOR],
      });
    },
  });
};

export const useDeleteVendorById = () => {
  return useMutation({
    mutationFn: vendorService.deleteRecordById,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [CACHE_KEYS.VENDOR],
      });
    },
  });
};

// -------------------------- Questionnaire ----------------------------

export const useGetAllQuestionnaires = () => {
  return useQuery({
    queryKey: [CACHE_KEYS.QUESTIONNAIRE],
    queryFn: questionnaireService.getAllRecords,
  });
};

export const useCreateNewQuestionnaire = () => {
  return useMutation({
    mutationFn: questionnaireService.createRecord,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [CACHE_KEYS.QUESTIONNAIRE],
      });
    },
  });
};

export const useUpdateQuestionnaireById = () => {
  return useMutation({
    mutationFn: questionnaireService.updateRecordById,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [CACHE_KEYS.QUESTIONNAIRE],
      });
    },
  });
};

export const useGetQuestionnaireById = (id?: string) => {
  return useQuery({
    queryKey: [CACHE_KEYS.QUESTIONNAIRE, id],
    queryFn: () => questionnaireService.getRecordById(id || ""),
    enabled: !!id,
  });
};

export const useDeleteQuestionnaireById = () => {
  return useMutation({
    mutationFn: questionnaireService.deleteRecordById,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [CACHE_KEYS.QUESTIONNAIRE],
      });
    },
  });
};

//---------- Permission ----------
export const useGetAllPermissions = () => {
  return useQuery({
    queryKey: [CACHE_KEYS.PERMISSION],
    queryFn: permissionService.getAllRecords,
  });
};

export const useCreateNewPermission = () => {
  return useMutation({
    mutationFn: permissionService.createRecord,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [CACHE_KEYS.PERMISSION],
      });
    },
  });
};

export const useUpdatePermissionById = () => {
  return useMutation({
    mutationFn: permissionService.updateRecordById,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [CACHE_KEYS.PERMISSION],
      });
    },
  });
};

export const useDeletePermissionById = () => {
  return useMutation({
    mutationFn: permissionService.deleteRecordById,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [CACHE_KEYS.PERMISSION],
      });
    },
  });
};
