"use client"

import { Input as ChakraInput, type InputProps } from "@chakra-ui/react"

export function Input(props: InputProps) {
  return (
    <ChakraInput
      variant="outline"
      borderRadius="md"
      size="md"
      borderWidth="1px"
      borderStyle="solid"
      borderColor="gray.300"
      bg="white"
      _hover={{ borderColor: "gray.400" }}
      _focusVisible={{
        borderColor: "blue.500",
        boxShadow: "0 0 0 1px var(--chakra-colors-blue-500)",
      }}
      {...props}
    />
  )
}
