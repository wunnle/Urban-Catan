export interface RegistrationData {
  name: string;
  phone: string;
}

export interface RegistrationResponse {
  success: boolean;
  message: string;
}

export interface SheetRow {
  name: string;
  phone: string;
  registeredAt: string;
}
