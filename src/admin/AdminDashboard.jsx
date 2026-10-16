
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

const dashboardLinks = [
    {
        title: "Manage Products",
        description: "View, edit, and delete existing products.",
        to: "/admin/products",
    },
    {
        title: "Add Product",
        description: "Add a new product to the store.",
        to: "/admin/add-product",
    },
    {
        title: "View Store",
        description: "See the customer-facing storefront.",
        to: "/products",
    },
];

export default function AdminDashboard() {
    const user = useSelector((state) => state.user.user);

    return (
        <section className="page-section">
            <div className="mb-8">
                <p className="text-sm font-semibold uppercase tracking-widest text-[#71836e]">
                    Goodfinds administration
                </p>

                <h1 className="mt-2 text-3xl font-semibold text-[#243a2f] sm:text-4xl">
                    Welcome, {user?.name || "Admin"}
                </h1>

                <p className="mt-3 text-[#697067]">
                    Manage your store from one place.
                </p>
            </div>

            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {dashboardLinks.map((item) => (
                    <Link
                        key={item.to}
                        to={item.to}
                        className="rounded-2xl border border-[#e1e5dc] bg-white p-6 no-underline shadow-sm transition hover:-translate-y-1 hover:shadow-md"
                    >
                        <h2 className="text-xl font-semibold text-[#243a2f]">
                            {item.title}
                        </h2>

                        <p className="mt-3 text-sm leading-6 text-[#697067]">
                            {item.description}
                        </p>

                        <span className="mt-5 inline-block font-semibold text-[#2d4d3f]">
                            Open section →
                        </span>
                    </Link>
                ))}
            </div>
        </section>
    );
}
