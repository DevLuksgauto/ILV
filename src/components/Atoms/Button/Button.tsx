"use client"

import {
  Button as ChakraButton,
  type ButtonProps as ChakraButtonProps,
} from "@chakra-ui/react"

export type ButtonProps = ChakraButtonProps

export function Button(props: ButtonProps) {
  return <ChakraButton borderRadius="md" fontWeight="600" {...props} />
}
