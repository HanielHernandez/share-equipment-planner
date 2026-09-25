import { DomainError } from "@/lib/domain-error";
import { prisma } from "@/lib/prisma";
import { ReservationInput } from "@/schemas/reservation";
import { checkAvailability } from "@/server/reservations/availability";

export async function updateReservation(
  id: string,
  { locationId, startAt, endAt, note, status, items }: ReservationInput,
) {
  if (items.length === 0) {
    throw new DomainError("Add at least one equipment item.", 400, "ITEMS_REQUIRED");
  }

  const requestedByEquipment = new Map<string, number>();

  for (const item of items) {
    if (!Number.isInteger(item.quantity) || item.quantity <= 0) {
      throw new DomainError("Quantity must be a positive whole number.", 400, "INVALID_QUANTITY");
    }

    requestedByEquipment.set(
      item.equipmentId,
      (requestedByEquipment.get(item.equipmentId) ?? 0) + item.quantity,
    );
  }

  return prisma.$transaction(async (tx) => {
    const existing = await tx.reservation.findUnique({
      where: { id },
      select: { id: true },
    });

    if (!existing) {
      throw new DomainError("Reservation was not found.", 404, "RESERVATION_NOT_FOUND");
    }

    if (status === "CONFIRMED") {
      for (const [equipmentId, requestedQuantity] of requestedByEquipment) {
        const equipment = await tx.equipment.findFirst({
          where: { id: equipmentId, locationId },
          select: { name: true },
        });

        if (!equipment) {
          throw new DomainError(
            "Equipment was not found at the selected location.",
            404,
            "EQUIPMENT_NOT_FOUND",
          );
        }

        const { available, availableQuantity } = await checkAvailability(
          {
            locationId,
            equipmentId,
            startAt,
            endAt,
            requestedQuantity,
            excludeReservationId: id,
          },
          tx,
        );

        if (!available) {
          const label = availableQuantity === 1 ? equipment.name : `${equipment.name}s`;
          const verb = availableQuantity === 1 ? "is" : "are";

          throw new DomainError(
            `Only ${availableQuantity} ${label} ${verb} available for the selected period.`,
            409,
            "INSUFFICIENT_AVAILABILITY",
          );
        }
      }
    }

    return tx.reservation.update({
      where: { id },
      data: {
        locationId,
        startAt,
        endAt,
        note,
        status,
        items: {
          deleteMany: {},
          create: [...requestedByEquipment].map(([equipmentId, quantity]) => ({
            equipmentId,
            quantity,
          })),
        },
      },
      include: {
        items: true,
      },
    });
  });
}
