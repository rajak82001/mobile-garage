import {
  Check,
  GitCompareArrows,
  Heart,
  PackageCheck,
  ShoppingBag,
  Star,
  Wrench,
} from "lucide-react";
import ProductImage from "./ProductImage";
import { formatPrice } from "../utils/productUtils";

export default function ProductCard({
  product,
  onSelect,
  onToggleWishlist,
  isWishlisted = false,
  onToggleCompare,
  isCompared = false,
}) {
  const discount = product.discount || 0;
  const original = product.originalPrice > 0 ? product.originalPrice : 0;
  const condition =
    product.condition === "Awsm"
      ? "Excellent"
      : product.condition === "Box Open"
        ? "Open box"
        : product.condition || "Used";
  const specs = [
    product.ram && product.ram !== "N/A" ? `${product.ram} GB RAM` : null,
    product.storage && product.storage !== "N/A"
      ? `${product.storage} GB storage`
      : null,
    product.color && product.color !== "Available" ? product.color : null,
  ].filter(Boolean);
  const note =
    typeof product.raw?.Notes === "string" ? product.raw.Notes.trim() : "";

  return (
    <article className="group flex w-full flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-[0_14px_32px_rgba(15,23,42,0.05)] transition-all duration-300 hover:-translate-y-1 hover:border-emerald-200 hover:shadow-[0_22px_42px_rgba(15,23,42,0.09)]">
      <div className="relative p-3 pb-0">
        <button
          type="button"
          aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
          onClick={() => onToggleWishlist?.(product.id)}
          className="absolute right-5 top-5 z-10 flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white/90 text-slate-600 shadow-sm backdrop-blur-sm transition hover:scale-105 hover:border-rose-200 hover:text-rose-500"
        >
          <Heart
            className={`h-4 w-4 transition ${isWishlisted ? "fill-rose-500 text-rose-500" : ""}`}
          />
        </button>

        {product.offer ? (
          <span className="absolute left-5 top-5 z-10 rounded-full bg-emerald-100 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-emerald-700 shadow-sm">
            {product.offer}
          </span>
        ) : null}

        <button
          type="button"
          onClick={() => onSelect?.(product)}
          className="block w-full text-left"
        >
          <div className="aspect-[4/3] w-full overflow-hidden rounded-2xl bg-[linear-gradient(135deg,#f8fafc,#ecfeff)] p-2 ring-1 ring-inset ring-slate-200/70 transition duration-200 group-hover:bg-[linear-gradient(135deg,#f0fdf4,#ecfeff)] sm:p-3">
            <div className="h-full w-full p-3">
              <ProductImage
                src={product.image}
                alt={product.name}
                className="h-full w-full object-contain drop-shadow-[0_12px_18px_rgba(15,118,110,0.15)]"
              />
            </div>
          </div>
        </button>
      </div>

      <div className="flex flex-col gap-2.5 p-4">
        <div className="flex min-h-5 items-center justify-between gap-2">
          <span className="text-[11px] font-bold uppercase tracking-[0.13em] text-emerald-700">
            {product.brand}
          </span>
          <span className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-slate-50 px-2 py-1 text-[10px] font-semibold text-slate-600">
            <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
            {condition}
          </span>
        </div>

        <button
          type="button"
          onClick={() => onSelect?.(product)}
          className="block text-left"
        >
          <h3 className="line-clamp-2 min-h-12 text-base font-bold leading-6 text-slate-900">
            {product.name}
          </h3>
          <div className="mt-1.5 flex min-h-6 flex-wrap content-start gap-1.5">
            {specs.length ? (
              specs.map((spec) => (
                <span
                  key={spec}
                  className="rounded-md border border-slate-200 bg-slate-50 px-2 py-1 text-[10px] font-medium text-slate-500"
                >
                  {spec}
                </span>
              ))
            ) : (
              <span className="text-xs text-slate-400">
                Specifications unavailable
              </span>
            )}
          </div>
        </button>

        <div className="border-t border-slate-100 pt-2.5">
          <div className="mb-1.5 flex flex-wrap items-center gap-2 text-[10px] font-semibold">
            <span className="inline-flex items-center gap-1 text-emerald-700">
              <PackageCheck className="h-3.5 w-3.5" />{" "}
              {product.availability || "Available"}
            </span>
            {product.isRepaired ? (
              <span className="inline-flex items-center gap-1 text-amber-700">
                <Wrench className="h-3.5 w-3.5" /> Repaired
              </span>
            ) : null}
          </div>
          <p className="text-[1.55rem] font-black leading-7 tracking-[-0.04em] text-slate-950">
            {formatPrice(product.price)}
          </p>
          {original > 0 ? (
            <div className="mt-1 flex items-center gap-2">
              <span className="text-sm text-slate-400 line-through">
                {formatPrice(original)}
              </span>
              <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-700">
                {discount}% OFF
              </span>
            </div>
          ) : null}
        </div>
        {note ? (
          <p className="line-clamp-1 text-[11px] text-slate-500" title={note}>
            {note}
          </p>
        ) : null}

        <div className="flex min-w-0 flex-col gap-1.5 sm:gap-2">
          <button
            type="button"
            onClick={() => onToggleCompare?.(product)}
            aria-pressed={isCompared}
            className={`inline-flex min-w-0 items-center justify-center gap-1 whitespace-nowrap rounded-2xl border px-1.5 py-2 text-[11px] font-semibold transition focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 sm:gap-1.5 sm:px-2 sm:py-2.5 sm:text-xs md:gap-2 md:px-2.5 md:text-sm lg:px-3 xl:px-3.5 xl:text-base ${
              isCompared
                ? "border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                : "border-slate-200 bg-white text-slate-700 hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-700"
            }`}
          >
            {isCompared ? (
              <Check className="h-3.5 w-3.5 shrink-0 sm:h-4 sm:w-4" />
            ) : (
              <GitCompareArrows className="h-3.5 w-3.5 shrink-0 sm:h-4 sm:w-4" />
            )}
            {isCompared ? "Added" : "Compare"}
          </button>
          <button
            type="button"
            onClick={() => onSelect?.(product)}
            className="inline-flex min-w-0 items-center justify-center gap-1 whitespace-nowrap rounded-2xl bg-[linear-gradient(135deg,#0f172a,#0f766e)] px-1.5 py-2 text-[11px] font-semibold text-white shadow-[0_10px_20px_rgba(15,118,110,0.2)] transition hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 sm:gap-1.5 sm:px-2 sm:py-2.5 sm:text-xs md:gap-2 md:px-2.5 md:text-sm lg:px-3 xl:px-3.5 xl:text-base"
          >
            <ShoppingBag className="h-3.5 w-3.5 shrink-0 sm:h-4 sm:w-4" />
            View Details
          </button>
        </div>
      </div>
    </article>
  );
}
