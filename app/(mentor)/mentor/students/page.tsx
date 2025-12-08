"use client";

import { useState, useEffect } from "react";

import { Eye, GraduationCap, Mail, Hash } from "lucide-react";
import axios from "axios";
import { useAuth } from "@/app/context/AuthContext";
import Card from "@/app/components/Card";
import Button from "@/app/components/Button";
import Modal from "@/app/components/Modal";

// interface Student {
//   id: string;
//   name: string;
//   email: string;
//   department: string;
//   year: string;
// }

// interface Project {
//   id: string;
//   title: string;
//   description: string;
//   status: "approved" | "needs_improvement" | "Submitted" | string;
//   project_type: string;
//   student_id: string;
//   upload_date?: string;
// }

// interface Mentor {
//   id: string;
// }

const MentorStudents: React.FC = () => {
  const { user } = useAuth() as { user: any | null };
  const [students, setStudents] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<any | null>(null);
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

  console.log("student", students);
  console.log("project", projects);

  const myStudents = students;
  const myProjects = projects;

  const getStudentProjects = (studentId: string) => {
    return myProjects.filter((p) => p.student_id === studentId);
  };

  const getStatusBadge = (status: string) => {
    const badges: Record<string, string> = {
      approved: "bg-green-100 text-green-700",
      Submitted: "bg-yellow-100 text-yellow-700",
      needs_improvement: "bg-red-100 text-red-700",
    };
    return badges[status] || badges.Submitted;
  };

  const getStatusText = (status: string) => {
    return status
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  if (loading) return <div className="text-center py-8">Loading...</div>;
  if (error)
    return <div className="text-center py-8 text-red-500">{error}</div>;
  if (!user)
    return <div className="text-center py-8">Unauthorized. Please log in.</div>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-800">My Students</h1>
        <p className="text-gray-600 mt-1">
          View and manage students under your mentorship
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <div className="text-center">
            <p className="text-3xl font-bold text-indigo-600">
              {myStudents.length}
            </p>
            <p className="text-sm text-gray-600 mt-1">Total Students</p>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <p className="text-3xl font-bold text-green-600">
              {myProjects.filter((p) => p.status === "approved").length}
            </p>
            <p className="text-sm text-gray-600 mt-1">Approved Projects</p>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <p className="text-3xl font-bold text-yellow-600">
              {myProjects.filter((p) => p.status === "Submitted").length}
            </p>
            <p className="text-sm text-gray-600 mt-1">Pending Reviews</p>
          </div>
        </Card>
      </div>

      {/* Student List */}
      {myStudents.length === 0 ? (
        <Card>
          <p className="text-gray-500 text-center py-12">
            No students assigned yet
          </p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {myStudents.map((student) => {
            const studentProjects = getStudentProjects(student.id);
            const approvedCount = studentProjects.filter(
              (p) => p.status === "approved"
            ).length;
            const pendingCount = studentProjects.filter(
              (p) => p.status === "Submitted"
            ).length;
            return (
              <Card
                key={student._id}
                className="hover:shadow-md transition-shadow"
              >
                <div className="text-center mb-4">
                  <div className="w-20 h-20 rounded-full mx-auto mb-3 bg-indigo-100 flex items-center justify-center text-indigo-600 text-2xl font-medium">
                    {student.name.charAt(0)}
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800">
                    {student.name}
                  </h3>
                  <p className="text-sm text-gray-600">{student._id}</p>
                </div>
                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <GraduationCap size={16} className="mr-2" />{" "}
                    {student.department}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Hash size={16} className="mr-2" /> {student.year}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Mail size={16} className="mr-2" /> {student.email}
                  </div>
                </div>
                <div className="bg-gray-50 rounded-lg p-3 mb-4">
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div>
                      <p className="text-lg font-bold text-indigo-600">
                        {studentProjects.length}
                      </p>
                      <p className="text-xs text-gray-600">Total</p>
                    </div>
                    <div>
                      <p className="text-lg font-bold text-green-600">
                        {approvedCount}
                      </p>
                      <p className="text-xs text-gray-600">Approved</p>
                    </div>
                    <div>
                      <p className="text-lg font-bold text-yellow-600">
                        {pendingCount}
                      </p>
                      <p className="text-xs text-gray-600">Pending</p>
                    </div>
                  </div>
                </div>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => setSelectedStudent(student)}
                >
                  <Eye size={16} className="mr-2" /> View Details
                </Button>
              </Card>
            );
          })}
        </div>
      )}

      {/* Student Modal */}
      <Modal
        isOpen={!!selectedStudent}
        onClose={() => setSelectedStudent(null)}
        title="Student Details"
        size="lg"
      >
        {selectedStudent && (
          <div className="space-y-6">
            <div className="flex items-center space-x-4">
              <div className="w-24 h-24 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 text-4xl font-medium">
                {selectedStudent.name.charAt(0)}
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-800">
                  {selectedStudent.name}
                </h3>
                <p className="text-gray-600">{selectedStudent._id}</p>
                <p className="text-sm text-gray-600 mt-1">
                  {selectedStudent.email}
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Department</p>
                <p className="font-medium text-gray-800">
                  {selectedStudent.department}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Year</p>
                <p className="font-medium text-gray-800">
                  {selectedStudent.year}
                </p>
              </div>
            </div>
            <div>
              <h4 className="font-semibold text-gray-800 mb-3">
                Projects & Internships
              </h4>
              {getStudentProjects(selectedStudent.id).length === 0 ? (
                <p className="text-gray-500 text-center py-4">
                  No projects yet
                </p>
              ) : (
                <div className="space-y-3">
                  {getStudentProjects(selectedStudent.id).map((project) => (
                    <div
                      key={project.id}
                      className="border border-gray-200 rounded-lg p-4"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <h5 className="font-medium text-gray-800">
                          {project.title}
                        </h5>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadge(
                            project.status
                          )}`}
                        >
                          {getStatusText(project.status)}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                        {project.description}
                      </p>
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span className="capitalize">
                          {project.project_type}
                        </span>
                        {project.upload_date && (
                          <span>
                            Submitted:{" "}
                            {new Date(project.upload_date).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default MentorStudents;
