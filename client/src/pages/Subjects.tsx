"use client";

import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { AppSidebar } from "@/components/Sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { SubjectCard } from "@/components/SubjectCard";
import { useEffect, useState } from "react";
import { getSubjects } from "@/lib/db";
import { useAuthStore } from "@/stores";

const subjects = [
  {
    name: "Mathematics",
    instructor: "Dr. Sarah Johnson",
    room: "201",
    schedule: "Mon, Wed, Fri 9:00 AM",
    assignments: 8,
    nextClass: "Tomorrow 9:00 AM",
    color: "bg-blue-500",
  },
  {
    name: "Physics",
    instructor: "Prof. Michael Chen",
    room: "Physics Lab 1",
    schedule: "Tue, Thu 10:30 AM",
    assignments: 5,
    nextClass: "Thursday 10:30 AM",
    color: "bg-green-500",
  },
  {
    name: "Chemistry",
    instructor: "Dr. Emily Rodriguez",
    room: "Chem Lab 2",
    schedule: "Mon, Wed 2:00 PM",
    assignments: 6,
    nextClass: "Wednesday 2:00 PM",
    color: "bg-purple-500",
  },
  {
    name: "English Literature",
    instructor: "Ms. Jennifer Davis",
    room: "105",
    schedule: "Tue, Thu, Fri 11:00 AM",
    assignments: 4,
    nextClass: "Friday 11:00 AM",
    color: "bg-orange-500",
  },
  {
    name: "History",
    instructor: "Mr. Robert Wilson",
    room: "History Hall",
    schedule: "Mon, Wed 1:00 PM",
    assignments: 3,
    nextClass: "Monday 1:00 PM",
    color: "bg-red-500",
  },
  {
    name: "Computer Science",
    instructor: "Dr. Lisa Thompson",
    room: "Computer Lab",
    schedule: "Tue, Thu 3:30 PM",
    assignments: 7,
    nextClass: "Tuesday 3:30 PM",
    color: "bg-indigo-500",
  },
];

export default function Subjects() {
  const { user, token } = useAuthStore();
  const [subjects, setSubjects] = useState([]);
  if (!user || !token || !user.classId) {
    return null;
  }

  useEffect(() => {
    getSubjects(token, user.classId)
      .then((data) => {
        if (data.success) {
          // Handle the subjects data
          console.log("Subjects fetched successfully:", data);
          setSubjects(data.subjects);
        }
      })
      .catch((error) => {
        console.error("Error fetching subjects:", error);
        // Optionally, handle the error (e.g., show a toast notification)
      });
  }, [token, user.classId]);

  return (
    <div className="flex h-full w-full flex-col">
      <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem className="hidden md:block">
              <BreadcrumbLink href="#">Learning Platform</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator className="hidden md:block" />
            <BreadcrumbItem>
              <BreadcrumbPage>Subjects</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </header>
      <div>
        <div className="flex flex-1 flex-col gap-6 p-6">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight">My Subjects</h1>
            <p className="text-muted-foreground">
              You are enrolled in {subjects.length} subjects this semester.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {subjects.map((subject, index) => (
              <SubjectCard
                key={index}
                {...(subject as any)}
                //   onNavigate={onNavigate}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
