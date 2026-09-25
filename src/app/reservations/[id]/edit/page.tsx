import { EditReservationForm } from "@/features/reservations/edit-reservation-form";
import { listLocations } from "@/server/locations/list-locations";
import { getReservation } from "@/server/reservations/get-reservation";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Box, Button, Card, CardContent, Stack, Typography } from "@mui/material";
import { notFound } from "next/navigation";

export default async function EditReservationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [locations, reservation] = await Promise.all([
    listLocations(),
    getReservation(id),
  ]);

  if (!reservation) {
    notFound();
  }

  return (
    <Stack spacing={3}>
      <Box>
        <Button href="/" startIcon={<ArrowBackIcon />} sx={{ mb: 2 }}>
          Back to reservations
        </Button>
        <Typography component="h1" variant="h1" gutterBottom>
          Edit Reservation
        </Typography>
      </Box>

      <Card>
        <CardContent>
          <Stack spacing={2.5}>
            <EditReservationForm
              reservationId={id}
              reservation={reservation}
              locations={locations}
            />
          </Stack>
        </CardContent>
      </Card>
    </Stack>
  );
}
