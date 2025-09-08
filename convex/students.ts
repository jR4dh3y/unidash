import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const createStudent = mutation({
  args: {
    userId: v.string(),
    name: v.string(),
  },
  handler: async (ctx, args) => {
    const existingStudent = await ctx.db
      .query("students")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .unique();

    if (existingStudent) {
      return;
    }

    await ctx.db.insert("students", {
      userId: args.userId,
      name: args.name,
      avatar: `https://placehold.co/200x200.png`,
      totalPoints: 0,
      pointsLog: [],
      achievements: [],
    });
  },
});

export const seedDatabase = mutation({
  handler: async (ctx) => {
    const tempStudents = [
      {
        userId: "1",
        name: "Alice Johnson",
        avatar: "https://placehold.co/100x100.png",
        totalPoints: 1250,
        github: "https://github.com/alice",
        linkedin: "https://linkedin.com/in/alice",
        pointsLog: [
          { date: "2024-07-01T10:00:00Z", description: "Solved LeetCode daily", points: 50, source: 'LeetCode' as const },
          { date: "2024-07-02T11:00:00Z", description: "Workshop attendance", points: 200, source: 'Google Form' as const },
          { date: "2024-07-03T14:00:00Z", description: "Hackathon 1st place", points: 1000, source: 'Manual Allocation' as const },
        ],
        achievements: [
            { id: 'b1', name: 'First Kill', description: 'Solved first LeetCode problem', icon: 'Sword' },
            { id: 'b2', name: 'Top 10', description: 'Reached the Top 10 on the leaderboard', icon: 'Trophy' },
            { id: 'b3', name: 'Hot Streak', description: 'Completed a 7-day solving streak', icon: 'Flame' },
        ],
      },
      {
        userId: "2",
        name: "Bob Williams",
        avatar: "https://placehold.co/100x100.png",
        totalPoints: 980,
        pointsLog: [
          { date: "2024-07-01T09:00:00Z", description: "Tech quiz winner", points: 150, source: 'Manual Allocation' as const },
          { date: "2024-07-04T12:00:00Z", description: "Solved LeetCode daily", points: 50, source: 'LeetCode' as const },
        ],
        achievements: [
            { id: 'b1', name: 'First Kill', description: 'Solved first LeetCode problem', icon: 'Sword' },
            { id: 'b4', name: 'Big Brain', description: 'Solved a "Hard" problem', icon: 'BrainCircuit' },
        ],
      },
    ];

    for (const student of tempStudents) {
      await ctx.db.insert("students", student);
    }
  },
});

export const awardPoints = mutation({
  args: {
    userId: v.string(),
    points: v.number(),
    reason: v.string(),
  },
  handler: async (ctx, args) => {
    const student = await ctx.db
      .query("students")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .unique();

    if (!student) {
      throw new Error("Student not found.");
    }

    const newLogEntry = {
      date: new Date().toISOString(),
      description: args.reason,
      points: args.points,
      source: "Manual Allocation" as const,
    };

    await ctx.db.patch(student._id, {
      totalPoints: student.totalPoints + args.points,
      pointsLog: [...student.pointsLog, newLogEntry],
    });
  },
});

export const updateStudentProfile = mutation({
  args: {
    userId: v.string(),
    name: v.optional(v.string()),
    github: v.optional(v.string()),
    linkedin: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const student = await ctx.db
      .query("students")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .unique();

    if (!student) {
      throw new Error("Student not found.");
    }

    const { userId, ...rest } = args;

    await ctx.db.patch(student._id, rest);
  },
});

export const getStudentById = query({
  args: { id: v.id("students") },
  handler: async (ctx, args) => {
    const student = await ctx.db.get(args.id);
    return student;
  },
});

const ADMIN_UID = 'IMZ23UOOblMG1Dm6HDF4Hf7UOvK2';

export const getAllStudents = query({
  handler: async (ctx) => {
    const students = await ctx.db.query("students").order("desc").collect();
    return students.filter((student) => student.userId !== ADMIN_UID);
  },
});
