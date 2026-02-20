import { Hono } from "hono";
import { notesRouter } from "./routes/notes";

const app = new Hono().basePath("/api");

app.route("/notes", notesRouter);

export default app;
