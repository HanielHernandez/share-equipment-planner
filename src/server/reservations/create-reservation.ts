import { prisma } from "@/lib/prisma";
import { ReservationInput } from "@/schemas/reservation";

// TODO(candidate): Implement the authoritative Create Reservation mutation/service here.
export async function createReservation({
  locationId,
  startAt,
  endAt,
  status,
  items,
}: ReservationInput) {
  // create reservation
  const reservation = await prisma.reservation.create({
    data: {
      locationId,
      startAt,
      endAt,
      status,
      items: {
        create: items,
      },
    },
    include: {
      items: true,
    },
  });

  return reservation
}
