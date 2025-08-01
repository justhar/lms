import { subjectsTable, submissionsTable, postsTable } from "@server/db/schema";
import db from "@server/modules/db";
import { eq, and } from "drizzle-orm";
import { Hono } from "hono";

const subject = new Hono();

subject.post("/", async (c) => {
  const { id } = await c.req.json();

  const subject = await db
    .select()
    .from(subjectsTable)
    .where(eq(subjectsTable.id, id));

  if (subject.length === 0 || !subject[0]) {
    return c.json({ message: "Subject not found", success: false }, 404);
  }

  return c.json(
    { message: "Subject found", subject: subject[0], success: true },
    200
  );
});

subject.post("/all", async (c) => {
  const { id } = await c.req.json();

  const subjects = await db
    .select()
    .from(subjectsTable)
    .where(eq(subjectsTable.classId, id));

  if (subjects.length === 0) {
    return c.json({ message: "No subjects found", success: false }, 404);
  }

  return c.json({ message: "Subjects found", subjects, success: true }, 200);
});

subject.post("/posts", async (c) => {
  const { id, userId } = await c.req.json();

  const posts = await db
    .select()
    .from(postsTable)
    .leftJoin(
      submissionsTable,
      and(
        eq(submissionsTable.assignmentId, postsTable.id),
        eq(submissionsTable.userId, userId)
      )
    )
    .where(eq(postsTable.subjectId, id));

  if (posts.length === 0 || !posts[0]) {
    return c.json(
      { message: "No posts found for this subject", success: false },
      404
    );
  }

  return c.json({ message: "Posts found", posts, success: true }, 200);
});

subject.post("/post", async (c) => {
  const { id, userId } = await c.req.json();

  const posts = await db
    .select()
    .from(postsTable)
    .leftJoin(
      submissionsTable,
      and(
        eq(submissionsTable.assignmentId, postsTable.id),
        eq(submissionsTable.userId, userId)
      )
    )
    .where(eq(postsTable.id, id));

  if (posts.length === 0 || !posts[0]) {
    return c.json({ message: "Post not found", success: false }, 404);
  }

  return c.json({ message: "Post found", post: posts[0], success: true }, 200);
});

subject.post("/post/create", async (c) => {
  // the deadline is optional, so it can be null
  const { title, content, type, deadline, subjectId, teacherId } =
    await c.req.json();

  const subject = await db
    .select()
    .from(subjectsTable)
    .where(
      and(
        eq(subjectsTable.id, subjectId),
        eq(subjectsTable.teacherId, teacherId)
      )
    );

  if (subject.length === 0 || !subject[0]) {
    return c.json({ message: "Subject not found", success: false }, 404);
  }

  const post = await db
    .insert(postsTable)
    .values({
      title,
      content,
      type,
      deadline: deadline ? new Date(deadline) : null,
      subjectId,
    })
    .returning();

  return c.json({ message: "Post created", post, success: true }, 201);
});

subject.post("/submission/upload", async (c) => {
  const { assignmentId, userId, content, fileUrl } = await c.req.json();

  const submission = await db.insert(submissionsTable).values({
    assignmentId,
    userId,
    content,
    fileUrl,
    status: "submitted",
  });

  return c.json(
    {
      message: "Submission uploaded",
      success: true,
    },
    201
  );
});

subject.post("/submissions", async (c) => {
  const { id, userId } = await c.req.json();

  const submissions = await db
    .select()
    .from(submissionsTable)
    .where(eq(submissionsTable.assignmentId, id));

  if (submissions.length === 0 || !submissions[0]) {
    return c.json({ message: "Submission not found", success: false }, 404);
  }

  return c.json(
    { message: "Submission found", submission: submissions[0], success: true },
    200
  );
});

subject.post("/submission/grade", async (c) => {
  const { submissionId, grade, feedback } = await c.req.json();

  const submission = await db
    .update(submissionsTable)
    .set({ grade, feedback, status: "graded" })
    .where(eq(submissionsTable.id, submissionId))
    .returning();

  if (submission.length === 0 || !submission[0]) {
    return c.json({ message: "Submission not found", success: false }, 404);
  }

  return c.json({ message: "Submission graded", success: true }, 200);
});

export default subject;
