"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Wifi,
  WifiOff,
  Battery,
  Signal,
  Thermometer,
  Droplets,
  Zap,
  Activity,
  AlertTriangle,
  CheckCircle,
  Radio,
  Cpu,
  HardDrive,
  Network,
  Eye,
  Settings,
  RefreshCw
} from "lucide-react"
import { IoTNetworkManager, IoTDevice, IoTSensorReading } from "@/lib/iot-network"

export default function IoTDashboard() {
  const [networkManager] = useState(() => new IoTNetworkManager())
  const [devices, setDevices] = useState<IoTDevice[]>([])
  const [recentReadings, setRecentReadings] = useState<IoTSensorReading[]>([])
  const [networkHealth, setNetworkHealth] = useState({
    totalDevices: 0,
    onlineDevices: 0,
    offlineDevices: 0,
    averageBattery: 0,
    averageSignal: 0,
    dataQuality: 0
  })
  const [selectedDevice, setSelectedDevice] = useState<string | null>(null)

  useEffect(() => {
    // Start IoT simulation
    networkManager.startSimulation()

    // Set up event listeners
    const handleSensorReading = (reading: IoTSensorReading) => {
      setRecentReadings(prev => [...prev.slice(-49), reading])
    }

    const handleDeviceEvent = (event: any) => {
      console.log('Device event:', event)
      updateDevices()
    }

    networkManager.on('sensorReading', handleSensorReading)
    networkManager.on('deviceEvent', handleDeviceEvent)
    networkManager.on('deviceOnline', handleDeviceEvent)
    networkManager.on('deviceOffline', handleDeviceEvent)

    // Initial data load
    updateDevices()

    // Update network health every 5 seconds
    const healthInterval = setInterval(() => {
      setNetworkHealth(networkManager.getNetworkHealth())
    }, 5000)

    return () => {
      networkManager.stopSimulation()
      networkManager.removeAllListeners()
      clearInterval(healthInterval)
    }
  }, [networkManager])

  const updateDevices = () => {
    setDevices(networkManager.getAllDevices())
    setNetworkHealth(networkManager.getNetworkHealth())
  }

  const getDeviceIcon = (type: string) => {
    switch (type) {
      case 'rfid': return <Radio className="h-4 w-4" />
      case 'weight': return <Activity className="h-4 w-4" />
      case 'camera': return <Eye className="h-4 w-4" />
      case 'environmental': return <Thermometer className="h-4 w-4" />
      case 'beacon': return <Wifi className="h-4 w-4" />
      default: return <Cpu className="h-4 w-4" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'text-green-500'
      case 'offline': return 'text-red-500'
      case 'maintenance': return 'text-yellow-500'
      case 'error': return 'text-red-600'
      default: return 'text-gray-500'
    }
  }

  const formatUptime = (seconds: number) => {
    const days = Math.floor(seconds / 86400)
    const hours = Math.floor((seconds % 86400) / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    return `${days}d ${hours}h ${minutes}m`
  }

  return (
    <div className="space-y-6">
      {/* Network Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Devices</CardTitle>
            <Network className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{networkHealth.totalDevices}</div>
            <p className="text-xs text-muted-foreground">
              {networkHealth.onlineDevices} online, {networkHealth.offlineDevices} offline
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Network Health</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {((networkHealth.onlineDevices / networkHealth.totalDevices) * 100).toFixed(1)}%
            </div>
            <p className="text-xs text-muted-foreground">
              Uptime: {networkHealth.onlineDevices}/{networkHealth.totalDevices}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Battery</CardTitle>
            <Battery className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{networkHealth.averageBattery.toFixed(1)}%</div>
            <Progress value={networkHealth.averageBattery} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Data Quality</CardTitle>
            <Signal className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{networkHealth.dataQuality.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">
              Signal: {networkHealth.averageSignal.toFixed(1)}%
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="devices" className="space-y-4">
        <TabsList>
          <TabsTrigger value="devices">IoT Devices</TabsTrigger>
          <TabsTrigger value="readings">Live Data</TabsTrigger>
          <TabsTrigger value="topology">Network Topology</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="devices" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {devices.map((device) => (
              <Card key={device.id} className="cursor-pointer hover:shadow-md transition-shadow"
                    onClick={() => setSelectedDevice(device.id)}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {getDeviceIcon(device.type)}
                      <CardTitle className="text-sm">{device.id}</CardTitle>
                    </div>
                    <Badge variant={device.status === 'online' ? 'default' : 'destructive'}>
                      {device.status}
                    </Badge>
                  </div>
                  <CardDescription>{device.location}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span>Battery:</span>
                    <div className="flex items-center gap-2">
                      <Progress value={device.batteryLevel} className="w-16 h-2" />
                      <span>{device.batteryLevel}%</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm">
                    <span>Signal:</span>
                    <div className="flex items-center gap-2">
                      <Progress value={device.signalStrength} className="w-16 h-2" />
                      <span>{device.signalStrength}%</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <span>Uptime:</span>
                    <span>{formatUptime(device.uptime)}</span>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <span>Firmware:</span>
                    <span className="font-mono">{device.firmware}</span>
                  </div>

                  {device.temperature && (
                    <div className="flex items-center justify-between text-sm">
                      <span>Temperature:</span>
                      <span>{device.temperature.toFixed(1)}°C</span>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="readings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Live Sensor Data Stream</CardTitle>
              <CardDescription>Real-time data from IoT devices</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {recentReadings.slice(-20).reverse().map((reading, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded text-sm">
                    <div className="flex items-center gap-2">
                      {getDeviceIcon(reading.sensorType)}
                      <span className="font-mono">{reading.deviceId}</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <span>{reading.timestamp.toLocaleTimeString()}</span>
                      <Badge variant="outline">
                        Quality: {reading.quality.toFixed(1)}%
                      </Badge>
                      <span className="font-mono text-xs">
                        {JSON.stringify(reading.value).slice(0, 50)}...
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="topology" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>IoT Network Topology</CardTitle>
              <CardDescription>Device connections and network structure</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Network className="h-16 w-16 mx-auto mb-4 text-gray-400" />
                <p className="text-gray-600">Network topology visualization</p>
                <p className="text-sm text-gray-500 mt-2">
                  Shows device mesh network, gateways, and connection strengths
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Device Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span>Average Response Time:</span>
                    <span>23ms</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Packet Loss Rate:</span>
                    <span>0.02%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Data Throughput:</span>
                    <span>1.2 MB/s</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Predictive Maintenance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-yellow-500" />
                    <span>2 devices need attention</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>Network health: Good</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
