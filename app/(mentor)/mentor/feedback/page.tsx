import { useState, useEffect } from 'react';

import { MessageSquare, Calendar, User, CheckCircle, XCircle } from 'lucide-react';
import axios from 'axios';
import { useAuth } from '@/app/context/AuthContext';
import Card from '@/app/components/Card';

interface Project {
  id: string;
  title: string;
  student_name: string;
  student_id: string;
  project_type: string;
  status: 'Submitted' | 'approved' | 'needs_improvement' | string;
  feedback?: string;
  feedback_date?: string;
  technologies?: string[];
}

const FeedbackHistory: React.FC = () => {
  const { user } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProjects = async () => {
      if (!user?.id) return;
      try {
        const res = await axios.get<Project[]>(`http://127.0.0.1:5000/api/mentors/${user.id}/projects`);
        setProjects(res.data || []);
      } catch (err) {
        console.error('Error fetching projects:', err);
        setError('Failed to load projects. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, [user?.id]);

  if (loading) return <div className="text-center py-8">Loading...</div>;
  if (error) return <div className="text-center py-8 text-red-500">{error}</div>;
  if (!user) return <div className="text-center py-8">Unauthorized. Please log in.</div>;

  const projectsWithFeedback = projects.filter((p) => p.feedback);
  const approvedProjects = projectsWithFeedback.filter((p) => p.status === 'approved');
  const needsImprovementProjects = projectsWithFeedback.filter((p) => p.status === 'needs_improvement');

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="text-green-600" size={20} />;
      case 'needs_improvement':
        return <XCircle className="text-red-600" size={20} />;
      default:
        return <MessageSquare className="text-gray-600" size={20} />;
    }
  };

  const getStatusBadge = (status: string) => {
    const badges: Record<string, string> = {
      approved: 'bg-green-100 text-green-700',
      Submitted: 'bg-yellow-100 text-yellow-700',
      needs_improvement: 'bg-red-100 text-red-700',
    };
    return badges[status] || badges['Submitted'];
  };

  const getStatusText = (status: string) => {
    return status.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-800">Feedback History</h1>
        <p className="text-gray-600 mt-1">View all feedback you've provided to students</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Feedback</p>
              <p className="text-2xl font-bold text-gray-800 mt-1">{projectsWithFeedback.length}</p>
            </div>
            <MessageSquare className="text-indigo-600" size={32} />
          </div>
        </Card>
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Approved</p>
              <p className="text-2xl font-bold text-gray-800 mt-1">{approvedProjects.length}</p>
            </div>
            <CheckCircle className="text-green-600" size={32} />
          </div>
        </Card>
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Needs Improvement</p>
              <p className="text-2xl font-bold text-gray-800 mt-1">{needsImprovementProjects.length}</p>
            </div>
            <XCircle className="text-red-600" size={32} />
          </div>
        </Card>
      </div>

      {projectsWithFeedback.length === 0 ? (
        <Card>
          <p className="text-gray-500 text-center py-12">No feedback provided yet</p>
        </Card>
      ) : (
        <div className="space-y-4">
          {projectsWithFeedback
            .sort((a, b) => (new Date(b.feedback_date!).getTime() - new Date(a.feedback_date!).getTime()))
            .map((project) => (
              <Card key={project.id}>
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        {getStatusIcon(project.status)}
                        <h3 className="text-lg font-semibold text-gray-800">{project.title}</h3>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadge(project.status)}`}>
                        {getStatusText(project.status)}
                      </span>
                    </div>
                    <span className="px-2 py-1 bg-indigo-50 text-indigo-600 rounded text-xs font-medium capitalize">
                      {project.project_type}
                    </span>
                  </div>
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <div className="flex items-center">
                      <User size={16} className="mr-2" />
                      <span>{project.student_name}</span>
                    </div>
                    <div className="flex items-center">
                      <Calendar size={16} className="mr-2" />
                      <span>{project.feedback_date ? new Date(project.feedback_date).toLocaleDateString() : 'N/A'}</span>
                    </div>
                  </div>
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                    <p className="font-medium text-gray-700 mb-2">Your Feedback:</p>
                    <p className="text-gray-800">{project.feedback}</p>
                  </div>
                  {project.technologies && project.technologies.length > 0 && (
                    <div>
                      <p className="text-sm text-gray-600 mb-2">Technologies:</p>
                      <div className="flex flex-wrap gap-2">
                        {project.technologies.map((tech) => (
                          <span key={tech} className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </Card>
            ))}
        </div>
      )}
    </div>
  );
};

export default FeedbackHistory;
