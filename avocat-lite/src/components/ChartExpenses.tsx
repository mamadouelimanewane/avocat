"use client"

import React from 'react';

import { Bar } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface Entry {
    id: number;
    date: string;
    description: string;
    debit: number;
    credit: number;
    category?: string;
}

interface Props {
    entries: Entry[];
}

export const ChartExpenses: React.FC<Props> = ({ entries }) => {
    // Aggregate debit amounts by category
    const dataMap: Record<string, number> = {};
    entries.forEach((e) => {
        if (e.debit && e.category) {
            dataMap[e.category] = (dataMap[e.category] ?? 0) + e.debit;
        }
    });

    const labels = Object.keys(dataMap);
    const dataValues = Object.values(dataMap);

    const data = {
        labels,
        datasets: [
            {
                label: 'Dépenses (€)',
                data: dataValues,
                backgroundColor: 'rgba(234,179,8,0.6)', // Gold semi‑transparent
                borderColor: 'rgba(234,179,8,1)',
                borderWidth: 1,
            },
        ],
    };

    const options = {
        responsive: true,
        plugins: {
            legend: { position: 'top' as const },
            title: {
                display: true,
                text: 'Répartition des dépenses par catégorie',
            },
        },
    };

    return <Bar data={data} options={options} />;
};
