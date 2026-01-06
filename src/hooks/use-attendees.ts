import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { AttendeeInput } from '@/lib/validations'

export function useAttendees(eventId?: string) {
  return useQuery({
    queryKey: ['attendees', eventId],
    queryFn: async () => {
      const url = eventId 
        ? `/api/attendees?eventId=${eventId}`
        : '/api/attendees'
      const res = await fetch(url)
      if (!res.ok) throw new Error('Failed to fetch attendees')
      return res.json()
    },
    enabled: !!eventId
  })
}

export function useCreateAttendee() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (data: AttendeeInput) => {
      const res = await fetch('/api/attendees', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })
      if (!res.ok) {
        const error = await res.json()
        throw new Error(error.error || 'Failed to create attendee')
      }
      return res.json()
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['attendees', variables.eventId] })
      queryClient.invalidateQueries({ queryKey: ['events'] })
    }
  })
}

export function useDeleteAttendee() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/attendees/${id}`, {
        method: 'DELETE'
      })
      if (!res.ok) throw new Error('Failed to delete attendee')
      return res.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['attendees'] })
      queryClient.invalidateQueries({ queryKey: ['events'] })
    }
  })
}