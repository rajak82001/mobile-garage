import { RefreshCw } from 'lucide-react'

export default function ErrorState({ message, onRetry }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-3xl border border-slate-200 bg-slate-50 px-6 py-16 text-center">
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100 text-red-600">
        <RefreshCw className="h-7 w-7" />
      </div>
      <h3 className="text-xl font-semibold text-slate-900">Unable to load products</h3>
      <p className="mt-2 max-w-md text-sm text-slate-500">{message || 'Please try again.'}</p>
      {onRetry ? (
        <button
          type="button"
          onClick={onRetry}
          className="mt-6 rounded-full bg-teal-700 px-5 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-teal-800"
        >
          Retry
        </button>
      ) : null}
    </div>
  )
}
