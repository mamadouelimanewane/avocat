"use client"

import { Document, Page, Text, View, StyleSheet, Font } from '@react-pdf/renderer'

// Register fonts if needed (optional, using standard fonts for now)
// Font.register({ family: 'Inter', src: '...' });

const styles = StyleSheet.create({
    page: {
        flexDirection: 'column',
        backgroundColor: '#FFFFFF',
        padding: 40,
        fontFamily: 'Helvetica',
    },
    header: {
        marginBottom: 40,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    logo: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#0f172a', // Slate 900
    },
    logoAccent: {
        color: '#f59e0b', // Amber 500
    },
    cabinetInfo: {
        fontSize: 10,
        color: '#64748b',
        textAlign: 'right',
    },
    title: {
        fontSize: 20,
        marginBottom: 20,
        textTransform: 'uppercase',
        letterSpacing: 2,
        color: '#0f172a',
    },
    clientSection: {
        marginBottom: 30,
        padding: 15,
        backgroundColor: '#f8fafc',
        borderRadius: 4,
    },
    label: {
        fontSize: 10,
        color: '#94a3b8',
        marginBottom: 4,
        textTransform: 'uppercase',
    },
    value: {
        fontSize: 12,
        color: '#334155',
    },
    table: {
        display: "flex",
        width: "auto",
        borderStyle: "solid",
        borderWidth: 1,
        borderRightWidth: 0,
        borderBottomWidth: 0,
        borderColor: '#e2e8f0',
        marginBottom: 20,
    },
    tableRow: {
        margin: "auto",
        flexDirection: "row"
    },
    tableCol: {
        width: "25%",
        borderStyle: "solid",
        borderWidth: 1,
        borderLeftWidth: 0,
        borderTopWidth: 0,
        borderColor: '#e2e8f0',
    },
    tableColDesc: {
        width: "50%",
        borderStyle: "solid",
        borderWidth: 1,
        borderLeftWidth: 0,
        borderTopWidth: 0,
        borderColor: '#e2e8f0',
    },
    tableCellHeader: {
        margin: 5,
        fontSize: 10,
        fontWeight: 'bold',
        color: '#475569',
    },
    tableCell: {
        margin: 5,
        fontSize: 10,
        color: '#334155',
    },
    totals: {
        alignSelf: 'flex-end',
        width: '40%',
    },
    totalRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 5,
    },
    totalLabel: {
        fontSize: 10,
        color: '#64748b',
    },
    totalValue: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#0f172a',
    },
    footer: {
        position: 'absolute',
        bottom: 30,
        left: 40,
        right: 40,
        textAlign: 'center',
        fontSize: 8,
        color: '#94a3b8',
        borderTopWidth: 1,
        borderTopColor: '#e2e8f0',
        paddingTop: 10,
    }
});

// Define types locally for simplicity or import them
type InvoiceData = {
    number: string
    issueDate: Date
    client: { name: string, address?: string }
    items: { description: string, quantity: number, unitPrice: number, totalPrice: number }[]
    amountHT: number
    amountTVA: number
    amountTTC: number
}

export const InvoicePDF = ({ data, settings }: { data: InvoiceData, settings?: any }) => (
    <Document>
        <Page size="A4" style={styles.page}>

            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.logo}>LEX<Text style={styles.logoAccent}>PREMIUM</Text></Text>
                <View style={styles.cabinetInfo}>
                    <Text>{settings?.name || "Cabinet d'Avocats Associés"}</Text>
                    {settings?.legalForm && settings.legalForm !== 'INDIVIDUEL' && (
                        <Text>{settings.legalForm} au capital de {settings.capital || 'N/A'}</Text>
                    )}
                    {settings?.tradeRegister && <Text>RCCM: {settings.tradeRegister}</Text>}
                    {settings?.ninea && <Text>NINEA: {settings.ninea}</Text>}
                    <Text>{settings?.address || "123 Avenue de la République, Dakar"}</Text>
                    <Text>{settings?.email || "contact@lexpremium.sn"}</Text>
                </View>
            </View>

            <Text style={styles.title}>Facture N° {data.number}</Text>

            {/* Client Info */}
            <View style={styles.clientSection}>
                <Text style={styles.label}>Facturé à :</Text>
                <Text style={styles.value}>{data.client.name}</Text>
                {/* <Text style={styles.value}>{data.client.address || 'Adresse non renseignée'}</Text> */}
                <Text style={[styles.label, { marginTop: 10 }]}>Date :</Text>
                <Text style={styles.value}>{data.issueDate.toLocaleDateString('fr-FR')}</Text>
            </View>

            {/* Table */}
            <View style={styles.table}>
                <View style={[styles.tableRow, { backgroundColor: '#f1f5f9' }]}>
                    <View style={styles.tableColDesc}>
                        <Text style={styles.tableCellHeader}>Description</Text>
                    </View>
                    <View style={styles.tableCol}>
                        <Text style={styles.tableCellHeader}>Qte</Text>
                    </View>
                    <View style={styles.tableCol}>
                        <Text style={styles.tableCellHeader}>Prix Unitaire</Text>
                    </View>
                    <View style={styles.tableCol}>
                        <Text style={styles.tableCellHeader}>Total</Text>
                    </View>
                </View>

                {data.items.map((item, i) => (
                    <View style={styles.tableRow} key={i}>
                        <View style={styles.tableColDesc}>
                            <Text style={styles.tableCell}>{item.description}</Text>
                        </View>
                        <View style={styles.tableCol}>
                            <Text style={styles.tableCell}>{item.quantity}</Text>
                        </View>
                        <View style={styles.tableCol}>
                            <Text style={styles.tableCell}>{item.unitPrice.toLocaleString('fr-FR')} F</Text>
                        </View>
                        <View style={styles.tableCol}>
                            <Text style={styles.tableCell}>{item.totalPrice.toLocaleString('fr-FR')} F</Text>
                        </View>
                    </View>
                ))}
            </View>

            {/* Totals */}
            <View style={styles.totals}>
                <View style={styles.totalRow}>
                    <Text style={styles.totalLabel}>Total HT :</Text>
                    <Text style={styles.value}>{data.amountHT.toLocaleString('fr-FR')} FCFA</Text>
                </View>
                <View style={styles.totalRow}>
                    <Text style={styles.totalLabel}>TVA (18%) :</Text>
                    <Text style={styles.value}>{data.amountTVA.toLocaleString('fr-FR')} FCFA</Text>
                </View>
                <View style={[styles.totalRow, { marginTop: 5, borderTopWidth: 1, borderColor: '#000', paddingTop: 5 }]}>
                    <Text style={[styles.totalLabel, { color: '#000', fontWeight: 'bold' }]}>Net à Payer :</Text>
                    <Text style={[styles.totalValue, { fontSize: 14 }]}>{data.amountTTC.toLocaleString('fr-FR')} FCFA</Text>
                </View>
            </View>

            <View style={styles.footer}>
                <Text>Arrêté la présente facture à la somme de : {data.amountTTC.toLocaleString('fr-FR')} Francs CFA</Text>
                <Text>Merci de votre confiance.</Text>
            </View>

        </Page>
    </Document>
)
