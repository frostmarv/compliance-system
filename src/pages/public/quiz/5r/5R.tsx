import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '@/lib/supabase'
import { withMinDelay } from '@/lib/withMinDelay'
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
import Materi5R from '@/pages/public/materi/Materi5R'

const TRAINING_CODE = '5S'

const QUIZ_CONFIG = {
  code: TRAINING_CODE,
  title: 'Quiz 5R',
  subtitle: 'Ringkas · Rapi · Resik · Rawat · Rajin',
} as const

type Phase = 'nik' | 'pretest' | 'materi' | 'posttest'

export default function FiveRQuiz() {
  const navigate = useNavigate()
  const [phase, setPhase]           = useState<Phase>('nik')
  const [nik, setNik]               = useState('')
  const [employee, setEmployee]     = useState<Employee | null>(null)

  const [preQuestions, setPreQuestions]   = useState<Question[]>([])
  const [postQuestions, setPostQuestions] = useState<Question[]>([])
  const [preAnswers, setPreAnswers]       = useState<Record<string, string>>({})
  const [postAnswers, setPostAnswers]     = useState<Record<string, string>>({})

  const [result, setResult]         = useState<ScoreResult | null>(null)
  const [preResult, setPreResult]   = useState<ScoreResult | null>(null)
  const [error, setError]           = useState('')
  const [searching, setSearching]   = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const [showErrorModal, setShowErrorModal]   = useState(false)
  const [pendingError, setPendingError]       = useState(false)
  const [showResultModal, setShowResultModal] = useState(false)

  const [quizSchedule, setQuizSchedule]       = useState<QuizSchedule | null>(null)
  const [scheduleLoading, setScheduleLoading] = useState(true)

  useEffect(() => {
    async function fetchSchedule() {
      try {
        const { data: training } = await supabase
          .from('training_types')
          .select('id')
          .eq('code', QUIZ_CONFIG.code)
          .single()

        if (!training?.id) { setQuizSchedule(null); return }

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

  const loadQuestions = useCallback(async (
    userFactory: number | null,
    testType: 'pre' | 'post'
  ): Promise<Question[]> => {
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
      .eq('test_type', testType)
      .or(`factory.is.null,factory.eq.${userFactory}`)
      .order('question_number', { ascending: true })

    if (qError) throw qError
    return data || []
  }, [])

  // ── Fetch Employee & Validate Factory ────────────────────────
  const fetchEmployee = useCallback(async (searchNik: string) => {
    if (searchNik.length !== 8) {
      setEmployee(null)
      setPreQuestions([])
      setPostQuestions([])
      return
    }

    setSearching(true)
    setError('')

    try {
      const { data, error: dbError } = await withMinDelay(
        supabase
          .from('karyawan')
          .select('nik, nama, department, factory')
          .eq('nik', searchNik.trim())
          .single(),
        1200
      )

      if (dbError || !data) {
        setEmployee(null)
        setPreQuestions([])
        setPostQuestions([])
        setError('NIK tidak ditemukan. Periksa kembali nomor Anda.')
        setPendingError(true)
        return
      }

      const access = checkFactoryAccess(quizSchedule, data.factory)
      if (!access.allowed) {
        setError(access.reason || 'Akses ditolak untuk factory Anda')
        setPendingError(true)
        return
      }

      const { data: training, error: trError } = await supabase
        .from('training_types')
        .select('id')
        .eq('code', QUIZ_CONFIG.code)
        .single()

      if (trError || !training?.id) throw new Error('Training tidak ditemukan')

      // 1. CEK POST-TEST: Jika sudah pernah, blokir total
      const { data: postTestRecord } = await supabase
        .from('hasil_ujian')
        .select('id')
        .eq('nik', data.nik)
        .eq('training_type_id', training.id)
        .eq('test_type', 'post')
        .maybeSingle()

      if (postTestRecord) {
        setError('Anda sudah menyelesaikan Post-Test untuk training ini. Tidak dapat mengulang.')
        setPendingError(true)
        setEmployee(null)
        return
      }

      // 2. CEK PRE-TEST: Jika sudah pernah, bypass ke Materi
      const { data: preTestRecord, error: preError } = await supabase
        .from('hasil_ujian')
        .select('score, total_questions, correct_count')
        .eq('nik', data.nik)
        .eq('training_type_id', training.id)
        .eq('test_type', 'pre')
        .maybeSingle()

      console.log('🔍 [DEBUG] Pre-test check:', { preTestRecord, preError })

      if (preTestRecord) {
        // Pre-test sudah selesai → BYPASS KE MATERI
        const score   = Number(preTestRecord.score || 0)
        const total   = Number(preTestRecord.total_questions || 0)
        const correct = Number(preTestRecord.correct_count || 0)

        setPreResult({
          score,
          total,
          correct,
          success: score >= 80,
        } as ScoreResult)

        const postQ = await loadQuestions(data.factory, 'post')
        setEmployee(data)
        setPostQuestions(postQ)
        setPhase('materi')
      } else {
        // Pre-test belum pernah → TAMPILKAN PRE-TEST
        const preQ = await loadQuestions(data.factory, 'pre')
        setEmployee(data)
        setPreQuestions(preQ)
        setPhase('pretest')
      }

      window.scrollTo({ top: 0, behavior: 'smooth' })

    } catch (err: any) {
      setError('Terjadi kesalahan: ' + err.message)
      setEmployee(null)
      setPreQuestions([])
      setPostQuestions([])
      setPendingError(true)
    } finally {
      setSearching(false)
    }
  }, [quizSchedule, loadQuestions])

  useEffect(() => {
    const t = setTimeout(() => {
      if (nik.length === 8) fetchEmployee(nik)
    }, 500)
    return () => clearTimeout(t)
  }, [nik, fetchEmployee])

  // Dipanggil NIKForm setelah popup verifikasi selesai animasi & ketutup.
  // Baru di sini kita boleh nampilin ErrorModal, biar gak nembus di belakang popup.
  const handleVerificationDone = () => {
    if (pendingError) {
      setShowErrorModal(true)
      setPendingError(false)
    }
  }

  // ── Submit Pre-Test → pindah ke Materi ───────────────────────
  const handleSubmitPre = async () => {
    const unanswered = preQuestions.filter(q => !preAnswers[q.id]).length
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
        p_nik:          employee!.nik,
        p_training_id:  training.id,
        p_user_answers: preAnswers,
        p_test_type:    'pre',
      })

      if (rpcError) throw rpcError
      if (data?.error) throw new Error(data.error)

      setPreResult({
        score:   Number(data.score   || 0),
        total:   Number(data.total   || 0),
        correct: Number(data.correct || 0),
        success: Number(data.score   || 0) >= 80,
      } as ScoreResult)

      const postQ = await loadQuestions(employee!.factory, 'post')
      setPostQuestions(postQ)
      setPhase('materi')
      window.scrollTo({ top: 0, behavior: 'smooth' })

    } catch (err: any) {
      setError('Gagal menyimpan pre-test: ' + err.message)
      setShowErrorModal(true)
    } finally {
      setSubmitting(false)
    }
  }

  // ── Submit Post-Test → tampilkan hasil ───────────────────────
  const handleSubmitPost = async () => {
    const unanswered = postQuestions.filter(q => !postAnswers[q.id]).length
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
        p_nik:          employee!.nik,
        p_training_id:  training.id,
        p_user_answers: postAnswers,
        p_test_type:    'post',
      })

      if (rpcError) throw rpcError
      if (data?.error) throw new Error(data.error)

      setResult({
        score:   Number(data.score   || 0),
        total:   Number(data.total   || 0),
        correct: Number(data.correct || 0),
        success: Number(data.score   || 0) >= 80,
      } as ScoreResult)

      setShowResultModal(true)

    } catch (err: any) {
      setError('Gagal menyimpan post-test: ' + err.message)
      setShowErrorModal(true)
    } finally {
      setSubmitting(false)
    }
  }

  const handleReset = () => {
    setPhase('nik')
    setNik('')
    setEmployee(null)
    setPreQuestions([])
    setPostQuestions([])
    setPreAnswers({})
    setPostAnswers({})
    setResult(null)
    setPreResult(null)
    setError('')
    setShowErrorModal(false)
    setPendingError(false)
    setShowResultModal(false)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const preAnsweredCount  = Object.keys(preAnswers).length
  const postAnsweredCount = Object.keys(postAnswers).length

  const phaseLabel: Record<Phase, string> = {
    nik:      QUIZ_CONFIG.subtitle,
    pretest:  'Pre-Test · Sebelum Materi',
    materi:   'Baca Materi',
    posttest: 'Post-Test · Setelah Materi',
  }

  return (
    <>
      <QuizStyles />
      <div className="quiz-root">
        <Navbar title={QUIZ_CONFIG.title} subtitle={phaseLabel[phase]} />

        <main className="main">
          {phase === 'nik' && (
            <NIKForm
              quizName={QUIZ_CONFIG.title}
              quizSchedule={quizSchedule}
              scheduleLoading={scheduleLoading}
              nik={nik}
              onChange={setNik}
              onSubmit={fetchEmployee}
              searching={searching}
              found={!!employee}
              error={error}
              onVerificationDone={handleVerificationDone}
            />
          )}

          {phase === 'pretest' && employee && preQuestions.length > 0 && (
            <div className="space-y">
              <EmployeeCard employee={employee} />
              <PhaseIndicator current="pretest" />
              <ProgressBar answered={preAnsweredCount} total={preQuestions.length} />

              {preQuestions.map((q, idx) => (
                <QuestionCard
                  key={q.id}
                  question={q}
                  index={idx}
                  selectedAnswer={preAnswers[q.id]}
                  onAnswer={(qId, val) => setPreAnswers(prev => ({ ...prev, [qId]: val }))}
                />
              ))}

              <SubmitBar
                answered={preAnsweredCount}
                total={preQuestions.length}
                submitting={submitting}
                onSubmit={handleSubmitPre}
                disabled={preAnsweredCount !== preQuestions.length}
              />
            </div>
          )}

          {phase === 'materi' && (
            <Materi5R
              employeeName={employee?.nama}
              onSelesai={() => {
                setPhase('posttest')
                window.scrollTo({ top: 0, behavior: 'smooth' })
              }}
            />
          )}

          {phase === 'posttest' && employee && postQuestions.length > 0 && (
            <div className="space-y">
              <EmployeeCard employee={employee} />
              <PhaseIndicator current="posttest" />
              <ProgressBar answered={postAnsweredCount} total={postQuestions.length} />

              {postQuestions.map((q, idx) => (
                <QuestionCard
                  key={q.id}
                  question={q}
                  index={idx}
                  selectedAnswer={postAnswers[q.id]}
                  onAnswer={(qId, val) => setPostAnswers(prev => ({ ...prev, [qId]: val }))}
                />
              ))}

              <SubmitBar
                answered={postAnsweredCount}
                total={postQuestions.length}
                submitting={submitting}
                onSubmit={handleSubmitPost}
                disabled={postAnsweredCount !== postQuestions.length}
              />
            </div>
          )}
        </main>

        <Footer />

        <ErrorModal
          isOpen={showErrorModal}
          onClose={() => setShowErrorModal(false)}
          message={error}
        />

        {result && (
          <ResultModal
            isOpen={showResultModal}
            onClose={() => {
              setShowResultModal(false)
              handleReset()
              navigate('/quiz')
            }}
            onReset={handleReset}
            result={result}
            preResult={preResult}
            employee={employee}
          />
        )}
      </div>
    </>
  )
}

// ── Phase Indicator ───────────────────────────────────────────────────────────

const PHASES = [
  { key: 'pretest',  label: 'Pre-Test' },
  { key: 'materi',   label: 'Materi'   },
  { key: 'posttest', label: 'Post-Test' },
]

function PhaseIndicator({ current }: { current: 'pretest' | 'materi' | 'posttest' }) {
  const currentIdx = PHASES.findIndex(p => p.key === current)

  return (
    <div className="flex items-center bg-[#F7F4EF] border border-[#E8E0D5] rounded-xl px-4 py-3 mb-1">
      {PHASES.map((p, i) => {
        const isDone   = i < currentIdx
        const isActive = i === currentIdx
        const isLast   = i === PHASES.length - 1

        return (
          <div
            key={p.key}
            className={`flex items-center ${isLast ? '' : 'flex-1'}`}
          >
            {/* Step bubble + label */}
            <div className="flex items-center gap-1.5">
              <div
                className={[
                  'w-[26px] h-[26px] rounded-full flex items-center justify-center',
                  'text-xs font-bold shrink-0 transition-all duration-300',
                  isDone
                    ? 'bg-emerald-600 text-white'
                    : isActive
                    ? 'bg-[#E85D26] text-white'
                    : 'bg-[#E8E0D5] text-[#9C8D7E]',
                ].join(' ')}
              >
                {isDone ? '✓' : i + 1}
              </div>

              <span
                className={[
                  'text-xs whitespace-nowrap',
                  isActive
                    ? 'font-semibold text-[#1C1917]'
                    : isDone
                    ? 'font-normal text-emerald-600'
                    : 'font-normal text-[#9C8D7E]',
                ].join(' ')}
              >
                {p.label}
              </span>
            </div>

            {/* Connector line */}
            {!isLast && (
              <div
                className={[
                  'flex-1 h-0.5 mx-2 transition-colors duration-300',
                  isDone ? 'bg-emerald-600' : 'bg-[#E8E0D5]',
                ].join(' ')}
              />
            )}
          </div>
        )
      })}
    </div>
  )
}