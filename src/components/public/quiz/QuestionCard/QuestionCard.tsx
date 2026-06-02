import type { Question } from '../types'

interface QuestionCardProps {
  question: Question
  index: number
  selectedAnswer?: string
  onAnswer: (questionId: string, value: string) => void
}

export const QuestionCard = ({ question, index, selectedAnswer, onAnswer }: QuestionCardProps) => (
  <div className={`q-card${selectedAnswer ? ' answered' : ''}`}>
    <div className="q-body">
      <div className="q-header">
        <div className={`q-num${selectedAnswer ? ' answered' : ''}`}>{index + 1}</div>
        <p className="q-text">{question.question_text}</p>
      </div>
      <div className="q-options">
        {Object.entries(question.options).map(([key, label]) => {
          const isSelected = selectedAnswer === key
          return (
            <label key={key} className={`q-option${isSelected ? ' selected' : ''}`}>
              <div className="q-radio">
                {isSelected && <div className="q-radio-dot" />}
              </div>
              <input
                type="radio"
                name={`q_${question.id}`}
                value={key}
                checked={isSelected}
                onChange={() => onAnswer(question.id, key)}
              />
              <span className="q-option-label">{label}</span>
            </label>
          )
        })}
      </div>
    </div>
  </div>
)