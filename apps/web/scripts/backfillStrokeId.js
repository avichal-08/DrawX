import { prismaClient } from "@repo/db";
import { randomUUID } from "crypto";

async function main () {
    const strokes = await prismaClient.stroke.findMany();

    for ( const stroke of strokes) {
        await prismaClient.stroke.update({
            where: { id: stroke.id },
            data : { strokeId: randomUUID() }
        })
    }
    console.log('back filling done');
}

main()
  .then(() => prismaClient.$disconnect())
  .catch((e) => {
    console.error(e)
    prismaClient.$disconnect()
  })