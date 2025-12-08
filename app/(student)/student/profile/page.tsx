"use client";

import { useState } from "react";

import { User, Mail, GraduationCap, Save } from "lucide-react";
import axios from "axios";
import { useAuth } from "@/app/context/AuthContext";
import Card from "@/app/components/Card";
import Input from "@/app/components/Input";
import Button from "@/app/components/Button";

const StudentProfile: React.FC = () => {
  const { user } = useAuth();

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<any>({
    name: user?.name || "",
    email: user?.email || "",
    department: user?.department || "",
    year: user?.year || "",
    phone: user?.phone || "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev: any) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.id) return;

    try {
      await axios.put(
        `http://127.0.0.1:5000/api/students/${user.id}`,
        formData
      );
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  const resetForm = () => {
    setFormData({
      name: user?.name || "",
      email: user?.email || "",
      department: user?.department || "",
      year: user?.year || "",
      phone: user?.phone || "",
    });
    setIsEditing(false);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-3xl font-bold text-gray-800">Profile</h1>
        <p className="text-gray-600 mt-1">Manage your personal information</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="text-center">
          <div className="w-32 h-32 rounded-full mx-auto mb-4 bg-indigo-100 flex items-center justify-center">
            <User className="text-indigo-600" size={48} />
          </div>
          <h3 className="text-xl font-semibold text-gray-800">{user?.name}</h3>
          <p className="text-gray-600 capitalize">{user?.role}</p>
        </Card>

        <div className="md:col-span-2">
          <Card title="Personal Information">
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Full Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                disabled={!isEditing}
                icon={<User />}
              />

              <Input
                label="Email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                disabled={!isEditing}
                icon={<Mail />}
              />

              {/* Student ID removed */}

              <Input
                label="Department"
                name="department"
                value={formData.department}
                onChange={handleChange}
                disabled={!isEditing}
                icon={<GraduationCap />}
              />

              <Input
                label="Year"
                name="year"
                value={formData.year}
                onChange={handleChange}
                disabled={!isEditing}
              />

              <Input
                label="Phone Number"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                disabled={!isEditing}
              />

              <div className="flex space-x-3 pt-4">
                {isEditing ? (
                  <>
                    <Button type="submit" variant="success">
                      <Save size={18} className="mr-2" />
                      Save Changes
                    </Button>
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={resetForm}
                    >
                      Cancel
                    </Button>
                  </>
                ) : (
                  <Button
                    type="button"
                    variant="primary"
                    onClick={() => setIsEditing(true)}
                  >
                    Edit Profile
                  </Button>
                )}
              </div>
            </form>
          </Card>
        </div>
      </div>

      <Card title="Account Statistics">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-indigo-600">Active</p>
            <p className="text-sm text-gray-600 mt-1">Account Status</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-indigo-600">2024</p>
            <p className="text-sm text-gray-600 mt-1">Member Since</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-indigo-600">{user?.year}</p>
            <p className="text-sm text-gray-600 mt-1">Current Year</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-indigo-600">
              {user?.department}
            </p>
            <p className="text-sm text-gray-600 mt-1">Department</p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default StudentProfile;
