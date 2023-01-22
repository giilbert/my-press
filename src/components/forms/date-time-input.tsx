import {
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  Input,
} from "@chakra-ui/react";
import { useTsController } from "@ts-react/form";
import moment from "moment";

interface DateTimeInputProps {
  label: string;
  description?: string;
}

// if you put React.FC here it breaks
export const DateTimeInput = ({ label, description }: DateTimeInputProps) => {
  const { field, error } = useTsController<Date>();

  return (
    <FormControl isInvalid={!!error}>
      <FormLabel>{label}</FormLabel>
      <Input
        type="datetime-local"
        value={
          field.value ? moment(field.value).format("YYYY-MM-DDTHH:mm:ss") : ""
        }
        onChange={(e) => {
          console.log(e.target.value);
          field.onChange(new Date(e.target.value));
        }}
      />
      {!error ? (
        <FormHelperText>{description}</FormHelperText>
      ) : (
        <FormErrorMessage>{error.errorMessage}</FormErrorMessage>
      )}
    </FormControl>
  );
};
