const INVALID_TEXT_VALUES = new Set(['null', 'undefined', 'na', 'n/a', 'none', 'false', 'true'])
const PRODUCT_ASSET_ORIGIN = 'https://img.phoneo.in'

export const isMeaningfulText = (value) => {
  if (value === null || value === undefined || value === '') return false

  const text = String(value).trim()
  if (!text) return false

  if (INVALID_TEXT_VALUES.has(text.toLowerCase())) return false

  if (/^(true|false)(,\d+)?$/i.test(text)) return false
  if (/^null(,\d+)?$/i.test(text)) return false
  if (/^undefined(,\d+)?$/i.test(text)) return false

  return true
}

export const normalizeText = (value, fallback = 'N/A') => {
  if (!isMeaningfulText(value)) return fallback
  return String(value).trim()
}

export const formatPrice = (value) => {
  const numeric = Number(value)

  if (!Number.isFinite(numeric) || numeric <= 0) {
    return '₹0'
  }

  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(numeric)
}

export const safeArray = (value) => (Array.isArray(value) ? value : [])

export const resolveProductAssetUrl = (value) => {
  if (!isMeaningfulText(value)) return ''

  const source = String(value).trim()
  if (/^(https?:)?\/\//i.test(source)) {
    return source.startsWith('//') ? `https:${source}` : source
  }

  return `${PRODUCT_ASSET_ORIGIN}/${source.replace(/^\/+/, '')}`
}

export const normalizeBrand = (value) => {
  const text = String(value ?? '').trim()
  if (!isMeaningfulText(text)) return ''

  const lower = text.toLowerCase().replace(/[_-]+/g, ' ')

  if (lower.includes('oneplus') || lower.includes('one p')) return 'OnePlus'
  if (lower.includes('vivo')) return 'Vivo'
  if (lower.includes('xiaomi')) return 'Xiaomi'
  if (lower.includes('realme')) return 'Realme'
  if (lower.includes('oppo')) return 'OPPO'
  if (lower.includes('samsung')) return 'Samsung'
  if (lower.includes('apple')) return 'Apple'
  if (lower.includes('google')) return 'Google'
  if (lower.includes('nothing')) return 'Nothing'
  if (lower.includes('motorola')) return 'Motorola'
  if (lower.includes('iqoo')) return 'iQOO'

  const cleaned = text.replace(/\s+/g, ' ').replace(/\b\w/g, (ch) => ch.toUpperCase())
  return cleaned
}

export const normalizeOffer = (value) => {
  if (!isMeaningfulText(value)) return ''

  const text = String(value).trim()
  const lower = text.toLowerCase()

  if (/^(true|false)(,\d+)?$/i.test(lower)) return ''
  if (/^(null|undefined|na|n\/a)$/i.test(lower)) return ''
  if (/^(?:\d+|\d+\.?\d*%?)$/i.test(lower)) return ''

  return text
}

export const getPrimaryImage = (product) => {
  const rawImages = safeArray(product?.image)

  if (rawImages.length > 0) {
    const first = rawImages[0]
    if (typeof first === 'string' && isMeaningfulText(first)) return resolveProductAssetUrl(first)
    if (first && typeof first === 'object') {
      const candidate = first.path || first.url || first.src || first.image || ''
      if (isMeaningfulText(candidate)) return resolveProductAssetUrl(candidate)
    }

  }

  const thumb = product?.Thumb || product?.thumb || product?.imageUrl || ''
  return resolveProductAssetUrl(thumb)
}

export const getProductImages = (product) => {
  const values = [
    ...safeArray(product?.image),
    product?.Thumb,
    product?.thumb,
    product?.imageUrl,
  ]
  const images = values
    .map((value) => (value && typeof value === 'object' ? value.path || value.url || value.src || value.image : value))
    .filter((value) => typeof value === 'string' && isMeaningfulText(value))
    .map(resolveProductAssetUrl)
  return [...new Set(images)]
}

export const getDisplayBrand = (product) => {
  const rawBrand = product?.Company || product?.brand || product?.Brand
  const normalized = normalizeBrand(rawBrand)
  return normalized || 'Brand'
}

export const getDisplayName = (product) => normalizeText(product?.Model || product?.name || product?.title, 'Unnamed phone')

export const getVariantParts = (variant) => {
  const text = normalizeText(variant, '')
  const ramMatch = text.match(/(\d+)\s*GB\s*RAM/i) || text.match(/RAM\s*(\d+)\s*GB/i)
  const storageMatch = text.match(/(\d+)\s*GB\s*Storage/i) || text.match(/(\d+)\s*GB\b/i)

  const ram = ramMatch ? Number(ramMatch[1]) : null
  const storage = storageMatch ? Number(storageMatch[1]) : null

  return { ram, storage }
}

export const toNumber = (value) => {
  if (typeof value === 'number') return Number.isFinite(value) ? value : 0
  if (typeof value !== 'string') return 0

  const cleaned = value.replace(/[^\d.-]/g, '')
  const numeric = Number(cleaned)
  return Number.isFinite(numeric) ? numeric : 0
}

const getRawPrice = (product = {}) => (
  product?.SalePrice
  ?? product?.sale_price
  ?? product?.salePrice
  ?? product?.selling_price
  ?? product?.sellingPrice
  ?? product?.Price
  ?? product?.price
  ?? product?.value
  ?? product?.Value
  ?? product?.amount
)

export const getDiscountPercent = (product) => {
  const originalPrice = toNumber(product?.originalPrice || product?.OriginalPrice || product?.MRP || product?.MarketPrice || product?.listPrice)
  const salePrice = toNumber(product?.price || product?.SalePrice || product?.salePrice || product?.Price)

  if (!originalPrice || !salePrice || salePrice >= originalPrice) {
    return 0
  }

  return Math.max(0, Math.round(((originalPrice - salePrice) / originalPrice) * 100))
}

export const buildCategoryLabel = (product) => {
  const rawCategories = safeArray(product?.categories)
  const nameSource = rawCategories.find((category) => category && (category.name || category.Name || category.title || category.label))

  if (nameSource) {
    return normalizeText(nameSource.name || nameSource.Name || nameSource.title || nameSource.label, 'Phones')
  }

  if (product?.category) return normalizeText(product.category, 'Phones')
  if (product?.Category) return normalizeText(product.Category, 'Phones')

  const condition = normalizeText(product?.Condition || '', '').toLowerCase()
  if (condition.includes('box')) return 'New Arrivals'
  if (condition.includes('good') || condition.includes('used')) return 'Pre-Owned'

  return 'Best Deals'
}

export const getAvailabilityLabel = (product) => {
  if (product?.IsRepaired === 1) return 'Repaired'
  if (product?.PriceHide) return 'Available'
  return 'Available'
}

export const getConditionLabel = (product) => {
  const condition = normalizeText(product?.Condition || product?.condition || 'Used', 'Used')
  if (condition === 'NA' || condition === 'N/A' || condition === 'null') return 'Used'
  return condition
}

export const extractStoreCategories = (data = {}) => {
  const rootCategories = safeArray(data.categories)

  if (rootCategories.length === 0) {
    return ['All', 'Best Deals', 'Pre-Owned', 'New Arrivals']
  }

  const labels = rootCategories
    .map((category) => category?.name || category?.Name || category?.title || category?.label)
    .filter(Boolean)
    .map((label) => normalizeText(label, 'Phones'))

  return ['All', ...new Set(labels)]
}

export const extractBrandOptions = (products = []) => {
  const unique = new Set(products.map((product) => product.brand).filter(Boolean))
  return ['All', ...Array.from(unique)]
}

export const buildSearchIndex = (product) => {
  const text = [
    product?.brand,
    product?.name,
    product?.model,
    product?.variant,
    product?.color,
    product?.condition,
    product?.ram,
    product?.storage,
    product?.category,
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase()

  return text
}

export const getPriceRange = (products = []) => {
  const prices = products.map((product) => product.price).filter((price) => Number(price) > 0)
  if (!prices.length) return { min: 0, max: 0 }

  return {
    min: Math.min(...prices),
    max: Math.max(...prices),
  }
}

export const getFilterOptions = (products = []) => {
  const storage = [...new Set(products.map((product) => product.storage).filter(Boolean))].sort((a, b) => a - b)
  const ram = [...new Set(products.map((product) => product.ram).filter(Boolean))].sort((a, b) => a - b)
  const conditions = [...new Set(products.map((product) => product.condition).filter(Boolean))]

  return {
    storage,
    ram,
    conditions,
  }
}

export const normalizeProduct = (rawProduct = {}, store = {}) => {
  const variant = rawProduct?.Variant || rawProduct?.variant || ''
  const variantParts = getVariantParts(variant)
  const salePrice = toNumber(getRawPrice(rawProduct))
  const originalPrice = toNumber(rawProduct?.OriginalPrice ?? rawProduct?.originalPrice ?? rawProduct?.MRP ?? rawProduct?.MRPPrice ?? rawProduct?.ListPrice ?? rawProduct?.listPrice)
  
  const image = getPrimaryImage(rawProduct)


  const brand = getDisplayBrand(rawProduct)
  const condition = getConditionLabel(rawProduct)
  const normalizedOffer = normalizeOffer(rawProduct?.Offer || rawProduct?.offer)



  return {
    id: rawProduct?.id ?? `${brand || 'phone'}-${rawProduct?.Model || 'item'}`,
    brand,
    name: getDisplayName(rawProduct),
    model: normalizeText(rawProduct?.Model || rawProduct?.model, 'Phone'),
    color: normalizeText(rawProduct?.Color === 'NA' ? 'Available' : rawProduct?.Color || rawProduct?.color, 'Available'),
    variant: normalizeText(variant, 'Standard'),
    ram: rawProduct?.Ram || rawProduct?.ram || variantParts.ram || 'N/A',
    storage: rawProduct?.Storage || rawProduct?.storage || variantParts.storage || 'N/A',
    condition,
    category: buildCategoryLabel(rawProduct),
    availability: getAvailabilityLabel(rawProduct),
    price: salePrice,
    value: salePrice,
    originalPrice: originalPrice > salePrice ? originalPrice : 0,
    discount: getDiscountPercent({
      originalPrice,
      price: salePrice,
    }),
    image,
    images: getProductImages(rawProduct),
    raw: rawProduct,
    offer: normalizedOffer || null,
    storeLabel: store?.ShopName || store?.shopName || 'Mobiles24',
    isRepaired: rawProduct?.IsRepaired === 1,
    updatedAt: rawProduct?.updated_at || rawProduct?.updatedAt || null,
    searchText: '',
  }
}
