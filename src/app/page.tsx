'use client'

import { useState } from 'react'
import { EventList } from '@/components/event-list'
import { AttendeeList } from '@/components/attendee-list'

export default function Home() {
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-slate-800 mb-2">
            Event Management Portal
          </h1>
          <p className="text-slate-600">
            Manage your events and attendees efficiently
          </p>
        </header>

        <div className="grid lg:grid-cols-2 gap-6">
          <EventList
            selectedEventId={selectedEventId}
            onSelectEvent={setSelectedEventId}
          />
          <AttendeeList selectedEventId={selectedEventId} />
        </div>
      </div>
    </div>
  )
}