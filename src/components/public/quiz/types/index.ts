export interface Employee {
    nik: string
    nama: string
    department: string
    factory: number | null
  }
  
  export interface Question {
    id: string
    question_number: number
    question_text: string
    type: 'pg' | 'tf'
    options: Record<string, string>
    correct_answer: string
  }
  
  export interface ScoreResult {
    success: boolean
    score: number
    correct: number
    total: number
    error?: string
  }
  
  export interface ModalProps {
    isOpen: boolean
    onClose: () => void
    onConfirm?: () => void
    title?: string
    message: string
    type?: 'error' | 'success'
    confirmText?: string
    cancelText?: string
    showCancel?: boolean
  }