export enum UserRole {
  Elder = 'elder',
  Caregiver = 'caregiver'
}

export enum Gender {
  Male = 'male',
  Female = 'female',
  Other = 'other'
}

export enum HealthIndicatorType {
  BloodPressure = 'bloodPressure',
  Glucose = 'glucose',
  Weight = 'weight'
}

export interface User {
  id: string;
  name: string;
  gender: Gender;
  phone_number: string;
  role: UserRole;
  age: number;
  health_status: 'normal' | 'warning' | 'critical';
  joined_at: string;
  avatar_color?: string;
}

export interface HealthRecord {
  id: string;
  user_id: string;
  user_name: string;
  type: HealthIndicatorType;
  recorded_at: string;
  systolic?: number;
  diastolic?: number;
  pulse?: number;
  glucose?: number; // mmol/L
  weight?: number;
  status: 'normal' | 'warning' | 'critical';
}

export interface Medication {
  id: string;
  user_id: string;
  name: string;
  dosage: string;
  frequency: string;
  next_intake: string;
  is_active: boolean;
}

export interface MedicationIntake {
  id: string;
  user_id: string;
  user_name: string;
  medication_name: string;
  intake_date: string;
  intake_time: string;
  status: 'taken' | 'missed' | 'pending';
}

export interface DashboardStats {
  totalUsers: number;
  activeAlerts: number;
  medicationCompliance: number;
  newUsersToday: number;
}
