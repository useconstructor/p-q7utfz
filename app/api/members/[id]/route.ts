import { db } from "@/lib/db"

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const body = await request.json()
  const allowed = ["name", "email", "membership", "expiry", "enrollments"]
  const fields = Object.keys(body).filter(k => allowed.includes(k))
  if (fields.length === 0) return Response.json({ error: "No valid fields" }, { status: 400 })
  const sets = fields.map(k => k + "=?").join(", ")
  await db.execute({ sql: `UPDATE members SET ${sets} WHERE id=?`, args: [...fields.map(k => body[k]), id] })
  const { rows } = await db.execute({ sql: "SELECT * FROM members WHERE id=?", args: [id] })
  return Response.json(rows[0] ?? null)
}

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  await db.execute({ sql: "DELETE FROM members WHERE id=?", args: [id] })
  return Response.json({ ok: true })
}
