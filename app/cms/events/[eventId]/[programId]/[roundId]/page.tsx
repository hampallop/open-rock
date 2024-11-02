import { ChevronLeftIcon } from 'lucide-react'
import Link from 'next/link'
import { createClient } from '@/utils/supabase/server'
import { QueryData } from '@supabase/supabase-js'
import { Button } from '@/components/ui/button'
import { AppLayout, AppNavbar } from '@/components/app-layout'
import { AthleteList } from '@/app/cms/events/[eventId]/[programId]/[roundId]/list'

async function queryAthletes() {
  const supabase = await createClient()
  const response = await supabase.from('athletes').select('*')

  return response
}

async function queryRoundWithProgram(roundId: string) {
  const supabase = await createClient()
  const response = await supabase
    .from('competeRounds')
    .select(
      '*, competeProgram:competePrograms(*), competeRoundAthletes(*, athlete:athletes(*))',
    )
    .eq('id', roundId)
    .single()

  return response
}
export type RoundWithProgram = QueryData<
  ReturnType<typeof queryRoundWithProgram>
>

function Navbar({ eventId }: { eventId: string }) {
  return (
    <AppNavbar>
      <div className="flex items-center">
        <Link href={`/cms/events/${eventId}`} className="flex">
          <ChevronLeftIcon />
          <span className="ml-1">Back</span>
        </Link>
      </div>
    </AppNavbar>
  )
}

export default async function EventEditPage({
  params,
}: {
  params: Promise<{ eventId: string; programId: string; roundId: string }>
}) {
  const { eventId, programId, roundId } = await params

  const { data: roundData, error: _error } =
    await queryRoundWithProgram(roundId)
  console.log('roundData', roundData)

  const { data: athletes, error: _athletesError } = await queryAthletes()

  if (!roundData) {
    return <div>Program not found</div>
  }

  if (!athletes) {
    return <div>Athletes not found</div>
  }

  return (
    <AppLayout>
      <Navbar eventId={eventId} />
      <section className="flex grow flex-col px-5">
        <h1 className="mb-4 mt-2 text-3xl font-medium">
          {roundData.competeProgram?.name}
          <br />
          {roundData.name}
        </h1>
        <AthleteList
          athletes={athletes}
          registeredAthletes={roundData.competeRoundAthletes}
          roundId={roundId}
        />
        <Button asChild className="mt-10">
          <Link href={`/cms/events/${eventId}/${programId}/${roundId}/judge`}>
            Judge
          </Link>
        </Button>
      </section>
    </AppLayout>
  )
}
