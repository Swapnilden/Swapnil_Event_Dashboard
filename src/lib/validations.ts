import { z } from 'zod'

export const eventSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  date: z.string().min(1, 'Date is required'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  capacity: z.coerce.number().int().min(1, 'Capacity must be at least 1'),
})

export const attendeeSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Valid email required'),
  eventId: z.string().cuid('Invalid event ID'),
})

export type EventInput = z.infer<typeof eventSchema>
export type AttendeeInput = z.infer<typeof attendeeSchema>

