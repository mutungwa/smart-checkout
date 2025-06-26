"use client"

import { useState, useEffect } from "react"
import { adminAuth } from "@/lib/auth"
import IoTDashboard from "./iot-dashboard"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Switch } from "@/components/ui/switch"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts"
import {
  Shield,
  ShoppingCart,
  AlertTriangle,
  Camera,
  Wifi,
  Scale,
  Activity,
  Plus,
  Settings,
  Trash2,
  Eye,
  Package,
  Scan,
  AlertCircle,
  RefreshCw,
  Download,
  Upload,
  Search,
  Bell,
  X,
  LogOut,
  User,
} from "lucide-react"

// Mock data for dashboard
const mockData = {
  totalBaskets: 1247,
  activeBaskets: 23,
  totalRevenue: 45678.9,
  securityEvents: 12,
  avgCheckoutTime: 2.3,
  customerSatisfaction: 94.5,
  totalSensors: 156,
  activeSensors: 152,
  totalCameras: 48,
  activeCameras: 46,
  expiredItems: 23,
  expiringItems: 67,
}

// Mock sensor data
const sensors = [
  {
    id: "RFID_001",
    type: "RFID",
    location: "Aisle A1 - Basket Station 1",
    status: "online",
    lastPing: "2 min ago",
    batteryLevel: 85,
    signalStrength: 92,
    basketId: "basket_001",
  },
  {
    id: "WEIGHT_002",
    type: "Weight",
    location: "Aisle A1 - Basket Station 1",
    status: "online",
    lastPing: "1 min ago",
    batteryLevel: 78,
    signalStrength: 88,
    basketId: "basket_001",
  },
  {
    id: "RFID_003",
    type: "RFID",
    location: "Aisle B2 - Basket Station 3",
    status: "offline",
    lastPing: "15 min ago",
    batteryLevel: 12,
    signalStrength: 0,
    basketId: "basket_003",
  },
  {
    id: "BARCODE_004",
    type: "Barcode Scanner",
    location: "Checkout Zone 1",
    status: "maintenance",
    lastPing: "5 min ago",
    batteryLevel: 95,
    signalStrength: 95,
    basketId: null,
  },
]

// Mock camera data
const cameras = [
  {
    id: "CAM_001",
    name: "Entrance Camera 1",
    location: "Main Entrance",
    status: "online",
    resolution: "4K",
    aiEnabled: true,
    recordingStatus: "active",
    lastMaintenance: "2024-01-15",
    alerts: 3,
  },
  {
    id: "CAM_002",
    name: "Aisle A Security",
    location: "Aisle A - Overview",
    status: "online",
    resolution: "1080p",
    aiEnabled: true,
    recordingStatus: "active",
    lastMaintenance: "2024-01-10",
    alerts: 1,
  },
  {
    id: "CAM_003",
    name: "Checkout Monitor",
    location: "Checkout Zone",
    status: "offline",
    resolution: "4K",
    aiEnabled: true,
    recordingStatus: "stopped",
    lastMaintenance: "2024-01-05",
    alerts: 0,
  },
]

// Mock expired/expiring items
const expiryItems = [
  {
    id: "prod_001",
    name: "Organic Milk",
    barcode: "1234567890123",
    location: "Dairy Section - Shelf D3",
    expiryDate: "2024-01-20",
    daysUntilExpiry: -2,
    quantity: 12,
    status: "expired",
    supplier: "Fresh Farms Co.",
  },
  {
    id: "prod_002",
    name: "Greek Yogurt",
    barcode: "2345678901234",
    location: "Dairy Section - Shelf D1",
    expiryDate: "2024-01-22",
    daysUntilExpiry: 1,
    quantity: 8,
    status: "expiring",
    supplier: "Dairy Best Ltd.",
  },
  {
    id: "prod_003",
    name: "Fresh Bread",
    barcode: "3456789012345",
    location: "Bakery Section - Shelf B2",
    expiryDate: "2024-01-23",
    daysUntilExpiry: 2,
    quantity: 15,
    status: "expiring",
    supplier: "Local Bakery",
  },
]

// Mock products database
const products = [
  {
    id: "prod_001",
    name: "Organic Bananas",
    barcode: "1234567890123",
    rfidTag: "RFID_001",
    price: 2.99,
    weight: 0.5,
    category: "Fruits & Vegetables",
    brand: "Fresh Farms",
    description: "Fresh organic bananas from local farms",
    expiryDays: 7,
    supplier: "Fresh Farms Co.",
    costPrice: 1.5,
    margin: 49.8,
    stockLevel: 150,
    minStockLevel: 20,
    maxStockLevel: 300,
    location: "Produce Section - Shelf P1",
    taxRate: 0,
    isPerishable: true,
    nutritionInfo: {
      calories: 89,
      protein: 1.1,
      carbs: 22.8,
      fat: 0.3,
    },
    imageUrl: "/images/products/organic-bananas.png",
    status: "active",
    createdAt: "2024-01-15",
    updatedAt: "2024-01-20",
  },
  {
    id: "prod_002",
    name: "Whole Milk",
    barcode: "2345678901234",
    rfidTag: "RFID_002",
    price: 3.49,
    weight: 1.0,
    category: "Dairy & Eggs",
    brand: "Dairy Best",
    description: "Fresh whole milk, 1 gallon",
    expiryDays: 5,
    supplier: "Dairy Best Ltd.",
    costPrice: 2.1,
    margin: 39.8,
    stockLevel: 85,
    minStockLevel: 15,
    maxStockLevel: 200,
    location: "Dairy Section - Shelf D3",
    taxRate: 0,
    isPerishable: true,
    nutritionInfo: {
      calories: 150,
      protein: 8,
      carbs: 12,
      fat: 8,
    },
    imageUrl: "/images/products/whole-milk.png",
    status: "active",
    createdAt: "2024-01-10",
    updatedAt: "2024-01-18",
  },
  {
    id: "prod_003",
    name: "Premium Coffee Beans",
    barcode: "3456789012345",
    rfidTag: "RFID_003",
    price: 12.99,
    weight: 0.5,
    category: "Beverages",
    brand: "Coffee Masters",
    description: "Premium arabica coffee beans",
    expiryDays: 365,
    supplier: "Coffee Masters Inc.",
    costPrice: 7.5,
    margin: 42.3,
    stockLevel: 45,
    minStockLevel: 10,
    maxStockLevel: 100,
    location: "Beverages - Shelf B4",
    taxRate: 8.5,
    isPerishable: false,
    nutritionInfo: {
      calories: 2,
      protein: 0.3,
      carbs: 0,
      fat: 0,
    },
    imageUrl: "/images/products/coffee-beans.png",
    status: "active",
    createdAt: "2024-01-05",
    updatedAt: "2024-01-15",
  },
]

export default function AdminDashboard() {
  const [selectedTimeRange, setSelectedTimeRange] = useState("today")
  const [realtimeStats, setRealtimeStats] = useState(mockData)
  const [selectedTab, setSelectedTab] = useState("overview")
  const [showAddSensorDialog, setShowAddSensorDialog] = useState(false)
  const [showAddCameraDialog, setShowAddCameraDialog] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [showAddProductDialog, setShowAddProductDialog] = useState(false)
  const [showEditProductDialog, setShowEditProductDialog] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [productSearchTerm, setProductSearchTerm] = useState("")
  const [productFilterCategory, setProductFilterCategory] = useState("all")
  const [currentAdmin, setCurrentAdmin] = useState(null)

  // Get current admin info
  useEffect(() => {
    const admin = adminAuth.getAdmin()
    setCurrentAdmin(admin)
  }, [])

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setRealtimeStats((prev) => ({
        ...prev,
        activeBaskets: Math.max(0, prev.activeBaskets + Math.floor(Math.random() * 6) - 3),
        securityEvents: prev.securityEvents + (Math.random() < 0.1 ? 1 : 0),
        activeSensors: Math.max(0, prev.activeSensors + Math.floor(Math.random() * 4) - 2),
      }))
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  const handleLogout = () => {
    adminAuth.logout()
  }

  const AddSensorDialog = () => (
    <Dialog open={showAddSensorDialog} onOpenChange={setShowAddSensorDialog}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Add New Sensor</DialogTitle>
          <DialogDescription>Configure a new IoT sensor for the smart checkout system</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="sensor-type">Sensor Type</Label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Select sensor type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="rfid">RFID Reader</SelectItem>
                <SelectItem value="weight">Weight Sensor</SelectItem>
                <SelectItem value="barcode">Barcode Scanner</SelectItem>
                <SelectItem value="camera">Camera Sensor</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Input placeholder="e.g., Aisle A1 - Basket Station 1" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="basket-id">Basket ID (Optional)</Label>
            <Input placeholder="e.g., basket_001" />
          </div>
          <div className="flex items-center space-x-2">
            <Switch id="auto-activate" />
            <Label htmlFor="auto-activate">Auto-activate sensor</Label>
          </div>
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setShowAddSensorDialog(false)}>
              Cancel
            </Button>
            <Button onClick={() => setShowAddSensorDialog(false)}>Add Sensor</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )

  const AddCameraDialog = () => (
    <Dialog open={showAddCameraDialog} onOpenChange={setShowAddCameraDialog}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Add New Camera</DialogTitle>
          <DialogDescription>Configure a new security camera with AI capabilities</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="camera-name">Camera Name</Label>
            <Input placeholder="e.g., Entrance Camera 1" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="camera-location">Location</Label>
            <Input placeholder="e.g., Main Entrance" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="resolution">Resolution</Label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Select resolution" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="720p">720p HD</SelectItem>
                <SelectItem value="1080p">1080p Full HD</SelectItem>
                <SelectItem value="4k">4K Ultra HD</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center space-x-2">
            <Switch id="ai-enabled" defaultChecked />
            <Label htmlFor="ai-enabled">Enable AI Detection</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Switch id="recording" defaultChecked />
            <Label htmlFor="recording">Start Recording</Label>
          </div>
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setShowAddCameraDialog(false)}>
              Cancel
            </Button>
            <Button onClick={() => setShowAddCameraDialog(false)}>Add Camera</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )

  const AddProductDialog = () => (
    <Dialog open={showAddProductDialog} onOpenChange={setShowAddProductDialog}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Product</DialogTitle>
          <DialogDescription>Enter all product details for smart checkout system</DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Basic Information</h3>
            <div className="space-y-2">
              <Label htmlFor="product-name">Product Name *</Label>
              <Input placeholder="e.g., Organic Bananas" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="barcode">Barcode *</Label>
              <Input placeholder="e.g., 1234567890123" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="rfid-tag">RFID Tag</Label>
              <Input placeholder="e.g., RFID_001" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">Category *</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="fruits-vegetables">Fruits & Vegetables</SelectItem>
                  <SelectItem value="dairy-eggs">Dairy & Eggs</SelectItem>
                  <SelectItem value="meat-seafood">Meat & Seafood</SelectItem>
                  <SelectItem value="bakery">Bakery</SelectItem>
                  <SelectItem value="beverages">Beverages</SelectItem>
                  <SelectItem value="snacks">Snacks & Candy</SelectItem>
                  <SelectItem value="frozen">Frozen Foods</SelectItem>
                  <SelectItem value="pantry">Pantry Staples</SelectItem>
                  <SelectItem value="health-beauty">Health & Beauty</SelectItem>
                  <SelectItem value="household">Household Items</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="brand">Brand</Label>
              <Input placeholder="e.g., Fresh Farms" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Input placeholder="Brief product description" />
            </div>
          </div>

          {/* Pricing & Physical Properties */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Pricing & Physical Properties</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price">Selling Price *</Label>
                <Input type="number" step="0.01" placeholder="0.00" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cost-price">Cost Price</Label>
                <Input type="number" step="0.01" placeholder="0.00" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="weight">Weight (kg) *</Label>
                <Input type="number" step="0.001" placeholder="0.000" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="tax-rate">Tax Rate (%)</Label>
                <Input type="number" step="0.1" placeholder="0.0" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="expiry-days">Shelf Life (days)</Label>
              <Input type="number" placeholder="e.g., 7 for fresh produce" />
            </div>
            <div className="flex items-center space-x-2">
              <Switch id="perishable" />
              <Label htmlFor="perishable">Perishable item</Label>
            </div>
          </div>

          {/* Inventory Management */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Inventory Management</h3>
            <div className="space-y-2">
              <Label htmlFor="supplier">Supplier</Label>
              <Input placeholder="e.g., Fresh Farms Co." />
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="current-stock">Current Stock</Label>
                <Input type="number" placeholder="0" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="min-stock">Min Stock Level</Label>
                <Input type="number" placeholder="0" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="max-stock">Max Stock Level</Label>
                <Input type="number" placeholder="0" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="location">Store Location</Label>
              <Input placeholder="e.g., Produce Section - Shelf P1" />
            </div>
          </div>

          {/* Nutrition Information (Optional) */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Nutrition Information (Optional)</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="calories">Calories (per 100g)</Label>
                <Input type="number" placeholder="0" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="protein">Protein (g)</Label>
                <Input type="number" step="0.1" placeholder="0.0" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="carbs">Carbohydrates (g)</Label>
                <Input type="number" step="0.1" placeholder="0.0" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="fat">Fat (g)</Label>
                <Input type="number" step="0.1" placeholder="0.0" />
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-2 pt-4 border-t">
          <Button variant="outline" onClick={() => setShowAddProductDialog(false)}>
            Cancel
          </Button>
          <Button onClick={() => setShowAddProductDialog(false)}>Add Product</Button>
        </div>
      </DialogContent>
    </Dialog>
  )

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Smart Checkout Admin</h1>
          <p className="text-gray-600">Manage sensors, cameras, inventory, and system operations</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-green-600">
            <Activity className="h-4 w-4 mr-1" />
            System Online
          </Badge>
          <Button variant="outline" size="sm">
            <Bell className="h-4 w-4 mr-1" />
            Alerts (3)
          </Button>

          {/* Admin Profile & Logout */}
          <div className="flex items-center gap-2 ml-4 pl-4 border-l">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4" />
              <span className="text-sm font-medium">
                {currentAdmin?.name || "Admin"}
              </span>
            </div>
            <Button variant="outline" size="sm" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-1" />
              Logout
            </Button>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Sensors</CardTitle>
            <Wifi className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {realtimeStats.activeSensors}/{realtimeStats.totalSensors}
            </div>
            <p className="text-xs text-muted-foreground">97.4% uptime</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Cameras</CardTitle>
            <Camera className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {realtimeStats.activeCameras}/{realtimeStats.totalCameras}
            </div>
            <p className="text-xs text-muted-foreground">95.8% uptime</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Expired Items</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{realtimeStats.expiredItems}</div>
            <p className="text-xs text-muted-foreground">Requires immediate action</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Baskets</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{realtimeStats.activeBaskets}</div>
            <p className="text-xs text-muted-foreground">+12% from yesterday</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Dashboard */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-8">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="iot">IoT Network</TabsTrigger>
          <TabsTrigger value="sensors">Sensors</TabsTrigger>
          <TabsTrigger value="cameras">Cameras</TabsTrigger>
          <TabsTrigger value="products">Products</TabsTrigger>
          <TabsTrigger value="inventory">Inventory</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* System Health */}
            <Card>
              <CardHeader>
                <CardTitle>System Health Overview</CardTitle>
                <CardDescription>Real-time status of all system components</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Wifi className="h-4 w-4 text-green-500" />
                      <span>IoT Sensors</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Progress value={97} className="w-20 h-2" />
                      <span className="text-sm">97%</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Camera className="h-4 w-4 text-green-500" />
                      <span>Security Cameras</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Progress value={96} className="w-20 h-2" />
                      <span className="text-sm">96%</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Scan className="h-4 w-4 text-yellow-500" />
                      <span>Barcode Scanners</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Progress value={89} className="w-20 h-2" />
                      <span className="text-sm">89%</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Scale className="h-4 w-4 text-green-500" />
                      <span>Weight Sensors</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Progress value={94} className="w-20 h-2" />
                      <span className="text-sm">94%</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recent Alerts */}
            <Card>
              <CardHeader>
                <CardTitle>Recent System Alerts</CardTitle>
                <CardDescription>Latest notifications requiring attention</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 max-h-80 overflow-y-auto">
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium">Sensor RFID_003 Offline</p>
                          <p className="text-sm">Battery critically low (12%)</p>
                          <p className="text-xs text-gray-500">Aisle B2 - 15 min ago</p>
                        </div>
                        <Button variant="outline" size="sm">
                          Fix
                        </Button>
                      </div>
                    </AlertDescription>
                  </Alert>
                  <Alert>
                    <Package className="h-4 w-4" />
                    <AlertDescription>
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium">23 Items Expired</p>
                          <p className="text-sm">Dairy section requires immediate attention</p>
                          <p className="text-xs text-gray-500">Multiple locations - 5 min ago</p>
                        </div>
                        <Button variant="outline" size="sm">
                          Review
                        </Button>
                      </div>
                    </AlertDescription>
                  </Alert>
                  <Alert>
                    <Camera className="h-4 w-4" />
                    <AlertDescription>
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium">Camera CAM_003 Offline</p>
                          <p className="text-sm">Checkout zone monitoring disabled</p>
                          <p className="text-xs text-gray-500">Checkout Zone - 8 min ago</p>
                        </div>
                        <Button variant="outline" size="sm">
                          Restart
                        </Button>
                      </div>
                    </AlertDescription>
                  </Alert>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Common administrative tasks</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Button className="h-20 flex flex-col gap-2" onClick={() => setShowAddSensorDialog(true)}>
                  <Plus className="h-6 w-6" />
                  Add Sensor
                </Button>
                <Button className="h-20 flex flex-col gap-2" onClick={() => setShowAddCameraDialog(true)}>
                  <Camera className="h-6 w-6" />
                  Add Camera
                </Button>
                <Button className="h-20 flex flex-col gap-2" variant="outline">
                  <RefreshCw className="h-6 w-6" />
                  System Restart
                </Button>
                <Button className="h-20 flex flex-col gap-2" variant="outline">
                  <Download className="h-6 w-6" />
                  Export Data
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="iot" className="space-y-4">
          <IoTDashboard />
        </TabsContent>

        <TabsContent value="sensors" className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">IoT Sensors Management</h2>
              <p className="text-gray-600">Monitor and manage all IoT sensors in the system</p>
            </div>
            <Button onClick={() => setShowAddSensorDialog(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Sensor
            </Button>
          </div>

          {/* Sensor Filters */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Search className="h-4 w-4" />
              <Input
                placeholder="Search sensors..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-64"
              />
            </div>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="online">Online</SelectItem>
                <SelectItem value="offline">Offline</SelectItem>
                <SelectItem value="maintenance">Maintenance</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Sensors Table */}
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Sensor ID</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Battery</TableHead>
                    <TableHead>Signal</TableHead>
                    <TableHead>Last Ping</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sensors.map((sensor) => (
                    <TableRow key={sensor.id}>
                      <TableCell className="font-medium">{sensor.id}</TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {sensor.type === "RFID" && <Wifi className="h-3 w-3 mr-1" />}
                          {sensor.type === "Weight" && <Scale className="h-3 w-3 mr-1" />}
                          {sensor.type === "Barcode Scanner" && <Scan className="h-3 w-3 mr-1" />}
                          {sensor.type}
                        </Badge>
                      </TableCell>
                      <TableCell>{sensor.location}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            sensor.status === "online"
                              ? "default"
                              : sensor.status === "offline"
                                ? "destructive"
                                : "secondary"
                          }
                        >
                          {sensor.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Progress value={sensor.batteryLevel} className="w-16 h-2" />
                          <span className="text-sm">{sensor.batteryLevel}%</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Progress value={sensor.signalStrength} className="w-16 h-2" />
                          <span className="text-sm">{sensor.signalStrength}%</span>
                        </div>
                      </TableCell>
                      <TableCell>{sensor.lastPing}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button variant="outline" size="sm">
                            <Settings className="h-3 w-3" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <Eye className="h-3 w-3" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="cameras" className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">Security Cameras</h2>
              <p className="text-gray-600">Monitor and manage security cameras with AI capabilities</p>
            </div>
            <Button onClick={() => setShowAddCameraDialog(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Camera
            </Button>
          </div>

          {/* Camera Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {cameras.map((camera) => (
              <Card key={camera.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{camera.name}</CardTitle>
                    <Badge
                      variant={
                        camera.status === "online"
                          ? "default"
                          : camera.status === "offline"
                            ? "destructive"
                            : "secondary"
                      }
                    >
                      {camera.status}
                    </Badge>
                  </div>
                  <CardDescription>{camera.location}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Camera Preview Placeholder */}
                  <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
                    {camera.status === "online" ? (
                      <div className="text-center">
                        <Camera className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                        <p className="text-sm text-gray-500">Live Feed</p>
                      </div>
                    ) : (
                      <div className="text-center">
                        <X className="h-8 w-8 mx-auto mb-2 text-red-400" />
                        <p className="text-sm text-red-500">Offline</p>
                      </div>
                    )}
                  </div>

                  {/* Camera Details */}
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Resolution:</span>
                      <span className="font-medium">{camera.resolution}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>AI Detection:</span>
                      <Badge variant={camera.aiEnabled ? "default" : "outline"}>
                        {camera.aiEnabled ? "Enabled" : "Disabled"}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Recording:</span>
                      <Badge variant={camera.recordingStatus === "active" ? "default" : "destructive"}>
                        {camera.recordingStatus}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Alerts:</span>
                      <span className="font-medium">{camera.alerts}</span>
                    </div>
                  </div>

                  {/* Camera Actions */}
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="flex-1">
                      <Eye className="h-3 w-3 mr-1" />
                      View
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1">
                      <Settings className="h-3 w-3 mr-1" />
                      Config
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="products" className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">Product Management</h2>
              <p className="text-gray-600">Manage all products with their specifications for smart checkout matching</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline">
                <Upload className="h-4 w-4 mr-2" />
                Import CSV
              </Button>
              <Button onClick={() => setShowAddProductDialog(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Product
              </Button>
            </div>
          </div>

          {/* Product Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Total Products</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">1,247</div>
                <p className="text-xs text-green-600">+23 this week</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Active Products</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">1,198</div>
                <p className="text-xs text-gray-600">96.1% of total</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Low Stock Items</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-orange-600">34</div>
                <p className="text-xs text-gray-600">Needs restocking</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Avg Margin</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">42.3%</div>
                <p className="text-xs text-green-600">+1.2% this month</p>
              </CardContent>
            </Card>
          </div>

          {/* Product Filters */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Search className="h-4 w-4" />
              <Input
                placeholder="Search products..."
                value={productSearchTerm}
                onChange={(e) => setProductSearchTerm(e.target.value)}
                className="w-64"
              />
            </div>
            <Select value={productFilterCategory} onValueChange={setProductFilterCategory}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="fruits-vegetables">Fruits & Vegetables</SelectItem>
                <SelectItem value="dairy-eggs">Dairy & Eggs</SelectItem>
                <SelectItem value="meat-seafood">Meat & Seafood</SelectItem>
                <SelectItem value="bakery">Bakery</SelectItem>
                <SelectItem value="beverages">Beverages</SelectItem>
                <SelectItem value="snacks">Snacks & Candy</SelectItem>
                <SelectItem value="frozen">Frozen Foods</SelectItem>
                <SelectItem value="pantry">Pantry Staples</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>

          {/* Products Table */}
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead>Barcode/RFID</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Weight</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Stock</TableHead>
                    <TableHead>Margin</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {products.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <img
                            src={product.imageUrl || "/images/products/organic-bananas.png"}
                            alt={product.name}
                            className="w-10 h-10 rounded-lg object-cover"
                          />
                          <div>
                            <p className="font-medium">{product.name}</p>
                            <p className="text-sm text-gray-500">{product.brand}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <p className="font-mono">{product.barcode}</p>
                          <p className="text-gray-500">{product.rfidTag}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <p className="font-medium">${product.price}</p>
                          <p className="text-gray-500">Cost: ${product.costPrice}</p>
                        </div>
                      </TableCell>
                      <TableCell>{product.weight}kg</TableCell>
                      <TableCell>
                        <Badge variant="outline">{product.category}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <p
                            className={`font-medium ${product.stockLevel <= product.minStockLevel ? "text-red-600" : ""}`}
                          >
                            {product.stockLevel}
                          </p>
                          <p className="text-gray-500">Min: {product.minStockLevel}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="font-medium text-green-600">{product.margin.toFixed(1)}%</span>
                      </TableCell>
                      <TableCell>
                        <Badge variant={product.status === "active" ? "default" : "secondary"}>{product.status}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button variant="outline" size="sm">
                            <Eye className="h-3 w-3" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <Settings className="h-3 w-3" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="inventory" className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">Inventory Management</h2>
              <p className="text-gray-600">Monitor expiry dates and manage product inventory</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline">
                <Upload className="h-4 w-4 mr-2" />
                Import Products
              </Button>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Product
              </Button>
            </div>
          </div>

          {/* Expiry Alerts */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-red-600">Expired Items</CardTitle>
                <CardDescription>Items that have already expired</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-red-600">{realtimeStats.expiredItems}</div>
                <p className="text-sm text-gray-600">Requires immediate removal</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-orange-600">Expiring Soon</CardTitle>
                <CardDescription>Items expiring within 3 days</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-orange-600">{realtimeStats.expiringItems}</div>
                <p className="text-sm text-gray-600">Mark down or remove</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-green-600">Fresh Items</CardTitle>
                <CardDescription>Items with good shelf life</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-600">1,247</div>
                <p className="text-sm text-gray-600">No action required</p>
              </CardContent>
            </Card>
          </div>

          {/* Expiry Items Table */}
          <Card>
            <CardHeader>
              <CardTitle>Items Requiring Attention</CardTitle>
              <CardDescription>Expired and expiring products that need immediate action</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Expiry Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Supplier</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {expiryItems.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{item.name}</p>
                          <p className="text-sm text-gray-500">{item.barcode}</p>
                        </div>
                      </TableCell>
                      <TableCell>{item.location}</TableCell>
                      <TableCell>{item.expiryDate}</TableCell>
                      <TableCell>
                        <Badge
                          variant={item.status === "expired" ? "destructive" : "secondary"}
                          className={item.status === "expiring" ? "bg-orange-100 text-orange-800" : ""}
                        >
                          {item.status === "expired"
                            ? `Expired ${Math.abs(item.daysUntilExpiry)} days ago`
                            : `Expires in ${item.daysUntilExpiry} days`}
                        </Badge>
                      </TableCell>
                      <TableCell>{item.quantity} units</TableCell>
                      <TableCell>{item.supplier}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            Remove
                          </Button>
                          <Button variant="outline" size="sm">
                            Mark Down
                          </Button>
                          <Button variant="outline" size="sm">
                            Replace
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">Security Monitoring</h2>
              <p className="text-gray-600">AI-powered security events and theft detection</p>
            </div>
            <Button variant="outline">
              <Shield className="h-4 w-4 mr-2" />
              Security Settings
            </Button>
          </div>

          {/* Security Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Today's Events</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">47</div>
                <p className="text-xs text-green-600">-12% from yesterday</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">High Priority</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">3</div>
                <p className="text-xs text-gray-600">Requires attention</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">AI Accuracy</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">97.2%</div>
                <p className="text-xs text-green-600">+0.3% this week</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">False Positives</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">2.8%</div>
                <p className="text-xs text-green-600">-0.5% this week</p>
              </CardContent>
            </Card>
          </div>

          {/* Recent Security Events */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Security Events</CardTitle>
              <CardDescription>Latest AI-detected security incidents</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  {
                    id: 1,
                    type: "Suspicious Behavior",
                    severity: "high",
                    description: "Customer lingering near high-value electronics section",
                    time: "2 minutes ago",
                    location: "Electronics - Aisle E2",
                    cameraId: "CAM_005",
                    confidence: 92,
                    resolved: false,
                  },
                  {
                    id: 2,
                    type: "Item Removal",
                    severity: "medium",
                    description: "Item removed from basket without proper scanning",
                    time: "5 minutes ago",
                    location: "Checkout Zone 2",
                    cameraId: "CAM_003",
                    confidence: 87,
                    resolved: false,
                  },
                  {
                    id: 3,
                    type: "Expired Item Alert",
                    severity: "low",
                    description: "Customer attempted to scan expired dairy product",
                    time: "8 minutes ago",
                    location: "Dairy Section",
                    cameraId: "CAM_002",
                    confidence: 98,
                    resolved: true,
                  },
                ].map((event) => (
                  <Alert key={event.id} variant={event.severity === "high" ? "destructive" : "default"}>
                    <Shield className="h-4 w-4" />
                    <AlertDescription>
                      <div className="flex justify-between items-start">
                        <div className="space-y-1">
                          <p className="font-medium">{event.type}</p>
                          <p className="text-sm">{event.description}</p>
                          <div className="flex items-center gap-4 text-xs text-gray-500">
                            <span>📍 {event.location}</span>
                            <span>📹 {event.cameraId}</span>
                            <span>🎯 {event.confidence}% confidence</span>
                            <span>⏰ {event.time}</span>
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          <Badge
                            variant={
                              event.severity === "high"
                                ? "destructive"
                                : event.severity === "medium"
                                  ? "secondary"
                                  : "outline"
                            }
                          >
                            {event.severity}
                          </Badge>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm">
                              View Feed
                            </Button>
                            {!event.resolved && (
                              <Button variant="outline" size="sm">
                                Resolve
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    </AlertDescription>
                  </Alert>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">Analytics & Reports</h2>
              <p className="text-gray-600">System performance and business insights</p>
            </div>
            <div className="flex gap-2">
              <Select defaultValue="7days">
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="24hours">Last 24 Hours</SelectItem>
                  <SelectItem value="7days">Last 7 Days</SelectItem>
                  <SelectItem value="30days">Last 30 Days</SelectItem>
                  <SelectItem value="90days">Last 90 Days</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Export Report
              </Button>
            </div>
          </div>

          {/* Performance Metrics */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>System Performance</CardTitle>
                <CardDescription>Key performance indicators over time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Average Checkout Time</span>
                      <span className="font-medium">2.3 min</span>
                    </div>
                    <Progress value={77} className="h-2" />
                    <p className="text-xs text-gray-500">Target: 3.0 min (23% better)</p>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Customer Satisfaction</span>
                      <span className="font-medium">94.5%</span>
                    </div>
                    <Progress value={95} className="h-2" />
                    <p className="text-xs text-gray-500">Target: 90% (4.5% above)</p>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>AI Detection Accuracy</span>
                      <span className="font-medium">97.2%</span>
                    </div>
                    <Progress value={97} className="h-2" />
                    <p className="text-xs text-gray-500">Target: 95% (2.2% above)</p>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>System Uptime</span>
                      <span className="font-medium">99.8%</span>
                    </div>
                    <Progress value={100} className="h-2" />
                    <p className="text-xs text-gray-500">Target: 99.5% (0.3% above)</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Cost Savings Analysis</CardTitle>
                <CardDescription>Monthly operational efficiency improvements</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <p className="text-2xl font-bold text-green-600">$12,450</p>
                      <p className="text-sm text-gray-600">Labor Cost Savings</p>
                    </div>
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <p className="text-2xl font-bold text-blue-600">$8,320</p>
                      <p className="text-sm text-gray-600">Theft Prevention</p>
                    </div>
                    <div className="text-center p-4 bg-purple-50 rounded-lg">
                      <p className="text-2xl font-bold text-purple-600">$5,680</p>
                      <p className="text-sm text-gray-600">Inventory Accuracy</p>
                    </div>
                    <div className="text-center p-4 bg-orange-50 rounded-lg">
                      <p className="text-2xl font-bold text-orange-600">$3,240</p>
                      <p className="text-sm text-gray-600">Reduced Wait Times</p>
                    </div>
                  </div>
                  <div className="pt-4 border-t">
                    <div className="text-center">
                      <p className="text-3xl font-bold text-green-600">$29,690</p>
                      <p className="text-gray-600">Total Monthly Savings</p>
                      <p className="text-sm text-green-600">↑ 15% from last month</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Usage Analytics */}
          <Card>
            <CardHeader>
              <CardTitle>Usage Analytics</CardTitle>
              <CardDescription>Daily system usage and transaction patterns</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart
                  data={[
                    { time: "6:00", baskets: 5, transactions: 3, alerts: 0 },
                    { time: "8:00", baskets: 15, transactions: 12, alerts: 1 },
                    { time: "10:00", baskets: 25, transactions: 22, alerts: 2 },
                    { time: "12:00", baskets: 35, transactions: 31, alerts: 1 },
                    { time: "14:00", baskets: 28, transactions: 25, alerts: 3 },
                    { time: "16:00", baskets: 32, transactions: 29, alerts: 2 },
                    { time: "18:00", baskets: 40, transactions: 37, alerts: 1 },
                    { time: "20:00", baskets: 22, transactions: 20, alerts: 0 },
                  ]}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="baskets" stroke="#3b82f6" strokeWidth={2} name="Active Baskets" />
                  <Line
                    type="monotone"
                    dataKey="transactions"
                    stroke="#10b981"
                    strokeWidth={2}
                    name="Completed Transactions"
                  />
                  <Line type="monotone" dataKey="alerts" stroke="#ef4444" strokeWidth={2} name="Security Alerts" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Add Sensor Dialog */}
      <AddSensorDialog />

      {/* Add Camera Dialog */}
      <AddCameraDialog />

      {/* Add Product Dialog */}
      <AddProductDialog />
    </div>
  )
}
