# Mobile-Garage

Mobile Garage is a React and Vite storefront for browsing used and refurbished mobile phones. It loads products from the Phoneo store API, normalizes inconsistent API fields into a predictable UI model, and provides search, filtering, sorting, comparison, wishlist, and product-detail workflows.

## Features

- Browse phones with responsive product cards and image fallbacks
- Search by phone name, brand, model, color, variant, RAM, and storage
- Filter by brand, category, offer, price, storage, RAM, and condition
- Sort by recommendation, price, newest, or discount
- Load additional products automatically when the listing reaches the viewport
- Open a product detail page with technical information and an image gallery
- Save wishlist items in browser `localStorage`
- Compare up to three phones at a time
- Responsive desktop and mobile navigation, filters, and dialogs

## Tech Stack

- React 19
- Vite 8
- React Router DOM
- Axios
- Tailwind CSS 4 with the Vite plugin
- Lucide React icons
- Oxlint

## Getting Started

### Prerequisites

- Node.js (an LTS release is recommended)
- npm

### Install dependencies

```bash
npm install
```

### Configure the API

The repository includes a `.env` file with the current listing endpoint:

```env
VITE_BASE_URL=/api/v3/store/mobilegarage
```

`VITE_BASE_URL` is used by the product listing service. Product detail requests use the local `/api/PD/:brand/:model` path, which Vite proxies to `https://super.phoneo.in` during development.

To use another listing store, change `VITE_BASE_URL` to the relevant API path before starting Vite. Do not commit private API credentials or secrets to `.env`.

### Start the development server

```bash
npm run dev
```

The app is available at `http://localhost:5173`.

## Available Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the Vite development server with HMR |
| `npm run build` | Create a production build in `dist/` |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Run Oxlint against the project |

## Project Structure

```text
src/
	App.jsx                    Application entry component
	app/
		AppShell.jsx             Connects the controller to the active theme
		useAppController.js      Search, filters, routing, wishlist, and comparison state
		components/              Storefront UI components
	hooks/
		useInfiniteProducts.js   Product loading and continuation handling
		useProductDetails.js     Product detail loading state
		useProducts.js           Product listing hook
	services/
		api.js                   Listing API and response normalization
		productDetailsApi.js     Technical details API client
	themes/
		theme1/                  Current storefront shell and theme
	utils/
		productUtils.js          Product, image, price, and filter helpers
docs/
	PRODUCT-DATA-FLOW.md       Detailed listing and image data flow
```

## Data Flow

The listing request is normalized before it reaches the UI. The service accepts product arrays in `used_phones`, `products`, or `items`, then maps them to a common product shape used by cards and filters.

```text
VITE_BASE_URL
	-> getStorePage()
	-> normalizeProduct()
	-> useInfiniteProducts()
	-> useAppController()
	-> Theme1Shell
	-> ProductCard / ProductDetailsPage
```

The listing API may return `used_phones` as a complete collection without pagination metadata. In that case, automatic loading stops after the first response. When the API provides a cursor, page, offset, or `has_more` value, the app uses that metadata for continuation requests.

For the complete image and normalization behavior, see [docs/PRODUCT-DATA-FLOW.md](docs/PRODUCT-DATA-FLOW.md).

## Product Detail Routes

Product details are opened without a full page reload at:

```text
/product/:productId
```

The detail service requests:

```text
/api/PD/:brand/:model
```

The browser back button is supported through the app's history handling. Wishlist data is stored under the `wishlist` key in `localStorage`.

## Build and Lint

Run both checks before submitting changes:

```bash
npm run lint
npm run build
```

The production build is written to `dist/`. The `dist/` directory is generated output and should not be edited manually.
