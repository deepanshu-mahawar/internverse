"use client"

import { useState, useEffect, ChangeEvent, FormEvent } from "react";

import { User, Mail, Save } from "lucide-react";
import { useAuth } from "@/app/context/AuthContext";
import Card from "@/app/components/Card";
import Input from "@/app/components/Input";
import Button from "@/app/components/Button";

interface FormData {
  name: string;
  email: string;
}

const AdminProfile: React.FC = () => {
  const { user, updateProfile } = useAuth();
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [formData, setFormData] = useState<FormData>({
    name: user?.name || "",
    email: user?.email || "",
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name,
        email: user.email,
      });
    }
  }, [user]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user) return;
    setLoading(true);
    try {
      const result = await updateProfile(user.id, "admin", formData);
      if (result.success) {
        setIsEditing(false);
      } else {
        setError(result.message || "Failed to update profile.");
      }
    } catch (err) {
      setError("Failed to update profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!user)
    return <div className="text-center py-8">Unauthorized. Please log in.</div>;

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-3xl font-bold text-gray-800">Profile</h1>
        <p className="text-gray-600 mt-1">
          Manage your admin account information
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="text-center">
          <div className="w-32 h-32 rounded-full mx-auto mb-4 bg-indigo-100 flex items-center justify-center text-indigo-600 text-4xl font-medium">
            {user.name.charAt(0)}
          </div>
          <h3 className="text-xl font-semibold text-gray-800">{user.name}</h3>
          <p className="text-gray-600 capitalize">{user.role}</p>
          <div className="mt-4">
            <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-medium">
              Super Admin
            </span>
          </div>
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
                icon={User}
              />
              <Input
                label="Email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                disabled={!isEditing}
                icon={Mail}
              />
              <div className="flex space-x-3 pt-4">
                {isEditing ? (
                  <>
                    <Button type="submit" variant="success" disabled={loading}>
                      <Save size={18} className="mr-2" />
                      {loading ? "Saving..." : "Save Changes"}
                    </Button>
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={() => {
                        setIsEditing(false);
                        setFormData({
                          name: user.name,
                          email: user.email,
                        });
                      }}
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
              {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
            </form>
          </Card>
        </div>
      </div>

      <Card title="Account Privileges">
        <div className="space-y-3">
          {[
            "User Management",
            "Project Management",
            "System Settings",
            "Reports & Analytics",
          ].map((privilege) => (
            <div
              key={privilege}
              className="flex items-center justify-between p-3 bg-green-50 rounded-lg"
            >
              <span className="text-gray-700">{privilege}</span>
              <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                Full Access
              </span>
            </div>
          ))}
        </div>
      </Card>

      <Card title="Security Settings">
        <div className="space-y-3">
          <Button variant="outline" className="w-full">
            Change Password
          </Button>
          <Button variant="outline" className="w-full">
            Enable Two-Factor Authentication
          </Button>
          <Button variant="outline" className="w-full">
            View Login History
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default AdminProfile;
