import { ChevronLeftIcon } from 'lucide-react'
import Link from 'next/link'
import { createClient } from '@/utils/supabase/server'
import { QueryData } from '@supabase/supabase-js'

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
    <nav className="flex justify-between items-center px-5 py-3 min-h-16">
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
  const { eventId, programId: _programId, roundId } = await params

  const { data: roundData, error: _error } =
    await queryRoundWithProgram(roundId)
  if (!roundData) {
    return <div>Program not found</div>
  }
  console.log('program', JSON.stringify(roundData, null, 2))
  return (
    <main className="flex flex-col min-h-screen max-w-screen-md mx-auto">
      <Navbar eventId={eventId} />
      <section className="px-5">
        <h1 className="text-3xl font-medium mb-4 mb-4">
          {roundData.competeProgram?.name}
          <br />
          {roundData.name}
        </h1>
      </section>
    </main>
  )
}
