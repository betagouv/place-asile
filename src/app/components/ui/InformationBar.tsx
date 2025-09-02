import { FrIconClassName, RiIconClassName } from "@codegouvfr/react-dsfr";

import { cn } from "@/app/utils/classname.util";

export const InformationBar = ({ variant, title, description }: Props) => {
  const iconClassName: FrIconClassName | RiIconClassName =
    variant === "info" ? "fr-icon-edit-line" : "fr-icon-eye-line";

  return (
    <div
      className={cn(
        "flex gap-4 pt-2",
        variant === "info" &&
          "text-default-success border-t-2 border-plain-success",
        variant === "warning" &&
          "text-default-warning border-t-2 border-plain-warning"
      )}
    >
      <span className={cn("mt-1", iconClassName)}></span>
      <div className="flex flex-col gap-1">
        <p className="m-0 text-xl font-bold">{title}</p>
        <p>{description}</p>
      </div>
    </div>
  );
};

type Props = {
  variant: "info" | "warning";
  title: string;
  description: string;
};
