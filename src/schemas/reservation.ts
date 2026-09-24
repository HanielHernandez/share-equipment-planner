import {z} from "zod";

export const reservationSchema = z.object({
    locationId: z.string(),
    startAt: z.date(),
    endAt: z.date(),
    note: z.string(),
    items: z.array(z.object({
        equipmentId: z.string(),
        quantity: z.number()
    }))
})


export type ReservationInput = z.infer<typeof reservationSchema>;
