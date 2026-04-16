export interface UserProfile {
  id: string; // Unique ID for multi-account support
  fullName: string;
  dateOfBirth: string;
  gender: string;
  mobile: string;
  pincode: string;
  state: string;
  district: string;
  address: string;
  abhaNumber?: string;
  abhaAddress?: string;
}

export interface HospitalDetails {
  hipId: string;
  counterId: string;
  name?: string;
  location?: string;
}

export interface Visit {
  id: string;
  hospitalName: string;
  location: string;
  date: string;
  time: string;
  tokenNumber: string;
  type: string;
  abhaNumber?: string;
  patientName?: string;
  counterId?: string;
  status: 'Completed' | 'Pending';
}

export type RootStackParamList = {
  ProfileSetup: undefined;
  Home: { profile: UserProfile };
  Scanner: undefined;
  HospitalDetails: { hospital: HospitalDetails };
  FinalProfileShare: { hospital: HospitalDetails; profile: UserProfile };
  Processing: { hospital: HospitalDetails };
  Token: { hospital: HospitalDetails };
  HealthLocker: undefined;
  Instructions: undefined;
  SelectProfile: undefined;
};
