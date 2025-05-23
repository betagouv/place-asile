import { PropsWithChildren, ReactElement } from "react";

export const UploadItem = ({
  children,
  title,
}: UploadItemProps): ReactElement => {
  return (
    <div className="flex flex-col gap-2 h-full ">
      <h3 className="text-title-blue-france text-sm font-medium mb-0 ">
        {title}
      </h3>
      {children}
    </div>
  );
};

type UploadItemProps = PropsWithChildren & {
  title: string;
};
