import ClinicDetail from "./_components/ClinicDetails"
import HeroImage from "./_components/HeroImage"
import { useQuery } from "@tanstack/react-query"
import { useParams, Link } from "react-router-dom"
import { getClinicDetails } from "../../lib/clinicApi"

const ClinicDetails = () => {
  const { id, slug } = useParams();
  const clinicId = id ?? slug ?? "1";
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["clinic-details", clinicId],
    queryFn: () => getClinicDetails(clinicId),
    enabled: Boolean(clinicId),
  });
  const clinic = data?.clinic;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] mt-38 text-lg font-medium text-gray-500">
        Loading clinic details...
      </div>
    );
  }

  if (isError && !clinic) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] mt-38 text-center px-4">
        <h2 className="text-xl font-bold text-red-600 mb-2">Failed to load clinic details</h2>
        <p className="text-sm text-gray-500 mb-4">
          {error instanceof Error ? error.message : "Unable to load clinic details."}
        </p>
        <Link
          to="/see-all-clinic"
          className="px-5 py-2.5 rounded-xl text-white text-sm font-semibold transition-opacity hover:opacity-90"
          style={{ background: "linear-gradient(135deg, #38bdf8, #0ea5e9)" }}
        >
          Browse All Clinics
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 mt-38 px-4">
      <HeroImage images={clinic?.images} />
      <ClinicDetail clinic={clinic} />
    </div>
  );
};

export default ClinicDetails;
