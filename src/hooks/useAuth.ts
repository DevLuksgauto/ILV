"use client"

import type { GeneralLoginFormValues, IgaLoginFormValues } from "@/types/auth"
import type { SubmitFeedback } from "@/types/auth"
import {
	buildFlaskUrl,
	getEnvPath,
	getFlaskBaseUrl,
	postFormUrlEncoded,
} from "@/utils/api"
import { useCallback, useState } from "react"

function normalizeFlashStatus(category: string): SubmitFeedback["status"] {
	const key = category.toLowerCase()
	if (key.includes("success")) return "success"
	if (key.includes("warn")) return "warning"
	if (key.includes("info")) return "info"
	return "error"
}

function extractFlashMessageFromHtml(html: string): SubmitFeedback | null {
	const alertMatch = html.match(
		/<div[^>]*class=["'][^"']*alert-([a-zA-Z]+)[^"']*["'][^>]*>([\s\S]*?)<\/div>/i,
	)
	if (!alertMatch) return null

	const [, category, rawMessage] = alertMatch
	const cleaned = rawMessage
		.replace(/<[^>]+>/g, " ")
		.replace(/\s+/g, " ")
		.trim()

	if (!cleaned) return null

	return {
		status: normalizeFlashStatus(category),
		message: cleaned,
	}
}

export function useAuth() {
	const [isSubmitting, setIsSubmitting] = useState(false)
	const [submitError, setSubmitError] = useState<string | null>(null)
	const [submitFeedback, setSubmitFeedback] = useState<SubmitFeedback | null>(null)

	const submitLegacyLogin = useCallback(
		async (
			path: string,
			payload: Record<string, string | number | boolean | undefined>,
			fallbackRedirect: string,
		) => {
			setSubmitError(null)
			setSubmitFeedback(null)
			setIsSubmitting(true)

			try {
				const response = await postFormUrlEncoded(path, payload)

				if (!response.ok) {
					throw new Error(`HTTP ${response.status}`)
				}

				if (response.redirected && response.url) {
					window.location.assign(response.url)
					return true
				}

				const html = await response.text()
				const flash = extractFlashMessageFromHtml(html)
				if (flash) {
					if (flash.status === "error") {
						setSubmitError(flash.message)
						return false
					} else {
						setSubmitFeedback(flash)
						return true
					}
				}

				window.location.assign(buildFlaskUrl(fallbackRedirect))
				return true
			} catch {
				const base = getFlaskBaseUrl()
				if (!base) {
					setSubmitError(
						"Defina NEXT_PUBLIC_FLASK_BASE_URL para conectar o login ao backend Flask.",
					)
				} else {
					setSubmitError("Nao foi possivel enviar o formulario. Tente novamente.")
				}
				return false
			} finally {
				setIsSubmitting(false)
			}
		},
		[],
	)

	const submitIgaLogin = useCallback(
		async (values: IgaLoginFormValues) => {
			return submitLegacyLogin(
				getEnvPath("NEXT_PUBLIC_IGA_LOGIN_ENDPOINT", "/iga"),
				{
					operation_mode: values.operationMode,
					hostname: values.hostname,
					username: values.username,
					port: values.port,
					password: values.password,
					path: values.path,
					local_log_path: values.localLogPath,
					save_profile: values.saveProfile,
					save_as_default: values.saveAsDefault,
				},
				getEnvPath("NEXT_PUBLIC_IGA_SUCCESS_REDIRECT", "/iga/dashboard"),
			)
		},
		[submitLegacyLogin],
	)

	const submitGeneralLogin = useCallback(
		async (values: GeneralLoginFormValues) => {
			return submitLegacyLogin(
				getEnvPath("NEXT_PUBLIC_GENERAL_LOGIN_ENDPOINT", "/general"),
				{
					hostname: values.hostname,
					port: values.port,
					username: values.username,
					password: values.password,
					path: values.path,
					save_profile: values.saveProfile,
					profile_name: values.profileName,
				},
				getEnvPath("NEXT_PUBLIC_GENERAL_SUCCESS_REDIRECT", "/general/view"),
			)
		},
		[submitLegacyLogin],
	)

	return {
		submitIgaLogin,
		submitGeneralLogin,
		isSubmitting,
		submitError,
		submitFeedback,
	}
}

