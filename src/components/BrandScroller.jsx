import { ChevronRight } from 'lucide-react'

export default function BrandScroller({ brands, activeBrand, onChange }) {
  return (
    <div className="relative">
      <div className="flex gap-3 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {brands.map((brand) => {
          const isActive = activeBrand === brand
          return (
            <button
              key={brand}
              type="button"
              onClick={() => onChange(brand)}
              className={`flex shrink-0 items-center gap-2 rounded-full border px-4 py-2.5 text-sm font-medium transition-all duration-200 ${
                isActive
                  ? 'border-emerald-600 bg-[linear-gradient(135deg,#0f172a,#0f766e)] text-white shadow-[0_10px_24px_rgba(15,118,110,0.25)]'
                  : 'border-slate-200 bg-white/80 text-slate-700 shadow-sm hover:border-slate-300 hover:bg-slate-50'
              }`}
            >
              <span className="truncate">{brand}</span>
            </button>
          )
        })}
      </div>
      <div className="pointer-events-none absolute right-0 top-0 flex h-full w-8 items-center justify-center bg-gradient-to-l from-white to-transparent md:hidden">
        <ChevronRight className="h-4 w-4 text-slate-500" />
      </div>
    </div>
  )
}
