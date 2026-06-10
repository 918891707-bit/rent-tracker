import nodemailer from 'nodemailer'

let transporter: any = null

function getTransporter() {
  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: 'smtp.qq.com',
      port: 465,
      secure: true,
      auth: {
        user: process.env.SMTP_USER || '918891707@qq.com',
        pass: process.env.SMTP_PASS || '',
      },
    })
  }
  return transporter
}

interface RentReminderEmail {
  to: string
  tenantName: string
  unitName: string
  amount: number
  dueDate: string
  daysUntilDue: number
  type: 'upcoming' | 'overdue'
}

export async function sendRentReminder(data: RentReminderEmail) {
  const transport = getTransporter()

  if (!process.env.SMTP_PASS) {
    console.log('SMTP not configured — skipping email to', data.to)
    return { success: false, error: 'SMTP password not set' }
  }

  const isOverdue = data.type === 'overdue'
  const subject = isOverdue
    ? `Reminder: Rent for ${data.unitName} is past due`
    : `Upcoming rent due for ${data.unitName}`

  try {
    await transport.sendMail({
      from: `RentTrack <${process.env.SMTP_USER || '918891707@qq.com'}>`,
      to: data.to,
      subject,
      html: buildEmailTemplate(data),
    })
    return { success: true }
  } catch (err: any) {
    console.error('Failed to send reminder email:', err.message)
    return { success: false, error: err.message }
  }
}

function buildEmailTemplate(data: RentReminderEmail): string {
  const isOverdue = data.type === 'overdue'
  const accentColor = isOverdue ? '#DC2626' : '#2563EB'
  const statusText = isOverdue ? 'PAST DUE' : 'UPCOMING'

  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; padding: 0; margin: 0; background: #f9fafb;">
  <div style="max-width: 480px; margin: 0 auto; padding: 32px 16px;">
    <div style="background: white; border-radius: 12px; padding: 32px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
      <div style="text-align: center; margin-bottom: 24px;">
        <h1 style="color: #1f2937; font-size: 24px; margin: 0;">RentTrack</h1>
      </div>
      <div style="background: ${accentColor}10; border-left: 4px solid ${accentColor}; padding: 16px; border-radius: 8px; margin-bottom: 24px;">
        <p style="color: ${accentColor}; font-weight: 700; font-size: 14px; margin: 0 0 4px 0;">${statusText}</p>
        <p style="color: #374151; font-size: 20px; font-weight: 700; margin: 0;">$${data.amount.toLocaleString()}</p>
      </div>
      <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">
        <tr>
          <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Unit</td>
          <td style="padding: 8px 0; color: #1f2937; font-size: 14px; font-weight: 600; text-align: right;">${data.unitName}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Due Date</td>
          <td style="padding: 8px 0; color: #1f2937; font-size: 14px; font-weight: 600; text-align: right;">${data.dueDate}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Status</td>
          <td style="padding: 8px 0; color: ${accentColor}; font-size: 14px; font-weight: 700; text-align: right;">
            ${isOverdue ? `${Math.abs(data.daysUntilDue)} day(s) overdue` : `${data.daysUntilDue} day(s) until due`}
          </td>
        </tr>
      </table>
      <div style="text-align: center; padding-top: 16px; border-top: 1px solid #f3f4f6;">
        <p style="color: #9ca3af; font-size: 12px; margin: 0;">
          Sent by RentTrack · ${data.tenantName}<br/>
          This is an automated reminder.
        </p>
      </div>
    </div>
  </div>
</body>
</html>`
}
