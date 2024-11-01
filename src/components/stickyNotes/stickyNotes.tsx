import React, { useState } from "react";
import { motion, useAnimation } from "framer-motion";
import {
  Calendar,
  Clock,
  BookOpen,
  Gamepad2,
  Brain,
  Search,
  Plus,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { ReactNode } from "react";

const FloatingObject = ({
  children,
  className,
}: {
  children: ReactNode;
  className: string;
}) => (
  <motion.div
    className={`absolute ${className}`}
    animate={{
      y: [0, -10, 0],
      rotate: [0, 5, -5, 0],
    }}
    transition={{
      duration: 5,
      repeat: Infinity,
      repeatType: "reverse",
    }}>
    {children}
  </motion.div>
);

const ScheduleManager = () => {
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("category");

  const categories = [
    { id: "all", label: "All Tasks", icon: Calendar },
    { id: "daily", label: "Daily Schedule", icon: Clock },
    { id: "angular", label: "Angular", icon: BookOpen },
    { id: "other", label: "Other Tech", icon: Brain },
    { id: "game", label: "Game Dev", icon: Gamepad2 },
  ];

  const notes = [
    {
        id: 'daily-1',
        category: 'daily',
        title: 'Daily Work Hours',
        items: [
          '7:30 - 10:00: Regular work duties',
          '10:00 - 11:30: Self-study session',
          '11:30 - 4:30: Regular work duties'
        ],
        priority: 'high',
        color: 'border-yellow-400',
        tags: ['routine', 'work-hours'],
        progress: 100,
        assignedTime: 'daily'
      },
      {
        id: 'angular-1',
        category: 'angular',
        title: 'Angular Fundamentals (Mon)',
        items: [
          'TypeScript basics & setup',
          'Component architecture',
          'Templates & data binding'
        ],
        priority: 'high',
        color: 'border-blue-400',
        dueDate: '2024-11-04',
        tags: ['angular', 'basics'],
        progress: 0,
        assignedTime: '10:00 - 11:30'
      },
      {
        id: 'angular-2',
        category: 'angular',
        title: 'Angular Services (Tue)',
        items: [
          'Dependency injection',
          'Service creation & usage',
          'HTTP client implementation'
        ],
        priority: 'high',
        color: 'border-blue-400',
        dueDate: '2024-11-05',
        tags: ['angular', 'services'],
        progress: 0,
        assignedTime: '10:00 - 11:30'
      },
      {
        id: 'angular-3',
        category: 'angular',
        title: 'Angular Routing (Wed)',
        items: [
          'Router setup & configuration',
          'Route parameters & guards',
          'Lazy loading modules'
        ],
        priority: 'medium',
        color: 'border-blue-400',
        dueDate: '2024-11-06',
        tags: ['angular', 'routing'],
        progress: 0,
        assignedTime: '10:00 - 11:30'
      },
      {
        id: 'other-1',
        category: 'other',
        title: 'React Enhancement',
        items: [
          'Advanced hooks practice',
          'State management patterns',
          'Performance optimization'
        ],
        priority: 'medium',
        color: 'border-green-400',
        dueDate: '2024-11-07',
        tags: ['react', 'advanced'],
        progress: 0,
        assignedTime: '5:30 - 7:00'
      },
      {
        id: 'other-2',
        category: 'other',
        title: 'Node.js & MongoDB',
        items: [
          'API development with Express',
          'MongoDB schema design',
          'Authentication implementation'
        ],
        priority: 'medium',
        color: 'border-green-400',
        dueDate: '2024-11-08',
        tags: ['backend', 'database'],
        progress: 0,
        assignedTime: '5:30 - 7:00'
      },
      {
        id: 'game-1',
        category: 'game',
        title: 'Godot Basics',
        items: [
          'Engine interface familiarization',
          'Basic 2D mechanics',
          'Scene management'
        ],
        priority: 'low',
        color: 'border-purple-400',
        dueDate: '2024-11-09',
        tags: ['game-dev', 'godot'],
        progress: 0,
        assignedTime: '5:30 - 7:00'
      },
      {
        id: 'daily-2',
        category: 'daily',
        title: 'Evening Schedule',
        items: [
          '5:30 - 7:00: Secondary skills',
          'Practice projects',
          'Code review & documentation'
        ],
        priority: 'medium',
        color: 'border-orange-400',
        tags: ['routine', 'evening'],
        progress: 100,
        assignedTime: 'daily'
      },
      {
        id: 'angular-4',
        category: 'angular',
        title: 'Angular State Management',
        items: [
          'NgRx fundamentals',
          'Actions & reducers',
          'Effects & selectors'
        ],
        priority: 'high',
        color: 'border-blue-400',
        dueDate: '2024-11-07',
        tags: ['angular', 'state'],
        progress: 0,
        assignedTime: '10:00 - 11:30'
      },
      {
        id: 'other-3',
        category: 'other',
        title: 'Testing Practices',
        items: [
          'Unit testing fundamentals',
          'Integration tests',
          'E2E testing setup'
        ],
        priority: 'medium',
        color: 'border-green-400',
        dueDate: '2024-11-10',
        tags: ['testing', 'quality'],
        progress: 0,
        assignedTime: '5:30 - 7:00'
      }

    // ... (previous notes data with added priority field)
  ];

  const filteredNotes = notes
    .filter(
      (note) => activeCategory === "all" || note.category === activeCategory
    )
    .filter(
      (note) =>
        note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        note.items.some((item) =>
          item.toLowerCase().includes(searchTerm.toLowerCase())
        )
    )
    .sort((a, b) => {
      if (sortBy === "category") return a.category.localeCompare(b.category);
      if (sortBy === "priority") return b.priority.localeCompare(a.priority);
      return 0;
    });

  return (
    <div className="relative min-h-screen overflow-hidden bg-gray-900 text-gray-100">
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gray-900" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCI+CjxyZWN0IHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgZmlsbD0iIzFhMWExYSI+PC9yZWN0Pgo8cGF0aCBkPSJNMzYgMTBMMjQgNTBMMzggNTBMMzYgMTBaIiBmaWxsPSIjMjIyIiBmaWxsLW9wYWNpdHk9IjAuMiIgc3Ryb2tlPSIjMDAwIiBzdHJva2Utd2lkdGg9IjEiPjwvcGF0aD4KPC9zdmc+')] opacity-5" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}>
          <Card className="bg-gray-800 bg-opacity-80 backdrop-blur-lg border-gray-700 mb-6">
            <CardHeader>
              <CardTitle className="text-3xl font-bold text-blue-400">
                Development Schedule
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row gap-4 mb-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search tasks..."
                    className="pl-8 bg-gray-700 border-gray-600 text-gray-100"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-40 bg-gray-700 border-gray-600 text-gray-100">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="category">Category</SelectItem>
                    <SelectItem value="priority">Priority</SelectItem>
                  </SelectContent>
                </Select>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button className="bg-blue-500 hover:bg-blue-600">
                      <Plus className="w-4 h-4 mr-2" />
                      Add Task
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="bg-gray-800 text-gray-100">
                    <DialogHeader>
                      <DialogTitle>Add New Task</DialogTitle>
                      <DialogDescription>
                        Create a new task or schedule item
                      </DialogDescription>
                    </DialogHeader>
                    {/* Add task form would go here */}

                  </DialogContent>
                </Dialog>
              </div>
              <TooltipProvider>
                <div className="flex gap-2 flex-wrap">
                  {categories.map((cat) => (
                    <Tooltip key={cat.id}>
                      <TooltipTrigger asChild>
                        <Button
                          variant={
                            activeCategory === cat.id ? "default" : "outline"
                          }
                          onClick={() => setActiveCategory(cat.id)}
                          className={`flex items-center gap-2 text-white ${
                            activeCategory === cat.id
                              ? "bg-blue-500 hover:bg-blue-600"
                              : "bg-gray-700 hover:bg-gray-600"
                          }`}>
                          <cat.icon className="w-4 h-4" />
                          {cat.label}
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Filter by {cat.label}</p>
                      </TooltipContent>
                    </Tooltip>
                  ))}
                </div>
              </TooltipProvider>
            </CardContent>
          </Card>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}>
            {filteredNotes.map((note, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}>
                <Card
                  className={`relative overflow-hidden border-l-4 ${note.color} bg-gray-800 bg-opacity-80 backdrop-blur-lg hover:shadow-lg transition-all duration-300 border-gray-700 hover:scale-105`}>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex justify-between items-center text-gray-100">
                      {note.title}
                      <Badge
                        variant="outline"
                        className={`ml-2 ${
                          note.priority === "high"
                            ? "bg-red-500/80"
                            : note.priority === "medium"
                            ? "bg-yellow-500/80"
                            : "bg-green-500/80"
                        }`}>
                        {note.category}
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {note.items.map((item, idx) => (
                        <li
                          key={idx}
                          className="text-sm text-gray-400 flex items-start">
                          <span className="mr-2 text-blue-400">•</span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>

      <FloatingObject className="top-20 left-10">
        <div className="w-16 h-16 bg-blue-500 rounded-full opacity-20" />
      </FloatingObject>
      <FloatingObject className="top-40 right-20">
        <div className="w-20 h-20 bg-purple-500 rounded-lg opacity-20 rotate-45" />
      </FloatingObject>
      <FloatingObject className="bottom-20 left-1/4">
        <div className="w-24 h-24 bg-green-500 rounded-full opacity-20" />
      </FloatingObject>
    </div>
  );
};

export default ScheduleManager;
