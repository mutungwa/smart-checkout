import type { SecurityEvent, AIDetection } from "@/types"

export class AISecuritySystem {
  private basketId: string
  private onSecurityEvent: (event: SecurityEvent) => void
  private isMonitoring = false

  constructor(basketId: string, onSecurityEvent: (event: SecurityEvent) => void) {
    this.basketId = basketId
    this.onSecurityEvent = onSecurityEvent
  }

  startMonitoring() {
    this.isMonitoring = true
    console.log(`AI Security monitoring started for basket: ${this.basketId}`)

    // Simulate periodic security checks
    this.simulateSecurityMonitoring()
  }

  stopMonitoring() {
    this.isMonitoring = false
    console.log(`AI Security monitoring stopped for basket: ${this.basketId}`)
  }

  // Simulate AI-based security monitoring
  private simulateSecurityMonitoring() {
    if (!this.isMonitoring) return

    // Simulate random security events for demo purposes
    const eventTypes = ["suspicious_behavior", "item_removal", "unauthorized_access"] as const

    // Random chance of security event (5% every 10 seconds)
    setTimeout(() => {
      if (this.isMonitoring && Math.random() < 0.05) {
        const eventType = eventTypes[Math.floor(Math.random() * eventTypes.length)]
        this.generateSecurityEvent(eventType)
      }

      if (this.isMonitoring) {
        this.simulateSecurityMonitoring()
      }
    }, 10000)
  }

  // Analyze camera feed for suspicious behavior
  analyzeCameraFeed(imageData: ImageData | string): AIDetection[] {
    // Simulate AI analysis
    const detections: AIDetection[] = []

    // Simulate object detection
    if (Math.random() < 0.3) {
      // 30% chance of detecting something
      detections.push({
        type: "object",
        confidence: 0.85 + Math.random() * 0.15,
        boundingBox: {
          x: Math.random() * 640,
          y: Math.random() * 480,
          width: 50 + Math.random() * 100,
          height: 50 + Math.random() * 100,
        },
        description: "Unscanned item detected in basket",
        timestamp: new Date(),
      })
    }

    // Simulate behavior analysis
    if (Math.random() < 0.1) {
      // 10% chance of suspicious behavior
      detections.push({
        type: "behavior",
        confidence: 0.75 + Math.random() * 0.25,
        description: "Suspicious movement pattern detected",
        timestamp: new Date(),
      })
    }

    return detections
  }

  // Check for item tampering
  detectItemTampering(beforeWeight: number, afterWeight: number, expectedChange: number): boolean {
    const actualChange = afterWeight - beforeWeight
    const tolerance = 0.1 // 100g tolerance

    return Math.abs(actualChange - expectedChange) > tolerance
  }

  // Generate security event
  private generateSecurityEvent(type: SecurityEvent["type"]) {
    const severityMap = {
      suspicious_behavior: "medium",
      item_removal: "high",
      unauthorized_access: "critical",
      expired_item: "low",
    } as const

    const event: SecurityEvent = {
      id: `sec_${Date.now()}`,
      basketId: this.basketId,
      type,
      severity: severityMap[type],
      description: this.getEventDescription(type),
      timestamp: new Date(),
      resolved: false,
      aiConfidence: 0.7 + Math.random() * 0.3,
      cameraId: `cam_${Math.floor(Math.random() * 10) + 1}`,
    }

    this.onSecurityEvent(event)
  }

  private getEventDescription(type: SecurityEvent["type"]): string {
    const descriptions = {
      suspicious_behavior: "AI detected unusual customer behavior patterns",
      item_removal: "Item removed from basket without proper scanning",
      unauthorized_access: "Unauthorized access attempt detected",
      expired_item: "Expired product detected in basket",
    }

    return descriptions[type]
  }

  // Validate basket contents against expected items
  validateBasketContents(expectedItems: any[], detectedItems: any[]): SecurityEvent[] {
    const events: SecurityEvent[] = []

    // Check for missing items
    expectedItems.forEach((expected) => {
      const found = detectedItems.find(
        (detected) => detected.id === expected.id || detected.barcode === expected.barcode,
      )

      if (!found) {
        events.push({
          id: `sec_${Date.now()}_${Math.random()}`,
          basketId: this.basketId,
          type: "item_removal",
          severity: "high",
          description: `Expected item "${expected.name}" not found in basket`,
          timestamp: new Date(),
          resolved: false,
          aiConfidence: 0.9,
        })
      }
    })

    // Check for unexpected items
    detectedItems.forEach((detected) => {
      const expected = expectedItems.find((exp) => exp.id === detected.id || exp.barcode === detected.barcode)

      if (!expected) {
        events.push({
          id: `sec_${Date.now()}_${Math.random()}`,
          basketId: this.basketId,
          type: "suspicious_behavior",
          severity: "medium",
          description: `Unexpected item detected in basket: "${detected.name}"`,
          timestamp: new Date(),
          resolved: false,
          aiConfidence: 0.8,
        })
      }
    })

    return events
  }
}

// Computer Vision utilities for item detection
export class ComputerVision {
  // Simulate barcode detection from camera
  static detectBarcode(imageData: ImageData | string): string | null {
    // Simulate barcode detection
    const barcodes = ["1234567890123", "2345678901234", "3456789012345", "4567890123456", "5678901234567"]

    // 70% chance of successful detection
    if (Math.random() < 0.7) {
      return barcodes[Math.floor(Math.random() * barcodes.length)]
    }

    return null
  }

  // Simulate expiry date detection from camera
  static detectExpiryDate(imageData: ImageData | string): Date | null {
    // Simulate OCR for expiry date detection
    if (Math.random() < 0.6) {
      // 60% success rate
      const daysFromNow = Math.floor(Math.random() * 30) - 5 // -5 to +25 days
      const expiryDate = new Date()
      expiryDate.setDate(expiryDate.getDate() + daysFromNow)
      return expiryDate
    }

    return null
  }

  // Simulate object detection in basket
  static detectObjects(imageData: ImageData | string): AIDetection[] {
    const objects = ["banana", "milk_carton", "bread", "coffee_bag", "yogurt_cup"]

    const detections: AIDetection[] = []

    // Simulate 1-3 objects detected
    const numObjects = Math.floor(Math.random() * 3) + 1

    for (let i = 0; i < numObjects; i++) {
      detections.push({
        type: "object",
        confidence: 0.7 + Math.random() * 0.3,
        boundingBox: {
          x: Math.random() * 640,
          y: Math.random() * 480,
          width: 50 + Math.random() * 150,
          height: 50 + Math.random() * 150,
        },
        description: objects[Math.floor(Math.random() * objects.length)],
        timestamp: new Date(),
      })
    }

    return detections
  }
}
