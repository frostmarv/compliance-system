import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import { checkFactoryAccess } from '@/lib/quiz-status'
import type { QuizSchedule } from '@/lib/quiz-status'
import {
  QuizStyles,
  Navbar,
  Footer,
  ErrorModal,
  ResultModal,
  NIKForm,
  EmployeeCard,
  ProgressBar,
  QuestionCard,
  SubmitBar,
  type Employee,
  type Question,
  type ScoreResult,
} from '@/components/public/quiz'

const TRAINING_CODE = '5S'

// ── Konfigurasi Quiz 5R ──
const QUIZ_CONFIG = {
  code: TRAINING_CODE,
  title: 'Quiz 5R',
  subtitle: 'Ringkas · Rapi · Resik · Rawat · Rajin',
} as const

export default function FiveRQuiz() {
  const [nik, setNik]               = useState('')
  const [employee, setEmployee]     = useState<Employee | null>(null)
  const [questions, setQuestions]   = useState<Question[]>([])
  const [answers, setAnswers]       = useState<Record<string, string>>({})
  const [submitted, setSubmitted]   = useState(false)
  const [result, setResult]         = useState<ScoreResult | null>(null)
  const [error, setError]           = useState('')
  const [searching, setSearching]   = useState(false)
  const [submitting, setSubmitting] = useState(false)
  
  const [showErrorModal, setShowErrorModal] = useState(false)
  const [showResultModal, setShowResultModal] = useState(false)
  
  // ── Schedule State ───────────────────────────────────────────
  const [quizSchedule, setQuizSchedule] = useState<QuizSchedule | null>(null)
  const [scheduleLoading, setScheduleLoading] = useState(true)

  // ── Fetch Schedule on Mount ──────────────────────────────────
  useEffect(() => {
    async function fetchSchedule() {
      try {
        // 1. Ambil training ID berdasarkan code
        const { data: training } = await supabase
          .from('training_types')
          .select('id')
          .eq('code', QUIZ_CONFIG.code)
          .single()
        
        if (!training?.id) {
          setQuizSchedule(null)
          return
        }
        
        // 2. Ambil schedule untuk training ini
        const { data: schedule } = await supabase
          .from('training_schedules')
          .select('*')
          .eq('training_type_id', training.id)
          .maybeSingle()
        
        setQuizSchedule(schedule || null)
      } catch (err) {
        console.error('Error fetching schedule:', err)
        setQuizSchedule(null)
      } finally {
        setScheduleLoading(false)
      }
    }
    fetchSchedule()
  }, [])

  // ── Fetch Employee & Validate Factory ────────────────────────
  const fetchEmployee = useCallback(async (searchNik: string) => {
    if (searchNik.length !== 8) { 
      setEmployee(null)
      setQuestions([]) 
      return 
    }
    
    setSearching(true)
    setError('')
    
    try {
      // 1. Cek karyawan di database
      const { data, error: dbError } = await supabase
        .from('karyawan')
        .select('nik, nama, department, factory')
        .eq('nik', searchNik.trim())
        .single()
      
      if (dbError || !data) {
        setEmployee(null)
        setQuestions([])
        setError('NIK tidak ditemukan. Periksa kembali nomor Anda.')
        setShowErrorModal(true)
        return
      }
      
      // ✅ 2. Factory Validation (Soft Check)
      const access = checkFactoryAccess(quizSchedule, data.factory)
      if (!access.allowed) {
        // ❌ Factory tidak cocok → tampilkan pesan spesifik
        setError(access.reason || 'Akses ditolak untuk factory Anda')
        setShowErrorModal(true)
        return
      }
      
      // ✅ 3. Factory cocok → lanjut ke soal
      setEmployee(data)
      await loadQuestions(data.factory)
      
    } catch (err: any) {
      setError('Terjadi kesalahan: ' + err.message)
      setEmployee(null)
      setQuestions([])
      setShowErrorModal(true)
    } finally {
      setSearching(false)
    }
  }, [quizSchedule])

  // Debounce NIK input
  useEffect(() => {
    const t = setTimeout(() => { 
      if (nik.length === 8) fetchEmployee(nik) 
    }, 500)
    return () => clearTimeout(t)
  }, [nik, fetchEmployee])

  // ── Load Questions ───────────────────────────────────────────
  const loadQuestions = async (userFactory: number | null) => {
    try {
      const { data: training } = await supabase
        .from('training_types')
        .select('id')
        .eq('code', QUIZ_CONFIG.code)
        .single()
      
      if (!training?.id) throw new Error(`Training "${QUIZ_CONFIG.code}" tidak ditemukan`)
      
      const { data, error: qError } = await supabase
        .from('bank_soal')
        .select('id, question_number, question_text, type, options, correct_answer')
        .eq('training_type_id', training.id)
        .eq('is_active', true)
        .or(`factory.is.null,factory.eq.${userFactory}`)
        .order('question_number', { ascending: true })
      
      if (qError) throw qError
      setQuestions(data || [])
    } catch (err: any) {
      setError('Gagal memuat soal: ' + err.message)
      setShowErrorModal(true)
    }
  }

  // ── Answer Handler ───────────────────────────────────────────
  const handleAnswer = (qId: string, value: string) =>
    setAnswers(prev => ({ ...prev, [qId]: value }))

  // ── Submit Quiz ──────────────────────────────────────────────
  const handleSubmit = async () => {
    const unanswered = questions.filter(q => !answers[q.id]).length
    if (unanswered > 0) {
      setError(`Masih ada ${unanswered} soal yang belum dijawab.`)
      setShowErrorModal(true)
      return
    }
    
    setSubmitting(true)
    setError('')
    
    try {
      const { data: training } = await supabase
        .from('training_types')
        .select('id')
        .eq('code', QUIZ_CONFIG.code)
        .single()
      
      if (!training?.id) throw new Error('Training tidak ditemukan')
      
      const { data, error: rpcError } = await supabase.rpc('calculate_and_save_score', {
        p_nik: employee!.nik,
        p_training_id: training.id,
        p_user_answers: answers,
      })
      
      if (rpcError) throw rpcError
      if (data?.error) throw new Error(data.error)
      
      setResult(data as ScoreResult)
      setSubmitted(true)
      setShowResultModal(true)
    } catch (err: any) {
      setError('Gagal menyimpan: ' + err.message)
      setShowErrorModal(true)
    } finally {
      setSubmitting(false)
    }
  }

  // ── Reset Quiz ───────────────────────────────────────────────
  const handleReset = () => {
    setNik('')
    setEmployee(null)
    setQuestions([])
    setAnswers({})
    setSubmitted(false)
    setResult(null)
    setError('')
    setShowErrorModal(false)
    setShowResultModal(false)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const answeredCount = Object.keys(answers).length
  const allAnswered = questions.length > 0 && answeredCount === questions.length

  return (
    <>
      <QuizStyles />
      <div className="quiz-root">
        {/* ── Navbar ── */}
        <Navbar 
          title={QUIZ_CONFIG.title} 
          subtitle={QUIZ_CONFIG.subtitle}
        />

        <main className="main">
          {/* ── NIK Form (Gatekeeper) ── */}
          {!employee && !submitted && (
            <NIKForm
              // ✅ Schedule Props (Wajib)
              quizName={QUIZ_CONFIG.title}
              quizSchedule={quizSchedule}
              scheduleLoading={scheduleLoading}
              
              // ✅ NIK Logic
              nik={nik}
              onChange={setNik}
              onSubmit={fetchEmployee}  // ← Factory validation happens here
              
              // ✅ UI States
              searching={searching}
              found={!!employee}
              error={error}
            />
          )}

          {/* ── Quiz Content ── */}
          {employee && questions.length > 0 && !submitted && (
            <div className="space-y">
              <EmployeeCard employee={employee} />
              <ProgressBar answered={answeredCount} total={questions.length} />
              
              {questions.map((q, idx) => (
                <QuestionCard
                  key={q.id}
                  question={q}
                  index={idx}
                  selectedAnswer={answers[q.id]}
                  onAnswer={handleAnswer}
                />
              ))}

              <SubmitBar
                answered={answeredCount}
                total={questions.length}
                submitting={submitting}
                onSubmit={handleSubmit}
                disabled={!allAnswered}
              />
            </div>
          )}
        </main>

        <Footer />

        {/* ── Modals ── */}
        <ErrorModal
          isOpen={showErrorModal}
          onClose={() => setShowErrorModal(false)}
          message={error}
        />

        {result && (
          <ResultModal
            isOpen={showResultModal}
            onClose={() => setShowResultModal(false)}
            onReset={handleReset}
            result={result}
            employee={employee}
          />
        )}
      </div>
    </>
  )
}