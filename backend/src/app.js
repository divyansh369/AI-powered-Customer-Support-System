import "dotenv/config";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { serve } from "@hono/node-server";
import { chatRoute } from "./routes/chat.js";
import conversationsRoute from "./routes/conversation.js";
import agentsRoute from "./routes/agent.js";

const app = new Hono();

app.use(
  "*",
  cors({
    origin: "*",
    allowMethods: ["GET", "POST", "DELETE", "OPTIONS"],
    allowHeaders: ["Content-Type"],
  }),
  async (c, next) => {
    try {
      await next();
    } catch (error) {
      console.error(error);
      return c.json({ error: "Server Error" }, 500);
    }
  }
);

chatRoute(app);

app.route("/api/conversations", conversationsRoute);
app.route('/api/agents', agentsRoute);

app.get("/api/health", (c) => c.json({ status: "ok" }));


serve({ fetch: app.fetch, port: 3000 }, () => {
  console.log("Server running: http://localhost:3000");
});

export default app;
