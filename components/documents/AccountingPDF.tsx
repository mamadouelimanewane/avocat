
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
        borderBottomColor: '#aaa',
        paddingBottom: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    cabinetName: {
        fontSize: 16,
        fontWeight: 'bold',
        textTransform: 'uppercase',
    },
    docTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 5,
        textTransform: 'uppercase',
        backgroundColor: '#f0f0f0',
        padding: 5,
    },
    period: {
        fontSize: 10,
        textAlign: 'center',
        marginBottom: 15,
        color: '#555',
    },
    table: {
        display: "flex",
        width: "auto",
        borderStyle: "solid",
        borderWidth: 1,
        borderRightWidth: 0,
        borderBottomWidth: 0,
        borderColor: '#bfbfbf',
    },
    tableRow: {
        margin: "auto",
        flexDirection: "row"
    },
    tableColHeader: {
        borderStyle: "solid",
        borderWidth: 1,
        borderLeftWidth: 0,
        borderTopWidth: 0,
        borderColor: '#bfbfbf',
        backgroundColor: '#f3f4f6',
        padding: 4,
        fontWeight: 'bold',
    },
    tableCol: {
        borderStyle: "solid",
        borderWidth: 1,
        borderLeftWidth: 0,
        borderTopWidth: 0,
        borderColor: '#bfbfbf',
        padding: 3,
    },
    cellText: {
        fontSize: 8,
    },
    footer: {
        position: 'absolute',
        bottom: 30,
        left: 30,
        right: 30,
        textAlign: 'center',
        fontSize: 8,
        color: 'grey',
        borderTopWidth: 1,
        borderTopColor: '#eee',
        paddingTop: 10,
    }
});

interface ColumnDef {
    header: string
    accessorKey: string
    width?: string
    align?: 'left' | 'right' | 'center'
    format?: (value: any) => string
}

interface AccountingPDFProps {
    title: string
    subtitle?: string
    columns: ColumnDef[]
    data: any[]
    settings?: any
}

export const AccountingPDF = ({ title, subtitle, columns, data, settings }: AccountingPDFProps) => (
    <Document>
        <Page size="A4" orientation="landscape" style={styles.page}>
            <View style={styles.header}>
                <View>
                    <Text style={styles.cabinetName}>{settings?.name || "Cabinet d'Avocats"}</Text>
                    <Text>{settings?.email || "contact@cabinet.sn"}</Text>
                </View>
                <View>
                    <Text>Date d'impression: {new Date().toLocaleDateString('fr-FR')}</Text>
                </View>
            </View>

            <Text style={styles.docTitle}>{title}</Text>
            {subtitle && <Text style={styles.period}>{subtitle}</Text>}

            <View style={styles.table}>
                {/* Header Row */}
                <View style={styles.tableRow}>
                    {columns.map((col, i) => (
                        <View key={i} style={[styles.tableColHeader, { width: col.width || `${100 / columns.length}%` }]}>
                            <Text style={[styles.cellText, { fontWeight: 'bold', textAlign: col.align || 'left' }]}>{col.header}</Text>
                        </View>
                    ))}
                </View>

                {/* Data Rows */}
                {data.map((row, rowIndex) => (
                    <View key={rowIndex} style={styles.tableRow}>
                        {columns.map((col, colIndex) => (
                            <View key={colIndex} style={[styles.tableCol, { width: col.width || `${100 / columns.length}%` }]}>
                                <Text style={[styles.cellText, { textAlign: col.align || 'left' }]}>
                                    {col.format ? col.format(row[col.accessorKey]) : row[col.accessorKey]}
                                </Text>
                            </View>
                        ))}
                    </View>
                ))}
            </View>

            <Text style={styles.footer} render={({ pageNumber, totalPages }) => (
                `Page ${pageNumber} / ${totalPages}`
            )} fixed />
        </Page>
    </Document>
)
