import { Application, Router, send } from "https://deno.land/x/oak@v11.1.0/mod.ts";
import { oakCors } from "https://deno.land/x/cors@v1.2.2/mod.ts";
import * as path from "https://deno.land/std@0.177.0/path/mod.ts";

const app = new Application();
const PORT = 3004;

// Enable CORS
app.use(oakCors());

// Serve static files from current directory
app.use(async (context, next) => {
  const root = Deno.cwd();
  const filePath = path.join(root, "scripts", context.request.url.pathname);
  if (await Deno.stat(filePath).then((info) => info.isFile, () => false)) {
    await send(context, context.request.url.pathname, {
      root: path.join(root, "scripts"),
      index: "debug-marketplace.html",
    });
  } else {
    await next();
  }
});

// Serve the debug marketplace
app.use(async (context) => {
  if (context.request.url.pathname === "/") {
    await send(context, "debug-marketplace.html", {
      root: path.join(Deno.cwd(), "scripts"),
    });
  }
});

// Health check
const router = new Router();
router.get("/health", (context) => {
  context.response.body = { status: "ok", message: "Marketplace demo server running" };
});

app.use(router.routes());
app.use(router.allowedMethods());

app.listen({ port: PORT });
console.log(`🛒 Bitte Marketplace Demo Server running on port ${PORT}`);
console.log(`🌐 Open http://localhost:${PORT} to see the working marketplace`);
console.log(`✅ This bypasses all the React/crypto module issues`);
