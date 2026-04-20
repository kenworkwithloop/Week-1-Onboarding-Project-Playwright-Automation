/**
 * Catalog UI uses `.features_items .productinfo` cards (see `ProductsPage.productCards`).
 * For “all products”, keep this in sync with `GET /api/productsList` for the same `BASE_URL`.
 */
export const ALL_PRODUCTS_CATALOG_COUNT = 34;

export type CategoryProductCatalogScenario = {
  categoryId: number;
  /** Shown as the main listing heading after navigating via `#accordian`. */
  heading: RegExp;
  expectedProductCount: number;
};

/**
 * Sidebar: `#accordian` (WOMEN / MEN / KIDS) → `/category_products/:id` (`HomePage.openCategoryProducts`).
 * Each entry drives one UI test (heading + product card count).
 */
export const CATEGORY_PRODUCT_CATALOG_SCENARIOS: ReadonlyArray<CategoryProductCatalogScenario> = [
  { categoryId: 1, heading: /Women - Dress Products/i, expectedProductCount: 3 },
  { categoryId: 2, heading: /Women - Tops Products/i, expectedProductCount: 6 },
  { categoryId: 3, heading: /Men - Tshirts Products/i, expectedProductCount: 6 },
  { categoryId: 4, heading: /Kids - Dress Products/i, expectedProductCount: 6 },
  { categoryId: 5, heading: /Kids - Tops & Shirts Products/i, expectedProductCount: 7 },
  { categoryId: 6, heading: /Men - Jeans Products/i, expectedProductCount: 3 },
  { categoryId: 7, heading: /Women - Saree Products/i, expectedProductCount: 3 },
];
