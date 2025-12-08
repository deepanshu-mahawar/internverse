"use client";

import { useState, useEffect } from "react";

import { Users, FolderOpen, UserCheck } from "lucide-react";
import axios from "axios";
import { useAuth } from "@/app/context/AuthContext";
import StatCard from "@/app/components/StatCard";
import Card from "@/app/components/Card";

// interface UserType {
//   id: string;
//   name: string;
//   role: "student" | "mentor" | "admin";
// }

// interface ProjectType {
//   id: string;
//   title: string;
//   student_name: string;
//   mentor_name: string;
//   status: "approved" | "Submitted" | "needs_improvement" | "pending" | string;
//   project_type: "internship" | "project" | string;
//   upload_date?: string;
// }

const AdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [students, setStudents] = useState<any[]>([]);
  const [mentors, setMentors] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const studentRes = await axios.get<any[]>(
          `http://127.0.0.1:5000/api/admins/students`
        );

        const studResponse = studentRes.data.students || [];

        setStudents(studResponse);

        const mentorRes = await axios.get<any[]>(
          `http://127.0.0.1:5000/api/admins/mentors`
        );
        const MentResponse = mentorRes.data.mentors || [];

        setMentors(MentResponse);

        const projectRes = await axios.get<any[]>(
          `http://127.0.0.1:5000/api/admins/projects`
        );

        const projResponse = projectRes.data.projects || [];

        const projectsWithMentors = await Promise.all(
          projResponse.map(async (project: any) => {
            try {
              const mentorRes = await axios.get(
                `http://127.0.0.1:5000/api/mentors/${project.mentor_id}`
              );

              return {
                ...project,
                mentorName: mentorRes.data?.mentor?.name || "Unknown",
              };
            } catch {
              return {
                ...project,
                mentorName: "Unknown",
              };
            }
          })
        );

        const projectsWithStudents = await Promise.all(
          projectsWithMentors.map(async (project: any) => {
            try {
              const mentorRes = await axios.get(
                `http://127.0.0.1:5000/api/students/${project.student_id}`
              );

              return {
                ...project,
                studentName: mentorRes.data?.data?.name || "Unknown",
              };
            } catch {
              return {
                ...project,
                studentName: "Unknown",
              };
            }
          })
        );

        setProjects(projectsWithStudents);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // console.log("students", students);
  // console.log("mentors", mentors);
  console.log("projects", projects);

  if (loading) return <div className="text-center py-8">Loading...</div>;
  if (error)
    return <div className="text-center py-8 text-red-500">{error}</div>;
  if (!user)
    return <div className="text-center py-8">Unauthorized. Please log in.</div>;

  // const students = users.filter((u) => u.role === "student");
  // const mentors = users.filter((u) => u.role === "mentor");
  // const admins = users.filter((u) => u.role === "admin");

  const totalProjects = projects.length;

  const approvedProjects = projects.filter(
    (p) => p.status === "approved"
  ).length;

  const underReview = projects.filter((p) => p.status === "Submitted").length;

  const recentProjects = projects
    .filter((p) => p.upload_date)
    .sort(
      (a, b) =>
        new Date(b.upload_date!).getTime() - new Date(a.upload_date!).getTime()
    )
    .slice(0, 5);

  const getStatusBadge = (status: any["status"]): string => {
    const badges: Record<string, string> = {
      approved: "bg-green-100 text-green-700",
      Submitted: "bg-yellow-100 text-yellow-700",
      needs_improvement: "bg-red-100 text-red-700",
      pending: "bg-gray-100 text-gray-700",
    };
    return badges[status] || badges.pending;
  };

  const getStatusText = (status: any["status"]): string => {
    return status
      .split("_")
      .map((word: any) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  const users = students.length + mentors.length + 1;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
        <p className="text-gray-600 mt-1">System overview and statistics</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Users"
          value={users}
          icon={Users}
          color="indigo"
        />
        <StatCard
          title="Students"
          value={students.length}
          icon={Users}
          color="blue"
        />
        <StatCard
          title="Mentors"
          value={mentors.length}
          icon={UserCheck}
          color="green"
        />
        <StatCard
          title="Total Projects"
          value={totalProjects}
          icon={FolderOpen}
          color="yellow"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Project Statistics">
          <div className="space-y-4">
            <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
              <span className="text-gray-700 font-medium">
                Approved Projects
              </span>
              <span className="text-2xl font-bold text-green-600">
                {approvedProjects}
              </span>
            </div>
            <div className="flex justify-between items-center p-3 bg-yellow-50 rounded-lg">
              <span className="text-gray-700 font-medium">Under Review</span>
              <span className="text-2xl font-bold text-yellow-600">
                {underReview}
              </span>
            </div>
            <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
              <span className="text-gray-700 font-medium">
                Needs Improvement
              </span>
              <span className="text-2xl font-bold text-red-600">
                {
                  projects.filter((p) => p.status === "needs_improvement")
                    .length
                }
              </span>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <span className="text-gray-700 font-medium">Pending</span>
              <span className="text-2xl font-bold text-gray-600">
                {projects.filter((p) => p.status === "pending").length}
              </span>
            </div>
          </div>
        </Card>

        <Card title="System Overview">
          <div className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-600">Approval Rate</span>
                <span className="text-sm font-semibold text-gray-800">
                  {totalProjects > 0
                    ? Math.round((approvedProjects / totalProjects) * 100)
                    : 0}
                  %
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-green-600 h-2 rounded-full"
                  style={{
                    width: `${
                      totalProjects > 0
                        ? (approvedProjects / totalProjects) * 100
                        : 0
                    }%`,
                  }}
                ></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-600">
                  Student-Mentor Ratio
                </span>
                <span className="text-sm font-semibold text-gray-800">
                  {mentors.length > 0
                    ? (students.length / mentors.length).toFixed(1)
                    : 0}
                  :1
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-indigo-600 h-2 rounded-full"
                  style={{ width: "75%" }}
                ></div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 mt-4">
              <div className="text-center p-3 bg-indigo-50 rounded-lg">
                <p className="text-2xl font-bold text-indigo-600">
                  {
                    projects.filter((p) => p.project_type === "internship")
                      .length
                  }
                </p>
                <p className="text-xs text-gray-600 mt-1">Internships</p>
              </div>
              <div className="text-center p-3 bg-blue-50 rounded-lg">
                <p className="text-2xl font-bold text-blue-600">
                  {projects.filter((p) => p.project_type === "project").length}
                </p>
                <p className="text-xs text-gray-600 mt-1">Projects</p>
              </div>
            </div>
          </div>
        </Card>
      </div>

      <Card title="Recent Submissions">
        {recentProjects.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No submissions yet</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                    Title
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                    Student
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                    Mentor
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                    Type
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {recentProjects.map((project) => (
                  <tr
                    key={project._id}
                    className="border-b border-gray-100 hover:bg-gray-50"
                  >
                    <td className="py-3 px-4 text-sm text-gray-800">
                      {project.title}
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-600">
                      {project.studentName}
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-600">
                      {project.mentorName}
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-600 capitalize">
                      {project.project_type}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadge(
                          project.status
                        )}`}
                      >
                        {getStatusText(project.status)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
};

export default AdminDashboard;
