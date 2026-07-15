import { Plus, RotateCcw } from 'lucide-react'
import { Link } from 'react-router-dom'
import { DeleteProductDialog, StockDialog } from './components/ProductActionDialogs'
import ProductFilters from './components/ProductFilters'
import ProductPagination from './components/ProductPagination'
import ProductTable from './components/ProductTable'
import SummaryCards from './components/SummaryCards'
import {
  draftFromFilters,
  PRODUCT_PAGE_SIZE,
  useProductManagement,
} from './useProductManagement'

export default function ProductManagementPage() {
  const page = useProductManagement()

  return (
    <div className="space-y-8">
      <header className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="font-serif text-4xl font-medium leading-tight text-black">Quản lý Sản phẩm</h1>
            <p className="mt-2 text-[11px] uppercase tracking-[0.15em] text-[#444748]">Trang chủ &nbsp;/&nbsp; <strong className="text-black">Inventory</strong></p>
          </div>
          {page.canWrite ? (
            <Link to="/admin/inventory/new" aria-label="Add new product" className="inline-flex min-h-14 items-center justify-center gap-3 bg-black px-7 text-xs uppercase tracking-[0.16em] text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black">
              <Plus size={16} strokeWidth={1.5} /> Thêm sản phẩm mới
            </Link>
          ) : (
            <button type="button" aria-label="Add new product" disabled className="inline-flex min-h-14 cursor-not-allowed items-center justify-center gap-3 bg-black/45 px-7 text-xs uppercase tracking-[0.16em] text-white">
              <Plus size={16} strokeWidth={1.5} /> Thêm sản phẩm mới
            </button>
          )}
        </header>

        {page.successMessage ? <div role="status" className="border-l-4 border-[#735c00] bg-[#fff7d8] px-5 py-4 text-sm">{page.successMessage}</div> : null}
        {!page.canWrite ? <div role="note" className="border-l-4 border-[#735c00] bg-[#fff7d8] px-5 py-4 text-sm">An Admin or Staff token is required for create, edit, stock, and delete actions. Your current view remains read-only.</div> : null}

        <SummaryCards total={page.products.totalItems} {...page.stockCounts} />

        <ProductFilters
          key={page.queryKey}
          initialValues={draftFromFilters(page.filters)}
          categories={page.categories}
          categoriesError={page.categoriesError}
          onApply={page.applyFilters}
          onReset={page.resetFilters}
        />

        {page.inventoryError ? <div role="alert" className="flex items-center justify-between gap-4 border border-[#ffdad6] bg-[#fff5f3] px-5 py-4 text-sm text-[#93000a]"><span>Inventory totals could not be loaded: {page.inventoryError}</span><button type="button" onClick={page.retryInventory} className="font-semibold underline">Retry inventory</button></div> : null}
        {page.actionError ? <div role="alert" className="border border-[#ffdad6] bg-[#fff5f3] px-5 py-4 text-sm text-[#93000a]">The product action was not completed: {page.actionError}</div> : null}
        {page.productsError ? (
          <div role="alert" className="border border-[#ffdad6] bg-[#fff5f3] px-6 py-10 text-center text-[#93000a]">
            <p>{page.productsError}</p>
            <button type="button" onClick={page.retryProducts} className="mt-5 inline-flex min-h-11 items-center gap-2 border border-[#93000a] px-5 text-xs font-semibold uppercase tracking-[0.12em]"><RotateCcw size={15} /> Retry products</button>
          </div>
        ) : (
          <section aria-label="Products">
            <ProductTable
              products={page.products.items}
              inventory={page.inventoryByProduct}
              canWrite={page.canWrite}
              canManageStock={page.canManageStock}
              loading={page.productsLoading}
              busyProductId={page.busyProductId}
              onDelete={page.setDeleteTarget}
              onMarkOutOfStock={(product, summary) => void page.markOutOfStock(product, summary)}
              onSetInStock={(product, summary) => page.setStockTarget({ product, summary })}
            />
            {!page.productsLoading && page.products.items.length > 0 ? <ProductPagination page={page.filters.page} pageSize={PRODUCT_PAGE_SIZE} totalItems={page.products.totalItems} onPageChange={page.setPage} /> : null}
          </section>
        )}

        <footer className="flex flex-col gap-3 border-t border-[#c4c7c7]/30 pt-8 text-[11px] uppercase tracking-[0.12em] text-[#747878] sm:flex-row sm:justify-between">
          <p>© 2026 Amazing Fashion. All rights reserved.</p>
          <p>Privacy Policy &nbsp;&nbsp; Terms of Service &nbsp;&nbsp; Support</p>
        </footer>
      
      {page.deleteTarget ? <DeleteProductDialog product={page.deleteTarget} busy={page.busyProductId === page.deleteTarget.id} onClose={() => page.setDeleteTarget(undefined)} onConfirm={() => void page.confirmDelete()} /> : null}
      {page.stockTarget ? <StockDialog product={page.stockTarget.product} summary={page.stockTarget.summary} busy={page.busyProductId === page.stockTarget.product.id} onClose={() => page.setStockTarget(undefined)} onConfirm={(quantity) => void page.setInStock(quantity)} /> : null}
    </div>
  )
}
