"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import {
  Wifi,
  Radio,
  Shield,
  Cpu,
  Activity,
  Network,
  Zap,
  Eye,
  AlertTriangle,
  CheckCircle,
  MessageSquare,
  Server,
  Lock
} from "lucide-react"
import { 
  MQTTBrokerSimulator, 
  CoAPServerSimulator, 
  LoRaWANGatewaySimulator,
  EdgeComputingNode,
  IoTSecurityManager,
  MQTTMessage 
} from "@/lib/iot-protocols"

export default function IoTDemoPage() {
  const [mqttBroker] = useState(() => new MQTTBrokerSimulator())
  const [coapServer] = useState(() => new CoAPServerSimulator())
  const [loraGateway] = useState(() => new LoRaWANGatewaySimulator('GW_001'))
  const [edgeNode] = useState(() => new EdgeComputingNode('EDGE_001'))
  const [securityManager] = useState(() => new IoTSecurityManager())
  
  const [mqttStats, setMqttStats] = useState({ connectedClients: 0, activeSubscriptions: 0, retainedMessages: 0 })
  const [mqttMessages, setMqttMessages] = useState<MQTTMessage[]>([])
  const [loraStats, setLoraStats] = useState({ gatewayId: '', registeredDevices: 0, uplinkMessages: 0, downlinkMessages: 0, devices: [] })
  const [edgeStats, setEdgeStats] = useState({ nodeId: '', queueSize: 0, processedCount: 0, rulesCount: 0, recentProcessed: [] })
  const [securityStats, setSecurityStats] = useState({ registeredDevices: 0, securityEvents: 0, recentEvents: [], validCertificates: 0 })
  const [isSimulationRunning, setIsSimulationRunning] = useState(false)

  useEffect(() => {
    // Initialize IoT protocols
    initializeProtocols()
    
    // Update stats periodically
    const interval = setInterval(updateStats, 2000)
    
    return () => clearInterval(interval)
  }, [])

  const initializeProtocols = () => {
    // MQTT Setup
    mqttBroker.connect('smart-checkout-001')
    mqttBroker.connect('sensor-gateway-001')
    mqttBroker.connect('analytics-service')
    
    mqttBroker.subscribe('sensors/+/data', (message) => {
      setMqttMessages(prev => [...prev.slice(-19), message])
      
      // Process through edge computing
      const processedData = edgeNode.processData(message.payload)
      console.log('Edge processed:', processedData)
    })

    // LoRaWAN Setup
    loraGateway.registerDevice('DEV_001_RFID', 'APP_SMART_CHECKOUT')
    loraGateway.registerDevice('DEV_002_WEIGHT', 'APP_SMART_CHECKOUT')
    loraGateway.registerDevice('DEV_003_ENV', 'APP_SMART_CHECKOUT')

    // Security Setup
    securityManager.registerDevice('DEV_001_RFID')
    securityManager.registerDevice('DEV_002_WEIGHT')
    securityManager.registerDevice('DEV_003_ENV')
  }

  const updateStats = () => {
    setMqttStats(mqttBroker.getStats())
    setLoraStats(loraGateway.getStats())
    setEdgeStats(edgeNode.getStats())
    setSecurityStats(securityManager.getSecurityStats())
  }

  const startSimulation = () => {
    setIsSimulationRunning(true)
    
    // Simulate MQTT messages
    const mqttInterval = setInterval(() => {
      const topics = ['sensors/rfid/data', 'sensors/weight/data', 'sensors/env/data']
      const topic = topics[Math.floor(Math.random() * topics.length)]
      
      mqttBroker.publish({
        topic,
        payload: {
          deviceId: topic.split('/')[1],
          value: Math.random() * 100,
          timestamp: new Date(),
          quality: 80 + Math.random() * 20
        },
        qos: 1,
        retain: false,
        timestamp: new Date(),
        clientId: 'sensor-gateway-001'
      })
    }, 3000)

    // Simulate LoRaWAN messages
    const loraInterval = setInterval(() => {
      const devices = ['DEV_001_RFID', 'DEV_002_WEIGHT', 'DEV_003_ENV']
      const device = devices[Math.floor(Math.random() * devices.length)]
      
      loraGateway.receiveUplink({
        deviceEUI: device,
        applicationEUI: 'APP_SMART_CHECKOUT',
        deviceAddress: device.slice(-8),
        frameCounter: Math.floor(Math.random() * 1000),
        payload: { sensor_data: Math.random() * 50, battery: 80 + Math.random() * 20 },
        rssi: -80 + Math.random() * 40,
        snr: Math.random() * 10 - 5,
        timestamp: new Date(),
        gatewayId: 'GW_001'
      })
    }, 5000)

    // Store intervals for cleanup
    ;(window as any).iotIntervals = [mqttInterval, loraInterval]
  }

  const stopSimulation = () => {
    setIsSimulationRunning(false)
    if ((window as any).iotIntervals) {
      ;(window as any).iotIntervals.forEach(clearInterval)
    }
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">IoT Smart Checkout Demo</h1>
          <p className="text-gray-600 mt-2">
            Comprehensive demonstration of IoT protocols, edge computing, and security
          </p>
        </div>
        <div className="flex gap-2">
          <Button 
            onClick={startSimulation} 
            disabled={isSimulationRunning}
            className="bg-green-600 hover:bg-green-700"
          >
            <Activity className="h-4 w-4 mr-2" />
            Start Simulation
          </Button>
          <Button 
            onClick={stopSimulation} 
            disabled={!isSimulationRunning}
            variant="outline"
          >
            Stop Simulation
          </Button>
        </div>
      </div>

      {/* Protocol Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">MQTT Broker</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mqttStats.connectedClients}</div>
            <p className="text-xs text-muted-foreground">
              {mqttStats.activeSubscriptions} subscriptions
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">LoRaWAN Gateway</CardTitle>
            <Radio className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{loraStats.registeredDevices}</div>
            <p className="text-xs text-muted-foreground">
              {loraStats.uplinkMessages} uplinks
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Edge Computing</CardTitle>
            <Cpu className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{edgeStats.processedCount}</div>
            <p className="text-xs text-muted-foreground">
              {edgeStats.rulesCount} processing rules
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Security</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{securityStats.validCertificates}</div>
            <p className="text-xs text-muted-foreground">
              {securityStats.securityEvents} events
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="mqtt" className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="mqtt">MQTT</TabsTrigger>
          <TabsTrigger value="coap">CoAP</TabsTrigger>
          <TabsTrigger value="lorawan">LoRaWAN</TabsTrigger>
          <TabsTrigger value="edge">Edge Computing</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
        </TabsList>

        <TabsContent value="mqtt" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>MQTT Broker Status</CardTitle>
                <CardDescription>Message Queue Telemetry Transport</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span>Connected Clients:</span>
                  <Badge>{mqttStats.connectedClients}</Badge>
                </div>
                <div className="flex justify-between">
                  <span>Active Subscriptions:</span>
                  <Badge>{mqttStats.activeSubscriptions}</Badge>
                </div>
                <div className="flex justify-between">
                  <span>Retained Messages:</span>
                  <Badge>{mqttStats.retainedMessages}</Badge>
                </div>
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${isSimulationRunning ? 'bg-green-500' : 'bg-gray-400'}`} />
                  <span className="text-sm">
                    {isSimulationRunning ? 'Publishing messages' : 'Idle'}
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent MQTT Messages</CardTitle>
                <CardDescription>Live message stream</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {mqttMessages.slice(-10).reverse().map((msg, index) => (
                    <div key={index} className="p-2 bg-gray-50 rounded text-xs">
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-mono text-blue-600">{msg.topic}</span>
                        <span className="text-gray-500">
                          {msg.timestamp.toLocaleTimeString()}
                        </span>
                      </div>
                      <div className="text-gray-700">
                        {JSON.stringify(msg.payload, null, 2)}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="coap" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>CoAP Server Resources</CardTitle>
              <CardDescription>Constrained Application Protocol</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {Array.from(coapServer.getResources().entries()).map(([uri, value]) => (
                  <div key={uri} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                    <span className="font-mono text-sm">{uri}</span>
                    <span className="text-sm">{JSON.stringify(value)}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="lorawan" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>LoRaWAN Gateway</CardTitle>
                <CardDescription>Long Range Wide Area Network</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span>Gateway ID:</span>
                  <Badge variant="outline">{loraStats.gatewayId}</Badge>
                </div>
                <div className="flex justify-between">
                  <span>Registered Devices:</span>
                  <Badge>{loraStats.registeredDevices}</Badge>
                </div>
                <div className="flex justify-between">
                  <span>Uplink Messages:</span>
                  <Badge>{loraStats.uplinkMessages}</Badge>
                </div>
                <div className="flex justify-between">
                  <span>Downlink Messages:</span>
                  <Badge>{loraStats.downlinkMessages}</Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Registered Devices</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {loraStats.devices.map((device: any, index) => (
                    <div key={index} className="p-2 bg-gray-50 rounded">
                      <div className="flex justify-between items-center">
                        <span className="font-mono text-sm">{device.deviceEUI}</span>
                        <Badge variant="outline">
                          RSSI: {device.rssi}dBm
                        </Badge>
                      </div>
                      <div className="text-xs text-gray-600 mt-1">
                        Frame: {device.frameCounter} | SNR: {device.snr?.toFixed(1)}dB
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="edge" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Edge Computing Node</CardTitle>
              <CardDescription>Local data processing and analytics</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex justify-between">
                  <span>Node ID:</span>
                  <Badge variant="outline">{edgeStats.nodeId}</Badge>
                </div>
                <div className="flex justify-between">
                  <span>Queue Size:</span>
                  <Badge>{edgeStats.queueSize}</Badge>
                </div>
                <div className="flex justify-between">
                  <span>Processed:</span>
                  <Badge>{edgeStats.processedCount}</Badge>
                </div>
                <div className="flex justify-between">
                  <span>Rules:</span>
                  <Badge>{edgeStats.rulesCount}</Badge>
                </div>
              </div>
              
              <div className="mt-4">
                <h4 className="font-medium mb-2">Recent Processing Results:</h4>
                <div className="space-y-1 max-h-32 overflow-y-auto">
                  {edgeStats.recentProcessed.map((item: any, index) => (
                    <div key={index} className="text-xs p-1 bg-gray-50 rounded">
                      {JSON.stringify(item).slice(0, 100)}...
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Security Status</CardTitle>
                <CardDescription>Device authentication and security</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span>Registered Devices:</span>
                  <Badge>{securityStats.registeredDevices}</Badge>
                </div>
                <div className="flex justify-between">
                  <span>Valid Certificates:</span>
                  <Badge variant="outline">{securityStats.validCertificates}</Badge>
                </div>
                <div className="flex justify-between">
                  <span>Security Events:</span>
                  <Badge variant={securityStats.securityEvents > 0 ? "destructive" : "default"}>
                    {securityStats.securityEvents}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Security Events</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 max-h-32 overflow-y-auto">
                  {securityStats.recentEvents.map((event: any, index) => (
                    <div key={index} className="p-2 bg-gray-50 rounded text-xs">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">{event.type}</span>
                        <Badge variant={event.severity === 'high' ? 'destructive' : 'secondary'}>
                          {event.severity}
                        </Badge>
                      </div>
                      <div className="text-gray-600 mt-1">
                        Device: {event.deviceId} | {event.timestamp.toLocaleTimeString()}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
