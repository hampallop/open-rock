import { EventDetails } from '@/components/event-details'

export default function EventPage({ params }: { params: { eventId: string } }) {
  return <EventDetails />
}
