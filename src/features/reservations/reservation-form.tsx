"use client";
import { ReservationInput, reservationSchema } from "@/schemas/reservation";
import { Location } from "@/types/location";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Button,
  FormControl,
  FormControlLabel,
  FormHelperText,
  FormLabel,
  InputLabel,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  Stack,
  TextField,
} from "@mui/material";
import { Controller, useFieldArray, useForm, useWatch } from "react-hook-form";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import ReservationItemsForm from "./reserveration-items-form";

export type ReservationFormProps = {
  locations: Location[];
  onSubmit: (input: ReservationInput) => Promise<void>;
};

export default function ReservationForm({
  locations = [],
  onSubmit,
}: ReservationFormProps) {

  const {
    handleSubmit,
    register,
    control,
    formState: { isSubmitting },
  } = useForm<ReservationInput>({
    resolver: zodResolver(reservationSchema),
    defaultValues: {
      locationId: "",
      startAt: new Date(),
      endAt: new Date(),
      note: "",
      status: "DRAFT",
      items: [],
    },
  });

  const locationId = useWatch({
    control,
    name: "locationId",
  });

  const selectedLocation = locations.find(
    (location) => location.id === locationId,
  );

  const equipment = selectedLocation?.equipment ?? [];

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Stack
        component={"form"}
        direction={"column"}
        spacing={2}
        onSubmit={handleSubmit(onSubmit)}
      >
        <Controller
          name="locationId"
          control={control}
          render={({ field, fieldState }) => (
            <FormControl>
              <InputLabel>Location:</InputLabel>

              <Select {...field} label="Location:">
                {locations.map((location) => (
                  <MenuItem key={location.id} value={location.id}>
                    {location.name}
                  </MenuItem>
                ))}
              </Select>

              <FormHelperText>{fieldState.error?.message}</FormHelperText>
            </FormControl>
          )}
        />

        <Controller
          name="startAt"
          control={control}
          render={({ field, fieldState }) => (
            <FormControl>
              <DateTimePicker label="Start At" {...field} />
              <FormHelperText error>{fieldState.error?.message}</FormHelperText>
            </FormControl>
          )}
        />

        <Controller
          name="endAt"
          control={control}
          render={({ field, fieldState }) => (
            <FormControl>
              <DateTimePicker label="End At" {...field} />
              <FormHelperText error >{fieldState.error?.message}</FormHelperText>
            </FormControl>
          )}
        />

        <TextField
          {...register("note")}
          label="Note"
          multiline
          minRows={3}
          autoFocus
          required
          fullWidth
        />

        <Controller
          name="status"
          control={control}
          render={({ field, fieldState }) => (
            <FormControl error={!!fieldState.error}>
              <FormLabel>Status</FormLabel>

              <RadioGroup {...field} row          
              >
                <FormControlLabel
                  value="DRAFT"
                  control={<Radio />}
                  label="Draft"
                  disabled={isSubmitting}
                />

                <FormControlLabel
                  value="CONFIRMED"
                  control={<Radio />}
                  label="Confirmed"
                  disabled={isSubmitting}
                />
              </RadioGroup>

              <FormHelperText>{fieldState.error?.message}</FormHelperText>
            </FormControl>
          )}
        />
        <ReservationItemsForm control={control} equipment={equipment} />

        <Button
          color="primary"
          type="submit"
          variant="contained"
          loading={isSubmitting}
          disabled={isSubmitting}
        >
          Save Reservation
        </Button>
      </Stack>
    </LocalizationProvider>
  );
}
