"use client"

import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer'
import { format } from "date-fns"

const styles = StyleSheet.create({
    page: {
        padding: 40,
        fontFamily: 'Helvetica',
        fontSize: 10,
    },
    header: {
        marginBottom: 20,
        borderBottom: 2,
        borderColor: '#000',
        paddingBottom: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    cabinetInfo: {
        flexDirection: 'column',
    },
    cabinetName: {
        fontSize: 14,
        fontWeight: 'bold',
        textTransform: 'uppercase',
    },
    reportTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
        marginVertical: 10,
        textTransform: 'uppercase',
    },
    metaInfo: {
        fontSize: 9,
        color: '#666',
        textAlign: 'right',
    },
    journalName: {
        fontSize: 12,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 10,
        color: '#444',
    },
    tableHeader: {
        flexDirection: 'row',
        borderBottom: 1,
        borderColor: '#000',
        paddingBottom: 3,
        marginBottom: 3,
        fontWeight: 'bold',
        backgroundColor: '#f3f4f6',
    },
    tableRow: {
        flexDirection: 'row',
        borderBottom: 0.5,
        borderColor: '#ccc',
        paddingVertical: 3,
    },
    colDate: { width: '12%' },
    colCompte: { width: '12%' },
    colLibelle: { width: '46%' },
    colDebit: { width: '15%', textAlign: 'right' },
    colCredit: { width: '15%', textAlign: 'right' },
    transactionHeader: {
        backgroundColor: '#fafafa',
        padding: 4,
        marginTop: 5,
        fontSize: 9,
        fontWeight: 'bold',
        borderLeft: 3,
        borderColor: '#6366f1',
    },
    footer: {
        position: 'absolute',
        bottom: 30,
        left: 40,
        right: 40,
        textAlign: 'center',
        fontSize: 8,
        color: '#999',
    }
});

interface JournalPDFProps {
    journalName: string
    journalCode: string
    transactions: any[]
    settings?: any
}

export const JournalPDF = ({ journalName, journalCode, transactions, settings }: JournalPDFProps) => {
    return (
        <Document>
            <Page size="A4" style={styles.page}>
                <View style={styles.header}>
                    <View style={styles.cabinetInfo}>
                        <Text style={styles.cabinetName}>{settings?.name || "Cabinet Lex Premium"}</Text>
                        <Text>{settings?.email || "contact@lexpremium.sn"}</Text>
                    </View>
                    <View style={styles.metaInfo}>
                        <Text>Date d'édition: {format(new Date(), 'dd/MM/yyyy HH:mm')}</Text>
                        <Text>Journal: {journalCode}</Text>
                    </View>
                </View>

                <Text style={styles.reportTitle}>JOURNAL DES ÉCRITURES</Text>
                <Text style={styles.journalName}>{journalName} ({journalCode})</Text>

                <View style={styles.tableHeader}>
                    <Text style={styles.colDate}>Date</Text>
                    <Text style={styles.colCompte}>Compte</Text>
                    <Text style={styles.colLibelle}>Libellé / Imputation</Text>
                    <Text style={styles.colDebit}>Débit</Text>
                    <Text style={styles.colCredit}>Crédit</Text>
                </View>

                {transactions.map((tx, txIdx) => (
                    <View key={txIdx} wrap={false}>
                        <View style={styles.transactionHeader}>
                            <Text>{format(new Date(tx.date), 'dd/MM/yyyy')} - {tx.description}</Text>
                        </View>
                        {tx.lines.map((line: any, lineIdx: number) => (
                            <View key={lineIdx} style={styles.tableRow}>
                                <Text style={styles.colDate}></Text>
                                <Text style={styles.colCompte}>{line.account.code}</Text>
                                <Text style={styles.colLibelle}>{line.account.name}</Text>
                                <Text style={styles.colDebit}>{line.debit > 0 ? line.debit.toLocaleString('fr-FR') : ''}</Text>
                                <Text style={styles.colCredit}>{line.credit > 0 ? line.credit.toLocaleString('fr-FR') : ''}</Text>
                            </View>
                        ))}
                    </View>
                ))}

                <Text style={styles.footer} render={({ pageNumber, totalPages }) => `Page ${pageNumber} / ${totalPages}`} fixed />
            </Page>
        </Document>
    )
}
