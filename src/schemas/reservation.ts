import { ReservationStatus } from "@/generated/prisma/enums";
import {z} from "zod";

const reservationFields = {
    locationId: z.string(),
    note: z.string(),
    status: z.enum(ReservationStatus),
    items: z.array(z.object({
        equipmentId: z.string(),
        quantity: z.number()
    }))
};

function withMinimumDuration<T extends z.ZodType<{ startAt: Date; endAt: Date }>>(schema: T) {
    return schema.refine(
        ({ startAt, endAt }) => {
            if (!startAt || !endAt) return true;

            return endAt.getTime() - startAt.getTime() >= 60 * 60 * 1000;
        },
        {
            message: "End time must be at least 1 hour after start time",
            path: ["endAt"],
        }
    );
}

export const reservationSchema = withMinimumDuration(z.object({
    ...reservationFields,
    startAt: z.date(),
    endAt: z.date(),
}));

export const reservationRequestSchema = withMinimumDuration(z.object({
    ...reservationFields,
    startAt: z.coerce.date(),
    endAt: z.coerce.date(),
}));

export type ReservationInput = z.infer<typeof reservationSchema>;
