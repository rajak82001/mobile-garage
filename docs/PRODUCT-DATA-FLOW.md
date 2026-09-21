# Phoneo Product Data Flow

Yeh document batata hai ki product listing API se data lekar product card ki image kaise render hoti hai, aur product details page par technical images/specifications kaise load hoti hain.

## Short Flow

```text
Listing API
  -> getStorePage()
  -> safeProducts()
  -> normalizeProduct()
  -> useInfiniteProducts()
  -> App.jsx filtering/sorting
  -> ProductCard.jsx
  -> ProductImage.jsx
  -> browser <img src="product.image">
```

Product details open hone par ek second flow chalta hai:

```text
Click ProductCard
  -> App.openProduct(product)
  -> /product/{product.id}
  -> ProductDetailsPage.jsx
  -> useProductDetails(product)
  -> getProductDetails(brand, model)
  -> /api/PD/{brand}/{model}
  -> technicalDetails.phone_images / color / thumbnail
  -> ProductImage.jsx gallery
```

## 1. App Start Hote Samay

Entry point `src/main.jsx` hai. Yeh `App` component ko render karta hai.

`App.jsx` ke andar:

```js
const { store, products, loading, loadingMore, hasMore, loadMore } = useInfiniteProducts()
```

`useInfiniteProducts()` mount hote hi pehla `getStorePage()` request karta hai. Listing ke neeche
IntersectionObserver sentinel viewport se thoda pehle dikhne par `loadMore()` chalata hai. Naye
pages existing products ke saath append hote hain aur stable `id` se duplicates remove hote hain.

## 2. Listing API Request

File: `src/services/api.js`

```js
const API_URL = import.meta.env.VITE_BASE_URL
const response = await axios.get(API_URL)
const data = response?.data || {}
```

`VITE_BASE_URL` environment variable se listing endpoint milta hai. Is endpoint ka response store object ho sakta hai jisme products in teen fields me se kisi ek me ho sakte hain:

1. `used_phones`
2. `products`
3. `items`

`safeProducts(data)` in fields ko isi order me check karta hai:

```js
if (Array.isArray(data?.used_phones)) return data.used_phones
if (Array.isArray(data?.products)) return data.products
if (Array.isArray(data?.items)) return data.items
return []
```

Agar inme se koi array nahi mila, to products empty array ban jata hai.

## 3. Raw Product Ko UI Product Me Convert Karna

API ke raw field names alag-alag ho sakte hain, isliye `normalizeProduct(rawProduct, data)` ek fixed UI shape banata hai.

Example normalized object:

```js
{
  id,
  brand,
  name,
  model,
  color,
  variant,
  ram,
  storage,
  condition,
  category,
  availability,
  price,
  originalPrice,
  discount,
  image,
  images,
  raw,
  offer,
  storeLabel
}
```

Important baat: `raw` me original API product bhi save hota hai. Agar kisi field ka normalized version insufficient ho, to details page par `product.raw` se original value read ki ja sakti hai.

### Price Flow

Sale price ke liye yeh fields try hoti hain:

```text
SalePrice -> sale_price -> salePrice -> selling_price -> sellingPrice
-> Price -> price -> value -> Value -> amount
```

Original price ke liye `OriginalPrice`, `originalPrice`, `MRP`, `MRPPrice`, `ListPrice`, etc. try hote hain.

`toNumber()` currency symbols aur non-numeric characters hata kar number banata hai.

## 4. Image Data Kaise Select Hota Hai

File: `src/utils/productUtils.js`

### Primary Card Image

`normalizeProduct()` ke andar:

```js
const image = getPrimaryImage(rawProduct)
```

`getPrimaryImage()` ka order:

1. `product.image` array check hota hai.
2. Array ka first item string ho to wahi image URL/path use hota hai.
3. First item object ho to `path`, `url`, `src`, ya `image` me se pehla valid value use hota hai.
4. Agar `image` se kuch nahi mila, to fallback fields check hoti hain:
   - `Thumb`
   - `thumb`
   - `imageUrl`
5. Kuch bhi valid na ho to empty string return hota hai.

Iska matlab listing API ki image generally is shape me aa sakti hai:

```js
image: ["/uploads/phone.jpg"]
```

ya:

```js
image: [{ path: "/uploads/phone.jpg" }]
```

ya fallback ke roop me:

```js
Thumb: "/uploads/phone-thumb.jpg"
```

### All Images

`getProductImages()` multiple images collect karta hai. Yeh `image` array ke saath `Thumb`, `thumb`, aur `imageUrl` bhi add karta hai, invalid values hataata hai, aur duplicate URLs remove karta hai.

`normalizeProduct()` me:

```js
images: getProductImages(rawProduct)
```

Listing card ke liye primary `image` use hoti hai. Detail page par technical API ki images ko priority milti hai.

## 5. Data Hook Se App Tak

File: `src/hooks/useInfiniteProducts.js`

`getStorePage()` se result aane par:

```js
setProducts((current) => appendUniqueProducts(current, result.products))
```

Loading/error behavior:

- First request ke waqt `loading = true` aur card skeleton dikhte hain
- Additional request ke waqt `loadingMore = true`; pehle ke cards visible rehte hain
- Failure par initial `error` ya load-more `loadMoreError` retry action ke saath dikhaya jata hai
- API ke pagination metadata me continuation na ho to `hasMore = false` hota hai
- Current Mobile24 endpoint top-level `used_phones` ka complete collection deta hai aur pagination
  metadata nahi deta, isliye live response ke liye first batch ke baad requests stop hoti hain

## 6. App Filtering Ke Baad ProductCard

File: `src/App.jsx`

`App` products par brand, category, offer, search, price, storage, RAM, condition aur sorting apply karta hai. Filter hone ke baad visible products ko `ProductCard` me bheja jata hai.

Important: filtering image ko change nahi karti. Product object wahi normalized object rehta hai, jisme `product.image` pehle se selected primary image hai.

## 7. ProductCard Me Image Render

File: `src/components/ProductCard.jsx`

Card ke image area me:

```jsx
<ProductImage
  src={product.image}
  alt={product.name}
  className="..."
/>
```

Yahan `product.image` already `normalizeProduct()` se aa chuki hoti hai. Card raw API response ko directly read nahi karta.

Card ke baaki fields bhi normalized object se aate hain:

```text
product.brand       -> brand label
product.name        -> phone name
product.price       -> current price
product.originalPrice -> old price
product.discount    -> discount badge
product.ram/storage -> specs
product.condition   -> condition badge
```

## 8. ProductImage Component Ka Behavior

File: `src/components/ProductImage.jsx`

`ProductImage` actual browser image element render karta hai:

```jsx
<img src={imageSrc || undefined} ... />
```

### Loading State

Jab image load ho rahi hoti hai, `animate-pulse` placeholder dikhta hai.

### Successful Load

`onLoad` par `loadedSource` set hota hai aur loading placeholder hat jata hai.

### Failed Load

Default behavior me (`fallback = true`):

```text
invalid/missing image
  -> /default-product.webp
```

Agar source fail ho jaye to `failedSource` set hota hai aur default image render hoti hai.

Important: `ProductImage` image ko download karke kisi local folder me save nahi karta. Browser URL ko request karke image ko render karta hai. Browser cache kar sakta hai, lekin app me explicit download/save flow nahi hai.

## 9. Product Card Se Details Page Tak

Card me image, name, aur `View Details` button `onSelect(product)` call karte hain.

`App.jsx` ka `openProduct(product)`:

```js
window.history.pushState({}, '', `/product/${product.id}`)
setRoutePath(`/product/${product.id}`)
```

Phir `App` current route ke hisaab se `ProductDetailsPage` render karta hai aur selected normalized `product` pass karta hai.

## 10. Details API Request

File: `src/hooks/useProductDetails.js`

Details page brand/model nikalta hai:

```js
const brand = product?.raw?.Company || product?.raw?.brand || product.brand
const model = product?.raw?.Model || product?.raw?.model || product.model
```

Phir `useProductDetails()` se `getProductDetails(brand, model)` call hota hai.

File: `src/services/productDetailsApi.js`

Request URL:

```text
/api/PD/{encodedBrand}/{encodedModel}
```

Example:

```text
/api/PD/Samsung/Galaxy%20S23
```

Response valid tab maana jata hai jab:

```js
response.data.status && response.data.data
```

Valid response ka `response.data.data` `technicalDetails` ban jata hai.

## 11. Details Page Ki Image Priority

File: `src/components/ProductDetailsPage.jsx`

Details API se teen possible image sources use hote hain:

1. Selected color ki gallery: `technicalDetails.color[colorName]`
2. General phone images: `technicalDetails.phone_images`
3. Technical thumbnail: `technicalDetails.thumbnail`

Priority logic:

```text
selected color gallery available and not failed
  -> selected color images
else phone_images available
  -> phone_images
else
  -> thumbnail
```

`resolveImageUrl()` absolute URL ko as-is rakhta hai. Relative path ko is base ke saath join karta hai:

```text
https://super.phoneo.in/{relative-path}
```

`normalizeImageUrls()` invalid protocols hataata hai aur duplicate URLs remove karta hai.

Details page me `ProductImage` ko `fallback={false}` diya gaya hai. Isliye technical image fail hone par default product image automatically use nahi hoti; color gallery fail hone par code general phone images ya thumbnail par fallback karta hai.

## 12. Vite Proxy Ka Role

File: `vite.config.js`

Development me `/api` requests proxy hoti hain:

```text
browser: /api/PD/...
Vite proxy: https://super.phoneo.in/api/PD/...
```

Proxy sirf development server request routing ke liye hai. Listing API `VITE_BASE_URL` par depend karti hai. Isliye `.env` me listing URL sahi hona zaroori hai.

## 13. Debugging Checklist

### Card me image nahi aa rahi

1. Network tab me listing API ka response dekho.
2. Check karo product me `image` array hai ya `Thumb`/`thumb`/`imageUrl`.
3. `normalizeProduct()` ke baad `product.image` ki value dekho.
4. Browser me final image URL directly open karke dekho.
5. `ProductImage` ke `onError` par check karo ki `/default-product.webp` aa raha hai ya nahi.
6. Confirm karo `public/default-product.webp` file present hai.

### Detail page me technical gallery nahi aa rahi

1. Request URL `/api/PD/{brand}/{model}` check karo.
2. Brand/model me spaces ya casing issue check karo.
3. Response me `status` aur `data` present hain ya nahi.
4. `data.phone_images`, `data.color`, aur `data.thumbnail` check karo.
5. Relative image paths ke liye `https://super.phoneo.in/` se URL ban raha hai ya nahi.
6. Agar selected color images 404 hain, to gallery fallback general `phone_images` par hona chahiye.

### API field add/change karni ho

Raw API field ko directly component me add karne ke bajay pehle `normalizeProduct()` me map karna better hai. Isse `ProductCard`, filters, details page aur future components ko consistent data shape milti rahegi.

## 14. One-Line Summary

Listing API raw product bhejti hai, `normalizeProduct()` usme se primary image select karke `product.image` banata hai, `ProductCard` us value ko `ProductImage` deta hai, aur details page alag product-details API se higher-quality technical gallery load karta hai.
