export function getSpokenText(step: { tutorText?: string; ttsText?: string }): string | undefined {
  const spoken = step.ttsText?.trim();
  return spoken ? spoken : step.tutorText;
}
