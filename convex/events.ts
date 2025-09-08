import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const getUpcomingEvents = query({
  handler: async (ctx) => {
    const today = new Date().toISOString();
    return await ctx.db
      .query("events")
      .filter((q) => q.gte(q.field("date"), today))
      .order("asc")
      .take(5);
  },
});

export const deleteEvent = mutation({
  args: { id: v.id("events") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});

export const addEvent = mutation({
  args: {
    title: v.string(),
    date: v.string(),
    description: v.string(),
    location: v.optional(v.string()),
    link: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("events", args);
  },
});

export const getAllEvents = query({
  handler: async (ctx) => {
    return await ctx.db.query("events").order("desc").collect();
  },
});
