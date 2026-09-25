"use client";
import { ReservationInput } from "@/schemas/reservation";
import { useRouter } from "next/navigation";
import ReservationForm from "./reservation-form";
import { useState } from "react";
import { Location } from "@/types/location";
import { Alert, AlertTitle, Stack, Button } from "@mui/material";

export type CreateReservationFormProps = {
  locations: Location[];
};

interface ApiErrorBody {
  error?: string;
}

export function CreateReservationForm({
  locations,
}: CreateReservationFormProps) {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);

  async function onSubmit(input: ReservationInput) {
    console.log("reservation")
    setServerError(null);

    try {
      const response = await fetch(`/api/reservations/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      });
      const body = (await response.json()) as ApiErrorBody;

      if (!response.ok) {
        setServerError(body.error ?? "The Reservation could not be saved.");
        return;
      }

      router.push(`/`);
    } catch (e) {
      console.error("Unexpected reservation note error", e);
      setServerError("The server could not be reached. Please try again.");
    }
  }

  return (
    <>
      {serverError ? <Alert severity="error">{serverError}</Alert> : null}

      <ReservationForm onSubmit={onSubmit} locations={locations} />
    </>
  );
}
