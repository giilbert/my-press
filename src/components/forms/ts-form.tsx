import { createTsForm } from "@ts-react/form";
import { z } from "zod";
import { TextInput } from "./text-input";

// create the mapping
const mapping = [
  [z.string(), TextInput],
  // [z.boolean(), CheckBoxField],
  // [z.number(), NumberField],
] as const;

// A typesafe React component
export const TsForm = createTsForm(mapping);
