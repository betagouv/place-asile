import { ReactNode } from "react";
import { cn } from "@/app/utils/classname.util";

type SectionProps = {
  id: string;
  children: ReactNode;
  className?: string;
};

export const Section = ({ id, children, className }: SectionProps) => {
  return (
    <section
      // TODO @ledjay : fix the first item scroll bug (first:mt-4 ?)
      className={cn("scroll-margin-header", className)}
      id={id}
    >
      {children}
    </section>
  );
};
