import axios from 'axios'

const normalizeSlug = (value) => String(value || '').trim().replace(/\s+/g, ' ')

export function normalizeProductDetailModel(company, model) {
  if (
    company?.toLowerCase() === 'apple' &&
    model?.toLowerCase().startsWith('iphone')
  ) {
    return `iPhone${model.slice(6)}`
  }

  return model
}

export async function getProductDetails(brand, model, signal) {
  const normalizedBrand = normalizeSlug(brand)
  const normalizedModel = normalizeSlug(normalizeProductDetailModel(brand, model))

  if (!normalizedBrand || !normalizedModel) {
    throw new Error('Product brand and model are required')
  }

  const url = `/api/PD/${encodeURIComponent(normalizedBrand)}/${encodeURIComponent(normalizedModel)}`

  const response = await axios.get(url, { signal })
  console.log('Product details response:', response.data) // Log the response data for debugging

  if (!response?.data?.status || !response?.data?.data) {
    throw new Error('Invalid product details response')
  }

  const details = response.data.data
  return details
}
