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
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { FileText, Download, Upload, AlertCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { getSubject, postSubmission } from "@/lib/db";
import { useAuthStore } from "@/stores/auth";
import { useParams } from "react-router";
import { uploadFile } from "@/lib/file";
import { cn } from "@/lib/utils";

interface AssignmentDetailProps {
  post: any;
}

export default function AssignmentDetail({ post }: AssignmentDetailProps) {
  const [subject, setSubject] = useState<any>();
  const assignment = post.post;
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [comments, setComments] = useState("");
  const { token, user } = useAuthStore();
  const { subjectId, postId } = useParams<{
    subjectId: string;
    postId: string;
  }>();

  function fileUpload() {
    const input = document.createElement("input");
    input.type = "file";
    input.multiple = true;
    input.accept = ".pdf,.doc,.docx";

    input.onchange = (e) => {
      const files = Array.from((e.target as HTMLInputElement).files || []);

      // Validate file size (10MB max per file)
      const maxSize = 10 * 1024 * 1024; // 10MB
      const validFiles = files.filter((file) => {
        if (file.size > maxSize) {
          alert(`File ${file.name} is too large. Maximum size is 10MB.`);
          return false;
        }
        return true;
      });

      setSelectedFiles((prev) => [...prev, ...validFiles]);
    };

    input.click();
  }

  function removeFile(index: number) {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  }

  async function submitAssignment() {
    if (selectedFiles.length === 0) {
      alert("Please select at least one file to submit.");
      return;
    }

    if (!token || !postId || !user || !subjectId) {
      alert("Missing required information.");
      return;
    }

    setUploading(true);
    setUploadProgress(0);

    try {
      // Upload all files to Supabase S3 storage
      const uploadResults: Array<{ url: string; key: string }> = [];

      for (let i = 0; i < selectedFiles.length; i++) {
        const file = selectedFiles[i];
        console.log(
          `Uploading file ${i + 1}/${selectedFiles.length}: ${file.name}`
        );

        const result = await uploadFile(file);
        uploadResults.push(result);

        // Update progress
        setUploadProgress(((i + 1) / selectedFiles.length) * 50); // 50% for upload phase
      }

      console.log("Files uploaded to Supabase:", uploadResults);

      const result = await postSubmission(
        token,
        parseInt(postId),
        user.id,
        comments,
        uploadResults.map((f) => f.url),
        parseInt(subjectId)
      );

      setUploadProgress(75); // 75% for server submission

      if (result.success) {
        setUploadProgress(100);
        alert("Assignment submitted successfully!");
        //reload page
        window.location.reload();
        setSelectedFiles([]);
        setComments("");
      } else {
        throw new Error(result.message || "Failed to submit assignment");
      }
    } catch (error) {
      console.error("Error submitting assignment:", error);
      alert(
        `Failed to submit assignment: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  }

  if (!token || !subjectId) {
    return;
  }

  useEffect(() => {
    getSubject(token, parseInt(subjectId))
      .then((data) => {
        setSubject(data);
      })
      .catch((error) => {
        console.error("Error fetching assignment data:", error);
      });
  }, []);

  if (!token || !subjectId || !postId) {
    return (
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4">Assignment Not Available</h1>
        <p>Required information is missing.</p>
      </div>
    );
  }
  console.log("ini assignment", assignment);

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
              <BreadcrumbLink href={`/subjects/${subjectId}`}>
                {subject?.subject.subjects.subjectName}
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator className="hidden md:block" />
            <BreadcrumbItem>
              <BreadcrumbPage>{assignment?.posts.title}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </header>

      <div className="flex flex-1 flex-col gap-6 p-6">
        {/* Assignment Header */}
        <div className="space-y-4">
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tight">
                {assignment?.posts.title}
              </h1>
              <div className="flex items-center gap-2">
                <Badge variant="outline">Assignment</Badge>
                <Badge
                  //if submitted, gray, if graded, green
                  className={cn("bg-yellow-100 text-yellow-800", {
                    "bg-gray-100 text-gray-800":
                      assignment?.submissions.status === "submitted",
                    "bg-green-100 text-green-800":
                      assignment?.submissions.status === "graded",
                  })}
                >
                  {assignment?.submissions.status || "Pending"}
                </Badge>
                <span className="text-sm text-muted-foreground">
                  {subject?.subject.subjects.subjectName}
                </span>
              </div>
            </div>
            {/* <div className="text-right">
              <p className="text-2xl font-bold">100 pts</p>
              <p className="text-sm text-muted-foreground">Total Points</p>
            </div> */}
          </div>

          {assignment?.submissions ? null : (
            <Card className="border-yellow-200 bg-yellow-50">
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <AlertCircle className="size-4 text-yellow-600" />
                  <div>
                    <p className="font-medium text-yellow-800">
                      Due{" "}
                      {assignment?.posts.deadline
                        ? new Date(
                            assignment.posts.deadline
                          ).toLocaleDateString("en-US", {
                            weekday: "long",
                            month: "long",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })
                        : "Date TBD"}
                    </p>
                    <p className="text-sm text-yellow-700">
                      Don't forget to submit your work on time!
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Assignment Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Instructions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Instructions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {assignment?.posts.content}
              </CardContent>
            </Card>

            {/* Attachments */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="size-4" />
                  Assignment Files
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <FileText className="size-4 text-muted-foreground" />
                    <div>
                      <p className="font-medium text-sm">Problem_Set_3.pdf</p>
                      <p className="text-xs text-muted-foreground">
                        Assignment questions • 2.4 MB
                      </p>
                    </div>
                  </div>
                  <Button size="sm" variant="outline">
                    <Download className="size-3 mr-1" />
                    Download
                  </Button>
                </div>
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <FileText className="size-4 text-muted-foreground" />
                    <div>
                      <p className="font-medium text-sm">Formula_Sheet.pdf</p>
                      <p className="text-xs text-muted-foreground">
                        Reference material • 1.1 MB
                      </p>
                    </div>
                  </div>
                  <Button size="sm" variant="outline">
                    <Download className="size-3 mr-1" />
                    Download
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Submission Area */}
            {assignment.submissions ? (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Upload className="size-4" />
                    Your Submissions
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {assignment.submissions.fileUrl.map(
                    (submission: any, index: number) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 border rounded-lg"
                      >
                        <div className="flex items-center gap-3">
                          <FileText className="size-4 text-muted-foreground" />
                          <div>
                            <p className="font-medium text-sm">
                              {submission.split("/").pop() || "Untitled File"}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              Submitted on{" "}
                              {new Date(
                                parseInt(
                                  submission.split("/").pop().split("-")[0]
                                )
                              ).toLocaleDateString("en-US", {
                                month: "short",
                                day: "2-digit",
                                hour: "2-digit",
                                minute: "2-digit",
                                hour12: true,
                              })}
                            </p>
                          </div>
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() =>
                            window.open(submission.fileUrl, "_blank")
                          }
                        >
                          <Download className="size-3 mr-1" />
                          Download
                        </Button>
                      </div>
                    )
                  )}
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Upload className="size-4" />
                    Submit Assignment
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center">
                    <Upload className="size-8 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-sm font-medium mb-2">
                      Drop your files here or click to browse
                    </p>
                    <p className="text-xs text-muted-foreground mb-4">
                      Supported formats: PDF, DOC, DOCX (Max 10MB per file)
                    </p>
                    <Button
                      variant="outline"
                      onClick={() => fileUpload()}
                      disabled={uploading}
                    >
                      Choose Files
                    </Button>
                  </div>

                  {/* Selected Files Display */}
                  {selectedFiles.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium">Selected Files:</h4>
                      {selectedFiles.map((file, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-3 border rounded-lg bg-gray-50"
                        >
                          <div className="flex items-center gap-3">
                            <FileText className="size-4 text-muted-foreground" />
                            <div>
                              <p className="font-medium text-sm">{file.name}</p>
                              <p className="text-xs text-muted-foreground">
                                {(file.size / 1024 / 1024).toFixed(2)} MB
                              </p>
                            </div>
                          </div>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => removeFile(index)}
                            disabled={uploading}
                          >
                            Remove
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Upload Progress */}
                  {uploading && (
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${uploadProgress}%` }}
                      ></div>
                    </div>
                  )}

                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      Comments (Optional)
                    </label>
                    <Textarea
                      placeholder="Add any comments about your submission..."
                      className="min-h-[100px]"
                      value={comments}
                      onChange={(e) => setComments(e.target.value)}
                      disabled={uploading}
                    />
                  </div>

                  <div className="flex gap-2">
                    <Button
                      className="flex-1"
                      onClick={submitAssignment}
                      disabled={uploading || selectedFiles.length === 0}
                    >
                      {uploading ? "Submitting..." : "Submit Assignment"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Assignment Details */}
            <Card>
              <CardHeader>
                <CardTitle>Assignment Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Assigned:</span>
                    <span>
                      {assignment?.posts.createdAt
                        ? new Date(
                            assignment.posts.createdAt
                          ).toLocaleDateString()
                        : "Unknown"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Due:</span>
                    <span className="font-medium">
                      {assignment?.posts.deadline
                        ? new Date(
                            assignment.posts.deadline
                          ).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })
                        : "TBD"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Status:</span>
                    <span
                      className={cn(" text-yellow-800", {
                        " text-gray-800":
                          assignment?.submissions.status === "submitted",
                        " text-green-800":
                          assignment?.submissions.status === "graded",
                      })}
                    >
                      {assignment.submissions.status || "incomplete"}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
