import type { IoTSensorData, SecurityEvent, SmartBasket } from "@/types"

export class WebSocketManager {
  private ws: WebSocket | null = null
  private reconnectAttempts = 0
  private maxReconnectAttempts = 5
  private reconnectDelay = 1000

  constructor(private url: string) {}

  connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        this.ws = new WebSocket(this.url)

        this.ws.onopen = () => {
          console.log("WebSocket connected")
          this.reconnectAttempts = 0
          resolve()
        }

        this.ws.onclose = () => {
          console.log("WebSocket disconnected")
          this.handleReconnect()
        }

        this.ws.onerror = (error) => {
          console.error("WebSocket error:", error)
          reject(error)
        }

        this.ws.onmessage = (event) => {
          this.handleMessage(event.data)
        }
      } catch (error) {
        reject(error)
      }
    })
  }

  disconnect() {
    if (this.ws) {
      this.ws.close()
      this.ws = null
    }
  }

  send(data: any) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(data))
    }
  }

  private handleMessage(data: string) {
    try {
      const message = JSON.parse(data)
      this.onMessage(message)
    } catch (error) {
      console.error("Failed to parse WebSocket message:", error)
    }
  }

  private handleReconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++
      setTimeout(() => {
        console.log(`Attempting to reconnect... (${this.reconnectAttempts}/${this.maxReconnectAttempts})`)
        this.connect()
      }, this.reconnectDelay * this.reconnectAttempts)
    }
  }

  // Override this method to handle incoming messages
  protected onMessage(message: any) {
    console.log("Received message:", message)
  }
}

// Specialized WebSocket for basket updates
export class BasketWebSocket extends WebSocketManager {
  private onBasketUpdate?: (basket: SmartBasket) => void
  private onSecurityEvent?: (event: SecurityEvent) => void
  private onSensorData?: (data: IoTSensorData) => void

  constructor(
    url: string,
    callbacks: {
      onBasketUpdate?: (basket: SmartBasket) => void
      onSecurityEvent?: (event: SecurityEvent) => void
      onSensorData?: (data: IoTSensorData) => void
    },
  ) {
    super(url)
    this.onBasketUpdate = callbacks.onBasketUpdate
    this.onSecurityEvent = callbacks.onSecurityEvent
    this.onSensorData = callbacks.onSensorData
  }

  protected onMessage(message: any) {
    switch (message.type) {
      case "basket_update":
        this.onBasketUpdate?.(message.data)
        break
      case "security_event":
        this.onSecurityEvent?.(message.data)
        break
      case "sensor_data":
        this.onSensorData?.(message.data)
        break
      default:
        console.log("Unknown message type:", message.type)
    }
  }

  // Send basket update
  sendBasketUpdate(basket: SmartBasket) {
    this.send({
      type: "basket_update",
      data: basket,
    })
  }

  // Send security event
  sendSecurityEvent(event: SecurityEvent) {
    this.send({
      type: "security_event",
      data: event,
    })
  }

  // Send sensor data
  sendSensorData(data: IoTSensorData) {
    this.send({
      type: "sensor_data",
      data: data,
    })
  }
}
