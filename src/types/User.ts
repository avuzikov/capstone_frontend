// src\types\User.ts

export interface UserRegistration {
  email: string;
  password: string;
  fullName: string;
}

export interface UserLogin {
  email: string;
  password: string;
}
