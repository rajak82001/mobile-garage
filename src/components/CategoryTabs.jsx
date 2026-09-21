export default function CategoryTabs({ categories, activeCategory, onChange }) {
  const items = categories.length ? categories : ['All', 'Best Deals', 'Pre-Owned', 'New Arrivals']

  return (
    <div className="flex gap-3 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      {items.map((category) => {
        const active = activeCategory === category

        return (
          <button
            key={category}
            type="button"
            onClick={() => onChange(category)}
            className={`shrink-0 rounded-full border px-4 py-2.5 text-sm font-medium transition-all duration-200 ${
              active
                ? 'border-emerald-600 bg-[linear-gradient(135deg,#0f172a,#0f766e)] text-white shadow-[0_10px_24px_rgba(15,118,110,0.25)]'
                : 'border-slate-200 bg-white/85 text-slate-700 shadow-sm hover:border-slate-300 hover:bg-slate-50'
            }`}
          >
            {category}
          </button>
        )
      })}
    </div>
  )
}
