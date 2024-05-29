import { useEffect } from "react";
import { useLocation } from "@remix-run/react";

export default function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
  }, [pathname]);

  return null;
}
