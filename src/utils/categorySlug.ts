export interface CategorySlugSource {
  id: number
  name: string
}

export interface CategoryRoute<T extends CategorySlugSource> {
  category: T
  slug: string
}

export function slugifyCategoryName(name: string): string {
  return name
    .trim()
    .replace(/[đĐ]/g, (letter) => (letter === 'đ' ? 'd' : 'D'))
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export function buildCategoryRoutes<T extends CategorySlugSource>(
  categories: readonly T[],
): CategoryRoute<T>[] {
  const bases = categories.map((category) => slugifyCategoryName(category.name))
  const baseCounts = new Map<string, number>()

  for (const base of bases) {
    baseCounts.set(base, (baseCounts.get(base) ?? 0) + 1)
  }

  const routes = categories.map((category, index) => {
    const base = bases[index] || 'category'
    const duplicate = (baseCounts.get(bases[index]) ?? 0) > 1
    return {
      category,
      slug: duplicate || !bases[index] ? `${base}-${category.id}` : base,
    }
  })

  let collisionsExist = true
  while (collisionsExist) {
    const slugCounts = new Map<string, number>()
    for (const route of routes) {
      slugCounts.set(route.slug, (slugCounts.get(route.slug) ?? 0) + 1)
    }

    collisionsExist = false
    for (const route of routes) {
      if ((slugCounts.get(route.slug) ?? 0) > 1) {
        route.slug = `${route.slug}-${route.category.id}`
        collisionsExist = true
      }
    }
  }

  return routes
}

export function resolveCategoryFromSlug<T extends CategorySlugSource>(
  categories: readonly T[],
  slug: string,
): T | undefined {
  const normalizedSlug = slug.trim().toLowerCase()
  return buildCategoryRoutes(categories).find((route) => route.slug === normalizedSlug)?.category
}
