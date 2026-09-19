import { db } from "@/lib/db"

const schema = "CREATE TABLE IF NOT EXISTS classes (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, instructor TEXT NOT NULL, day TEXT NOT NULL, time TEXT NOT NULL, capacity INTEGER NOT NULL DEFAULT 20, enrolled INTEGER NOT NULL DEFAULT 0, created_at TEXT DEFAULT (datetime(\"now\")))"

export async function GET() {
  try {
    await db.execute(schema)
    const { rows } = await db.execute("SELECT * FROM classes ORDER BY id")
    return Response.json(rows)
  } catch (err: any) {
    return Response.json({ error: err.message }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    if (!body.name?.trim() || !body.instructor?.trim() || !body.day || !body.time) {
      return Response.json({ error: "name, instructor, day and time are required" }, { status: 400 })
    }
    await db.execute(schema)
    const res = await db.execute({
      sql: "INSERT INTO classes (name, instructor, day, time, capacity, enrolled) VALUES (?, ?, ?, ?, ?, 0)",
      args: [body.name.trim(), body.instructor.trim(), body.day, body.time, body.capacity ?? 20],
    })
    const { rows } = await db.execute({ sql: "SELECT * FROM classes WHERE id=?", args: [res.lastInsertRowid] })
    return Response.json(rows[0] ?? { ok: true }, { status: 201 })
  } catch (err: any) {
    return Response.json({ error: err.message }, { status: 500 })
  }
}
