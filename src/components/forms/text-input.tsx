import {
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  Input,
} from "@chakra-ui/react";
import { useTsController } from "@ts-react/form";

interface TextInputProps {
  label: string;
  description?: string;
}

// if you put React.FC here it breaks
export const TextInput = ({ label, description }: TextInputProps) => {
  const { field, error } = useTsController<string>();

  return (
    <FormControl isInvalid={!!error}>
      <FormLabel>{label}</FormLabel>
      <Input
        value={field.value}
        onChange={(e) => field.onChange(e.target.value)}
      />
      {!error ? (
        <FormHelperText>{description}</FormHelperText>
      ) : (
        <FormErrorMessage>{error.errorMessage}</FormErrorMessage>
      )}
    </FormControl>
  );
};
