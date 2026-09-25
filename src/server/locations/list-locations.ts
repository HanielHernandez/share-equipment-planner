import { prisma } from "@/lib/prisma"
import { Location } from "@/types/location"


export const listLocations  = async ():Promise<Location[]>=>{

    const locations = await prisma.location.findMany({
        orderBy:{ name: 'desc'},
        select: {
            id: true,
            name: true,
            equipment: {
                orderBy: { name: "desc"},
                select: {
                    id: true,
                    name: true,
                    locationId: true,
                    totalQuantity: true,
                }
            }
        }
    })

    return locations
}