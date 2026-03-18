"use client"

import { Text, type TextProps } from "@chakra-ui/react"

export function Label(props: TextProps) {
  return (
    <Text
      as="label"
      display="inline-block"
      fontSize="sm"
      fontWeight="600"
      color="gray.700"
      {...props}
    />
  )
}
