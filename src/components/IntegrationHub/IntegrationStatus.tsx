
import React from "react";
import { cn } from "@/lib/utils";
import { Check, AlertCircle, Clock, Loader2 } from "lucide-react";

export type StatusType = "active" | "syncing" | "failed" | "inactive";

interface IntegrationStatusProps {
  status: StatusType;
  className?: string;
  showText?: boolean;
  size?: "sm" | "md" | "lg";
}

export const IntegrationStatus: React.FC<IntegrationStatusProps> = ({
  status,
  className,
  showText = false,
  size = "md",
}) => {
  const statusConfig = {
    active: {
      icon: Check,
      label: "Active",
      color: "bg-emerald-500/90 text-white",
      animation: "",
    },
    syncing: {
      icon: Loader2,
      label: "Syncing",
      color: "bg-blue-500/90 text-white",
      animation: "animate-spin",
    },
    failed: {
      icon: AlertCircle,
      label: "Failed",
      color: "bg-red-500/90 text-white",
      animation: "",
    },
    inactive: {
      icon: Clock,
      label: "Inactive",
      color: "bg-gray-400/90 text-white",
      animation: "",
    },
  };

  const { icon: Icon, label, color, animation } = statusConfig[status];

  const sizeConfig = {
    sm: {
      iconSize: 12,
      textSize: "text-xs",
      paddingSize: "py-0.5 px-1",
      gap: "gap-1",
      containerSize: "h-5",
    },
    md: {
      iconSize: 14,
      textSize: "text-xs",
      paddingSize: "py-0.5 px-1.5",
      gap: "gap-1.5",
      containerSize: "h-6",
    },
    lg: {
      iconSize: 16,
      textSize: "text-sm",
      paddingSize: "py-1 px-2",
      gap: "gap-1.5",
      containerSize: "h-7",
    },
  };

  const { iconSize, textSize, paddingSize, gap, containerSize } = sizeConfig[size];

  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full",
        color,
        containerSize,
        showText ? paddingSize : "p-1",
        showText ? gap : "",
        className
      )}
    >
      <span
        className={cn(
          "flex items-center justify-center",
          animation
        )}
      >
        <Icon size={iconSize} strokeWidth={2.5} />
      </span>
      {showText && <span className={cn(textSize, "font-medium")}>{label}</span>}
    </div>
  );
};

export default IntegrationStatus;
