import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AssignmentCard } from "@/components/AssignmentCard";
import { BookOpen, Clock, User, Calendar } from "lucide-react";
import { useAuthStore } from "@/stores";
import { getPosts, getSubject } from "@/lib/db";
import { useParams } from "react-router";
import { useEffect, useState } from "react";

const upcomingClasses = [
  {
    date: "Tomorrow",
    time: "9:00 AM - 10:30 AM",
    topic: "Linear Transformations",
    type: "Lecture",
  },
  {
    date: "Friday",
    time: "9:00 AM - 10:30 AM",
    topic: "Matrix Operations",
    type: "Practice Session",
  },
];

export default function SubjectDetail() {
  const { user, token } = useAuthStore();
  const { subjectId } = useParams<{ subjectId: string }>();
  const [subject, setSubject] = useState<any>();
  const [posts, setPosts] = useState<any[]>([]);

  if (!user || !token || !user.classId || !subjectId) {
    return null;
  }

  useEffect(() => {
    getSubject(token, parseInt(subjectId))
      .then((data) => {
        setSubject(data);
        console.log("ini subject", data);
      })
      .catch((error) => {
        console.error("Error fetching subject data:", error);
      });

    getPosts(token, parseInt(subjectId))
      .then((data) => {
        setPosts(data?.posts || []); // Ensure we set an array
        console.log("ini posts", data);
      })
      .catch((error) => {
        console.error("Error fetching subject data:", error);
        setPosts([]); // Set empty array on error
      });
  }, []);
  return (
    <div className="flex h-full w-full flex-col">
      <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem className="hidden md:block">
              <BreadcrumbLink href="/">Learning Platform</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator className="hidden md:block" />
            <BreadcrumbItem>
              <BreadcrumbLink href="/subjects">Subjects</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator className="hidden md:block" />
            <BreadcrumbItem>
              <BreadcrumbPage>
                {subject?.subject.subjects?.subjectName}
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </header>

      <div className="flex flex-1 flex-col gap-6 p-6">
        {/* Subject Header */}
        <div className="space-y-4">
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 rounded-full bg-blue-500" />
                <h1 className="text-3xl font-bold tracking-tight">
                  {subject?.subject.subjects?.subjectName}
                </h1>
              </div>
              <p className="text-muted-foreground">
                {subject?.subject.subjects?.description}
              </p>
            </div>
            <Badge variant="secondary" className="bg-green-100 text-green-800">
              Active
            </Badge>
          </div>

          {/* Subject Info Card */}
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-row gap-4 text-sm justify-around">
                <div className="flex items-center gap-2">
                  <User className="text-muted-foreground" />
                  <div>
                    <p className="font-medium">
                      {subject?.subject.users?.fullName}
                    </p>
                    <p className="text-muted-foreground">Instructor</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <BookOpen className="text-muted-foreground" />
                  <div>
                    <p className="font-medium">{posts.length} Assignments</p>
                    <p className="text-muted-foreground">This semester</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Assignments Section */}
          <div className="lg:col-span-2 space-y-6">
            <div>
              <h2 className="text-xl font-semibold mb-4">Posts</h2>
              <div className="grid gap-4">
                {Array.isArray(posts) && posts.length > 0 ? (
                  posts.map((post, index) => (
                    <AssignmentCard key={index} post={{ ...post }} />
                  ))
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    No posts available
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar Content */}
          <div className="space-y-6">
            {/* Upcoming Classes */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="size-4" />
                  Upcoming Classes
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {upcomingClasses.map((class_, index) => (
                  <div key={index} className="p-3 rounded-lg border space-y-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium text-sm">{class_.topic}</p>
                        <p className="text-xs text-muted-foreground">
                          {class_.type}
                        </p>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {class_.date}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="size-3" />
                      <span>{class_.time}</span>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
