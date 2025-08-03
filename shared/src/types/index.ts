// API Response types
export interface ApiResponse<T = any> {
  message: string;
  success: boolean;
  data?: T;
}

// User types based on server schema
export interface User {
  id: number;
  username: string;
  fullName: string;
  role: string;
  classId?: number;
}

// Auth types
export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  message: string;
  token: string;
  success: boolean;
}

export interface AuthPayload {
  userId: number;
  fullName: string;
  classId?: number;
  exp: number;
  username: string;
  role: string;
  class?: Class;
}

export interface VerifyResponse {
  message: string;
  user: AuthPayload;
  success: boolean;
}

// Class types
export interface Class {
  id: number;
  className: string;
}

// Subject types
export interface Subject {
  id: number;
  subjectName: string;
  description: string;
  teacherId: number;
  classId: number;
}

// Post types
export interface Post {
  id: number;
  title: string;
  content: string;
  type: string;
  createdAt: string;
  deadline?: string;
  subjectId: number;
}

// Submission types
export interface Submission {
  id: number;
  assignmentId: number;
  status: string;
  content?: string;
  fileUrl?: string[];
  submittedAt: string;
  grade?: number;
  feedback?: string;
  userId: number;
}
