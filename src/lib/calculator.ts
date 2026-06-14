import type { CalculatorConfig, CalculatorSession, PriceBreakdown } from '@/types/app'

export function formatPrice(value: number): string {
  return new Intl.NumberFormat('ru-RU').format(Math.round(value)) + ' ₽'
}

export function calculatePrice(
  config: CalculatorConfig,
  session: Pick<
    CalculatorSession,
    'step' | 'siteTypeId' | 'pages' | 'featureIds' | 'designId' | 'contentReady' | 'timeline'
  >,
): PriceBreakdown {
  const site = config.siteTypes.find((s) => s.id === session.siteTypeId) ?? config.siteTypes[0]
  const design = config.designs.find((d) => d.id === session.designId) ?? config.designs[0]
  const extraPages = Math.max(0, session.pages - 1)

  const featureTotal = session.featureIds.reduce((sum, id) => {
    const feature = config.features.find((f) => f.id === id && f.enabled)
    return sum + (feature?.price ?? 0)
  }, 0)

  const designCost = Math.round(site.basePrice * config.designRatio * design.multiplier)
  const devCost = Math.round(site.devBase + extraPages * config.pricePerPage)
  const contentCost = config.contentReadyFees[session.contentReady] ?? 0
  const seoCost = Math.round(site.basePrice * config.seoRatio)
  const total = designCost + devCost + featureTotal + contentCost + seoCost

  let lines: PriceBreakdown['lines']

  if (session.step >= 3) {
    lines = [
      { label: 'Дизайн + разработка', amount: designCost + devCost },
      { label: 'Функционал + контент', amount: featureTotal + contentCost },
    ]
  } else if (session.step >= 1) {
    lines = [
      { label: 'Дизайн', amount: designCost },
      { label: 'Разработка', amount: devCost },
    ]
    if (featureTotal > 0) lines.push({ label: 'Функционал', amount: featureTotal })
    if (contentCost > 0) lines.push({ label: 'Контент', amount: contentCost })
  } else {
    lines = [
      { label: `Дизайн (${site.title.toLowerCase()})`, amount: designCost },
      { label: `Разработка (${session.pages} стр.)`, amount: devCost },
      { label: 'SEO-оптимизация', amount: seoCost },
    ]
  }

  return {
    total,
    timeline: session.step >= 2 && session.timeline ? session.timeline : config.timelineText,
    lines,
  }
}
