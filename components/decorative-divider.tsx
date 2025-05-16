interface DecorativeDividerProps {
  className?: string;
}

export function DecorativeDivider({ className = "" }: DecorativeDividerProps) {
  return (
    <div
      className={`w-full flex items-center justify-center py-8 overflow-hidden ${className}`}
    >
      <div className="w-full max-w-md px-4">
        <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-stone-500 to-transparent rounded-full"></div>
      </div>
    </div>
  );
}
