/* eslint-disable react/no-children-prop */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useFieldValidator } from "@/app/hooks/useFieldValidator";
import { useLocalStorage } from "@/app/hooks/useLocalStorage";
import Input from "@codegouvfr/react-dsfr/Input";
import {
  DeepKeys,
  FormValidateOrFn,
  ReactFormExtendedApi,
  useStore,
} from "@tanstack/react-form";
import { z, ZodObject, ZodTypeAny } from "zod";

type FormSchema<T extends ZodTypeAny> = z.infer<T>;

type InputWithValidationProps<T extends ZodObject<any>> = {
  name: DeepKeys<FormSchema<T>>;
  type: string;
  label: string;
  form: ReactFormExtendedApi<
    z.infer<T>,
    FormValidateOrFn<z.infer<T>> | undefined,
    FormValidateOrFn<z.infer<T>> | undefined,
    any,
    any,
    any,
    any,
    any,
    any,
    any
  >;
  schema: T;
  localstorageKey?: string | null;
};

const InputWithValidation = <T extends ZodObject<any>>({
  name,
  type,
  label,
  form,
  schema,
  localstorageKey = null,
}: InputWithValidationProps<T>) => {
  const { validateField } = useFieldValidator(
    schema as unknown as ZodObject<any>
  );
  const formState = useStore(form.store, (state) => state.values);
  const [, updateLocalStorageValues] = useLocalStorage(localstorageKey, {});

  return (
    <form.Field
      name={name}
      validators={{
        onChange: (e: { value: unknown }) => validateField(name, e.value),
        onBlur: (e: { value: unknown }) => validateField(name, e.value),
      }}
      children={(field: any) => (
        <Input
          nativeInputProps={{
            name,
            type,
            required: true,
            value: formState[name],
            onChange: (e) => {
              if (localstorageKey) {
                updateLocalStorageValues({
                  ...formState,
                  [name]: e.target.value,
                });
              }
              field.handleChange(e.target.value);
            },
          }}
          label={label}
          state={field.state.meta.errors?.length > 0 ? "error" : "default"}
          stateRelatedMessage={field.state.meta.errors?.join("\n")}
        />
      )}
    />
  );
};

export default InputWithValidation;
