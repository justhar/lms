import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "../components/ui/breadcrumb";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { useAuthStore } from "../stores";
import { Flame, GraduationCap } from "lucide-react";
import { StudentInfoCard } from "../components/StudentInfo";
import { Schedule } from "../components/Schedule";
import { Assignments } from "../components/Assignments";

export default function Dashboard() {
  const { user } = useAuthStore();

  if (!user) {
    return null;
  }

  return (
    <div className="h-screen w-screen">
      <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem className="hidden md:block">
              <BreadcrumbLink href="#">Learning Platform</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator className="hidden md:block" />
            <BreadcrumbItem>
              <BreadcrumbPage>Dashboard</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </header>
      <div className="flex flex-1 flex-col gap-6 p-6">
        {/* Welcome Section */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">
            {/*make the username first letter uppercase */}
            Welcome back,{" "}
            {user.username.charAt(0).toUpperCase() + user.username.slice(1)}!
          </h1>
          <p className="text-muted-foreground">
            Stay on top of your assignments and class schedule.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <div className="lg:col-span-2 grid grid-cols-2 gap-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Assignments Left
                  </CardTitle>
                  <GraduationCap className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">15</div>
                  <p className="text-xs text-muted-foreground">
                    Left this week
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Assignments Streak
                  </CardTitle>
                  <Flame className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">10</div>
                  <p className="text-xs text-muted-foreground">
                    Days of no missed assignments
                  </p>
                </CardContent>
              </Card>
            </div>
            <div>
              <Assignments />
            </div>
          </div>

          {/* Sidebar Content */}
          <div className="space-y-6">
            <StudentInfoCard />
            <Schedule />
          </div>
        </div>
      </div>
    </div>
  );
}
