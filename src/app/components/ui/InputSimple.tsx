import { InputHTMLAttributes, HTMLAttributes } from "react";
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
  return (
    <div className={cn("flex flex-col gap-2 text-sm", className)} {...props}>
      {label && <label htmlFor={nativeInputProps?.id}>{label}</label>}
      <input
        name={name}
        className={cn(
          "border border-contrast-grey rounded p-2",
          state === "error" && "border-red-500"
        )}
        {...nativeInputProps}
      />
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
