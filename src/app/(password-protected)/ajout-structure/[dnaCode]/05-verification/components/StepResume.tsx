import { cn } from "@/app/utils/classname.util";
import Button from "@codegouvfr/react-dsfr/Button";
import { PropsWithChildren, ReactElement } from "react";

export const StepResume = ({
  children,
  title,
  link,
  className,
}: StepResumeProps): ReactElement => {
  return (
    <section
      className={cn(
        "border-t-2 border-action-high-blue-france pt-6 mb-12",
        className
      )}
    >
      <h2 className="text-title-blue-france w-full flex justify-between text-xl">
        {title}
        <Button
          priority="secondary"
          iconId="fr-icon-edit-line"
          linkProps={{ href: link }}
        >
          Modifier
        </Button>
      </h2>
      {children}
    </section>
  );
};

type StepResumeProps = PropsWithChildren & {
  title: string;
  link: string;
  className?: string;
};
