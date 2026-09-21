import { SearchX } from 'lucide-react'

export default function EmptyState({ onClearSearch }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-slate-200 bg-slate-50 px-6 py-16 text-center">
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-teal-100 text-teal-700">
        <SearchX className="h-8 w-8" />
      </div>
      <h3 className="text-xl font-semibold text-slate-900">No phones found</h3>
      <p className="mt-2 max-w-md text-sm text-slate-500">Try another brand, model or keyword.</p>
      {onClearSearch ? (
        <button
          type="button"
          onClick={onClearSearch}
          className="mt-6 rounded-full bg-teal-700 px-5 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-teal-800"
        >
          Clear filters
        </button>
      ) : null}
    </div>
  )
}
