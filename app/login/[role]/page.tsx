"use client";

import { useState, ChangeEvent, FormEvent } from "react";
import { useRouter, useParams } from "next/navigation";

import { GraduationCap } from "lucide-react";
import Button from "@/app/components/Button";
import Input from "@/app/components/Input";
import { useAuth } from "@/app/context/AuthContext";

type Role = "student" | "mentor" | "admin";

interface Errors {
  email?: string;
  password?: string;
  general?: string;
}

const Login = () => {
  const params = useParams();
  const router = useRouter();
  const { login } = useAuth();

  const role = (params?.role as Role) || "student";

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState<Errors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const roleConfig: Record<Role, { title: string; color: string }> = {
    student: { title: "Student Login", color: "indigo" },
    mentor: { title: "Mentor Login", color: "green" },
    admin: { title: "Admin Login", color: "red" },
  };

  const config = roleConfig[role];

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errors[name as keyof Errors]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validate = () => {
    const newErrors: Errors = {};

    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    }

    return newErrors;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);

    const result = await login(formData.email, formData.password, role);

    if (result.success) {
      router.push(`/${role}/dashboard`);
    } else {
      setErrors({ general: result.message });
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo + Heading */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-600 rounded-full mb-4">
            <GraduationCap className="text-white" size={32} />
          </div>
          <h1 className="text-3xl font-bold text-gray-800">Intern Verse</h1>
          <p className="text-gray-600 mt-2">
            Internship & Project Management Portal
          </p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            {config.title}
          </h2>

          {errors.general && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
              {errors.general}
            </div>
          )}

          {/* FORM */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              error={errors.email}
              required
            />

            <Input
              label="Password"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              error={errors.password}
              required
            />

            <Button
              type="submit"
              variant="primary"
              className="w-full"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Logging in..." : "Login"}
            </Button>
          </form>

          {/* Demo Creds */}
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <p className="text-xs font-semibold text-gray-700 mb-2">
              Demo Credentials:
            </p>
            <p className="text-xs text-gray-600">
              Email: {role}@internverse.com
              <br />
              Password: {role}123
            </p>
          </div>

          {/* Role Switch */}
          <div className="mt-4 text-center text-sm text-gray-600">
            <span>Login as: </span>
            {Object.keys(roleConfig).map((r) => (
              <button
                key={r}
                onClick={() => router.push(`/login/${r}`)}
                className={`ml-2 ${
                  r === role
                    ? "text-indigo-600 font-semibold"
                    : "text-gray-500 hover:text-indigo-600"
                }`}
              >
                {r.charAt(0).toUpperCase() + r.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
