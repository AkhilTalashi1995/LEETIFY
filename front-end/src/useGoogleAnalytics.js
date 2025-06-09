import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const GA_MEASUREMENT_ID = "G-EP8Z2D3S4G"; 

export default function useGoogleAnalytics() {
  const location = useLocation();

  useEffect(() => {
    if (window.gtag) {
      window.gtag("config", GA_MEASUREMENT_ID, {
        page_path: location.pathname + location.search,
      });
    }
  }, [location]);
}
