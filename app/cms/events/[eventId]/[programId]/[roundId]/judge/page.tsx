import { JudgeScreen } from '@/app/cms/events/[eventId]/[programId]/[roundId]/judge/judge-screen'
import { AppLayout, AppNavbar } from '@/components/app-layout'
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
    <AppNavbar>
      <div className="flex items-center">
        <Link
          href={`/cms/events/${eventId}/${programId}/${roundId}`}
          className="flex"
        >
          <ChevronLeftIcon />
          <span className="ml-1">Back</span>
        </Link>
      </div>
      <div className="text-center">
        <p className="font-medium leading-tight">Semi-Final</p>
        <p className="leading-tight text-muted-foreground">Route 3</p>
      </div>
      <div className="opacity-0">Empty</div>
    </AppNavbar>
  )
}

export default async function JudgePage({
  params,
}: {
  params: Promise<{ eventId: string; programId: string; roundId: string }>
}) {
  const { eventId, programId, roundId } = await params

  return (
    <AppLayout>
      <Navbar eventId={eventId} programId={programId} roundId={roundId} />
      <JudgeScreen />
    </AppLayout>
  )
}
