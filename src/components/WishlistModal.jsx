import { ArrowRight, Heart, X } from 'lucide-react'
import ProductImage from './ProductImage'
import { formatPrice } from '../utils/productUtils'

export default function WishlistModal({ products, onClose, onRemove, onToggleCompare, compareProducts, onCompare, onSelect, onExplore }) {
  const drops = products.filter(({ wishlistItem, product }) => Number(product.price) < Number(wishlistItem.savedPrice))
  const savings = drops.reduce((total, { wishlistItem, product }) => total + Number(wishlistItem.savedPrice) - Number(product.price), 0)

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/60 p-2 backdrop-blur-sm sm:p-5" role="dialog" aria-modal="true" aria-labelledby="wishlist-title">
      <div className="mx-auto min-h-full max-w-6xl rounded-[28px] bg-slate-50 shadow-2xl">
        <header className="flex items-start justify-between border-b border-slate-200 bg-white px-4 py-5 sm:px-7">
          <div><p className="text-[10px] font-bold uppercase tracking-[0.18em] text-rose-500">Saved for later</p><h2 id="wishlist-title" className="text-2xl font-black text-slate-950">My Wishlist</h2><p className="mt-1 text-sm text-slate-500">{products.length} phones saved{drops.length ? ` · ${drops.length} price drops` : ''}</p></div>
          <button type="button" onClick={onClose} aria-label="Close wishlist" className="rounded-full border border-slate-200 p-2 text-slate-600 hover:bg-slate-100"><X className="h-5 w-5" /></button>
        </header>
        {savings > 0 ? <div className="mx-4 mt-4 rounded-2xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-800 sm:mx-7">Price drops available: save {formatPrice(savings)} today</div> : null}
        {products.length === 0 ? (
          <div className="flex min-h-[55vh] flex-col items-center justify-center px-6 text-center"><Heart className="h-12 w-12 fill-rose-100 text-rose-400" /><h3 className="mt-4 text-xl font-bold text-slate-900">Your wishlist is empty</h3><p className="mt-2 max-w-sm text-sm text-slate-500">Save phones you love and come back to them anytime.</p><button type="button" onClick={onExplore} className="mt-5 inline-flex items-center gap-2 rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white hover:bg-teal-700">Explore phones <ArrowRight className="h-4 w-4" /></button></div>
        ) : (
          <div className="p-4 sm:p-7">
            <div className="grid gap-4 min-[540px]:grid-cols-2 lg:grid-cols-3">
              {products.map(({ product, wishlistItem }) => {
                const currentPrice = Number(product.price)
                const savedPrice = Number(wishlistItem.savedPrice)
                const drop = currentPrice < savedPrice
                const increased = currentPrice > savedPrice
                const compared = compareProducts.some((item) => item.id === product.id)
                return <article key={product.id} className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-3 shadow-sm">
                  <button type="button" onClick={() => onRemove(product.id)} aria-label={`Remove ${product.name} from wishlist`} className="absolute right-5 top-5 z-10 rounded-full bg-white p-2 text-rose-500 shadow-sm hover:bg-rose-50"><Heart className="h-4 w-4 fill-rose-500" /></button>
                  {drop ? <span className="absolute left-5 top-5 z-10 rounded-full bg-emerald-100 px-2 py-1 text-[10px] font-bold text-emerald-700">Price drop {formatPrice(savedPrice - currentPrice)}</span> : null}
                  <button type="button" onClick={() => onSelect(product)} className="block w-full text-left"><ProductImage src={product.image} alt={product.name} className="h-52 w-full bg-slate-50" /><p className="mt-4 text-[11px] font-bold uppercase tracking-wider text-emerald-700">{product.brand}</p><h3 className="mt-1 line-clamp-2 font-bold text-slate-900">{product.name}</h3></button>
                  <div className="mt-3 flex items-end gap-2"><span className="text-xl font-black text-slate-950">{formatPrice(currentPrice)}</span>{drop || increased ? <span className="text-xs text-slate-400 line-through">{formatPrice(savedPrice)}</span> : null}</div>
                  {drop ? <p className="mt-1 text-xs font-semibold text-emerald-700">You save {formatPrice(savedPrice - currentPrice)}</p> : null}
                  {increased ? <p className="mt-1 text-xs font-medium text-slate-500">Price increased since you saved it</p> : null}
                  <button type="button" onClick={() => onToggleCompare(product)} aria-pressed={compared} className={`mt-4 w-full rounded-full border px-3 py-2 text-xs font-semibold ${compared ? 'border-emerald-200 bg-emerald-50 text-emerald-700' : 'border-slate-200 text-slate-700 hover:border-emerald-200'}`}>{compared ? '✓ Selected' : 'Compare'}</button>
                </article>
              })}
            </div>
            <div className="mt-6 flex flex-col items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white p-4 sm:flex-row"><span className="text-sm font-semibold text-slate-700">{compareProducts.length} phones selected</span><button type="button" onClick={onCompare} disabled={compareProducts.length < 2} className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-4 py-2 text-sm font-semibold text-white hover:bg-teal-700 disabled:cursor-not-allowed disabled:opacity-40">Compare selected <ArrowRight className="h-4 w-4" /></button></div>
          </div>
        )}
      </div>
    </div>
  )
}
