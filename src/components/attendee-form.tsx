'use client'

import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'

import { attendeeSchema } from '@/lib/validations'
import { useCreateAttendee } from '@/hooks/use-attendees'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Card } from './ui/card'

interface AttendeeFormProps {
  eventId: string
  onSuccess: () => void
  onCancel: () => void
}

/** form-only schema (eventId injected manually) */
const attendeeFormSchema = attendeeSchema.omit({ eventId: true })

type AttendeeFormInput = z.input<typeof attendeeFormSchema>
type AttendeeFormOutput = z.output<typeof attendeeFormSchema>

export function AttendeeForm({
  eventId,
  onSuccess,
  onCancel,
}: AttendeeFormProps) {
  const createAttendee = useCreateAttendee()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AttendeeFormInput, any, AttendeeFormOutput>({
    resolver: zodResolver(attendeeFormSchema),
  })

  const onSubmit = async (data: AttendeeFormOutput) => {
    const toastId = toast.loading('Registering attendee…')

    try {
      await createAttendee.mutateAsync({
        ...data,
        eventId,
      })

      toast.success('Attendee registered successfully', { id: toastId })
      onSuccess()
    } catch (error: any) {
      toast.error(
        error?.message ?? 'Failed to register attendee',
        { id: toastId }
      )
    }
  }

  return (
    <Card className="p-4 bg-green-50 border-green-200">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
        <div>
          <Input
            placeholder="Attendee Name"
            {...register('name')}
            className="bg-white"
          />
          {errors.name && (
            <p className="text-red-600 text-sm mt-1">
              {errors.name.message}
            </p>
          )}
        </div>

        <div>
          <Input
            type="email"
            placeholder="Email Address"
            {...register('email')}
            className="bg-white"
          />
          {errors.email && (
            <p className="text-red-600 text-sm mt-1">
              {errors.email.message}
            </p>
          )}
        </div>

        <div className="flex gap-2">
          <Button
            type="submit"
            disabled={createAttendee.isPending}
            className="flex-1"
          >
            {createAttendee.isPending && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            Register
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
