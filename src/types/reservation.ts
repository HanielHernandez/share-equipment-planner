export type ReservationStatusValue = "DRAFT" | "CONFIRMED";

export interface ReservationFormData {
  locationId: string;
  startAt: string;
  endAt: string;
  note: string;
  status: ReservationStatusValue;
  items: Array<{
    equipmentId: string;
    quantity: number;
  }>;
}

export interface ReservationListItem {
  id: string;
  locationName: string;
  startAt: string;
  endAt: string;
  status: ReservationStatusValue;
  note: string | null;
  equipment: Array<{
    id: string;
    name: string;
    quantity: number;
  }>;
}
