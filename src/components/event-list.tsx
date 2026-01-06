'use client'

import { useState } from 'react'
import { Plus, Trash2, Calendar as CalendarIcon } from 'lucide-react'
import { toast } from 'sonner'

import { useEvents, useDeleteEvent } from '@/hooks/use-events'
import { EventForm } from './event-form'
import { Button } from './ui/button'
import { Card } from './ui/card'
import { EmptyState } from './empty-state'
import { LoadingSkeleton } from './loading-skeleton'

interface EventListProps {
  selectedEventId: string | null
  onSelectEvent: (id: string | null) => void
}

export function EventList({
  selectedEventId,
  onSelectEvent,
}: EventListProps) {
  const [showForm, setShowForm] = useState(false)

  const { data: events, isLoading, error } = useEvents()
  const deleteEvent = useDeleteEvent()

  const handleDelete = async (
    id: string,
    e: React.MouseEvent
  ) => {
    e.stopPropagation()

    if (!confirm('Delete this event and all attendees?')) return

    const toastId = toast.loading('Deleting event…')

    try {
      await deleteEvent.mutateAsync(id)

      toast.success('Event deleted successfully', { id: toastId })

      if (selectedEventId === id) {
        onSelectEvent(null)
      }
    } catch {
      toast.error('Failed to delete event', { id: toastId })
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-3">
        <LoadingSkeleton count={3} />
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-8 text-red-600">
        Failed to load events. Please try again.
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <Button
        onClick={() => setShowForm((v) => !v)}
        className="w-full"
      >
        <Plus className="mr-2 h-4 w-4" />
        New Event
      </Button>

      {showForm && (
        <EventForm
          onSuccess={() => {
            setShowForm(false)
            toast.success('Event created successfully')
          }}
          onCancel={() => setShowForm(false)}
        />
      )}

      <div className="space-y-3 max-h-[600px] overflow-y-auto">
        {!events || events.length === 0 ? (
          <EmptyState
            icon={CalendarIcon}
            title="No events yet"
            description="Create your first event to get started"
          />
        ) : (
          events.map((event: any) => {
            const isSelected = selectedEventId === event.id
            const attendeeCount = event._count?.attendees ?? 0

            return (
              <Card
                key={event.id}
                onClick={() => onSelectEvent(event.id)}
                className={`p-4 cursor-pointer transition-all hover:shadow-md ${
                  isSelected
                    ? 'border-blue-500 border-2 bg-blue-50'
                    : 'border-slate-200 hover:border-blue-300'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-bold text-slate-800 mb-1">
                      {event.title}
                    </h3>
                    <p className="text-sm text-slate-600 mb-2">
                      {event.description}
                    </p>
                    <div className="flex items-center gap-4 text-sm text-slate-500">
                      <span>
                        📅{' '}
                        {new Date(event.date).toLocaleDateString()}
                      </span>
                      <span>
                        👥 {attendeeCount}/{event.capacity}
                      </span>
                      {attendeeCount >= event.capacity && (
                        <span className="text-orange-600 font-medium">
                          • Full
                        </span>
                      )}
                    </div>
                  </div>

                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) =>
                      handleDelete(event.id, e)
                    }
                    disabled={deleteEvent.isPending}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </Card>
            )
          })
        )}
      </div>
    </div>
  )
}
