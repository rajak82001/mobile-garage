import { useEffect, useMemo, useRef, useState } from 'react'
import useInfiniteProducts from '../hooks/useInfiniteProducts'
import { getFilterOptions, getPriceRange } from '../utils/productUtils'

export const sortOptions = [
  { label: 'Recommended', value: 'recommended' },
  { label: 'Price: Low to High', value: 'priceAsc' },
  { label: 'Price: High to Low', value: 'priceDesc' },
  { label: 'Newest', value: 'newest' },
  { label: 'Discount', value: 'discount' },
]

const readWishlist = () => {
  try {
    const saved = window.localStorage.getItem('wishlist')
    const parsed = saved ? JSON.parse(saved) : []
    return Array.isArray(parsed)
      ? parsed.map((item) => (typeof item === 'object' ? item : { id: item, savedPrice: null, savedAt: null })).filter((item) => item.id !== undefined && item.id !== null)
      : []
  } catch {
    return []
  }
}

export default function useAppController() {
  const { store, products, loading, loadingMore, error, loadMoreError, hasMore, refetch, loadMore } = useInfiniteProducts()
  const [search, setSearch] = useState('')
  const [activeBrand, setActiveBrand] = useState('All')
  const [activeCategory, setActiveCategory] = useState('All')
  const [activeOffer, setActiveOffer] = useState('All Offers')
  const [sortBy, setSortBy] = useState('recommended')
  const [wishlist, setWishlist] = useState(readWishlist)
  const [wishlistOpen, setWishlistOpen] = useState(false)
  const [routePath, setRoutePath] = useState(() => window.location.pathname)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false)
  const [compareProducts, setCompareProducts] = useState([])
  const [comparisonOpen, setComparisonOpen] = useState(false)
  const [comparisonMessage, setComparisonMessage] = useState('')
  const [filters, setFilters] = useState({ maxPrice: 0, storage: '', ram: '', condition: '' })
  const loadMoreRef = useRef(null)
  const homepageScrollRef = useRef(0)

  const brands = useMemo(
    () => ['All', ...new Set((products || []).map((product) => product.brand).filter(Boolean))],
    [products],
  )
  const categories = useMemo(
    () => ['All', ...new Set((products || []).map((product) => product.category).filter(Boolean))],
    [products],
  )
  const offers = useMemo(() => {
    const unique = [...new Set((products || []).map((product) => product.offer).filter(Boolean))]
    return unique.length ? unique : ['All Offers']
  }, [products])
  const priceRange = useMemo(() => getPriceRange(products), [products])
  const filterOptions = useMemo(() => getFilterOptions(products), [products])
  const wishlistProducts = useMemo(
    () => wishlist.map((wishlistItem) => ({ wishlistItem, product: products.find((item) => item.id === wishlistItem.id) })).filter(({ product }) => product),
    [wishlist, products],
  )
  const normalizedSearch = search.trim().toLowerCase()
  const filteredProducts = useMemo(() => {
    let result = [...products]

    if (activeBrand !== 'All') result = result.filter((product) => product.brand === activeBrand)
    if (activeCategory !== 'All') result = result.filter((product) => product.category === activeCategory)
    if (activeOffer !== 'All Offers') result = result.filter((product) => product.offer === activeOffer)
    if (normalizedSearch) {
      result = result.filter((product) =>
        [product.name, product.brand, product.model, product.color, product.variant, product.ram, product.storage]
          .join(' ')
          .toLowerCase()
          .includes(normalizedSearch),
      )
    }
    if (filters.maxPrice > 0) result = result.filter((product) => product.price <= filters.maxPrice)
    if (filters.storage) result = result.filter((product) => String(product.storage) === String(filters.storage))
    if (filters.ram) result = result.filter((product) => String(product.ram) === String(filters.ram))
    if (filters.condition) result = result.filter((product) => product.condition === filters.condition)

    if (sortBy === 'priceAsc') {
      result.sort((a, b) => a.price - b.price)
    } else if (sortBy === 'priceDesc') {
      result.sort((a, b) => b.price - a.price)
    } else if (sortBy === 'newest') {
      result.sort((a, b) => (b.updatedAt || '').localeCompare(a.updatedAt || ''))
    } else if (sortBy === 'discount') {
      result.sort((a, b) => (b.discount || 0) - (a.discount || 0))
    } else {
      result.sort((a, b) => (b.discount || 0) - (a.discount || 0) || b.price - a.price)
    }

    return result
  }, [products, activeBrand, activeCategory, activeOffer, normalizedSearch, filters, sortBy])

  useEffect(() => {
    const sentinel = loadMoreRef.current
    if (!sentinel || !hasMore) return undefined
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || loadingMore) return
        loadMore()
      },
      { rootMargin: '400px 0px' },
    )
    observer.observe(sentinel)
    return () => observer.disconnect()
  }, [routePath, hasMore, loadingMore, loadMore])

  const handleApplyFilter = (nextValues) => setFilters((prev) => ({ ...prev, ...nextValues }))
  const handleResetFilters = () => setFilters({ maxPrice: priceRange.max || 250000, storage: '', ram: '', condition: '' })

  const toggleWishlist = (id) => {
    setWishlist((previous) => {
      const existing = previous.find((item) => item.id === id)
      if (existing) {
        setCompareProducts((compared) => compared.filter((product) => product.id !== id))
        return previous.filter((item) => item.id !== id)
      }
      const product = products.find((item) => item.id === id)
      return product ? [...previous, { id, savedPrice: product.price, savedAt: Date.now() }] : previous
    })
  }

  useEffect(() => {
    try {
      window.localStorage.setItem('wishlist', JSON.stringify(wishlist))
    } catch {
      // Persistence can be unavailable in restricted browser contexts.
    }
  }, [wishlist])

  const toggleCompare = (product) => {
    setCompareProducts((previous) => {
      if (previous.some((item) => item.id === product.id)) return previous.filter((item) => item.id !== product.id)
      if (previous.length >= 3) {
        setComparisonMessage('You can compare up to 3 phones. Remove a phone to add another.')
        return previous
      }
      return [...previous, product]
    })
  }
  const removeCompareProduct = (id) => setCompareProducts((previous) => previous.filter((product) => product.id !== id))

  useEffect(() => {
    if (!comparisonMessage) return undefined
    const timeoutId = window.setTimeout(() => setComparisonMessage(''), 3500)
    return () => window.clearTimeout(timeoutId)
  }, [comparisonMessage])
  useEffect(() => {
    if (compareProducts.length === 0) setComparisonOpen(false)
  }, [compareProducts.length])
  useEffect(() => {
    const previousScrollRestoration = window.history.scrollRestoration
    window.history.scrollRestoration = 'manual'
    const handlePopState = () => setRoutePath(window.location.pathname)
    window.addEventListener('popstate', handlePopState)
    return () => {
      window.removeEventListener('popstate', handlePopState)
      window.history.scrollRestoration = previousScrollRestoration
    }
  }, [])

  const openProduct = (product) => {
    homepageScrollRef.current = window.scrollY
    window.history.pushState({}, '', `/product/${product.id}`)
    setRoutePath(`/product/${product.id}`)
    window.scrollTo({ top: 0, behavior: 'auto' })
  }
  const goBackToProducts = () => {
    window.history.pushState({}, '', '/')
    setRoutePath('/')
  }
  useEffect(() => {
    if (routePath !== '/') return undefined
    const frame = window.requestAnimationFrame(() => window.scrollTo({ top: homepageScrollRef.current, behavior: 'auto' }))
    return () => window.cancelAnimationFrame(frame)
  }, [routePath])

  const handleClearResults = () => {
    setSearch('')
    setActiveBrand('All')
    setActiveCategory('All')
    setActiveOffer('All Offers')
    handleResetFilters()
  }

  const productRouteId = routePath.startsWith('/product/') ? decodeURIComponent(routePath.slice('/product/'.length)) : ''
  const routeProduct = productRouteId ? products.find((product) => String(product.id) === productRouteId) : null

  return {
    store, products, loading, loadingMore, error, loadMoreError, hasMore, refetch, loadMore,
    search, setSearch, activeBrand, setActiveBrand, activeCategory, setActiveCategory, activeOffer, setActiveOffer,
    sortBy, setSortBy, sortOptions, wishlist, wishlistOpen, setWishlistOpen, mobileMenuOpen, setMobileMenuOpen,
    mobileFilterOpen, setMobileFilterOpen, compareProducts, comparisonOpen, setComparisonOpen, comparisonMessage,
    filters, brands, categories, offers, priceRange, filterOptions, wishlistProducts, filteredProducts, loadMoreRef,
    toggleWishlist, toggleCompare, removeCompareProduct, openProduct, goBackToProducts, handleApplyFilter,
    handleResetFilters, handleClearResults, productRouteId, routeProduct,
  }
}
