
"use client"

import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer'

const styles = StyleSheet.create({
    page: {
        flexDirection: 'column',
        backgroundColor: '#FFFFFF',
        padding: 30,
        fontFamily: 'Helvetica',
        fontSize: 10,
    },
    header: {
        marginBottom: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        paddingBottom: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    cabinetName: {
        fontSize: 14,
        fontWeight: 'bold',
        textTransform: 'uppercase',
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 20,
        textTransform: 'uppercase',
    },
    accountBlock: {
        marginBottom: 15,
        breakInside: 'avoid',
    },
    accountHeader: {
        fontSize: 11,
        fontWeight: 'bold',
        backgroundColor: '#f3f4f6',
        padding: 4,
        marginBottom: 5,
        borderLeftWidth: 3,
        borderLeftColor: '#4f46e5',
    },
    tableHeader: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: '#000',
        paddingBottom: 2,
        marginBottom: 2,
        fontSize: 9,
        fontWeight: 'bold',
        color: '#374151',
    },
    row: {
        flexDirection: 'row',
        paddingVertical: 2,
        borderBottomWidth: 0.5,
        borderBottomColor: '#e5e7eb',
    },
    colDate: { width: '15%' },
    colRef: { width: '15%' },
    colLib: { width: '40%' },
    colDebit: { width: '15%', textAlign: 'right' },
    colCredit: { width: '15%', textAlign: 'right' },

    totalRow: {
        flexDirection: 'row',
        paddingTop: 4,
        borderTopWidth: 1,
        borderTopColor: '#000',
        marginTop: 2,
        fontWeight: 'bold',
    },
    footer: {
        position: 'absolute',
        bottom: 30,
        left: 30,
        right: 30,
        textAlign: 'center',
        fontSize: 8,
        color: 'grey',
    }
});

export const GrandLivrePDF = ({ data, settings }: { data: any[], settings?: any }) => (
    <Document>
        <Page size="A4" style={styles.page}>
            <View style={styles.header}>
                <View>
                    <Text style={styles.cabinetName}>{settings?.name || "Cabinet d'Avocats"}</Text>
                    <Text>Grand Livre Général</Text>
                </View>
                <Text>Date: {new Date().toLocaleDateString('fr-FR')}</Text>
            </View>

            <Text style={styles.title}>Grand Livre des Comptes</Text>

            {data.map((group, i) => (
                <View key={i} style={styles.accountBlock}>
                    <Text style={styles.accountHeader}>
                        Compte : {group.account.code} - {group.account.name} | Solde : {group.finalBalance.toLocaleString('fr-FR')} F
                    </Text>

                    {/* Table Header */}
                    <View style={styles.tableHeader}>
                        <Text style={styles.colDate}>Date</Text>
                        <Text style={styles.colRef}>Réf</Text>
                        <Text style={styles.colLib}>Libellé</Text>
                        <Text style={styles.colDebit}>Débit</Text>
                        <Text style={styles.colCredit}>Crédit</Text>
                    </View>

                    {/* Rows */}
                    {group.lines.map((line: any, idx: number) => (
                        <View key={idx} style={styles.row}>
                            <Text style={styles.colDate}>{new Date(line.date).toLocaleDateString('fr-FR')}</Text>
                            <Text style={styles.colRef}>{line.ref}</Text>
                            <Text style={styles.colLib}>{line.libelle}</Text>
                            <Text style={styles.colDebit}>{line.debit > 0 ? line.debit.toLocaleString('fr-FR') : '-'}</Text>
                            <Text style={styles.colCredit}>{line.credit > 0 ? line.credit.toLocaleString('fr-FR') : '-'}</Text>
                        </View>
                    ))}

                    {/* Subtotal */}
                    <View style={styles.totalRow}>
                        <Text style={[styles.colDate, { width: '70%', textAlign: 'right', paddingRight: 10 }]}>Totaux Mouvements :</Text>
                        <Text style={styles.colDebit}>{group.totalDebit.toLocaleString('fr-FR')}</Text>
                        <Text style={styles.colCredit}>{group.totalCredit.toLocaleString('fr-FR')}</Text>
                    </View>
                </View>
            ))}

            <Text style={styles.footer} render={({ pageNumber, totalPages }) => (
                `Page ${pageNumber} / ${totalPages}`
            )} fixed />
        </Page>
    </Document>
)
