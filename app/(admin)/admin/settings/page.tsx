"use client";

import { useState, ChangeEvent, FormEvent } from "react";

import { Save, Shield, Bell, Database } from "lucide-react";
import axios from "axios";
import Card from "@/app/components/Card";
import Input from "@/app/components/Input";
import Button from "@/app/components/Button";

interface SystemSettings {
  siteName: string;
  supportEmail: string;
  maxProjectsPerStudent: string;
  maxStudentsPerMentor: string;
}

interface NotificationSettings {
  emailNotifications: boolean;
  projectSubmissions: boolean;
  feedbackAlerts: boolean;
  weeklyReports: boolean;
}

const AdminSettings: React.FC = () => {
  const [systemSettings, setSystemSettings] = useState<SystemSettings>({
    siteName: "Intern Verse",
    supportEmail: "support@internverse.com",
    maxProjectsPerStudent: "10",
    maxStudentsPerMentor: "15",
  });

  const [notificationSettings, setNotificationSettings] =
    useState<NotificationSettings>({
      emailNotifications: true,
      projectSubmissions: true,
      feedbackAlerts: true,
      weeklyReports: false,
    });

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleSystemChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSystemSettings((prev) => ({ ...prev, [name]: value }));
  };

  const handleNotificationChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setNotificationSettings((prev) => ({ ...prev, [name]: checked }));
  };

  const handleSystemSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      // TODO: Implement API call to update system settings
      console.log("System settings updated:", systemSettings);
    } catch (err) {
      setError("Failed to update system settings. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleNotificationSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      // TODO: Implement API call to update notification settings
      console.log("Notification settings updated:", notificationSettings);
    } catch (err) {
      setError("Failed to update notification settings. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-3xl font-bold text-gray-800">Settings</h1>
        <p className="text-gray-600 mt-1">
          Manage system configuration and preferences
        </p>
      </div>

      {/* System Settings */}
      <Card title="System Settings">
        <form onSubmit={handleSystemSubmit} className="space-y-4">
          <Input
            label="Site Name"
            name="siteName"
            value={systemSettings.siteName}
            onChange={handleSystemChange}
            icon={Shield}
          />
          <Input
            label="Support Email"
            type="email"
            name="supportEmail"
            value={systemSettings.supportEmail}
            onChange={handleSystemChange}
          />
          <Input
            label="Max Projects Per Student"
            type="number"
            name="maxProjectsPerStudent"
            value={systemSettings.maxProjectsPerStudent}
            onChange={handleSystemChange}
          />
          <Input
            label="Max Students Per Mentor"
            type="number"
            name="maxStudentsPerMentor"
            value={systemSettings.maxStudentsPerMentor}
            onChange={handleSystemChange}
          />
          <Button type="submit" variant="success" disabled={loading}>
            <Save size={18} className="mr-2" />
            {loading ? "Saving..." : "Save System Settings"}
          </Button>
        </form>
      </Card>

      {/* Notification Settings */}
      <Card title="Notification Settings">
        <form onSubmit={handleNotificationSubmit} className="space-y-4">
          <div className="space-y-3">
            {Object.entries(notificationSettings).map(([key, value]) => (
              <label key={key} className="flex items-center">
                <input
                  type="checkbox"
                  name={key}
                  checked={value}
                  onChange={handleNotificationChange}
                  className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500"
                />
                <span className="ml-3 text-gray-700">
                  {key
                    .replace(/([A-Z])/g, " $1") // Split camelCase
                    .replace(/^./, (str) => str.toUpperCase())}
                </span>
              </label>
            ))}
          </div>
          <Button type="submit" variant="success" disabled={loading}>
            <Bell size={18} className="mr-2" />
            {loading ? "Saving..." : "Save Notification Settings"}
          </Button>
        </form>
      </Card>

      {/* Database Information */}
      <Card title="Database Information">
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <span className="text-gray-700">Total Users</span>
            <span className="font-semibold text-gray-800">5</span>
          </div>
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <span className="text-gray-700">Total Projects</span>
            <span className="font-semibold text-gray-800">5</span>
          </div>
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <span className="text-gray-700">Database Status</span>
            <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
              Healthy
            </span>
          </div>
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <span className="text-gray-700">Last Backup</span>
            <span className="font-semibold text-gray-800">
              {new Date().toLocaleDateString()}
            </span>
          </div>
        </div>
        <Button variant="outline" className="mt-4 w-full">
          <Database size={18} className="mr-2" />
          Create Manual Backup
        </Button>
      </Card>

      {/* System Actions */}
      <Card title="System Actions">
        <div className="space-y-3">
          <Button variant="secondary" className="w-full">
            Clear Cache
          </Button>
          <Button variant="secondary" className="w-full">
            Export All Data
          </Button>
          <Button variant="danger" className="w-full">
            Reset System Settings
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default AdminSettings;
