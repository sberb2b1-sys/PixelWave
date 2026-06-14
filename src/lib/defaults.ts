import type { CalculatorConfig, CalculatorSession } from '@/types/app'

export const DEFAULT_CONFIG: CalculatorConfig = {
  siteTypes: [
    { id: 'landing', title: 'Лендинг', basePrice: 30000, devBase: 36000 },
    { id: 'corporate', title: 'Корп. сайт', basePrice: 60000, devBase: 72000 },
    { id: 'shop', title: 'Интернет-магазин', basePrice: 90000, devBase: 108000 },
    { id: 'portfolio', title: 'Портфолио', basePrice: 25000, devBase: 30000 },
  ],
  features: [
    { id: 'form', title: 'Форма заявки', price: 5000, enabled: true },
    { id: 'booking', title: 'Онлайн-запись', price: 12000, enabled: true },
    { id: 'calc', title: 'Калькулятор цены', price: 15000, enabled: true },
    { id: 'payment', title: 'Онлайн-оплата', price: 20000, enabled: true },
    { id: 'cart', title: 'Корзина', price: 25000, enabled: true },
    { id: 'cabinet', title: 'Личный кабинет', price: 30000, enabled: true },
  ],
  designs: [
    { id: 'template', title: 'Шаблон', multiplier: 0.85 },
    { id: 'custom', title: 'Индивидуальный', multiplier: 1 },
  ],
  pricePerPage: 5000,
  designRatio: 1,
  seoRatio: 0.5,
  defaultPages: 1,
  minPages: 1,
  maxPages: 30,
  timelineText: '4–5 недель',
  timelines: ['5 дней', '14 дней', 'месяц'],
  budgets: ['до 10 000 ₽', 'до 50 000 ₽', 'до 100 000 ₽', '100 000+ ₽'],
  contentReadyFees: {
    full: 0,
    partial: 15000,
    none: 30000,
  },
  whyUs: [
    '87 проектов за 5 лет',
    'Фиксированная смета без скрытых платежей',
    'Гарантия 12 месяцев на работы',
    'SEO-оптимизация включена в базу',
  ],
}

export const DEFAULT_SESSION: CalculatorSession = {
  step: 0,
  siteTypeId: 'landing',
  pages: 1,
  featureIds: [],
  contentReady: 'full',
  designId: 'template',
  timeline: '5 дней',
  budget: 'до 10 000 ₽',
  contact: '',
  name: '',
  comment: '',
  submitted: false,
}
