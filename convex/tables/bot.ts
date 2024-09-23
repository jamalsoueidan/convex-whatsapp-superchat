import { Table } from "convex-helpers/server";
import { v } from "convex/values";

export const Bot = Table("bot", {
  user: v.id("users"),
  created_at: v.number(),
  updated_at: v.number(),
  title: v.string(),
  nodes: v.array(v.any()),
  edges: v.array(v.any()),
  status: v.union(v.literal("draft"), v.literal("live")),
});
