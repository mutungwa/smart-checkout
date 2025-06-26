import { type NextRequest, NextResponse } from "next/server"
import { PaymentProcessor } from "@/lib/payment"

const paymentProcessor = new PaymentProcessor(process.env.STRIPE_SECRET_KEY || "test_key")

export async function POST(request: NextRequest) {
  try {
    const { amount, currency = "usd", basketId, items } = await request.json()

    if (!amount || !basketId || !items) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Create payment intent
    const paymentIntent = await paymentProcessor.createPaymentIntent(amount, currency)

    // Calculate totals
    const totals = paymentProcessor.calculateTotal(items)

    return NextResponse.json({
      paymentIntent,
      totals,
      basketId,
    })
  } catch (error) {
    console.error("Payment creation error:", error)
    return NextResponse.json({ error: "Payment creation failed" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { paymentIntentId, paymentMethodId, basketId } = await request.json()

    if (!paymentIntentId || !paymentMethodId || !basketId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Mock payment method
    const paymentMethod = {
      id: paymentMethodId,
      type: "card" as const,
      provider: "stripe",
      last4: "4242",
      isDefault: true,
    }

    // Process payment
    const result = await paymentProcessor.processPayment(paymentIntentId, paymentMethod)

    if (result.success) {
      return NextResponse.json({
        success: true,
        transactionId: result.transactionId,
        basketId,
      })
    } else {
      return NextResponse.json(
        {
          success: false,
          error: result.error,
        },
        { status: 400 },
      )
    }
  } catch (error) {
    console.error("Payment processing error:", error)
    return NextResponse.json({ error: "Payment processing failed" }, { status: 500 })
  }
}
