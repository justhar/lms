import { Hono } from "hono";
import { cors } from "hono/cors";
import auth from "./routes/auth";
import subject from "./routes/subject";
import "dotenv/config";

const app = new Hono();

app.use(cors());

app.route("/auth", auth);
app.route("/subject", subject);

export default app;
