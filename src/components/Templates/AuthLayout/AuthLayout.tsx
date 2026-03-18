"use client"

import { Box, Heading, Text } from "@chakra-ui/react"
import type { ReactNode } from "react"

type AuthLayoutProps = {
  title: string
  subtitle: string
  children: ReactNode
  footer?: ReactNode
}

export function AuthLayout({ title, subtitle, children, footer }: AuthLayoutProps) {
  return (
    <Box
      minH="100dvh"
      bgGradient="linear(to-br, blue.50, gray.100)"
      display="grid"
      placeItems="center"
      p={{ base: "4", md: "8" }}
    >
      <Box
        w="full"
        maxW="440px"
        bg="white"
        borderRadius="2xl"
        p={{ base: "5", md: "8" }}
        boxShadow="0 20px 45px rgba(15, 23, 42, 0.14)"
        border="1px solid"
        borderColor="gray.200"
      >
        <Text
          textAlign="center"
          fontSize="2xl"
          lineHeight="1"
          mb="3"
          aria-label="logo"
        >
          🛡️
        </Text>
        <Heading size="lg" color="gray.900">
          {title}
        </Heading>
        <Text mt="1" mb="6" color="gray.600" fontSize="sm">
          {subtitle}
        </Text>
        {children}
        {footer ? <Box mt="6">{footer}</Box> : null}
      </Box>
    </Box>
  )
}
