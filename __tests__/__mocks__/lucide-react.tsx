import React from "react";

interface DownloadProps {
  className?: string;
}

export const Download: React.FC<DownloadProps> = (props) => {
  return <div data-testid="download-icon" className={props.className} />;
};
