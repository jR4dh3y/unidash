import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const getAllEvents = query({
  args: {},
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  handler: async (ctx: any) => {
    const events = await ctx.db.query("events").collect();
    return (events as any[])
      .map((e: any) => ({ id: e._id, title: e.title, date: e.date, description: e.description, location: e.location, link: e.link }))
      .sort((a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime());
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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  handler: async (ctx: any, args: any) => {
    const id = await ctx.db.insert("events", args);
    return id;
  },
});

export const deleteEvent = mutation({
  args: { id: v.id("events") },
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  handler: async (ctx: any, { id }: any) => {
    await ctx.db.delete(id);
    return true;
  },
});
