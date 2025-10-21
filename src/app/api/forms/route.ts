import { NextRequest, NextResponse } from "next/server";

import {
  getFormSchema,
  getFormStepSchema,
  updateFormStepDataSchema,
  validateStepSchema,
} from "./form.schema";
import {
  getForm,
  getFormStep,
  updateFormStepData,
  validateStep,
} from "./form.service";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const action = searchParams.get("action");

  try {
    switch (action) {
      case "form": {
        const structureCodeDna = searchParams.get("structureCodeDna");
        const formName = searchParams.get("formName");
        const formVersion = searchParams.get("formVersion");

        if (!structureCodeDna || !formName || !formVersion) {
          return NextResponse.json(
            { error: "Missing required parameters" },
            { status: 400 }
          );
        }

        const validatedData = getFormSchema.parse({
          structureCodeDna,
          formName,
          formVersion: parseInt(formVersion),
        });

        const form = await getForm(validatedData);
        return NextResponse.json(form);
      }

      case "step": {
        const structureCodeDna = searchParams.get("structureCodeDna");
        const formName = searchParams.get("formName");
        const formVersion = searchParams.get("formVersion");
        const stepLabel = searchParams.get("stepLabel");

        if (!structureCodeDna || !formName || !formVersion || !stepLabel) {
          return NextResponse.json(
            { error: "Missing required parameters" },
            { status: 400 }
          );
        }

        const validatedData = getFormStepSchema.parse({
          structureCodeDna,
          formName,
          formVersion: parseInt(formVersion),
          stepLabel,
        });

        const formStep = await getFormStep(validatedData);
        return NextResponse.json(formStep);
      }

      default:
        return NextResponse.json(
          { error: "Invalid action" },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error("Error in GET /api/forms:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const action = searchParams.get("action");

  try {
    switch (action) {
      case "validate-step": {
        const body = await request.json();
        const validatedData = validateStepSchema.parse(body);

        const formStep = await validateStep(validatedData);
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

export async function PUT(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const action = searchParams.get("action");

  try {
    switch (action) {
      case "update-step": {
        const body = await request.json();
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
    console.error("Error in PUT /api/forms:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}