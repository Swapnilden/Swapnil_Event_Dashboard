'use client'

import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'

import { eventSchema } from '@/lib/validations'
import { useCreateEvent } from '@/hooks/use-events'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Textarea } from './ui/textarea'
import { Card } from './ui/card'

interface EventFormProps {
  onSuccess: () => void
  onCancel: () => void
}

type EventFormOutput = z.output<typeof eventSchema>

export function EventForm({ onSuccess, onCancel }: EventFormProps) {
  const createEvent = useCreateEvent()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<
    z.input<typeof eventSchema>,
    any,
    z.output<typeof eventSchema>
  >({
    resolver: zodResolver(eventSchema),
  })

  const onSubmit = async (data: EventFormOutput) => {
    const toastId = toast.loading('Creating event…')

    try {
      await createEvent.mutateAsync(data)

      toast.success('Event created successfully', { id: toastId })
      onSuccess()
    } catch {
      toast.error('Failed to create event', { id: toastId })
    }
  }

  return (
    <Card className="p-4 bg-blue-50 border-blue-200">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
        <div>
          <Input
            placeholder="Event Title"
            {...register('title')}
            className="bg-white"
          />
          {errors.title && (
            <p className="text-red-600 text-sm mt-1">
              {errors.title.message}
            </p>
          )}
        </div>

        <div>
          <Input
            type="date"
            {...register('date')}
            className="bg-white"
          />
          {errors.date && (
            <p className="text-red-600 text-sm mt-1">
              {errors.date.message}
            </p>
          )}
        </div>

        <div>
          <Textarea
            placeholder="Description"
            {...register('description')}
            className="bg-white"
            rows={3}
          />
          {errors.description && (
            <p className="text-red-600 text-sm mt-1">
              {errors.description.message}
            </p>
          )}
        </div>

        <div>
          <Input
            type="number"
            placeholder="Capacity"
            {...register('capacity', { valueAsNumber: true })}
            className="bg-white"
          />
          {errors.capacity && (
            <p className="text-red-600 text-sm mt-1">
              {errors.capacity.message}
            </p>
          )}
        </div>

        <div className="flex gap-2">
          <Button
            type="submit"
            disabled={createEvent.isPending}
            className="flex-1"
          >
            {createEvent.isPending && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            Create Event
          </Button>

          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
          >
            Cancel
          </Button>
        </div>
      </form>
    </Card>
  )
}
