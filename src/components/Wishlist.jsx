
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import {
    fetchWishlist,
    removeFromWishlist,
} from "../redux/wishlistSlice";

function Wishlist() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { wishlist, loading, error } = useSelector(
        (state) => state.wishlist
    );

    useEffect(() => {
        dispatch(fetchWishlist());
    }, [dispatch]);

    const products = wishlist?.products || [];

    const handleRemove = async (productId) => {
        try {
            await dispatch(removeFromWishlist(productId)).unwrap();
        } catch {
            // The Redux slice stores the error for display.
        }
    };

    return (
        <main className="page-section">
            <div className="mx-auto max-w-7xl">
                <header className="catalog-header">
                    <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#71836e]">
                        Your saved collection
                    </p>

                    <h1 className="text-3xl font-semibold tracking-[-0.06em] text-[#1f2d24] sm:text-4xl">
                        My Wishlist
                    </h1>

                    <p className="mt-3 text-sm text-[#5f6f61]">
                        {products.length} saved{" "}
                        {products.length === 1 ? "item" : "items"}
                    </p>
                </header>

                {error && (
                    <p className="my-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800" role="alert">
                        {error}
                    </p>
                )}

                {loading && !wishlist ? (
                    <p className="py-12 text-center" role="status">
                        Loading wishlist...
                    </p>
                ) : products.length === 0 ? (
                    <div className="rounded-2xl border border-dashed border-[#cbd4c8] bg-white/60 px-6 py-16 text-center">
                        <h2 className="text-xl font-semibold text-[#354439]">
                            Your wishlist is empty
                        </h2>

                        <p className="mt-2 text-sm text-[#697067]">
                            Save products you love and find them here later.
                        </p>

                        <Link
                            to="/products"
                            className="premium-button mt-6 inline-flex px-6"
                        >
                            Explore products
                        </Link>
                    </div>
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

                                    <div className="action-row">
                                        <Link
                                            to={`/product/${product._id}`}
                                            className="action-link"
                                        >
                                            View details
                                        </Link>

                                        <button
                                            type="button"
                                            onClick={() =>
                                                handleRemove(product._id)
                                            }
                                            disabled={loading}
                                            className="text-sm font-semibold text-[#9a4b3d] transition hover:text-[#71372e] disabled:opacity-50"
                                        >
                                            Remove
                                        </button>
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

export default Wishlist;
