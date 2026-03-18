import { LoginForm } from "@/components/Organisms/LoginForm/LoginForm"
import { AuthLayout } from "@/components/Templates/AuthLayout/AuthLayout"
import { Link } from "@chakra-ui/react"
import { buildFlaskUrl } from "@/utils/api"

export default function IgaLoginPage() {
	return (
		<AuthLayout
			title="IGA Log Analyzer"
			subtitle="Professional Log Management"
			footer={
				<>
					<Link href="/login/general" color="blue.600" fontWeight="700" fontSize="sm">
						General Monitor
					</Link>
					<TextSeparator />
					<Link href={buildFlaskUrl("/manage_profiles")} color="red.600" fontWeight="700" fontSize="sm">
						Manage Profiles
					</Link>
				</>
			}
		>
			<LoginForm />
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


