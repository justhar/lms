import { Hono } from "hono";
import { cors } from "hono/cors";
import auth from "./routes/auth";
import subject from "./routes/subject";
import "dotenv/config";
import assignments from "./routes/assignment";

const app = new Hono();

app.use(cors());

// Health check endpoint
app.get("/health", (c) => {
  return c.json({ status: "healthy", timestamp: new Date().toISOString() });
});

app.route("/auth", auth);
app.route("/subject", subject);
app.route("/assignment", assignments);

export default {
  async fetch(request: Request, env: any, ctx: any) {
    return app.fetch(request, env, ctx);
  },
};
