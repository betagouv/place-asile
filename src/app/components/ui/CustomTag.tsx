import { cn } from "@/app/utils/classname.util";
import { PropsWithChildren, ReactElement } from "react";

export const CustomTag = ({
  children,
  className,
}: PropsWithChildren & { className?: string }): ReactElement => {
  return (
    <span
      // TODO Jerem: pass the color from dsfr tokens
      className={cn(
        "bg-[#FEE7FC] text-[#6E445A] uppercase font-bold text-xs flex justify-center items-center rounded-sm px-2",
        className
      )}
    >
      {children}
    </span>
  );
};
