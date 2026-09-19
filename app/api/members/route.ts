import { db } from '@/lib/db'

const schema = `CREATE TABLE IF NOT EXISTS members (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  membership TEXT NOT NULL,
  expiry TEXT NOT NULL,
  enrollments INTEGER NOT NULL DEFAULT 0,
  created_at TEXT DEFAULT (datetime('now'))
)`

export async function GET() {
  await db.execute(schema)
  const { rows } = await db.execute('SELECT id, name, email, membership, expiry, enrollments FROM members ORDER BY created_at DESC')
  return Response.json(rows)
}

export async function POST(request: Request) {
  const body = await request.json()
  if (!body.name?.trim() || !body.email?.trim() || !body.expiry || !['Basic', 'Premium'].includes(body.membership)) {
    return Response.json({ error: 'Valid member details are required' }, { status: 400 })
  }
  await db.execute(schema)
  try {
    const res = await db.execute({
      sql: 'INSERT INTO members (name, email, membership, expiry) VALUES (?, ?, ?, ?) RETURNING *',
      args: [body.name.trim(), body.email.trim().toLowerCase(), body.membership, body.expiry],
    })
    return Response.json(res.rows[0] ?? { ok: true }, { status: 201 })
  } catch {
    return Response.json({ error: 'A member with this email already exists' }, { status: 409 })
  }
}
