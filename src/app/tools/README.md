# Tools Architecture Guide

This document explains the architecture and file organization for fitness
calculator tools in CompileStrength.

## Overview

The tools directory contains standalone fitness calculators accessible at
`/tools/*`. Each calculator follows a consistent architecture pattern for
maintainability and testability.

## Recommended Architecture Pattern

Based on the **Plate Calculator** implementation, the recommended structure is:

```
src/app/tools/
└── [calculator-name]/
    ├── components/           # Reusable UI components specific to this calculator
    │   ├── index.ts         # Barrel export for clean imports
    │   └── *.tsx            # Individual component files
    ├── config.ts            # Configuration constants and type definitions
    ├── logic.ts             # Pure business logic functions (testable)
    ├── validation.ts        # Zod schemas for input validation
    ├── layout.tsx           # Next.js layout with metadata
    └── page.tsx             # Main page component (orchestrates everything)
```

### Why This Architecture?

1. **Separation of Concerns**: Logic, validation, UI, and configuration are
   clearly separated
2. **Testability**: Pure functions in `logic.ts` are easily testable without
   React
3. **Reusability**: Components can be reused within the calculator
4. **Maintainability**: Clear file structure makes it easy to find and modify
   code
5. **Type Safety**: Centralized types in config, Zod validation for runtime
   safety

## File Breakdown

### `page.tsx` (Orchestration Layer)

**Purpose**: Main React component that orchestrates the calculator

**Responsibilities**:

- Manage component state (`useState` for inputs and results)
- Handle user interactions (button clicks, form changes)
- Call validation and logic functions
- Render UI components
- Display results and error messages

**Example Pattern**:

```tsx
"use client";
import { useState } from "react";
import { toast } from "sonner";
import { Navbar } from "@/components/navbar";
import { ComponentA, ComponentB } from "./components";
import { calculateSomething } from "./logic";
import { inputSchema } from "./validation";

export default function CalculatorPage() {
  const [input, setInput] = useState("");
  const [results, setResults] = useState(null);

  const calculate = () => {
    // 1. Validate input
    const result = inputSchema.safeParse({ input });
    if (!result.success) {
      return toast.error(result.error.issues[0].message);
    }

    // 2. Calculate using pure logic
    const calculationResult = calculateSomething(result.data);
    setResults(calculationResult);
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <Navbar />
      <main className="max-w-3xl mx-auto px-6 py-12">
        {/* Calculator UI */}
      </main>
    </div>
  );
}
```

### `logic.ts` (Business Logic Layer)

**Purpose**: Pure functions containing calculation logic

**Responsibilities**:

- Implement calculator formulas and algorithms
- Export TypeScript interfaces for return types
- Document functions with JSDoc comments
- Handle edge cases and mathematical operations

**Key Principles**:

- **Pure functions only**: No side effects, no React, no state
- **Well-documented**: JSDoc explaining parameters and return values
- **Type-safe**: All inputs/outputs properly typed
- **Testable**: Can be imported and tested in isolation

**Example Pattern**:

```tsx
/**
 * Calculates something based on input parameters.
 *
 * @param input - Description of input parameter
 * @param unit - The unit system to use
 * @returns Calculation result object
 */
export function calculateSomething(
  input: number,
  unit: WeightUnit,
): CalculationResult {
  // Pure calculation logic here
  return {
    result: input * 2,
    unit,
  };
}
```

### `validation.ts` (Input Validation Layer)

**Purpose**: Zod schemas for runtime input validation

**Responsibilities**:

- Define validation rules for all user inputs
- Provide clear error messages for invalid data
- Export schemas for use in page component

**Example Pattern**:

```tsx
import { z } from "zod";

export const calculatorInputSchema = z.object({
  weight: z.coerce
    .number()
    .positive("Weight must be positive")
    .max(1000, "Weight must be less than 1000"),
  reps: z.coerce
    .number()
    .int("Reps must be a whole number")
    .min(1, "Reps must be at least 1")
    .max(20, "Reps must be 20 or less"),
});
```

### `config.ts` (Configuration Layer)

**Purpose**: Constants, configurations, and type definitions

**Responsibilities**:

- Define named constants (avoid magic numbers)
- Type definitions and interfaces
- Configuration objects (e.g., plate sizes, activity levels)
- Color schemes, default values

**Example Pattern**:

```tsx
import type { WeightUnit } from "@/lib/types";

// Named constants
export const PLATE_WEIGHT_TOLERANCE = 0.01;
export const DEFAULT_BAR_WEIGHT_LBS = 45;
export const DEFAULT_BAR_WEIGHT_KG = 20;

// Configuration objects
export const plateConfigs: Record<WeightUnit, PlateConfig[]> = {
  lbs: [
    { weight: 45, color: "bg-red-500" },
    { weight: 25, color: "bg-green-500" },
    // ...
  ],
  kg: [
    { weight: 20, color: "bg-red-500" },
    // ...
  ],
};
```

### `components/` (UI Component Layer)

**Purpose**: Reusable React components specific to this calculator

**Structure**:

```
components/
├── index.ts              # Barrel export
├── calculator-inputs.tsx # Form inputs
├── results-display.tsx   # Results presentation
├── info-section.tsx      # Educational content
└── [other-components].tsx
```

**Example `index.ts`**:

```tsx
export { CalculatorInputs } from "./calculator-inputs";
export { ResultsDisplay } from "./results-display";
export { InfoSection } from "./info-section";
```

**Component Guidelines**:

- Keep components focused and single-purpose
- Accept props from parent page component
- Use TypeScript interfaces for props
- Follow Shadcn/ui patterns for styling

### `layout.tsx` (Metadata Layer)

**Purpose**: Next.js layout for SEO and page metadata

**Responsibilities**:

- Set page title and description
- Define OpenGraph metadata
- Configure Twitter cards
- Set canonical URLs

**Example Pattern**:

```tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Calculator Name | CompileStrength",
  description: "Brief description of what the calculator does",
  openGraph: {
    title: "Calculator Name",
    description: "Brief description",
    type: "website",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
```

## Current State Analysis

### ✅ Plate Calculator (Best Practice)

**Status**: Fully architected with the recommended pattern

**Structure**:

- ✅ Separated logic (`logic.ts`)
- ✅ Zod validation (`validation.ts`)
- ✅ Configuration constants (`config.ts`)
- ✅ Component organization (`components/`)
- ✅ Clean page orchestration

### ⚠️ Other Calculators (Need Refactoring)

The following calculators have all logic embedded in `page.tsx` and would
benefit from refactoring:

1. **Body Fat Calculator** (`body-fat-calculator/`)

   - All logic in page.tsx (lines 24-109)
   - No separation of concerns
   - Hard to test calculation logic

2. **TDEE Calculator** (`tdee-calculator/`)

   - All logic in page.tsx
   - Some constants defined (good!)
   - Needs logic extraction

3. **FFMI Calculator** (`ffmi-calculator/`)

   - All logic in page.tsx
   - Needs full architecture refactor

4. **One Rep Max Calculator** (`one-rep-max-calculator/`)
   - All logic in page.tsx
   - Needs full architecture refactor

## Migration Guide

To refactor an existing calculator to follow the recommended pattern:

### Step 1: Extract Configuration

Create `config.ts` and move all constants:

```tsx
// Before (in page.tsx)
const activityLevel = 1.55;

// After (in config.ts)
export const DEFAULT_ACTIVITY_LEVEL = 1.55;
```

### Step 2: Extract Validation

Create `validation.ts` with Zod schemas:

```tsx
import { z } from "zod";

export const calculatorInputSchema = z.object({
  // Define validation rules
});
```

### Step 3: Extract Logic

Create `logic.ts` and move calculation functions:

```tsx
/**
 * Document the function
 */
export function calculateResult(input: number): Result {
  // Pure calculation logic
}
```

### Step 4: Create Components

Create `components/` directory and extract reusable UI:

```tsx
// components/calculator-inputs.tsx
export function CalculatorInputs({ onCalculate }: Props) {
  // Input form component
}
```

### Step 5: Refactor Page

Update `page.tsx` to orchestrate everything:

```tsx
import { calculateResult } from "./logic";
import { inputSchema } from "./validation";
import { CalculatorInputs } from "./components";

export default function Page() {
  // Orchestrate components and logic
}
```

## Testing Strategy

### Unit Tests for Logic

Test pure functions in `logic.ts`:

```tsx
// logic.test.ts
import { describe, expect, it } from "vitest";
import { calculateResult } from "./logic";

describe("calculateResult", () => {
  it("should calculate correctly", () => {
    expect(calculateResult(100)).toBe(200);
  });
});
```

### Validation Tests

Test Zod schemas:

```tsx
// validation.test.ts
import { calculatorInputSchema } from "./validation";

describe("calculatorInputSchema", () => {
  it("should accept valid input", () => {
    expect(calculatorInputSchema.safeParse({ weight: 100 }).success).toBe(true);
  });

  it("should reject negative values", () => {
    expect(calculatorInputSchema.safeParse({ weight: -1 }).success).toBe(false);
  });
});
```

## Common Patterns

### Unit Toggle Pattern

All calculators should support unit switching:

```tsx
import type { WeightUnit } from "@/lib/types";

const [unit, setUnit] = useState<WeightUnit>("imperial");

const handleUnitChange = (newUnit: WeightUnit) => {
  setUnit(newUnit);
  // Reset dependent values
  setResults(null);
};
```

### Toast Error Pattern

Use Sonner for non-blocking error messages:

```tsx
import { toast } from "sonner";

if (!result.success) {
  return toast.error(result.error.issues[0].message);
}
```

### Results Display Pattern

Show/hide results conditionally:

```tsx
{
  results && (
    <div className="mt-8 pt-8 border-t border-zinc-800">
      <h2 className="text-2xl font-bold mb-4">Results</h2>
      {/* Display results */}
    </div>
  );
}
```

## Design Guidelines

All calculators should follow these UI patterns:

1. **Layout**: Use shared `<Navbar />` component
2. **Container**: `max-w-3xl mx-auto px-6 py-12`
3. **Back Link**: Link to `/tools` at the top
4. **Input Card**: `border border-zinc-800 p-8 rounded-xl bg-zinc-900/50`
5. **Results Section**: Separate with border-t, display conditionally
6. **Info Section**: Educational content at the bottom

## Next Steps

To align all calculators with the recommended architecture:

1. Create issues for refactoring each calculator
2. Extract logic and validation for testability
3. Write unit tests for all calculation functions
4. Document formulas in each calculator's logic file
5. Ensure consistent UI/UX across all calculators

## Resources

- **Reference Implementation**: `src/app/tools/plate-calculator/`
- **Style Guide**: `docs/STYLE_GUIDE.md`
- **Main Documentation**: `CLAUDE.md`
- **Shadcn/ui Components**: `src/components/ui/`
