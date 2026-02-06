"use client"

import { useState, useEffect, FormEvent } from 'react';
import Link from 'next/link';
import { BudgetCard } from '@/components/BudgetCard';
import { ChartExpenses } from '@/components/ChartExpenses';

interface Entry {
  id: number;
  date: string;
  description: string;
  debit: number;
  credit: number;
  category?: string;
}

interface Budget {
  id: number;
  month: string; // format YYYY‑MM
  allocated: number;
  spent: number;
}

export default function AccountingPage() {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [budget, setBudget] = useState<Budget | null>(null);
  const [form, setForm] = useState({
    date: '',
    description: '',
    type: 'debit',
    amount: '',
    category: ''
  });
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState('');

  // Fetch accounting entries
  const fetchEntries = async () => {
    const res = await fetch('/api/accounting');
    const data = await res.json();
    setEntries(data);
  };

  // Fetch budget for a given month (YYYY‑MM)
  const fetchBudget = async (month: string) => {
    const res = await fetch(`/api/budget?month=${month}`);
    const data = await res.json();
    if (data && data.length > 0) setBudget(data[0]);
  };

  // Initial load – entries + current month budget
  useEffect(() => {
    fetchEntries();
    const now = new Date();
    const month = now.toISOString().slice(0, 7);
    fetchBudget(month);
  }, []);

  // Update alert when budget changes
  useEffect(() => {
    if (budget && budget.spent > budget.allocated) {
      setAlert(
        `⚠️ Vous avez dépassé le budget de ${budget.month} de ${(budget.spent - budget.allocated).toLocaleString()} €.`
      );
    } else {
      setAlert('');
    }
  }, [budget]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const payload = {
      date: form.date,
      description: form.description,
      type: form.type,
      amount: parseFloat(form.amount),
      category: form.category || undefined
    };
    await fetch('/api/accounting', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    setForm({ date: '', description: '', type: 'debit', amount: '', category: '' });
    await fetchEntries();
    // Refresh budget after new entry (spent may have changed)
    const now = new Date();
    const month = now.toISOString().slice(0, 7);
    await fetchBudget(month);
    setLoading(false);
  };

  const exportCsv = async () => {
    const res = await fetch('/api/accounting?export=1');
    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'LexPremium_Lite_Ledger.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-5xl mx-auto p-6 bg-background text-foreground rounded-xl shadow-lg border border-border">
      <h1 className="text-3xl font-bold mb-6">Comptabilité du cabinet</h1>

      {/* Budget Card */}
      {budget && (
        <div className="mb-6 flex justify-center">
          <BudgetCard month={budget.month} allocated={budget.allocated} spent={budget.spent} />
        </div>
      )}

      {/* Over‑budget alert */}
      {alert && (
        <div className="mb-4 p-4 bg-rose-100 dark:bg-rose-900/30 border border-rose-300 dark:border-rose-800 rounded">
          {alert}
        </div>
      )}

      {/* Expenses chart */}
      <div className="mb-8">
        <ChartExpenses entries={entries} />
      </div>

      {/* Formulaire d’ajout */}
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <input
          type="date"
          name="date"
          value={form.date}
          onChange={handleChange}
          required
          className="border border-border bg-background rounded p-2"
        />
        <input
          type="text"
          name="description"
          placeholder="Description"
          value={form.description}
          onChange={handleChange}
          required
          className="border border-border bg-background rounded p-2"
        />
        <select name="type" value={form.type} onChange={handleChange} className="border border-border bg-background rounded p-2">
          <option value="debit">Débit</option>
          <option value="credit">Crédit</option>
        </select>
        <input
          type="number"
          name="amount"
          placeholder="Montant"
          step="0.01"
          value={form.amount}
          onChange={handleChange}
          required
          className="border border-border bg-background rounded p-2"
        />
        <input
          type="text"
          name="category"
          placeholder="Catégorie (optionnel)"
          value={form.category}
          onChange={handleChange}
          className="border border-border bg-background rounded p-2 md:col-span-2"
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-indigo-600 text-white py-2 px-4 rounded hover:bg-indigo-700 transition"
        >
          {loading ? 'Enregistrement...' : 'Ajouter l’écriture'}
        </button>
      </form>

      {/* Tableau des écritures */}
      <div className="overflow-x-auto mb-6">
        <table className="min-w-full border border-border">
          <thead className="bg-muted">
            <tr>
              <th className="px-4 py-2 text-left">Date</th>
              <th className="px-4 py-2 text-left">Description</th>
              <th className="px-4 py-2 text-left">Débit</th>
              <th className="px-4 py-2 text-left">Crédit</th>
              <th className="px-4 py-2 text-left">Catégorie</th>
            </tr>
          </thead>
          <tbody>
            {entries.map((e) => (
              <tr key={e.id} className="border-t border-border">
                <td className="px-4 py-2">{e.date}</td>
                <td className="px-4 py-2">{e.description}</td>
                <td className="px-4 py-2 text-right">{e.debit ? e.debit.toFixed(2) : ''}</td>
                <td className="px-4 py-2 text-right">{e.credit ? e.credit.toFixed(2) : ''}</td>
                <td className="px-4 py-2">{e.category || ''}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <button
        onClick={exportCsv}
        className="bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 transition"
      >
        Exporter le journal en CSV
      </button>
    </div>
  );
}

