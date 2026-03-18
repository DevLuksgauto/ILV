import { Box, Button, Heading, Stack, Text } from "@chakra-ui/react"
import Link from "next/link"

export default function Home() {
  return (
    <Box minH="100dvh" bg="gray.50" p={{ base: "6", md: "10" }}>
      <Stack maxW="520px" mx="auto" bg="white" p="8" borderRadius="xl" boxShadow="lg" gap="5">
        <Heading size="lg">ILV Login Preview</Heading>
        <Text color="gray.600" fontSize="sm">
          Escolha qual tela de login voce quer validar nesta etapa da migracao.
        </Text>

        <Button asChild colorPalette="blue">
          <Link href="/login/iga">Abrir Login IGA</Link>
        </Button>

        <Button asChild colorPalette="green" variant="outline">
          <Link href="/login/general">Abrir Login General</Link>
        </Button>
      </Stack>
    </Box>
  )
}
