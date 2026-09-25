import { prisma } from "@/lib/prisma";
import type { ReservationFormData } from "@/types/reservation";

export type { ReservationFormData };

export async function getReservation(id: string): Promise<ReservationFormData | null> {
  const reservation = await prisma.reservation.findUnique({
    where: { id },
    select: {
      locationId: true,
      startAt: true,
      endAt: true,
      note: true,
      status: true,
      items: {
        orderBy: { equipment: { name: "asc" } },
        select: {
          equipmentId: true,
          quantity: true,
        },
      },
    },
  });

  if (!reservation) {
    return null;
  }

  return {
    locationId: reservation.locationId,
    startAt: reservation.startAt.toISOString(),
    endAt: reservation.endAt.toISOString(),
    note: reservation.note ?? "",
    status: reservation.status,
    items: reservation.items,
  };
}
