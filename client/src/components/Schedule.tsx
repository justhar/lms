import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, MapPin } from "lucide-react";

const scheduleItems = [
  {
    id: 1,
    subject: "Mathematics",
    type: "Lecture",
    time: "9:00 AM - 10:30 AM",
    location: "Room 201",
    instructor: "Dr. Smith",
    status: "upcoming",
  },
  {
    id: 2,
    subject: "Chemistry",
    type: "Lab",
    time: "11:00 AM - 12:30 PM",
    location: "Lab 3B",
    instructor: "Prof. Johnson",
    status: "upcoming",
  },
  {
    id: 3,
    subject: "History",
    type: "Discussion",
    time: "2:00 PM - 3:00 PM",
    location: "Room 105",
    instructor: "Ms. Davis",
    status: "completed",
  },
  {
    id: 4,
    subject: "Computer Science",
    type: "Workshop",
    time: "3:30 PM - 5:00 PM",
    location: "Computer Lab",
    instructor: "Mr. Wilson",
    status: "upcoming",
  },
];

export function Schedule() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="size-4" />
          Today's Schedule
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 mt-2">
        {scheduleItems.map((item) => (
          <div
            key={item.id}
            className="flex items-start space-x-3 p-3 rounded-lg border"
          >
            <div className="flex-1 space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">{item.subject}</p>
                  <p className="text-xs text-muted-foreground">
                    {item.type} • {item.instructor}
                  </p>
                </div>
                <Badge
                  variant={
                    item.status === "completed" ? "secondary" : "default"
                  }
                  className="text-xs"
                >
                  {item.status}
                </Badge>
              </div>

              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Clock className="size-3" />
                  <span>{item.time}</span>
                </div>
                <div className="flex items-center gap-1">
                  <MapPin className="size-3" />
                  <span>{item.location}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
