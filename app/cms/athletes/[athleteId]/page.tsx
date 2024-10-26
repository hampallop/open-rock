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
    <main className="flex flex-col min-h-screen max-h-screen max-w-screen-md mx-auto">
      <nav className="flex justify-between items-center px-5 py-3 min-h-16">
        <Link href={'/cms/athletes'} className="flex items-center">
          <ChevronLeftIcon />
          <span className="ml-1">Manage athletes</span>
        </Link>
      </nav>
      <div className="flex flex-col bg-background px-5">
        <h1 className="text-3xl font-medium mb-4 mb-4">{athlete.name}</h1>
      </div>
      <div className="overflow-y-auto px-5 py-2 flex-grow">
        <div className="flex flex-col">
          <p>Created: {format(athlete.createdAt, 'MMM d, yyyy')}</p>
        </div>
      </div>
      <FooterAuth />
    </main>
  )
}
