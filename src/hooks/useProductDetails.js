import { useCallback, useEffect, useRef, useState } from 'react'
import { getProductDetails } from '../services/productDetailsApi'

export default function useProductDetails(product) {
  const [state, setState] = useState({ data: null, identity: '', loading: false, error: '' })
  const [attempt, setAttempt] = useState(0)
  const requestIdRef = useRef(0)
  const brand = product?.raw?.Company || product?.raw?.brand || (product?.brand !== 'Brand' ? product?.brand : '')
  const model = product?.raw?.Model || product?.raw?.model || (product?.model !== 'Phone' ? product?.model : '')
  const identity = `${brand} / ${model}`

  useEffect(() => {
    const controller = new AbortController()
    const requestId = requestIdRef.current + 1
    requestIdRef.current = requestId
    let active = true

    if (!brand || !model) {
      setState({ data: null, identity, loading: false, error: 'Technical specifications are unavailable for this product.' })
      return () => controller.abort()
    }

    setState({ data: null, identity, loading: true, error: '' })
    getProductDetails(brand, model, controller.signal)
      .then((data) => {
        if (!active || requestId !== requestIdRef.current) return
        setState({ data, identity, loading: false, error: '' })
      })
      .catch((error) => {
        const aborted = error?.name === 'CanceledError' || error?.name === 'AbortError' || error?.code === 'ERR_CANCELED'
        if (aborted || !active || requestId !== requestIdRef.current) {
          return
        }
        setState({ data: null, identity, loading: false, error: 'Some technical specifications are temporarily unavailable.' })
      })

    return () => {
      active = false
      controller.abort()
    }
  }, [brand, model, identity, attempt])

  const currentState = state.identity === identity ? state : { data: null, identity, loading: true, error: '' }
  return { ...currentState, retry: useCallback(() => setAttempt((value) => value + 1), []) }
}
