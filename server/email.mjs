import nodemailer from 'nodemailer'

const NOTIFY_EMAIL = process.env.NOTIFY_EMAIL || 'info@pixelwaverf.ru'
const SMTP_HOST = process.env.SMTP_HOST || 'smtp.hosting.reg.ru'
const SMTP_PORT = Number(process.env.SMTP_PORT || 465)
const SMTP_SECURE = process.env.SMTP_SECURE !== 'false'
const SMTP_USER = process.env.SMTP_USER || 'info@pixelwaverf.ru'
const SMTP_PASS = process.env.SMTP_PASS || ''
const SMTP_FROM = process.env.SMTP_FROM || SMTP_USER

const CONTENT_LABELS = {
  full: 'Всё есть',
  partial: 'Частично',
  none: 'Нет',
}

function formatMoney(amount) {
  return new Intl.NumberFormat('ru-RU').format(amount) + ' ₽'
}

function buildLeadEmail(lead) {
  const breakdown = (lead.breakdown || [])
    .map((line) => `  • ${line.label}: ${formatMoney(line.amount)}`)
    .join('\n')

  const text = [
    'Новая заявка с pixelwaverf.ru',
    '',
    `Имя: ${lead.name}`,
    `Контакт: ${lead.contact}`,
    lead.email ? `Email: ${lead.email}` : null,
    lead.phone ? `Телефон: ${lead.phone}` : null,
    '',
    `Тип сайта: ${lead.siteTypeTitle}`,
    `Страниц: ${lead.pages}`,
    `Дизайн: ${lead.designTitle}`,
    `Контент: ${CONTENT_LABELS[lead.contentReady] || lead.contentReady}`,
    `Срок: ${lead.timeline}`,
    `Итого: ${formatMoney(lead.total || 0)}`,
    breakdown ? `\nРасчёт:\n${breakdown}` : null,
    lead.comment ? `\nКомментарий:\n${lead.comment}` : null,
    '',
    `Дата: ${new Date(lead.createdAt).toLocaleString('ru-RU')}`,
    `CRM: https://pixelwaverf.ru/dashboard/leads`,
  ]
    .filter(Boolean)
    .join('\n')

  const html = text
    .split('\n')
    .map((line) => (line ? `<p>${line.replace(/</g, '&lt;')}</p>` : '<br>'))
    .join('')

  return {
    subject: `Новая заявка: ${lead.name} — ${formatMoney(lead.total || 0)}`,
    text,
    html,
  }
}

let transporter = null

function getTransporter() {
  if (!SMTP_PASS) return null
  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: SMTP_HOST,
      port: SMTP_PORT,
      secure: SMTP_SECURE,
      auth: { user: SMTP_USER, pass: SMTP_PASS },
    })
  }
  return transporter
}

export async function sendLeadNotification(lead) {
  const transport = getTransporter()
  if (!transport) {
    console.warn('[email] SMTP_PASS not set — skipping notification')
    return false
  }

  const { subject, text, html } = buildLeadEmail(lead)

  try {
    await transport.sendMail({
      from: SMTP_FROM,
      to: NOTIFY_EMAIL,
      subject,
      text,
      html,
    })
    console.log(`[email] Lead notification sent to ${NOTIFY_EMAIL}`)
    return true
  } catch (err) {
    console.error('[email] Failed to send lead notification:', err.message)
    return false
  }
}
