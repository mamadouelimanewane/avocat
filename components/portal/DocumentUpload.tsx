"use client"

import { useState, useCallback } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import {
    Upload,
    FileText,
    Image,
    FileArchive,
    CheckCircle2,
    XCircle,
    Loader2,
    X,
    Eye
} from 'lucide-react'

interface UploadedFile {
    id: string
    name: string
    size: number
    type: string
    category: string
    status: 'uploading' | 'success' | 'error'
    progress: number
    url?: string
}

interface DocumentUploadProps {
    dossierId?: string
    onUploadComplete?: (files: UploadedFile[]) => void
}

export function DocumentUpload({ dossierId, onUploadComplete }: DocumentUploadProps) {
    const [files, setFiles] = useState<UploadedFile[]>([])
    const [dragActive, setDragActive] = useState(false)
    const [category, setCategory] = useState('PIECE_IDENTITE')

    const categories = [
        { value: 'PIECE_IDENTITE', label: 'Pièce d\'identité', icon: '🪪' },
        { value: 'JUSTIFICATIF', label: 'Justificatif', icon: '📄' },
        { value: 'CONTRAT', label: 'Contrat', icon: '📝' },
        { value: 'FACTURE', label: 'Facture', icon: '🧾' },
        { value: 'PHOTO', label: 'Photo/Scan', icon: '📸' },
        { value: 'AUTRE', label: 'Autre document', icon: '📎' }
    ]

    const simulateUpload = (file: File): Promise<UploadedFile> => {
        return new Promise((resolve) => {
            const uploadedFile: UploadedFile = {
                id: Math.random().toString(36).substr(2, 9),
                name: file.name,
                size: file.size,
                type: file.type,
                category,
                status: 'uploading',
                progress: 0
            }

            setFiles(prev => [...prev, uploadedFile])

            // Simulate upload progress
            const interval = setInterval(() => {
                setFiles(prev => prev.map(f => {
                    if (f.id === uploadedFile.id && f.progress < 100) {
                        return { ...f, progress: Math.min(f.progress + 10, 100) }
                    }
                    return f
                }))
            }, 200)

            // Complete upload after 2 seconds
            setTimeout(() => {
                clearInterval(interval)
                const completed = {
                    ...uploadedFile,
                    status: 'success' as const,
                    progress: 100,
                    url: URL.createObjectURL(file)
                }

                setFiles(prev => prev.map(f =>
                    f.id === uploadedFile.id ? completed : f
                ))

                resolve(completed)
            }, 2000)
        })
    }

    const handleFileSelect = async (fileList: FileList | null) => {
        if (!fileList) return

        const selectedFiles = Array.from(fileList)

        // Validate file size (max 10MB)
        const maxSize = 10 * 1024 * 1024
        const validFiles = selectedFiles.filter(file => {
            if (file.size > maxSize) {
                alert(`Le fichier ${file.name} dépasse 10 MB`)
                return false
            }
            return true
        })

        // Upload files
        const uploadPromises = validFiles.map(file => simulateUpload(file))
        const uploadedFiles = await Promise.all(uploadPromises)

        onUploadComplete?.(uploadedFiles)
    }

    const handleDrag = useCallback((e: React.DragEvent) => {
        e.preventDefault()
        e.stopPropagation()
        if (e.type === 'dragenter' || e.type === 'dragover') {
            setDragActive(true)
        } else if (e.type === 'dragleave') {
            setDragActive(false)
        }
    }, [])

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault()
        e.stopPropagation()
        setDragActive(false)

        if (e.dataTransfer.files) {
            handleFileSelect(e.dataTransfer.files)
        }
    }, [category])

    const removeFile = (id: string) => {
        setFiles(prev => prev.filter(f => f.id !== id))
    }

    const formatFileSize = (bytes: number) => {
        if (bytes === 0) return '0 Bytes'
        const k = 1024
        const sizes = ['Bytes', 'KB', 'MB', 'GB']
        const i = Math.floor(Math.log(bytes) / Math.log(k))
        return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
    }

    const getFileIcon = (type: string) => {
        if (type.startsWith('image/')) return <Image className="h-5 w-5" />
        if (type.includes('pdf')) return <FileText className="h-5 w-5 text-red-500" />
        if (type.includes('zip') || type.includes('rar')) return <FileArchive className="h-5 w-5" />
        return <FileText className="h-5 w-5" />
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Upload className="h-5 w-5 text-blue-600" />
                    Envoyer des documents
                </CardTitle>
                <CardDescription>
                    Partagez vos documents de manière sécurisée avec votre avocat
                </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
                {/* Category Selection */}
                <div className="space-y-2">
                    <Label>Type de document</Label>
                    <Select value={category} onValueChange={setCategory}>
                        <SelectTrigger>
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            {categories.map(cat => (
                                <SelectItem key={cat.value} value={cat.value}>
                                    <span className="flex items-center gap-2">
                                        <span>{cat.icon}</span>
                                        <span>{cat.label}</span>
                                    </span>
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                {/* Drag and Drop Zone */}
                <div
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                    className={`
            relative border-2 border-dashed rounded-lg p-8 text-center transition-all
            ${dragActive
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-slate-300 bg-slate-50 hover:border-blue-400 hover:bg-blue-50/50'
                        }
          `}
                >
                    <Input
                        id="file-upload"
                        type="file"
                        multiple
                        onChange={(e) => handleFileSelect(e.target.files)}
                        className="hidden"
                        accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.zip"
                    />

                    <div className="space-y-4">
                        <div className="flex justify-center">
                            <div className="h-16 w-16 rounded-full bg-blue-100 flex items-center justify-center">
                                <Upload className="h-8 w-8 text-blue-600" />
                            </div>
                        </div>

                        <div>
                            <p className="text-lg font-semibold text-slate-700 mb-1">
                                Glissez-déposez vos fichiers ici
                            </p>
                            <p className="text-sm text-slate-500">ou</p>
                        </div>

                        <label htmlFor="file-upload">
                            <Button asChild variant="default" className="cursor-pointer">
                                <span>Parcourir les fichiers</span>
                            </Button>
                        </label>

                        <p className="text-xs text-slate-500">
                            PDF, Word, Images (max 10 MB par fichier)
                        </p>
                    </div>
                </div>

                {/* Uploaded Files List */}
                {files.length > 0 && (
                    <div className="space-y-3">
                        <h4 className="font-semibold text-slate-700">Fichiers ({files.length})</h4>
                        <div className="space-y-2">
                            {files.map(file => (
                                <div
                                    key={file.id}
                                    className="p-3 bg-white border rounded-lg hover:shadow-sm transition-shadow"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="shrink-0">
                                            {getFileIcon(file.type)}
                                        </div>

                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center justify-between mb-1">
                                                <p className="text-sm font-medium text-slate-900 truncate">
                                                    {file.name}
                                                </p>
                                                <div className="flex items-center gap-2 ml-2">
                                                    {file.status === 'success' && (
                                                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                                                    )}
                                                    {file.status === 'error' && (
                                                        <XCircle className="h-4 w-4 text-red-500" />
                                                    )}
                                                    {file.status === 'uploading' && (
                                                        <Loader2 className="h-4 w-4 text-blue-500 animate-spin" />
                                                    )}
                                                    <Button
                                                        size="sm"
                                                        variant="ghost"
                                                        onClick={() => removeFile(file.id)}
                                                        className="h-6 w-6 p-0"
                                                    >
                                                        <X className="h-3 w-3" />
                                                    </Button>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-2 text-xs text-slate-500">
                                                <span>{formatFileSize(file.size)}</span>
                                                <span>•</span>
                                                <Badge variant="outline" className="text-xs">
                                                    {categories.find(c => c.value === file.category)?.label}
                                                </Badge>
                                            </div>

                                            {file.status === 'uploading' && (
                                                <Progress value={file.progress} className="h-1 mt-2" />
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Success Message */}
                {files.some(f => f.status === 'success') && (
                    <div className="p-4 bg-green-50 border-2 border-green-200 rounded-lg">
                        <div className="flex items-start gap-3">
                            <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5" />
                            <div>
                                <p className="font-semibold text-green-900">Documents envoyés avec succès !</p>
                                <p className="text-sm text-green-700 mt-1">
                                    Votre avocat a été notifié et examinera vos documents dans les plus brefs délais.
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    )
}
