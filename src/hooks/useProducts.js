import { useCallback, useEffect, useState } from 'react'
import { getStoreData } from '../services/api'

export default function useProducts() {
  const [store, setStore] = useState(null)
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const loadProducts = useCallback(async () => {
    setLoading(true)
    setError('')

    try {
      const result = await getStoreData()
      setStore(result.store)
      setProducts(result.products)
    } catch (loadError) {
      setError('Unable to load products. Please try again.')
      setProducts([])
      setStore(null)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadProducts()
  }, [loadProducts])

  return { store, products, loading, error, refetch: loadProducts }
}
