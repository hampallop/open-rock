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
    <div className="h-20 w-full border flex items-center bg-card px-5 justify-between">
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
