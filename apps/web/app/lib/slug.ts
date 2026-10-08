import { randomBytes } from "crypto";
import { prismaClient } from "@repo/db";

/**
 * Room codes double as the "invite link", so the random part is generated with
 * a CSPRNG (40 bits) instead of Math.random()'s 0-9999.
 */
export default async function Slug(title: string) {
  const base =
    title
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "-")
      .replace(/[^\w-]+/g, "")
      .slice(0, 40) || "room";

  for (let attempt = 0; attempt < 5; attempt++) {
    const slug = `${base}-${randomBytes(5).toString("hex")}`;
    const exists = await prismaClient.room.findUnique({ where: { slug } });
    if (!exists) return slug;
  }
  throw new Error("Could not generate a unique room code");
}
