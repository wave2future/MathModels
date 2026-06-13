import type { MathModel, ModelInput } from "@/types/model";

/**
 * Build a complete {@link MathModel} from a leaner {@link ModelInput}:
 *  - `defaultValues` is derived from each parameter's defaultValue (unless given)
 *  - `parameterExplanations` is derived from each parameter's `explanation`
 *
 * This keeps individual model definitions DRY and avoids drift between a
 * parameter's default and the model's defaultValues map.
 */
export function defineModel(input: ModelInput): MathModel {
  const defaultValues =
    input.defaultValues ??
    Object.fromEntries(input.parameters.map((p) => [p.id, p.defaultValue]));

  const parameterExplanations =
    input.parameterExplanations ??
    Object.fromEntries(
      input.parameters
        .filter((p) => p.explanation)
        .map((p) => [p.id, p.explanation as string]),
    );

  return { ...input, defaultValues, parameterExplanations };
}
