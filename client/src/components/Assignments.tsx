import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getAssignmentsLeft } from "@/lib/db";
import { useAuthStore } from "@/stores";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";

const assignments = [
  {
    id: 1,
    title: "Linear Algebra Problem Set 3",
    subject: "Mathematics",
    dueDate: "Tomorrow, 11:59 PM",
    priority: "high",
    type: "Problem Set",
    description: "Solve problems 1-15 from Chapter 4",
  },
  {
    id: 2,
    title: "Essay: The Industrial Revolution",
    subject: "History",
    dueDate: "Friday, 11:59 PM",
    priority: "medium",
    type: "Essay",
    description: "1500-word essay on economic impacts",
  },
  {
    id: 3,
    title: "Lab Report: Chemical Reactions",
    subject: "Chemistry",
    dueDate: "Next Monday, 11:59 PM",
    type: "Lab Report",
    description: "Analysis of experiment conducted last week",
  },
  {
    id: 4,
    title: "Programming Project: Calculator App",
    subject: "Computer Science",
    dueDate: "Next Wednesday, 11:59 PM",
    priority: "submitted",
    type: "Project",
    description: "Build a calculator using React",
  },
];

type Assignment = {
  posts: {
    id: number;
    content: string;
    createdAt: string;
    title: string;
    deadline: string;
    subjectId: number;
  };
  subjects: {
    subjectName: string;
  };
};

export function Assignments() {
  const { user, token } = useAuthStore();
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const navigate = useNavigate();

  if (!user) {
    return null;
  }

  if (!token) {
    return null;
  }

  useEffect(() => {
    getAssignmentsLeft(token, user.id)
      .then((data) => {
        console.log(data);
        setAssignments(data.assignments);
      })
      .catch((error) => {
        console.error("Error fetching assignments:", error);
      });
  }, []);
  return (
    <div className="space-y-4 mt-4">
      <h2 className="text-xl font-semibold">Your Assignments</h2>
      <div className="grid gap-4 md:grid-cols-2">
        {assignments.map((assignment) => (
          <Card
            key={assignment.posts.id}
            className="hover:shadow-md transition-shadow"
          >
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <CardTitle className="text-lg leading-tight">
                    {assignment.posts.title}
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">
                    {assignment.subjects.subjectName}
                  </p>
                </div>
                <Badge variant={"secondary"} className="text-xs">
                  submitted
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="flex flex-col justify-between h-full space-y-4">
              <p className="text-sm text-muted-foreground">
                {assignment.posts.content}
              </p>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Clock className="size-3" />
                    <span>
                      {
                        /* Format the deadline date */
                        new Date(assignment.posts.deadline).toLocaleDateString(
                          "en-US",
                          {
                            // weekday: "long",
                            day: "numeric",
                            month: "long",
                            hour: "2-digit",
                            minute: "2-digit",
                          }
                        )
                      }
                    </span>
                  </div>
                </div>

                <Button
                  className="w-full bg-transparent"
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    navigate(
                      `subjects/${assignment.posts.subjectId}/post/${assignment.posts.id}`
                    )
                  }
                >
                  View Assignment
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
