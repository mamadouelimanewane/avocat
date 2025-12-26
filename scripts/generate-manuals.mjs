
import React from 'react';
import ReactPDF, { Document, Page, Text, View, StyleSheet, Font } from '@react-pdf/renderer';
import fs from 'fs';
import path from 'path';

const styles = StyleSheet.create({
    page: { padding: 60, fontFamily: 'Helvetica', backgroundColor: '#ffffff', flexDisplay: 'flex', flexDirection: 'column' },
    titlePage: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100%',
        borderWidth: 2,
        borderColor: '#f59e0b',
        padding: 40
    },
    mainTitle: { fontSize: 32, color: '#0f172a', fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
    subtitle: { fontSize: 16, color: '#64748b', marginBottom: 40, textAlign: 'center' },
    header: { marginBottom: 30, borderBottomWidth: 1, borderBottomColor: '#f59e0b', paddingBottom: 10, flexDirection: 'row', justifyContent: 'space-between' },
    headerText: { fontSize: 10, color: '#94a3b8' },
    section: { marginBottom: 15, marginTop: 10 },
    h2: { fontSize: 20, marginBottom: 12, color: '#1e40af', fontWeight: 'bold', marginTop: 20 },
    h3: { fontSize: 15, marginBottom: 10, color: '#334155', fontWeight: 'bold', marginTop: 15 },
    p: { fontSize: 11, lineHeight: 1.7, color: '#334155', textAlign: 'justify', marginBottom: 10 },
    ul: { marginLeft: 15, marginBottom: 10 },
    li: { fontSize: 11, lineHeight: 1.6, color: '#334155', marginBottom: 5 },
    footer: { position: 'absolute', bottom: 30, left: 60, right: 60, textAlign: 'center', fontSize: 9, color: '#94a3b8', borderTopWidth: 1, borderTopColor: '#e2e8f0', paddingTop: 10 },
    pageNumber: { position: 'absolute', bottom: 30, right: 60, fontSize: 9, color: '#94a3b8' }
});

const ManualDocument = ({ title, content }) => {
    const lines = content.split('\n');
    const elements = [];

    lines.forEach((line) => {
        const trimmed = line.trim();
        if (trimmed.startsWith('# ')) {
            // Title page handled
        } else if (trimmed.startsWith('## ')) {
            elements.push({ type: 'h2', text: trimmed.replace('## ', '') });
        } else if (trimmed.startsWith('### ')) {
            elements.push({ type: 'h3', text: trimmed.replace('### ', '') });
        } else if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
            elements.push({ type: 'li', text: trimmed.replace(/^[-*] /, '') });
        } else if (trimmed !== '') {
            elements.push({ type: 'p', text: trimmed });
        }
    });

    return (
        React.createElement(Document, null,
            // Page de garde
            React.createElement(Page, { size: "A4", style: styles.page },
                React.createElement(View, { style: styles.titlePage },
                    React.createElement(Text, { style: styles.mainTitle }, title),
                    React.createElement(Text, { style: styles.subtitle }, "Documentation Officielle LexPremium ERP"),
                    React.createElement(Text, { style: { fontSize: 12, color: '#94a3b8', marginTop: 100 } }, "Version 1.0 - Décembre 2025"),
                    React.createElement(Text, { style: { fontSize: 10, color: '#cbd5e1', marginTop: 10 } }, "SCP d'Avocats Dia & Associés")
                )
            ),
            // Contenu
            React.createElement(Page, { size: "A4", style: styles.page, break: true },
                React.createElement(View, { style: styles.header },
                    React.createElement(Text, { style: styles.headerText }, title),
                    React.createElement(Text, { style: styles.headerText }, "LexPremium ERP")
                ),
                elements.map((el, i) => {
                    if (el.type === 'h2') return React.createElement(Text, { key: i, style: styles.h2, break: elements[i - 1]?.type === 'p' && i > 10 }, el.text);
                    if (el.type === 'h3') return React.createElement(Text, { key: i, style: styles.h3 }, el.text);
                    if (el.type === 'li') return React.createElement(View, { key: i, style: styles.ul },
                        React.createElement(Text, { style: styles.li }, `• ${el.text}`)
                    );
                    return React.createElement(Text, { key: i, style: styles.p }, el.text);
                }),
                React.createElement(Text, {
                    style: styles.footer,
                    fixed: true
                }, "Document Confidentiel - Reproduction Interdite"),
                React.createElement(Text, {
                    style: styles.pageNumber,
                    render: ({ pageNumber, totalPages }) => `${pageNumber} / ${totalPages}`,
                    fixed: true
                })
            )
        )
    );
};

async function generate() {
    const docsDir = path.join(process.cwd(), 'docs', 'manuals');
    const outputDir = path.join(process.cwd(), 'public', 'manuals');

    if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

    const files = fs.readdirSync(docsDir).filter(f => f.endsWith('.md'));

    for (const file of files) {
        const fullPath = path.join(docsDir, file);
        const mdContent = fs.readFileSync(fullPath, 'utf-8');
        const titleLine = mdContent.split('\n').find(l => l.startsWith('# '));
        const title = titleLine ? titleLine.replace('# ', '') : file.replace('.md', '');

        const pdfName = file.replace('.md', '.pdf');
        const outputPath = path.join(outputDir, pdfName);

        await ReactPDF.renderToFile(
            React.createElement(ManualDocument, { title, content: mdContent }),
            outputPath
        );
        const stats = fs.statSync(outputPath);
        console.log(`✅ ${pdfName} généré (${stats.size} bytes)`);
    }
}

generate().catch(console.error);
