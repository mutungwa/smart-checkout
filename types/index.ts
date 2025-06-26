export interface Product {
  id: string
  name: string
  price: number
  barcode: string
  rfidTag?: string
  weight?: number
  category: string
  expiryDate?: Date
  imageUrl?: string
  description?: string
}

export interface BasketItem {
  id: string
  product: Product
  quantity: number
  addedAt: Date
  scannedMethod: "barcode" | "rfid" | "weight" | "manual"
}

export interface SmartBasket {
  id: string
  userId?: string
  sessionId: string
  items: BasketItem[]
  totalAmount: number
  status: "active" | "checkout" | "completed" | "abandoned"
  createdAt: Date
  updatedAt: Date
  location: {
    storeId: string
    aisle?: string
  }
}

export interface SecurityEvent {
  id: string
  basketId: string
  type: "suspicious_behavior" | "item_removal" | "unauthorized_access" | "expired_item"
  severity: "low" | "medium" | "high" | "critical"
  description: string
  timestamp: Date
  resolved: boolean
  aiConfidence?: number
  cameraId?: string
  imageUrl?: string
}

export interface User {
  id: string
  email: string
  name: string
  phone?: string
  paymentMethods: PaymentMethod[]
  preferences: UserPreferences
  createdAt: Date
}

export interface PaymentMethod {
  id: string
  type: "card" | "digital_wallet" | "bank_account"
  provider: string
  last4?: string
  isDefault: boolean
}

export interface UserPreferences {
  notifications: boolean
  autoCheckout: boolean
  expiryAlerts: boolean
  receiptFormat: "email" | "sms" | "app"
}

export interface Transaction {
  id: string
  basketId: string
  userId?: string
  amount: number
  tax: number
  items: BasketItem[]
  paymentMethod: PaymentMethod
  status: "pending" | "completed" | "failed" | "refunded"
  timestamp: Date
  receiptUrl?: string
}

export interface AIDetection {
  type: "object" | "behavior" | "expiry"
  confidence: number
  boundingBox?: {
    x: number
    y: number
    width: number
    height: number
  }
  description: string
  timestamp: Date
}

export interface IoTSensorData {
  basketId: string
  sensorType: "rfid" | "weight" | "camera"
  data: any
  timestamp: Date
  processed: boolean
}
