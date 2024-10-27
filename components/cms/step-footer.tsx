import { Button } from '@/components/ui/button'

interface StepFooterProps {
  currentStep: number
  totalSteps: number
  onPrevious: () => void
  onNext: () => void
  onSubmit?: () => void
  isNextValid?: boolean
}

export function StepFooter({
  currentStep,
  totalSteps,
  onPrevious,
  onNext,
  onSubmit,
  isNextValid = false,
}: StepFooterProps) {
  const isFirstStep = currentStep === 1
  const isLastStep = currentStep === totalSteps

  return (
    <div className="flex h-20 w-full items-center justify-between border bg-card px-5">
      {!isFirstStep && (
        <Button variant="ghost" className="underline" onClick={onPrevious}>
          Previous
        </Button>
      )}
      {isFirstStep && <div />}
      {isLastStep ? (
        <Button onClick={onSubmit}>Save</Button>
      ) : (
        <Button onClick={onNext} disabled={!isNextValid}>
          Next
        </Button>
      )}
    </div>
  )
}
