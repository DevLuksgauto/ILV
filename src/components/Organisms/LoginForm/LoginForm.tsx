"use client"

import { Button } from "@/components/Atoms/Button/Button"
import { FormField } from "@/components/Molecules/FormField/FormField"
import { Checkbox } from "@/components/ui/checkbox"
import { useAuth } from "@/hooks/useAuth"
import { useIgaLoginForm } from "@/hooks/useForm"
import { useProfiles } from "@/hooks/useProfiles"
import { Alert, Box, Button as ChakraButton, HStack, Stack, Text } from "@chakra-ui/react"
import { QuestionOutlineIcon } from "@chakra-ui/icons"
import { useState } from "react"
import { Controller } from "react-hook-form"

function getWindowsPathHelpText() {
  return "How to get the folder path (Windows): 1) Open Explorer 2) Navigate to logs folder 3) Click address bar 4) Copy path with Ctrl+C"
}

function getUnixPathHelpText() {
  return "How to get the folder path (Linux/Mac): 1) Open file manager 2) Navigate to logs folder 3) Copy full path and paste here"
}

export function LoginForm() {
  const { submitIgaLogin, isSubmitting, submitError, submitFeedback } = useAuth()
  const { form, mode } = useIgaLoginForm(submitIgaLogin)
  const { profiles, saveProfile } = useProfiles("iga")

  const [selectedProfile, setSelectedProfile] = useState("")

  const username = form.watch("username")
  const showIgxNotice =
    mode === "online" && !!username && username !== "igx" && username !== "iga"

  const applyProfile = (profileName: string) => {
    setSelectedProfile(profileName)

    const profile = profiles[profileName]
    if (!profile) return

    form.setValue("operationMode", profile.operationMode ?? "online")
    form.setValue("hostname", profile.hostname ?? "")
    form.setValue("username", profile.username ?? "")
    form.setValue("password", profile.password ?? "")
    form.setValue("port", profile.port ?? 22)
    form.setValue("path", profile.path ?? "/opt/brcm/iga/logs")
    form.setValue("localLogPath", profile.localLogPath ?? "")
  }

  const showOfflineHelp = () => {
    const isWindows = window.navigator.platform.toLowerCase().includes("win")
    window.alert(isWindows ? getWindowsPathHelpText() : getUnixPathHelpText())
  }

  return (
    <Box
      as="form"
      onSubmit={async (event) => {
        event.preventDefault()
        let success = false
        await form.handleSubmit(async (values) => {
          success = await submitIgaLogin(values)
        })()

        if (!success) return

        const values = form.getValues()
        if (!values.saveProfile) return

        const autoName = values.hostname || values.localLogPath || "IGA Profile"
        await saveProfile(autoName, {
          type: "iga",
          operationMode: values.operationMode,
          hostname: values.hostname,
          username: values.username,
          password: values.password,
          port: values.port,
          path: values.path,
          localLogPath: values.localLogPath,
        })
      }}
    >
      <Stack gap="4">
        {Object.keys(profiles).length > 0 ? (
          <Box>
            <Text fontSize="sm" fontWeight="600" mb="2">
              Saved IGA Connections
            </Text>
            <select
              value={selectedProfile}
              onChange={(event) => applyProfile(event.target.value)}
              style={{
                width: "100%",
                border: "1px solid #cbd5e1",
                borderRadius: "8px",
                padding: "10px 12px",
              }}
            >
              <option value="">-- Select a saved connection --</option>
              {Object.keys(profiles).map((name) => (
                <option key={name} value={name}>
                  {name}
                </option>
              ))}
            </select>
          </Box>
        ) : null}

        {submitError ? (
          <Alert.Root status="error" variant="subtle" borderRadius="md">
            <Alert.Indicator />
            <Alert.Content>
              <Alert.Description>{submitError}</Alert.Description>
            </Alert.Content>
          </Alert.Root>
        ) : null}

        {submitFeedback ? (
          <Alert.Root status={submitFeedback.status} variant="subtle" borderRadius="md">
            <Alert.Indicator />
            <Alert.Content>
              <Alert.Description>{submitFeedback.message}</Alert.Description>
            </Alert.Content>
          </Alert.Root>
        ) : null}

        {showIgxNotice ? (
          <Alert.Root status="info" variant="subtle" borderRadius="md">
            <Alert.Indicator />
            <Alert.Content>
              <Alert.Title>IGA Control</Alert.Title>
              <Alert.Description>
                Para funcionalidades completas de IGA Control, use usuario igx ou
                iga.
              </Alert.Description>
            </Alert.Content>
          </Alert.Root>
        ) : null}

        <Box>
          <Text fontSize="sm" fontWeight="600" mb="2">
            Operation Mode
          </Text>
          <HStack spacing="2">
            <ChakraButton
              flex="1"
              size="sm"
              variant={mode === "online" ? "solid" : "outline"}
              onClick={() => form.setValue("operationMode", "online")}
            >
              Online (SSH)
            </ChakraButton>
            <ChakraButton
              flex="1"
              size="sm"
              variant={mode === "offline" ? "solid" : "outline"}
              onClick={() => form.setValue("operationMode", "offline")}
            >
              Offline (Local)
            </ChakraButton>
          </HStack>
        </Box>

        {mode === "online" ? (
          <Stack gap="3">
            <FormField
              control={form.control}
              name="hostname"
              label="Host / IP"
              placeholder="10.0.0.1"
            />
            <FormField
              control={form.control}
              name="username"
              label="SSH User"
              placeholder="root"
            />
            <FormField
              control={form.control}
              name="port"
              label="Port"
              type="number"
              placeholder="22"
            />
            <FormField
              control={form.control}
              name="password"
              label="Password"
              type="password"
            />
            <FormField
              control={form.control}
              name="path"
              label="Base Directory on Server"
              placeholder="/opt/brcm/iga/logs"
            />
          </Stack>
        ) : (
          <Stack gap="2">
            <FormField
              control={form.control}
              name="localLogPath"
              label="Local Logs Directory"
              placeholder="C:/logs/iga or /home/user/logs/iga"
              helperText="The folder structure must follow server pattern (xpress/, idm/, idg/, etc)."
            />
            <HStack justify="space-between" spacing="2" flexWrap="wrap">
              <Button
                type="button"
                variant="outline"
                size="sm"
                leftIcon={<QuestionOutlineIcon />}
                onClick={showOfflineHelp}
              >
                Help
              </Button>
              <Text fontSize="xs" color="gray.500" maxW="320px">
                Tip: Open Windows Explorer, navigate to your logs folder, click the address bar,
                copy the path (Ctrl+C), and paste it here.
              </Text>
            </HStack>
          </Stack>
        )}

        <Stack gap="2">
          <Controller
            control={form.control}
            name="saveProfile"
            render={({ field }) => (
              <Checkbox
                checked={field.value}
                onCheckedChange={(details) => field.onChange(!!details.checked)}
              >
                Securely save connection
              </Checkbox>
            )}
          />

          <Controller
            control={form.control}
            name="saveAsDefault"
            render={({ field }) => (
              <Checkbox
                checked={field.value}
                onCheckedChange={(details) => field.onChange(!!details.checked)}
              >
                Use as default on next login
              </Checkbox>
            )}
          />
        </Stack>

        <Button type="submit" w="full" colorPalette="blue" loading={isSubmitting}>
          Connect
        </Button>
      </Stack>
    </Box>
  )
}
