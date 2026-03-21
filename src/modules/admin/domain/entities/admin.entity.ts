export class Admin {
  id!: string;
  name!: string;
  displayName!: string;
  email!: string;
  password!: string;
  shortBio?: string;
  role!: string;
  profilePicture?: string;
  isVerified!: boolean;
  isActive!: boolean;
  createdAt!: Date;
  updatedAt!: Date;

  constructor(data: { id?: string; name: string; displayName: string; email: string; password: string; shortBio?: string; role: string; profilePicture?: string; isVerified?: boolean; isActive?: boolean; createdAt?: Date; updatedAt?: Date }) {
    Object.assign(this, data);
    this.name = Admin.requireText(data.name, 'name');
    this.displayName = Admin.requireText(data.displayName, 'displayName');
    this.email = Admin.normalizeEmail(data.email);
    this.password = Admin.requireText(data.password, 'password');
    this.role = Admin.requireText(data.role, 'role');
    this.shortBio = data.shortBio?.trim() || undefined;
    this.profilePicture = data.profilePicture?.trim() || undefined;
    this.isVerified = data.isVerified ?? false;
    this.isActive = data.isActive ?? true;
  }

  static normalizeEmail(email: string): string {
    return Admin.requireText(email, 'email').toLowerCase();
  }

  updateProfile(data: { name?: string; displayName?: string; email?: string; shortBio?: string; role?: string; profilePicture?: string }): void {
    if (data.name !== undefined) this.name = Admin.requireText(data.name, 'name');
    if (data.displayName !== undefined) this.displayName = Admin.requireText(data.displayName, 'displayName');
    if (data.email !== undefined) this.email = Admin.normalizeEmail(data.email);
    if (data.shortBio !== undefined) this.shortBio = data.shortBio?.trim() || undefined;
    if (data.role !== undefined) this.role = Admin.requireText(data.role, 'role');
    if (data.profilePicture !== undefined) this.profilePicture = data.profilePicture?.trim() || undefined;
  }

  setPassword(password: string): void {
    this.password = Admin.requireText(password, 'password');
  }

  setActiveStatus(isActive: boolean): void {
    this.isActive = isActive;
  }

  setVerifiedStatus(isVerified: boolean): void {
    this.isVerified = isVerified;
  }

  private static requireText(value: string, field: string): string {
    const normalized = value?.trim();
    if (!normalized) {
      throw new Error(`Admin ${field} cannot be empty`);
    }
    return normalized;
  }
}
