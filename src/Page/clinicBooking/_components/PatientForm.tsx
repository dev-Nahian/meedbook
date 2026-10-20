export interface PatientFormData {
  fullName: string;
  email: string;
  phone?: string;
  birthDate?: string;
  language?: string;
}

export interface PatientFormProps {
  form: PatientFormData;
  setForm: (form: PatientFormData) => void;
  errors?: Partial<Record<keyof PatientFormData, string>>;
}

export default function PatientForm({ form, setForm, errors }: PatientFormProps) {
  return (
    <div>
      <h2 className="text-base font-bold mb-4">Patient Details</h2>

      <input
        placeholder="Full Name"
        value={form.fullName}
        onChange={(e) => setForm({ ...form, fullName: e.target.value })}
        className={`input ${errors?.fullName ? "border-red-500" : ""}`}
      />
      {errors?.fullName && <p className="text-red-500 text-xs">{errors.fullName}</p>}

      <input
        placeholder="Email"
        value={form.email}
        onChange={(e) => setForm({ ...form, email: e.target.value })}
        className={`input ${errors?.email ? "border-red-500" : ""}`}
      />
      {errors?.email && <p className="text-red-500 text-xs">{errors.email}</p>}
    </div>
  );
}