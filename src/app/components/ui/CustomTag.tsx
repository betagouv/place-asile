import { PropsWithChildren, ReactElement } from "react";

import { cn } from "@/app/utils/classname.util";

export const CustomTag = ({
  children,
  className,
}: PropsWithChildren & { className?: string }): ReactElement => {
  return (
    <span
      // TODO Jerem: pass the color from dsfr tokens
      className={cn(
        "bg-[#FEE7FC] text-[#6E445A] uppercase font-bold text-xs inline-flex justify-center items-center rounded-sm px-2 w-fit",
        className
      )}
    >
      {children}
    </span>
  );
};
