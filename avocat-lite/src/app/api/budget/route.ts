import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

const DB_PATH = path.join(process.cwd(), 'accounting.db');

async function getDB() {
    const db = await open({
        filename: DB_PATH,
        driver: sqlite3.Database,
    });
    // Ensure budgets table exists
    await db.run(`
    CREATE TABLE IF NOT EXISTS budgets (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      month TEXT NOT NULL, -- format YYYY-MM
      allocated REAL NOT NULL,
      spent REAL DEFAULT 0
    )
  `);
    return db;
}

export async function GET(request: Request) {
    const url = new URL(request.url);
    const month = url.searchParams.get('month');
    const db = await getDB();
    let rows;
    if (month) {
        rows = await db.all('SELECT * FROM budgets WHERE month = ?', month);
    } else {
        rows = await db.all('SELECT * FROM budgets ORDER BY month DESC');
    }
    await db.close();
    return NextResponse.json(rows);
}

export async function POST(request: Request) {
    const { month, allocated, spent } = await request.json();
    if (!month || typeof allocated !== 'number') {
        return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
    }
    const db = await getDB();
    // Upsert – if a budget for the month exists, update it; otherwise insert.
    const existing = await db.get('SELECT id FROM budgets WHERE month = ?', month);
    if (existing) {
        await db.run(
            'UPDATE budgets SET allocated = ?, spent = COALESCE(?, spent) WHERE month = ?',
            allocated,
            spent,
            month
        );
    } else {
        await db.run(
            'INSERT INTO budgets (month, allocated, spent) VALUES (?, ?, COALESCE(?, 0))',
            month,
            allocated,
            spent
        );
    }
    await db.close();
    return NextResponse.json({ success: true });
}
