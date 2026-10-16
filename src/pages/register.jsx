
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../redux/userSlice";

const Register = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { loading, error } = useSelector(
        (state) => state.user
    );

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            await dispatch(registerUser(formData)).unwrap();

            // Navigate only after successful registration
            navigate("/login", {
                replace: true,
                state: {
                    message: "Account created successfully. Please sign in.",
                },
            });
        } catch (error) {
            // Redux stores the error in state.user.error
            console.error("Registration failed:", error);
        }
    };

    return (
        <main className="page-section">
            <div className="mx-auto max-w-md rounded-3xl border border-[#e1e5dc] bg-white/85 p-6 shadow-xl shadow-[#243a2f]/5 sm:p-9">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#71836e]">
                    Join Goodfinds
                </p>

                <h1 className="mt-2 text-3xl font-semibold tracking-[-0.05em] text-[#243a2f]">
                    Create your account
                </h1>

                <p className="mt-2 text-sm leading-6 text-[#697067]">
                    Save your details and enjoy a more personal shopping experience.
                </p>

                <form onSubmit={handleSubmit} className="mt-7 space-y-5">
                    <div>
                        <label
                            htmlFor="register-name"
                            className="mb-1.5 block text-sm font-medium text-[#465248]"
                        >
                            Full name
                        </label>

                        <input
                            id="register-name"
                            type="text"
                            name="name"
                            autoComplete="name"
                            placeholder="Enter your full name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            className="form-input"
                        />
                    </div>

                    <div>
                        <label
                            htmlFor="register-email"
                            className="mb-1.5 block text-sm font-medium text-[#465248]"
                        >
                            Email
                        </label>

                        <input
                            id="register-email"
                            type="email"
                            name="email"
                            autoComplete="email"
                            placeholder="Enter your email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            className="form-input"
                        />
                    </div>

                    <div>
                        <label
                            htmlFor="register-password"
                            className="mb-1.5 block text-sm font-medium text-[#465248]"
                        >
                            Password
                        </label>

                        <input
                            id="register-password"
                            type="password"
                            name="password"
                            autoComplete="new-password"
                            placeholder="Create a password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            className="form-input"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="product-submit w-full disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {loading ? "Creating account..." : "Create account"}
                    </button>

                    {error && (
                        <p
                            className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800"
                            role="alert"
                        >
                            {error}
                        </p>
                    )}
                </form>

                <p className="mt-6 text-center text-sm text-[#697067]">
                    Already have an account?{" "}
                    <Link
                        to="/login"
                        className="font-semibold text-[#2d4d3f] hover:underline"
                    >
                        Sign in
                    </Link>
                </p>
            </div>
        </main>
    );
};

export default Register;
