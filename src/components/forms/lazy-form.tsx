// shhhhhhhhh

/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { z, ZodEffects, type ZodObjectDef, type ZodSchema } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { type FC, memo, type ReactElement, useMemo } from "react";
import { TextInput, type TextInputProps } from "./text-input";
import {
  FormProvider,
  useForm,
  type UseFormProps,
  type UseFormReturn,
} from "react-hook-form";

export type ShortenFieldProps = Omit<FieldProps, "name">;

type FieldBuilders<S extends ZodSchema> = {
  [F in keyof z.infer<S>]: {
    Text: FC<ShortenFieldProps & TextInputProps>;
  };
};

export interface FieldProps {
  name: string;
  fieldName?: string;
  description?: string;
}

function wrap<P>(name: string, Component: React.ComponentType<FieldProps & P>) {
  const WrappedComponent = (props: ShortenFieldProps & P) => {
    return <Component {...props} name={name} />;
  };
  WrappedComponent.displayName = "Field";

  return WrappedComponent;
}

interface LazyFormProps<S extends ZodEffects<ObjectSchema> | ObjectSchema> {
  schema: S;
  children: (fields: FieldBuilders<S>) => ReactElement;
  form: UseFormReturn<z.infer<S>, any>;
  onSubmit: (values: z.infer<S>) => void;
}

function LazyFormNoMemo<S extends ZodEffects<ObjectSchema> | ObjectSchema>({
  children,
  schema,
  form,
  onSubmit,
}: LazyFormProps<S>) {
  const builders = useMemo(() => {
    const shape =
      schema instanceof ZodEffects
        ? schema._def.schema._def.shape()
        : schema._def.shape();

    return Object.fromEntries(
      Object.keys(shape).map((fieldName) => [
        fieldName,
        {
          Text: wrap(fieldName, TextInput),
        },
      ])
    );
  }, [schema._def]);

  return (
    <FormProvider {...form}>
      <MemoedForm builders={builders} form={form} onSubmit={onSubmit}>
        {children as any}
      </MemoedForm>
    </FormProvider>
  );
}

const MemoedForm = memo(function <S extends ZodSchema<any, ZodObjectDef>>(
  props: Pick<LazyFormProps<S>, "form" | "onSubmit"> & {
    builders: FieldBuilders<S>;
    children: (fields: FieldBuilders<S>) => ReactElement;
  }
) {
  return (
    <form onSubmit={props.form.handleSubmit(props.onSubmit)}>
      {props.children(props.builders as FieldBuilders<S>)}
    </form>
  );
});

MemoedForm.displayName = "MemoedForm";

type ObjectSchema = ZodSchema<any, ZodObjectDef>;

export function createLazyForm<
  S extends ZodEffects<ObjectSchema> | ObjectSchema
>({
  schema,
  render,
  displayName = "Form",
}: {
  schema: S;
  render: (fields: FieldBuilders<S>) => ReactElement;
  displayName?: string;
}) {
  const Form = memo(
    ({ form, onSubmit }: Pick<LazyFormProps<S>, "form" | "onSubmit">) => {
      return (
        <LazyForm schema={schema} form={form} onSubmit={onSubmit}>
          {(b) => render(b as any)}
        </LazyForm>
      );
    }
  );
  Form.displayName = displayName;

  return {
    Form,
    useForm: (
      useFormProps?: Omit<UseFormProps<z.infer<S>, any>, "resolver">
    ) => {
      return useForm<z.infer<S>>({
        resolver: zodResolver(schema),
        mode: "onTouched",
        reValidateMode: "onBlur",
        ...useFormProps,
      });
    },
  };
}

export const LazyForm = memo(LazyFormNoMemo);
