import { ChevronDown, Heart, MapPin, Menu, SlidersHorizontal, ShoppingBag, Sparkles, X } from 'lucide-react'
import SearchBar from './SearchBar'

export default function Header({ onOpenFilters, onToggleMenu, mobileMenuOpen = false, onOpenWishlist, wishlistCount = 0, search, onSearchChange, onClearSearch, storeName = 'Mobiles24', storeAddress = '' }) {
  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/60 bg-white/85 shadow-[0_12px_30px_rgba(15,23,42,0.06)] backdrop-blur-xl">
      <div className="mx-auto max-w-[1400px] px-3 py-3 sm:px-5 lg:px-6">
        <div className="flex items-center gap-3">
          <div className="flex min-w-0 items-center gap-2.5">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,#0f172a,#0f766e)] text-base font-black text-white shadow-[0_8px_18px_rgba(15,118,110,0.28)]">M</div>
            <div className="min-w-0">
              <div className="truncate text-sm font-black tracking-[0.08em] text-slate-950">{storeName}</div>
              {storeAddress ? (
                <div className="hidden max-w-[180px] items-center gap-1 truncate text-[10px] font-medium text-slate-500 sm:flex" title={storeAddress}>
                  <MapPin className="h-3 w-3 shrink-0 text-emerald-600" />
                  {storeAddress}
                  <ChevronDown className="h-3 w-3 shrink-0" />
                </div>
              ) : null}
            </div>
          </div>

          <div className="hidden max-w-2xl flex-1 md:block">
            <SearchBar value={search} onChange={onSearchChange} onClear={onClearSearch} />
          </div>

          <div className="ml-auto hidden items-center gap-2 md:flex">
            <button
              type="button"
              onClick={onOpenFilters}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm font-medium text-slate-700 shadow-sm transition hover:border-emerald-200 hover:bg-emerald-50"
            >
              <SlidersHorizontal className="h-4 w-4" />
              Filters
            </button>
            <button
              type="button"
              onClick={onOpenWishlist}
              className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:border-rose-200 hover:bg-rose-50 hover:text-rose-500"
              aria-label="Wishlist"
            >
              <Heart className="h-4 w-4" />
              {wishlistCount > 0 ? <span className="absolute ml-8 mt-7 flex h-4 min-w-4 items-center justify-center rounded-full bg-rose-500 px-1 text-[9px] font-bold text-white">{wishlistCount}</span> : null}
            </button>
            <button
              type="button"
              className="flex items-center gap-2 rounded-xl bg-[linear-gradient(135deg,#0f172a,#0f766e)] px-4 py-2.5 text-sm font-semibold text-white shadow-[0_12px_22px_rgba(15,118,110,0.24)] transition hover:-translate-y-0.5"
            >
              <ShoppingBag className="h-4 w-4" />
              Cart
            </button>
          </div>

          <div className="ml-auto flex items-center gap-2 md:hidden">
            <button
              type="button"
              onClick={onOpenWishlist}
              className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:border-rose-200 hover:text-rose-500"
              aria-label="Wishlist"
            >
              <Heart className="h-4 w-4" />
              {wishlistCount > 0 ? <span className="absolute ml-7 mt-7 flex h-4 min-w-4 items-center justify-center rounded-full bg-rose-500 px-1 text-[9px] font-bold text-white">{wishlistCount}</span> : null}
            </button>
            <button
              type="button"
              onClick={onToggleMenu}
              className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-950 text-white shadow-sm transition hover:bg-emerald-600"
              aria-expanded={mobileMenuOpen}
              aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>

      <nav className="hidden border-t border-slate-100 bg-slate-50/70 md:block" aria-label="Primary navigation">
        <div className="mx-auto flex max-w-[1400px] items-center gap-7 px-6 py-2.5 text-xs font-semibold text-slate-500">
          <a href="#top" className="rounded-full px-2.5 py-1.5 text-slate-950 transition hover:bg-white hover:text-emerald-700">Home</a>
          <a href="#phones" className="rounded-full px-2.5 py-1.5 transition hover:bg-white hover:text-emerald-700">All phones</a>
          <a href="#offers" className="inline-flex items-center gap-1 rounded-full px-2.5 py-1.5 transition hover:bg-white hover:text-emerald-700">
            <Sparkles className="h-3.5 w-3.5 text-emerald-600" />
            Latest deals
          </a>
          <a href="#brands" className="rounded-full px-2.5 py-1.5 transition hover:bg-white hover:text-emerald-700">Shop by brand</a>
        </div>
      </nav>

      <div className="mx-auto max-w-[1400px] px-3 pb-3 sm:px-5 md:hidden">
        <SearchBar value={search} onChange={onSearchChange} onClear={onClearSearch} />
        <div className="mt-2.5 flex items-center gap-2">
          <button type="button" onClick={onOpenFilters} className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-slate-950 px-3 py-2 text-xs font-semibold text-white shadow-sm">
            <SlidersHorizontal className="h-3.5 w-3.5" /> Filters
          </button>
          <a href="#offers" className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-emerald-100 bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-800">
            <Sparkles className="h-3.5 w-3.5" /> Deals
          </a>
          <a href="#phones" className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 shadow-sm">
            <ShoppingBag className="h-3.5 w-3.5" /> Phones
          </a>
        </div>
      </div>
    </header>
  )
}
