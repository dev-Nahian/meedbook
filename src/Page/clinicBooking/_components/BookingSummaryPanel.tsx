export default function BookingSummaryPanel({ count }: { count: number }) {
  const total = count * 79;

  return (
    <div className="sticky top-6 self-start">
      <div className="bg-white border rounded-2xl p-4 shadow-sm">
        <p className="text-sm font-semibold mb-3">Price Details</p>

        <div className="flex justify-between text-sm mb-4">
          <span>$79 × {count}</span>
          <span>${total}</span>
        </div>

        <button
          disabled={!count}
          className="w-full py-2.5 rounded-xl text-white text-sm"
          style={{
            background: count ? "linear-gradient(135deg,#38bdf8,#0ea5e9)" : "#e5e7eb"
          }}
        >
          Confirm Booking
        </button>
      </div>
    </div>
  );
}