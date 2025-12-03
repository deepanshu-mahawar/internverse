"use client";

import { useState, ChangeEvent, FormEvent } from "react";
import { GraduationCap, ArrowLeft, CheckCircle } from "lucide-react";
import { useAuth } from "@/app/context/AuthContext";
import Input from "@/app/components/Input";
import Button from "@/app/components/Button";
import { useRouter } from "next/navigation";

interface StudentForm {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  studentId: string;
  department: string;
  year: string;
  phone: string;
  github_link: string;
}

interface Errors {
  [key: string]: string;
}

const RegisterStudent = () => {
  const navigate = useRouter();
  const { registerStudent } = useAuth();

  const [formData, setFormData] = useState<StudentForm>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    studentId: "",
    department: "",
    year: "",
    phone: "",
    github_link: "",
  });

  const [errors, setErrors] = useState<Errors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validate = (): Errors => {
    const newErrors: Errors = {};

    if (!formData.name.trim()) newErrors.name = "Full name is required";

    if (!formData.email) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = "Email is invalid";

    if (!formData.password) newErrors.password = "Password is required";
    else if (formData.password.length < 6)
      newErrors.password = "Password must be at least 6 characters";

    if (!formData.confirmPassword)
      newErrors.confirmPassword = "Please confirm your password";
    else if (formData.password !== formData.confirmPassword)
      newErrors.confirmPassword = "Passwords do not match";

    if (!formData.studentId.trim())
      newErrors.studentId = "Student ID is required";

    if (!formData.department) newErrors.department = "Department is required";

    if (!formData.year) newErrors.year = "Year is required";

    if (!formData.phone.trim()) newErrors.phone = "Phone number is required";

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

    const result = await registerStudent(formData);

    if (result.success) {
      setShowSuccess(true);
      alert("success");
      setTimeout(() => navigate.push("/login/student"), 2000);
    } else {
      setErrors({ general: result.message });
      alert("error");
      setIsSubmitting(false);
    }
  };

  if (showSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="text-green-600" size={32} />
            </div>
          </div>
          <h2 className="text-3xl font-bold text-gray-800 mb-2">
            Registration Successful!
          </h2>
          <p className="text-gray-600 mb-4">
            Welcome to Intern Verse. Redirecting to login...
          </p>
          <p className="text-sm text-gray-500">
            Your account has been created and is ready to use.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto">
        <button
          onClick={() => navigate.push("/")}
          className="flex items-center text-indigo-600 hover:text-indigo-700 mb-8"
        >
          <ArrowLeft size={20} className="mr-2" />
          Back to Home
        </button>

        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-14 h-14 bg-indigo-600 rounded-full mb-4">
              <GraduationCap className="text-white" size={28} />
            </div>
            <h1 className="text-2xl font-bold text-gray-800">
              Student Registration
            </h1>
            <p className="text-gray-600 mt-2">
              Create your account to get started
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Full Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your full name"
              error={errors.name}
              required
            />

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
              placeholder="Create a password"
              error={errors.password}
              required
            />

            <Input
              label="Confirm Password"
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm your password"
              error={errors.confirmPassword}
              required
            />

            <Input
              label="Student ID"
              name="studentId"
              value={formData.studentId}
              onChange={handleChange}
              placeholder="e.g., STU2024001"
              error={errors.studentId}
              required
            />

            {/* Department */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Department <span className="text-red-500">*</span>
              </label>
              <select
                name="department"
                value={formData.department}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                  errors.department ? "border-red-500" : "border-gray-300"
                }`}
                required
              >
                <option value="">Select Department</option>
                <option value="Computer Science">Computer Science</option>
                <option value="Information Technology">
                  Information Technology
                </option>
                <option value="Electronics">Electronics</option>
                <option value="Mechanical">Mechanical</option>
                <option value="Civil">Civil</option>
                <option value="Other">Other</option>
              </select>
              {errors.department && (
                <p className="mt-1 text-sm text-red-500">{errors.department}</p>
              )}
            </div>

            {/* Year */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Year <span className="text-red-500">*</span>
              </label>
              <select
                name="year"
                value={formData.year}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                  errors.year ? "border-red-500" : "border-gray-300"
                }`}
                required
              >
                <option value="">Select Year</option>
                <option value="1st Year">1st Year</option>
                <option value="2nd Year">2nd Year</option>
                <option value="3rd Year">3rd Year</option>
                <option value="4th Year">4th Year</option>
              </select>
              {errors.year && (
                <p className="mt-1 text-sm text-red-500">{errors.year}</p>
              )}
            </div>

            <Input
              label="Phone Number"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Enter your phone number"
              error={errors.phone}
              required
            />

            <Input
              label="GitHub Link"
              name="github_link"
              value={formData.github_link}
              onChange={handleChange}
              placeholder="Enter your GitHub link"
              error={errors.github_link}
            />

            <Button
              type="submit"
              variant="primary"
              className="w-full"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Creating Account..." : "Create Account"}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Already have an account?{" "}
              <button
                onClick={() => navigate.push("/login/student")}
                className="text-indigo-600 hover:text-indigo-700 font-medium"
              >
                Login here
              </button>
            </p>
          </div>

          <div className="mt-4 p-4 bg-blue-50 rounded-lg">
            <p className="text-xs text-blue-800">
              <strong>Demo Account:</strong> student@internverse.com /
              student123
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterStudent;
