"use client";

import { useState, useEffect } from "react";

import { FolderOpen, Users, Clock, CheckCircle } from "lucide-react";
import axios from "axios";
import { useAuth } from "@/app/context/AuthContext";
import StatCard from "@/app/components/StatCard";
import Card from "@/app/components/Card";

const MentorDashboard: React.FC = () => {
  const { user } = useAuth();
  const [projects, setProjects] = useState<any[]>([]);
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!user?._id) return;

      setLoading(true);
      setError(null);

      try {
        const projectsRes = await axios.get<any[]>(
          `http://127.0.0.1:5000/api/projects/mentor/${user?._id}`
        );

        const projectsData = projectsRes.data.data || [];

        const projectsWithMentors = await Promise.all(
          projectsData.map(async (project: any) => {
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

        setProjects(projectsWithMentors);

        const studentIds = Array.from(
          new Set(projectsData.map((p) => p.student_id).filter(Boolean))
        );

        if (studentIds.length === 0) {
          setStudents([]);
          return;
        }

        const studentsRes = await axios.post(
          "http://127.0.0.1:5000/api/students/many",
          { ids: studentIds }
        );

        setStudents(studentsRes.data.data || []);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user?._id]);

  if (loading) return <div className="text-center py-8">Loading...</div>;
  if (error)
    return <div className="text-center py-8 text-red-500">{error}</div>;
  if (!user)
    return <div className="text-center py-8">Unauthorized. Please log in.</div>;

  const myProjects = projects;
  const underReview = myProjects.filter((p) => p.status === "Submitted");
  const approved = myProjects.filter((p) => p.status === "approved");
  const needsImprovement = myProjects.filter(
    (p) => p.status === "needs_improvement"
  );
  const myStudents = students;

  const recentSubmissions = myProjects
    .filter((p) => p.upload_date)
    .sort(
      (a, b) =>
        new Date(b.upload_date!).getTime() - new Date(a.upload_date!).getTime()
    )
    .slice(0, 5);

  const getStatusBadge = (status: string) => {
    const badges: Record<string, string> = {
      approved: "bg-green-100 text-green-700",
      Submitted: "bg-yellow-100 text-yellow-700",
      needs_improvement: "bg-red-100 text-red-700",
    };
    return badges[status] || badges["Submitted"];
  };

  const getStatusText = (status: string) => {
    return status
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-800">
          Welcome, {user.name}!
        </h1>
        <p className="text-gray-600 mt-1">
          Manage and review student submissions
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Submissions"
          value={myProjects.length}
          icon={FolderOpen}
          color="indigo"
        />
        <StatCard
          title="Under Review"
          value={underReview.length}
          icon={Clock}
          color="yellow"
        />
        <StatCard
          title="Approved"
          value={approved.length}
          icon={CheckCircle}
          color="green"
        />
        <StatCard
          title="My Students"
          value={myStudents.length}
          icon={Users}
          color="blue"
        />
      </div>

      <Card title="Recent Submissions">
        {recentSubmissions.length === 0 ? (
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
                    Type
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                    Submitted
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {recentSubmissions.map((project) => (
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
                    <td className="py-3 px-4 text-sm text-gray-600 capitalize">
                      {project.project_type}
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-600">
                      {project.upload_date
                        ? new Date(project.upload_date).toLocaleDateString()
                        : "N/A"}
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card title="Status Overview">
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Approved Projects</span>
              <span className="font-semibold text-green-600">
                {approved.length}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Awaiting Review</span>
              <span className="font-semibold text-yellow-600">
                {underReview.length}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Needs Improvement</span>
              <span className="font-semibold text-red-600">
                {needsImprovement.length}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Total Students</span>
              <span className="font-semibold text-indigo-600">
                {myStudents.length}
              </span>
            </div>
          </div>
        </Card>

        <Card title="My Students">
          {myStudents.length === 0 ? (
            <p className="text-gray-500 text-center py-8">
              No students assigned
            </p>
          ) : (
            <div className="space-y-3">
              {myStudents.slice(0, 5).map((student: any) => {
                const studentProjects = myProjects.filter(
                  (p) => p.student_id === student._id
                );
                return (
                  <div
                    key={student._id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-medium">
                        {student.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-medium text-gray-800">
                          {student.name}
                        </p>
                        <p className="text-xs text-gray-600">
                          {student.department}
                        </p>
                      </div>
                    </div>
                    <span className="text-sm font-semibold text-indigo-600">
                      {studentProjects.length}{" "}
                      {studentProjects.length === 1 ? "project" : "projects"}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default MentorDashboard;
