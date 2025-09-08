import { v } from "convex/values";
import { defineSchema, defineTable } from "convex/server";

export default defineSchema({
  students: defineTable({
    userId: v.string(),
    name: v.string(),
    avatar: v.string(),
    github: v.optional(v.string()),
    linkedin: v.optional(v.string()),
    totalPoints: v.number(),
    pointsLog: v.array(
      v.object({
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
      })
    ),
    achievements: v.optional(
      v.array(
        v.object({
          id: v.string(),
          name: v.string(),
          description: v.string(),
          icon: v.string(),
        })
      )
    ),
  }).index("by_userId", ["userId"]),
  events: defineTable({
    title: v.string(),
    date: v.string(), // ISO string
    description: v.string(),
    location: v.optional(v.string()),
    link: v.optional(v.string()),
  }),
});
