/**
 * Module OCR Réel - Extraction de texte depuis documents
 * Support: PDF, Images (JPG, PNG), DOCX
 */

import { createWorker } from 'tesseract.js'

export interface OCRResult {
    success: boolean
    text: string
    confidence: number
    language: string
    pages?: number
    error?: string
}

/**
 * Extrait le texte d'une image (JPG, PNG) via Tesseract.js
 */
export async function extractTextFromImage(
    imageFile: File | Blob | Buffer,
    language: string = 'fra+eng' // Français + Anglais
): Promise<OCRResult> {
    try {
        console.log('🔍 OCR: Démarrage extraction image...')

        const worker = await createWorker(language, 1, {
            logger: (m) => {
                if (m.status === 'recognizing text') {
                    console.log(`OCR Progress: ${Math.round(m.progress * 100)}%`)
                }
            }
        })

        const { data } = await worker.recognize(imageFile)
        await worker.terminate()

        console.log(`✅ OCR terminé: ${data.text.length} caractères, confiance ${data.confidence}%`)

        return {
            success: true,
            text: data.text,
            confidence: data.confidence,
            language,
            pages: 1
        }
    } catch (error) {
        console.error('❌ Erreur OCR image:', error)
        return {
            success: false,
            text: '',
            confidence: 0,
            language,
            error: error instanceof Error ? error.message : 'Erreur inconnue'
        }
    }
}

/**
 * Extrait le texte d'un PDF (navigateur uniquement)
 */
/**
 * Extrait le texte d'un PDF (Compatible Serveur)
 */
export async function extractTextFromPDF(pdfFile: File | Buffer): Promise<OCRResult> {
    try {
        console.log('📄 PDF: Démarrage extraction (Serveur)...')

        let buffer: Buffer
        if (pdfFile instanceof Buffer) {
            buffer = pdfFile
        } else {
            const arrayBuffer = await pdfFile.arrayBuffer()
            buffer = Buffer.from(arrayBuffer)
        }

        // @ts-ignore
        const pdfParse = (await import('pdf-parse')).default

        const data = await pdfParse(buffer)
        const fullText = data.text

        console.log(`✅ PDF extrait: ${data.numpages} pages, ${fullText.length} caractères`)

        // Check if text is too short (likely scanned image-only PDF)
        if (fullText.trim().length < 50) {
            console.warn("⚠️ PDF semble être une image scannée (peu de texte extrait).")
            return {
                success: false,
                text: "⚠️ Ce document semble être un scan (image). L'OCR simulé ne peut pas lire les images dans les PDF pour l'instant. Veuillez convertir en JPG/PNG pour utiliser Tesseract.",
                confidence: 10,
                language: 'fra',
                pages: data.numpages,
                error: "SCANNED_PDF_DETECTED"
            }
        }

        return {
            success: true,
            text: fullText.trim(),
            confidence: 100, // Text layer is exact
            language: 'fra',
            pages: data.numpages
        }
    } catch (error) {
        console.error('❌ Erreur extraction PDF:', error)
        return {
            success: false,
            text: '',
            confidence: 0,
            language: 'fra',
            error: error instanceof Error ? error.message : 'Erreur inconnue'
        }
    }
}

/**
 * Extrait le texte d'un fichier DOCX
 */
export async function extractTextFromDOCX(docxFile: File): Promise<OCRResult> {
    try {
        console.log('📝 DOCX: Démarrage extraction...')

        const mammoth = await import('mammoth')
        const arrayBuffer = await docxFile.arrayBuffer()

        const result = await mammoth.extractRawText({ arrayBuffer })

        console.log(`✅ DOCX extrait: ${result.value.length} caractères`)

        return {
            success: true,
            text: result.value,
            confidence: 100,
            language: 'fra',
            pages: 1
        }
    } catch (error) {
        console.error('❌ Erreur extraction DOCX:', error)
        return {
            success: false,
            text: '',
            confidence: 0,
            language: 'fra',
            error: error instanceof Error ? error.message : 'Erreur inconnue'
        }
    }
}

/**
 * Auto-détection et extraction selon type de fichier
 */
export async function extractTextFromFile(file: File): Promise<OCRResult> {
    const fileType = file.type.toLowerCase()
    const fileName = file.name.toLowerCase()

    console.log(`🔍 Extraction fichier: ${file.name} (${fileType})`)

    // PDF
    if (fileType === 'application/pdf' || fileName.endsWith('.pdf')) {
        return await extractTextFromPDF(file)
    }

    // DOCX
    if (
        fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
        fileName.endsWith('.docx')
    ) {
        return await extractTextFromDOCX(file)
    }

    // Images (JPG, PNG, JPEG, etc.)
    if (fileType.startsWith('image/')) {
        return await extractTextFromImage(file)
    }

    // TXT
    if (fileType === 'text/plain' || fileName.endsWith('.txt')) {
        const text = await file.text()
        return {
            success: true,
            text,
            confidence: 100,
            language: 'fra',
            pages: 1
        }
    }

    // Type non supporté
    return {
        success: false,
        text: '',
        confidence: 0,
        language: 'fra',
        error: `Type de fichier non supporté: ${fileType}`
    }
}

/**
 * Amélioration texte OCR (correction orthographique basique)
 */
export function improveOCRText(text: string): string {
    let improved = text

    // Corrections communes OCR français
    const corrections: Record<string, string> = {
        'l\'an': 'l\'an',
        'assigne': 'assigné',
        'SociBtB': 'Société',
        'r6glement': 'règlement',
        'proc6dure': 'procédure',
        'Tr ibunal': 'Tribunal',
        'Senegal': 'Sénégal',
        'dommages-lntBrBts': 'dommages-intérêts'
    }

    for (const [wrong, correct] of Object.entries(corrections)) {
        improved = improved.replace(new RegExp(wrong, 'gi'), correct)
    }

    // Nettoyer espaces multiples
    improved = improved.replace(/\s+/g, ' ')

    // Capitaliser après points
    improved = improved.replace(/\.\s+([a-z])/g, (match, letter) => '. ' + letter.toUpperCase())

    return improved.trim()
}
