import { type NextRequest, NextResponse } from "next/server"
import type { Product } from "@/types"

// Mock product database
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
    description: "Fresh organic bananas from local farms",
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
    description: "Fresh whole milk, 1 gallon",
  },
  {
    id: "prod_003",
    name: "Expired Yogurt",
    price: 1.99,
    barcode: "3456789012345",
    rfidTag: "RFID_003",
    weight: 0.2,
    category: "Dairy",
    expiryDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    imageUrl: "/placeholder.svg?height=100&width=100",
    description: "Greek yogurt - expired for testing",
  },
  {
    id: "prod_004",
    name: "Bread Loaf",
    price: 2.49,
    barcode: "4567890123456",
    rfidTag: "RFID_004",
    weight: 0.7,
    category: "Bakery",
    expiryDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
    imageUrl: "/placeholder.svg?height=100&width=100",
    description: "Whole wheat bread loaf",
  },
  {
    id: "prod_005",
    name: "Premium Coffee",
    price: 12.99,
    barcode: "5678901234567",
    rfidTag: "RFID_005",
    weight: 0.3,
    category: "Beverages",
    expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
    imageUrl: "/placeholder.svg?height=100&width=100",
    description: "Premium arabica coffee beans",
  },
]

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const barcode = searchParams.get("barcode")
  const rfidTag = searchParams.get("rfidTag")
  const category = searchParams.get("category")

  let filteredProducts = products

  if (barcode) {
    filteredProducts = products.filter((p) => p.barcode === barcode)
  } else if (rfidTag) {
    filteredProducts = products.filter((p) => p.rfidTag === rfidTag)
  } else if (category) {
    filteredProducts = products.filter((p) => p.category.toLowerCase() === category.toLowerCase())
  }

  return NextResponse.json(filteredProducts)
}

export async function POST(request: NextRequest) {
  try {
    const productData = await request.json()

    const newProduct: Product = {
      id: `prod_${Date.now()}`,
      barcode: `${Date.now()}`,
      rfidTag: `RFID_${Date.now()}`,
      ...productData,
    }

    products.push(newProduct)
    return NextResponse.json(newProduct, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: "Invalid product data" }, { status: 400 })
  }
}
