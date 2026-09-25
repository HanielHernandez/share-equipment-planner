"use client";

import { ReservationInput } from "@/schemas/reservation";
import { ReservationFormData } from "@/types/reservation";
import { Location } from "@/types/location";
import { Alert } from "@mui/material";
import { useRouter } from "next/navigation";
import { useState } from "react";
import ReservationForm from "./reservation-form";

export type EditReservationFormProps = {
  reservationId: string;
  reservation: ReservationFormData;
  locations: Location[];
};

interface ApiErrorBody {
  error?: string;
}

export function EditReservationForm({
  reservationId,
  reservation,
  locations,
}: EditReservationFormProps) {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);

  async function onSubmit(input: ReservationInput) {
    setServerError(null);

    try {
      const response = await fetch(`/api/reservations/${reservationId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      });
      const body = (await response.json()) as ApiErrorBody;

      if (!response.ok) {
        setServerError(body.error ?? "The reservation could not be saved.");
        return;
      }

      router.push("/");
    } catch {
      setServerError("The server could not be reached. Please try again.");
    }
  }

  return (
    <>
      {serverError ? <Alert severity="error">{serverError}</Alert> : null}

      <ReservationForm
        locations={locations}
        defaultValues={reservation}
        onSubmit={onSubmit}
        submitLabel="Update Reservation"
      />
    </>
  );
}
