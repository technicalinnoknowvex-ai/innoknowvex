import { redirect } from 'next/navigation';

export default async function AdminPage({ params }) {
	// Params is a promise in this Next.js version—await before using
	const { adminId } = await params;
	// Redirect to dashboard automatically
	redirect(`/admin/${adminId}/dashboard`);
}
