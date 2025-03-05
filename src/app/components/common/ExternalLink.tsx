import { ReactElement } from "react";

export const ExternalLink = ({ title, url }: Props): ReactElement => {
  return (
    <a
      title={`${title} - ouvre une nouvelle fenêtre`}
      href={url}
      target="_blank"
      rel="noopener external"
    >
      {title}
    </a>
  );
};

type Props = {
  title: string;
  url: string;
};
