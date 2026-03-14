export function Fraction({ num, den }: { num: number; den: number }) {
  return (
    <span className="fraction">
      <span className="numerator">{num}</span>
      <span className="denominator">{den}</span>
    </span>
  );
}

export function MixedNumber({ whole, num, den }: { whole: number; num: number; den: number }) {
  return (
    <span className="inline-flex items-center gap-1">
      <span className="text-[inherit]">{whole}</span>
      <Fraction num={num} den={den} />
    </span>
  );
}

export function BigFraction({ whole, num, den }: { whole?: number; num: number; den: number }) {
  return (
    <div className="number-appear flex items-center justify-center gap-4 text-white">
      {whole !== undefined && (
        <span className="text-[10rem] font-bold leading-none">{whole}</span>
      )}
      <span className="flex flex-col items-center text-6xl font-bold leading-tight">
        <span className="border-b-4 border-white px-3 pb-1">{num}</span>
        <span className="px-3 pt-1">{den}</span>
      </span>
    </div>
  );
}
