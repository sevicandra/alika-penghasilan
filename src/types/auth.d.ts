import { Request } from "express";
export interface AuthenticatedRequest extends Request {
  user?: any;
  roles?: {
    kode_satker: string;
    roles: {
      kode: string;
      nama: string;
    }[];
  }[];
  globalRoles?: {
    kode: string;
    nama: string;
  }[];
}
