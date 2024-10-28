import { AthletesScreen } from '@/app/cms/athletes/screen'
import { AppLayout } from '@/components/app-layout'
import { FooterAuth } from '@/components/footer-auth'
import { createClient } from '@/utils/supabase/client'

export default async function AthletesPage() {
  const supabase = await createClient()
  const { data: athletes } = await supabase.from('athletes').select()

  if (!athletes) {
    return <div>No athletes found</div>
  }

  return (
    <AppLayout>
      <AthletesScreen athletes={athletes} />
      <FooterAuth />
    </AppLayout>
  )
}
