
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { deleteProduct, getProduct } from "../redux/productSlice";
import { useNavigate, Link } from "react-router-dom";

function AdminProductList() {
    const { products, loading, error } = useSelector(
        (state) => state.product
    );

    const { user } = useSelector((state) => state.user);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const isAdmin = user?.role === "admin";

    useEffect(() => {
        dispatch(getProduct());
    }, [dispatch]);

    const handleDelete = (id, name) => {
        const confirmed = window.confirm(
            `Are you sure you want to delete "${name}"?`
        );

        if (confirmed) {
            dispatch(deleteProduct(id));
        }
    };

    if (!isAdmin) {
        return (
            <div className="p-8 text-center">
                <h2 className="text-xl font-semibold">
                    Access denied
                </h2>
                <p>You must be an admin to manage products.</p>
            </div>
        );
    }

    return (
        <main className="page-section">
            <div className="mx-auto max-w-7xl">

                {/* Header */}
                <header className="mb-8 flex flex-wrap items-end justify-between gap-4">
                    <div>
                        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#71836e]">
                            Administration
                        </p>

                        <h1 className="text-3xl font-semibold tracking-tight text-[#1f2d24] sm:text-4xl">
                            Product Management
                        </h1>

                        <p className="mt-2 text-sm text-[#5f6f61]">
                            Add, edit and manage your product collection.
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={() => navigate("/admin/add-product")}
                        className="rounded-xl bg-[#354f3b] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#263b2b]"
                    >
                        + Add Product
                    </button>
                </header>

                {/* Product count */}
                <div className="mb-6 rounded-2xl border border-[#e1e5dc] bg-white p-5">
                    <p className="text-sm text-[#697067]">
                        Total products
                    </p>

                    <p className="mt-1 text-3xl font-semibold text-[#1f2d24]">
                        {products.length}
                    </p>
                </div>

                {/* Error */}
                {error && (
                    <p
                        className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800"
                        role="alert"
                    >
                        {error}
                    </p>
                )}

                {/* Product list */}
                {loading && products.length === 0 ? (
                    <div className="rounded-2xl border border-[#e1e5dc] bg-white p-12 text-center">
                        Loading products...
                    </div>
                ) : products.length === 0 ? (
                    <div className="rounded-2xl border border-dashed border-[#cbd4c8] bg-white p-12 text-center">
                        <h2 className="text-xl font-semibold text-[#354439]">
                            No products yet
                        </h2>

                        <p className="mt-2 text-sm text-[#697067]">
                            Add your first product to get started.
                        </p>

                        <button
                            type="button"
                            onClick={() => navigate("/admin/add-product")}
                            className="mt-5 rounded-xl bg-[#354f3b] px-5 py-3 text-sm font-semibold text-white"
                        >
                            Add Your First Product
                        </button>
                    </div>
                ) : (
                    <div className="overflow-x-auto rounded-2xl border border-[#e1e5dc] bg-white shadow-sm">
                        <table className="w-full min-w-[750px] text-left">
                            <thead className="border-b border-[#e1e5dc] bg-[#f5f7f2]">
                                <tr>
                                    <th className="px-5 py-4 text-sm font-semibold text-[#354439]">
                                        Product
                                    </th>
                                    <th className="px-5 py-4 text-sm font-semibold text-[#354439]">
                                        Category
                                    </th>
                                    <th className="px-5 py-4 text-sm font-semibold text-[#354439]">
                                        Price
                                    </th>
                                    <th className="px-5 py-4 text-sm font-semibold text-[#354439]">
                                        Stock
                                    </th>
                                    <th className="px-5 py-4 text-sm font-semibold text-[#354439]">
                                        Actions
                                    </th>
                                </tr>
                            </thead>

                            <tbody className="divide-y divide-[#edf0e9]">
                                {products.map((product) => (
                                    <tr
                                        key={product._id}
                                        className="transition hover:bg-[#fafbf8]"
                                    >
                                        <td className="px-5 py-4">
                                            <div className="flex items-center gap-3">
                                                {product.images?.[0] ? (
                                                    <img
                                                        src={product.images[0]}
                                                        alt={product.name}
                                                        className="h-14 w-14 rounded-xl object-cover"
                                                    />
                                                ) : (
                                                    <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-[#f0f2ec] text-xs text-gray-500">
                                                        No image
                                                    </div>
                                                )}

                                                <div>
                                                    <p className="font-semibold text-[#1f2d24]">
                                                        {product.name}
                                                    </p>
                                                    <Link
                                                        to={`/product/${product._id}`}
                                                        className="mt-1 inline-block text-xs text-[#71836e] hover:underline"
                                                    >
                                                        View product
                                                    </Link>
                                                </div>
                                            </div>
                                        </td>

                                        <td className="px-5 py-4 text-sm text-[#5f6f61]">
                                            {product.category || "Uncategorized"}
                                        </td>

                                        <td className="px-5 py-4 text-sm font-semibold text-[#1f2d24]">
                                            ₹{Number(product.price).toLocaleString("en-IN")}
                                        </td>

                                        <td className="px-5 py-4 text-sm text-[#5f6f61]">
                                            {product.stock}
                                        </td>

                                        <td className="px-5 py-4">
                                            <div className="flex items-center gap-2">
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        navigate("/updateproduct", {
                                                            state: { product },
                                                        })
                                                    }
                                                    className="rounded-lg border border-[#d9e1d5] px-3 py-2 text-sm font-medium text-[#354f3b] hover:bg-[#edf3e9]"
                                                >
                                                    Edit
                                                </button>

                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        handleDelete(
                                                            product._id,
                                                            product.name
                                                        )
                                                    }
                                                    className="rounded-lg border border-red-200 px-3 py-2 text-sm font-medium text-red-700 hover:bg-red-50"
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </main>
    );
}

export default AdminProductList;
