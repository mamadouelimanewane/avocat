
import { Document, Page, Text, View, StyleSheet, Font, Image } from '@react-pdf/renderer';

// Register fonts (using standard fonts for now to avoid loading issues)
// In a real app, you'd register 'Times-Roman' or similar for a legal look

const styles = StyleSheet.create({
    page: {
        padding: 40,
        backgroundColor: '#ffffff',
        fontFamily: 'Helvetica',
    },
    header: {
        marginBottom: 20,
        borderBottom: 2,
        borderBottomColor: '#b45309', // Amber-700
        paddingBottom: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    headerText: {
        fontSize: 10,
        color: '#64748b', // Slate-500
        textTransform: 'uppercase',
        letterSpacing: 2,
    },
    brand: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#0f172a', // Slate-900
    },
    title: {
        fontSize: 24,
        marginBottom: 10,
        color: '#0f172a',
        fontWeight: 'extrabold',
        lineHeight: 1.2,
    },
    meta: {
        flexDirection: 'row',
        gap: 10,
        marginBottom: 30,
        fontSize: 10,
        color: '#64748b',
    },
    badge: {
        backgroundColor: '#fef3c7', // Amber-100
        color: '#b45309', // Amber-700
        padding: '4 8',
        borderRadius: 4,
        fontWeight: 'bold',
    },
    content: {
        fontSize: 12,
        lineHeight: 1.6,
        color: '#334155', // Slate-700
        textAlign: 'justify',
        marginBottom: 20,
    },
    signature: {
        marginTop: 50,
        borderTop: 1,
        borderTopColor: '#e2e8f0',
        paddingTop: 20,
        flexDirection: 'row',
        justifyContent: 'flex-end',
    },
    stamp: {
        width: 60,
        height: 60,
        borderRadius: 30,
        border: 2,
        borderColor: '#b45309',
        justifyContent: 'center',
        alignItems: 'center',
    },
    stampText: {
        fontSize: 6,
        color: '#b45309',
        textAlign: 'center',
        fontWeight: 'bold',
    },
    footer: {
        position: 'absolute',
        bottom: 30,
        left: 40,
        right: 40,
        fontSize: 8,
        color: '#94a3b8',
        textAlign: 'center',
        borderTop: 1,
        borderTopColor: '#f1f5f9',
        paddingTop: 10,
    }
});

interface LegalDocProps {
    title: string;
    source: string;
    date: string;
    type: string;
    content: string;
}

export const LegalPDFDocument = ({ title, source, date, type, content }: LegalDocProps) => (
    <Document>
        <Page size="A4" style={styles.page}>

            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.brand}>LEXPREMIUM ELITE</Text>
                <Text style={styles.headerText}>VEILLE JURIDIQUE CERTIFIÉE</Text>
            </View>

            {/* Meta */}
            <View style={styles.meta}>
                <View style={styles.badge}>
                    <Text>{type}</Text>
                </View>
                <Text>Source: {source}</Text>
                <Text>Date: {date}</Text>
            </View>

            {/* Title */}
            <Text style={styles.title}>{title}</Text>

            {/* Content */}
            <View>
                <Text style={styles.content}>
                    {content || "Contenu extrait automatiquement par le crawler LexPremium. Ce document a été normalisé pour usage professionnel..."}
                </Text>
                <Text style={styles.content}>
                    [TEXTE INTÉGRAL SIMULÉ POUR LA DÉMONSTRATION]
                    Article 1 : La présente loi s'applique à l'ensemble du territoire national et régit les relations commerciales...
                    {"\n\n"}
                    Considérant l'urgence et la nécessité de l'harmonisation du droit des affaires...
                    {"\n\n"}
                    Par ces motifs, la Cour :
                    1. Déclare le pourvoi recevable ;
                    2. Au fond, casse et annule l'arrêt attaqué ;
                    3. Renvoie la cause et les parties devant la juridiction compétente.
                </Text>
            </View>

            {/* Signature/Stamp */}
            <View style={styles.signature}>
                <View style={styles.stamp}>
                    <Text style={styles.stampText}>LEXPREMIUM</Text>
                    <Text style={styles.stampText}>CERTIFIÉ</Text>
                    <Text style={styles.stampText}>CONFORME</Text>
                </View>
            </View>

            {/* Footer */}
            <Text style={styles.footer}>
                Document généré automatiquement par LexPremium Crawler • {new Date().toLocaleDateString()} • Usage interne uniquement
            </Text>
        </Page>
    </Document>
);
