import { Link } from "react-router-dom";

function BookingPanel({
  clinicId,
  clinicName,
  price = "74",
}: {
  clinicId?: number;
  clinicName?: string;
  price?: string;
}) {
  const displayPrice = price.startsWith("$") ? price : `$${price}`;
  const bookingParams = new URLSearchParams();

  if (clinicId) bookingParams.set("clinic", String(clinicId));
  if (clinicName) bookingParams.set("clinicName", clinicName);
  if (price) bookingParams.set("price", price);

  return (
    <div className="sticky top-6 self-start bg-white rounded-2xl border border-gray-100 shadow-md p-5 flex flex-col gap-4">
      <div className="flex items-baseline gap-1">
        <span className="text-3xl font-bold text-gray-900">{displayPrice}</span>
        <span className="text-sm text-gray-400 font-normal">/ Per treatment</span>
      </div>

      <Link
      to={`/booking-form?${bookingParams.toString()}`}
        className="w-full py-3 rounded-xl text-white text-sm font-semibold transition-opacity hover:opacity-90 text-center"
        style={{ background: "linear-gradient(135deg, #38bdf8, #0ea5e9)" }}
      >
        Book Now
      </Link>
    </div>
  );
}

export default BookingPanel;
