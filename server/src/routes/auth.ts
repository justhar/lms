import { Hono } from "hono";

const auth = new Hono();

auth.post("/login", async (c) => {
  const { username, password } = await c.req.json();

  return c.json({ message: "Login successful", success: true });
});

export default auth;
