import Link from "next/link";
import { ProductCard } from "@/components/ProductCard";
import { HttpError } from "@/lib/http";
import { getProductCategories, getProductsPage, isWooEnabled } from "@/lib/woo";

export const metadata = {
  title: "Shop"
};

type ShopPageProps = {
  searchParams?: {
    page?: string;
    cat?: string;
  };
};

const PER_PAGE = 20;

function parsePositiveInt(value?: string): number {
  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed < 1) {
    return 1;
  }
  return Math.floor(parsed);
}

function buildShopHref(page: number, categorySlug?: string) {
  const query = new URLSearchParams();
  if (page > 1) {
    query.set("page", String(page));
  }
  if (categorySlug) {
    query.set("cat", categorySlug);
  }
  const qs = query.toString();
  return qs ? `/shop?${qs}` : "/shop";
}

function buildPaginationWindow(currentPage: number, totalPages: number) {
  const windowSize = 5;
  if (totalPages <= windowSize) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  const half = Math.floor(windowSize / 2);
  const start = Math.max(1, Math.min(currentPage - half, totalPages - windowSize + 1));
  return Array.from({ length: windowSize }, (_, index) => start + index);
}

export default async function ShopPage({ searchParams }: ShopPageProps) {
  if (!isWooEnabled()) {
    return (
      <section className="stack">
        <h1>Shop</h1>
        <p>WooCommerce is not enabled.</p>
        <p>
          Add <code>WC_CONSUMER_KEY</code> and <code>WC_CONSUMER_SECRET</code> in <code>.env.local</code>. See the README setup notes.
        </p>
      </section>
    );
  }

  try {
    const requestedPage = parsePositiveInt(searchParams?.page);
    const categorySlug = searchParams?.cat?.trim() || "";
    const categories = await getProductCategories();
    const activeCategory = categorySlug ? categories.find((cat) => cat.slug === categorySlug) : undefined;
    const quickCategories = categories.slice(0, 8);
    const showActiveCategoryChip =
      Boolean(activeCategory) && !quickCategories.some((category) => category.slug === activeCategory?.slug);
    const productsPage = await getProductsPage({
      perPage: PER_PAGE,
      page: requestedPage,
      categoryId: activeCategory?.id
    });
    const pageNumbers = buildPaginationWindow(productsPage.page, productsPage.totalPages);

    return (
      <section className="stack shopPage">
        <header className="shopHero">
          <p className="shopEyebrow">WooCommerce Collection</p>
          <h1>Shop</h1>
          <p className="shopLead">
            {activeCategory
              ? `Explorando ${activeCategory.name}. Catálogo actualizado en tiempo real desde tu WordPress.`
              : "Catálogo completo conectado a WooCommerce con filtros por categoría y paginación."}
          </p>
          <div className="shopKpis">
            <article className="card">
              <p>Total productos</p>
              <strong>{productsPage.total}</strong>
            </article>
            <article className="card">
              <p>Categorías</p>
              <strong>{categories.length}</strong>
            </article>
            <article className="card">
              <p>Página actual</p>
              <strong>
                {productsPage.page} / {productsPage.totalPages}
              </strong>
            </article>
          </div>
        </header>

        <div className="shopFilters card">
          <div className="shopFiltersHeader">
            <h2>Categorías</h2>
            <Link href={buildShopHref(1)} className="shopResetLink">
              Limpiar filtro
            </Link>
          </div>
          <form className="shopFilterForm" method="get" action="/shop">
            <label htmlFor="category-filter">Filtrar por categoría</label>
            <div className="shopFilterRow">
              <select id="category-filter" name="cat" defaultValue={activeCategory?.slug || ""}>
                <option value="">Todas</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.slug}>
                    {category.name}
                  </option>
                ))}
              </select>
              <button type="submit" className="button shopFilterApplyButton">
                Aplicar
              </button>
            </div>
          </form>
          <div className="shopChips">
            <Link
              href={buildShopHref(1)}
              className={`shopChip ${activeCategory ? "" : "shopChipActive"}`}
            >
              Todas
            </Link>
            {quickCategories.map((category) => {
              const isActive = activeCategory?.slug === category.slug;
              return (
                <Link
                  key={category.id}
                  href={buildShopHref(1, category.slug)}
                  className={`shopChip ${isActive ? "shopChipActive" : ""}`}
                >
                  {category.name}
                </Link>
              );
            })}
            {showActiveCategoryChip ? (
              <Link
                href={buildShopHref(1, activeCategory?.slug)}
                className="shopChip shopChipActive"
              >
                {activeCategory?.name}
              </Link>
            ) : null}
            {categories.length > quickCategories.length ? (
              <span className="shopChip shopChipMuted">+{categories.length - quickCategories.length} más</span>
            ) : null}
          </div>
        </div>

        <div className="shopToolbar">
          <p className="shopMeta">
            Mostrando hasta {PER_PAGE} productos por página
            {activeCategory ? ` en ${activeCategory.name}` : ""}.
          </p>
        </div>

        <div className="grid">
          {productsPage.items.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
        {productsPage.items.length === 0 ? <p className="shopMeta">No hay productos para esta categoría.</p> : null}

        <nav className="shopPagination" aria-label="Paginación de productos">
          <Link
            href={buildShopHref(productsPage.page - 1, activeCategory?.slug)}
            className="shopPageButton"
            aria-disabled={productsPage.page <= 1}
          >
            Anterior
          </Link>

          <div className="shopPageNumbers">
            {pageNumbers.map((pageNumber) => (
              <Link
                key={pageNumber}
                href={buildShopHref(pageNumber, activeCategory?.slug)}
                className={`shopPageNumber ${pageNumber === productsPage.page ? "shopPageNumberActive" : ""}`}
              >
                {pageNumber}
              </Link>
            ))}
          </div>

          <Link
            href={buildShopHref(productsPage.page + 1, activeCategory?.slug)}
            className="shopPageButton"
            aria-disabled={productsPage.page >= productsPage.totalPages}
          >
            Siguiente
          </Link>
        </nav>
      </section>
    );
  } catch (error) {
    if (error instanceof HttpError && error.status === 401) {
      return (
        <section className="stack">
          <h1>Shop</h1>
          <p>No se pudo autenticar contra WooCommerce REST API (HTTP 401).</p>
          <p>
            Verifica <code>WC_CONSUMER_KEY</code> y <code>WC_CONSUMER_SECRET</code> en <code>.env.local</code>, y que la key tenga permisos de lectura.
          </p>
        </section>
      );
    }

    throw error;
  }
}
