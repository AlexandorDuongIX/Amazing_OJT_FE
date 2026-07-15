import type {
  InventoryRecord,
  InventorySummary,
  InventoryWriteInput,
  StockStatus,
} from './types'

export function availableQuantity(inventory: Pick<InventoryRecord, 'quantity' | 'reservedQuantity'>): number {
  return Math.max(0, inventory.quantity - inventory.reservedQuantity)
}

export function getStockStatus(quantity: number): StockStatus {
  if (quantity <= 0) return 'out-of-stock'
  if (quantity <= 5) return 'low-stock'
  return 'in-stock'
}

export function aggregateInventoryByProduct(records: InventoryRecord[]): Map<number, InventorySummary> {
  const grouped = new Map<number, InventorySummary>()

  for (const record of records) {
    const current = grouped.get(record.productId)
    const quantity = (current?.quantity ?? 0) + Math.max(0, record.quantity)
    const reservedQuantity = (current?.reservedQuantity ?? 0) + Math.max(0, record.reservedQuantity)
    const available = Math.max(0, quantity - reservedQuantity)
    grouped.set(record.productId, {
      productId: record.productId,
      quantity,
      reservedQuantity,
      availableQuantity: available,
      status: getStockStatus(available),
      records: [...(current?.records ?? []), record],
    })
  }

  return grouped
}

function preserveInventoryMetadata(record: InventoryRecord): InventoryWriteInput {
  return {
    id: record.id,
    productId: record.productId,
    quantity: record.quantity,
    reservedQuantity: record.reservedQuantity,
    ...(record.warehouseId !== undefined ? { warehouseId: record.warehouseId } : {}),
    ...(record.location !== undefined ? { location: record.location } : {}),
    ...(record.lastRestockDate !== undefined ? { lastRestockDate: record.lastRestockDate } : {}),
    ...(record.notes !== undefined ? { notes: record.notes } : {}),
  }
}

export function createStockTransition(
  record: InventoryRecord,
  target: Extract<StockStatus, 'in-stock' | 'out-of-stock'>,
  nextTotalQuantity?: number,
): InventoryWriteInput {
  const preserved = preserveInventoryMetadata(record)
  if (target === 'out-of-stock') {
    return { ...preserved, quantity: record.reservedQuantity }
  }

  if (nextTotalQuantity === undefined || nextTotalQuantity <= record.reservedQuantity) {
    throw new Error('New total quantity must be greater than reserved quantity.')
  }
  return { ...preserved, quantity: nextTotalQuantity }
}
