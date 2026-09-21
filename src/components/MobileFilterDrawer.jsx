import { Check, RotateCcw, X } from 'lucide-react'
import { useEffect } from 'react'

export default function MobileFilterDrawer({ open, onClose, brands, selectedBrand, onBrandChange, priceRange, onPriceChange, storageOptions, ramOptions, conditions, selectedFilters, onApply, onReset }) {
  useEffect(() => {
    if (!open) return undefined
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') onClose()
    }
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', handleKeyDown)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [open, onClose])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-[100] flex items-end bg-slate-950/50 backdrop-blur-sm lg:hidden" role="dialog" aria-modal="true" aria-labelledby="mobile-filter-title" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose() }}>
      <div className="flex max-h-[calc(100dvh-0.75rem)] w-full flex-col overflow-hidden rounded-t-[30px] border border-slate-200 bg-white shadow-[0_-18px_50px_rgba(15,23,42,0.22)]">
        <div className="shrink-0 border-b border-slate-100 px-5 pb-4 pt-3">
          <div className="mx-auto mb-3 h-1 w-10 rounded-full bg-slate-200" />
          <div className="flex items-center justify-between">
            <div>
              <h3 id="mobile-filter-title" className="text-lg font-bold text-slate-950">Filter phones</h3>
              <p className="mt-0.5 text-xs text-slate-500">Refine your search</p>
            </div>
            <button type="button" onClick={onClose} aria-label="Close filters" className="rounded-full border border-slate-200 bg-slate-50 p-2 text-slate-700 transition hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-teal-500">
            <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="min-h-0 flex-1 space-y-6 overflow-y-auto overscroll-contain px-5 py-5">
          <div>
            <p className="mb-3 text-sm font-semibold text-slate-800">Brand</p>
            <div className="flex flex-wrap gap-2">
              {brands.map((brand) => (
                <button
                  key={brand}
                  type="button"
                  onClick={() => { onBrandChange(brand); onClose(); }}
                  className={`rounded-full border px-3 py-2 text-sm transition focus:outline-none focus:ring-2 focus:ring-teal-500 ${selectedBrand === brand ? 'border-teal-700 bg-teal-50 text-teal-700' : 'border-slate-200 bg-white text-slate-700 hover:border-teal-200'}`}
                >
                  {brand}
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="mb-3 text-sm font-semibold text-slate-800">Price</p>
            <input type="range" min={0} max={Math.max(250000, priceRange.max || 250000)} value={selectedFilters.maxPrice || priceRange.max || 250000} onChange={(event) => onPriceChange(Number(event.target.value))} className="w-full accent-teal-700" />
            <div className="mt-2 flex items-center justify-between text-xs text-slate-500">
              <span>₹0</span>
              <span>₹{Number(selectedFilters.maxPrice || priceRange.max || 250000).toLocaleString('en-IN')}</span>
            </div>
          </div>

          <div>
            <p className="mb-3 text-sm font-semibold text-slate-800">Storage</p>
            <div className="flex flex-wrap gap-2">
              {storageOptions.map((storage) => (
                <button
                  key={storage}
                  type="button"
                  onClick={() => { onApply({ storage }); onClose(); }}
                  className={`rounded-full border px-3 py-2 text-sm ${selectedFilters.storage === storage ? 'border-teal-700 bg-teal-50 text-teal-700' : 'border-slate-200 bg-white text-slate-700'}`}
                >
                  {storage} GB
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="mb-3 text-sm font-semibold text-slate-800">RAM</p>
            <div className="flex flex-wrap gap-2">
              {ramOptions.map((ram) => (
                <button
                  key={ram}
                  type="button"
                  onClick={() => { onApply({ ram }); onClose(); }}
                  className={`rounded-full border px-3 py-2 text-sm ${selectedFilters.ram === ram ? 'border-teal-700 bg-teal-50 text-teal-700' : 'border-slate-200 bg-white text-slate-700'}`}
                >
                  {ram} GB
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="mb-3 text-sm font-semibold text-slate-800">Condition</p>
            <div className="flex flex-wrap gap-2">
              {conditions.map((condition) => (
                <button
                  key={condition}
                  type="button"
                  onClick={() => { onApply({ condition }); onClose(); }}
                  className={`rounded-full border px-3 py-2 text-sm ${selectedFilters.condition === condition ? 'border-teal-700 bg-teal-50 text-teal-700' : 'border-slate-200 bg-white text-slate-700'}`}
                >
                  {condition}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="shrink-0 border-t border-slate-100 bg-white px-5 pb-[calc(1rem+env(safe-area-inset-bottom))] pt-3">
          <div className="flex gap-3">
          <button type="button" onClick={onReset} className="inline-flex flex-1 items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-teal-500">
            <RotateCcw className="h-4 w-4" />
            Reset
          </button>
          <button type="button" onClick={onClose} className="inline-flex flex-1 items-center justify-center gap-2 rounded-2xl bg-teal-700 px-4 py-3 text-sm font-semibold text-white transition hover:bg-teal-800 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2">
            <Check className="h-4 w-4" />
            Apply
          </button>
          </div>
        </div>
      </div>
    </div>
  )
}
