import { requireAuth } from "@/lib/auth-utils";
import { CompilerLayout } from "./components/CompilerLayout";

export default async function CompilerPage() {
	// Require authentication to access the compiler
	await requireAuth();

	return <CompilerLayout />;
}
