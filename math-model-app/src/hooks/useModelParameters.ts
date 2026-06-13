import { useCallback, useEffect, useState } from "react";
import type { MathModel, ParamValues } from "@/types/model";

/**
 * Holds the live parameter values for the selected model in React state.
 * Resets automatically when the model changes, and exposes setOne / reset.
 */
export function useModelParameters(model: MathModel) {
  const [values, setValues] = useState<ParamValues>(() => ({ ...model.defaultValues }));

  // When the selected model changes, load that model's defaults.
  useEffect(() => {
    setValues({ ...model.defaultValues });
  }, [model.id, model.defaultValues]);

  const setOne = useCallback((id: string, value: number) => {
    setValues((prev) => ({ ...prev, [id]: value }));
  }, []);

  const reset = useCallback(() => {
    setValues({ ...model.defaultValues });
  }, [model.defaultValues]);

  const isDefault = Object.keys(model.defaultValues).every(
    (k) => values[k] === model.defaultValues[k],
  );

  return { values, setOne, reset, isDefault };
}
