import { ArrowRight, BadgeCheck, Check, ShieldCheck, Sparkles, Star, Truck, Zap } from 'lucide-react'
import ProductImage from './ProductImage'

export default function Hero({ storeName, slogan, featuredProduct }) {
  const scrollTo = (sectionId) => {
    document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const trustItems = [
    { label: 'Quality Checked', icon: BadgeCheck },
    { label: 'Best Prices', icon: Zap },
    { label: 'Fast Delivery', icon: Truck },
    { label: 'Local Support', icon: ShieldCheck },
  ]

  const product = featuredProduct || null

  return (
    <section id="top" className="mx-auto mt-6 w-full max-w-[1400px] px-3 sm:px-5 lg:px-6">
      <div className="relative overflow-hidden rounded-[30px] border border-slate-200/80 bg-[linear-gradient(135deg,#f8fafc_0%,#ecfeff_27%,#f0fdf4_100%)] shadow-[0_30px_80px_rgba(15,23,42,0.08)]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(13,148,136,0.15),_transparent_30%),radial-gradient(circle_at_bottom_right,_rgba(14,116,144,0.14),_transparent_32%)]" />
        <div className="absolute -left-20 top-10 h-64 w-64 rounded-full bg-emerald-200/35 blur-3xl" />
        <div className="absolute -right-16 bottom-0 h-72 w-72 rounded-full bg-cyan-200/35 blur-3xl" />

        <div className="relative grid items-center gap-10 p-5 sm:p-8 lg:grid-cols-[1.15fr_0.85fr] lg:gap-12 lg:p-12">
          <div className="max-w-2xl">
            <div className="mb-5 flex flex-wrap items-center gap-3">
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-white/85 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-emerald-700 shadow-sm backdrop-blur-sm">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                {storeName}
              </div>
              <div className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-2.5 py-1.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-100">
                <Sparkles className="h-3 w-3 text-amber-300" />
                Curated by Phoneo
              </div>
            </div>

            <h1 className="max-w-2xl text-2xl font-black leading-[0.92] tracking-[-0.06em] text-slate-950 sm:text-5xl lg:text-[4.65rem]">
              Built for <span className="bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 bg-clip-text text-transparent">smarter</span>
              <br /> everyday upgrades.
            </h1>

            <p className="mt-5 max-w-xl text-base leading-7 text-slate-600 sm:text-lg">
              {slogan || 'Premium smartphones, trusted quality, and prices you will love.'}
            </p>

            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <button type="button" onClick={() => scrollTo('offers')} className="inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-950 px-6 py-3.5 text-sm font-semibold text-white shadow-[0_14px_30px_rgba(15,23,42,0.18)] transition hover:-translate-y-0.5 hover:bg-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2">
                Shop deals
                <ArrowRight className="h-4 w-4" />
              </button>
              <button type="button" onClick={() => scrollTo('phones')} className="inline-flex items-center justify-center rounded-2xl border border-slate-200 bg-white/80 px-6 py-3.5 text-sm font-semibold text-slate-700 shadow-sm backdrop-blur-sm transition hover:border-emerald-200 hover:bg-emerald-50 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2">
                Explore phones
              </button>
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/80 px-3 py-1.5 text-sm font-medium text-slate-700 shadow-sm ring-1 ring-slate-200/70">
                <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                4.8 average rating
              </div>
              <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1.5 text-sm font-medium text-emerald-700 ring-1 ring-emerald-200">
                <Check className="h-4 w-4" />
                12k+ happy shoppers
              </div>
            </div>

            <div className="mt-8 grid max-w-xl grid-cols-2 gap-x-5 gap-y-4 border-t border-slate-200/90 pt-5 sm:grid-cols-4">
              {trustItems.map(({ label, icon: Icon }) => (
                <div key={label} className="flex items-start gap-2 text-xs font-medium leading-4 text-slate-600">
                  <Icon className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-600" />
                  <span>{label}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-[440px]">
            <div className="absolute -right-6 top-8 rounded-full bg-white/80 px-3 py-2 text-xs font-semibold text-slate-700 shadow-lg ring-1 ring-slate-200 backdrop-blur-sm">
              <span className="inline-flex items-center gap-1.5"><Check className="h-3.5 w-3.5 text-emerald-600" /> Free EMI</span>
            </div>
            <div className="absolute -left-5 bottom-10 rounded-full bg-slate-950 px-3 py-2 text-xs font-semibold text-white shadow-lg">
              Up to 40% off
            </div>

            <div className="relative overflow-hidden rounded-[28px] bg-slate-950 p-4 shadow-[0_26px_60px_rgba(15,23,42,0.22)] sm:p-5">
              <div className="absolute -right-12 -top-12 h-40 w-40 rounded-full border-[22px] border-emerald-400/15" />
              <div className="absolute bottom-10 left-5 h-24 w-24 rounded-full bg-cyan-400/10 blur-2xl" />

              <div className="relative mb-4 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-emerald-300">Featured Deal</span>
                  <div className="mt-1 text-sm font-semibold text-white">Picked for value</div>
                </div>
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-400/15 px-2.5 py-1 text-[10px] font-semibold text-emerald-200 ring-1 ring-emerald-300/20">
                  <Check className="h-3 w-3" /> Verified
                </span>
              </div>

              <div className="rounded-[18px] bg-white p-3 shadow-[0_18px_40px_rgba(15,23,42,0.14)]">
                <div className="mb-3 flex h-[245px] items-center justify-center overflow-hidden rounded-[16px] bg-[linear-gradient(135deg,#f8fafc_0%,#ecfeff_100%)]">
                  {product?.image ? (
                    <ProductImage src={product.image} alt={product.name || 'Featured phone'} className="h-full w-full p-3 object-contain" />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-xs text-slate-400">Image unavailable</div>
                  )}
                </div>

                <div className="space-y-2.5 px-1 pb-1">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="text-[10px] font-bold uppercase tracking-[0.15em] text-emerald-700">{product?.brand || 'Featured'}</div>
                      <div className="mt-1 text-lg font-bold tracking-tight text-slate-900">{product?.name || 'Premium smartphone'}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-[10px] font-medium uppercase tracking-wide text-slate-400">From</div>
                      <div className="text-xl font-black tracking-[-0.04em] text-slate-950">{product?.price ? `₹${product.price.toLocaleString('en-IN')}` : '₹0'}</div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-3 border-t border-slate-100 pt-2.5 text-[11px] text-slate-500">
                    <span>{product?.ram || '8'} GB RAM</span>
                    <span>{product?.storage || '128'} GB</span>
                    <span className="font-semibold text-emerald-700">{product?.discount ? `${product.discount}% OFF` : 'Best value'}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
