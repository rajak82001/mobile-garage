import { ArrowRight, Maximize2, Minus, Plus, X } from 'lucide-react'
import { useState } from 'react'
import ProductImage from './ProductImage'

export default function ComparisonTray({ products, onRemove, onCompare, onClose }) {
  const [minimized, setMinimized] = useState(false)

  if (minimized) {
    return (
      <aside className="fixed bottom-4 right-4 z-40" aria-label="Minimized phone comparison tray">
        <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-white/95 p-1.5 pl-2.5 shadow-[0_14px_35px_rgba(15,23,42,0.2)] backdrop-blur-md sm:bottom-5 sm:right-5">
          <div className="flex -space-x-2">
            {products.slice(0, 3).map((product) => (
              <div key={product.id} className="h-7 w-7 shrink-0 overflow-hidden rounded-full border-2 border-white bg-slate-50 sm:h-8 sm:w-8">
                <ProductImage src={product.image} alt="" className="h-full w-full rounded-full bg-slate-50" />
              </div>
            ))}
          </div>
          <span className="whitespace-nowrap text-[11px] font-bold text-slate-700 sm:text-xs">{products.length}/3 compared</span>
          <button type="button" onClick={() => setMinimized(false)} aria-label="Expand comparison tray" className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-slate-950 text-white transition hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2"><Maximize2 className="h-3.5 w-3.5" /></button>
          <button type="button" onClick={onClose} aria-label="Close comparison tray" className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 text-slate-500 transition hover:border-rose-200 hover:bg-rose-50 hover:text-rose-500 focus:outline-none focus:ring-2 focus:ring-rose-400 focus:ring-offset-2"><X className="h-3.5 w-3.5" /></button>
        </div>
      </aside>
    )
  }

  return (
    <aside className="fixed inset-x-3 bottom-3 z-40 mx-auto max-w-5xl rounded-[24px] border border-slate-200/80 bg-white/95 p-3 shadow-[0_18px_50px_rgba(15,23,42,0.18)] backdrop-blur-md sm:inset-x-5 sm:bottom-5 sm:p-4" aria-label="Phone comparison tray">
      <div className="flex items-center justify-between gap-2">
        <div>
          <p className="text-xs font-bold text-slate-900 sm:text-sm">Compare phones</p>
          <p className="text-xs text-slate-500">{products.length}/3 selected</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setMinimized(true)}
            aria-label="Minimize comparison tray"
            className="rounded-full border border-slate-200 p-2 text-slate-600 transition hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-700"
          >
            <Minus className="h-4 w-4" aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={onCompare}
            disabled={products.length < 2}
            className="inline-flex shrink-0 items-center gap-1 rounded-full bg-slate-950 px-2.5 py-2 text-[11px] font-semibold text-white transition hover:bg-teal-700 disabled:cursor-not-allowed disabled:opacity-40 sm:gap-1.5 sm:px-4 sm:text-sm"
          >
            Compare Now <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
      <div className="mt-3 grid grid-cols-3 gap-1.5 sm:gap-3">
        {[0, 1, 2].map((index) => {
          const product = products[index]
          return (
            <div key={product?.id || `empty-${index}`} className={`relative flex min-w-0 items-center gap-1 rounded-xl border p-1.5 sm:gap-2 sm:rounded-2xl sm:p-2 ${product ? 'border-emerald-100 bg-emerald-50/60' : 'border-dashed border-slate-200 bg-slate-50'}`}>
              {product ? (
                <>
                  <div className="h-8 w-8 shrink-0 overflow-hidden rounded-lg bg-white sm:h-10 sm:w-10 sm:rounded-xl">
                    <ProductImage src={product.image} alt="" className="h-full w-full rounded-lg bg-white sm:rounded-xl" />
                  </div>
                  <span className="truncate text-[10px] font-semibold text-slate-700 sm:text-xs">{product.name}</span>
                  <button type="button" onClick={() => onRemove(product.id)} aria-label={`Remove ${product.name} from comparison`} className="absolute -right-1.5 -top-1.5 rounded-full bg-slate-900 p-1 text-white shadow-sm transition hover:bg-rose-500">
                    <X className="h-3 w-3" />
                  </button>
                </>
              ) : (
                <span className="flex w-full items-center justify-center gap-0.5 text-[10px] font-medium text-slate-400 sm:gap-1 sm:text-xs"><Plus className="h-3 w-3 sm:h-3.5 sm:w-3.5" /> Add phone</span>
              )}
            </div>
          )
        })}
      </div>
      <button type="button" onClick={onClose} aria-label="Close comparison tray" className="absolute -right-2 -top-2 flex h-7 w-7 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 shadow-sm transition hover:border-rose-200 hover:bg-rose-50 hover:text-rose-500 focus:outline-none focus:ring-2 focus:ring-rose-400 focus:ring-offset-2">
        <X className="h-3.5 w-3.5" />
      </button>
    </aside>
  )
}
