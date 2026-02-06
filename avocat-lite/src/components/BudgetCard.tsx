// src/components/BudgetCard.tsx
import React from 'react';

interface BudgetCardProps {
    month: string; // format YYYY‑MM
    allocated: number;
    spent: number;
}

export const BudgetCard: React.FC<BudgetCardProps> = ({ month, allocated, spent }) => {
    const remaining = allocated - spent;
    const percentUsed = allocated ? Math.round((spent / allocated) * 100) : 0;

    const getColor = () => {
        if (percentUsed < 60) return 'bg-emerald-500';
        if (percentUsed < 80) return 'bg-amber-500';
        return 'bg-rose-500';
    };

    return (
        <div className="bg-background border border-border rounded-2xl shadow-lg p-6 w-80">
            <h3 className="text-lg font-semibold mb-2">Budget {month}</h3>
            <p className="text-sm text-muted-foreground">Alloué : {allocated.toLocaleString()} €</p>
            <p className="text-sm text-muted-foreground">Dépensé : {spent.toLocaleString()} €</p>
            <p className="text-sm font-medium mt-2">Restant : {remaining.toLocaleString()} €</p>
            <div className="mt-4 w-full bg-muted rounded-full h-4">
                <div
                    className={`h-4 rounded-full ${getColor()}`}
                    style={{ width: `${percentUsed > 100 ? 100 : percentUsed}%` }}
                ></div>
            </div>
            <p className="text-xs text-muted-foreground mt-1 text-right">{percentUsed}% utilisé</p>
        </div>
    );

};
