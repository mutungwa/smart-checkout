const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seed...')

  // Create sample products
  const products = await Promise.all([
    prisma.product.create({
      data: {
        name: 'Organic Bananas',
        price: 2.99,
        barcode: '1234567890123',
        rfidTag: 'RFID_001',
        weight: 0.5,
        category: 'Fruits & Vegetables',
        brand: 'Fresh Farms',
        description: 'Fresh organic bananas from local farms',
        expiryDays: 7,
        supplier: 'Fresh Farms Co.',
        costPrice: 1.5,
        margin: 49.8,
        stockLevel: 150,
        minStockLevel: 20,
        maxStockLevel: 300,
        location: 'Produce Section - Shelf P1',
        taxRate: 0,
        isPerishable: true,
        nutritionInfo: {
          calories: 89,
          protein: 1.1,
          carbs: 22.8,
          fat: 0.3,
        },
        imageUrl: '/images/products/organic-bananas.png',
        status: 'active',
      },
    }),
    prisma.product.create({
      data: {
        name: 'Whole Milk',
        price: 3.49,
        barcode: '2345678901234',
        rfidTag: 'RFID_002',
        weight: 1.0,
        category: 'Dairy & Eggs',
        brand: 'Dairy Best',
        description: 'Fresh whole milk, 1 gallon',
        expiryDays: 5,
        supplier: 'Dairy Best Ltd.',
        costPrice: 2.1,
        margin: 39.8,
        stockLevel: 85,
        minStockLevel: 15,
        maxStockLevel: 200,
        location: 'Dairy Section - Shelf D3',
        taxRate: 0,
        isPerishable: true,
        nutritionInfo: {
          calories: 150,
          protein: 8,
          carbs: 12,
          fat: 8,
        },
        imageUrl: '/images/products/whole-milk.png',
        status: 'active',
      },
    }),
    prisma.product.create({
      data: {
        name: 'Premium Coffee Beans',
        price: 12.99,
        barcode: '3456789012345',
        rfidTag: 'RFID_003',
        weight: 0.5,
        category: 'Beverages',
        brand: 'Coffee Masters',
        description: 'Premium arabica coffee beans',
        expiryDays: 365,
        supplier: 'Coffee Masters Inc.',
        costPrice: 7.5,
        margin: 42.3,
        stockLevel: 45,
        minStockLevel: 10,
        maxStockLevel: 100,
        location: 'Beverages - Shelf B4',
        taxRate: 8.5,
        isPerishable: false,
        nutritionInfo: {
          calories: 2,
          protein: 0.3,
          carbs: 0,
          fat: 0,
        },
        imageUrl: '/images/products/coffee-beans.png',
        status: 'active',
      },
    }),
  ])

  console.log(`✅ Created ${products.length} products`)

  // Create IoT sensors
  const sensors = await Promise.all([
    prisma.ioTSensor.create({
      data: {
        sensorId: 'RFID_001',
        type: 'rfid',
        location: 'Aisle A1 - Basket Station 1',
        status: 'online',
        batteryLevel: 85,
        signalStrength: 92,
        basketId: 'basket_001',
      },
    }),
    prisma.ioTSensor.create({
      data: {
        sensorId: 'WEIGHT_002',
        type: 'weight',
        location: 'Aisle A1 - Basket Station 1',
        status: 'online',
        batteryLevel: 78,
        signalStrength: 88,
        basketId: 'basket_001',
      },
    }),
    prisma.ioTSensor.create({
      data: {
        sensorId: 'RFID_003',
        type: 'rfid',
        location: 'Aisle B2 - Basket Station 3',
        status: 'offline',
        batteryLevel: 12,
        signalStrength: 0,
        basketId: 'basket_003',
      },
    }),
  ])

  console.log(`✅ Created ${sensors.length} IoT sensors`)

  // Create security cameras
  const cameras = await Promise.all([
    prisma.securityCamera.create({
      data: {
        cameraId: 'CAM_001',
        name: 'Entrance Camera 1',
        location: 'Main Entrance',
        status: 'online',
        resolution: '4K',
        aiEnabled: true,
        recordingStatus: 'active',
        lastMaintenance: new Date('2024-01-15'),
        alerts: 3,
      },
    }),
    prisma.securityCamera.create({
      data: {
        cameraId: 'CAM_002',
        name: 'Aisle A Security',
        location: 'Aisle A - Overview',
        status: 'online',
        resolution: '1080p',
        aiEnabled: true,
        recordingStatus: 'active',
        lastMaintenance: new Date('2024-01-10'),
        alerts: 1,
      },
    }),
    prisma.securityCamera.create({
      data: {
        cameraId: 'CAM_003',
        name: 'Checkout Monitor',
        location: 'Checkout Zone',
        status: 'offline',
        resolution: '4K',
        aiEnabled: true,
        recordingStatus: 'stopped',
        lastMaintenance: new Date('2024-01-05'),
        alerts: 0,
      },
    }),
  ])

  console.log(`✅ Created ${cameras.length} security cameras`)

  // Create expiry items
  const expiryItems = await Promise.all([
    prisma.expiryItem.create({
      data: {
        productId: products[0].id, // Organic Bananas
        location: 'Produce Section - Shelf P1',
        expiryDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
        daysUntilExpiry: -2,
        quantity: 12,
        status: 'expired',
        supplier: 'Fresh Farms Co.',
      },
    }),
    prisma.expiryItem.create({
      data: {
        productId: products[1].id, // Whole Milk
        location: 'Dairy Section - Shelf D1',
        expiryDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000), // 1 day from now
        daysUntilExpiry: 1,
        quantity: 8,
        status: 'expiring',
        supplier: 'Dairy Best Ltd.',
      },
    }),
  ])

  console.log(`✅ Created ${expiryItems.length} expiry items`)

  console.log('🎉 Database seed completed successfully!')
}

main()
  .catch((e) => {
    console.error('❌ Error during seed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
