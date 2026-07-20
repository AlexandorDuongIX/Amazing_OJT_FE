import axiosClient from './axiosClient';

export interface UserAddressDto {
  id: number;
  userId: number;
  receiverName: string;
  phone: string;
  addressLine: string;
  ward?: string;
  district?: string;
  province?: string;
  isDefault: boolean;
}

export interface CreateAddressRequest {
  receiverName: string;
  phone: string;
  addressLine: string;
  ward?: string;
  district?: string;
  province?: string;
  isDefault?: boolean;
}

export interface UpdateAddressRequest {
  receiverName: string;
  phone: string;
  addressLine: string;
  ward?: string;
  district?: string;
  province?: string;
  isDefault?: boolean;
}

export const addressApi = {
  /** Get all addresses for current user */
  getMyAddresses: async (): Promise<UserAddressDto[]> => {
    return axiosClient.get<any, UserAddressDto[]>('/useraddresses');
  },

  /** Get address by ID */
  getAddressById: async (id: number): Promise<UserAddressDto> => {
    return axiosClient.get<any, UserAddressDto>(`/useraddresses/${id}`);
  },

  /** Create a new address */
  createAddress: async (data: CreateAddressRequest): Promise<UserAddressDto> => {
    return axiosClient.post<any, UserAddressDto>('/useraddresses', data);
  },

  /** Update an existing address */
  updateAddress: async (id: number, data: UpdateAddressRequest): Promise<UserAddressDto> => {
    return axiosClient.put<any, UserAddressDto>(`/useraddresses/${id}`, data);
  },

  /** Delete an address */
  deleteAddress: async (id: number): Promise<void> => {
    return axiosClient.delete(`/useraddresses/${id}`);
  },

  /** Set address as default */
  setDefaultAddress: async (id: number): Promise<UserAddressDto> => {
    return axiosClient.put<any, UserAddressDto>(`/useraddresses/${id}/set-default`);
  },
};

