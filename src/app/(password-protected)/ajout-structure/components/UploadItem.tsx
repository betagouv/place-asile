import { PropsWithChildren, ReactElement } from "react";

export const UploadItem = ({
  children,
  title,
  subTitle,
}: UploadItemProps): ReactElement => {
  return (
    <div className="flex flex-col h-full">
      <div className="pb-2">
        <h3 className="text-title-blue-france text-sm font-medium mb-0 ">
          {title}
        </h3>
        {subTitle && (
          <h4 className="text-mention-grey text-xs font-normal mb-0 ">
            {subTitle}
          </h4>
        )}
      </div>
      {children}
    </div>
  );
};

type UploadItemProps = PropsWithChildren & {
  title: string;
  subTitle?: string;
};
