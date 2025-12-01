import { LucideIcon } from "lucide-react";

interface Trend {
  value: string | number;
  positive: boolean;
}

interface StatCardProps {
  title: string;
  value: string | number;
  icon?: LucideIcon;
  color?: "indigo" | "green" | "yellow" | "red" | "blue";
  trend?: Trend;
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon: Icon,
  color = "indigo",
  trend,
}) => {
  const colorClasses: Record<
    Exclude<StatCardProps["color"], undefined>,
    string
  > = {
    indigo: "bg-indigo-100 text-indigo-600",
    green: "bg-green-100 text-green-600",
    yellow: "bg-yellow-100 text-yellow-600",
    red: "bg-red-100 text-red-600",
    blue: "bg-blue-100 text-blue-600",
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600 mb-1">{title}</p>
          <p className="text-3xl font-bold text-gray-800">{value}</p>
          {trend && (
            <p
              className={`text-sm mt-2 ${
                trend.positive ? "text-green-600" : "text-red-600"
              }`}
            >
              {trend.value}
            </p>
          )}
        </div>
        {Icon && (
          <div className={`p-4 rounded-lg ${colorClasses[color]}`}>
            <Icon size={28} />
          </div>
        )}
      </div>
    </div>
  );
};

export default StatCard;
