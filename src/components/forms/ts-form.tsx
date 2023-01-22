import { createTsForm } from "@ts-react/form";
import { z } from "zod";
import { TextInput } from "./text-input";
import { DateTimeInput } from "./date-time-input";

// create the mapping
const mapping = [
  [z.string(), TextInput],
  [z.date(), DateTimeInput],
  // [z.boolean(), CheckBoxField],
  // [z.number(), NumberField],
] as const;

// A typesafe React component
export const TsForm = createTsForm(mapping);
