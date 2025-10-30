import { FrIconClassName, RiIconClassName } from "@codegouvfr/react-dsfr";

import { cn } from "@/app/utils/classname.util";

export const InformationBar = ({ variant, title, description }: Props) => {
  const iconClassName: FrIconClassName | RiIconClassName =
    variant === "complete" ? "fr-icon-edit-line" : "fr-icon-eye-line";

  return (
    <div
      className={cn(
        "flex gap-4 pt-2 border-b-2",
        variant === "verify" && "text-[#7D6A20] border-[#7D6A20]",
        variant === "complete" && "text-default-warning border-plain-warning",
        variant === "success" && "text-default-success  border-plain-success"
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
  variant: "verify" | "complete" | "success";
  title: string;
  description: string;
};
