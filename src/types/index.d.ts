declare namespace Express {
  export interface Request {
    user?: {
      id?: string
      role?: string
      companyId?: string | null
      employeeId?: string | null
    }
    files?: any
  }
}
