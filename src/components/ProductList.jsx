
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { getProduct } from "../redux/productSlice";

function ProductList() {
    const { products, loading, error } = useSelector(
        (state) => state.product
    );

    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(getProduct());
    }, [dispatch]);

    return (
        <main className="page-section">
            <div className="mx-auto max-w-7xl">
                <header className="catalog-header flex flex-wrap items-end justify-between gap-4">
                    <div>
                        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#71836e]">
                            The collection
                        </p>

                        <h1 className="text-3xl font-semibold tracking-[-0.06em] text-[#1f2d24] sm:text-4xl">
                            Products
                        </h1>
                    </div>

                    <p className="text-sm font-medium text-[#5f6f61]">
                        {products.length}{" "}
                        {products.length === 1 ? "item" : "items"}
                    </p>
                </header>

                {error && (
                    <p
                        className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800"
                        role="alert"
                    >
                        {error}
                    </p>
                )}

                {loading && products.length === 0 ? (
                    <div className="flex min-h-64 items-center justify-center rounded-2xl border border-[#e1e5dc] bg-white/70">
                        <p className="text-sm font-medium text-[#5e665d]" role="status">
                            Loading products...
                        </p>
                    </div>
                ) : products.length === 0 ? (
                    !error && (
                        <div className="flex min-h-64 flex-col items-center justify-center rounded-2xl border border-dashed border-[#cbd4c8] bg-white/60 px-6 text-center shadow-sm">
                            <h2 className="text-lg font-semibold text-[#354439]">
                                No products available
                            </h2>

                            <p className="mt-2 max-w-sm text-sm leading-6 text-[#697067]">
                                There are no products available right now.
                                Please check back soon.
                            </p>
                        </div>
                    )
                ) : (
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
                        {products.map((product) => (
                            <article
                                key={product._id}
                                className="catalog-card group"
                            >
                                <div className="catalog-image">
                                    {product.images?.[0] ? (
                                        <img
                                            src={product.images[0]}
                                            alt={product.name}
                                        />
                                    ) : (
                                        <div className="flex h-full items-center justify-center text-sm text-[#697067]">
                                            No image available
                                        </div>
                                    )}
                                </div>

                                <div className="catalog-body">
                                    <span className="tag-badge">
                                        {product.category || "Uncategorized"}
                                    </span>

                                    <h2 className="product-card-title">
                                        {product.name}
                                    </h2>

                                    <p className="product-price">
                                        ₹
                                        {Number(product.price).toLocaleString(
                                            "en-IN"
                                        )}
                                    </p>

                                    <p className="mt-2 text-sm text-[#697067]">
                                        {product.stock} in stock
                                    </p>

                                    <div className="action-row">
                                        <Link
                                            to={`/product/${product._id}`}
                                            className="action-link"
                                        >
                                            View details
                                        </Link>
                                    </div>
                                </div>
                            </article>
                        ))}
                    </div>
                )}
            </div>
        </main>
    );
}

export default ProductList;
