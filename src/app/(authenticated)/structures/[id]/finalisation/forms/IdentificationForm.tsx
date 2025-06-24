"use client";

import FormWrapper from "@/app/components/forms/FormWrapper";
import { identificationSchema } from "./validation/identification-schema";

export default function IdentificationForm() {
  return (
    <FormWrapper
      schema={identificationSchema}
      onSubmit={(values) => console.log(values)}
    >
      huhu
    </FormWrapper>
  );
}
