"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { User, Building2, Flag, Clock, Edit2, Save, X, UserPlus, UserMinus, Trash2 } from "lucide-react";
import { assignTaskToEmployee, removeTaskAssignment, deleteTask } from "@/lib/actions";
import { toast } from "sonner";

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

interface TaskDetailModalProps {
  task: Task | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdate?: (taskId: string, updates: Partial<Task & { forceRefresh?: boolean }>) => void;
  availableEmployees?: Array<{
    id: string;
    name: string;
    employeeId: string;
  }>;
}

const priorityColors = {
  LOW: "bg-gray-100 text-gray-800 border-gray-200",
  MEDIUM: "bg-blue-100 text-blue-800 border-blue-200",
  HIGH: "bg-orange-100 text-orange-800 border-orange-200",
  URGENT: "bg-red-100 text-red-800 border-red-200",
};

const statusColors = {
  TODO: "bg-slate-100 text-slate-800 border-slate-200",
  IN_PROGRESS: "bg-blue-100 text-blue-800 border-blue-200",
  IN_REVIEW: "bg-yellow-100 text-yellow-800 border-yellow-200",
  DONE: "bg-green-100 text-green-800 border-green-200",
};

const statusLabels = {
  TODO: "To Do",
  IN_PROGRESS: "In Progress",
  IN_REVIEW: "In Review",
  DONE: "Done",
};

export default function TaskDetailModal({ task, isOpen, onClose, onUpdate, availableEmployees = [] }: Readonly<TaskDetailModalProps>) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTask, setEditedTask] = useState<Partial<Task>>({});
  const [isAssigning, setIsAssigning] = useState(false);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string>("");

  if (!task) return null;

  const handleEdit = () => {
    setIsEditing(true);
    setEditedTask({
      title: task.title,
      description: task.description,
      priority: task.priority,
      status: task.status,
    });
  };

  const handleSave = () => {
    if (onUpdate) {
      onUpdate(task.id, editedTask);
    }
    setIsEditing(false);
    setEditedTask({});
  };
  const handleCancel = () => {
    setIsEditing(false);
    setEditedTask({});
  };
  const handleAssignEmployee = async () => {
    if (!selectedEmployeeId || !task) return;
    
    setIsAssigning(true);
    try {
      const result = await assignTaskToEmployee(task.id, selectedEmployeeId);      if (result.success) {
        toast.success("Employee assigned successfully");
        setSelectedEmployeeId("");
        // Signal that assignments were updated but don't close modal
        if (onUpdate) {
          onUpdate(task.id, { forceRefresh: true });
        }
      } else {
        toast.error(result.error || "Failed to assign employee");
      }
    } catch (error) {
      console.error("Error assigning employee:", error);
      toast.error("Failed to assign employee");
    } finally {
      setIsAssigning(false);
    }
  };

  const handleRemoveAssignment = async (employeeId: string) => {
    if (!task) return;
    
    try {
      const result = await removeTaskAssignment(task.id, employeeId);      if (result.success) {
        toast.success("Employee removed from task");
        // Signal that assignments were updated but don't close modal
        if (onUpdate) {
          onUpdate(task.id, { forceRefresh: true });
        }
      } else {
        toast.error(result.error || "Failed to remove employee");
      }
    } catch (error) {
      console.error("Error removing assignment:", error);
      toast.error("Failed to remove employee");
    }
  };

  const handleDeleteTask = async () => {
    if (!task) return;
    
    try {
      const result = await deleteTask(task.id);
      if (result.success) {
        toast.success("Task deleted successfully");
        onClose();
      } else {
        toast.error(result.error || "Failed to delete task");
      }
    } catch (error) {
      console.error("Error deleting task:", error);
      toast.error("Failed to delete task");
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <DialogTitle className="text-xl font-semibold">
                {isEditing ? (
                  <Input
                    value={editedTask.title ?? task.title}
                    onChange={(e) => setEditedTask(prev => ({ ...prev, title: e.target.value }))}
                    className="text-xl font-semibold border-0 p-0 h-auto focus-visible:ring-0"
                    placeholder="Task title"
                  />
                ) : (
                  task.title
                )}
              </DialogTitle>
              <DialogDescription className="mt-2 flex items-center gap-2">
                <Building2 className="h-4 w-4" />
                <span>{task.project.name}</span>
              </DialogDescription>
            </div>            <div className="flex items-center gap-2">
              {!isEditing ? (
                <>
                  <Button variant="outline" size="sm" onClick={handleEdit}>
                    <Edit2 className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                        <Trash2 className="h-4 w-4 mr-1" />
                        Delete
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete Task</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to delete this task? This action cannot be undone.
                          All task assignments will also be removed.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction 
                          onClick={handleDeleteTask}
                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                          Delete Task
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </>
              ) : (
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={handleCancel}>
                    <X className="h-4 w-4 mr-1" />
                    Cancel
                  </Button>
                  <Button size="sm" onClick={handleSave}>
                    <Save className="h-4 w-4 mr-1" />
                    Save
                  </Button>
                </div>
              )}
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Status and Priority */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Status
              </Label>
              {isEditing ? (
                <Select
                  value={editedTask.status ?? task.status}
                  onValueChange={(value) => setEditedTask(prev => ({ ...prev, status: value as Task['status'] }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="TODO">To Do</SelectItem>
                    <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                    <SelectItem value="IN_REVIEW">In Review</SelectItem>
                    <SelectItem value="DONE">Done</SelectItem>
                  </SelectContent>
                </Select>
              ) : (
                <Badge variant="outline" className={`w-fit ${statusColors[task.status]}`}>
                  {statusLabels[task.status]}
                </Badge>
              )}
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium flex items-center gap-2">
                <Flag className="h-4 w-4" />
                Priority
              </Label>
              {isEditing ? (
                <Select
                  value={editedTask.priority ?? task.priority}
                  onValueChange={(value) => setEditedTask(prev => ({ ...prev, priority: value as Task['priority'] }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="LOW">Low</SelectItem>
                    <SelectItem value="MEDIUM">Medium</SelectItem>
                    <SelectItem value="HIGH">High</SelectItem>
                    <SelectItem value="URGENT">Urgent</SelectItem>
                  </SelectContent>
                </Select>
              ) : (
                <Badge variant="outline" className={`w-fit ${priorityColors[task.priority]}`}>
                  {task.priority}
                </Badge>
              )}
            </div>
          </div>

          <Separator />

          {/* Description */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Description</Label>
            {isEditing ? (
              <Textarea
                value={editedTask.description ?? task.description ?? ""}
                onChange={(e) => setEditedTask(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Add a description for this task..."
                className="min-h-[100px]"
              />
            ) : (
              <div className="text-sm text-muted-foreground bg-muted/30 rounded-md p-3 min-h-[100px]">
                {task.description ?? "No description provided."}
              </div>
            )}
          </div>

          <Separator />          {/* Assigned Team */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium flex items-center gap-2">
                <User className="h-4 w-4" />
                Assigned Team ({task.assignments.length})
              </Label>
              
              {/* Add Employee Section */}
              {availableEmployees.length > 0 && (
                <div className="flex items-center gap-2">
                  <Select value={selectedEmployeeId} onValueChange={setSelectedEmployeeId}>
                    <SelectTrigger className="w-[180px] h-8">
                      <SelectValue placeholder="Select employee" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableEmployees
                        .filter(emp => !task.assignments.some(assignment => assignment.employee.id === emp.id))
                        .map((employee) => (
                          <SelectItem key={employee.id} value={employee.id}>
                            {employee.name}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                  <Button 
                    size="sm" 
                    onClick={handleAssignEmployee}
                    disabled={!selectedEmployeeId || isAssigning}
                  >
                    <UserPlus className="h-4 w-4 mr-1" />
                    Assign
                  </Button>
                </div>
              )}
            </div>
            
            {task.assignments.length > 0 ? (
              <div className="grid gap-2">
                {task.assignments.map((assignment) => (
                  <Card key={assignment.employee.id} className="p-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="text-xs">
                            {getInitials(assignment.employee.name)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-medium">{assignment.employee.name}</p>
                          <p className="text-xs text-muted-foreground">ID: {assignment.employee.employeeId}</p>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveAssignment(assignment.employee.id)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <UserMinus className="h-4 w-4" />
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-sm text-muted-foreground bg-muted/30 rounded-md p-3 text-center">
                No team members assigned to this task.
              </div>
            )}
          </div>

          {/* Project Information */}
          <Separator />
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <Building2 className="h-4 w-4" />
                Project Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Project Name:</span>
                  <span className="text-sm font-medium">{task.project.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Project ID:</span>
                  <span className="text-sm font-mono">{task.project.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Task ID:</span>
                  <span className="text-sm font-mono">{task.id}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
}
