// IoT Protocol Simulation - Demonstrates understanding of IoT communication protocols

export interface MQTTMessage {
  topic: string
  payload: any
  qos: 0 | 1 | 2
  retain: boolean
  timestamp: Date
  clientId: string
}

export interface CoAPMessage {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE'
  uri: string
  payload: any
  messageId: number
  token: string
  timestamp: Date
}

export interface LoRaWANMessage {
  deviceEUI: string
  applicationEUI: string
  deviceAddress: string
  frameCounter: number
  payload: any
  rssi: number
  snr: number
  timestamp: Date
  gatewayId: string
}

// MQTT Broker Simulation
export class MQTTBrokerSimulator {
  private subscribers: Map<string, Set<(message: MQTTMessage) => void>> = new Map()
  private retainedMessages: Map<string, MQTTMessage> = new Map()
  private clients: Set<string> = new Set()

  connect(clientId: string): boolean {
    this.clients.add(clientId)
    console.log(`📡 MQTT Client ${clientId} connected`)
    return true
  }

  disconnect(clientId: string): void {
    this.clients.delete(clientId)
    console.log(`📡 MQTT Client ${clientId} disconnected`)
  }

  subscribe(topic: string, callback: (message: MQTTMessage) => void): void {
    if (!this.subscribers.has(topic)) {
      this.subscribers.set(topic, new Set())
    }
    this.subscribers.get(topic)!.add(callback)

    // Send retained message if exists
    if (this.retainedMessages.has(topic)) {
      callback(this.retainedMessages.get(topic)!)
    }
  }

  publish(message: MQTTMessage): void {
    // Store retained messages
    if (message.retain) {
      this.retainedMessages.set(message.topic, message)
    }

    // Deliver to subscribers
    const topicSubscribers = this.subscribers.get(message.topic)
    if (topicSubscribers) {
      topicSubscribers.forEach(callback => {
        // Simulate network delay
        setTimeout(() => callback(message), Math.random() * 50)
      })
    }

    // Handle wildcard subscriptions
    this.subscribers.forEach((callbacks, subscribedTopic) => {
      if (this.matchesTopic(message.topic, subscribedTopic)) {
        callbacks.forEach(callback => {
          setTimeout(() => callback(message), Math.random() * 50)
        })
      }
    })
  }

  private matchesTopic(publishTopic: string, subscribeTopic: string): boolean {
    if (subscribeTopic === publishTopic) return true
    
    // Handle + wildcard (single level)
    const subParts = subscribeTopic.split('/')
    const pubParts = publishTopic.split('/')
    
    if (subParts.length !== pubParts.length && !subscribeTopic.includes('#')) {
      return false
    }

    for (let i = 0; i < subParts.length; i++) {
      if (subParts[i] === '#') return true // Multi-level wildcard
      if (subParts[i] === '+') continue   // Single-level wildcard
      if (subParts[i] !== pubParts[i]) return false
    }

    return true
  }

  getStats() {
    return {
      connectedClients: this.clients.size,
      activeSubscriptions: this.subscribers.size,
      retainedMessages: this.retainedMessages.size
    }
  }
}

// CoAP Server Simulation
export class CoAPServerSimulator {
  private resources: Map<string, any> = new Map()
  private messageId = 1

  constructor() {
    // Initialize some resources
    this.resources.set('/sensors/temperature', { value: 22.5, unit: 'celsius' })
    this.resources.set('/sensors/humidity', { value: 45, unit: 'percent' })
    this.resources.set('/actuators/led', { state: 'off' })
  }

  handleRequest(message: CoAPMessage): CoAPMessage {
    const response: CoAPMessage = {
      method: 'GET', // Will be overridden
      uri: message.uri,
      payload: null,
      messageId: this.messageId++,
      token: message.token,
      timestamp: new Date()
    }

    switch (message.method) {
      case 'GET':
        response.payload = this.resources.get(message.uri) || { error: 'Not Found' }
        break
      
      case 'POST':
      case 'PUT':
        this.resources.set(message.uri, message.payload)
        response.payload = { success: true, updated: message.uri }
        break
      
      case 'DELETE':
        const deleted = this.resources.delete(message.uri)
        response.payload = { success: deleted }
        break
    }

    return response
  }

  getResources(): Map<string, any> {
    return new Map(this.resources)
  }
}

// LoRaWAN Gateway Simulation
export class LoRaWANGatewaySimulator {
  private gatewayId: string
  private devices: Map<string, any> = new Map()
  private uplinks: LoRaWANMessage[] = []
  private downlinks: LoRaWANMessage[] = []

  constructor(gatewayId: string) {
    this.gatewayId = gatewayId
  }

  registerDevice(deviceEUI: string, applicationEUI: string): void {
    this.devices.set(deviceEUI, {
      deviceEUI,
      applicationEUI,
      frameCounter: 0,
      lastSeen: new Date(),
      rssi: -80 + Math.random() * 40, // -80 to -40 dBm
      snr: Math.random() * 10 - 5     // -5 to 5 dB
    })
  }

  receiveUplink(message: LoRaWANMessage): void {
    const device = this.devices.get(message.deviceEUI)
    if (device) {
      device.frameCounter++
      device.lastSeen = new Date()
      this.uplinks.push(message)
      
      console.log(`📡 LoRaWAN Uplink from ${message.deviceEUI}: ${JSON.stringify(message.payload)}`)
    }
  }

  sendDownlink(deviceEUI: string, payload: any): boolean {
    const device = this.devices.get(deviceEUI)
    if (!device) return false

    const downlink: LoRaWANMessage = {
      deviceEUI,
      applicationEUI: device.applicationEUI,
      deviceAddress: `${deviceEUI.slice(-8)}`,
      frameCounter: device.frameCounter++,
      payload,
      rssi: device.rssi,
      snr: device.snr,
      timestamp: new Date(),
      gatewayId: this.gatewayId
    }

    this.downlinks.push(downlink)
    console.log(`📡 LoRaWAN Downlink to ${deviceEUI}: ${JSON.stringify(payload)}`)
    return true
  }

  getStats() {
    return {
      gatewayId: this.gatewayId,
      registeredDevices: this.devices.size,
      uplinkMessages: this.uplinks.length,
      downlinkMessages: this.downlinks.length,
      devices: Array.from(this.devices.values())
    }
  }
}

// Edge Computing Node Simulation
export class EdgeComputingNode {
  private nodeId: string
  private processingQueue: any[] = []
  private processedData: any[] = []
  private rules: Array<{ condition: (data: any) => boolean, action: (data: any) => any }> = []

  constructor(nodeId: string) {
    this.nodeId = nodeId
    this.initializeDefaultRules()
  }

  private initializeDefaultRules() {
    // Rule: Filter out low-quality sensor readings
    this.addRule(
      (data) => data.quality && data.quality < 50,
      (data) => ({ ...data, filtered: true, reason: 'Low quality data' })
    )

    // Rule: Aggregate temperature readings
    this.addRule(
      (data) => data.sensorType === 'environmental' && data.value?.temperature,
      (data) => ({
        ...data,
        processed: true,
        temperatureCategory: data.value.temperature > 25 ? 'warm' : 
                           data.value.temperature < 5 ? 'cold' : 'normal'
      })
    )

    // Rule: Detect anomalies in weight sensors
    this.addRule(
      (data) => data.sensorType === 'weight' && data.value?.weight > 10,
      (data) => ({ ...data, anomaly: true, reason: 'Unusual weight detected' })
    )
  }

  addRule(condition: (data: any) => boolean, action: (data: any) => any): void {
    this.rules.push({ condition, action })
  }

  processData(data: any): any {
    this.processingQueue.push(data)

    // Apply rules
    let processedData = { ...data, processedBy: this.nodeId, processedAt: new Date() }

    for (const rule of this.rules) {
      if (rule.condition(data)) {
        processedData = rule.action(processedData)
      }
    }

    this.processedData.push(processedData)

    // Keep only last 100 processed items
    if (this.processedData.length > 100) {
      this.processedData = this.processedData.slice(-100)
    }

    return processedData
  }

  getStats() {
    return {
      nodeId: this.nodeId,
      queueSize: this.processingQueue.length,
      processedCount: this.processedData.length,
      rulesCount: this.rules.length,
      recentProcessed: this.processedData.slice(-10)
    }
  }
}

// IoT Security Manager
export class IoTSecurityManager {
  private deviceCertificates: Map<string, { cert: string, expiry: Date, valid: boolean }> = new Map()
  private securityEvents: Array<{ type: string, deviceId: string, timestamp: Date, severity: string }> = []

  registerDevice(deviceId: string): string {
    const cert = this.generateCertificate(deviceId)
    const expiry = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000) // 1 year
    
    this.deviceCertificates.set(deviceId, { cert, expiry, valid: true })
    return cert
  }

  validateDevice(deviceId: string, providedCert: string): boolean {
    const deviceCert = this.deviceCertificates.get(deviceId)
    
    if (!deviceCert) {
      this.logSecurityEvent('unauthorized_device', deviceId, 'high')
      return false
    }

    if (!deviceCert.valid || deviceCert.expiry < new Date()) {
      this.logSecurityEvent('expired_certificate', deviceId, 'medium')
      return false
    }

    if (deviceCert.cert !== providedCert) {
      this.logSecurityEvent('invalid_certificate', deviceId, 'high')
      return false
    }

    return true
  }

  private generateCertificate(deviceId: string): string {
    // Simulate certificate generation
    return `CERT_${deviceId}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  private logSecurityEvent(type: string, deviceId: string, severity: string): void {
    this.securityEvents.push({
      type,
      deviceId,
      timestamp: new Date(),
      severity
    })

    console.log(`🔒 Security Event: ${type} for device ${deviceId} (${severity})`)
  }

  getSecurityStats() {
    return {
      registeredDevices: this.deviceCertificates.size,
      securityEvents: this.securityEvents.length,
      recentEvents: this.securityEvents.slice(-10),
      validCertificates: Array.from(this.deviceCertificates.values()).filter(c => c.valid).length
    }
  }
}
