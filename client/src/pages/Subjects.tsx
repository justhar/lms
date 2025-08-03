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
