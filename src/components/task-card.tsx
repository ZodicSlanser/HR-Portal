"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Calendar, User } from "lucide-react";

interface Task {
  id: string;
  title: string;
  description: string | null;
  priority: "LOW" | "MEDIUM" | "HIGH" | "URGENT";
  status: "TODO" | "IN_PROGRESS" | "IN_REVIEW" | "DONE";
  project: {
    id: string;
    name: string;
  };
  assignments: Array<{
    employee: {
      id: string;
      name: string;
      employeeId: string;
    };
  }>;
}

interface TaskCardProps {
  task: Task;
  isDragging?: boolean;
  viewMode?: "compact" | "relaxed";
  onTaskClick?: (task: Task) => void;
}

const priorityColors = {
  LOW: "bg-gray-100 text-gray-800 border-gray-200",
  MEDIUM: "bg-blue-100 text-blue-800 border-blue-200",
  HIGH: "bg-orange-100 text-orange-800 border-orange-200",
  URGENT: "bg-red-100 text-red-800 border-red-200",
};

export default function TaskCard({ task, isDragging = false, viewMode = "relaxed", onTaskClick }: Readonly<TaskCardProps>) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging: isSortableDragging,
  } = useSortable({
    id: task.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging || isSortableDragging ? 0.5 : 1,
  };  const handleCardClick = (e: React.MouseEvent) => {
    // Only trigger click if not dragging and onTaskClick is provided
    if (!isSortableDragging && !isDragging && onTaskClick) {
      e.stopPropagation();
      onTaskClick(task);
    }
  };

  // Get initials for assigned employees
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  // Determine styling based on view mode
  const cardPadding = viewMode === "compact" ? "p-2" : "p-3";
  const headerPadding = viewMode === "compact" ? "pb-1" : "pb-2";
  const contentSpacing = viewMode === "compact" ? "space-y-1" : "space-y-3";
  const textSize = viewMode === "compact" ? "text-xs" : "text-sm";
  const titleSize = viewMode === "compact" ? "text-xs" : "text-sm";
  const avatarSize = viewMode === "compact" ? "h-5 w-5" : "h-6 w-6";  return (
    <Card
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={handleCardClick}
      className={`cursor-grab active:cursor-grabbing transition-all hover:shadow-md ${
        isDragging || isSortableDragging ? "shadow-lg ring-2 ring-blue-500" : ""
      } ${onTaskClick ? "hover:bg-muted/50" : ""} ${cardPadding}`}
    >
      <CardHeader className={headerPadding}>
        <div className="flex items-start justify-between gap-2">
          <h4 className={`font-medium ${titleSize} leading-tight line-clamp-2`}>
            {task.title}
          </h4>
          <Badge
            variant="outline"
            className={`text-xs px-2 py-1 ${priorityColors[task.priority]} ${viewMode === "compact" ? "text-xs" : ""}`}
          >
            {task.priority}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className={contentSpacing}>
        {task.description && viewMode === "relaxed" && (
          <p className="text-xs text-muted-foreground line-clamp-2">
            {task.description}
          </p>
        )}

        <div className={`flex items-center gap-2 ${textSize} text-muted-foreground`}>
          <Calendar className="h-3 w-3" />
          <span>{task.project.name}</span>
        </div>

        {task.assignments.length > 0 && (
          <div className="flex items-center gap-2">
            <User className="h-3 w-3 text-muted-foreground" />
            <div className="flex -space-x-1">
              {task.assignments.slice(0, viewMode === "compact" ? 2 : 3).map((assignment) => (
                <Avatar
                  key={assignment.employee.id}
                  className={`${avatarSize} border-2 border-background`}
                >
                  <AvatarFallback className="text-xs">
                    {getInitials(assignment.employee.name)}
                  </AvatarFallback>
                </Avatar>
              ))}
              {task.assignments.length > (viewMode === "compact" ? 2 : 3) && (
                <div className={`${avatarSize} rounded-full bg-muted border-2 border-background flex items-center justify-center`}>
                  <span className="text-xs text-muted-foreground">
                    +{task.assignments.length - (viewMode === "compact" ? 2 : 3)}
                  </span>
                </div>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
