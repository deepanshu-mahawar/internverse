"use client";


import { useState, useEffect } from 'react';

import { Eye, Calendar, User } from 'lucide-react';
import axios from 'axios';
import { useAuth } from '@/app/context/AuthContext';
import Button from '@/app/components/Button';
import Card from '@/app/components/Card';
import Modal from '@/app/components/Modal';

interface Project {
  id: number;
  title: string;
  description: string;
  type: 'project' | 'internship';
  status: 'approved' | 'under_review' | 'needs_improvement' | 'pending';
  mentorName: string;
  startDate?: string;
  endDate?: string;
  company?: string;
  technologies?: string[];
  feedback?: string;
  feedbackDate?: string;
}

const StudentProjects: React.FC = () => {
  const { user } = useAuth();
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [filterType, setFilterType] = useState<'all' | 'project' | 'internship'>('all');
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      if (!user?.id) return;
      try {
        const response = await axios.get<Project[]>(`http://127.0.0.1:5000/api/students/${user.id}/projects`);
        setProjects(response.data);
      } catch (error) {
        console.error('Error fetching projects:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, [user?.id]);

  const filteredProjects = filterType === 'all'
    ? projects
    : projects.filter((p) => p.type === filterType);

  const getStatusBadge = (status: Project['status']) => {
    const badges: Record<Project['status'] | 'pending', string> = {
      approved: 'bg-green-100 text-green-700',
      under_review: 'bg-yellow-100 text-yellow-700',
      needs_improvement: 'bg-red-100 text-red-700',
      pending: 'bg-gray-100 text-gray-700',
    };
    return badges[status] || badges.pending;
  };

  const getStatusText = (status: Project['status']) => {
    return status.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-800">My Projects & Internships</h1>
        <p className="text-gray-600 mt-1">View and manage all your submitted work</p>
      </div>

      <div className="flex flex-wrap gap-3">
        <Button
          variant={filterType === 'all' ? 'primary' : 'secondary'}
          onClick={() => setFilterType('all')}
        >
          All ({projects.length})
        </Button>
        <Button
          variant={filterType === 'project' ? 'primary' : 'secondary'}
          onClick={() => setFilterType('project')}
        >
          Projects ({projects.filter(p => p.type === 'project').length})
        </Button>
        <Button
          variant={filterType === 'internship' ? 'primary' : 'secondary'}
          onClick={() => setFilterType('internship')}
        >
          Internships ({projects.filter(p => p.type === 'internship').length})
        </Button>
      </div>

      {filteredProjects.length === 0 ? (
        <Card>
          <p className="text-gray-500 text-center py-12">No projects or internships found</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <Card key={project.id} className="hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadge(project.status)}`}>
                  {getStatusText(project.status)}
                </span>
                <span className="px-2 py-1 bg-indigo-50 text-indigo-600 rounded text-xs font-medium capitalize">
                  {project.type}
                </span>
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">{project.title}</h3>
              <p className="text-sm text-gray-600 mb-4 line-clamp-2">{project.description}</p>

              <div className="space-y-2 mb-4">
                <div className="flex items-center text-sm text-gray-600">
                  <User size={16} className="mr-2" />
                  {project.mentorName}
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Calendar size={16} className="mr-2" />
                  {project.startDate ? new Date(project.startDate).toLocaleDateString() : 'N/A'} - {project.endDate ? new Date(project.endDate).toLocaleDateString() : 'N/A'}
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mb-4">
                {project.technologies?.slice(0, 3).map((tech) => (
                  <span key={tech} className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">{tech}</span>
                ))}
                {project.technologies && project.technologies.length > 3 && (
                  <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                    +{project.technologies.length - 3} more
                  </span>
                )}
              </div>

              <Button variant="outline" className="w-full" onClick={() => setSelectedProject(project)}>
                <Eye size={16} className="mr-2" /> View Details
              </Button>
            </Card>
          ))}
        </div>
      )}

      <Modal
        isOpen={!!selectedProject}
        onClose={() => setSelectedProject(null)}
        title="Project Details"
        size="lg"
      >
        {selectedProject && (
          <div className="space-y-4">
            <div>
              <h3 className="text-xl font-bold text-gray-800">{selectedProject.title}</h3>
              <div className="flex items-center space-x-3 mt-2">
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadge(selectedProject.status)}`}>
                  {getStatusText(selectedProject.status)}
                </span>
                <span className="px-2 py-1 bg-indigo-50 text-indigo-600 rounded text-xs font-medium capitalize">
                  {selectedProject.type}
                </span>
              </div>
            </div>

            {selectedProject.description && (
              <div>
                <h4 className="font-semibold text-gray-700 mb-2">Description</h4>
                <p className="text-gray-600">{selectedProject.description}</p>
              </div>
            )}

            {selectedProject.company && (
              <div>
                <h4 className="font-semibold text-gray-700 mb-2">Company</h4>
                <p className="text-gray-600">{selectedProject.company}</p>
              </div>
            )}

            <div>
              <h4 className="font-semibold text-gray-700 mb-2">Duration</h4>
              <p className="text-gray-600">
                {selectedProject.startDate ? new Date(selectedProject.startDate).toLocaleDateString() : 'N/A'} - {selectedProject.endDate ? new Date(selectedProject.endDate).toLocaleDateString() : 'N/A'}
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-gray-700 mb-2">Mentor</h4>
              <p className="text-gray-600">{selectedProject.mentorName}</p>
            </div>

            {selectedProject.technologies && (
              <div>
                <h4 className="font-semibold text-gray-700 mb-2">Technologies</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedProject.technologies.map((tech) => (
                    <span key={tech} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">{tech}</span>
                  ))}
                </div>
              </div>
            )}

            {selectedProject.feedback && (
              <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
                <h4 className="font-semibold text-indigo-800 mb-2">Mentor Feedback</h4>
                <p className="text-indigo-900">{selectedProject.feedback}</p>
                <p className="text-xs text-indigo-600 mt-2">
                  {selectedProject.feedbackDate ? new Date(selectedProject.feedbackDate).toLocaleDateString() : 'N/A'}
                </p>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default StudentProjects;
