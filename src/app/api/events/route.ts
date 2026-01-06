import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { eventSchema } from '@/lib/validations'

export async function GET() {
  try {
    const events = await prisma.event.findMany({
      include: {
        _count: {
          select: { attendees: true }
        }
      },
      orderBy: { date: 'asc' }
    })
    return NextResponse.json(events)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch events' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const validation = eventSchema.safeParse(body)
    
    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.issues },
        { status: 400 }
      )
    }

    const event = await prisma.event.create({
      data: {
        ...validation.data,
        date: new Date(validation.data.date)
      }
    })
    
    return NextResponse.json(event)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create event' },
      { status: 500 }
    )
  }
}