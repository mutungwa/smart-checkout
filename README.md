# Smart Self-Checkout System

A comprehensive IoT and AI-powered smart checkout system that allows customers to scan and pay for items directly from their shopping basket without going to a cashier.

## 🚀 Features

### Core Functionality
- **IoT-enabled Smart Basket**: Simulated RFID/NFC sensors and weight detection
- **Real-time Item Tracking**: Live updates of basket contents and pricing
- **Mobile/Web Interface**: Responsive UI for customers and administrators
- **AI Security System**: Computer vision for theft detection and suspicious behavior monitoring
- **Expiry Date Checking**: Automatic detection and blocking of expired products
- **Secure Payment Processing**: Integrated payment system with multiple methods

### Advanced Features
- **Real-time Analytics**: Live dashboard for store managers
- **Security Event Monitoring**: AI-powered alerts and incident tracking
- **Inventory Management**: Product database with barcode/RFID integration
- **Performance Metrics**: Checkout time optimization and customer satisfaction tracking

## 🏗️ Architecture

### Frontend
- **Next.js 14** with App Router
- **TypeScript** for type safety
- **Tailwind CSS** for styling
- **Shadcn/ui** for component library
- **Zustand** for state management
- **Recharts** for data visualization

### Backend
- **Next.js API Routes** for serverless functions
- **WebSocket** support for real-time updates
- **RESTful API** design

### AI/ML Integration
- **TensorFlow.js** ready for computer vision
- **Simulated AI models** for theft detection
- **OCR capabilities** for expiry date reading

### IoT Simulation
- **RFID/NFC sensor simulation**
- **Weight sensor integration**
- **Barcode scanning simulation**
- **Real-time data streaming**

## 📁 Project Structure

\`\`\`
smart-checkout-system/
├── app/                          # Next.js app directory
│   ├── api/                      # API routes
│   │   ├── baskets/             # Basket management
│   │   ├── products/            # Product catalog
│   │   ├── security/            # Security events
│   │   └── payment/             # Payment processing
│   ├── admin/                   # Admin dashboard
│   └── page.tsx                 # Main customer interface
├── components/                   # React components
│   ├── smart-basket-interface.tsx
│   └── admin-dashboard.tsx
├── lib/                         # Utility libraries
│   ├── store.ts                 # Zustand state management
│   ├── iot-simulator.ts         # IoT device simulation
│   ├── ai-security.ts           # AI security system
│   ├── payment.ts               # Payment processing
│   └── websocket.ts             # Real-time communication
├── types/                       # TypeScript type definitions
│   └── index.ts
└── README.md
\`\`\`

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone the repository**
\`\`\`bash
git clone <repository-url>
cd smart-checkout-system
\`\`\`

2. **Install dependencies**
\`\`\`bash
npm install
\`\`\`

3. **Start the development server**
\`\`\`bash
npm run dev
\`\`\`

4. **Set up the database**
```bash
pnpm db:migrate
pnpm db:seed
```

5. **Create an admin user**
```bash
pnpm admin:create
```
Follow the interactive prompts to create your admin account.

6. **Open your browser**
- Customer Interface: http://localhost:3000
- Admin Dashboard: http://localhost:3000/admin/login

## 🛠️ Usage

### Customer Interface

1. **Start Shopping**: The system automatically creates a smart basket session
2. **Add Items**: Use the simulation buttons to test different scanning methods:
   - **Barcode Scanning**: Simulate camera-based barcode detection
   - **RFID Detection**: Simulate placing RFID-tagged items in basket
   - **Weight Sensors**: Simulate weight-based item detection
3. **Monitor Basket**: View real-time updates of items and total cost
4. **Checkout**: Process payment securely through the integrated system

### Admin Dashboard

1. **Monitor Activity**: View real-time basket activity and system status
2. **Security Alerts**: Monitor AI-detected security events
3. **Analytics**: Track performance metrics and cost savings
4. **System Health**: Monitor IoT sensor status and uptime

## 🔧 Key Components

### IoT Simulation (`lib/iot-simulator.ts`)
- Simulates RFID, barcode, and weight sensors
- Generates realistic sensor data
- Handles product detection and validation

### AI Security System (`lib/ai-security.ts`)
- Computer vision simulation for theft detection
- Behavioral analysis algorithms
- Security event generation and classification

### Payment Processing (`lib/payment.ts`)
- Secure payment intent creation
- Multiple payment method support
- Transaction processing and receipt generation

### Real-time Communication (`lib/websocket.ts`)
- WebSocket management for live updates
- Event-driven architecture
- Real-time basket synchronization

## 🧪 Testing Features

### Expiry Date Testing
- Try scanning the "Expired Yogurt" product to see security alerts
- Test expiry warnings for items expiring soon

### Security System Testing
- The AI security system randomly generates events for demonstration
- Monitor the admin dashboard for security alerts

### Payment Testing
- Use the checkout process with simulated payment methods
- Test different payment scenarios (success/failure)

### IoT Sensor Testing
- Test all three scanning methods (barcode, RFID, weight)
- Observe real-time basket updates

## 🔮 Future Enhancements

### Production Readiness
- [ ] Real camera integration with OpenCV
- [ ] Actual RFID/NFC hardware integration
- [ ] Production payment gateway (Stripe/PayPal)
- [ ] Database integration (PostgreSQL/MongoDB)
- [ ] User authentication and profiles

### Advanced AI Features
- [ ] Real-time object detection with TensorFlow.js
- [ ] Facial recognition for customer identification
- [ ] Predictive analytics for inventory management
- [ ] Advanced behavioral analysis

### Mobile App
- [ ] React Native mobile application
- [ ] Push notifications for security alerts
- [ ] Offline mode support
- [ ] QR code basket pairing

### Hardware Integration
- [ ] Raspberry Pi IoT hub
- [ ] Arduino sensor integration
- [ ] Industrial-grade RFID readers
- [ ] Professional security cameras

## 🛡️ Security Considerations

- **Data Encryption**: All sensitive data should be encrypted in transit and at rest
- **Authentication**: Implement robust user authentication and authorization
- **Privacy**: Ensure customer privacy compliance (GDPR, CCPA)
- **Audit Logging**: Comprehensive logging for security and compliance
- **Network Security**: Secure IoT device communication protocols

## 📊 Performance Metrics

The system tracks several key performance indicators:
- Average checkout time: Target < 3 minutes
- Customer satisfaction: Target > 90%
- AI accuracy: Target > 95%
- System uptime: Target > 99.5%
- Theft prevention effectiveness
- Cost savings analysis

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Shadcn/ui for the excellent component library
- Recharts for data visualization components
- The Next.js team for the amazing framework
- TensorFlow.js for AI/ML capabilities
