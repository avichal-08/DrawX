import { prismaClient } from "@repo/db/client";

export default async function Slug(title: string) {
  let slug = title.toLowerCase().trim().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');
  let exists = true as any;
  
  while (exists) {
    const randomSuffix = Math.floor(Math.random() * 10000);
    slug = `${slug}-${randomSuffix}`;
    exists = await prismaClient.room.findUnique({ where: { slug } });
  }
  
  return slug;
}