import { FooterAuth } from '@/components/footer-auth'
import { createClient } from '@/utils/supabase/server'
import { format } from 'date-fns'
import { ChevronLeftIcon } from 'lucide-react'
import Link from 'next/link'

export default async function AthleteViewPage({
  params,
}: {
  params: Promise<{ athleteId: string }>
}) {
  const { athleteId } = await params
  const supabase = await createClient()
  const { data: athlete } = await supabase
    .from('athletes')
    .select()
    .eq('id', athleteId)
    .single()

  if (!athlete) {
    return <div>No athletes found</div>
  }

  return (
    <main className="mx-auto flex max-h-screen min-h-screen max-w-screen-md flex-col">
      <nav className="flex min-h-16 items-center justify-between px-5 py-3">
        <Link href={'/cms/athletes'} className="flex items-center">
          <ChevronLeftIcon />
          <span className="ml-1">Manage athletes</span>
        </Link>
      </nav>
      <div className="flex flex-col bg-background px-5">
        <h1 className="mb-4 text-3xl font-medium">{athlete.name}</h1>
      </div>
      <div className="flex-grow overflow-y-auto px-5 py-2">
        <div className="flex flex-col">
          <p>Created: {format(athlete.createdAt, 'MMM d, yyyy')}</p>
        </div>
      </div>
      <FooterAuth />
    </main>
  )
}
