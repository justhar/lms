import { useAuthStore } from "../stores";
import { Button } from "./ui/button";

export function UserProfile() {
  const { user, logout, isAuthenticated } = useAuthStore();

  if (!isAuthenticated || !user) {
    return null;
  }

  return (
    <div className="max-w-md mx-auto p-6 bg-card rounded-lg border">
      <h2 className="text-2xl font-bold mb-4">Welcome back!</h2>

      <div className="space-y-2 mb-6">
        <p>
          <span className="font-medium">Name:</span> {user.fullName}
        </p>
        <p>
          <span className="font-medium">User ID:</span> {user.id}
        </p>
        {user.classId && (
          <p>
            <span className="font-medium">Class ID:</span> {user.classId}
          </p>
        )}
        {user.role && (
          <p>
            <span className="font-medium">Role:</span> {user.role}
          </p>
        )}
      </div>

      <Button onClick={logout} variant="destructive" className="w-full">
        Logout
      </Button>
    </div>
  );
}
