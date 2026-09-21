import axios from 'axios'
import { normalizeProduct, extractStoreCategories } from '../utils/productUtils'

const API_URL = import.meta.env.VITE_BASE_URL

export async function getStorePage({ page, cursor, offset, limit, signal } = {}) {
  try {
    // The current store endpoint returns the complete `used_phones` collection
    // without pagination metadata. Only send pagination parameters after the API
    // has explicitly advertised a next page/cursor, so an unsupported `page`
    // query can never cause duplicate requests.
    const params = {}
    if (page !== undefined && page !== null) params.page = page
    if (cursor !== undefined && cursor !== null) params.cursor = cursor
    if (offset !== undefined && offset !== null) params.offset = offset
    if (limit !== undefined && limit !== null) params.limit = limit

    const response = await axios.get(API_URL, { params, signal })
    const data = response?.data || {}
    const payload = getPayload(data)
    const products = safeProducts(payload)

    return {
      store: normalizeStore(data),
      products: products.map((product) => normalizeProduct(product, data)),
      pagination: getPagination(data, payload, products.length, { page, cursor, offset, limit }),
    }
  } catch (error) {
    if (error?.code === 'ERR_CANCELED') throw error
    throw new Error('Unable to load products')
  }
}

// Kept as the listing API entry point for existing consumers.
export async function getStoreData(options) {
  return getStorePage(options)
}

function normalizeStore(data) {
  return {
    id: data?.id || 'mobiles24',
    shopName: data?.ShopName || 'Mobiles24',
    slogan: data?.Slogan || 'Best deals. Better phones.',
    address: data?.Address || data?.Location || 'India',
    phone: data?.Number || data?.Number3 || '',
    image: data?.Thumb || data?.thumb || '',
    categories: extractStoreCategories(data),
    raw: data,
  }
}

function getPayload(data) {
  return data?.data && typeof data.data === 'object' && !Array.isArray(data.data) ? data.data : data
}

function safeProducts(data) {
  if (Array.isArray(data?.used_phones)) return data.used_phones
  if (Array.isArray(data?.products)) return data.products
  if (Array.isArray(data?.items)) return data.items
  return []
}

function getPagination(data, payload, productCount, request) {
  const sources = [
    payload?.meta,
    data?.meta,
    payload?.pagination,
    data?.pagination,
    payload?.links,
    data?.links,
    payload,
    data,
  ].filter((value) => value && typeof value === 'object')
  const firstValue = (...keys) => {
    for (const source of sources) {
      for (const key of keys) {
        if (source[key] !== undefined && source[key] !== null) return source[key]
      }
    }
    return null
  }
  const nextCursor = firstValue('next_cursor', 'nextCursor')
  const toFiniteNumber = (value) => {
    if (value === null || value === undefined || value === '') return null
    const numeric = Number(value)
    return Number.isFinite(numeric) ? numeric : null
  }
  const currentPage = toFiniteNumber(firstValue('current_page', 'currentPage', 'page'))
  const lastPage = toFiniteNumber(firstValue('last_page', 'lastPage', 'total_pages', 'totalPages'))
  const suppliedNextPage = firstValue('next_page', 'nextPage')
  const suppliedNextPageNumber = toFiniteNumber(suppliedNextPage)
  const nextPage = suppliedNextPageNumber !== null
    ? suppliedNextPageNumber
    : currentPage !== null && lastPage !== null && currentPage < lastPage
      ? currentPage + 1
      : null
  const currentOffset = toFiniteNumber(firstValue('offset')) ?? toFiniteNumber(request.offset)
  const pageSize = toFiniteNumber(firstValue('limit', 'per_page', 'perPage', 'page_size', 'pageSize')) ?? toFiniteNumber(request.limit)
  const total = toFiniteNumber(firstValue('total', 'total_count', 'totalCount'))
  const nextOffset = currentOffset !== null && pageSize !== null
    ? currentOffset + pageSize
    : null
  const suppliedHasMore = firstValue('has_more', 'hasMore')
  const derivedOffsetHasMore = currentOffset !== null && total !== null
    ? currentOffset + productCount < total
    : false
  const hasMore = typeof suppliedHasMore === 'boolean'
    ? suppliedHasMore
    : nextCursor !== null || nextPage !== null || derivedOffsetHasMore

  // The current endpoint returns the complete `used_phones` collection and
  // does not advertise a continuation token, page, or total.
  return {
    hasMore: Boolean(hasMore) && productCount > 0,
    nextCursor,
    nextPage: typeof nextPage === 'number' ? nextPage : null,
    nextOffset: derivedOffsetHasMore && typeof nextOffset === 'number' ? nextOffset : null,
    limit: pageSize,
  }
}
