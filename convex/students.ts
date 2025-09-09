import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// achievement rules based on points and activity.
function computeAchievements(student: {
  totalPoints: number;
  pointsLog: Array<{ points: number; source: string }>;
}) {
  const achievements: Array<{ id: string; name: string; description: string; icon: string }> = [];

  const totalPoints = student.totalPoints ?? 0;
  const totalActivities = (student.pointsLog ?? []).length;
  const fromLeetCode = (student.pointsLog ?? []).some((l) => l.source === "LeetCode");
  const fromGitHub = (student.pointsLog ?? []).some((l) => l.source === "GitHub");

  if (totalActivities >= 1) {
    achievements.push({
      id: "ach_first",
      name: "First Submission",
      description: "Logged your first points!",
      icon: "Award",
    });
  }
  if (totalPoints >= 500) {
    achievements.push({
      id: "ach_500",
      name: "500 Club",
      description: "Reached 500 total points.",
      icon: "Flame",
    });
  }
  if (totalPoints >= 1000) {
    achievements.push({
      id: "ach_1000",
      name: "1,000 Club",
      description: "Cracked 1,000 total points.",
      icon: "Trophy",
    });
  }
  if (fromLeetCode) {
    achievements.push({
      id: "ach_lc",
      name: "Code Warrior",
      description: "Earned points from LeetCode.",
      icon: "Sword",
    });
  }
  if (fromGitHub) {
    achievements.push({
      id: "ach_gh",
      name: "Brainstormer",
      description: "Earned points from GitHub activity.",
      icon: "BrainCircuit",
    });
  }

  return achievements;
}

export const getAllStudents = query({
  args: {},
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  handler: async (ctx: any) => {
    const docs = await ctx.db.query("students").collect();
    const sorted = docs.sort((a: any, b: any) => (b.totalPoints ?? 0) - (a.totalPoints ?? 0));
    return sorted.map((s: any) => ({
      id: s.userId,
      name: s.name,
      avatar: s.avatar,
      github: s.github,
      linkedin: s.linkedin,
      totalPoints: s.totalPoints ?? 0,
      pointsLog: s.pointsLog ?? [],
      achievements:
        s.achievements && Array.isArray(s.achievements) && s.achievements.length > 0
          ? s.achievements
          : computeAchievements({ totalPoints: s.totalPoints ?? 0, pointsLog: s.pointsLog ?? [] }),
    }));
  },
});

export const getStudentById = query({
  args: { id: v.string() },
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  handler: async (ctx: any, { id }: any) => {
    const doc = (await ctx.db.query("students").collect()).find((d: any) => d.userId === id);
    if (!doc) return null;
    return {
      id: doc.userId,
      name: doc.name,
      avatar: doc.avatar,
      github: doc.github,
      linkedin: doc.linkedin,
      totalPoints: doc.totalPoints ?? 0,
      pointsLog: doc.pointsLog ?? [],
      achievements:
        doc.achievements && Array.isArray(doc.achievements) && doc.achievements.length > 0
          ? doc.achievements
          : computeAchievements({ totalPoints: doc.totalPoints ?? 0, pointsLog: doc.pointsLog ?? [] }),
    };
  },
});

// Create the student document on first login and keep name/avatar in sync thereafter.
export const ensureStudent = mutation({
  args: {},
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  handler: async (ctx: any) => {
    const identity = await ctx.auth.getUserIdentity?.();
    if (!identity) return false;

    const userId = identity.subject;
    // Prefer Clerk-provided name/picture when available
    const name = (identity.name || identity.email || "User").toString();
    const avatar = (identity.pictureUrl || identity.picture || "https://i.pravatar.cc/150?img=11").toString();

    // Look up existing student by userId (index exists in schema)
    const existing = (await ctx.db.query("students").collect()).find((d: any) => d.userId === userId);

    if (!existing) {
      const achievements = computeAchievements({ totalPoints: 0, pointsLog: [] });
      await ctx.db.insert("students", {
        userId,
        name,
        avatar,
        totalPoints: 0,
        pointsLog: [],
        achievements,
      });
      return true;
    }

    // If exists, patch name/avatar if changed; keep other fields intact
    const shouldPatch = existing.name !== name || existing.avatar !== avatar;
    if (shouldPatch) {
      await ctx.db.patch(existing._id, { name, avatar });
    }
    return true;
  },
});

export const updateStudentProfile = mutation({
  args: {
    id: v.string(),
    name: v.string(),
    github: v.optional(v.string()),
    linkedin: v.optional(v.string()),
  },
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  handler: async (ctx: any, { id, name, github, linkedin }: any) => {
    const doc = (await ctx.db.query("students").collect()).find((d: any) => d.userId === id);
    if (!doc) return null;
    await ctx.db.patch(doc._id, { name, github, linkedin });
    return true;
  },
});

export const awardPoints = mutation({
  args: { id: v.string(), points: v.number(), reason: v.string() },
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  handler: async (ctx: any, { id, points, reason }: any) => {
    const doc = (await ctx.db.query("students").collect()).find((d: any) => d.userId === id);
    if (!doc) return null;
    const newLog = [
      ...((doc.pointsLog ?? []) as any[]),
      {
        id: (globalThis as any).crypto?.randomUUID?.() ?? `${Date.now()}_${Math.random().toString(16).slice(2)}`,
        date: new Date().toISOString(),
        description: reason,
        points,
        source: "Manual Allocation" as const,
      },
    ];
    const newTotal = (doc.totalPoints ?? 0) + points;
    const newAchievements = computeAchievements({ totalPoints: newTotal, pointsLog: newLog });
    await ctx.db.patch(doc._id, {
      totalPoints: newTotal,
      pointsLog: newLog,
      achievements: newAchievements,
    });
    return true;
  },
});

export const seedDatabase = mutation({
  args: {},
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  handler: async (ctx: any) => {
    const existing = await ctx.db.query("students").collect();
    const sample = [
      {
        userId: "u_01",
        name: "Olivia Chen",
        avatar: "https://i.pravatar.cc/150?img=1",
        totalPoints: 1200,
        pointsLog: [
          {
            id: "s1",
            date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7).toISOString(),
            description: "Daily LeetCode challenge",
            points: 50,
            source: "LeetCode" as const,
          },
          {
            id: "s2",
            date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(),
            description: "Project PR merged",
            points: 100,
            source: "GitHub" as const,
          },
          {
            id: "s3",
            date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1).toISOString(),
            description: "Hackathon winner",
            points: 200,
            source: "Manual Allocation" as const,
          },
        ],
      },
      {
        userId: "u_02",
        name: "Benjamin Carter",
        avatar: "https://i.pravatar.cc/150?img=2",
        totalPoints: 980,
        pointsLog: [
          {
            id: "s4",
            date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10).toISOString(),
            description: "Form submission for workshop",
            points: 30,
            source: "Google Form" as const,
          },
          {
            id: "s5",
            date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
            description: "LeetCode weekly contest",
            points: 150,
            source: "LeetCode" as const,
          },
        ],
      },
  ] as any[];
    let added = 0;
    for (const s of sample as any[]) {
      const found = existing.find((d: any) => d.userId === s.userId);
      const achievements = computeAchievements({
        totalPoints: s.totalPoints,
        pointsLog: s.pointsLog,
      });
      if (!found) {
        await ctx.db.insert("students", { ...(s as any), achievements } as any);
        added++;
      } else {
        const hasHistory = Array.isArray(found.pointsLog) && found.pointsLog.length > 0;
        const hasAchievements = Array.isArray(found.achievements) && found.achievements.length > 0;
        if (!hasHistory || !hasAchievements) {
          await ctx.db.patch(found._id, {
            pointsLog: hasHistory ? found.pointsLog : (s.pointsLog as any[]),
            achievements: hasAchievements ? found.achievements : achievements,
          });
        }
      }
    }
    return added;
  },
});
