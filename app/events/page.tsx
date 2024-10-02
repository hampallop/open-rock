import { createClient } from '@/utils/supabase/server'

export default async function Page() {
  const supabase = createClient()
  const { data: events, error } = await supabase.from('events').select()
  console.log(events)
  console.error(error)

  return <pre>{JSON.stringify(events, null, 2)}</pre>
}
