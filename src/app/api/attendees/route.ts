import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { attendeeSchema } from '@/lib/validations'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const eventId = searchParams.get('eventId')

  try {
    const attendees = await prisma.attendee.findMany({
      where: eventId ? { eventId } : undefined,
      include: { event: true }
    })
    
    return NextResponse.json(attendees)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch attendees' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const validation = attendeeSchema.safeParse(body)
    
    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.issues },
        { status: 400 }
      )
    }

    // Check if event exists and has capacity
    const event = await prisma.event.findUnique({
      where: { id: validation.data.eventId },
      include: { _count: { select: { attendees: true } } }
    })

    if (!event) {
      return NextResponse.json(
        { error: 'Event not found' },
        { status: 404 }
      )
    }

    if (event._count.attendees >= event.capacity) {
      return NextResponse.json(
        { error: 'Event is at full capacity' },
        { status: 400 }
      )
    }

    // Check for duplicate email
    const existing = await prisma.attendee.findFirst({
      where: {
        email: validation.data.email,
        eventId: validation.data.eventId
      }
    })

    if (existing) {
      return NextResponse.json(
        { error: 'Attendee already registered for this event' },
        { status: 400 }
      )
    }

    const attendee = await prisma.attendee.create({
      data: validation.data
    })
    
    return NextResponse.json(attendee)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create attendee' },
      { status: 500 }
    )
  }
}