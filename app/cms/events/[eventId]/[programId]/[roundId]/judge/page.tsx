import { JudgeScreen } from '@/app/cms/events/[eventId]/[programId]/[roundId]/judge/judge-screen'
import { ChevronLeftIcon } from 'lucide-react'
import Link from 'next/link'

function Navbar({
  eventId,
  programId,
  roundId,
}: {
  eventId: string
  programId: string
  roundId: string
}) {
  return (
    <nav className="flex min-h-16 items-center justify-between px-5 py-3">
      <Link
        href={`/cms/events/${eventId}/${programId}/${roundId}`}
        className="flex items-center"
      >
        <ChevronLeftIcon />
        <span className="ml-1">Back</span>
      </Link>
    </nav>
  )
}

export default async function JudgePage({
  params,
}: {
  params: Promise<{ eventId: string; programId: string; roundId: string }>
}) {
  const { eventId, programId, roundId } = await params

  return (
    <main className="mx-auto flex min-h-screen max-w-screen-md flex-col">
      <Navbar eventId={eventId} programId={programId} roundId={roundId} />
      <JudgeScreen />
    </main>
  )
}
