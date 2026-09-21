import { BadgeDollarSign, ChevronDown, Database, Gauge, PackageCheck, Trophy, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import ProductImage from './ProductImage'
import { formatPrice } from '../utils/productUtils'

const rows = [
  ['Brand', 'brand'],
  ['Model', 'model'],
  ['Price', 'price'],
  ['RAM', 'ram', ' GB'],
  ['Storage', 'storage', ' GB'],
  ['Color', 'color'],
  ['Condition', 'condition'],
  ['Category', 'category'],
  ['Variant', 'variant'],
  ['Availability', 'availability'],
  ['Discount', 'discount', '%'],
]

const displayValue = (product, key, suffix = '') => {
  if (key === 'price') return formatPrice(product.price)
  const value = product[key]
  return value === null || value === undefined || value === '' || value === 'N/A' ? '—' : `${value}${suffix}`
}

const getNumeric = (product, key) => {
  const value = Number(product[key])
  return Number.isFinite(value) && value > 0 ? value : null
}

const getWinners = (products, key, direction = 'max') => {
  const values = products.map((product) => getNumeric(product, key))
  const available = values.filter((value) => value !== null)
  if (!available.length) return []
  const target = direction === 'min' ? Math.min(...available) : Math.max(...available)
  return products.filter((product) => getNumeric(product, key) === target)
}

const winnerLabel = (key, direction, products) => {
  const winners = getWinners(products, key, direction)
  if (!winners.length) return ''
  const names = winners.map((product) => product.name).join(' + ')
  return `${names} · ${winners.length > 1 ? 'Tie' : direction === 'min' ? 'Best value' : 'Highest'}`
}

function MobileBattle({ products, onRemove }) {
  const [category, setCategory] = useState('price')
  const [detailsOpen, setDetailsOpen] = useState(false)
  const categories = [
    ['price', 'Price'],
    ['performance', 'Performance'],
    ['storage', 'Storage'],
    ['product', 'Product'],
    ['availability', 'Availability'],
  ]
  const priceWinners = getWinners(products, 'price', 'min')
  const verdictIcons = [BadgeDollarSign, Gauge, Database]
  const categoryTitle = categories.find(([key]) => key === category)?.[1] || 'Price'
  const rowsForCategory = category === 'performance'
    ? [['RAM', 'ram', ' GB', 'max']]
    : category === 'storage'
      ? [['Storage', 'storage', ' GB', 'max']]
      : category === 'product'
        ? [['Brand', 'brand', '', ''], ['Model', 'model', '', ''], ['Color', 'color', '', ''], ['Variant', 'variant', '', '']]
        : category === 'availability'
          ? [['Condition', 'condition', '', ''], ['Availability', 'availability', '', '']]
          : [['Current price', 'price', '', 'min']]

  return (
    <div className="min-w-0 pb-[7.5rem] md:hidden">
      <div className="border-b border-slate-200 bg-[linear-gradient(135deg,#f0fdfa,#f8fafc_55%,#ecfeff)] px-4 py-4">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-xl bg-slate-950 text-xs font-black text-white">3</span>
            <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-teal-700">Phone battle</span>
          </div>
          <span className="rounded-full border border-teal-100 bg-white/80 px-2.5 py-1 text-[10px] font-bold text-slate-500">{products.length} contenders</span>
        </div>
        <h3 className="mt-3 text-xl font-black tracking-tight text-slate-950">Compare by what matters</h3>
        <p className="mt-1 text-xs text-slate-500">Find the right phone at a glance.</p>
      </div>

      <section className="px-3 pt-4">
        <div className={`grid gap-2 ${products.length === 3 ? 'grid-cols-3' : 'grid-cols-2'}`}>
          {products.map((product, index) => (
            <div key={product.id} className="relative min-w-0 rounded-2xl border border-slate-200 bg-white p-2 text-center shadow-[0_8px_20px_rgba(15,23,42,0.06)]">
              <span className="absolute left-2 top-2 flex h-5 w-5 items-center justify-center rounded-full bg-slate-100 text-[9px] font-black text-slate-500">{index + 1}</span>
              <button type="button" onClick={() => onRemove(product.id)} aria-label={`Remove ${product.name}`} className="absolute right-1 top-1 rounded-full bg-slate-100 p-1 text-slate-500 transition hover:bg-rose-50 hover:text-rose-500"><X className="h-3 w-3" /></button>
              <ProductImage src={product.image} alt={product.name} className="h-20 w-full bg-slate-50 sm:h-24" />
              <p className="mt-2 truncate text-[11px] font-bold text-slate-800">{product.name}</p>
              <p className="mt-1 truncate text-xs font-black text-slate-950">{formatPrice(product.price)}</p>
            </div>
          ))}
        </div>
        {priceWinners.length ? <p className="mt-12 sm:mt-3 flex items-center gap-2 rounded-2xl border border-emerald-100 bg-emerald-50 px-3 py-2.5 text-xs font-semibold text-emerald-800"><Trophy className="h-4 w-4 shrink-0" /><span><span className="block text-[10px] uppercase tracking-wider text-emerald-600">Best value</span>{priceWinners.map((product) => product.name).join(' + ')}</span></p> : null}
      </section>

      <section className="px-3 pt-5">
        <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500">Quick verdict</p>
        <div className="space-y-1.5 rounded-3xl border border-slate-200 bg-white p-2.5 shadow-[0_10px_24px_rgba(15,23,42,0.06)]">
          {[
            ['Lowest price', winnerLabel('price', 'min', products)],
            ['Highest RAM', winnerLabel('ram', 'max', products)],
            ['Highest storage', winnerLabel('storage', 'max', products)],
          ].filter(([, value]) => value).map(([label, value], index) => (
            <div key={label} className="flex items-center gap-2 rounded-2xl bg-slate-50 px-3 py-2.5 text-xs">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-xl bg-white text-teal-700 shadow-sm">{(() => { const Icon = verdictIcons[index]; return <Icon className="h-4 w-4" /> })()}</span>
              <span className="min-w-0 flex-1 font-semibold text-slate-500">{label}</span>
              <span className="max-w-[48%] text-right text-[11px] font-bold text-slate-800">{value}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="px-3 pt-5">
        <div className="mb-2 flex items-center justify-between"><p className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500">Compare by</p><span className="text-[10px] font-medium text-slate-400">Choose a focus</span></div>
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
          {categories.map(([key, label]) => (
            <button key={key} type="button" onClick={() => setCategory(key)} className={`shrink-0 rounded-full border px-3 py-2 text-xs font-semibold transition ${category === key ? 'border-teal-700 bg-teal-700 text-white' : 'border-slate-200 bg-white text-slate-600 hover:border-teal-200'}`}>{label}</button>
          ))}
        </div>
      </section>

      <section className="px-3 pt-5">
        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-100 bg-[linear-gradient(135deg,#f8fafc,#f0fdfa)] px-4 py-4">
            <div className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-teal-500" /><p className="text-[10px] font-bold uppercase tracking-[0.18em] text-teal-700">{categoryTitle}</p></div>
            <p className="mt-1 text-sm font-bold text-slate-900">See how they stack up</p>
          </div>
          <div className="space-y-2 p-3">
            {rowsForCategory.map(([label, key, suffix, direction]) => {
              const winners = direction ? getWinners(products, key, direction) : []
              return <div key={key} className="rounded-2xl border border-slate-100 bg-slate-50/70 p-3">
                <p className="mb-2 flex items-center gap-2 text-xs font-bold text-slate-500"><PackageCheck className="h-3.5 w-3.5 text-teal-600" />{label}</p>
                {products.map((product) => {
                  const isWinner = winners.some((winner) => winner.id === product.id)
                  return <div key={product.id} className={`mb-1.5 flex items-center justify-between gap-2 rounded-xl px-2.5 py-2 last:mb-0 ${isWinner ? 'bg-emerald-50 text-emerald-800' : 'bg-white text-slate-800'}`}>
                    <span className="min-w-0 truncate text-xs font-semibold">{product.name}</span>
                    <span className="shrink-0 text-sm font-black">{displayValue(product, key, suffix)} {isWinner ? <span className="ml-1 text-[10px] font-bold">{winners.length > 1 ? 'Tie' : direction === 'min' ? 'Best value' : 'Highest'}</span> : null}</span>
                  </div>
                })}
              </div>
            })}
          </div>
        </div>
      </section>

      <section className="px-3">
        <button type="button" onClick={() => setDetailsOpen((open) => !open)} className="flex w-full items-center justify-between rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-800 shadow-sm">
          All specifications <ChevronDown className={`h-4 w-4 transition ${detailsOpen ? 'rotate-180' : ''}`} />
        </button>
        {detailsOpen ? <div className="mt-2 space-y-3 rounded-2xl border border-slate-200 bg-white p-4 text-xs">
          <p className="font-bold uppercase tracking-wider text-teal-700">Product</p>
          {['brand', 'model', 'color', 'variant'].map((key) => <div key={key} className="grid grid-cols-[5rem_minmax(0,1fr)] gap-3 border-b border-slate-100 py-1.5"><span className="capitalize text-slate-500">{key}</span><span className="min-w-0 space-y-1 text-right font-semibold">{products.map((product) => <span key={product.id} className="block truncate">{product.name}: {displayValue(product, key)}</span>)}</span></div>)}
          <p className="pt-2 font-bold uppercase tracking-wider text-teal-700">Availability</p>
          {['condition', 'availability'].map((key) => <div key={key} className="grid grid-cols-[5rem_minmax(0,1fr)] gap-3 border-b border-slate-100 py-1.5"><span className="capitalize text-slate-500">{key}</span><span className="min-w-0 space-y-1 text-right font-semibold">{products.map((product) => <span key={product.id} className="block truncate">{product.name}: {displayValue(product, key)}</span>)}</span></div>)}
        </div> : null}
      </section>
    </div>
  )
}

export default function ComparisonModal({ products, onClose, onRemove, onSelect }) {
  const prices = products.map((product) => Number(product.price)).filter((price) => price > 0)
  const bestPrice = prices.length > 1 ? Math.min(...prices) : 0
  const hasDifferentValue = (key) => new Set(products.map((product) => String(product[key] ?? ''))).size > 1

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onClose])

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/60 p-0 backdrop-blur-sm sm:p-5" role="dialog" aria-modal="true" aria-labelledby="compare-title">
      <div className="mx-auto min-h-full max-w-6xl bg-white shadow-2xl sm:min-h-0 sm:rounded-[28px]">
        <header className="sticky top-0 z-20 flex items-center justify-between border-b border-slate-200 bg-white/95 px-4 py-4 backdrop-blur sm:rounded-t-[28px] sm:px-6 sm:py-5">
          <div><p className="text-[10px] font-bold uppercase tracking-[0.18em] text-emerald-600">Comparison</p><h2 id="compare-title" className="text-xl font-black text-slate-950 sm:text-2xl">Compare Phones</h2><p className="text-xs text-slate-500">{products.length} phones selected</p></div>
          <button type="button" onClick={onClose} aria-label="Close comparison" className="rounded-full border border-slate-200 p-2 text-slate-600 transition hover:bg-slate-100"><X className="h-5 w-5" /></button>
        </header>
        <MobileBattle products={products} onRemove={onRemove} />
        <div className="hidden overflow-x-auto md:block">
          <div className="min-w-[560px] p-3 sm:min-w-0 sm:p-6">
            <p className="mb-3 text-[11px] text-slate-400 sm:hidden">Swipe horizontally to see all specifications</p>
            <div className="grid grid-cols-[92px_repeat(3,minmax(145px,1fr))] gap-2 border-b border-slate-200 pb-4 sm:grid-cols-[145px_repeat(3,minmax(190px,1fr))] sm:gap-3">
              <div />
              {products.map((product) => (
                <div key={product.id} className="relative min-w-0 text-center">
                  <button type="button" onClick={() => onRemove(product.id)} aria-label={`Remove ${product.name} from comparison`} className="absolute right-0 top-0 rounded-full p-1 text-slate-400 hover:bg-rose-50 hover:text-rose-500"><X className="h-4 w-4" /></button>
                  <ProductImage src={product.image} alt={product.name} className="mx-auto h-24 w-full bg-slate-50 sm:h-32" />
                  <p className="mt-2 line-clamp-2 text-xs font-bold text-slate-900 sm:text-sm">{product.name}</p>
                  {bestPrice > 0 && Number(product.price) === bestPrice ? <span className="mt-2 inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-1 text-[10px] font-bold text-amber-700"><Trophy className="h-3 w-3" /> Best price</span> : null}
                </div>
              ))}
            </div>
            <div className="divide-y divide-slate-100">
              {rows.map(([label, key, suffix]) => {
                const different = hasDifferentValue(key)
                return <div key={key} className="grid grid-cols-[92px_repeat(3,minmax(145px,1fr))] gap-2 py-2.5 sm:grid-cols-[145px_repeat(3,minmax(190px,1fr))] sm:gap-3 sm:py-3">
                  <span className="sticky left-0 z-10 -ml-1 self-center bg-white py-1 text-xs font-semibold text-slate-500 sm:static sm:ml-0 sm:text-sm">{label}</span>
                  {products.map((product) => <span key={product.id} className={`self-center rounded-lg px-2 py-1 text-center text-xs font-semibold sm:text-sm ${different ? 'bg-emerald-50 text-emerald-800' : 'text-slate-800'}`}>{displayValue(product, key, suffix)}</span>)}
                </div>
              })}
            </div>
            <div className="mt-3 grid grid-cols-[92px_repeat(3,minmax(145px,1fr))] gap-2 sm:grid-cols-[145px_repeat(3,minmax(190px,1fr))] sm:gap-3">
              <div />
              {products.map((product) => <button key={product.id} type="button" onClick={() => onSelect(product)} className="rounded-full bg-slate-950 px-3 py-2 text-xs font-semibold text-white transition hover:bg-teal-700">View details</button>)}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
