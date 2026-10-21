
import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "../redux/userSlice";

const navClass = ({ isActive }) =>
    `rounded-lg px-3 py-2 text-sm font-medium ${
        isActive
            ? "bg-white/15 text-white"
            : "text-white/80 hover:bg-white/10 hover:text-white"
    }`;

export default function AdminNavbar() {
    const user = useSelector((state) => state.user.user);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [loggingOut, setLoggingOut] = useState(false);

    const handleLogout = async () => {
        setLoggingOut(true);

        try {
            await dispatch(logoutUser()).unwrap();
        } finally {
            setLoggingOut(false);
            navigate("/", { replace: true });
        }
    };

    return (
        <header className="sticky top-0 z-50 border-b border-[#263b2b] bg-[#203729] text-white shadow-sm">
            <nav
                className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:px-8"
                aria-label="Admin navigation"
            >
                <Link
                    to="/admin/dashboard"
                    className="font-semibold text-white no-underline"
                >
                    Goodfinds
                    <span className="ml-2 rounded-md bg-white/10 px-2 py-1 text-xs">
                        ADMIN
                    </span>
                </Link>

                <div className="flex flex-wrap items-center gap-1">
                    <NavLink
                        to="/admin/dashboard"
                        className={navClass}
                    >
                        Dashboard
                    </NavLink>

                    <NavLink
                        to="/admin/products"
                        className={navClass}
                    >
                        Manage Products
                    </NavLink>

                    <NavLink
                        to="/admin/add-product"
                        className={navClass}
                    >
                        Add Product
                    </NavLink>
                    <NavLink to="/admin/orders" className={navClass}>
    Manage Orders
</NavLink>

                    <Link
                        to="/products"
                        className="rounded-lg px-3 py-2 text-sm text-white/80 hover:bg-white/10"
                    >
                        View Store
                    </Link>

                    <span className="hidden px-2 text-sm md:inline">
                        {user?.name}
                    </span>

                    <button
                        type="button"
                        onClick={handleLogout}
                        disabled={loggingOut}
                        className="rounded-lg border border-white/25 px-3 py-2 text-sm font-semibold hover:bg-white/10 disabled:opacity-60"
                    >
                        {loggingOut ? "Signing out..." : "Logout"}
                    </button>
                </div>
            </nav>
        </header>
    );
}
