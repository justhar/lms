import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

export function StudentInfoCard() {
  return (
    <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
      <CardContent className="p-6">
        <div className="flex flex-col items-center space-x-4">
          <Avatar className="size-16">
            <AvatarImage
              src="/placeholder.svg?height=64&width=64"
              alt="John Smith"
            />
            <AvatarFallback className="text-lg">JS</AvatarFallback>
          </Avatar>

          <div className="flex-1 space-y-2">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold">John Smith</h2>
                <p className="text-sm text-muted-foreground">
                  Student ID: CS2024001
                </p>
              </div>
              <Badge
                variant="secondary"
                className="bg-green-100 text-green-800"
              >
                Active
              </Badge>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
