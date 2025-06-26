import { EventEmitter } from 'events'

export interface IoTDevice {
  id: string
  type: 'rfid' | 'weight' | 'camera' | 'environmental' | 'beacon'
  location: string
  status: 'online' | 'offline' | 'maintenance' | 'error'
  batteryLevel: number
  signalStrength: number
  lastSeen: Date
  firmware: string
  temperature?: number
  uptime: number
}

export interface IoTSensorReading {
  deviceId: string
  timestamp: Date
  sensorType: string
  value: any
  unit?: string
  quality: number // 0-100 data quality score
  metadata?: Record<string, any>
}

export interface IoTNetworkTopology {
  devices: IoTDevice[]
  connections: Array<{
    from: string
    to: string
    strength: number
    latency: number
  }>
  gateways: Array<{
    id: string
    location: string
    connectedDevices: string[]
    status: 'online' | 'offline'
  }>
}

export class IoTNetworkManager extends EventEmitter {
  private devices: Map<string, IoTDevice> = new Map()
  private readings: IoTSensorReading[] = []
  private networkTopology: IoTNetworkTopology
  private simulationInterval?: NodeJS.Timeout

  constructor() {
    super()
    this.networkTopology = {
      devices: [],
      connections: [],
      gateways: []
    }
    this.initializeNetwork()
  }

  private initializeNetwork() {
    // Initialize sample IoT devices
    const sampleDevices: IoTDevice[] = [
      {
        id: 'RFID_GATE_001',
        type: 'rfid',
        location: 'Store Entrance',
        status: 'online',
        batteryLevel: 95,
        signalStrength: 88,
        lastSeen: new Date(),
        firmware: 'v2.1.3',
        uptime: 86400 * 30 // 30 days
      },
      {
        id: 'WEIGHT_BASKET_001',
        type: 'weight',
        location: 'Basket Station A1',
        status: 'online',
        batteryLevel: 78,
        signalStrength: 92,
        lastSeen: new Date(),
        firmware: 'v1.8.2',
        uptime: 86400 * 15
      },
      {
        id: 'ENV_DAIRY_001',
        type: 'environmental',
        location: 'Dairy Section',
        status: 'online',
        batteryLevel: 85,
        signalStrength: 76,
        lastSeen: new Date(),
        firmware: 'v3.0.1',
        temperature: 4.2,
        uptime: 86400 * 45
      },
      {
        id: 'BEACON_AISLE_A',
        type: 'beacon',
        location: 'Aisle A',
        status: 'online',
        batteryLevel: 67,
        signalStrength: 94,
        lastSeen: new Date(),
        firmware: 'v1.5.0',
        uptime: 86400 * 60
      }
    ]

    sampleDevices.forEach(device => {
      this.devices.set(device.id, device)
    })

    this.networkTopology.devices = sampleDevices
  }

  startSimulation() {
    this.simulationInterval = setInterval(() => {
      this.simulateDeviceReadings()
      this.simulateNetworkEvents()
      this.updateDeviceStatus()
    }, 2000) // Update every 2 seconds

    console.log('🌐 IoT Network simulation started')
  }

  stopSimulation() {
    if (this.simulationInterval) {
      clearInterval(this.simulationInterval)
      this.simulationInterval = undefined
    }
    console.log('🌐 IoT Network simulation stopped')
  }

  private simulateDeviceReadings() {
    this.devices.forEach((device) => {
      if (device.status === 'online') {
        const reading = this.generateSensorReading(device)
        this.readings.push(reading)
        this.emit('sensorReading', reading)

        // Keep only last 1000 readings
        if (this.readings.length > 1000) {
          this.readings = this.readings.slice(-1000)
        }
      }
    })
  }

  private generateSensorReading(device: IoTDevice): IoTSensorReading {
    const baseReading: IoTSensorReading = {
      deviceId: device.id,
      timestamp: new Date(),
      sensorType: device.type,
      value: null,
      quality: Math.random() * 20 + 80, // 80-100% quality
    }

    switch (device.type) {
      case 'rfid':
        return {
          ...baseReading,
          value: {
            tagId: `TAG_${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
            rssi: -30 - Math.random() * 40, // -30 to -70 dBm
            readCount: Math.floor(Math.random() * 5) + 1
          },
          unit: 'dBm'
        }

      case 'weight':
        return {
          ...baseReading,
          value: {
            weight: Math.random() * 5 + 0.1, // 0.1 to 5.1 kg
            calibration: 0.99 + Math.random() * 0.02, // 99-101% calibration
            stability: Math.random() * 0.1 + 0.9 // 90-100% stability
          },
          unit: 'kg'
        }

      case 'environmental':
        return {
          ...baseReading,
          value: {
            temperature: device.temperature! + (Math.random() - 0.5) * 2,
            humidity: 45 + Math.random() * 20, // 45-65%
            airQuality: 80 + Math.random() * 20, // 80-100 AQI
            lightLevel: 300 + Math.random() * 200 // 300-500 lux
          },
          unit: 'mixed'
        }

      case 'beacon':
        return {
          ...baseReading,
          value: {
            proximityDevices: Math.floor(Math.random() * 5),
            averageRssi: -40 - Math.random() * 30,
            batteryVoltage: 3.0 + Math.random() * 0.7
          },
          unit: 'count'
        }

      default:
        return baseReading
    }
  }

  private simulateNetworkEvents() {
    // Randomly simulate device events
    if (Math.random() < 0.05) { // 5% chance per cycle
      const deviceIds = Array.from(this.devices.keys())
      const randomDevice = deviceIds[Math.floor(Math.random() * deviceIds.length)]
      const device = this.devices.get(randomDevice)!

      // Simulate various events
      const eventType = Math.random()
      
      if (eventType < 0.3) {
        // Battery level change
        device.batteryLevel = Math.max(0, device.batteryLevel - Math.random() * 2)
        this.emit('deviceEvent', {
          type: 'battery_update',
          deviceId: randomDevice,
          data: { batteryLevel: device.batteryLevel }
        })
      } else if (eventType < 0.6) {
        // Signal strength fluctuation
        device.signalStrength = Math.max(0, Math.min(100, 
          device.signalStrength + (Math.random() - 0.5) * 10))
        this.emit('deviceEvent', {
          type: 'signal_change',
          deviceId: randomDevice,
          data: { signalStrength: device.signalStrength }
        })
      } else if (eventType < 0.8) {
        // Device status change
        const statuses = ['online', 'offline', 'maintenance']
        const newStatus = statuses[Math.floor(Math.random() * statuses.length)]
        device.status = newStatus as any
        this.emit('deviceEvent', {
          type: 'status_change',
          deviceId: randomDevice,
          data: { status: newStatus }
        })
      }
    }
  }

  private updateDeviceStatus() {
    this.devices.forEach((device) => {
      device.lastSeen = new Date()
      device.uptime += 2 // Add 2 seconds
      
      // Simulate device going offline occasionally
      if (Math.random() < 0.001 && device.status === 'online') {
        device.status = 'offline'
        this.emit('deviceOffline', { deviceId: device.id })
      }
      
      // Simulate device coming back online
      if (Math.random() < 0.01 && device.status === 'offline') {
        device.status = 'online'
        this.emit('deviceOnline', { deviceId: device.id })
      }
    })
  }

  getNetworkTopology(): IoTNetworkTopology {
    return {
      ...this.networkTopology,
      devices: Array.from(this.devices.values())
    }
  }

  getDeviceById(id: string): IoTDevice | undefined {
    return this.devices.get(id)
  }

  getAllDevices(): IoTDevice[] {
    return Array.from(this.devices.values())
  }

  getRecentReadings(deviceId?: string, limit = 100): IoTSensorReading[] {
    let filtered = this.readings
    if (deviceId) {
      filtered = this.readings.filter(r => r.deviceId === deviceId)
    }
    return filtered.slice(-limit)
  }

  getNetworkHealth(): {
    totalDevices: number
    onlineDevices: number
    offlineDevices: number
    averageBattery: number
    averageSignal: number
    dataQuality: number
  } {
    const devices = Array.from(this.devices.values())
    const onlineDevices = devices.filter(d => d.status === 'online')
    
    return {
      totalDevices: devices.length,
      onlineDevices: onlineDevices.length,
      offlineDevices: devices.length - onlineDevices.length,
      averageBattery: devices.reduce((sum, d) => sum + d.batteryLevel, 0) / devices.length,
      averageSignal: devices.reduce((sum, d) => sum + d.signalStrength, 0) / devices.length,
      dataQuality: this.readings.slice(-50).reduce((sum, r) => sum + r.quality, 0) / Math.min(50, this.readings.length)
    }
  }
}
