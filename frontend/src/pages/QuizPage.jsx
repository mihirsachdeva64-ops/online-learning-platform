import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams, useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft,
  HelpCircle,
  CheckCircle,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  Send,
  RotateCcw,
} from 'lucide-react';
import { getQuizByTarget, getQuizById, submitQuizAttempt } from '../services/quizService';
import MultipleChoice from '../components/quiz/MultipleChoice';
import MultipleSelect from '../components/quiz/MultipleSelect';
import DragOrder from '../components/quiz/DragOrder';
import QuizTimer from '../components/quiz/QuizTimer';
import QuizResults from '../components/quiz/QuizResults';

export default function QuizPage() {
  const { courseId } = useParams();
  const [searchParams] = useSearchParams();
  const lessonId = searchParams.get('lesson');
  const navigate = useNavigate();

  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);

  // User answers map: { [questionId]: answerValue }
  const [answers, setAnswers] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);
  const [startTime] = useState(Date.now());

  const loadQuiz = async () => {
    try {
      setLoading(true);
      setError(null);
      setResult(null);
      setAnswers({});
      setCurrentQuestionIdx(0);

      const res = await getQuizByTarget({ courseId, lessonId });
      setQuiz(res.quiz);
    } catch (err) {
      console.error('Failed to load quiz:', err);
      setError('Quiz not found or not yet published for this module.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadQuiz();
  }, [courseId, lessonId]);

  const handleAnswerChange = (questionId, value) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: value,
    }));
  };

  const handleSubmit = async () => {
    if (!quiz) return;

    try {
      setSubmitting(true);
      const timeSpentSeconds = Math.round((Date.now() - startTime) / 1000);

      // Format answers payload
      const payloadAnswers = quiz.questions.map((q) => ({
        questionId: q.id,
        userAnswer: answers[q.id] !== undefined ? answers[q.id] : null,
      }));

      const res = await submitQuizAttempt(quiz._id, {
        answers: payloadAnswers,
        timeSpentSeconds,
      });

      setResult(res);
    } catch (err) {
      console.error('Quiz submission error:', err);
      alert('Failed to submit quiz attempt. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="w-10 h-10 border-4 border-brand-200 border-t-brand-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error || !quiz) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 p-6 text-center">
        <HelpCircle className="w-12 h-12 text-slate-400 mb-3" />
        <h2 className="text-xl font-bold text-slate-900 mb-1">Quiz Not Available</h2>
        <p className="text-xs text-slate-500 mb-4">{error || 'No questions available.'}</p>
        <button
          onClick={() => navigate(-1)}
          className="px-4 py-2 bg-brand-600 text-white rounded-xl text-xs font-semibold"
        >
          Go Back
        </button>
      </div>
    );
  }

  // If already submitted, display QuizResults
  if (result) {
    return (
      <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <QuizResults
            result={result}
            onRetake={loadQuiz}
            courseSlug={searchParams.get('slug') || ''}
          />
        </div>
      </div>
    );
  }

  const questions = quiz.questions || [];
  const currentQ = questions[currentQuestionIdx];
  const isLastQuestion = currentQuestionIdx === questions.length - 1;
  const answeredCount = Object.keys(answers).length;

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Top Header */}
        <div className="flex items-center justify-between gap-4">
          <button
            onClick={() => navigate(-1)}
            className="p-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 transition-colors flex items-center gap-1.5 text-xs font-semibold"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Exit Quiz</span>
          </button>

          {/* Countdown Timer */}
          <QuizTimer
            initialSeconds={quiz.timeLimitSeconds || 300}
            onExpire={handleSubmit}
            isSubmitted={!!result}
          />
        </div>

        {/* Quiz Meta Card */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-card">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-brand-600">
                Interactive Knowledge Check
              </span>
              <h1 className="text-xl font-black text-slate-900 mt-0.5">{quiz.title}</h1>
            </div>
            <span className="text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1 rounded-full self-start">
              Passing: {quiz.passingScorePercentage}%
            </span>
          </div>

          {/* Question Dots Navigation */}
          <div className="flex items-center gap-2 pt-4 border-t border-slate-100 overflow-x-auto pb-1">
            {questions.map((q, idx) => {
              const isAnswered = answers[q.id] !== undefined;
              const isCurrent = idx === currentQuestionIdx;

              return (
                <button
                  key={q.id || idx}
                  onClick={() => setCurrentQuestionIdx(idx)}
                  className={`w-8 h-8 rounded-xl text-xs font-bold transition-all flex items-center justify-center flex-shrink-0 ${
                    isCurrent
                      ? 'bg-brand-600 text-white shadow-sm ring-2 ring-brand-400'
                      : isAnswered
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                  }`}
                >
                  {idx + 1}
                </button>
              );
            })}
            <span className="text-xs text-slate-400 ml-auto whitespace-nowrap">
              {answeredCount} of {questions.length} answered
            </span>
          </div>
        </div>

        {/* Current Question Card */}
        {currentQ && (
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-card space-y-6">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Question {currentQuestionIdx + 1} of {questions.length} • {currentQ.type}
            </div>

            {/* Render appropriate question component based on type */}
            {currentQ.type === 'multiple-choice' && (
              <MultipleChoice
                question={currentQ}
                selectedAnswer={answers[currentQ.id]}
                onChange={(val) => handleAnswerChange(currentQ.id, val)}
              />
            )}

            {currentQ.type === 'multiple-select' && (
              <MultipleSelect
                question={currentQ}
                selectedAnswers={answers[currentQ.id] || []}
                onChange={(val) => handleAnswerChange(currentQ.id, val)}
              />
            )}

            {currentQ.type === 'drag-and-order' && (
              <DragOrder
                question={currentQ}
                currentOrder={answers[currentQ.id]}
                onChange={(val) => handleAnswerChange(currentQ.id, val)}
              />
            )}

            {/* Bottom Nav / Submit Buttons */}
            <div className="pt-6 border-t border-slate-100 flex items-center justify-between gap-3">
              <button
                type="button"
                disabled={currentQuestionIdx === 0}
                onClick={() => setCurrentQuestionIdx((p) => p - 1)}
                className="px-4 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center gap-1.5 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Previous</span>
              </button>

              {isLastQuestion ? (
                <button
                  type="button"
                  disabled={submitting}
                  onClick={handleSubmit}
                  className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white text-xs font-bold flex items-center gap-2 shadow-md transition-all"
                >
                  <Send className="w-4 h-4" />
                  <span>{submitting ? 'Evaluating Answers...' : 'Submit Quiz'}</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setCurrentQuestionIdx((p) => p + 1)}
                  className="px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all"
                >
                  <span>Next Question</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
