"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  ShoppingCart,
  Scan,
  Wifi,
  WifiOff,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Camera,
  Scale,
  CreditCard,
  Shield,
  Clock,
  Trash2,
  Plus,
  Minus,
} from "lucide-react"
import { useBasketStore } from "@/lib/store"
import { IoTBasketSimulator, ExpiryChecker } from "@/lib/iot-simulator"
import { AISecuritySystem } from "@/lib/ai-security"
import { PaymentProcessor } from "@/lib/payment"
import type { SmartBasket, Product, SecurityEvent, IoTSensorData } from "@/types"
import Image from "next/image"

export default function SmartBasketInterface() {
  const {
    currentBasket,
    setCurrentBasket,
    addItem,
    removeItem,
    updateQuantity,
    clearBasket,
    securityEvents,
    addSecurityEvent,
    isConnected,
    setConnectionStatus,
  } = useBasketStore()

  const [iotSimulator, setIotSimulator] = useState<IoTBasketSimulator | null>(null)
  const [aiSecurity, setAiSecurity] = useState<AISecuritySystem | null>(null)
  const [paymentProcessor] = useState(new PaymentProcessor("test_key"))
  const [isScanning, setIsScanning] = useState(false)
  const [scanningMethod, setScanningMethod] = useState<"barcode" | "rfid" | "weight">("barcode")
  const [showPayment, setShowPayment] = useState(false)
  const [paymentStatus, setPaymentStatus] = useState<"idle" | "processing" | "success" | "error">("idle")

  // Initialize basket and systems
  useEffect(() => {
    if (!currentBasket) {
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
      }
      setCurrentBasket(newBasket)
    }
  }, [currentBasket, setCurrentBasket])

  // Initialize IoT simulator and AI security
  useEffect(() => {
    if (currentBasket && !iotSimulator) {
      const simulator = new IoTBasketSimulator(currentBasket.id, handleSensorData)
      simulator.start()
      setIotSimulator(simulator)
      setConnectionStatus(true)

      const security = new AISecuritySystem(currentBasket.id, handleSecurityEvent)
      security.startMonitoring()
      setAiSecurity(security)
    }

    return () => {
      iotSimulator?.stop()
      aiSecurity?.stopMonitoring()
    }
  }, [currentBasket])

  const handleSensorData = (data: IoTSensorData) => {
    console.log("Sensor data received:", data)

    if (data.data.product) {
      // Check if product is expired
      if (data.data.product.expiryDate) {
        const expiryStatus = ExpiryChecker.getExpiryStatus(new Date(data.data.product.expiryDate))

        if (expiryStatus === "expired") {
          const securityEvent: SecurityEvent = {
            id: `sec_${Date.now()}`,
            basketId: data.basketId,
            type: "expired_item",
            severity: "high",
            description: `Expired product detected: ${data.data.product.name}`,
            timestamp: new Date(),
            resolved: false,
            aiConfidence: 0.95,
          }
          addSecurityEvent(securityEvent)
          return // Don't add expired items
        }
      }

      addItem(
        data.data.product,
        data.sensorType === "rfid" ? "rfid" : data.sensorType === "weight" ? "weight" : "barcode",
      )
    }
  }

  const handleSecurityEvent = (event: SecurityEvent) => {
    console.log("Security event:", event)
    addSecurityEvent(event)
  }

  const handleManualScan = (product: Product) => {
    setIsScanning(true)

    // Simulate scanning delay
    setTimeout(() => {
      // Check expiry
      if (product.expiryDate) {
        const expiryStatus = ExpiryChecker.getExpiryStatus(product.expiryDate)

        if (expiryStatus === "expired") {
          const securityEvent: SecurityEvent = {
            id: `sec_${Date.now()}`,
            basketId: currentBasket!.id,
            type: "expired_item",
            severity: "high",
            description: `Attempted to scan expired product: ${product.name}`,
            timestamp: new Date(),
            resolved: false,
            aiConfidence: 1.0,
          }
          addSecurityEvent(securityEvent)
          setIsScanning(false)
          return
        }
      }

      addItem(product, "manual")
      setIsScanning(false)
    }, 1000)
  }

  const handleCheckout = async () => {
    if (!currentBasket || currentBasket.items.length === 0) return

    setShowPayment(true)
    setPaymentStatus("processing")

    try {
      const { total } = paymentProcessor.calculateTotal(currentBasket.items)
      const paymentIntent = await paymentProcessor.createPaymentIntent(total)

      // Simulate payment processing
      setTimeout(() => {
        setPaymentStatus("success")
        setTimeout(() => {
          clearBasket()
          setShowPayment(false)
          setPaymentStatus("idle")
        }, 2000)
      }, 3000)
    } catch (error) {
      setPaymentStatus("error")
      setTimeout(() => {
        setPaymentStatus("idle")
      }, 3000)
    }
  }

  const getExpiryBadge = (expiryDate: Date) => {
    const status = ExpiryChecker.getExpiryStatus(expiryDate)
    const daysUntilExpiry = ExpiryChecker.getDaysUntilExpiry(expiryDate)

    switch (status) {
      case "expired":
        return <Badge variant="destructive">Expired</Badge>
      case "expiring_soon":
        return <Badge variant="secondary">Expires in {daysUntilExpiry} days</Badge>
      default:
        return <Badge variant="outline">Fresh</Badge>
    }
  }

  if (!currentBasket) {
    return <div>Initializing basket...</div>
  }

  const { subtotal, tax, total } = paymentProcessor.calculateTotal(currentBasket.items)
  const availableProducts = iotSimulator?.getAvailableProducts() || []
  const unreadSecurityEvents = securityEvents.filter((e) => !e.resolved).length

  return (
    <div className="container mx-auto p-4 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <ShoppingCart className="h-8 w-8" />
            Smart Checkout
          </h1>
          <div className="flex items-center gap-2">
            {isConnected ? (
              <Badge variant="outline" className="text-green-600">
                <Wifi className="h-4 w-4 mr-1" />
                Connected
              </Badge>
            ) : (
              <Badge variant="destructive">
                <WifiOff className="h-4 w-4 mr-1" />
                Disconnected
              </Badge>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          {unreadSecurityEvents > 0 && (
            <Badge variant="destructive" className="animate-pulse">
              <Shield className="h-4 w-4 mr-1" />
              {unreadSecurityEvents} Alert{unreadSecurityEvents > 1 ? "s" : ""}
            </Badge>
          )}
          <Badge variant="outline">Basket: {currentBasket.id.slice(-6)}</Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Basket Interface */}
        <div className="lg:col-span-2 space-y-6">
          {/* Scanning Interface */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Scan className="h-5 w-5" />
                Item Scanning
              </CardTitle>
              <CardDescription>Scan items using barcode, RFID, or weight sensors</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs value={scanningMethod} onValueChange={(value) => setScanningMethod(value as any)}>
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="barcode" className="flex items-center gap-2">
                    <Camera className="h-4 w-4" />
                    Barcode
                  </TabsTrigger>
                  <TabsTrigger value="rfid" className="flex items-center gap-2">
                    <Wifi className="h-4 w-4" />
                    RFID
                  </TabsTrigger>
                  <TabsTrigger value="weight" className="flex items-center gap-2">
                    <Scale className="h-4 w-4" />
                    Weight
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="barcode" className="space-y-4">
                  <div className="text-center p-8 border-2 border-dashed border-gray-300 rounded-lg">
                    <Camera className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                    <p className="text-gray-600">Point camera at barcode to scan</p>
                    {isScanning && (
                      <div className="mt-4">
                        <Progress value={75} className="w-full" />
                        <p className="text-sm text-gray-500 mt-2">Scanning...</p>
                      </div>
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="rfid" className="space-y-4">
                  <div className="text-center p-8 border-2 border-dashed border-blue-300 rounded-lg">
                    <Wifi className="h-12 w-12 mx-auto mb-4 text-blue-400" />
                    <p className="text-gray-600">Place items in basket for RFID detection</p>
                    <div className="mt-4 space-y-2">
                      {availableProducts.slice(0, 3).map((product) => (
                        <Button
                          key={product.id}
                          variant="outline"
                          size="sm"
                          onClick={() => iotSimulator?.simulateRFIDScan(product.rfidTag!)}
                          disabled={isScanning}
                        >
                          Simulate {product.name}
                        </Button>
                      ))}
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="weight" className="space-y-4">
                  <div className="text-center p-8 border-2 border-dashed border-green-300 rounded-lg">
                    <Scale className="h-12 w-12 mx-auto mb-4 text-green-400" />
                    <p className="text-gray-600">Weight sensors will detect items automatically</p>
                    <div className="mt-4 space-y-2">
                      {availableProducts.slice(0, 3).map((product) => (
                        <Button
                          key={product.id}
                          variant="outline"
                          size="sm"
                          onClick={() => iotSimulator?.simulateWeightChange(product.weight || 0.5)}
                          disabled={isScanning}
                        >
                          Add {product.name} ({product.weight}kg)
                        </Button>
                      ))}
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          {/* Basket Contents */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <ShoppingCart className="h-5 w-5" />
                  Basket Contents ({currentBasket.items.length} items)
                </span>
                {currentBasket.items.length > 0 && (
                  <Button variant="outline" size="sm" onClick={clearBasket}>
                    <Trash2 className="h-4 w-4 mr-2" />
                    Clear
                  </Button>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {currentBasket.items.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <ShoppingCart className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Your basket is empty</p>
                  <p className="text-sm">Start scanning items to add them</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {currentBasket.items.map((item) => (
                    <div key={item.id} className="flex items-center gap-4 p-4 border rounded-lg">
                      <Image
                        src={item.product.imageUrl || "/placeholder.svg"}
                        alt={item.product.name}
                        width={60}
                        height={60}
                        className="rounded-md"
                      />

                      <div className="flex-1">
                        <h3 className="font-medium">{item.product.name}</h3>
                        <p className="text-sm text-gray-600">${item.product.price.toFixed(2)} each</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="outline" className="text-xs">
                            {item.scannedMethod}
                          </Badge>
                          {item.product.expiryDate && getExpiryBadge(item.product.expiryDate)}
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <span className="w-8 text-center">{item.quantity}</span>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>

                      <div className="text-right">
                        <p className="font-medium">${(item.product.price * item.quantity).toFixed(2)}</p>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeItem(item.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Total & Checkout */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Order Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax:</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
                <div className="border-t pt-2">
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total:</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <Button
                className="w-full"
                size="lg"
                onClick={handleCheckout}
                disabled={currentBasket.items.length === 0 || paymentStatus === "processing"}
              >
                {paymentStatus === "processing" ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Processing...
                  </>
                ) : (
                  <>
                    <CreditCard className="h-4 w-4 mr-2" />
                    Checkout ${total.toFixed(2)}
                  </>
                )}
              </Button>

              {paymentStatus === "success" && (
                <Alert>
                  <CheckCircle className="h-4 w-4" />
                  <AlertDescription>Payment successful! Thank you for your purchase.</AlertDescription>
                </Alert>
              )}

              {paymentStatus === "error" && (
                <Alert variant="destructive">
                  <XCircle className="h-4 w-4" />
                  <AlertDescription>Payment failed. Please try again.</AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>

          {/* Security Alerts */}
          {securityEvents.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Security Alerts
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 max-h-60 overflow-y-auto">
                  {securityEvents
                    .slice(-5)
                    .reverse()
                    .map((event) => (
                      <Alert
                        key={event.id}
                        variant={event.severity === "high" || event.severity === "critical" ? "destructive" : "default"}
                      >
                        <AlertTriangle className="h-4 w-4" />
                        <AlertDescription>
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="font-medium">{event.type.replace("_", " ").toUpperCase()}</p>
                              <p className="text-sm">{event.description}</p>
                              <p className="text-xs text-gray-500 mt-1">
                                <Clock className="h-3 w-3 inline mr-1" />
                                {event.timestamp.toLocaleTimeString()}
                              </p>
                            </div>
                            <Badge
                              variant={
                                event.severity === "high" || event.severity === "critical" ? "destructive" : "secondary"
                              }
                            >
                              {event.severity}
                            </Badge>
                          </div>
                        </AlertDescription>
                      </Alert>
                    ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Available Products (for testing) */}
          <Card>
            <CardHeader>
              <CardTitle>Test Products</CardTitle>
              <CardDescription>Click to manually add items for testing</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {availableProducts.map((product) => (
                  <Button
                    key={product.id}
                    variant="outline"
                    size="sm"
                    className="w-full justify-start"
                    onClick={() => handleManualScan(product)}
                    disabled={isScanning}
                  >
                    <div className="flex items-center justify-between w-full">
                      <span>{product.name}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-sm">${product.price}</span>
                        {product.expiryDate && getExpiryBadge(product.expiryDate)}
                      </div>
                    </div>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
