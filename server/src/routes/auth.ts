import { Hono } from "hono";
import db from "../modules/db";
import { eq } from "drizzle-orm";
import { classesTable, usersTable } from "@server/db/schema";
import { sign, verify } from "hono/jwt";

const auth = new Hono();

auth.post("/login", async (c) => {
  const { username, password } = await c.req.json();

  // Make sure to import classesTable from your schema
  // import { classesTable } from "@server/db/schema";

  const user = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.username, username))
    .limit(1);

  if (user.length == 0 || !user[0]) {
    const errorResponse = {
      message: "Credentials are invalid",
      success: false,
    };
    return c.json(errorResponse, 404);
  }

  const isValidPassword = await Bun.password.verify(password, user[0].password);

  if (!isValidPassword) {
    const errorResponse = {
      message: "Credentials are invalid",
      success: false,
    };
    return c.json(errorResponse, 404);
  }

  const payload = {
    userId: user[0].id,
    fullName: user[0].fullName,
    classId: user[0].classId,
    exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24,
  };

  const token = await sign(payload, process.env.JWT_SECRET!);

  const successResponse = {
    message: "Login successful",
    token,
    success: true,
  };

  return c.json(successResponse, 200);
});

auth.post("/verify", async (c) => {
  const token = c.req.header("Authorization")?.replace("Bearer ", "");
  if (!token) {
    return c.json({ message: "No token provided", success: false }, 401);
  }
  try {
    const payload = await verify(token, process.env.JWT_SECRET!);
    return c.json(
      { message: "Session is valid", user: payload, success: true },
      200
    );
  } catch (error) {
    return c.json({ message: "Invalid token", success: false }, 401);
  }
});

export default auth;
