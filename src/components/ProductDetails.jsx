
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Heart, ShoppingBag } from "lucide-react";

import { getProductById } from "../redux/productSlice";
import { addToCart } from "../redux/cartSlice";
import {
    fetchWishlist,
    addToWishlist,
    removeFromWishlist,
    resetWishlist,
} from "../redux/wishlistSlice";

function ProductDetails() {
    const { id } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { product, loading, error } = useSelector(
        (state) => state.product
    );

    const { user } = useSelector((state) => state.user);

    const { wishlist } = useSelector(
        (state) => state.wishlist
    );

    useEffect(() => {
        if (id) {
            dispatch(getProductById(id));
        }
    }, [dispatch, id]);

    // Load the customer's wishlist to show the correct heart state.
    useEffect(() => {
        if (user && user.role !== "admin") {
            dispatch(fetchWishlist());
        } else {
            dispatch(resetWishlist());
        }
    }, [dispatch, user]);

    const isSaved =
        wishlist?.products?.some(
            (item) =>
                (typeof item === "string" ? item : item._id) ===
                product?._id
        ) ?? false;

    const handleToggleWishlist = async () => {
        if (!user) {
            navigate("/login");
            return;
        }

        if (user.role === "admin") return;

        try {
            if (isSaved) {
                await dispatch(
                    removeFromWishlist(product._id)
                ).unwrap();
            } else {
                await dispatch(
                    addToWishlist(product._id)
                ).unwrap();
            }
        } catch (error) {
            console.error("Wishlist update failed:", error);
        }
    };

    const handleAddToCart = () => {
        if (!user) {
            navigate("/login");
            return;
        }

        if (user.role === "admin" || product.stock <= 0) return;

        dispatch(
            addToCart({
                productId: product._id,
                quantity: 1,
            })
        );
    };

    if (loading) {
        return (
            <main className="flex min-h-[60vh] items-center justify-center px-6 text-[#465248]">
                <p className="text-sm font-medium" role="status">
                    Loading product...
                </p>
            </main>
        );
    }

    if (error) {
        return (
            <main className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-6 text-center">
                <p className="text-lg font-semibold text-[#263c2d]">
                    We couldn&apos;t load this product.
                </p>

                <p className="max-w-md text-sm leading-6 text-[#697067]">
                    {error}
                </p>

                <Link to="/products" className="ghost-button">
                    Back to products
                </Link>
            </main>
        );
    }

    if (!product) {
        return (
            <main className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-6 text-center">
                <p className="text-lg font-semibold text-[#263c2d]">
                    Product not found.
                </p>

                <Link to="/products" className="ghost-button">
                    Browse all products
                </Link>
            </main>
        );
    }

    return (
        <main className="page-section">
            <div className="mx-auto max-w-6xl">
                <Link
                    to="/products"
                    className="mb-7 inline-flex items-center gap-2 text-sm font-semibold text-[#5d6f60] transition-colors hover:text-[#263c2d]"
                >
                    <span aria-hidden="true">←</span>
                    All products
                </Link>

                <article className="product-detail-card grid overflow-hidden lg:grid-cols-2">
                    {/* Product images */}
                    <div className="product-detail-gallery">
                        <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-[#58705b]">
                            Product gallery
                        </p>

                        <div className="gallery-grid">
                            {product.images?.map((image, index) => (
                                <img
                                    key={index}
                                    src={image}
                                    alt={`${product.name} - Image ${index + 1}`}
                                />
                            ))}
                        </div>

                        {(!product.images ||
                            product.images.length === 0) && (
                            <p className="py-16 text-center text-sm text-[#697067]">
                                No images available.
                            </p>
                        )}
                    </div>

                    {/* Product information */}
                    <div className="detail-content">
                        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#75846e]">
                            Goodfinds selection
                        </p>

                        <h1 className="mt-4 break-words text-3xl font-semibold leading-tight tracking-[-0.06em] text-[#243b31] sm:text-4xl">
                            {product.name}
                        </h1>

                        <p className="mt-5 text-3xl font-semibold tracking-[-0.05em] text-[#1d2a22]">
                            ₹
                            {Number(product.price).toLocaleString("en-IN")}
                        </p>

                        <div className="my-8 h-px bg-[#e8e7e0]" />

                        <dl className="grid grid-cols-2 gap-4">
                            <div className="detail-stat">
                                <dt className="text-[0.62rem] font-semibold uppercase tracking-[0.15em] text-[#82877f]">
                                    Category
                                </dt>

                                <dd className="break-words text-sm font-medium text-[#343b34]">
                                    {product.category || "Uncategorized"}
                                </dd>
                            </div>

                            <div className="detail-stat">
                                <dt className="text-[0.62rem] font-semibold uppercase tracking-[0.15em] text-[#82877f]">
                                    Availability
                                </dt>

                                <dd
                                    className={`text-sm font-medium ${
                                        product.stock > 0
                                            ? "text-[#395640]"
                                            : "text-[#9a4b3d]"
                                    }`}
                                >
                                    {product.stock > 0
                                        ? `${product.stock} in stock`
                                        : "Out of stock"}
                                </dd>
                            </div>
                        </dl>

                        {/* Purchase and wishlist actions */}
                        <div className="mt-8 flex items-center gap-3">
                            <button
                                type="button"
                                onClick={handleAddToCart}
                                disabled={product.stock <= 0}
                                className="flex min-h-12 flex-1 items-center justify-center gap-2 rounded-xl bg-[#243a2f] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#354f40] focus:outline-none focus:ring-2 focus:ring-[#71836e] focus:ring-offset-2 disabled:cursor-not-allowed disabled:bg-[#c5cbc3]"
                            >
                                <ShoppingBag size={18} />
                                {product.stock <= 0
                                    ? "Out of Stock"
                                    : "Add to Cart"}
                            </button>

                            <button
                                type="button"
                                onClick={handleToggleWishlist}
                                aria-label={
                                    isSaved
                                        ? "Remove from wishlist"
                                        : "Add to wishlist"
                                }
                                aria-pressed={isSaved}
                                title={
                                    isSaved
                                        ? "Remove from wishlist"
                                        : "Add to wishlist"
                                }
                                className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-[#d8ded4] bg-white transition hover:border-red-200 hover:bg-[#fff5f5] focus:outline-none focus:ring-2 focus:ring-[#71836e] focus:ring-offset-2"
                            >
                                <Heart
                                    size={21}
                                    strokeWidth={1.8}
                                    className={
                                        isSaved
                                            ? "fill-red-500 text-red-500"
                                            : "text-[#354439] hover:text-red-500"
                                    }
                                />
                            </button>
                        </div>

                        <Link
                            to="/products"
                            className="premium-button mt-9 w-full px-6 sm:w-auto"
                        >
                            Continue shopping
                            <span aria-hidden="true" className="ml-3">
                                →
                            </span>
                        </Link>
                    </div>
                </article>
            </div>
        </main>
    );
}

export default ProductDetails;
