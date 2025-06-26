import type { Product, IoTSensorData } from "@/types"

// Mock product database
const MOCK_PRODUCTS: Product[] = [
  {
    id: "prod_001",
    name: "Organic Bananas",
    price: 2.99,
    barcode: "1234567890123",
    rfidTag: "RFID_001",
    weight: 0.5,
    category: "Fruits",
    expiryDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
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
    expiryDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
    imageUrl: "/placeholder.svg?height=100&width=100",
  },
  {
    id: "prod_003",
    name: "Expired Yogurt",
    price: 1.99,
    barcode: "3456789012345",
    rfidTag: "RFID_003",
    weight: 0.2,
    category: "Dairy",
    expiryDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago (expired)
    imageUrl: "/placeholder.svg?height=100&width=100",
  },
  {
    id: "prod_004",
    name: "Bread Loaf",
    price: 2.49,
    barcode: "4567890123456",
    rfidTag: "RFID_004",
    weight: 0.7,
    category: "Bakery",
    expiryDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
    imageUrl: "/placeholder.svg?height=100&width=100",
  },
  {
    id: "prod_005",
    name: "Premium Coffee",
    price: 12.99,
    barcode: "5678901234567",
    rfidTag: "RFID_005",
    weight: 0.3,
    category: "Beverages",
    expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year from now
    imageUrl: "/placeholder.svg?height=100&width=100",
  },
]

export class IoTBasketSimulator {
  private basketId: string
  private onDataReceived: (data: IoTSensorData) => void
  private isActive = false

  constructor(basketId: string, onDataReceived: (data: IoTSensorData) => void) {
    this.basketId = basketId
    this.onDataReceived = onDataReceived
  }

  start() {
    this.isActive = true
    console.log(`IoT Basket Simulator started for basket: ${this.basketId}`)
  }

  stop() {
    this.isActive = false
    console.log(`IoT Basket Simulator stopped for basket: ${this.basketId}`)
  }

  // Simulate RFID scan
  simulateRFIDScan(rfidTag: string) {
    if (!this.isActive) return

    const product = MOCK_PRODUCTS.find((p) => p.rfidTag === rfidTag)
    if (product) {
      const sensorData: IoTSensorData = {
        basketId: this.basketId,
        sensorType: "rfid",
        data: {
          rfidTag,
          product,
          signalStrength: Math.random() * 100,
        },
        timestamp: new Date(),
        processed: false,
      }

      this.onDataReceived(sensorData)
    }
  }

  // Simulate barcode scan
  simulateBarcodeScan(barcode: string) {
    if (!this.isActive) return

    const product = MOCK_PRODUCTS.find((p) => p.barcode === barcode)
    if (product) {
      const sensorData: IoTSensorData = {
        basketId: this.basketId,
        sensorType: "camera",
        data: {
          barcode,
          product,
          scanQuality: Math.random() * 100,
        },
        timestamp: new Date(),
        processed: false,
      }

      this.onDataReceived(sensorData)
    }
  }

  // Simulate weight sensor detection
  simulateWeightChange(weightAdded: number) {
    if (!this.isActive) return

    // Try to match weight to a product
    const product = MOCK_PRODUCTS.find((p) => p.weight && Math.abs(p.weight - weightAdded) < 0.1)

    const sensorData: IoTSensorData = {
      basketId: this.basketId,
      sensorType: "weight",
      data: {
        weightChange: weightAdded,
        totalWeight: this.getCurrentWeight() + weightAdded,
        product: product || null,
        confidence: product ? 0.8 : 0.3,
      },
      timestamp: new Date(),
      processed: false,
    }

    this.onDataReceived(sensorData)
  }

  // Get available products for simulation
  getAvailableProducts(): Product[] {
    return MOCK_PRODUCTS
  }

  // Get current basket weight (mock)
  private getCurrentWeight(): number {
    return Math.random() * 5 // Random weight between 0-5 kg
  }
}

// Expiry date checker utility
export class ExpiryChecker {
  static isExpired(expiryDate: Date): boolean {
    return expiryDate < new Date()
  }

  static isExpiringSoon(expiryDate: Date, daysThreshold = 3): boolean {
    const threshold = new Date()
    threshold.setDate(threshold.getDate() + daysThreshold)
    return expiryDate <= threshold && expiryDate >= new Date()
  }

  static getDaysUntilExpiry(expiryDate: Date): number {
    const now = new Date()
    const diffTime = expiryDate.getTime() - now.getTime()
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  }

  static getExpiryStatus(expiryDate: Date): "expired" | "expiring_soon" | "fresh" {
    if (this.isExpired(expiryDate)) return "expired"
    if (this.isExpiringSoon(expiryDate)) return "expiring_soon"
    return "fresh"
  }
}
