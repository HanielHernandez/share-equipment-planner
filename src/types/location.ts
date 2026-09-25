import { Equipment } from "@/generated/prisma/client";

export interface Location {
    id:string,
    name: string,
    equipment: Equipment[]
}