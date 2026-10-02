export type Status =
  | "APPLIED"
  | "SCREENING"
  | "INTERVIEW"
  | "OFFER"
  | "REJECTED"
  | "WITHDRAWN"

export interface Application {
  id: string
  company: string
  position: string
  status: Status
  location?: string | null
  salary?: string | null
  url?: string | null
  notes?: string | null
  appliedAt: string
  updatedAt: string
}

export interface ApplicationFormData {
  company: string
  position: string
  status: Status
  location?: string
  salary?: string
  url?: string
  notes?: string
}