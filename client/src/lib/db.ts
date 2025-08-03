const SERVER_URL = import.meta.env.VITE_SERVER_URL || "http://localhost:3000";

export async function getAssignmentsLeft(token: string, userId: number) {
  const response = await fetch(`${SERVER_URL}/assignment/all`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      userId,
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to fetch assignments");
  }

  const data = await response.json();

  if (!data.success) {
    throw new Error(data.message || "Failed to fetch assignments");
  }

  return data;
}

export async function getPost(
  token: string,
  postId: number,
  subjectId: number,
  userId: number
) {
  const response = await fetch(`${SERVER_URL}/subject/post`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      id: postId,
      subjectId,
      userId,
    }),
  });
  if (!response.ok) {
    throw new Error("Failed to fetch assignment");
  }

  const data = await response.json();

  if (!data.success) {
    throw new Error(data.message || "Failed to fetch assignment");
  }
  return data;
}

export async function getSubjects(token: string, classId: number | undefined) {
  const response = await fetch(`${SERVER_URL}/subject/all`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },

    body: JSON.stringify({
      classId,
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to fetch subjects");
  }

  const data = await response.json();

  if (!data.success) {
    throw new Error(data.message || "Failed to fetch subjects");
  }

  return data;
}

export async function getSubject(token: string, subjectId: number) {
  const response = await fetch(`${SERVER_URL}/subject`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      id: subjectId,
    }),
  });
  if (!response.ok) {
    throw new Error("Failed to fetch subject");
  }

  const data = await response.json();
  if (!data.success) {
    throw new Error(data.message || "Failed to fetch subject");
  }

  return data;
}

export async function getPosts(token: string, subjectId: number) {
  const response = await fetch(`${SERVER_URL}/subject/posts`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      id: subjectId,
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to fetch posts");
  }

  const data = await response.json();
  if (!data.success) {
    throw new Error(data.message || "Failed to fetch posts");
  }
  return data;
}

export async function getSubmissions(
  token: string,
  subjectId: number,
  userId: number
) {
  const response = await fetch(`${SERVER_URL}/assignment/submissions`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      subjectId,
      userId,
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to fetch submissions");
  }

  const data = await response.json();
  if (!data.success) {
    throw new Error(data.message || "Failed to fetch submissions");
  }

  return data;
}

export async function postSubmission(
  token: string,
  assignmentId: number,
  userId: number,
  content: string | null,
  fileUrl: string[],
  subjectId: number
) {
  const response = await fetch(`${SERVER_URL}/assignment/submission/upload`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      assignmentId,
      userId,
      content,
      fileUrl,
      subjectId,
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to fetch submissions");
  }

  const data = await response.json();
  if (!data.success) {
    throw new Error(data.message || "Failed to fetch submissions");
  }

  return data;
}
