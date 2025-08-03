import {
  classesTable,
  postsTable,
  subjectsTable,
  submissionsTable,
} from "@server/db/schema";
import db from "@server/modules/db";
import { and, eq } from "drizzle-orm";
import { Hono } from "hono";

const assignments = new Hono();

assignments.post("/all", async (c) => {
  const { userId, classId } = await c.req.json();

  if (!userId) {
    return c.json({ message: "User ID is required", success: false }, 400);
  }

  const assignments = await db
    .select()
    .from(postsTable)
    .leftJoin(subjectsTable, eq(subjectsTable.id, postsTable.subjectId))
    .where(eq(postsTable.type, "assignment"));

  return c.json({ assignments, success: true });
});

assignments.post("/submissions", async (c) => {
  const { userId, subjectId } = await c.req.json();

  const submissions = await db
    .select()
    .from(submissionsTable)
    .where(
      and(
        eq(submissionsTable.userId, userId),
        eq(submissionsTable.subjectId, subjectId)
      )
    );

  return c.json({ submissions, success: true });
});

assignments.post("/submission/upload", async (c) => {
  const { assignmentId, userId, content, fileUrl, subjectId } =
    await c.req.json();

  await db.insert(submissionsTable).values({
    assignmentId,
    subjectId,
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

assignments.post("/submission/grade", async (c) => {
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

export default assignments;
