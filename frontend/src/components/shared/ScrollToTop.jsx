import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const ScrollToTop = () => {
    const { pathname, search } = useLocation();

    useEffect(() => {
        // Scroll to top on every route or query param change
        window.scrollTo({
            top: 0,
            left: 0,
            behavior: "instant" // Use 'instant' so there's no visible scrolling animation between pages
        });
    }, [pathname, search]);

    return null;
};

export default ScrollToTop;
