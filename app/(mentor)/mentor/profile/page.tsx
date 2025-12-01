import { useState, useEffect, ChangeEvent, FormEvent } from "react";

import { User, Mail, GraduationCap, Hash, Save } from "lucide-react";
import axios from "axios";
import { useAuth } from "@/app/context/AuthContext";
import Card from "@/app/components/Card";
import Input from "@/app/components/Input";
import Button from "@/app/components/Button";

interface Mentor {
  id: string;
  name: string;
  email: string;
  department: string;
  specialization: string;
  phone?: string;
  expertise?: string;
  experience?: string;
  company?: string;
  role?: string;
}

interface FormData {
  name: string;
  email: string;
  department: string;
  specialization: string;
  phone: string;
  expertise: string;
  experience: string;
  company: string;
}

const MentorProfile: React.FC = () => {
  const { user } = useAuth() as { user: Mentor | null };
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    name: user?.name || "",
    email: user?.email || "",
    department: user?.department || "",
    specialization: user?.specialization || "",
    phone: user?.phone || "",
    expertise: user?.expertise || "",
    experience: user?.experience || "",
    company: user?.company || "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMentorDetails = async () => {
      if (!user?.id) return;
      try {
        const res = await axios.get<Mentor>(
          `http://127.0.0.1:5000/api/mentors/${user.id}`
        );
        setFormData({
          name: res.data.name,
          email: res.data.email,
          department: res.data.department,
          specialization: res.data.specialization,
          phone: res.data.phone || "",
          expertise: res.data.expertise || "",
          experience: res.data.experience || "",
          company: res.data.company || "",
        });
      } catch (err) {
        console.error("Error fetching mentor details:", err);
        setError("Failed to load profile. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchMentorDetails();
  }, [user?.id]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!user?.id) return;
    try {
      await axios.put(`http://127.0.0.1:5000/api/mentors/${user.id}`, formData);
      setIsEditing(false);
    } catch (err) {
      console.error("Error updating profile:", err);
      setError("Failed to update profile. Please try again later.");
    }
  };

  if (loading) return <div className="text-center py-8">Loading...</div>;
  if (error)
    return <div className="text-center py-8 text-red-500">{error}</div>;
  if (!user)
    return <div className="text-center py-8">Unauthorized. Please log in.</div>;

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-3xl font-bold text-gray-800">Profile</h1>
        <p className="text-gray-600 mt-1">Manage your personal information</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="text-center">
          <div className="w-32 h-32 rounded-full mx-auto mb-4 bg-indigo-100 flex items-center justify-center text-indigo-600 text-4xl font-medium">
            {user.name.charAt(0)}
          </div>
          <h3 className="text-xl font-semibold text-gray-800">{user.name}</h3>
          <p className="text-gray-600 capitalize">{user.role}</p>
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
              <Input
                label="Department"
                name="department"
                value={formData.department}
                onChange={handleChange}
                disabled={!isEditing}
                icon={GraduationCap}
              />
              <Input
                label="Specialization"
                name="specialization"
                value={formData.specialization}
                onChange={handleChange}
                disabled={!isEditing}
              />
              <Input
                label="Phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                disabled={!isEditing}
                icon={Hash}
              />
              <Input
                label="Expertise"
                name="expertise"
                value={formData.expertise}
                onChange={handleChange}
                disabled={!isEditing}
              />
              <Input
                label="Experience"
                name="experience"
                value={formData.experience}
                onChange={handleChange}
                disabled={!isEditing}
              />
              <Input
                label="Company"
                name="company"
                value={formData.company}
                onChange={handleChange}
                disabled={!isEditing}
              />
              <div className="flex space-x-3 pt-4">
                {isEditing ? (
                  <>
                    <Button type="submit" variant="success">
                      <Save size={18} className="mr-2" /> Save Changes
                    </Button>
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={() => {
                        setIsEditing(false);
                        setFormData({
                          name: user.name,
                          email: user.email,
                          department: user.department,
                          specialization: user.specialization,
                          phone: user.phone || "",
                          expertise: user.expertise || "",
                          experience: user.experience || "",
                          company: user.company || "",
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
            </form>
          </Card>
        </div>
      </div>

      <Card title="Mentorship Statistics">
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
            <p className="text-2xl font-bold text-indigo-600">
              {user.specialization}
            </p>
            <p className="text-sm text-gray-600 mt-1">Specialization</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-indigo-600">
              {user.department.split(" ")[0]}
            </p>
            <p className="text-sm text-gray-600 mt-1">Department</p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default MentorProfile;
