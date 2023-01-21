import {
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  Input,
  type InputProps,
} from "@chakra-ui/react";
import { useFormContext, useFormState } from "react-hook-form";
import type { FieldProps } from "./lazy-form";

export type TextInputProps = InputProps & {
  label?: string;
};

export const TextInput: React.FC<TextInputProps & FieldProps> = ({
  name,
  description,
  label,
  ...rest
}) => {
  const form = useFormContext();
  const state = useFormState({ name });

  const error = state.errors[name]?.message as string | undefined;
  console.log(error);

  return (
    <FormControl isInvalid={!!error}>
      <FormLabel>{label}</FormLabel>
      <Input {...rest} {...form.register(name)} />
      {!error ? (
        <FormHelperText>{description}</FormHelperText>
      ) : (
        <FormErrorMessage>{error}</FormErrorMessage>
      )}
    </FormControl>
  );
};
