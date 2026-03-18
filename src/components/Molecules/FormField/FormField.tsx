"use client"

import { Input } from "@/components/Atoms/Input/Input"
import { Field } from "@/components/ui/field"
import {
  Controller,
  type Control,
  type FieldValues,
  type Path,
} from "react-hook-form"

type FormFieldProps<TFieldValues extends FieldValues> = {
  control: Control<TFieldValues>
  name: Path<TFieldValues>
  label: string
  placeholder?: string
  type?: "text" | "password" | "number"
  helperText?: string
}

export function FormField<TFieldValues extends FieldValues>({
  control,
  name,
  label,
  placeholder,
  type = "text",
  helperText,
}: FormFieldProps<TFieldValues>) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <Field
          label={label}
          helperText={helperText}
          errorText={fieldState.error?.message}
        >
          <Input
            {...field}
            value={field.value ?? ""}
            type={type}
            placeholder={placeholder}
            borderColor={fieldState.invalid ? "red.400" : "gray.300"}
          />
        </Field>
      )}
    />
  )
}
