const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

export interface InteractiveCalendarProps {
  year: number;
  month: number;
  selectedDays: number[];
  disabledDays?: number[];
  onToggleDay: (day: number) => void;
  onPrevMonth?: () => void;
  onNextMonth?: () => void;
}

export default function InteractiveCalendar({
  year,
  month,
  selectedDays,
  disabledDays = [],
  onToggleDay,
  onPrevMonth,
  onNextMonth,
}: InteractiveCalendarProps) {
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const cells: (number | null)[] = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  return (
    <div className="w-full max-w-xs">
      <div className="flex items-center justify-between mb-3 px-1">
        {onPrevMonth && (
          <button
            type="button"
            onClick={onPrevMonth}
            aria-label="Previous month"
            className="p-1 rounded-lg border border-gray-200 hover:bg-gray-50 text-gray-500 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        )}
        <p className="text-xs font-semibold text-gray-700 text-center flex-1">
          {MONTH_NAMES[month]} {year}
        </p>
        {onNextMonth && (
          <button
            type="button"
            onClick={onNextMonth}
            aria-label="Next month"
            className="p-1 rounded-lg border border-gray-200 hover:bg-gray-50 text-gray-500 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        )}
      </div>

      <div className="grid grid-cols-7 mb-1">
        {DAY_NAMES.map((d) => (
          <div key={d} className="text-center text-[11px] text-gray-400">
            {d}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-y-1">
        {cells.map((day, idx) => {
          if (!day) return <div key={`empty-${idx}`} />;
          const isSelected = selectedDays.includes(day);
          const isDisabled = disabledDays.includes(day);

          return (
            <button
              key={`day-${day}`}
              type="button"
              disabled={isDisabled}
              onClick={() => onToggleDay(day)}
              className={`h-8 w-8 mx-auto rounded-full text-xs font-medium transition-all ${
                isDisabled
                  ? "text-gray-300 cursor-not-allowed line-through"
                  : isSelected
                  ? "text-white shadow-xs"
                  : "text-gray-700 hover:bg-sky-50 hover:text-sky-600"
              }`}
              style={
                isSelected
                  ? { background: "linear-gradient(135deg,#38bdf8,#0ea5e9)" }
                  : {}
              }
            >
              {day}
            </button>
          );
        })}
      </div>
    </div>
  );
}
