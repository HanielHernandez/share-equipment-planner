import { ReservationInput } from "@/schemas/reservation";
import { Equipment } from "@/types/equipment";
import {
  Button,
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import {
  Control,
  Controller,
  useFieldArray,
  useFormState,
  useWatch,
} from "react-hook-form";

export type ReservationItemsFormProps = {
  control: Control<ReservationInput>;
  equipment: Equipment[];
};

export default function ReservationItemsForm({
  control,
  equipment,
}: ReservationItemsFormProps) {
  const { fields, append, remove } = useFieldArray({
    control,
    name: "items",
  });

  const items = useWatch({
    control,
    name: "items",
  });

  const { errors } = useFormState({ control, name: "items" });
  const itemsError = errors.items?.message ?? errors.items?.root?.message;

  const handleAdd = () => {
    append({
      equipmentId: "",
      quantity: 1,
    });
  };

  return (
    <>
      <Stack
        direction="row"
        sx={{
          justifyContent: "space-between",
        }}
      >
        <Typography color="text.secondary" variant="h6"> Reservation Items </Typography>
        <Button type="button" variant="outlined" onClick={handleAdd}>
          Add
        </Button>
      </Stack>

      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Equipment</TableCell>
            <TableCell>Available</TableCell>
            <TableCell>Requested</TableCell>
            <TableCell />
          </TableRow>
        </TableHead>

        <TableBody>
          {fields.length === 0 ? (
            <TableRow>
              <TableCell colSpan={4}>
                <Typography color="text.secondary" sx={{ py: 2, textAlign: "center" }}>
                  No equipment added yet. Use Add to include items in this reservation.
                </Typography>
              </TableCell>
            </TableRow>
          ) : null}

          {fields.map((field, index) => (
            <TableRow key={field.id}>
              <TableCell>
                <Controller
                  control={control}
                  name={`items.${index}.equipmentId`}
                  render={({ field, fieldState }) => (
                    <FormControl
                      fullWidth
                      size="small"
                      error={!!fieldState.error}
                    >
                      <InputLabel>Equipment</InputLabel>

                      <Select {...field} label="Equipment">
                        {equipment.map((item) => (
                          <MenuItem key={item.id} value={item.id}>
                            {item.name}
                          </MenuItem>
                        ))}
                      </Select>

                      <FormHelperText>
                        {fieldState.error?.message}
                      </FormHelperText>
                    </FormControl>
                  )}
                />
              </TableCell>

              <TableCell>
                {equipment.find(
                  (item) => item.id === items?.[index]?.equipmentId,
                )?.totalQuantity ?? "—"}
              </TableCell>

              <TableCell>
                <Controller
                  control={control}
                  name={`items.${index}.quantity`}
                  render={({ field, fieldState }) => (
                    <TextField
                      {...field}
                      type="number"
                      size="small"
                      error={!!fieldState.error}
                      helperText={fieldState.error?.message}
                      onChange={(event) => {
                        field.onChange(Number(event.target.value));
                      }}
                      slotProps={{
                        htmlInput: {
                          min: 1,
                        },
                      }}
                    />
                  )}
                />
              </TableCell>

              <TableCell>
                <Button
                  type="button"
                  color="error"
                  onClick={() => remove(index)}
                >
                  Remove
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {itemsError ? <FormHelperText error>{itemsError}</FormHelperText> : null}
    </>
  );
}
