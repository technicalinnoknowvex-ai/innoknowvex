import sql from "@/db"

export async function GET() {
    await sql`SELECT 1`
    return Response.json({ status: 'ok' })
}