import { useState, useEffect, ChangeEvent, FormEvent } from "react";

import { Plus, Edit, Trash2, Eye } from "lucide-react";
import axios from "axios";
import { useAuth } from "@/app/context/AuthContext";
import Button from "@/app/components/Button";
import Card from "@/app/components/Card";
import Modal from "@/app/components/Modal";

interface User {
  id: number;
  name: string;
  email: string;
  role: "student" | "mentor" | "admin";
  department?: string;
  year?: string;
  phone?: string;
  specialization?: string;
  experience?: string;
  company?: string;
}

interface FormData {
  name: string;
  email: string;
  role: "student" | "mentor" | "admin";
  department?: string;
  password?: string;
  year?: string;
  phone?: string;
  specialization?: string;
  experience?: string;
  company?: string;
}

const AdminUsers: React.FC = () => {
  const { user } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState<boolean>(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [filterRole, setFilterRole] = useState<
    "all" | "student" | "mentor" | "admin"
  >("all");
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    role: "student",
    department: "",
    password: "",
    year: "",
    phone: "",
    specialization: "",
    experience: "",
    company: "",
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get<User[]>(
          "http://127.0.0.1:5000/api/admin/users"
        );
        setUsers(res.data);
      } catch (err) {
        console.error("Error fetching users:", err);
        setError("Failed to load users. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const filteredUsers =
    filterRole === "all" ? users : users.filter((u) => u.role === filterRole);

  const handleEdit = (user: User) => {
    setSelectedUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      role: user.role,
      department: user.department || "",
      password: "",
      year: user.year || "",
      phone: user.phone || "",
      specialization: user.specialization || "",
      experience: user.experience || "",
      company: user.company || "",
    });
    setIsEditModalOpen(true);
  };

  const handleView = (user: User) => {
    setSelectedUser(user);
    setIsViewModalOpen(true);
  };

  const handleSubmitEdit = async (e: FormEvent) => {
    e.preventDefault();
    if (!selectedUser) return;
    setLoading(true);
    try {
      const { password, ...updateData } = formData;
      const payload = password ? { ...updateData, password } : updateData;
      const res = await axios.put<{ user: User }>(
        `http://127.0.0.1:5000/api/admin/users/${selectedUser.id}`,
        payload
      );
      setUsers(
        users.map((u) => (u.id === selectedUser.id ? res.data.user : u))
      );
      setIsEditModalOpen(false);
      setSelectedUser(null);
    } catch (err) {
      console.error("Error updating user:", err);
      setError("Failed to update user. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitAdd = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post<{ user: User }>(
        "http://127.0.0.1:5000/api/admin/users",
        formData
      );
      setUsers([...users, res.data.user]);
      setIsAddModalOpen(false);
      setFormData({
        name: "",
        email: "",
        role: "student",
        department: "",
        password: "",
        year: "",
        phone: "",
        specialization: "",
        experience: "",
        company: "",
      });
    } catch (err) {
      console.error("Error adding user:", err);
      setError("Failed to add user. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (userId: number) => {
    setLoading(true);
    try {
      await axios.delete(`http://127.0.0.1:5000/api/admin/users/${userId}`);
      setUsers(users.filter((u) => u.id !== userId));
    } catch (err) {
      console.error("Error deleting user:", err);
      setError("Failed to delete user. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="text-center py-8">Loading...</div>;
  if (error)
    return <div className="text-center py-8 text-red-500">{error}</div>;
  if (!user)
    return <div className="text-center py-8">Unauthorized. Please log in.</div>;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Manage Users</h1>
          <p className="text-gray-600 mt-1">
            View and manage all users in the system
          </p>
        </div>
        <Button variant="primary" onClick={() => setIsAddModalOpen(true)}>
          <Plus size={18} className="mr-2" />
          Add User
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <div className="text-center">
            <p className="text-2xl font-bold text-indigo-600">{users.length}</p>
            <p className="text-sm text-gray-600 mt-1">Total Users</p>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <p className="text-2xl font-bold text-blue-600">
              {users.filter((u) => u.role === "student").length}
            </p>
            <p className="text-sm text-gray-600 mt-1">Students</p>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <p className="text-2xl font-bold text-green-600">
              {users.filter((u) => u.role === "mentor").length}
            </p>
            <p className="text-sm text-gray-600 mt-1">Mentors</p>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <p className="text-2xl font-bold text-red-600">
              {users.filter((u) => u.role === "admin").length}
            </p>
            <p className="text-sm text-gray-600 mt-1">Admins</p>
          </div>
        </Card>
      </div>

      {/* Filter Buttons */}
      <div className="flex flex-wrap gap-3">
        {(["all", "student", "mentor", "admin"] as const).map((role) => (
          <Button
            key={role}
            variant={filterRole === role ? "primary" : "secondary"}
            onClick={() => setFilterRole(role)}
          >
            {role.charAt(0).toUpperCase() + role.slice(1)} (
            {role === "all"
              ? users.length
              : users.filter((u) => u.role === role).length}
            )
          </Button>
        ))}
      </div>

      {/* Users Table */}
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                  User
                </th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                  Email
                </th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                  Role
                </th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                  Department
                </th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr
                  key={user.id}
                  className="border-b border-gray-100 hover:bg-gray-50"
                >
                  <td className="py-3 px-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-medium">
                        {user.name.charAt(0)}
                      </div>
                      <span className="text-sm font-medium text-gray-800">
                        {user.name}
                      </span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-600">
                    {user.email}
                  </td>
                  <td className="py-3 px-4">
                    <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-xs font-medium capitalize">
                      {user.role}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-600">
                    {user.department || "N/A"}
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleView(user)}
                        className="text-indigo-600 hover:text-indigo-800"
                        title="View"
                      >
                        <Eye size={18} />
                      </button>
                      <button
                        onClick={() => handleEdit(user)}
                        className="text-green-600 hover:text-green-800"
                        title="Edit"
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(user.id)}
                        className="text-red-600 hover:text-red-800"
                        title="Delete"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Modals */}
      {/* View Modal */}
      <Modal
        isOpen={isViewModalOpen}
        onClose={() => {
          setIsViewModalOpen(false);
          setSelectedUser(null);
        }}
        title="User Details"
      >
        {selectedUser && (
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <div className="w-20 h-20 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 text-2xl font-medium">
                {selectedUser.name.charAt(0)}
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-800">
                  {selectedUser.name}
                </h3>
                <p className="text-gray-600 capitalize">{selectedUser.role}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Email</p>
                <p className="font-medium text-gray-800">
                  {selectedUser.email}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Department</p>
                <p className="font-medium text-gray-800">
                  {selectedUser.department || "N/A"}
                </p>
              </div>
              {selectedUser.role === "student" && (
                <>
                  <div>
                    <p className="text-sm text-gray-600">Student ID</p>
                    <p className="font-medium text-gray-800">
                      {selectedUser.id}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Year</p>
                    <p className="font-medium text-gray-800">
                      {selectedUser.year || "N/A"}
                    </p>
                  </div>
                </>
              )}
              {selectedUser.role === "mentor" && (
                <>
                  <div>
                    <p className="text-sm text-gray-600">Mentor ID</p>
                    <p className="font-medium text-gray-800">
                      {selectedUser.id}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Specialization</p>
                    <p className="font-medium text-gray-800">
                      {selectedUser.specialization || "N/A"}
                    </p>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default AdminUsers;
