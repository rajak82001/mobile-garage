const optionClass = 'flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700'

export default function FilterPanel({ brands, selectedBrand, onBrandChange, priceRange, onPriceChange, storageOptions, ramOptions, conditions, selectedFilters, onApply, onReset }) {
  return (
    <aside className="hidden w-full max-w-xs rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm lg:block">
      <div className="mb-5 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-slate-900">Filters</h3>
        <button type="button" onClick={onReset} className="text-sm font-medium text-teal-700">Reset</button>
      </div>

      <div className="space-y-6">
        <div>
          <p className="mb-3 text-sm font-semibold text-slate-800">Brand</p>
          <div className="flex flex-wrap gap-2">
            {brands.map((brand) => (
              <button
                key={brand}
                type="button"
                onClick={() => onBrandChange(brand)}
                className={`${optionClass} ${selectedBrand === brand ? 'border-teal-700 bg-teal-50 text-teal-700' : ''}`}
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
                onClick={() => onApply({ storage })}
                className={`${optionClass} ${selectedFilters.storage === storage ? 'border-teal-700 bg-teal-50 text-teal-700' : ''}`}
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
                onClick={() => onApply({ ram })}
                className={`${optionClass} ${selectedFilters.ram === ram ? 'border-teal-700 bg-teal-50 text-teal-700' : ''}`}
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
                onClick={() => onApply({ condition })}
                className={`${optionClass} ${selectedFilters.condition === condition ? 'border-teal-700 bg-teal-50 text-teal-700' : ''}`}
              >
                {condition}
              </button>
            ))}
          </div>
        </div>
      </div>
    </aside>
  )
}
