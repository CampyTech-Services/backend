export interface AuthenticatedAdminDto {
  id: string;
  name: string;
  displayName: string;
  email: string;
  shortBio?: string;
  role: string;
  profilePicture?: string;
  isVerified: boolean;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface LoginAdminResponseDto {
  accessToken: string;
  expiresIn: string | number;
  admin: AuthenticatedAdminDto;
}
