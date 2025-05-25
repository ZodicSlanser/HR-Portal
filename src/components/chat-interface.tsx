"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Send, Bot, User, Loader2 } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Message {
  id: string;
  type: "user" | "assistant";
  content: string;
  timestamp: Date;
}

interface ContextData {
  employees: Array<{
    id: string;
    name: string;
    employeeId: string;
    joiningDate: Date;
    basicSalary: number;
    latestSalary: {
      month: number;
      year: number;
      bonus: number;
      deduction: number;
      total: number;
    } | null;
  }>;
  projects: Array<{
    id: string;
    name: string;
    description: string | null;
    taskCount: number;
    completedTasks: number;
    inProgressTasks: number;
  }>;
  summary: {
    totalEmployees: number;
    totalProjects: number;
    totalTasks: number;
    completedTasks: number;
  };
}

interface ChatInterfaceProps {
  contextData: ContextData;
}

// Simple AI-like response generator based on context data
function generateResponse(question: string, contextData: ContextData): string {
  const lowerQuestion = question.toLowerCase();
  
  // Employee related queries
  if (lowerQuestion.includes("employee") || lowerQuestion.includes("staff") || lowerQuestion.includes("worker")) {
    if (lowerQuestion.includes("how many") || lowerQuestion.includes("count")) {
      return `You currently have ${contextData.summary.totalEmployees} employees in your organization.`;
    }
    if (lowerQuestion.includes("list") || lowerQuestion.includes("who")) {
      const employeeList = contextData.employees.map(emp => 
        `${emp.name} (ID: ${emp.employeeId})`
      ).join(", ");
      return `Here are your employees: ${employeeList}`;
    }
    if (lowerQuestion.includes("salary") || lowerQuestion.includes("pay")) {
      const avgSalary = contextData.employees.length > 0 ? 
        Math.round(contextData.employees.reduce((sum, emp) => sum + emp.basicSalary, 0) / contextData.employees.length) : 0;
      return `The average salary across all employees is $${avgSalary.toLocaleString()}. Individual salaries range from $${Math.min(...contextData.employees.map(e => e.basicSalary)).toLocaleString()} to $${Math.max(...contextData.employees.map(e => e.basicSalary)).toLocaleString()}.`;
    }
  }
  
  // Project related queries
  if (lowerQuestion.includes("project")) {
    if (lowerQuestion.includes("how many") || lowerQuestion.includes("count")) {
      return `You have ${contextData.summary.totalProjects} active projects with a total of ${contextData.summary.totalTasks} tasks.`;
    }
    if (lowerQuestion.includes("list") || lowerQuestion.includes("what")) {
      const projectList = contextData.projects.map(proj => 
        `${proj.name} (${proj.completedTasks}/${proj.taskCount} tasks completed)`
      ).join(", ");
      return `Here are your projects: ${projectList}`;
    }
    if (lowerQuestion.includes("progress") || lowerQuestion.includes("status")) {
      const completionRate = contextData.summary.totalTasks > 0 ? 
        Math.round((contextData.summary.completedTasks / contextData.summary.totalTasks) * 100) : 0;
      return `Overall project progress: ${completionRate}% completion rate (${contextData.summary.completedTasks} out of ${contextData.summary.totalTasks} tasks completed).`;
    }
  }
  
  // Task related queries
  if (lowerQuestion.includes("task")) {
    if (lowerQuestion.includes("how many") || lowerQuestion.includes("count")) {
      return `There are ${contextData.summary.totalTasks} total tasks, with ${contextData.summary.completedTasks} completed tasks.`;
    }
    if (lowerQuestion.includes("completed") || lowerQuestion.includes("done")) {
      const completionRate = contextData.summary.totalTasks > 0 ? 
        Math.round((contextData.summary.completedTasks / contextData.summary.totalTasks) * 100) : 0;
      return `${contextData.summary.completedTasks} tasks have been completed out of ${contextData.summary.totalTasks} total tasks (${completionRate}% completion rate).`;
    }
  }
  
  // Summary/overview queries
  if (lowerQuestion.includes("summary") || lowerQuestion.includes("overview") || lowerQuestion.includes("status")) {
    return `Here's your HR overview: You have ${contextData.summary.totalEmployees} employees working on ${contextData.summary.totalProjects} projects. There are ${contextData.summary.totalTasks} total tasks with ${contextData.summary.completedTasks} completed (${Math.round((contextData.summary.completedTasks / contextData.summary.totalTasks) * 100)}% completion rate).`;
  }
  
  // Specific employee queries
  const employeeNames = contextData.employees.map(emp => emp.name.toLowerCase());
  const mentionedEmployee = employeeNames.find(name => lowerQuestion.includes(name));
  if (mentionedEmployee) {
    const employee = contextData.employees.find(emp => emp.name.toLowerCase() === mentionedEmployee);
    if (employee) {
      const joiningDate = new Date(employee.joiningDate).toLocaleDateString();
      let response = `${employee.name} (ID: ${employee.employeeId}) joined on ${joiningDate} with a basic salary of $${employee.basicSalary.toLocaleString()}.`;
      if (employee.latestSalary) {
        response += ` Their latest salary record shows a total of $${employee.latestSalary.total.toLocaleString()} for ${new Date(employee.latestSalary.year, employee.latestSalary.month - 1).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}.`;
      }
      return response;
    }
  }
  
  // Default responses for common questions
  if (lowerQuestion.includes("hello") || lowerQuestion.includes("hi")) {
    return "Hello! I'm your HR assistant. I can help you with information about employees, projects, tasks, and salaries. What would you like to know?";
  }
  
  if (lowerQuestion.includes("help")) {
    return "I can help you with:\n• Employee information and counts\n• Project status and progress\n• Task completion rates\n• Salary information\n• General HR overview\n\nJust ask me questions like 'How many employees do we have?' or 'What's the project status?'";
  }
  
  // Fallback response
  return "I understand you're asking about HR data. I can help with information about employees, projects, tasks, and salaries. Could you rephrase your question? For example, try asking 'How many employees do we have?' or 'What's our project status?'";
}

export default function ChatInterface({ contextData }: Readonly<ChatInterfaceProps>) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      type: "assistant",
      content: "Hello! I'm your HR assistant. I can help you with information about employees, projects, tasks, and salaries. What would you like to know?",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: input,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    // Simulate AI processing delay
    setTimeout(() => {
      const response = generateResponse(input, contextData);
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: "assistant",
        content: response,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, assistantMessage]);
      setIsLoading(false);
    }, 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Messages Area */}
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex items-start gap-3 ${
                message.type === "user" ? "flex-row-reverse" : ""
              }`}
            >
              <div className={`p-2 rounded-full ${
                message.type === "user" 
                  ? "bg-primary text-primary-foreground" 
                  : "bg-muted"
              }`}>
                {message.type === "user" ? (
                  <User className="h-4 w-4" />
                ) : (
                  <Bot className="h-4 w-4" />
                )}
              </div>
              
              <Card className={`max-w-[80%] ${
                message.type === "user" ? "bg-primary/10" : ""
              }`}>
                <div className="p-3">
                  <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge variant="outline" className="text-xs">
                      {message.type === "user" ? "You" : "HR Assistant"}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {message.timestamp.toLocaleTimeString()}
                    </span>
                  </div>
                </div>
              </Card>
            </div>
          ))}
          
          {isLoading && (
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-full bg-muted">
                <Bot className="h-4 w-4" />
              </div>
              <Card>
                <div className="p-3">
                  <div className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span className="text-sm text-muted-foreground">Thinking...</span>
                  </div>
                </div>
              </Card>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Input Area */}
      <div className="border-t p-4">
        <div className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask me about employees, projects, or tasks..."
            disabled={isLoading}
            className="flex-1"
          />
          <Button 
            onClick={handleSend} 
            disabled={!input.trim() || isLoading}
            size="sm"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>        <p className="text-xs text-muted-foreground mt-2">
          Try asking: &quot;How many employees do we have?&quot;, &quot;What&apos;s the project status?&quot;, or &quot;Show me employee salaries&quot;
        </p>
      </div>
    </div>
  );
}
