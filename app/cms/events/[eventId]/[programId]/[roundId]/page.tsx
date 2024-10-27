import { ChevronLeftIcon } from 'lucide-react'
import Link from 'next/link'
import { createClient } from '@/utils/supabase/server'
import { QueryData } from '@supabase/supabase-js'
import { Button } from '@/components/ui/button'

async function queryRoundWithProgram(roundId: string) {
  const supabase = await createClient()
  const response = await supabase
    .from('competeRounds')
    .select('*, competeProgram:competePrograms(*)')
    .eq('id', roundId)
    .single()

  return response
}
export type RoundWithProgram = QueryData<
  ReturnType<typeof queryRoundWithProgram>
>

function Navbar({ eventId }: { eventId: string }) {
  return (
    <nav className="flex min-h-16 items-center justify-between px-5 py-3">
      <Link href={`/cms/events/${eventId}`} className="flex items-center">
        <ChevronLeftIcon />
        <span className="ml-1">Back</span>
      </Link>
    </nav>
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
  if (!roundData) {
    return <div>Program not found</div>
  }
  console.log('program', JSON.stringify(roundData, null, 2))
  return (
    <main className="mx-auto flex min-h-screen max-w-screen-md flex-col">
      <Navbar eventId={eventId} />
      <section className="flex grow flex-col px-5">
        <h1 className="mb-4 text-3xl font-medium">
          {roundData.competeProgram?.name}
          <br />
          {roundData.name}
        </h1>
        <Button asChild className="mt-10">
          <Link href={`/cms/events/${eventId}/${programId}/${roundId}/judge`}>
            Judge
          </Link>
        </Button>
      </section>
    </main>
  )
}
