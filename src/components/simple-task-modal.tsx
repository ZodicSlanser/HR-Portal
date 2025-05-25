"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

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

interface SimpleTaskModalProps {
  task: Task | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function SimpleTaskModal({ task, isOpen, onClose }: Readonly<SimpleTaskModalProps>) {
  if (!task) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{task.title}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <p><strong>Project:</strong> {task.project.name}</p>
          <p><strong>Priority:</strong> {task.priority}</p>
          <p><strong>Status:</strong> {task.status}</p>
          {task.description && (
            <p><strong>Description:</strong> {task.description}</p>
          )}
          <Button onClick={onClose} className="w-full">Close</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
