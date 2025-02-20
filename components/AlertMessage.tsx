import React from "react";
import { CircleCheckBig, CircleX, TriangleAlert } from "lucide-react";

type Severity = "success" | "error" | "warning";

interface AlertMessageProps {
  severity?: Severity;
  message: string;
}

const AlertMessage: React.FC<AlertMessageProps> = ({
  severity = "success",
  message,
}) => {
  const getIcon = () => {
    switch (severity) {
      case "success":
        return <CircleCheckBig size={28} className="text-green-500" />;
      case "error":
        return <CircleX size={28} className="text-red-500" />;
      case "warning":
        return <TriangleAlert size={28} className="text-yellow-500" />;
      default:
        return null;
    }
  };

  const severityStyles: Record<Severity, string> = {
    success: "bg-green-100 text-green-700 border-green-400",
    error: "bg-red-100 text-red-700 border-red-400",
    warning: "bg-yellow-100 text-yellow-700 border-yellow-400",
  };

  return (
    <div
      className={`flex items-center p-4 border-l-4 rounded-md ${severityStyles[severity]} w-full`}
    >
      <div className="mr-3">{getIcon()}</div>
      <p className="text-sm font-medium">{message}</p>
    </div>
  );
};

export default AlertMessage;
