export interface HomeClinicFormData {
  country: string;
  clinicName: string;
  consultantName: string;
}

export interface HomeClinicFormProps {
  form?: HomeClinicFormData;
  setForm?: (form: HomeClinicFormData) => void;
  errors?: Partial<Record<keyof HomeClinicFormData, string>>;
}

export default function HomeClinicForm({ form, setForm, errors }: HomeClinicFormProps) {
  return (
    <div>
      <h2 className="text-base font-bold mb-5">Home Clinic Details</h2>

      <div className="flex flex-col gap-4">
        {/* Country */}
        <input
          placeholder="Country"
          value={form?.country ?? ""}
          onChange={(e) =>
            setForm && form && setForm({ ...form, country: e.target.value })
          }
          className={`input ${errors?.country ? "border-red-500" : ""}`}
        />
        {errors?.country && (
          <p className="text-xs text-red-500">{errors.country}</p>
        )}

        {/* Clinic Name */}
        <input
          placeholder="Clinic Name"
          value={form?.clinicName ?? ""}
          onChange={(e) =>
            setForm && form && setForm({ ...form, clinicName: e.target.value })
          }
          className={`input ${errors?.clinicName ? "border-red-500" : ""}`}
        />
        {errors?.clinicName && (
          <p className="text-xs text-red-500">{errors.clinicName}</p>
        )}

        {/* Consultant Name */}
        <input
          placeholder="Consultant Name"
          value={form?.consultantName ?? ""}
          onChange={(e) =>
            setForm && form && setForm({ ...form, consultantName: e.target.value })
          }
          className={`input ${errors?.consultantName ? "border-red-500" : ""}`}
        />
        {errors?.consultantName && (
          <p className="text-xs text-red-500">{errors.consultantName}</p>
        )}
      </div>
    </div>
  );
}