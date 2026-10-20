import ClinicOwnerPortal from "../userAccount/ClinicOwnerPortal";

export default function ClinicDashboard() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 mt-32 min-h-screen">
      {/* Google Font */}
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap');`}</style>
      <ClinicOwnerPortal />
    </div>
  );
}
