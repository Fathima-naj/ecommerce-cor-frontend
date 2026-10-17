
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import {
    ShoppingBag,
    Heart,
    ArrowUpRight,
} from "lucide-react";

import { getProduct } from "../redux/productSlice";
import { addToCart } from "../redux/cartSlice";
import {
    fetchWishlist,
    addToWishlist,
    removeFromWishlist,
    resetWishlist,
} from "../redux/wishlistSlice";

function ProductList() {
    const { products, loading, error } = useSelector(
        (state) => state.product
    );

    const { user } = useSelector((state) => state.user);

    const { wishlist } = useSelector(
        (state) => state.wishlist
    );

    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        dispatch(getProduct());
    }, [dispatch]);

    // Load the saved wishlist whenever the customer is logged in.
    useEffect(() => {
        if (user && user.role !== "admin") {
            dispatch(fetchWishlist());
        } else {
            dispatch(resetWishlist());
        }
    }, [dispatch, user]);

    const handleAddToCart = (product) => {
        if (!user) {
            navigate("/login");
            return;
        }

        if (user.role === "admin") return;

        dispatch(
            addToCart({
                productId: product._id,
                quantity: 1,
            })
        );
    };

    const handleToggleWishlist = async (productId) => {
        if (!user) {
            navigate("/login");
            return;
        }

        if (user.role === "admin") return;

        const isSaved = wishlist?.products?.some(
            (item) =>
                (typeof item === "string" ? item : item._id) ===
                productId
        );

        try {
            if (isSaved) {
                await dispatch(
                    removeFromWishlist(productId)
                ).unwrap();
            } else {
                await dispatch(
                    addToWishlist(productId)
                ).unwrap();
            }
        } catch (error) {
            console.error("Wishlist update failed:", error);
        }
    };

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

                        <p className="mt-2 text-sm text-[#697067]">
                            Thoughtfully selected, made for everyday living.
                        </p>
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
                        <p
                            className="text-sm font-medium text-[#5e665d]"
                            role="status"
                        >
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
                    <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {products.map((product) => {
                            const isSaved =
                                wishlist?.products?.some(
                                    (item) =>
                                        (typeof item === "string"
                                            ? item
                                            : item._id) === product._id
                                ) ?? false;

                            return (
                                <article
                                    key={product._id}
                                    className="group min-w-0"
                                >
                                    <div className="relative overflow-hidden rounded-2xl bg-[#f1f0e9]">
                                        <Link
                                            to={`/product/${product._id}`}
                                            className="block aspect-[4/5] overflow-hidden"
                                            aria-label={`View ${product.name}`}
                                        >
                                            {product.images?.[0] ? (
                                                <img
                                                    src={product.images[0]}
                                                    alt={product.name}
                                                    loading="lazy"
                                                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                                                />
                                            ) : (
                                                <div className="flex h-full items-center justify-center text-sm text-[#697067]">
                                                    No image available
                                                </div>
                                            )}
                                        </Link>

                                        {/* Wishlist heart */}
                                        <button
                                            type="button"
                                            onClick={() =>
                                                handleToggleWishlist(
                                                    product._id
                                                )
                                            }
                                            aria-label={
                                                isSaved
                                                    ? `Remove ${product.name} from wishlist`
                                                    : `Add ${product.name} to wishlist`
                                            }
                                            aria-pressed={isSaved}
                                            title={
                                                isSaved
                                                    ? "Remove from wishlist"
                                                    : "Add to wishlist"
                                            }
                                            className="absolute right-3 top-3 flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-sm transition hover:scale-105 focus:outline-none focus:ring-2 focus:ring-[#71836e] focus:ring-offset-2"
                                        >
                                            <Heart
                                                size={20}
                                                strokeWidth={1.8}
                                                className={
                                                    isSaved
                                                        ? "fill-red-500 text-red-500"
                                                        : "text-[#354439] hover:text-red-500"
                                                }
                                            />
                                        </button>

                                        {product.stock <= 0 && (
                                            <span className="absolute bottom-3 left-3 rounded-full bg-white/95 px-3 py-1.5 text-xs font-semibold text-[#8b3a32]">
                                                Out of stock
                                            </span>
                                        )}
                                    </div>

                                    <div className="pt-4">
                                        <div className="mb-2 flex items-center justify-between gap-3">
                                            <span className="text-xs font-medium uppercase tracking-[0.12em] text-[#71836e]">
                                                {product.category ||
                                                    "Uncategorized"}
                                            </span>

                                            {product.stock > 0 && (
                                                <span className="text-xs text-[#71836e]">
                                                    In stock
                                                </span>
                                            )}
                                        </div>

                                        <Link
                                            to={`/product/${product._id}`}
                                            className="group/title flex items-start justify-between gap-2"
                                        >
                                            <h2 className="text-base font-medium leading-6 text-[#243a2f] transition group-hover/title:text-[#71836e]">
                                                {product.name}
                                            </h2>

                                            <ArrowUpRight
                                                size={17}
                                                className="mt-1 shrink-0 text-[#8b9588] transition group-hover/title:-translate-y-0.5 group-hover/title:translate-x-0.5"
                                            />
                                        </Link>

                                        <p className="mt-2 text-lg font-semibold tracking-tight text-[#1f2d24]">
                                            ₹
                                            {Number(
                                                product.price
                                            ).toLocaleString("en-IN")}
                                        </p>

                                        <button
                                            type="button"
                                            onClick={() =>
                                                handleAddToCart(product)
                                            }
                                            disabled={product.stock <= 0}
                                            className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-[#243a2f] px-4 py-3 text-sm font-medium text-white transition hover:bg-[#354f40] focus:outline-none focus:ring-2 focus:ring-[#71836e] focus:ring-offset-2 disabled:cursor-not-allowed disabled:bg-[#c5cbc3]"
                                        >
                                            <ShoppingBag
                                                size={17}
                                                strokeWidth={1.8}
                                            />
                                            {product.stock <= 0
                                                ? "Out of stock"
                                                : "Add to bag"}
                                        </button>
                                    </div>
                                </article>
                            );
                        })}
                    </div>
                )}
            </div>
        </main>
    );
}

export default ProductList;
