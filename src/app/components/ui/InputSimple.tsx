import { HTMLAttributes, InputHTMLAttributes } from "react";
import { NumericFormat } from "react-number-format";

import { cn } from "@/app/utils/classname.util";

function InputSimple({
  label,
  nativeInputProps,
  className,
  state,
  stateRelatedMessage,
  name,
  ...props
}: InputSimpleProps) {
  const inputClassName = cn(
    "border border-contrast-grey rounded p-2",
    state === "error" && "border-red-500"
  );

  const input =
    nativeInputProps?.type === "number" ? (
      <NumericFormat
        name={name}
        {...nativeInputProps}
        value={nativeInputProps?.value as string | number | undefined}
        defaultValue={
          nativeInputProps?.defaultValue as string | number | undefined
        }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        type={"number" as any}
        thousandSeparator=" "
        decimalSeparator=","
        className={inputClassName}
      />
    ) : (
      <input name={name} className={inputClassName} {...nativeInputProps} />
    );

  return (
    <div className={cn("flex flex-col gap-2 text-sm", className)} {...props}>
      {label && <label htmlFor={nativeInputProps?.id}>{label}</label>}
      {input}
      {state === "error" && (
        <p className="text-red-500 text-xs">{stateRelatedMessage}</p>
      )}
    </div>
  );
}

export default InputSimple;

type InputSimpleProps = HTMLAttributes<HTMLDivElement> & {
  label?: string;
  state?: "default" | "error" | "success";
  stateRelatedMessage?: string;
  nativeInputProps?: InputHTMLAttributes<HTMLInputElement>;
  className?: string;
  name?: string;
};
