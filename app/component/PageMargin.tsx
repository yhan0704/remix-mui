import { ReactNode } from "react";

interface PageMarginProps {
  children: ReactNode;
}

export default function PageMargin({ children }: PageMarginProps) {
  return (
    <div aria-label="main-page" style={{ marginTop: "64px" }}>
      <div
        aria-label="auto-margin"
        style={{ margin: "0 auto", maxWidth: "1400px" }}
      >
        {children}
      </div>
    </div>
  );
}
