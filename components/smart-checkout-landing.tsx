"use client"

import { useState, useEffect } from "react"
import {
  ShoppingCart,
  Scan,
  Shield,
  Clock,
  Smartphone,
  Zap,
  CheckCircle,
  Star,
  Menu,
  X,
  ArrowRight,
  CreditCard,
  Activity,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Image from "next/image"
import Link from "next/link"

export default function SmartCheckoutLanding() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [currentDemo, setCurrentDemo] = useState(0)

  const demoSteps = [
    "Scan items with your phone",
    "AI detects products automatically",
    "Real-time basket tracking",
    "Secure contactless payment",
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentDemo((prev) => (prev + 1) % demoSteps.length)
    }, 3000)
    return () => clearInterval(interval)
  }, [demoSteps.length])

  return (
    <div className="flex min-h-screen flex-col">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <ShoppingCart className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">SmartCheckout</span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <Link href="#how-it-works" className="text-sm font-medium hover:text-primary">
              How it works
            </Link>
            <Link href="#features" className="text-sm font-medium hover:text-primary">
              Features
            </Link>
            <Link href="#testimonials" className="text-sm font-medium hover:text-primary">
              Reviews
            </Link>
            <Link href="#for-retailers" className="text-sm font-medium hover:text-primary">
              For Retailers
            </Link>
            <Button asChild>
              <Link href="/checkout">Try Demo</Link>
            </Button>
          </nav>

          {/* Mobile Navigation Toggle */}
          <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>

        {/* Mobile Navigation Menu */}
        {isMenuOpen && (
          <div className="container md:hidden py-4 border-t">
            <nav className="flex flex-col gap-4">
              <Link
                href="#how-it-works"
                className="text-sm font-medium hover:text-primary"
                onClick={() => setIsMenuOpen(false)}
              >
                How it works
              </Link>
              <Link
                href="#features"
                className="text-sm font-medium hover:text-primary"
                onClick={() => setIsMenuOpen(false)}
              >
                Features
              </Link>
              <Link
                href="#testimonials"
                className="text-sm font-medium hover:text-primary"
                onClick={() => setIsMenuOpen(false)}
              >
                Reviews
              </Link>
              <Link
                href="#for-retailers"
                className="text-sm font-medium hover:text-primary"
                onClick={() => setIsMenuOpen(false)}
              >
                For Retailers
              </Link>
              <Button className="w-full" asChild>
                <Link href="/checkout">Try Demo</Link>
              </Button>
            </nav>
          </div>
        )}
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative">
          <div className="absolute inset-0 bg-gradient-to-b from-blue-50 to-white z-0"></div>
          <div className="container relative z-10 py-12 md:py-24 lg:py-32">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
              <div className="space-y-4">
                <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl">
                  Shop Smart, Pay Fast with AI-Powered Checkout!
                </h1>
                <p className="text-xl text-muted-foreground">
                  Revolutionary self-checkout system with IoT baskets, AI security, and instant payments
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button size="lg" className="bg-blue-600 hover:bg-blue-700" asChild>
                    <Link href="/checkout">
                      <ShoppingCart className="mr-2 h-5 w-5" />
                      Try Demo Now
                    </Link>
                  </Button>
                  <Button size="lg" variant="outline" asChild>
                    <Link href="/iot-demo">
                      <Activity className="mr-2 h-5 w-5" />
                      IoT Demo
                    </Link>
                  </Button>
                  <Button size="lg" variant="secondary" asChild>
                    <Link href="/admin/login">
                      <Shield className="mr-2 h-5 w-5" />
                      Admin Portal
                    </Link>
                  </Button>
                </div>
              </div>
              <div className="relative">
                <div className="relative bg-gradient-to-br from-blue-100 to-blue-50 rounded-2xl p-8">
                  <div className="text-center">
                    <div className="w-32 h-32 mx-auto mb-4 bg-blue-600 rounded-full flex items-center justify-center">
                      <ShoppingCart className="h-16 w-16 text-white" />
                    </div>
                    <div className="text-lg font-semibold text-blue-900 mb-2">{demoSteps[currentDemo]}</div>
                    <div className="flex justify-center gap-2">
                      {demoSteps.map((_, index) => (
                        <div
                          key={index}
                          className={`w-2 h-2 rounded-full transition-colors ${
                            index === currentDemo ? "bg-blue-600" : "bg-blue-300"
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Overview */}
        <section className="container py-12 md:py-24">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl font-bold tracking-tight mb-4">Next-Generation Shopping Experience</h2>
            <p className="text-lg text-muted-foreground">
              Our smart checkout system combines IoT technology, AI security, and seamless payments to revolutionize
              retail shopping
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="text-center">
              <CardHeader>
                <div className="mx-auto bg-primary/10 p-3 rounded-full w-16 h-16 flex items-center justify-center">
                  <Scan className="h-8 w-8 text-primary" />
                </div>
                <CardTitle className="mt-4">Smart Scanning</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  RFID, NFC, and barcode scanning with AI-powered product recognition
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <div className="mx-auto bg-primary/10 p-3 rounded-full w-16 h-16 flex items-center justify-center">
                  <Shield className="h-8 w-8 text-primary" />
                </div>
                <CardTitle className="mt-4">AI Security</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Advanced theft detection and suspicious behavior monitoring with real-time alerts
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <div className="mx-auto bg-primary/10 p-3 rounded-full w-16 h-16 flex items-center justify-center">
                  <Clock className="h-8 w-8 text-primary" />
                </div>
                <CardTitle className="mt-4">Expiry Tracking</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Automatic expiry date detection prevents purchase of expired products
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <div className="mx-auto bg-primary/10 p-3 rounded-full w-16 h-16 flex items-center justify-center">
                  <CreditCard className="h-8 w-8 text-primary" />
                </div>
                <CardTitle className="mt-4">Instant Payment</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Secure contactless payments with Apple Pay, Google Pay, and card support
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* How It Works */}
        <section id="how-it-works" className="bg-muted py-12 md:py-24">
          <div className="container">
            <h2 className="text-3xl font-bold tracking-tight text-center mb-12">How It Works</h2>

            <div className="grid md:grid-cols-3 gap-8">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary text-primary-foreground font-bold text-xl mb-4">
                    1
                  </div>
                  <CardTitle>Pick Up Smart Basket</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Grab an IoT-enabled basket equipped with RFID sensors, weight detection, and camera integration
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary text-primary-foreground font-bold text-xl mb-4">
                    2
                  </div>
                  <CardTitle>Shop & Scan Automatically</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Items are automatically detected as you place them in the basket. AI verifies products and checks
                    expiry dates
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary text-primary-foreground font-bold text-xl mb-4">
                    3
                  </div>
                  <CardTitle>Pay & Go</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Complete secure payment through the mobile app and walk out. No queues, no cashiers needed
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Features Detail */}
        <section id="features" className="container py-12 md:py-24">
          <h2 className="text-3xl font-bold tracking-tight text-center mb-12">Advanced Features</h2>

          <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
            <div>
              <h3 className="text-2xl font-bold mb-4">IoT-Enabled Smart Baskets</h3>
              <p className="text-lg text-muted-foreground mb-6">
                Our baskets are equipped with cutting-edge sensors that automatically detect and register items as you
                shop.
              </p>
              <ul className="space-y-2 mb-6">
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span>RFID/NFC sensors for instant product recognition</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span>Weight sensors for verification and fraud prevention</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span>Real-time synchronization with mobile app</span>
                </li>
              </ul>
            </div>
            <div className="relative">
              <Image
                src="/images/smart-iot-basket.png"
                width={600}
                height={400}
                alt="Smart IoT Basket with RFID sensors and weight detection"
                className="rounded-lg object-cover shadow-lg"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
            <div className="relative order-2 md:order-1">
              <Image
                src="/images/ai-security-system.png"
                width={600}
                height={400}
                alt="AI Security System with computer vision and theft detection"
                className="rounded-lg object-cover shadow-lg"
              />
            </div>
            <div className="order-1 md:order-2">
              <h3 className="text-2xl font-bold mb-4">AI-Powered Security</h3>
              <p className="text-lg text-muted-foreground mb-6">
                Advanced computer vision and machine learning algorithms monitor for theft and suspicious behavior.
              </p>
              <ul className="space-y-2 mb-6">
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span>Real-time theft detection and prevention</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span>Behavioral analysis for suspicious activity</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span>Instant alerts to security personnel</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-2xl font-bold mb-4">Smart Expiry Management</h3>
              <p className="text-lg text-muted-foreground mb-6">
                Never buy expired products again with our intelligent expiry date detection system.
              </p>
              <ul className="space-y-2 mb-6">
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span>Automatic expiry date scanning and verification</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span>Blocks purchase of expired items</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span>Alerts for items expiring soon</span>
                </li>
              </ul>
            </div>
            <div className="relative">
              <Image
                src="/images/expiry-detection.png"
                width={600}
                height={400}
                alt="Expiry Date Detection and Management System"
                className="rounded-lg object-cover shadow-lg"
              />
            </div>
          </div>
        </section>

        {/* Demo CTA */}
        <section className="bg-primary text-primary-foreground py-12 md:py-24">
          <div className="container">
            <div className="text-center max-w-3xl mx-auto mb-8">
              <h2 className="text-3xl font-bold tracking-tight mb-4">Experience the Future of Shopping</h2>
              <p className="text-lg opacity-90">
                Try our interactive demo and see how smart checkout transforms the retail experience
              </p>
            </div>

            <div className="flex justify-center">
              <Button size="lg" variant="secondary" className="text-lg px-8 py-4" asChild>
                <Link href="/checkout">
                  <Zap className="mr-2 h-5 w-5" />
                  Launch Interactive Demo
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section id="testimonials" className="bg-muted py-12 md:py-24">
          <div className="container">
            <h2 className="text-3xl font-bold tracking-tight text-center mb-12">What Our Users Say</h2>

            <div className="grid md:grid-cols-3 gap-8">
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star key={star} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="italic mb-4">
                    "Shopping has never been this easy! No more waiting in long checkout lines. The AI security gives me
                    peace of mind too."
                  </p>
                  <p className="font-medium">Sarah Johnson, Regular Customer</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star key={star} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="italic mb-4">
                    "As a store owner, this system has reduced theft by 60% and improved customer satisfaction
                    significantly. ROI was achieved in 6 months."
                  </p>
                  <p className="font-medium">Mike Chen, Store Manager</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star key={star} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="italic mb-4">
                    "The expiry date detection saved me from buying spoiled milk twice! The technology is incredible and
                    so user-friendly."
                  </p>
                  <p className="font-medium">Emma Davis, Tech Enthusiast</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* For Retailers */}
        <section id="for-retailers" className="container py-12 md:py-24">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold tracking-tight mb-4">For Retailers & Store Owners</h2>
              <p className="text-lg text-muted-foreground mb-6">
                Transform your store with our smart checkout system. Reduce operational costs, prevent theft, and
                improve customer experience.
              </p>
              <ul className="space-y-2 mb-6">
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span>Reduce staffing costs by up to 40%</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span>Prevent theft with AI-powered security</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span>Improve customer satisfaction and loyalty</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span>Real-time analytics and inventory management</span>
                </li>
              </ul>
              <Button className="gap-2">
                Schedule Demo <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
            <div className="relative">
              <Image
                src="/images/retail-analytics.png"
                width={600}
                height={400}
                alt="Retail Analytics Dashboard showing sales data and insights"
                className="rounded-lg object-cover shadow-lg"
              />
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="bg-muted py-12 md:py-16">
          <div className="container">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div>
                <div className="text-4xl font-bold text-primary mb-2">99.8%</div>
                <div className="text-muted-foreground">Accuracy Rate</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-primary mb-2">60%</div>
                <div className="text-muted-foreground">Theft Reduction</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-primary mb-2">3x</div>
                <div className="text-muted-foreground">Faster Checkout</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-primary mb-2">500+</div>
                <div className="text-muted-foreground">Stores Deployed</div>
              </div>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="container py-12 md:py-24">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold tracking-tight mb-4">Ready to Transform Your Shopping Experience?</h2>
            <p className="text-lg text-muted-foreground mb-8">
              Join thousands of satisfied customers and retailers who have already embraced the future of shopping.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700" asChild>
                <Link href="/checkout">
                  <ShoppingCart className="mr-2 h-5 w-5" />
                  Try Demo Now
                </Link>
              </Button>
              <Button size="lg" variant="outline">
                Contact Sales Team
              </Button>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t bg-muted/40">
        <div className="container py-8 md:py-12">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <ShoppingCart className="h-6 w-6 text-primary" />
                <span className="text-xl font-bold">SmartCheckout</span>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                Revolutionary self-checkout system powered by IoT and AI technology
              </p>
              <div className="space-y-2">
                <p className="text-sm flex items-center gap-2">
                  <Smartphone className="h-4 w-4" />
                  +1 (555) 123-4567
                </p>
                <p className="text-sm">hello@smartcheckout.com</p>
              </div>
            </div>

            <div>
              <h3 className="font-medium mb-4">Product</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">
                    Features
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">
                    How it works
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">
                    API Documentation
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-medium mb-4">For Business</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">
                    For Retailers
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">
                    Enterprise Solutions
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">
                    Integration Partners
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">
                    Case Studies
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-medium mb-4">Support</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">
                    Contact Us
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">
                    Terms of Service
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground">
            <p>© {new Date().getFullYear()} SmartCheckout. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
