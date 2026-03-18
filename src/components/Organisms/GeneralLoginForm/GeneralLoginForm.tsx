"use client"

import { Button } from "@/components/Atoms/Button/Button"
import { FormField } from "@/components/Molecules/FormField/FormField"
import { useAuth } from "@/hooks/useAuth"
import { useGeneralLoginForm } from "@/hooks/useForm"
import { useProfiles } from "@/hooks/useProfiles"
import { Alert, Box, HStack, Stack, Text } from "@chakra-ui/react"
import { useState } from "react"
import { Controller } from "react-hook-form"

export function GeneralLoginForm() {
  const { submitGeneralLogin, isSubmitting, submitError, submitFeedback } = useAuth()
  const { form, saveProfile } = useGeneralLoginForm(submitGeneralLogin)
  const { profiles, saveProfile: persistProfile } = useProfiles("general")

  const [selectedProfile, setSelectedProfile] = useState("")

  const applyProfile = (profileName: string) => {
    setSelectedProfile(profileName)

    const profile = profiles[profileName]
    if (!profile) return

    form.setValue("hostname", profile.hostname ?? "")
    form.setValue("port", profile.port ?? 22)
    form.setValue("username", profile.username ?? "")
    form.setValue("password", profile.password ?? "")
    form.setValue("path", profile.path ?? "/var/log/syslog")
  }

  return (
    <Box
      as="form"
      onSubmit={async (event) => {
        event.preventDefault()
        let success = false
        await form.handleSubmit(async (values) => {
          success = await submitGeneralLogin(values)
        })()

        if (!success) return

        const values = form.getValues()
        if (!values.saveProfile) return

        const name =
          values.profileName?.trim() || values.hostname.trim() || "General Profile"

        await persistProfile(name, {
          type: "general",
          hostname: values.hostname,
          username: values.username,
          password: values.password,
          port: values.port,
          path: values.path,
        })
      }}
    >
      <Stack gap="4">
        {Object.keys(profiles).length > 0 ? (
          <Box>
            <Text fontSize="sm" fontWeight="600" mb="2">
              Saved General Connections
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
              <option value="">-- Select --</option>
              {Object.keys(profiles).map((name) => (
                <option key={name} value={name}>
                  {name}
                </option>
              ))}
            </select>
          </Box>
        ) : null}

        <HStack align="start" gap="3">
          <Box flex="2">
            <FormField
              control={form.control}
              name="hostname"
              label="Host / IP"
              placeholder="192.168.1.10"
            />
          </Box>
          <Box flex="1">
            <FormField
              control={form.control}
              name="port"
              label="Port"
              type="number"
              placeholder="22"
            />
          </Box>
        </HStack>

        <FormField
          control={form.control}
          name="username"
          label="SSH User"
          placeholder="root"
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
          label="File Path (Full Path)"
          placeholder="/var/log/syslog"
        />

        <Controller
          control={form.control}
          name="saveProfile"
          render={({ field }) => (
            <label style={{ display: "flex", gap: "8px", alignItems: "center" }}>
              <input
                type="checkbox"
                checked={field.value}
                onChange={(event) => field.onChange(event.target.checked)}
              />
              <span style={{ fontSize: "14px" }}>Save connection now</span>
            </label>
          )}
        />

        {saveProfile ? (
          <FormField
            control={form.control}
            name="profileName"
            label="Profile Name"
            placeholder="Production Node 01"
          />
        ) : null}

        {submitError ? (
          <Alert.Root status="error" variant="subtle" borderRadius="md">
            <Alert.Indicator />
            <Alert.Content>
              <Alert.Title>Falha ao enviar</Alert.Title>
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

        <Button type="submit" colorPalette="green" loading={isSubmitting}>
          Connect and Monitor
        </Button>
      </Stack>
    </Box>
  )
}
