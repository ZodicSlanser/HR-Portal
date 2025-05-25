"use client";

import { useState, useEffect } from "react";
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
  closestCenter,
  useDroppable,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowUpDown, ArrowUp, RotateCcw, ChevronDown, ChevronUp, Maximize2, Minimize2, FolderOpen, Plus } from "lucide-react";
import { updateTaskStatus, updateTask } from "@/lib/actions";
import TaskCard from "./task-card";
import TaskDetailModal from "./task-detail-modal";
import ProjectForm from "./project-form";
import TaskForm from "./task-form";

type TaskStatus = "TODO" | "IN_PROGRESS" | "IN_REVIEW" | "DONE";
type SortOption = "priority" | "default";
type ViewMode = "compact" | "relaxed";

interface Task {
  id: string;
  title: string;
  description: string | null;
  priority: "LOW" | "MEDIUM" | "HIGH" | "URGENT";
  status: TaskStatus;
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

interface Project {
  id: string;
  name: string;
  description: string | null;
}

interface KanbanBoardProps {
  tasks: Task[];
  projects?: Project[];
  employees?: Array<{
    id: string;
    name: string;
    employeeId: string;
  }>;
}

// Priority order mapping for sorting (higher number = higher priority)
const priorityOrder = {
  URGENT: 4,
  HIGH: 3,
  MEDIUM: 2,
  LOW: 1,
};

const columns: Array<{ id: TaskStatus; title: string; color: string }> = [
  { id: "TODO", title: "To Do", color: "bg-slate-100 border-slate-200" },
  { id: "IN_PROGRESS", title: "In Progress", color: "bg-blue-50 border-blue-200" },
  { id: "IN_REVIEW", title: "In Review", color: "bg-yellow-50 border-yellow-200" },
  { id: "DONE", title: "Done", color: "bg-green-50 border-green-200" },
];

// Droppable Column Component
function DroppableColumn({ 
  column, 
  tasks,
  sortOption,
  onSortChange,
  viewMode,
  isExpanded,
  onToggleExpanded,
  onTaskClick
}: Readonly<{ 
  column: { id: TaskStatus; title: string; color: string };
  tasks: Task[];
  sortOption: SortOption;
  onSortChange: (columnId: TaskStatus, sortOption: SortOption) => void;
  viewMode: ViewMode;
  isExpanded: boolean;
  onToggleExpanded: (columnId: TaskStatus) => void;
  onTaskClick: (task: Task) => void;
}>){
  const { setNodeRef } = useDroppable({
    id: column.id,
  });

  // Sort tasks based on the selected option
  const sortedTasks = [...tasks].sort((a, b) => {
    if (sortOption === "priority") {
      return priorityOrder[b.priority] - priorityOrder[a.priority]; // Descending order (URGENT first)
    }
    return 0; // Default order (no sorting)
  });

  // Determine how many tasks to show
  const maxVisibleTasks = viewMode === "compact" ? 3 : 5;
  const visibleTasks = isExpanded ? sortedTasks : sortedTasks.slice(0, maxVisibleTasks);
  const hasHiddenTasks = sortedTasks.length > maxVisibleTasks;

  const getSortIcon = () => {
    if (sortOption === "priority") {
      return <ArrowUp className="h-3 w-3 text-blue-600" />;
    }
    return <ArrowUpDown className="h-3 w-3 text-gray-400" />;
  };

  const getSortLabel = () => {
    if (sortOption === "priority") {
      return "Priority";
    }
    return "Default";
  };

  const handleSortToggle = () => {
    const newSort = sortOption === "default" ? "priority" : "default";
    onSortChange(column.id, newSort);
  };

  const cardHeight = viewMode === "compact" ? "min-h-[350px]" : "min-h-[400px]";
  const taskSpacing = viewMode === "compact" ? "space-y-1" : "space-y-2";

  return (
    <Card className={`${column.color} ${cardHeight} transition-all duration-200 hover:shadow-md`}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between mb-3">
          <CardTitle className="text-sm font-semibold flex items-center">
            {column.title}
            <Badge variant="secondary" className="ml-2 bg-white/70 text-gray-700">
              {tasks.length}
            </Badge>
          </CardTitle>
        </div>
        
        {/* Enhanced Sorting Controls */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground font-medium">Sort:</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleSortToggle}
              className={`h-7 px-2 text-xs font-medium transition-all duration-200 ${
                sortOption === "priority" 
                  ? "bg-blue-100 text-blue-700 hover:bg-blue-200" 
                  : "hover:bg-gray-100"
              }`}
            >
              {getSortIcon()}
              <span className="ml-1">{getSortLabel()}</span>
            </Button>
            {sortOption === "priority" && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onSortChange(column.id, "default")}
                className="h-7 w-7 p-0 hover:bg-gray-100"
                title="Reset to default order"
              >
                <RotateCcw className="h-3 w-3 text-gray-500" />
              </Button>
            )}
          </div>
          
          {/* Expand/Collapse Button */}
          {hasHiddenTasks && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onToggleExpanded(column.id)}
              className="h-7 px-2 text-xs hover:bg-white/50"
            >
              {isExpanded ? (
                <>
                  <Minimize2 className="h-3 w-3 mr-1" />
                  <span>Less</span>
                </>
              ) : (
                <>
                  <Maximize2 className="h-3 w-3 mr-1" />
                  <span>More</span>
                </>
              )}
            </Button>
          )}
        </div>

        {/* Priority Indicator */}
        {sortOption === "priority" && (
          <div className="flex items-center gap-1 text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded-md mt-2">
            <ArrowUp className="h-3 w-3" />
            <span className="font-medium">Sorted by Priority (High to Low)</span>
          </div>
        )}
      </CardHeader>
      
      <CardContent ref={setNodeRef} className={`${taskSpacing} min-h-[250px] relative`}>        <SortableContext
          items={visibleTasks.map(task => task.id)}
          strategy={verticalListSortingStrategy}
        >
          {visibleTasks.map((task) => (
            <TaskCard key={task.id} task={task} viewMode={viewMode} onTaskClick={onTaskClick} />
          ))}
        </SortableContext>
        
        {/* Hidden tasks indicator */}
        {hasHiddenTasks && !isExpanded && (
          <div className="mt-3 pt-3 border-t border-gray-200/50">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onToggleExpanded(column.id)}
              className="w-full h-8 text-xs text-gray-500 hover:text-gray-700 hover:bg-white/50"
            >
              <ChevronDown className="h-3 w-3 mr-1" />
              Show {sortedTasks.length - maxVisibleTasks} more tasks
            </Button>
          </div>
        )}
        
        {/* Collapse indicator */}
        {isExpanded && hasHiddenTasks && (
          <div className="mt-3 pt-3 border-t border-gray-200/50">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onToggleExpanded(column.id)}
              className="w-full h-8 text-xs text-gray-500 hover:text-gray-700 hover:bg-white/50"
            >
              <ChevronUp className="h-3 w-3 mr-1" />
              Show less
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default function KanbanBoard({ tasks, projects = [], employees = [] }: Readonly<KanbanBoardProps>) {
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>("relaxed");
  const [selectedProjectId, setSelectedProjectId] = useState<string>("all");
  const [columnSorts, setColumnSorts] = useState<Record<TaskStatus, SortOption>>({
    TODO: "default",
    IN_PROGRESS: "default", 
    IN_REVIEW: "default",
    DONE: "default"
  });
  const [expandedColumns, setExpandedColumns] = useState<Record<TaskStatus, boolean>>({
    TODO: false,
    IN_PROGRESS: false,
    IN_REVIEW: false,
    DONE: false
  });

  // Prevent hydration mismatch by only rendering DndContext after mounting
  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSortChange = (columnId: TaskStatus, sortOption: SortOption) => {
    setColumnSorts(prev => ({
      ...prev,
      [columnId]: sortOption
    }));
  };

  const handleToggleExpanded = (columnId: TaskStatus) => {
    setExpandedColumns(prev => ({
      ...prev,
      [columnId]: !prev[columnId]
    }));
  };
  const toggleViewMode = () => {
    setViewMode(prev => prev === "compact" ? "relaxed" : "compact");
  };

  const handleTaskClick = (task: Task) => {
    setSelectedTask(task);
    setIsTaskModalOpen(true);
  };

  const handleTaskModalClose = () => {
    setIsTaskModalOpen(false);
    setSelectedTask(null);
  };  const handleTaskUpdate = async (taskId: string, updates: Partial<Task>) => {
    try {
      // Use the comprehensive updateTask function to handle all field updates
      await updateTask(taskId, {
        title: updates.title,
        description: updates.description ?? undefined,
        priority: updates.priority,
        status: updates.status,
      });
      
      handleTaskModalClose();
    } catch (error) {
      console.error("Failed to update task:", error);
    }
  };
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  // Filter tasks by selected project
  const filteredTasks = selectedProjectId === "all" 
    ? tasks 
    : tasks.filter(task => task.project.id === selectedProjectId);

  const tasksByStatus = columns.reduce((acc, column) => {
    acc[column.id] = filteredTasks.filter(task => task.status === column.id);
    return acc;
  }, {} as Record<TaskStatus, Task[]>);

  // Get current project info
  const currentProject = projects.find(p => p.id === selectedProjectId);
  const projectTaskCounts = projects.map(project => ({
    ...project,
    taskCount: tasks.filter(task => task.project.id === project.id).length
  }));

  function handleDragStart(event: DragStartEvent) {
    const task = tasks.find(t => t.id === event.active.id);
    setActiveTask(task || null);
  }  async function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    
    if (!over) return;
    
    const taskId = active.id as string;
    let newStatus: TaskStatus;
    
    // Check if we dropped on a column or on a task
    const isColumnId = columns.some(col => col.id === over.id);
    
    if (isColumnId) {
      // Dropped directly on a column
      newStatus = over.id as TaskStatus;
    } else {
      // Dropped on a task, find which column that task belongs to
      const targetTask = tasks.find(t => t.id === over.id);
      if (!targetTask) {
        setActiveTask(null);
        return;
      }
      newStatus = targetTask.status;
    }
    
    const task = tasks.find(t => t.id === taskId);
    if (!task || task.status === newStatus) {
      setActiveTask(null);
      return;
    }

    // Optimistic update - you might want to handle this better in a real app
    try {
      await updateTaskStatus(taskId, newStatus);
    } catch (error) {
      console.error("Failed to update task status:", error);
    }
    
    setActiveTask(null);  }  // Show a loading state or simplified view before hydration
  if (!mounted) {
    return (
      <div className="space-y-4">
        {/* View Mode Toggle */}
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Kanban Board</h2>
          <Button
            variant="outline"
            size="sm"
            onClick={toggleViewMode}
            className="flex items-center gap-2"
          >
            {viewMode === "compact" ? <Maximize2 className="h-4 w-4" /> : <Minimize2 className="h-4 w-4" />}
            {viewMode === "compact" ? "Relaxed View" : "Compact View"}
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {columns.map((column) => {
            const columnTasks = tasks.filter(task => task.status === column.id);
            
            // Apply sorting even in pre-hydration state
            const sortedTasks = [...columnTasks].sort((a, b) => {
              if (columnSorts[column.id] === "priority") {
                return priorityOrder[b.priority] - priorityOrder[a.priority];
              }
              return 0;
            });

            // Determine visibility for pre-hydration
            const maxVisibleTasks = viewMode === "compact" ? 3 : 5;
            const visibleTasks = expandedColumns[column.id] ? sortedTasks : sortedTasks.slice(0, maxVisibleTasks);
            const hasHiddenTasks = sortedTasks.length > maxVisibleTasks;

            const getSortIcon = () => {
              if (columnSorts[column.id] === "priority") {
                return <ArrowUp className="h-3 w-3 text-blue-600" />;
              }
              return <ArrowUpDown className="h-3 w-3 text-gray-400" />;
            };

            const getSortLabel = () => {
              if (columnSorts[column.id] === "priority") {
                return "Priority";
              }
              return "Default";
            };

            const handleSortToggle = () => {
              const newSort = columnSorts[column.id] === "default" ? "priority" : "default";
              handleSortChange(column.id, newSort);
            };

            const cardHeight = viewMode === "compact" ? "min-h-[350px]" : "min-h-[400px]";
            const taskSpacing = viewMode === "compact" ? "space-y-1" : "space-y-2";
            
            return (
              <Card key={column.id} className={`${column.color} ${cardHeight} transition-all duration-200 hover:shadow-md`}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between mb-3">
                    <CardTitle className="text-sm font-semibold flex items-center">
                      {column.title}
                      <Badge variant="secondary" className="ml-2 bg-white/70 text-gray-700">
                        {columnTasks.length}
                      </Badge>
                    </CardTitle>
                  </div>
                  
                  {/* Enhanced Sorting Controls */}
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground font-medium">Sort:</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleSortToggle}
                        className={`h-7 px-2 text-xs font-medium transition-all duration-200 ${
                          columnSorts[column.id] === "priority" 
                            ? "bg-blue-100 text-blue-700 hover:bg-blue-200" 
                            : "hover:bg-gray-100"
                        }`}
                      >
                        {getSortIcon()}
                        <span className="ml-1">{getSortLabel()}</span>
                      </Button>
                      {columnSorts[column.id] === "priority" && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleSortChange(column.id, "default")}
                          className="h-7 w-7 p-0 hover:bg-gray-100"
                          title="Reset to default order"
                        >
                          <RotateCcw className="h-3 w-3 text-gray-500" />
                        </Button>
                      )}
                    </div>
                    
                    {/* Expand/Collapse Button */}
                    {hasHiddenTasks && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleToggleExpanded(column.id)}
                        className="h-7 px-2 text-xs hover:bg-white/50"
                      >
                        {expandedColumns[column.id] ? (
                          <>
                            <Minimize2 className="h-3 w-3 mr-1" />
                            <span>Less</span>
                          </>
                        ) : (
                          <>
                            <Maximize2 className="h-3 w-3 mr-1" />
                            <span>More</span>
                          </>
                        )}
                      </Button>
                    )}
                  </div>
                  
                  {/* Priority Indicator */}
                  {columnSorts[column.id] === "priority" && (
                    <div className="flex items-center gap-1 text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded-md mt-2">
                      <ArrowUp className="h-3 w-3" />
                      <span className="font-medium">Sorted by Priority (High to Low)</span>
                    </div>
                  )}
                </CardHeader>
                  <CardContent className={`${taskSpacing} min-h-[250px] relative`}>
                  {visibleTasks.map((task) => (
                    <TaskCard key={task.id} task={task} viewMode={viewMode} onTaskClick={handleTaskClick} />
                  ))}
                  
                  {/* Hidden tasks indicator */}
                  {hasHiddenTasks && !expandedColumns[column.id] && (
                    <div className="mt-3 pt-3 border-t border-gray-200/50">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleToggleExpanded(column.id)}
                        className="w-full h-8 text-xs text-gray-500 hover:text-gray-700 hover:bg-white/50"
                      >
                        <ChevronDown className="h-3 w-3 mr-1" />
                        Show {sortedTasks.length - maxVisibleTasks} more tasks
                      </Button>
                    </div>
                  )}
                  
                  {/* Collapse indicator */}
                  {expandedColumns[column.id] && hasHiddenTasks && (
                    <div className="mt-3 pt-3 border-t border-gray-200/50">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleToggleExpanded(column.id)}
                        className="w-full h-8 text-xs text-gray-500 hover:text-gray-700 hover:bg-white/50"
                      >
                        <ChevronUp className="h-3 w-3 mr-1" />
                        Show less
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            );          })}
        </div>

        {/* Task Detail Modal */}
        <TaskDetailModal
          task={selectedTask}
          isOpen={isTaskModalOpen}
          onClose={handleTaskModalClose}
          onUpdate={handleTaskUpdate}
        />
      </div>
    );  }
    return (
    <div className="space-y-4">
      {/* Project Management Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <h2 className="text-lg font-semibold text-gray-900">Kanban Board</h2>
          
          {/* Project Selector */}
          <div className="flex items-center gap-2">
            <FolderOpen className="h-4 w-4 text-muted-foreground" />
            <Select value={selectedProjectId} onValueChange={setSelectedProjectId}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Select project" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">
                  <div className="flex items-center gap-2">
                    <span>All Projects</span>
                    <Badge variant="secondary" className="text-xs">
                      {tasks.length}
                    </Badge>
                  </div>
                </SelectItem>
                {projectTaskCounts.map((project) => (
                  <SelectItem key={project.id} value={project.id}>
                    <div className="flex items-center gap-2">
                      <span>{project.name}</span>
                      <Badge variant="outline" className="text-xs">
                        {project.taskCount}
                      </Badge>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Project Actions */}
          {projects.length > 0 && (
            <>
              {employees.length > 0 && (
                <TaskForm projects={projects.filter(p => selectedProjectId === "all" || p.id === selectedProjectId)}>
                  <Button variant="outline" size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Task
                  </Button>
                </TaskForm>
              )}
              
              <ProjectForm>
                <Button variant="outline" size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  New Project
                </Button>
              </ProjectForm>
            </>
          )}
          
          {/* View Mode Toggle */}
          <Button
            variant="outline"
            size="sm"
            onClick={toggleViewMode}
            className="flex items-center gap-2"
          >
            {viewMode === "compact" ? <Maximize2 className="h-4 w-4" /> : <Minimize2 className="h-4 w-4" />}
            {viewMode === "compact" ? "Relaxed View" : "Compact View"}
          </Button>
        </div>
      </div>

      {/* Current Project Info */}
      {selectedProjectId !== "all" && currentProject && (
        <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-blue-900">{currentProject.name}</h3>
                {currentProject.description && (
                  <p className="text-sm text-blue-700 mt-1">{currentProject.description}</p>
                )}
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="default" className="bg-blue-100 text-blue-800">
                  {filteredTasks.length} tasks
                </Badge>
                <ProjectForm project={currentProject}>
                  <Button variant="ghost" size="sm" className="text-blue-700 hover:bg-blue-100">
                    Edit Project
                  </Button>
                </ProjectForm>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {columns.map((column) => (
            <DroppableColumn
              key={column.id}
              column={column}
              tasks={tasksByStatus[column.id]}
              sortOption={columnSorts[column.id]}
              onSortChange={handleSortChange}
              viewMode={viewMode}
              isExpanded={expandedColumns[column.id]}
              onToggleExpanded={handleToggleExpanded}
              onTaskClick={handleTaskClick}
            />
          ))}
        </div>

        <DragOverlay>
          {activeTask ? <TaskCard task={activeTask} isDragging viewMode={viewMode} /> : null}
        </DragOverlay>
      </DndContext>

      {/* Task Detail Modal */}
      <TaskDetailModal
        task={selectedTask}
        isOpen={isTaskModalOpen}
        onClose={handleTaskModalClose}
        onUpdate={handleTaskUpdate}
      />
    </div>
  );
}
