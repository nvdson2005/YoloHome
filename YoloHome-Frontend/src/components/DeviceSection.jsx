import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import DeviceCard from "./DeviceCard";
import Toast from "./Toast";
import { getFan, setFan, getMode, setMode } from "../api";

function DeviceGroup({
  title,
  icon,
  queryKey,
  queryFn,
  mutationFn,
  onLabel,
  offLabel,
  onError,
  onSuccess,
}) {
  const queryClient = useQueryClient();
  const { data, isLoading, isError } = useQuery({
    queryKey: [queryKey],
    queryFn,
    refetchInterval: 1000,
  });

  const mutation = useMutation({
    mutationFn,
    onSuccess: (responseData) => {
      queryClient.setQueryData([queryKey], (old) => ({
        ...old,
        value: String(responseData.value),
      }));
      queryClient.invalidateQueries({ queryKey: [queryKey] });
      const newLabel = String(responseData.value) === "1" ? onLabel : offLabel;
      onSuccess?.(`${title} set to ${newLabel}`);
    },
    onError: (err) => onError?.(err.message || "Failed to update device"),
  });

  const isOn = data?.value === "1";
  const bothDisabled = mutation.isPending || isLoading || isError;

  return (
    <div className="bg-gray-50 rounded-2xl p-6 text-center">
      <p className="font-bold text-gray-700 mb-1">
        {icon} {title}
      </p>
      <p
        className={`text-sm font-semibold mb-4 ${data ? (isOn ? "text-green-600" : "text-gray-400") : "text-gray-300"}`}
      >
        {data ? (isOn ? onLabel : offLabel) : "—"}
      </p>
      <div className="flex gap-3 justify-center">
        <DeviceCard
          label={onLabel}
          disabled={bothDisabled}
          onClick={() => mutation.mutate(true)}
          variant="on"
        />
        <DeviceCard
          label={offLabel}
          disabled={bothDisabled}
          onClick={() => mutation.mutate(false)}
          variant="off"
        />
      </div>
    </div>
  );
}

export default function DeviceSection() {
  const [toast, setToast] = useState({ message: null, type: "error" });

  const showSuccess = (message) => setToast({ message, type: "success" });
  const showError = (message) => setToast({ message, type: "error" });
  const dismissToast = () => setToast((t) => ({ ...t, message: null }));

  return (
    <section className="mb-10">
      <div className="bg-white p-10 rounded-[3rem] shadow-2xl">
        <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center">
          Device Control
        </h2>
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <DeviceGroup
              title="Fan"
              icon="🌀"
              queryKey="quat"
              queryFn={getFan}
              mutationFn={setFan}
              onLabel="ON"
              offLabel="OFF"
              onError={showError}
              onSuccess={showSuccess}
            />
          </div>
          <div className="flex-1">
            <DeviceGroup
              title="Fan Mode"
              icon="⚙️"
              queryKey="mode"
              queryFn={getMode}
              mutationFn={setMode}
              onLabel="Manual"
              offLabel="Auto"
              onError={showError}
              onSuccess={showSuccess}
            />
          </div>
        </div>
      </div>
      <Toast message={toast.message} type={toast.type} onDismiss={dismissToast} />
    </section>
  );
}
