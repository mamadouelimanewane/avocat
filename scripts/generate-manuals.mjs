
import React from 'react';
import ReactPDF, { Document, Page, Text, View, StyleSheet, Font, Image } from '@react-pdf/renderer';
import fs from 'fs';
import path from 'path';

const styles = StyleSheet.create({
    page: { padding: 50, fontFamily: 'Helvetica', backgroundColor: '#ffffff', flexDisplay: 'flex', flexDirection: 'column' },
    titlePage: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100%',
        padding: 40,
        backgroundColor: '#0f172a' // Dark Slate for premium feel
    },
    mainTitle: { fontSize: 36, color: '#ffffff', fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
    subtitle: { fontSize: 18, color: '#f59e0b', marginBottom: 40, textAlign: 'center' },
    header: { marginBottom: 30, borderBottomWidth: 1, borderBottomColor: '#f59e0b', paddingBottom: 10, flexDirection: 'row', justifyContent: 'space-between' },
    headerText: { fontSize: 10, color: '#94a3b8' },
    section: { marginBottom: 15, marginTop: 10 },
    h2: { fontSize: 22, marginBottom: 12, color: '#1e40af', fontWeight: 'bold', marginTop: 25 },
    h3: { fontSize: 16, marginBottom: 10, color: '#334155', fontWeight: 'bold', marginTop: 15 },
    p: { fontSize: 11, lineHeight: 1.7, color: '#334155', textAlign: 'justify', marginBottom: 10 },
    ul: { marginLeft: 15, marginBottom: 10 },
    li: { fontSize: 11, lineHeight: 1.6, color: '#334155', marginBottom: 5 },
    image: { width: '100%', height: 250, marginBottom: 20, borderRadius: 8, objectFit: 'cover' },
    marketingBadge: { padding: '4 8', backgroundColor: '#fef3c7', color: '#92400e', fontSize: 10, borderRadius: 4, marginBottom: 10, alignSelf: 'flex-start' },
    footer: { position: 'absolute', bottom: 30, left: 60, right: 60, textAlign: 'center', fontSize: 9, color: '#94a3b8', borderTopWidth: 1, borderTopColor: '#e2e8f0', paddingTop: 10 },
    pageNumber: { position: 'absolute', bottom: 30, right: 60, fontSize: 9, color: '#94a3b8' }
});

const ManualDocument = ({ title, content, isMarketing = false }) => {
    const lines = content.split('\n');
    const elements = [];

    lines.forEach((line) => {
        const trimmed = line.trim();
        if (trimmed.startsWith('# ')) {
            // Main title handled by title page
        } else if (trimmed.startsWith('## CHAPITRE')) {
            elements.push({ type: 'h2', text: trimmed, breakAfter: true });
        } else if (trimmed.startsWith('## ')) {
            elements.push({ type: 'h2', text: trimmed.replace('## ', '') });
        } else if (trimmed.startsWith('### ')) {
            elements.push({ type: 'h3', text: trimmed.replace('### ', '') });
        } else if (trimmed.startsWith('![[') && trimmed.endsWith(']]')) {
            elements.push({ type: 'image', src: trimmed.replace('![[', '').replace(']]', '') });
        } else if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
            elements.push({ type: 'li', text: trimmed.replace(/^[-*] /, '') });
        } else if (trimmed !== '') {
            elements.push({ type: 'p', text: trimmed });
        }
    });

    return (
        React.createElement(Document, null,
            // Page de garde Premium
            React.createElement(Page, { size: "A4", style: styles.page },
                React.createElement(View, { style: styles.titlePage },
                    React.createElement(Text, { style: styles.mainTitle }, title.toUpperCase()),
                    React.createElement(View, { style: { width: 100, height: 4, backgroundColor: '#f59e0b', marginBottom: 40 } }),
                    React.createElement(Text, { style: styles.subtitle }, isMarketing ? "L'Excellence Juridique Augmentée" : "Documentation Officielle LexPremium ERP"),
                    React.createElement(Text, { style: { fontSize: 14, color: '#ffffff', marginTop: 100 } }, "SCP d'Avocats Dia & Associés"),
                    React.createElement(Text, { style: { fontSize: 10, color: '#64748b', marginTop: 10 } }, "Version Industrielle - Manuel Complet")
                )
            ),
            // Contenu
            elements.length > 0 && !content.includes('CHAPITRE') ? (
                React.createElement(Page, { size: "A4", style: styles.page },
                    React.createElement(View, { style: styles.header },
                        React.createElement(Text, { style: styles.headerText }, title),
                        React.createElement(Text, { style: styles.headerText }, "LEXPREMIUM ERP")
                    ),
                    elements.map((el, i) => {
                        if (el.type === 'h2') return React.createElement(Text, { key: i, style: styles.h2 }, el.text);
                        if (el.type === 'h3') return React.createElement(Text, { key: i, style: styles.h3 }, el.text);
                        if (el.type === 'li') return React.createElement(View, { key: i, style: styles.ul },
                            React.createElement(Text, { style: styles.li }, `• ${el.text}`)
                        );
                        if (el.type === 'image') {
                            const imagePath = path.join(process.cwd(), 'scripts', 'images', el.src);
                            if (fs.existsSync(imagePath)) return React.createElement(Image, { key: i, src: imagePath, style: styles.image });
                        }
                        return React.createElement(Text, { key: i, style: styles.p }, el.text);
                    }),
                    React.createElement(Text, { style: styles.footer, fixed: true }, "LexPremium ERP - L'intelligence au service du Droit en Afrique"),
                    React.createElement(Text, { style: styles.pageNumber, render: ({ pageNumber, totalPages }) => `${pageNumber} / ${totalPages}`, fixed: true })
                )
            ) : (
                // Rendu par chapitres pour le manuel ultra
                elements.reduce((acc, el, i) => {
                    if (el.type === 'h2' && el.text.includes('CHAPITRE')) {
                        acc.push(React.createElement(Page, { key: `page-${i}`, size: "A4", style: styles.page },
                            React.createElement(View, { style: styles.header },
                                React.createElement(Text, { style: styles.headerText }, title),
                                React.createElement(Text, { style: styles.headerText }, "LEXPREMIUM ERP")
                            ),
                            React.createElement(Text, { style: styles.h2 }, el.text),
                            ...elements.slice(i + 1).filter((e, idx) => {
                                const globalIdx = i + 1 + idx;
                                const nextChapters = elements.slice(i + 1).filter(nx => nx.type === 'h2' && nx.text.includes('CHAPITRE'));
                                const nextChapterIdx = elements.indexOf(nextChapters[0]);
                                return globalIdx < (nextChapterIdx === -1 ? elements.length : nextChapterIdx);
                            }).map((subEl, subI) => {
                                if (subEl.type === 'h2') return React.createElement(Text, { key: `sub-${subI}`, style: styles.h2 }, subEl.text);
                                if (subEl.type === 'h3') return React.createElement(Text, { key: `sub-${subI}`, style: styles.h3 }, subEl.text);
                                if (subEl.type === 'li') return React.createElement(View, { key: `sub-${subI}`, style: styles.ul },
                                    React.createElement(Text, { style: styles.li }, `• ${subEl.text}`)
                                );
                                if (subEl.type === 'image') {
                                    const imagePath = path.join(process.cwd(), 'scripts', 'images', subEl.src);
                                    if (fs.existsSync(imagePath)) return React.createElement(Image, { key: `sub-${subI}`, src: imagePath, style: styles.image });
                                }
                                return React.createElement(Text, { key: `sub-${subI}`, style: styles.p }, subEl.text);
                            }),
                            React.createElement(Text, { style: styles.footer, fixed: true }, "LexPremium ERP - L'intelligence au service du Droit en Afrique"),
                            React.createElement(Text, { style: styles.pageNumber, render: ({ pageNumber, totalPages }) => `${pageNumber} / ${totalPages}`, fixed: true })
                        ));
                    }
                    return acc;
                }, [])
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

        const isMarketing = file.includes('marketing') || file.includes('presentation');
        const pdfName = file.replace('.md', '.pdf');
        const outputPath = path.join(outputDir, pdfName);

        await ReactPDF.renderToFile(
            React.createElement(ManualDocument, { title, content: mdContent, isMarketing }),
            outputPath
        );
        const stats = fs.statSync(outputPath);
        console.log(`✅ ${pdfName} généré (${stats.size} bytes)`);
    }
}

generate().catch(console.error);
