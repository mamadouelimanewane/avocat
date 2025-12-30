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
    accountHeader: {
        backgroundColor: '#f3f4f6',
        padding: 5,
        marginVertical: 5,
        fontWeight: 'bold',
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderBottom: 1,
        borderColor: '#ccc',
    },
    tableHeader: {
        flexDirection: 'row',
        borderBottom: 1,
        borderColor: '#000',
        paddingBottom: 3,
        marginBottom: 3,
        fontWeight: 'bold',
    },
    tableRow: {
        flexDirection: 'row',
        borderBottom: 1,
        borderColor: '#eee',
        paddingVertical: 3,
    },
    colDate: { width: '15%' },
    colJournal: { width: '10%' },
    colReference: { width: '45%' },
    colDebit: { width: '15%', textAlign: 'right' },
    colCredit: { width: '15%', textAlign: 'right' },
    totalRow: {
        flexDirection: 'row',
        marginTop: 5,
        paddingTop: 5,
        borderTop: 1,
        borderColor: '#000',
        fontWeight: 'bold',
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

interface LedgerPDFProps {
    data: any // Grouped data
    settings?: any
}

export const LedgerPDF = ({ data, settings }: LedgerPDFProps) => {
    const sortedAccountIds = Object.keys(data).sort((a, b) => data[a].account.code.localeCompare(data[b].account.code))

    return (
        <Document>
            <Page size="A4" style={styles.page}>
                <View style={styles.header}>
                    <View style={styles.cabinetInfo}>
                        <Text style={styles.cabinetName}>{settings?.name || "Cabinet Lex Premium"}</Text>
                        <Text>{settings?.email || "contact@lexpremium.sn"}</Text>
                    </View>
                    <View style={styles.metaInfo}>
                        <Text>Edité le: {format(new Date(), 'dd/MM/yyyy HH:mm')}</Text>
                        <Text>Exercice 2025</Text>
                    </View>
                </View>

                <Text style={styles.reportTitle}>Grand Livre des Comptes</Text>

                {sortedAccountIds.map(accId => {
                    const group = data[accId]
                    return (
                        <View key={accId} wrap={false} style={{ marginBottom: 20 }}>
                            <View style={styles.accountHeader}>
                                <Text>{group.account.code} - {group.account.name}</Text>
                                <Text style={{ fontSize: 8, fontWeight: 'normal' }}>
                                    Solde: {group.account.balance.toLocaleString('fr-FR')} F
                                </Text>
                            </View>

                            <View style={styles.tableHeader}>
                                <Text style={styles.colDate}>Date</Text>
                                <Text style={styles.colJournal}>Journal</Text>
                                <Text style={styles.colReference}>Libellé</Text>
                                <Text style={styles.colDebit}>Débit</Text>
                                <Text style={styles.colCredit}>Crédit</Text>
                            </View>

                            {group.entries.map((e: any, idx: number) => (
                                <View key={idx} style={styles.tableRow}>
                                    <Text style={styles.colDate}>{format(new Date(e.transaction.date), 'dd/MM/yyyy')}</Text>
                                    <Text style={styles.colJournal}>{e.transaction.journal?.code || '-'}</Text>
                                    <Text style={styles.colReference}>{e.transaction.description}</Text>
                                    <Text style={styles.colDebit}>{e.debit > 0 ? e.debit.toLocaleString('fr-FR') : ''}</Text>
                                    <Text style={styles.colCredit}>{e.credit > 0 ? e.credit.toLocaleString('fr-FR') : ''}</Text>
                                </View>
                            ))}

                            <View style={styles.totalRow}>
                                <Text style={{ width: '70%', textAlign: 'right', paddingRight: 10 }}>TOTAL PÉRIODE</Text>
                                <Text style={styles.colDebit}>{group.sumDebit.toLocaleString('fr-FR')}</Text>
                                <Text style={styles.colCredit}>{group.sumCredit.toLocaleString('fr-FR')}</Text>
                            </View>
                        </View>
                    )
                })}

                <Text style={styles.footer} render={({ pageNumber, totalPages }) => `Page ${pageNumber} / ${totalPages}`} fixed />
            </Page>
        </Document>
    )
}
