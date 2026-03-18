"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import {
	generalLoginSchema,
	igaLoginSchema,
	type GeneralLoginFormValues,
	type IgaLoginFormValues,
} from "@/types/auth"
import { useMemo } from "react"
import { useForm } from "react-hook-form"

export function useIgaLoginForm(
	onSubmit: (values: IgaLoginFormValues) => Promise<boolean>,
) {
	const form = useForm<IgaLoginFormValues>({
		resolver: zodResolver(igaLoginSchema),
		defaultValues: {
			operationMode: "online",
			hostname: "",
			username: "",
			port: 22,
			password: "",
			path: "/opt/brcm/iga/logs",
			localLogPath: "",
			saveProfile: true,
			saveAsDefault: true,
		},
		mode: "onSubmit",
	})

	const mode = form.watch("operationMode")

	const handleSubmit = useMemo(
		() => form.handleSubmit(async (values) => onSubmit(values)),
		[form, onSubmit],
	)

	return { form, mode, handleSubmit }
}

export function useGeneralLoginForm(
	onSubmit: (values: GeneralLoginFormValues) => Promise<boolean>,
) {
	const form = useForm<GeneralLoginFormValues>({
		resolver: zodResolver(generalLoginSchema),
		defaultValues: {
			hostname: "",
			port: 22,
			username: "",
			password: "",
			path: "/var/log/syslog",
			saveProfile: false,
			profileName: "",
		},
		mode: "onSubmit",
	})

	const saveProfile = form.watch("saveProfile")

	const handleSubmit = useMemo(
		() => form.handleSubmit(async (values) => onSubmit(values)),
		[form, onSubmit],
	)

	return { form, saveProfile, handleSubmit }
}


