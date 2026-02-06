import sqlite3
import csv
import os
from datetime import datetime

DB_PATH = os.path.join(os.path.dirname(__file__), 'accounting.db')

def init_db():
    conn = sqlite3.connect(DB_PATH)
    cur = conn.cursor()
    cur.execute('''
        CREATE TABLE IF NOT EXISTS entries (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            date TEXT NOT NULL,
            description TEXT NOT NULL,
            debit REAL DEFAULT 0,
            credit REAL DEFAULT 0,
            category TEXT
        )
    ''')
    conn.commit()
    conn.close()

def add_entry(date: str, description: str, debit: float = 0, credit: float = 0, category: str = None):
    """Add a ledger entry.
    - date: ISO format string (YYYY-MM-DD) or any parseable date.
    - description: text description of the transaction.
    - debit / credit: amounts (only one should be non‑zero).
    - category: optional classification (e.g., "Honoraires", "Frais", "Recette").
    """
    conn = sqlite3.connect(DB_PATH)
    cur = conn.cursor()
    cur.execute(
        "INSERT INTO entries (date, description, debit, credit, category) VALUES (?, ?, ?, ?, ?)",
        (date, description, debit, credit, category)
    )
    conn.commit()
    conn.close()
    print(f"Entry added: {date} | {description} | debit={debit} | credit={credit} | cat={category}")

def list_entries(limit: int = 100):
    conn = sqlite3.connect(DB_PATH)
    cur = conn.cursor()
    cur.execute('SELECT id, date, description, debit, credit, category FROM entries ORDER BY date DESC LIMIT ?', (limit,))
    rows = cur.fetchall()
    conn.close()
    for row in rows:
        print(row)

def export_csv(csv_path: str = None):
    """Export the whole ledger to a CSV file suitable for an external accountant.
    If csv_path is None, a default file `LexPremium_Lite_Ledger_YYYYMMDD.csv` is created in the project root.
    """
    if csv_path is None:
        today = datetime.now().strftime('%Y%m%d')
        csv_path = os.path.join(os.path.dirname(__file__), f'LexPremium_Lite_Ledger_{today}.csv')
    conn = sqlite3.connect(DB_PATH)
    cur = conn.cursor()
    cur.execute('SELECT date, description, debit, credit, category FROM entries ORDER BY date')
    rows = cur.fetchall()
    conn.close()
    with open(csv_path, mode='w', newline='', encoding='utf-8') as f:
        writer = csv.writer(f)
        writer.writerow(['Date', 'Description', 'Debit', 'Credit', 'Category'])
        writer.writerows(rows)
    print(f"Ledger exported to {csv_path}")

def usage():
    print("Usage: python accounting.py <command> [options]")
    print("Commands:")
    print("  init                 Initialise la base de données")
    print("  add <date> <desc> <debit|credit> <amount> [category]   Ajoute une écriture")
    print("  list [limit]        Liste les dernières écritures (défaut 100)")
    print("  export [path]       Exporte le journal complet au format CSV")

if __name__ == '__main__':
    import sys
    if len(sys.argv) < 2:
        usage()
        sys.exit(1)
    cmd = sys.argv[1]
    if cmd == 'init':
        init_db()
        print('Database initialised at', DB_PATH)
    elif cmd == 'add':
        if len(sys.argv) < 6:
            print('Insufficient arguments for add')
            usage()
            sys.exit(1)
        date = sys.argv[2]
        desc = sys.argv[3]
        typ = sys.argv[4]
        amount = float(sys.argv[5])
        cat = sys.argv[6] if len(sys.argv) > 6 else None
        if typ.lower() == 'debit':
            add_entry(date, desc, debit=amount, credit=0, category=cat)
        elif typ.lower() == 'credit':
            add_entry(date, desc, debit=0, credit=amount, category=cat)
        else:
            print('Type must be "debit" or "credit"')
    elif cmd == 'list':
        limit = int(sys.argv[2]) if len(sys.argv) > 2 else 100
        list_entries(limit)
    elif cmd == 'export':
        path = sys.argv[2] if len(sys.argv) > 2 else None
        export_csv(path)
    else:
        print('Unknown command')
        usage()
