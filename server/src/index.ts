import { Hono } from "hono";
import { cors } from "hono/cors";
import auth from "./routes/auth";

const app = new Hono();

app.use(cors());

app.route("/auth", auth);

export default app;
