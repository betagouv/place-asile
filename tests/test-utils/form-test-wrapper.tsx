import { ReactNode } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { vi } from "vitest";

import { FetchStateProvider } from "@/app/context/FetchStateContext";
import { FetchState } from "@/types/fetch-state.type";
import { Structure, StructureWithLatLng } from "@/types/structure.type";

import { createStructure } from "./structure.factory";

// Mock next/navigation
export const mockRouter = {
  push: vi.fn(),
  back: vi.fn(),
  forward: vi.fn(),
  refresh: vi.fn(),
  replace: vi.fn(),
  prefetch: vi.fn(),
};

vi.mock("next/navigation", () => ({
  useRouter: () => mockRouter,
  usePathname: () => "/structures/1/finalisation/01-identification",
  useSearchParams: () => new URLSearchParams(),
}));

// Mock StructureClientContext
export const mockStructureContext = {
  structure: null as StructureWithLatLng | null,
  setStructure: vi.fn(),
};

vi.mock(
  "@/app/(authenticated)/structures/[id]/_context/StructureClientContext",
  () => ({
    useStructureContext: () => mockStructureContext,
  })
);

// Mock useStructures hook
export const mockUpdateAndRefreshStructure = vi.fn();

vi.mock("@/app/hooks/useStructures", () => ({
  useStructures: () => ({
    updateAndRefreshStructure: mockUpdateAndRefreshStructure,
  }),
}));

/**
 * Wrapper component for testing forms with React Hook Form
 */
export function FormTestWrapper<T extends Record<string, unknown>>({
  children,
  defaultValues,
  structure,
}: FormTestWrapperProps<T>) {
  const methods = useForm<T>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    defaultValues: defaultValues as any,
    mode: "onBlur",
  });

  // Update mock structure context
  if (structure) {
    mockStructureContext.structure = structure;
  }

  return (
    <FetchStateProvider>
      <FormProvider {...methods}>{children}</FormProvider>
    </FetchStateProvider>
  );
}

/**
 * Helper to setup structure context for tests
 */
export function setupStructureContext(structure?: Partial<Structure>) {
  const fullStructure = {
    ...createStructure({
      finessCode: structure?.finessCode ?? undefined,
      type: structure?.type,
      publicType: structure?.public,
      state: structure?.state,
      cpom: structure?.cpom,
    }),
    ...structure,
  } as StructureWithLatLng;
  mockStructureContext.structure = fullStructure;
  return fullStructure;
}

/**
 * Helper to setup fetch state context for tests
 */
export function setupFetchState(key: string, state: FetchState) {
  // This will be handled by FetchStateProvider in the wrapper
  return { key, state };
}

/**
 * Helper to reset all mocks
 */
export function resetAllMocks() {
  vi.clearAllMocks();
  mockRouter.push.mockClear();
  mockUpdateAndRefreshStructure.mockClear();
  mockStructureContext.setStructure.mockClear();
  mockStructureContext.structure = null;
}

/**
 * Helper to wait for auto-save debounce
 */
export async function waitForAutoSave(delay = 600) {
  await new Promise((resolve) => setTimeout(resolve, delay));
}

/**
 * Helper to assert validation errors
 */
export function expectFieldError(
  container: HTMLElement,
  fieldName: string,
  errorMessage?: string
) {
  const field = container.querySelector(`[name="${fieldName}"]`);
  expect(field).toBeInTheDocument();

  if (errorMessage) {
    const error = container.querySelector(`[id*="${fieldName}"]`);
    expect(error).toHaveTextContent(errorMessage);
  }
}

type FormTestWrapperProps<T> = {
  children: ReactNode;
  defaultValues?: Partial<T>;
  structure?: StructureWithLatLng;
};
