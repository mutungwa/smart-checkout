import { type NextRequest, NextResponse } from "next/server"
import type { SmartBasket, Product } from "@/types"

// Mock database
const baskets: SmartBasket[] = []
const products: Product[] = [
  {
    id: "prod_001",
    name: "Organic Bananas",
    price: 2.99,
    barcode: "1234567890123",
    rfidTag: "RFID_001",
    weight: 0.5,
    category: "Fruits",
    expiryDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    imageUrl: "/placeholder.svg?height=100&width=100",
  },
  {
    id: "prod_002",
    name: "Whole Milk",
    price: 3.49,
    barcode: "2345678901234",
    rfidTag: "RFID_002",
    weight: 1.0,
    category: "Dairy",
    expiryDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
    imageUrl: "/placeholder.svg?height=100&width=100",
  },
]

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const basketId = searchParams.get("basketId")

  if (basketId) {
    const basket = baskets.find((b) => b.id === basketId)
    if (!basket) {
      return NextResponse.json({ error: "Basket not found" }, { status: 404 })
    }
    return NextResponse.json(basket)
  }

  return NextResponse.json(baskets)
}

export async function POST(request: NextRequest) {
  try {
    const basketData = await request.json()

    const newBasket: SmartBasket = {
      id: `basket_${Date.now()}`,
      sessionId: `session_${Date.now()}`,
      items: [],
      totalAmount: 0,
      status: "active",
      createdAt: new Date(),
      updatedAt: new Date(),
      location: {
        storeId: "store_001",
        aisle: "A1",
      },
      ...basketData,
    }

    baskets.push(newBasket)
    return NextResponse.json(newBasket, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: "Invalid basket data" }, { status: 400 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const basketData = await request.json()
    const basketIndex = baskets.findIndex((b) => b.id === basketData.id)

    if (basketIndex === -1) {
      return NextResponse.json({ error: "Basket not found" }, { status: 404 })
    }

    baskets[basketIndex] = {
      ...baskets[basketIndex],
      ...basketData,
      updatedAt: new Date(),
    }

    return NextResponse.json(baskets[basketIndex])
  } catch (error) {
    return NextResponse.json({ error: "Invalid basket data" }, { status: 400 })
  }
}
