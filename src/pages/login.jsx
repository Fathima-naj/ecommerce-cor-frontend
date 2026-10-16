
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { loginUser } from "../redux/userSlice";

const Login = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();

    const { loading, error } = useSelector((state) => state.user);

    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };



    const handleSubmit = async (event) => {
    event.preventDefault();

    try {
        const user = await dispatch(loginUser(formData)).unwrap();

        const requestedPath = location.state?.from?.pathname;

        const destination =
            user.role === "admin"
                ? (
                    requestedPath?.startsWith("/admin")
                        ? requestedPath
                        : "/admin/dashboard"
                )
                : (
                    requestedPath && !requestedPath.startsWith("/admin")
                        ? requestedPath
                        : "/"
                );

        navigate(destination, { replace: true });
    } catch (error) {
       console.log(error)
    }
};

    return (
        <main className="page-section">
            <div className="mx-auto max-w-md rounded-3xl border border-[#e1e5dc] bg-white/85 p-6 shadow-xl shadow-[#243a2f]/5 sm:p-9">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#71836e]">
                    Welcome back
                </p>

                <h1 className="mt-2 text-3xl font-semibold tracking-[-0.05em] text-[#243a2f]">
                    Sign in
                </h1>

                <p className="mt-2 text-sm leading-6 text-[#697067]">
                    Sign in to your Goodfinds account.
                </p>

                <form onSubmit={handleSubmit} className="mt-7 space-y-5">
                    <div>
                        <label
                            htmlFor="login-email"
                            className="mb-1.5 block text-sm font-medium text-[#465248]"
                        >
                            Email
                        </label>

                        <input
                            id="login-email"
                            type="email"
                            name="email"
                            autoComplete="email"
                            placeholder="you@example.com"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            className="form-input"
                        />
                    </div>

                    <div>
                        <label
                            htmlFor="login-password"
                            className="mb-1.5 block text-sm font-medium text-[#465248]"
                        >
                            Password
                        </label>

                        <input
                            id="login-password"
                            type="password"
                            name="password"
                            autoComplete="current-password"
                            placeholder="Enter your password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            className="form-input"
                        />
                    </div>

                    {error && (
                        <p
                            className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800"
                            role="alert"
                        >
                            {error}
                        </p>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="product-submit w-full disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {loading ? "Signing in..." : "Sign in"}
                    </button>
                </form>

                <p className="mt-6 text-center text-sm text-[#697067]">
                    New to Goodfinds?{" "}
                    <Link
                        to="/register"
                        className="font-semibold text-[#2d4d3f] hover:underline"
                    >
                        Create an account
                    </Link>
                </p>
            </div>
        </main>
    );
};

export default Login;
