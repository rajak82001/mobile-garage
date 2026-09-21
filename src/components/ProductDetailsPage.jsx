import {
  ArrowLeft,
  Battery,
  Camera,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  Cpu,
  Filter,
  Heart,
  GitCompareArrows,
  Maximize2,
  MemoryStick,
  PackageCheck,
  Phone,
  Ruler,
  Search,
  ShoppingBag,
  Smartphone,
  Wifi,
  X,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import Footer from "./Footer";
import Header from "./Header";
import ProductImage from "./ProductImage";
import { formatPrice } from "../utils/productUtils";
import useProductDetails from "../hooks/useProductDetails";

const isDisplayableValue = (value) =>
  value !== null &&
  value !== undefined &&
  typeof value !== "object" &&
  String(value).trim() !== "" &&
  !["null", "undefined", "false"].includes(String(value).trim().toLowerCase());
const normalizeSpecValue = (value) =>
  Array.isArray(value)
    ? value.filter(Boolean).map(String)
    : isDisplayableValue(value)
      ? [String(value)]
      : [];
const resolveImageUrl = (src) => {
  if (!src || typeof src !== "string") return "";
  if (/^https?:\/\//i.test(src)) return src;
  return `https://super.phoneo.in/${src.replace(/^\/+/, "")}`;
};
const isUsableImageUrl = (value) => {
  if (!value || typeof value !== "string") return false;
  try {
    const url = new URL(value, window.location.origin);
    return ["http:", "https:"].includes(url.protocol);
  } catch {
    return false;
  }
};
const normalizeImageUrls = (values) => [
  ...new Set(
    values
      .map(resolveImageUrl)
      .filter(isUsableImageUrl),
  ),
];
const normalizeColorKey = (value) => String(value || "").trim().toLowerCase();
const getMatchingColorKey = (colorMap, color) => {
  const normalizedColor = normalizeColorKey(color);
  return Object.keys(colorMap || {}).find(
    (key) => normalizeColorKey(key) === normalizedColor,
  );
};
const getColorImages = (colorMap, color) => {
  const matchingKey = getMatchingColorKey(colorMap, color);
  return matchingKey ? colorMap[matchingKey] : [];
};

const getSectionIcon = (title) =>
  ({
    Battery,
    Display: Smartphone,
    Platform: Cpu,
    Network: Wifi,
    "Main Camera": Camera,
    "Selfie camera": Camera,
    Body: Ruler,
    Memory: MemoryStick,
  })[title] || Smartphone;

export default function ProductDetailsPage({
  product,
  products = [],
  store,
  wishlist,
  onToggleWishlist,
  onToggleCompare,
  isCompared,
  onBack,
  onOpenWishlist,
  wishlistCount,
  onOpenProduct,
}) {
  const {
    data: technicalDetails,
    loading: technicalLoading,
    error: technicalError,
    retry: retryTechnicalDetails,
  } = useProductDetails(product);
  const apiBrand = technicalDetails?.brand;
  const apiPhoneName = technicalDetails?.phone_name;
  const apiTitle = [apiBrand, apiPhoneName]
    .filter(isDisplayableValue)
    .join(" ");
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [viewerOpen, setViewerOpen] = useState(false);
  const [touchStart, setTouchStart] = useState(null);
  const [detailsQuery, setDetailsQuery] = useState("");
  const [highlightsExpanded, setHighlightsExpanded] = useState(false);
  const [showTopButton, setShowTopButton] = useState(false);
  const [selectedColor, setSelectedColor] = useState("");
  const [colorGalleryFailed, setColorGalleryFailed] = useState(false);
  const thumbnailRefs = useRef([]);
  const isWishlisted = wishlist.some((item) => item.id === product.id);
  const rawCondition = product.raw?.Condition || product.raw?.condition;
  const condition = isDisplayableValue(rawCondition)
    ? rawCondition === "Awsm"
      ? "Excellent"
      : rawCondition === "Box Open"
        ? "Open box"
        : rawCondition
    : "";
  const relatedProducts = useMemo(() => {
    const normalizedBrand = String(product.brand || "").toLowerCase();
    const normalizedModel = String(
      product.model || product.name || "",
    ).toLowerCase();
    const currentPrice = Number(product.price) || 0;

    return products
      .filter((item) => String(item.id) !== String(product.id))
      .map((item) => {
        const itemBrand = String(item.brand || "").toLowerCase();
        const itemModel = String(item.model || item.name || "").toLowerCase();
        const sameBrand = itemBrand === normalizedBrand;
        const sameModelFamily =
          sameBrand &&
          (itemModel.includes(normalizedModel) ||
            normalizedModel.includes(itemModel));
        const sameCategory =
          item.category && item.category === product.category;
        const priceDistance =
          currentPrice && item.price
            ? Math.abs(Number(item.price) - currentPrice) / currentPrice
            : 1;

        return {
          item,
          score:
            (sameModelFamily ? 400 : 0) +
            (sameBrand ? 200 : 0) +
            (sameCategory ? 100 : 0) +
            Math.max(0, 50 - priceDistance * 50),
        };
      })
      .sort((a, b) => b.score - a.score)
      .slice(0, 4)
      .map(({ item }) => item);
  }, [product, products]);
  const technicalSections = useMemo(
    () =>
      (technicalDetails?.specifications || [])
        .map((section) => ({
          title: section.title,
          icon: getSectionIcon(section.title),
          rows: (section.specs || []).flatMap((spec) =>
            section.title === "Misc" &&
            String(spec.key || "").trim().toLowerCase() === "price"
              ? []
              : normalizeSpecValue(spec.val).map((value) => [spec.key, value]),
          ),
        }))
        .filter((section) => section.rows.length),
    [technicalDetails],
  );
  const colorGalleries = useMemo(() => {
    const colorMap = technicalDetails?.color || {};
    return Object.keys(colorMap).map((name) => ({
      name,
      images: normalizeImageUrls(normalizeSpecValue(colorMap[name])),
    }));
  }, [technicalDetails]);
  const storeColorKey = getMatchingColorKey(
    technicalDetails?.color,
    product.color,
  );
  const selectedColorKey = getMatchingColorKey(
    technicalDetails?.color,
    selectedColor,
  );
  const effectiveColorKey = selectedColorKey || storeColorKey;
  const selectedColorGallery = useMemo(
    () =>
      effectiveColorKey
        ? {
            name: effectiveColorKey,
            images: normalizeImageUrls(
              normalizeSpecValue(
                getColorImages(technicalDetails?.color, effectiveColorKey),
              ),
            ),
          }
        : null,
    [effectiveColorKey, technicalDetails],
  );
  const phoneImages = useMemo(
    () => normalizeImageUrls(normalizeSpecValue(technicalDetails?.phone_images)),
    [technicalDetails],
  );
  const technicalImages = useMemo(
    () => {
      if (selectedColorGallery?.images.length && !colorGalleryFailed) {
        return selectedColorGallery.images;
      }
      if (phoneImages.length) return phoneImages;
      return normalizeImageUrls(normalizeSpecValue(technicalDetails?.thumbnail));
    },
    [colorGalleryFailed, selectedColorGallery, phoneImages, technicalDetails],
  );

  const images = [...new Set(technicalImages)];
  const ramVariants = useMemo(
    () => [
      ...new Set(
        (Array.isArray(technicalDetails?.ram) ? technicalDetails.ram : [])
          .map((variant) =>
            typeof variant === "string" ? variant : variant?.ram,
          )
          .filter(isDisplayableValue)
          .map(String),
      ),
    ],
    [technicalDetails],
  );
  const highlights = [
    {
      label: "Processor",
      value: technicalSections
        .flatMap((section) => section.rows)
        .find(([key]) => /chipset|processor|cpu/i.test(key))?.[1],
      icon: Cpu,
    },
    {
      label: "Rear Camera",
      value: technicalSections.find(
        (section) => section.title === "Main Camera",
      )?.rows[0]?.[1],
      icon: Camera,
    },
    {
      label: "Display",
      value: technicalSections
        .find((section) => section.title === "Display")
        ?.rows.find(([key]) => /size|type/i.test(key))?.[1],
      icon: Smartphone,
    },
    {
      label: "Battery",
      value: technicalSections.find((section) => section.title === "Battery")
        ?.rows[0]?.[1],
      icon: Battery,
    },
    {
      label: "Front Camera",
      value: technicalSections.find(
        (section) => section.title === "Selfie camera",
      )?.rows[0]?.[1],
      icon: Camera,
    },
  ];
  const detailSections = technicalSections;
  const availableHighlights = highlights.filter(({ value }) =>
    isDisplayableValue(value),
  );
  const visibleHighlights = highlightsExpanded
    ? availableHighlights
    : availableHighlights.slice(0, 6);
  const normalizedDetailsQuery = detailsQuery.trim().toLowerCase();
  const filteredHighlights = visibleHighlights.filter(({ label, value }) =>
    `${label} ${value}`.toLowerCase().includes(normalizedDetailsQuery),
  );
  const filteredSections = detailSections
    .map((section) => ({
      ...section,
      rows: section.rows.filter(([label, value]) =>
        `${label} ${value}`.toLowerCase().includes(normalizedDetailsQuery),
      ),
    }))
    .filter((section) => !normalizedDetailsQuery || section.rows.length);
  useEffect(() => {
    setActiveImageIndex(0);
    setSelectedColor("");
    setColorGalleryFailed(false);
    setViewerOpen(false);
    setTouchStart(null);
    thumbnailRefs.current = [];
  }, [product.id, product.brand, product.model]);

  useEffect(() => {
    if (!selectedColor && storeColorKey) {
      setSelectedColor(storeColorKey);
    }
  }, [selectedColor, storeColorKey]);

  useEffect(() => {
    setActiveImageIndex(0);
    setColorGalleryFailed(false);
  }, [effectiveColorKey]);

  useEffect(() => {
    if (!images.length) return;
    setActiveImageIndex((index) => Math.min(index, images.length - 1));
  }, [images.length]);

  useEffect(() => {
    thumbnailRefs.current[activeImageIndex]?.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: "center",
    });
  }, [activeImageIndex]);

  useEffect(() => {
    const handleScroll = () => setShowTopButton(window.scrollY > 500);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (!viewerOpen) return undefined;
    const handleKey = (event) => {
      if (event.key === "Escape") setViewerOpen(false);
      if (!images.length) return;
      if (event.key === "ArrowRight")
        setActiveImageIndex((index) => (index + 1) % images.length);
      if (event.key === "ArrowLeft")
        setActiveImageIndex(
          (index) => (index - 1 + images.length) % images.length,
        );
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [viewerOpen, images.length]);

  const changeImage = (direction) => {
    setActiveImageIndex(
      (index) => (index + direction + images.length) % images.length,
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Header
        storeName={store?.shopName || "Mobiles24"}
        storeAddress={store?.address}
        onOpenWishlist={onOpenWishlist}
        wishlistCount={wishlistCount}
        onOpenFilters={() => {}}
        onToggleMenu={() => {}}
      />
      <main className="mx-auto max-w-7xl px-3 py-5 sm:px-5 lg:px-6">
        <button
          type="button"
          onClick={onBack}
          className="mb-5 inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-600 shadow-sm transition hover:border-teal-200 hover:text-teal-700"
        >
          <ArrowLeft className="h-4 w-4" /> Back to phones
        </button>
        <div className="mb-3 flex items-center gap-2 text-sm text-slate-500">
          <span>Home</span>
          <ChevronRight className="h-3.5 w-3.5" />
          <span>{apiBrand}</span>
          <ChevronRight className="h-3.5 w-3.5" />
          <span className="truncate text-slate-800">{apiTitle}</span>
        </div>
        <div className="mb-6 flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-3 py-2 text-slate-500 shadow-sm">
          <Search className="h-5 w-5 shrink-0 text-slate-800" />
          <input
            value={detailsQuery}
            onChange={(event) => setDetailsQuery(event.target.value)}
            placeholder="Search anything about phone"
            aria-label="Search product details"
            className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-slate-500"
          />
          <Filter className="h-5 w-5 shrink-0 text-teal-700" />
        </div>

        <section className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr] lg:gap-10">
          <div className="min-w-0">
            <div
              className="relative flex min-h-[360px] items-center justify-center overflow-hidden rounded-[28px] border border-slate-200 bg-[linear-gradient(135deg,#f8fafc,#ecfeff)] p-5 shadow-sm sm:min-h-[520px]"
              onTouchStart={(event) =>
                setTouchStart(event.changedTouches[0].clientX)
              }
              onTouchEnd={(event) => {
                if (touchStart === null || images.length < 2) return;
                const distance = event.changedTouches[0].clientX - touchStart;
                if (Math.abs(distance) > 40) changeImage(distance > 0 ? -1 : 1);
                setTouchStart(null);
              }}
            >
              <ProductImage
                src={images[activeImageIndex]}
                alt={`${apiTitle || "Product"} image ${activeImageIndex + 1}`}
                fallback={false}
                onError={() => {
                  if (selectedColorGallery?.images.length) {
                    setColorGalleryFailed(true);
                  }
                }}
                className="h-[330px] w-full bg-transparent sm:h-[470px]"
              />
              <button
                type="button"
                onClick={() => setViewerOpen(true)}
                aria-label="Open full-screen image viewer"
                className="absolute bottom-4 right-4 rounded-full border border-slate-200 bg-white/90 p-2.5 text-slate-600 shadow-sm hover:text-teal-700"
              >
                <Maximize2 className="h-4 w-4" />
              </button>
              {images.length > 1 ? (
                <>
                  <button
                    type="button"
                    onClick={() => changeImage(-1)}
                    aria-label="Previous product image"
                    className="absolute left-3 top-1/2 rounded-full border border-slate-200 bg-white/90 p-2 text-slate-700 shadow-sm"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => changeImage(1)}
                    aria-label="Next product image"
                    className="absolute right-3 top-1/2 rounded-full border border-slate-200 bg-white/90 p-2 text-slate-700 shadow-sm"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </>
              ) : null}
              {images.length > 1 ? (
                <span className="absolute bottom-4 left-4 rounded-full bg-slate-950/80 px-2.5 py-1 text-[10px] font-bold text-white">
                  {activeImageIndex + 1} / {images.length}
                </span>
              ) : null}
            </div>
            {images.length > 1 ? (
              <div
                className="mt-3 flex snap-x snap-proximity gap-3 overflow-x-auto pb-2"
                aria-label="Product image thumbnails"
              >
                {images.map((image, index) => (
                  <button
                    ref={(element) => {
                      thumbnailRefs.current[index] = element;
                    }}
                    key={image}
                    type="button"
                    onClick={() => setActiveImageIndex(index)}
                    aria-label={`Select image ${index + 1}`}
                    aria-current={
                      index === activeImageIndex ? "true" : undefined
                    }
                    className={`h-[72px] w-[72px] shrink-0 snap-center overflow-hidden rounded-xl border-2 bg-white p-1.5 transition ${index === activeImageIndex ? "border-teal-600 shadow-[0_0_0_2px_rgba(13,148,136,0.18)]" : "border-slate-200 hover:border-teal-300"}`}
                  >
                    <ProductImage
                      src={image}
                      alt={`${apiTitle || "Product"} thumbnail ${index + 1}`}
                      fallback={false}
                      onError={() => {
                        if (selectedColorGallery?.images.length) {
                          setColorGalleryFailed(true);
                        }
                      }}
                      className="h-full w-full rounded-lg"
                    />
                  </button>
                ))}
              </div>
            ) : null}
            {colorGalleries.length > 1 ? (
              <div className="mt-4 flex flex-wrap gap-2">
                <span className="self-center text-xs font-semibold text-slate-500">
                  Technical colors:
                </span>
                {colorGalleries.map((gallery) => (
                  <button
                    key={gallery.name}
                    type="button"
                    onClick={() => {
                      setSelectedColor(gallery.name);
                      setActiveImageIndex(0);
                      setColorGalleryFailed(false);
                    }}
                    className={`rounded-full border px-3 py-1 text-xs ${gallery.name === selectedColor ? "border-teal-600 bg-teal-50 text-teal-700" : "border-slate-200 text-slate-600"}`}
                  >
                    {gallery.name}
                  </button>
                ))}
              </div>
            ) : null}
          </div>

          <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm sm:p-8">
            <div className="flex items-center justify-between gap-3">
              <span className="text-xs font-bold uppercase tracking-[0.16em] text-teal-700">
                {apiBrand}
              </span>
              <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                {condition}
              </span>
            </div>
            <h1 className="mt-4 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
              {apiTitle}
            </h1>
            <p className="mt-2 text-sm text-slate-500">
              {[
                product.color !== "Available" ? product.color : "",
                product.ram !== "N/A" ? `${product.ram} GB RAM` : "",
                product.storage !== "N/A"
                  ? `${product.storage} GB storage`
                  : "",
              ]
                .filter(Boolean)
                .join(" · ")}
            </p>
            <div className="mt-7 flex flex-wrap items-end gap-3">
              <span className="text-4xl font-black tracking-tight text-slate-950">
                {formatPrice(product.price)}
              </span>
              {product.originalPrice > 0 ? (
                <>
                  <span className="text-lg text-slate-400 line-through">
                    {formatPrice(product.originalPrice)}
                  </span>
                  <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-700">
                    {product.discount}% OFF
                  </span>
                </>
              ) : null}
            </div>
            <div className="mt-7 grid grid-cols-2 gap-2 sm:flex">
              <button
                type="button"
                onClick={() => onToggleWishlist(product.id)}
                className={`inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl border px-4 text-sm font-semibold ${isWishlisted ? "border-rose-200 bg-rose-50 text-rose-600" : "border-slate-200 text-slate-700 hover:bg-slate-50"}`}
              >
                <Heart
                  className={`h-4 w-4 ${isWishlisted ? "fill-rose-500" : ""}`}
                />
                {isWishlisted ? "Saved" : "Wishlist"}
              </button>
              <button
                type="button"
                onClick={() => onToggleCompare(product)}
                className={`inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl border px-4 text-sm font-semibold ${isCompared ? "border-teal-200 bg-teal-50 text-teal-700" : "border-slate-200 text-slate-700 hover:bg-slate-50"}`}
              >
                <GitCompareArrows className="h-4 w-4" />
                {isCompared ? "Added" : "Compare"}
              </button>
            </div>
            <a
              href={store?.phone ? `tel:${store.phone}` : "#store-information"}
              className="mt-3 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-2xl bg-slate-950 px-5 text-sm font-semibold text-white transition hover:bg-teal-700"
            >
              <ShoppingBag className="h-4 w-4" /> Contact store
            </a>
            <div className="mt-7 grid gap-2 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm">
              <div className="flex justify-between gap-3">
                <span className="text-slate-500">Availability</span>
                <b>{product.availability}</b>
              </div>
              <div className="flex justify-between gap-3">
                <span className="text-slate-500">Category</span>
                <b>{product.category}</b>
              </div>
              <div className="flex justify-between gap-3">
                <span className="text-slate-500">Variant</span>
                <b>{product.variant}</b>
              </div>
            </div>
            {technicalDetails?.release_date ||
            technicalDetails?.dimension ||
            technicalDetails?.os ||
            technicalDetails?.storage ? (
              <div className="mt-4 grid gap-2 rounded-2xl border border-teal-100 bg-teal-50/50 p-4 text-sm">
                <p className="text-xs font-bold uppercase tracking-wider text-teal-700">
                  Product overview
                </p>
                {technicalDetails.release_date ? (
                  <div className="flex justify-between gap-3">
                    <span className="text-slate-500">Release</span>
                    <b className="text-right">
                      {technicalDetails.release_date}
                    </b>
                  </div>
                ) : null}
                {technicalDetails.os ? (
                  <div className="flex justify-between gap-3">
                    <span className="text-slate-500">OS</span>
                    <b className="text-right">{technicalDetails.os}</b>
                  </div>
                ) : null}
                {technicalDetails.dimension ? (
                  <div className="flex justify-between gap-3">
                    <span className="text-slate-500">Dimensions / weight</span>
                    <b className="text-right">{technicalDetails.dimension}</b>
                  </div>
                ) : null}
                {technicalDetails.storage ? (
                  <div className="flex justify-between gap-3">
                    <span className="text-slate-500">Storage</span>
                    <b className="text-right">{technicalDetails.storage}</b>
                  </div>
                ) : null}
              </div>
            ) : null}
          </div>
        </section>
        {filteredHighlights.length ? (
          <section className="mt-8 border-t border-slate-200 pt-5">
            <h2 className="mb-2 text-lg font-black text-teal-700">
              Highlights
            </h2>
            <div className="divide-y divide-slate-200 rounded-xl bg-white">
              {filteredHighlights.map(({ label, value, icon: Icon }) => (
                <div
                  key={label}
                  className="flex min-h-[84px] items-center gap-5 px-4 py-3"
                >
                  <Icon className="h-9 w-9 shrink-0 stroke-[1.4] text-slate-700" />
                  <div className="min-w-0">
                    <p className="text-base text-slate-500">{label}</p>
                    <p className="text-base font-medium text-slate-900">
                      {value}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            {availableHighlights.length > 6 ? (
              <button
                type="button"
                onClick={() => setHighlightsExpanded((expanded) => !expanded)}
                className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-slate-300 py-3 text-sm font-medium text-slate-900 hover:bg-slate-400"
              >
                {highlightsExpanded ? "See Less" : "See More"}
                {highlightsExpanded ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </button>
            ) : null}
          </section>
        ) : null}
        {ramVariants.length ? (
          <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <h2 className="text-sm font-bold text-slate-700">
              Technical RAM / storage options
            </h2>
            <div className="mt-3 flex flex-wrap gap-2">
              {ramVariants.map((variant) => (
                <span
                  key={variant}
                  className="rounded-full border border-slate-200 px-3 py-1 text-xs text-slate-600"
                >
                  {variant}
                </span>
              ))}
            </div>
            <p className="mt-2 text-xs text-slate-500">
              Prices and availability are taken only from the store listing
              above.
            </p>
          </section>
        ) : null}
        {technicalLoading ? (
          <div className="mt-8 rounded-xl border border-slate-200 bg-white p-5 text-sm text-slate-500">
            Loading technical specifications...
          </div>
        ) : null}
        {technicalError ? (
          <div className="mt-8 flex items-center justify-between gap-4 rounded-xl border border-amber-200 bg-amber-50 p-5 text-sm text-amber-800">
            <span>{technicalError}</span>
            <button
              type="button"
              onClick={retryTechnicalDetails}
              className="shrink-0 rounded-lg bg-amber-700 px-3 py-2 font-semibold text-white"
            >
              Retry
            </button>
          </div>
        ) : null}
        {filteredSections.map(({ title, icon: Icon, rows }) => (
          <section key={title} className="mt-6 border-t border-slate-200 pt-5">
            <div className="mb-3 flex items-center gap-2">
              <Icon className="h-5 w-5 text-teal-700" />
              <h2 className="text-lg font-black text-teal-700">{title}</h2>
            </div>
            {rows.length ? (
              <div className="divide-y divide-slate-200 rounded-xl bg-white px-2">
                {rows.map(([label, value]) => (
                  <div
                    key={`${label}-${value}`}
                    className="grid grid-cols-[minmax(125px,0.8fr)_1.2fr] gap-4 px-2 py-2 text-sm"
                  >
                    <strong className="text-slate-900">{label} :</strong>
                    <span className="whitespace-pre-line break-words text-slate-800">
                      {value}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="rounded-xl bg-white px-4 py-3 text-sm text-slate-500">
                No {title.toLowerCase()} details were returned by the API.
              </p>
            )}
          </section>
        ))}
        <section className="mt-8 grid gap-6 lg:grid-cols-2">
          <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
            <div className="flex items-center gap-2">
              <PackageCheck className="h-5 w-5 text-teal-700" />
              <h2 className="text-xl font-black text-slate-950">
                Condition information
              </h2>
            </div>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              This device is listed as{" "}
              <strong className="text-slate-900">{condition}</strong>.
              Availability and repair status are shown from the store listing.
            </p>
            <div className="mt-5 space-y-3 text-sm">
              <div className="flex justify-between gap-3 border-b border-slate-100 pb-3">
                <span className="text-slate-500">Repair status</span>
                <strong>
                  {product.isRepaired ? "Repaired" : "Not marked as repaired"}
                </strong>
              </div>
              <div className="flex justify-between gap-3">
                <span className="text-slate-500">Availability</span>
                <strong className="text-emerald-700">
                  {product.availability}
                </strong>
              </div>
            </div>
          </div>
          <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
            <h2 className="text-xl font-black text-slate-950">
              Product details
            </h2>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {[
                ["Brand", product.brand],
                ["Model", product.model],
                ["Color", product.color !== "Available" ? product.color : ""],
                ["RAM", product.ram !== "N/A" ? `${product.ram} GB` : ""],
                [
                  "Storage",
                  product.storage !== "N/A" ? `${product.storage} GB` : "",
                ],
                ["Category", product.category],
                [
                  "Variant",
                  product.variant !== "Standard" ? product.variant : "",
                ],
                ["Offer", product.offer],
              ]
                .filter(([, value]) => isDisplayableValue(value))
                .map(([label, value]) => (
                  <div
                    key={label}
                    className="flex justify-between gap-3 border-b border-slate-100 py-2 text-sm"
                  >
                    <span className="text-slate-500">{label}</span>
                    <span className="text-right font-semibold">{value}</span>
                  </div>
                ))}
            </div>
          </div>
        </section>
        {product.raw?.Notes ? (
          <section className="mt-6 rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
            <h2 className="text-xl font-black text-slate-950">
              Additional information
            </h2>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              {product.raw.Notes}
            </p>
          </section>
        ) : null}
        <section className="mt-8 rounded-[28px] border border-teal-100 bg-white p-5 shadow-sm sm:p-7">
          <h2 className="text-xl font-black text-slate-500">
            Ask For More Information
          </h2>

          <div className="mt-3 h-1 w-60 bg-teal-600" />
          <h2 className="mt-2 text-xl font-black">
            {store?.shopName || product.storeLabel || "Mobiles24"}
          </h2>
          <p className="mt-1 text-sm text-slate-400">
            {store?.address || "India"}
          </p>
          <a
            href={store?.phone ? `tel:${store.phone}` : "#store-information"}
            className="mt-5 inline-flex items-center justify-center gap-2 rounded-2xl bg-teal-700 px-5 py-3 text-sm font-bold text-white hover:bg-teal-800"
          >
            <Phone className="h-4 w-4" /> Contact{" "}
            {store?.shopName || product.storeLabel || "store"}
          </a>
        </section>
        {relatedProducts.length ? (
          <section
            className="mt-10 border-t border-slate-200 pt-7"
            aria-labelledby="similar-phones-heading"
          >
            <div className="mb-5 flex items-end justify-between gap-4">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-teal-700">
                  Curated for you
                </p>
                <h2
                  id="similar-phones-heading"
                  className="mt-1 text-xl font-black tracking-tight text-slate-950 sm:text-2xl"
                >
                  You May Also Like
                </h2>
                <p className="mt-1 text-xs text-slate-500 sm:text-sm">
                  Explore more phones available in our store.
                </p>
              </div>
              <span className="shrink-0 text-xs font-medium text-slate-400">
                {relatedProducts.length} options
              </span>
            </div>

            <div className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-3 sm:grid sm:grid-cols-2 sm:overflow-visible lg:grid-cols-4">
              {relatedProducts.map((item) => {
                const itemCondition =
                  item.condition && item.condition !== "N/A"
                    ? item.condition
                    : "";
                const variantDetails = [
                  item.color && item.color !== "Available" ? item.color : "",
                  item.storage !== "N/A" && item.ram !== "N/A"
                    ? `${item.storage}GB / ${item.ram}GB RAM`
                    : item.storage !== "N/A"
                      ? `${item.storage}GB`
                      : item.ram !== "N/A"
                        ? `${item.ram}GB RAM`
                        : "",
                ]
                  .filter(Boolean)
                  .join(" · ");
                const itemWishlisted = wishlist.some(
                  (wishlistItem) => String(wishlistItem.id) === String(item.id),
                );

                return (
                  <article
                    key={item.id}
                    className="relative min-w-[78vw] snap-start overflow-hidden rounded-[22px] border border-slate-200 bg-white shadow-[0_10px_26px_rgba(15,23,42,0.05)] transition hover:-translate-y-0.5 hover:border-teal-200 hover:shadow-[0_16px_30px_rgba(15,23,42,0.08)] sm:min-w-0"
                  >
                    <button
                      type="button"
                      aria-label={
                        itemWishlisted
                          ? `Remove ${item.name} from wishlist`
                          : `Add ${item.name} to wishlist`
                      }
                      aria-pressed={itemWishlisted}
                      onClick={(event) => {
                        event.stopPropagation();
                        onToggleWishlist(item.id);
                      }}
                      className="absolute right-3 top-3 z-10 flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white/95 text-slate-500 shadow-sm transition hover:border-rose-200 hover:text-rose-500 focus:outline-none focus:ring-2 focus:ring-teal-500"
                    >
                      <Heart
                        className={`h-4 w-4 ${itemWishlisted ? "fill-rose-500 text-rose-500" : ""}`}
                      />
                    </button>

                    <button
                      type="button"
                      onClick={() => onOpenProduct(item)}
                      aria-label={`View details for ${item.name}`}
                      className="block w-full text-left"
                    >
                      <div className="aspect-square border-b border-slate-100 bg-[linear-gradient(135deg,#f8fafc,#ecfeff)] p-4">
                        <ProductImage
                          src={item.image}
                          alt={item.name}
                          className="h-full w-full bg-transparent transition duration-300 group-hover:scale-[1.02]"
                        />
                      </div>
                      <div className="flex min-h-[205px] flex-col p-4">
                        <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-teal-700">
                          {item.brand}
                        </p>
                        <h3 className="mt-1 min-h-[44px] line-clamp-2 text-base font-black leading-5 text-slate-950">
                          {item.model || item.name}
                        </h3>
                        <p className="mt-2 min-h-5 truncate text-xs text-slate-500">
                          {variantDetails ||
                            "Store variant details unavailable"}
                        </p>
                        <div className="mt-3 min-h-6">
                          {itemCondition ? (
                            <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-semibold text-slate-600">
                              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                              {itemCondition}
                            </span>
                          ) : null}
                        </div>
                        <div className="mt-auto flex flex-wrap items-end gap-2 pt-4">
                          <span className="text-xl font-black tracking-tight text-slate-950">
                            {formatPrice(item.price)}
                          </span>
                          {item.originalPrice > 0 ? (
                            <span className="text-xs text-slate-400 line-through">
                              {formatPrice(item.originalPrice)}
                            </span>
                          ) : null}
                          {item.discount > 0 ? (
                            <span className="rounded-full bg-emerald-50 px-2 py-1 text-[10px] font-bold text-emerald-700">
                              {item.discount}% OFF
                            </span>
                          ) : null}
                        </div>
                      </div>
                    </button>
                  </article>
                );
              })}
            </div>
          </section>
        ) : null}
      </main>
      <Footer />
      {showTopButton ? (
        <button
          type="button"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          aria-label="Back to top"
          className="fixed bottom-5 right-5 z-40 rounded-full bg-black p-3 text-white shadow-lg transition hover:bg-teal-700"
        >
          <ChevronUp className="h-6 w-6" />
        </button>
      ) : null}
      {viewerOpen ? (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/90 p-4"
          role="dialog"
          aria-modal="true"
        >
          <button
            type="button"
            onClick={() => setViewerOpen(false)}
            aria-label="Close image viewer"
            className="absolute right-4 top-4 z-10 rounded-full bg-white/10 p-3 text-white hover:bg-white/20"
          >
            <X className="h-5 w-5" />
          </button>
          <ProductImage
            src={images[activeImageIndex]}
            alt={product.name}
            fallback={false}
            onError={() => {
              if (selectedColorGallery?.images.length) {
                setColorGalleryFailed(true);
              }
            }}
            className="h-[78vh] w-full max-w-3xl bg-transparent"
          />
          {images.length > 1 ? (
            <>
              <button
                type="button"
                onClick={() => changeImage(-1)}
                aria-label="Previous image"
                className="absolute left-3 z-10 rounded-full bg-white/10 p-3 text-white sm:left-8"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>
              <button
                type="button"
                onClick={() => changeImage(1)}
                aria-label="Next image"
                className="absolute right-3 z-10 rounded-full bg-white/10 p-3 text-white sm:right-8"
              >
                <ChevronRight className="h-6 w-6" />
              </button>
              <span className="absolute bottom-6 z-10 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-white">
                {activeImageIndex + 1} / {images.length}
              </span>
            </>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
