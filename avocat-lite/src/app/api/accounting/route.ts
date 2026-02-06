import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

// Path to the SQLite DB (same location as accounting.py)
const DB_PATH = path.join(process.cwd(), 'accounting.db');

// Helper to get a DB connection (using async/await via sqlite package)
async function getDB() {
    const db = await open({
        filename: DB_PATH,
        driver: sqlite3.Database,
    });
    // Ensure table exists (idempotent)
    await db.run(`
    CREATE TABLE IF NOT EXISTS entries (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      date TEXT NOT NULL,
      description TEXT NOT NULL,
      debit REAL DEFAULT 0,
      credit REAL DEFAULT 0,
      category TEXT
    )
  `);
    return db;
}

export async function GET(request: Request) {
    const url = new URL(request.url);
    const exportCsv = url.searchParams.get('export') === '1';
    const db = await getDB();
    const rows = await db.all('SELECT id, date, description, debit, credit, category FROM entries ORDER BY date');
    await db.close();

    if (exportCsv) {
        // Build CSV string manually
        const header = 'Date,Description,Debit,Credit,Category\n';
        const csv = rows
            .map((r) =>
                `${r.date},"${r.description.replace(/"/g, '""')}",${r.debit ?? ''},${r.credit ?? ''},${r.category ?? ''}`
            )
            .join('\n');
        const csvContent = header + csv;
        return new NextResponse(csvContent, {
            status: 200,
            headers: {
                'Content-Type': 'text/csv',
                'Content-Disposition': 'attachment; filename="LexPremium_Lite_Ledger.csv"',
            },
        });
    }

    // Normal JSON response
    return NextResponse.json(rows);
}

export async function POST(request: Request) {
    const { date, description, type, amount, category } = await request.json();
    if (!date || !description || !type || typeof amount !== 'number') {
        return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
    }
    const debit = type === 'debit' ? amount : 0;
    const credit = type === 'credit' ? amount : 0;
    const db = await getDB();
    await db.run(
        'INSERT INTO entries (date, description, debit, credit, category) VALUES (?, ?, ?, ?, ?)',
        date,
        description,
        debit,
        credit,
        category || null
    );
    await db.close();
    return NextResponse.json({ success: true });
}
