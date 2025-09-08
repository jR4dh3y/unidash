import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

const badgeSchema = v.object({
  id: v.string(),
  name: v.string(),
  description: v.string(),
  icon: v.string(),
});

const pointLogSchema = v.object({
  id: v.optional(v.string()),
  date: v.string(),
  description: v.string(),
  points: v.number(),
  source: v.union(
    v.literal("LeetCode"),
    v.literal("Google Form"),
    v.literal("Manual Allocation"),
    v.literal("GitHub")
  ),
});

export default defineSchema({
  students: defineTable({
    name: v.string(),
    avatar: v.string(),
    github: v.optional(v.string()),
    linkedin: v.optional(v.string()),
    totalPoints: v.number(),
    pointsLog: v.array(pointLogSchema),
    achievements: v.optional(v.array(badgeSchema)),
    userId: v.string(),
  }).index("by_userId", ["userId"]),

  events: defineTable({
    title: v.string(),
    date: v.string(),
    description: v.string(),
    location: v.optional(v.string()),
    link: v.optional(v.string()),
  }),
});
