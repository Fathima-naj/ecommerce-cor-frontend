
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

export default function AdminRoute() {
    const { user, profileChecked } = useSelector(
        (state) => state.user
    );

    const location = useLocation();

    if (!profileChecked) {
        return (
            <p className="p-8 text-center" role="status">
                Checking your session...
            </p>
        );
    }

    if (!user) {
        return (
            <Navigate
                to="/login"
                replace
                state={{ from: location }}
            />
        );
    }

    if (user.role !== "admin") {
        return <Navigate to="/" replace />;
    }

    return <Outlet />;
}
