import { createClient } from '@/utils/supabase/client'

export const updateRouteAmountAction =
  ({ roundId, inputName }: { roundId: string; inputName: string }) =>
  async (formData: FormData) => {
    const routeAmount = Number(formData.get(inputName)?.toString())

    const supabase = await createClient()

    await supabase
      .from('competeRounds')
      .update({ routeAmount })
      .eq('id', roundId)

    return routeAmount
  }
