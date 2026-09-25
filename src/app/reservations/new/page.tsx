import { CreateReservationForm } from "@/features/reservations/create-reservation-form";
import { listLocations } from "@/server/locations/list-locations";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import {
  Box,
  Button,
  Card,
  CardContent,
  Stack,
  Typography,
} from "@mui/material";

export default async function NewReservationPage() {
  const locations = await listLocations();


  return (
    <Stack spacing={3}>
      <Box>
        <Button href="/" startIcon={<ArrowBackIcon />} sx={{ mb: 2 }}>
          Back to reservations
        </Button>
        <Typography component="h1" variant="h1" gutterBottom>
          New Reservation
        </Typography>
      </Box>

      <Card>
        <CardContent>
          <Stack spacing={2.5}>
            <CreateReservationForm locations={locations} />
          </Stack>
        </CardContent>
      </Card>
    </Stack>
  );
}
