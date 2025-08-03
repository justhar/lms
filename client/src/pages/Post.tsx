import { getPost } from "@/lib/db";
import { useAuthStore } from "@/stores";
import { useEffect, useState } from "react";
import { useParams } from "react-router";
import AssignmentDetail from "./Assignment";

export default function Post() {
  const { subjectId, postId } = useParams<{
    subjectId: string;
    postId: string;
  }>();
  const { user, token } = useAuthStore();
  const [post, setPost] = useState<any>();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user || !token || !subjectId || !postId) {
      setIsLoading(false);
      return;
    }

    getPost(token, parseInt(postId), parseInt(subjectId), user.id)
      .then((data) => {
        setPost(data);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Failed to fetch post:", error);
        setIsLoading(false);
      });
  }, [user, token, subjectId, postId]);

  // Show loading state
  if (isLoading) {
    return (
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4">Loading...</h1>
      </div>
    );
  }

  // Show error if missing required data
  if (!user || !token || !subjectId || !postId) {
    return null;
  }

  return (
    <>
      {post ? (
        post?.post.posts.type === "assignment" ? (
          <AssignmentDetail post={post} />
        ) : (
          <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">Regular Post</h1>
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-2">
                {post?.post?.posts?.title || "Untitled"}
              </h2>
              <p className="text-gray-600">
                {post?.post?.posts?.content || "No content available"}
              </p>
            </div>
          </div>
        )
      ) : (
        <div className="p-4">
          <h1 className="text-2xl font-bold mb-4">Post Not Found</h1>
          <p>The requested post could not be found.</p>
        </div>
      )}
    </>
  );
}
