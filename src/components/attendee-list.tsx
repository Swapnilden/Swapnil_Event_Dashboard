'use client'

import { useState } from 'react'
import { UserPlus, Users, X } from 'lucide-react'
import { toast } from 'sonner'

import { useAttendees, useDeleteAttendee } from '@/hooks/use-attendees'
import { useEvents } from '@/hooks/use-events'
import { AttendeeForm } from './attendee-form'
import { Button } from './ui/button'
import { Card } from './ui/card'
import { EmptyState } from './empty-state'
import { LoadingSkeleton } from './loading-skeleton'

interface AttendeeListProps {
  selectedEventId: string | null
}

export function AttendeeList({ selectedEventId }: AttendeeListProps) {
  const [showForm, setShowForm] = useState(false)

  const { data: attendees, isLoading } = useAttendees(
    selectedEventId || undefined
  )
  const { data: events } = useEvents()
  const deleteAttendee = useDeleteAttendee()

  const selectedEvent = events?.find((e: any) => e.id === selectedEventId)
  const attendeeCount = attendees?.length ?? 0
  const isAtCapacity =
    !!selectedEvent && attendeeCount >= selectedEvent.capacity

  const handleDelete = async (id: string) => {
    if (!confirm('Remove this attendee?')) return

    const toastId = toast.loading('Removing attendee…')

    try {
      await deleteAttendee.mutateAsync(id)
      toast.success('Attendee removed successfully', { id: toastId })
    } catch {
      toast.error('Failed to remove attendee', { id: toastId })
    }
  }

  if (!selectedEventId) {
    return (
      <EmptyState
        icon={Users}
        title="Select an event"
        description="Choose an event to view and manage attendees"
      />
    )
  }

  return (
    <div className="space-y-4">
      {selectedEvent && (
        <Card className="p-3 bg-slate-50">
          <p className="text-sm text-slate-600 mb-1">Selected Event</p>
          <p className="font-bold text-slate-800">{selectedEvent.title}</p>
          <p className="text-sm text-slate-500">
            {attendeeCount}/{selectedEvent.capacity} registered
            {isAtCapacity && (
              <span className="ml-2 text-orange-600 font-medium">• Full</span>
            )}
          </p>
        </Card>
      )}

      <Button
        onClick={() => setShowForm((v) => !v)}
        disabled={isAtCapacity}
        className="w-full"
      >
        <UserPlus className="mr-2 h-4 w-4" />
        Add Attendee
      </Button>

      {showForm && (
        <AttendeeForm
          eventId={selectedEventId}
          onSuccess={() => {
            setShowForm(false)
            toast.success('Attendee registered successfully')
          }}
          onCancel={() => setShowForm(false)}
        />
      )}

      <div className="space-y-2 max-h-[600px] overflow-y-auto">
        {isLoading ? (
          <LoadingSkeleton count={3} />
        ) : !attendees || attendees.length === 0 ? (
          <EmptyState
            icon={UserPlus}
            title="No attendees yet"
            description="Add the first attendee to this event"
          />
        ) : (
          attendees.map((attendee: any) => (
            <Card
              key={attendee.id}
              className="p-3 flex items-center justify-between hover:border-green-300 hover:shadow-sm transition"
            >
              <div>
                <p className="font-semibold text-slate-800">
                  {attendee.name}
                </p>
                <p className="text-sm text-slate-500">
                  {attendee.email}
                </p>
              </div>

              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleDelete(attendee.id)}
                disabled={deleteAttendee.isPending}
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <X className="h-4 w-4" />
              </Button>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
