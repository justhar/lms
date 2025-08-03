import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BookOpen, Clock, User, FileText, Sigma } from "lucide-react";
import { useNavigate } from "react-router";

export function SubjectCard({ description, subjectName, id, teacherId }: any) {
  const navigate = useNavigate();

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <CardTitle className="text-lg">{subjectName}</CardTitle>
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <User className="size-3" />
              <span>{teacherId}</span>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          {/* <BookOpen className="size-3" /> */}
          <span className="text-muted-foreground">{description}</span>
        </div>
        {/* <div className="flex items-center gap-1 text-muted-foreground">
              <Clock className="size-3" />
              <span></span>
            </div> */}
        <Button
          className="w-full bg-transparent"
          variant="outline"
          onClick={() => navigate("/subjects/" + id)}
        >
          View Subject
        </Button>
      </CardContent>
    </Card>
  );
}
