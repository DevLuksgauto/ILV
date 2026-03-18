type Primitive = string | number | boolean

type JsonRecord = Record<string, unknown>

function normalizeBaseUrl(baseUrl: string) {
	const trimmed = baseUrl.trim()
	if (!trimmed) return ""
	return trimmed.endsWith("/") ? trimmed.slice(0, -1) : trimmed
}

export function getFlaskBaseUrl() {
	return normalizeBaseUrl(process.env.NEXT_PUBLIC_FLASK_BASE_URL ?? "")
}

export function buildFlaskUrl(path: string) {
	const base = getFlaskBaseUrl()
	const safePath = path.startsWith("/") ? path : `/${path}`
	return `${base}${safePath}`
}

export function getEnvPath(name: string, fallbackPath: string) {
	const value = process.env[name]
	if (!value?.trim()) return fallbackPath
	return value.startsWith("/") ? value : `/${value}`
}

export async function fetchJson(
	path: string,
	init?: RequestInit,
): Promise<JsonRecord | null> {
	const response = await fetch(buildFlaskUrl(path), {
		credentials: "include",
		...init,
	})

	if (!response.ok) {
		throw new Error(`HTTP ${response.status}`)
	}

	return (await response.json()) as JsonRecord
}

export async function fetchText(path: string, init?: RequestInit) {
	const response = await fetch(buildFlaskUrl(path), {
		credentials: "include",
		...init,
	})

	if (!response.ok) {
		throw new Error(`HTTP ${response.status}`)
	}

	return response.text()
}

export async function postFormUrlEncoded(
	path: string,
	payload: Record<string, Primitive | undefined>,
) {
	const formBody = new URLSearchParams()

	Object.entries(payload).forEach(([key, value]) => {
		if (value === undefined) return
		formBody.append(key, String(value))
	})

	return fetch(buildFlaskUrl(path), {
		method: "POST",
		headers: {
			"Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
		},
		body: formBody.toString(),
		credentials: "include",
		redirect: "follow",
	})
}

export async function postJson(path: string, payload: JsonRecord) {
	return fetch(buildFlaskUrl(path), {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(payload),
		credentials: "include",
	})
}


