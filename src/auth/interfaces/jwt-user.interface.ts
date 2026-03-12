import { UserRole } from '@prisma/client';

export interface JwtUser {
  id: string;
  email: string;
  full_name: string | null;
  role: UserRole;
  created_at: Date;
  updated_at: Date;
}
