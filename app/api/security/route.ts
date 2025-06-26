import { type NextRequest, NextResponse } from "next/server"
import type { SecurityEvent } from "@/types"

// Mock security events database
const securityEvents: SecurityEvent[] = []

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const basketId = searchParams.get("basketId")
  const severity = searchParams.get("severity")
  const resolved = searchParams.get("resolved")

  let filteredEvents = securityEvents

  if (basketId) {
    filteredEvents = filteredEvents.filter((e) => e.basketId === basketId)
  }

  if (severity) {
    filteredEvents = filteredEvents.filter((e) => e.severity === severity)
  }

  if (resolved !== null) {
    filteredEvents = filteredEvents.filter((e) => e.resolved === (resolved === "true"))
  }

  // Sort by timestamp (newest first)
  filteredEvents.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())

  return NextResponse.json(filteredEvents)
}

export async function POST(request: NextRequest) {
  try {
    const eventData = await request.json()

    const newEvent: SecurityEvent = {
      id: `sec_${Date.now()}`,
      timestamp: new Date(),
      resolved: false,
      ...eventData,
    }

    securityEvents.push(newEvent)

    // Simulate real-time notification (in production, use WebSocket or Server-Sent Events)
    console.log("Security event created:", newEvent)

    return NextResponse.json(newEvent, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: "Invalid security event data" }, { status: 400 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { id, resolved } = await request.json()

    const eventIndex = securityEvents.findIndex((e) => e.id === id)
    if (eventIndex === -1) {
      return NextResponse.json({ error: "Security event not found" }, { status: 404 })
    }

    securityEvents[eventIndex].resolved = resolved

    return NextResponse.json(securityEvents[eventIndex])
  } catch (error) {
    return NextResponse.json({ error: "Invalid request data" }, { status: 400 })
  }
}
