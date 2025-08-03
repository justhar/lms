"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar } from "lucide-react";
import { useNavigate } from "react-router";

export function AssignmentCard({ post }: any) {
  const navigate = useNavigate();
  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "submitted":
        return "bg-blue-100 text-blue-800";
      case "graded":
        return "bg-green-100 text-green-800";
      case "overdue":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  console.log("di dalem assignment card", post);

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <CardTitle className="text-lg leading-tight">
              {post.title}
            </CardTitle>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-xs">
                {post.type}
              </Badge>
              <Badge className={`text-xs ${getStatusColor(post.status)}`}>
                {post.status}
              </Badge>
            </div>
          </div>
          <div className="text-right">
            {/* <p className="text-sm font-medium">
              {post.points}
              pts
            </p> */}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">{/* {description} */}</p>

        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <Calendar className="size-3" />
            <span>
              Due:{" "}
              {new Date(post.deadline).toLocaleDateString("en-US", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}{" "}
            </span>
          </div>
        </div>

        <div className="flex gap-2">
          <Button
            className="flex-1 bg-transparent"
            variant="outline"
            size="sm"
            onClick={() =>
              navigate(`/subjects/${post.subjectId}/post/${post.id}`)
            }
          >
            View Details
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
