import { Heart, SlidersHorizontal } from "lucide-react";
import EmptyState from "../../components/EmptyState";
import ErrorState from "../../components/ErrorState";
import FilterPanel from "../../components/FilterPanel";
import Footer from "../../components/Footer";
import Header from "../../components/Header";
import Hero from "../../components/Hero";
import MobileFilterDrawer from "../../components/MobileFilterDrawer";
import ProductCard from "../../components/ProductCard";
import ProductSkeleton from "../../components/ProductSkeleton";
import ComparisonModal from "../../components/ComparisonModal";
import ComparisonTray from "../../components/ComparisonTray";
import WishlistModal from "../../components/WishlistModal";
import ProductDetailsPage from "../../components/ProductDetailsPage";

export default function Theme1Shell({ controller }) {
  const {
    store,
    products,
    loading,
    loadingMore,
    error,
    loadMoreError,
    hasMore,
    refetch,
    loadMore,
    search,
    setSearch,
    activeBrand,
    setActiveBrand,
    sortBy,
    setSortBy,
    sortOptions,
    wishlist,
    wishlistOpen,
    setWishlistOpen,
    mobileMenuOpen,
    setMobileMenuOpen,
    mobileFilterOpen,
    setMobileFilterOpen,
    compareProducts,
    comparisonOpen,
    setComparisonOpen,
    comparisonMessage,
    filters,
    brands,
    priceRange,
    filterOptions,
    wishlistProducts,
    filteredProducts,
    loadMoreRef,
    toggleWishlist,
    toggleCompare,
    removeCompareProduct,
    openProduct,
    goBackToProducts,
    handleApplyFilter,
    handleResetFilters,
    handleClearResults,
    productRouteId,
    routeProduct,
  } = controller;

  const headerProps = {
    search,
    onSearchChange: setSearch,
    onClearSearch: () => setSearch(""),
    onOpenFilters: () => setMobileFilterOpen(true),
    onToggleMenu: () => setMobileMenuOpen((prev) => !prev),
    mobileMenuOpen,
    storeName: store?.shopName || "Mobiles24",
    storeAddress: store?.address,
    onOpenWishlist: () => setWishlistOpen(true),
    wishlistCount: wishlist.length,
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 text-slate-900">
        <Header {...headerProps} />
        <main className="mx-auto max-w-7xl px-3 py-6 sm:px-4 lg:px-6">
          <Hero
            storeName={store?.shopName || "Mobiles24"}
            slogan={store?.slogan}
          />
          <div className="mt-8 space-y-6">
            <div className="h-12 animate-pulse rounded-full bg-slate-200" />
            <div className="h-12 animate-pulse rounded-full bg-slate-200" />
            <ProductSkeleton count={8} />
          </div>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 px-3 py-10 text-slate-900">
        <div className="mx-auto max-w-4xl">
          <ErrorState message={error} onRetry={refetch} />
        </div>
      </div>
    );
  }

  if (productRouteId) {
    return routeProduct ? (
      <ProductDetailsPage
        key={String(routeProduct.id)}
        product={routeProduct}
        products={products}
        store={store}
        wishlist={wishlist}
        onToggleWishlist={toggleWishlist}
        onToggleCompare={toggleCompare}
        isCompared={compareProducts.some((item) => item.id === routeProduct.id)}
        onBack={goBackToProducts}
        onOpenWishlist={() => setWishlistOpen(true)}
        wishlistCount={wishlist.length}
        onOpenProduct={openProduct}
      />
    ) : (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 px-5 text-center">
        <div>
          <h1 className="text-2xl font-black text-slate-950">
            Product not found
          </h1>
          <button
            type="button"
            onClick={goBackToProducts}
            className="mt-4 rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white"
          >
            Back to phones
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Header {...headerProps} />

      {mobileMenuOpen ? (
        <div
          className="fixed inset-0 z-30 bg-slate-950/20 pt-[8.5rem] md:hidden"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setMobileMenuOpen(false);
          }}
        >
          <div className="border-y border-slate-200 bg-white px-3 py-3 shadow-[0_18px_35px_rgba(15,23,42,0.14)]">
            <nav
              className="mx-auto grid max-w-[1400px] gap-2 text-sm font-semibold text-slate-700"
              aria-label="Mobile navigation"
            >
              {[
                ["#top", "Home"],
                ["#phones", "All phones"],
                ["#offers", "Latest deals"],
                ["#brands", "Shop by brand"],
              ].map(([href, label]) => (
                <a
                  key={href}
                  href={href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3 transition hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-700"
                >
                  {label}
                </a>
              ))}
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  setMobileFilterOpen(true);
                }}
                className="inline-flex items-center gap-2 rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3 text-left transition hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-700"
              >
                <SlidersHorizontal className="h-4 w-4" /> Filters
              </button>
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  setWishlistOpen(true);
                }}
                className="inline-flex items-center justify-between rounded-2xl border border-rose-100 bg-rose-50/60 px-4 py-3 text-left text-rose-700 transition hover:bg-rose-50"
              >
                <span className="inline-flex items-center gap-2">
                  <Heart className="h-4 w-4" /> Wishlist
                </span>
                {wishlist.length > 0 ? (
                  <span className="rounded-full bg-rose-500 px-2 py-0.5 text-[10px] font-bold text-white">
                    {wishlist.length}
                  </span>
                ) : null}
              </button>
            </nav>
          </div>
        </div>
      ) : null}

      {wishlistOpen ? (
        <WishlistModal
          products={wishlistProducts}
          onClose={() => setWishlistOpen(false)}
          onRemove={toggleWishlist}
          onToggleCompare={toggleCompare}
          compareProducts={compareProducts}
          onCompare={() => {
            setWishlistOpen(false);
            setComparisonOpen(true);
          }}
          onSelect={(product) => {
            setWishlistOpen(false);
            openProduct(product);
          }}
          onExplore={() => {
            setWishlistOpen(false);
            window.location.hash = "phones";
          }}
        />
      ) : null}

      <main className="mx-auto max-w-7xl px-3 py-6 sm:px-4 lg:px-6">
        <Hero
          storeName={store?.shopName || "Mobiles24"}
          slogan={store?.slogan || "Best deals. Better phones."}
          featuredProduct={products[0]}
        />
        <section id="phones" className="mt-8 scroll-mt-32">
          <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-emerald-600">
                Phones for you
              </p>
              <h2 className="mt-1 text-2xl font-black tracking-tight text-slate-900">
                Curated mobile deals
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                {filteredProducts.length} results
              </p>
            </div>
            <div className="flex items-center gap-2">
              <label
                htmlFor="sort"
                className="text-sm font-medium text-slate-600"
              >
                Sort:
              </label>
              <select
                id="sort"
                value={sortBy}
                onChange={(event) => setSortBy(event.target.value)}
                className="rounded-full border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none transition focus:border-emerald-500"
              >
                {sortOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="flex gap-2">
            <FilterPanel
              brands={brands}
              selectedBrand={activeBrand}
              onBrandChange={setActiveBrand}
              priceRange={priceRange}
              onPriceChange={(value) => handleApplyFilter({ maxPrice: value })}
              storageOptions={filterOptions.storage}
              ramOptions={filterOptions.ram}
              conditions={filterOptions.conditions}
              selectedFilters={filters}
              onApply={handleApplyFilter}
              onReset={handleResetFilters}
            />
            <div className="flex-1">
              {filteredProducts.length === 0 ? (
                <EmptyState onClearSearch={handleClearResults} />
              ) : (
                <>
                  <div className="grid items-start grid-cols-1 gap-4 min-[480px]:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
                    {filteredProducts.map((product) => (
                      <ProductCard
                        key={product.id}
                        product={product}
                        onToggleWishlist={toggleWishlist}
                        isWishlisted={wishlist.some(
                          (item) => item.id === product.id,
                        )}
                        onSelect={openProduct}
                        onToggleCompare={toggleCompare}
                        isCompared={compareProducts.some(
                          (item) => item.id === product.id,
                        )}
                      />
                    ))}
                  </div>
                  {loadingMore ? (
                    <div className="mt-4">
                      <ProductSkeleton count={4} />
                    </div>
                  ) : null}
                  <div
                    ref={loadMoreRef}
                    className="mt-6 flex min-h-12 items-center justify-center"
                    aria-live="polite"
                  >
                    {loadMoreError ? (
                      <div
                        className="flex items-center gap-3 text-xs font-medium text-slate-500"
                        role="alert"
                      >
                        <span>{loadMoreError}</span>
                        <button
                          type="button"
                          onClick={loadMore}
                          className="rounded-full border border-emerald-200 px-3 py-1.5 font-semibold text-emerald-700 transition hover:bg-emerald-50"
                        >
                          Retry
                        </button>
                      </div>
                    ) : hasMore ? (
                      <p
                        className="text-xs font-medium text-slate-400"
                        role="status"
                      >
                        {loadingMore
                          ? "Loading more phones..."
                          : "Scroll for more phones"}
                      </p>
                    ) : (
                      <p className="text-xs font-medium text-slate-400">
                        You&apos;ve reached the end of the results.
                      </p>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        </section>
      </main>

      <Footer />
      <MobileFilterDrawer
        open={mobileFilterOpen}
        onClose={() => setMobileFilterOpen(false)}
        brands={brands}
        selectedBrand={activeBrand}
        onBrandChange={setActiveBrand}
        priceRange={priceRange}
        onPriceChange={(value) => handleApplyFilter({ maxPrice: value })}
        storageOptions={filterOptions.storage}
        ramOptions={filterOptions.ram}
        conditions={filterOptions.conditions}
        selectedFilters={filters}
        onApply={handleApplyFilter}
        onReset={handleResetFilters}
      />
      {compareProducts.length > 0 ? (
        <ComparisonTray
          products={compareProducts}
          onRemove={removeCompareProduct}
          onCompare={() => setComparisonOpen(true)}
          onClose={() => setCompareProducts([])}
        />
      ) : null}
      {comparisonMessage ? (
        <div
          className="fixed bottom-28 left-1/2 z-[60] w-[calc(100%-2rem)] max-w-md -translate-x-1/2 rounded-2xl border border-amber-200 bg-white px-4 py-3 text-center text-sm font-semibold text-slate-800 shadow-xl"
          role="status"
        >
          {comparisonMessage}
        </div>
      ) : null}
      {comparisonOpen && compareProducts.length > 1 ? (
        <ComparisonModal
          products={compareProducts}
          onClose={() => setComparisonOpen(false)}
          onRemove={removeCompareProduct}
          onSelect={(product) => {
            setComparisonOpen(false);
            openProduct(product);
          }}
        />
      ) : null}
    </div>
  );
}
