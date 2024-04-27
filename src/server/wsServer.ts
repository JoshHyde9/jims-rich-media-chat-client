import { applyWSSHandler } from "@trpc/server/adapters/ws";
import ws from "ws";

import { appRouter } from "./api/root";
import { createContext } from "../trpc/server";

const wss = new ws.Server({
  port: 3000,
});

const handler = applyWSSHandler({ wss, router: appRouter, createContext });

wss.on("connection", (ws) => {
  console.log(`➕➕ Connection (${wss.clients.size})`);
  ws.once("close", () => {
    console.log(`➖➖ Connection (${wss.clients.size})`);
  });
});

console.log("✅ WebSocket Server listening on ws://localhost:3000");
process.on("SIGTERM", () => {
  console.log("SIGTERM");
  handler.broadcastReconnectNotification();
  wss.close();
});
