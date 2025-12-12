"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
import axios, { AxiosError } from "axios";
import { useRouter } from "next/navigation";

type Role = "student" | "mentor" | "admin";

interface User {
  id?: string;
  name: string;
  email: string;
  role?: Role;
  department?: string;
  specialization?: string;
  phone?: string;
  year?: string;
  github_link?: string;
  experience?: string;
  company?: string;
}

interface LoginResponse {
  success: boolean;
  user?: User;
  message?: string;
}

interface RegisterResponse {
  success: boolean;
  message: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (
    email: string,
    password: string,
    role: Role
  ) => Promise<LoginResponse>;
  logout: () => void;
  registerStudent: (formData: any) => Promise<RegisterResponse>;
  registerMentor: (formData: any) => Promise<RegisterResponse>;
  registerAdmin: (formData: any) => Promise<RegisterResponse>;
  updateProfile: (
    userId: string,
    role: Role,
    formData: Partial<User>
  ) => Promise<RegisterResponse>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside AuthProvider");
  return context;
};

interface ProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: ProviderProps) => {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const login = async (
    email: string,
    password: string,
    role: Role
  ): Promise<LoginResponse> => {
    setLoading(true);

    try {
      const response = await axios.post(
        `http://127.0.0.1:5000/api/${role}s/login`,
        {
          email,
          password,
        }
      );

      const userData = response.data.user as User;

      setUser(userData);
      setLoading(false);

      return { success: true, user: userData };
    } catch (err) {
      setLoading(false);
      const error = err as AxiosError<any>;
      return {
        success: false,
        message:
          error.response?.data?.message || "Login failed. Please try again.",
      };
    }
  };

  const registerStudent = async (formData: any): Promise<RegisterResponse> => {
    setLoading(true);

    try {
      await axios.post("http://127.0.0.1:5000/api/students/register", {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        department: formData.department,
        year: formData.year,
        phone: formData.phone,
        github_link: formData.github_link || "",
      });

      setLoading(false);
      return {
        success: true,
        message: "Registration successful. You can now log in.",
      };
    } catch (err) {
      setLoading(false);
      const error = err as AxiosError<any>;
      return {
        success: false,
        message:
          error.response?.data?.message ||
          "Registration failed. Please try again.",
      };
    }
  };

  const registerMentor = async (formData: any): Promise<RegisterResponse> => {
    setLoading(true);

    try {
      await axios.post("http://127.0.0.1:5000/api/mentors/register", {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        department: formData.department,
        specialization: formData.specialization,
        phone: formData.phone,
        experience: formData.experience,
        company: formData.company,
        expertise: formData.specialization,
      });

      setLoading(false);
      return {
        success: true,
        message: "Registration successful. You can now log in.",
      };
    } catch (err) {
      setLoading(false);
      const error = err as AxiosError<any>;
      return {
        success: false,
        message:
          error.response?.data?.message ||
          "Registration failed. Please try again.",
      };
    }
  };

  const registerAdmin = async (formData: any): Promise<RegisterResponse> => {
    setLoading(true);

    try {
      await axios.post("http://127.0.0.1:5000/api/admins/register", {
        name: formData.name,
        email: formData.email,
        password: formData.password,
      });

      setLoading(false);
      return {
        success: true,
        message: "Registration successful. You can now log in.",
      };
    } catch (err) {
      setLoading(false);
      const error = err as AxiosError<any>;
      return {
        success: false,
        message:
          error.response?.data?.message ||
          "Registration failed. Please try again.",
      };
    }
  };

  const logout = () => {
    // setUser(null);
    localStorage.removeItem("token");
    router.refresh();
  };

  const updateProfile = async (
    userId: string,
    role: Role,
    formData: Partial<User>
  ): Promise<RegisterResponse> => {
    setLoading(true);

    try {
      const response = await axios.put(
        `http://127.0.0.1:5000/api/${role}s/${userId}`,
        formData
      );

      const updatedUser = response.data.user as User;

      setUser((prev) => (prev ? { ...prev, ...updatedUser } : prev));
      setLoading(false);

      return { success: true, message: "Profile updated successfully." };
    } catch (err) {
      setLoading(false);
      const error = err as AxiosError<any>;

      return {
        success: false,
        message: error.response?.data?.message || "Failed to update profile.",
      };
    }
  };

  const value: AuthContextType = {
    user,
    login,
    logout,
    loading,
    isAuthenticated: !!user,
    registerStudent,
    registerMentor,
    registerAdmin,
    updateProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
