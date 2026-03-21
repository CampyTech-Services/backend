export class CreateAdminDto {
  name!: string;
  displayName!: string;
  email!: string;
  password!: string;
  shortBio?: string;
  role!: string;
  profilePicture?: string;
}
