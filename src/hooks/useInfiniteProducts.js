import { useCallback, useEffect, useRef, useState } from 'react'
import { getStorePage } from '../services/api'

const appendUniqueProducts = (current, incoming) => {
  const ids = new Set(current.map((product) => String(product.id)))
  return [...current, ...incoming.filter((product) => {
    const id = String(product.id)
    if (ids.has(id)) return false
    ids.add(id)
    return true
  })]
}

export default function useInfiniteProducts() {
  const [store, setStore] = useState(null)
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [error, setError] = useState('')
  const [loadMoreError, setLoadMoreError] = useState('')
  const [hasMore, setHasMore] = useState(false)
  const nextRequestRef = useRef(null)
  const requestInFlightRef = useRef(false)
  const abortControllerRef = useRef(null)

  const fetchPage = useCallback(async ({ reset = false } = {}) => {
    if (requestInFlightRef.current) return
    if (!reset && !nextRequestRef.current) return

    requestInFlightRef.current = true
    abortControllerRef.current?.abort()
    const controller = new AbortController()
    abortControllerRef.current = controller

    if (reset) {
      setLoading(true)
      setError('')
      setLoadMoreError('')
      nextRequestRef.current = { page: undefined, cursor: undefined }
    } else {
      setLoadingMore(true)
      setLoadMoreError('')
    }

    try {
      const request = reset ? {} : nextRequestRef.current
      const result = await getStorePage({ ...request, signal: controller.signal })
      if (controller.signal.aborted) return

      setStore((current) => current || result.store)
      setProducts((current) => (reset ? appendUniqueProducts([], result.products) : appendUniqueProducts(current, result.products)))
      const next = result.pagination?.hasMore
        ? {
            page: result.pagination.nextPage,
            cursor: result.pagination.nextCursor,
            offset: result.pagination.nextOffset,
            limit: result.pagination.limit,
          }
        : null
      nextRequestRef.current = next
      setHasMore(Boolean(next))
    } catch {
      if (controller.signal.aborted) return
      if (reset) {
        setProducts([])
        setStore(null)
        setError('Unable to load products. Please try again.')
      } else {
        setLoadMoreError('Unable to load more products. Please try again.')
      }
    } finally {
      if (!controller.signal.aborted) {
        setLoading(false)
        setLoadingMore(false)
      }
      requestInFlightRef.current = false
    }
  }, [])

  const refetch = useCallback(() => fetchPage({ reset: true }), [fetchPage])
  const loadMore = useCallback(() => fetchPage(), [fetchPage])

  useEffect(() => {
    refetch()
    return () => {
      abortControllerRef.current?.abort()
      requestInFlightRef.current = false
    }
  }, [refetch])

  return { store, products, loading, loadingMore, error, loadMoreError, hasMore, refetch, loadMore }
}
