/**
 * LexAI Voice Service
 * Handles audio recording, processing and transcription via OpenAI Whisper
 */

export interface TranscriptionResponse {
    text: string;
    error?: string;
}

/**
 * Utility to check browser support for Web Speech API (real-time feedback)
 */
export function isSpeechRecognitionSupported(): boolean {
    if (typeof window === 'undefined') return false;
    return !!(window.SpeechRecognition || window.webkitSpeechRecognition);
}

/**
 * Handle audio recording and send to OpenAI Whisper for high-precision transcription
 */
export async function transcribeAudio(audioBlob: Blob): Promise<TranscriptionResponse> {
    try {
        const formData = new FormData();
        formData.append('file', audioBlob, 'recording.webm');
        formData.append('model', 'whisper-1');
        formData.append('language', 'fr'); // Default to French for LexPremium

        const response = await fetch('/api/voice/transcribe', {
            method: 'POST',
            body: formData,
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Transcription failed');
        }

        return await response.json();
    } catch (error: any) {
        console.error('Transcription error:', error);
        return { text: '', error: error.message };
    }
}

/**
 * Process transcribed text with LexAI to detect commands or intent
 * e.g. "Ouvre le dossier TechCorp" -> { action: 'NAVIGATE', params: { dossier: 'TechCorp' } }
 */
export async function processVoiceCommand(text: string) {
    try {
        const response = await fetch('/api/voice/process-command', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text }),
        });

        return await response.json();
    } catch (error) {
        console.error('Command processing error:', error);
        return { action: 'NONE', text };
    }
}
