import { AthletesScreen } from '@/app/cms/athletes/screen'
import { FooterAuth } from '@/components/footer-auth'
import { createClient } from '@/utils/supabase/client'

export default async function AthletesPage() {
  const supabase = await createClient()
  const { data: athletes } = await supabase.from('athletes').select()

  if (!athletes) {
    return <div>No athletes found</div>
  }

  return (
    <main className="mx-auto flex max-h-screen min-h-screen max-w-screen-md flex-col">
      <AthletesScreen athletes={athletes} />
      <FooterAuth />
    </main>
  )
}
