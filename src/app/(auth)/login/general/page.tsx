import { GeneralLoginForm } from "@/components/Organisms/GeneralLoginForm/GeneralLoginForm"
import { AuthLayout } from "@/components/Templates/AuthLayout/AuthLayout"
import { Link } from "@chakra-ui/react"
import { buildFlaskUrl } from "@/utils/api"

export default function GeneralLoginPage() {
	return (
		<AuthLayout
			title="General Monitor"
			subtitle="Connect and monitor general logs"
			footer={
				<>
					<Link href="/login/iga" color="blue.600" fontWeight="700" fontSize="sm">
						Go to IGA Module
					</Link>
					<TextSeparator />
					<Link href={buildFlaskUrl("/manage_profiles")} color="red.600" fontWeight="700" fontSize="sm">
						Manage Profiles
					</Link>
				</>
			}
		>
			<GeneralLoginForm />
		</AuthLayout>
	)
}

function TextSeparator() {
  return (
    <span style={{ margin: "0 8px", color: "#94a3b8", fontSize: "14px" }}>
      |
    </span>
  )
}


