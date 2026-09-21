export default function Footer() {
  return (
    <footer className="mt-16 border-t border-slate-200 bg-[linear-gradient(180deg,#ffffff,#f8fafc)]">
      <div className="mx-auto grid max-w-[1400px] gap-8 px-3 py-8 sm:px-5 md:grid-cols-3 lg:px-6">
        <div>
          <div className="mb-3 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,#0f172a,#0f766e)] text-base font-black text-white shadow-[0_10px_20px_rgba(15,118,110,0.2)]">M</div>
            <div className="text-lg font-black tracking-[0.08em] text-slate-900">Mobiles24</div>
          </div>
          <p className="max-w-sm text-sm leading-6 text-slate-600">Premium smartphones, trusted quality, and exceptional value for everyday buyers.</p>
        </div>

        <div>
          <h4 className="mb-3 text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Quick Links</h4>
          <ul className="space-y-2 text-sm text-slate-600">
            <li><a href="#" className="transition hover:text-emerald-700">Home</a></li>
            <li><a href="#" className="transition hover:text-emerald-700">Phones</a></li>
            <li><a href="#" className="transition hover:text-emerald-700">Offers</a></li>
            <li><a href="#" className="transition hover:text-emerald-700">Pre-Owned</a></li>
            <li><a href="#" className="transition hover:text-emerald-700">Contact</a></li>
          </ul>
        </div>

        <div>
          <h4 className="mb-3 text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Support</h4>
          <ul className="space-y-2 text-sm text-slate-600">
            <li>Local support</li>
            <li>Fast delivery</li>
            <li>Verified phones</li>
            <li>WhatsApp</li>
            <li>Instagram</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-slate-200 bg-slate-50/80">
        <div className="mx-auto flex max-w-[1400px] flex-col items-center justify-between gap-2 px-3 py-4 text-sm text-slate-500 sm:px-5 md:flex-row lg:px-6">
          <span>Powered by Phoneo</span>
          <span>© 2026 Mobiles24. All rights reserved.</span>
        </div>
      </div>
    </footer>
  )
}
