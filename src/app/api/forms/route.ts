import { NextRequest, NextResponse } from "next/server";

import {
  getFormStepSchema,
  updateFormStepDataSchema,
  validateStepSchema,
} from "./form.schema";
import {
  getFormStep,
  updateFormStepData,
  validateStep,
} from "./form.service";

export async function GET() {
  return NextResponse.json(
    { error: "Use POST method for forms API" },
    { status: 405 }
  );
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action } = body;

    switch (action) {
      case "validate-step": {
        const validatedData = validateStepSchema.parse(body);
        const formStep = await validateStep(validatedData);
        return NextResponse.json({ success: true, formStep });
      }

      case "get-step": {
        const validatedData = getFormStepSchema.parse(body);
        const formStep = await getFormStep(validatedData);
        return NextResponse.json({ success: true, formStep });
      }

      case "get-forms": {
        // TODO: Implémenter getFormsByStructure
        return NextResponse.json({ success: true, forms: [] });
      }

      case "update-step": {
        const validatedData = updateFormStepDataSchema.parse(body);
        const formStep = await updateFormStepData(validatedData);
        return NextResponse.json({ success: true, formStep });
      }

      default:
        return NextResponse.json(
          { error: "Invalid action" },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error("Error in POST /api/forms:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT() {
  return NextResponse.json(
    { error: "Use POST method for forms API" },
    { status: 405 }
  );
}