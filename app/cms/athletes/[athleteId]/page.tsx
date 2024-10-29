import { AppLayout, AppNavbar } from '@/components/app-layout'
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
    <AppLayout>
      <AppNavbar>
        <div className="flex items-center">
          <Link href={'/cms/athletes'} className="flex">
            <ChevronLeftIcon />
            <span className="ml-1">Manage athletes</span>
          </Link>
        </div>
      </AppNavbar>
      <div className="flex flex-col bg-background px-5">
        <h1 className="mb-4 mt-2 text-3xl font-medium">{athlete.name}</h1>
      </div>
      <div className="grow overflow-y-auto px-5 py-2">
        <div className="flex flex-col">
          <p>Created: {format(athlete.createdAt, 'MMM d, yyyy')}</p>
        </div>
      </div>
      <FooterAuth />
    </AppLayout>
  )
}
