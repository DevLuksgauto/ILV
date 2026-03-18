"use client"

import type {
  SavedProfile,
  SavedProfileType,
  SavedProfilesMap,
} from "@/types/auth"
import { fetchText, getEnvPath } from "@/utils/api"
import { useCallback, useEffect, useState } from "react"

const LOCAL_STORAGE_KEY = "ilvSavedProfiles"

function loadLocalProfiles() {
  if (typeof window === "undefined") return {} as SavedProfilesMap
  try {
    const raw = window.localStorage.getItem(LOCAL_STORAGE_KEY)
    if (!raw) return {}
    return JSON.parse(raw) as SavedProfilesMap
  } catch {
    return {}
  }
}

function saveLocalProfiles(profiles: SavedProfilesMap) {
  if (typeof window === "undefined") return
  window.localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(profiles))
}

function profilePageEndpoint(type: SavedProfileType) {
  if (type === "iga") {
    return getEnvPath("NEXT_PUBLIC_IGA_LOGIN_ENDPOINT", "/iga")
  }
  return getEnvPath("NEXT_PUBLIC_GENERAL_LOGIN_ENDPOINT", "/general")
}

function extractProfilesFromHtml(html: string, type: SavedProfileType) {
  const regex =
    type === "iga"
      ? /const\s+savedProfiles\s*=\s*(\{[\s\S]*?\});/
      : /const\s+profiles\s*=\s*(\{[\s\S]*?\});/

  const match = html.match(regex)
  if (!match?.[1]) return null

  try {
    return JSON.parse(match[1]) as SavedProfilesMap
  } catch {
    return null
  }
}

export function useProfiles(type: SavedProfileType) {
  const [profiles, setProfiles] = useState<SavedProfilesMap>({})

  const loadProfiles = useCallback(async () => {
    const fallback = loadLocalProfiles()

    try {
      const html = await fetchText(profilePageEndpoint(type))
      const list = extractProfilesFromHtml(html, type) ?? {}
      setProfiles(list)
      saveLocalProfiles({ ...fallback, ...list })
    } catch {
      const onlyType = Object.fromEntries(
        Object.entries(fallback).filter(([, profile]) => profile.type === type),
      )
      setProfiles(onlyType)
    }
  }, [type])

  const saveProfile = useCallback(
    async (name: string, profile: SavedProfile) => {
      const current = loadLocalProfiles()
      const next = { ...current, [name]: profile }
      saveLocalProfiles(next)
      setProfiles((prev) => ({ ...prev, [name]: profile }))
    },
    [],
  )

  useEffect(() => {
    void loadProfiles()
  }, [loadProfiles])

  return { profiles, saveProfile, reloadProfiles: loadProfiles }
}
