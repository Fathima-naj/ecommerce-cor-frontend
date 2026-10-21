
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
    fetchCart,
    incrementQuantity,
    decrementQuantity,
    removeFromCart,
    clearCart,
} from "../redux/cartSlice";

export default function Cart() {
    const dispatch = useDispatch();

    const { cart, loading, error } = useSelector(
        (state) => state.cart
    );

    useEffect(() => {
        dispatch(fetchCart());
    }, [dispatch]);

    const items = cart?.items || [];

    const totalItems = items.reduce(
        (total, item) => total + item.quantity,
        0
    );

    const totalPrice = items.reduce(
        (total, item) =>
            total + (item.product?.price || 0) * item.quantity,
        0
    );

    if (loading && !cart) {
        return (
            <div className="py-16 text-center text-gray-600">
                Loading your cart...
            </div>
        );
    }

    return (
        <main className="min-h-screen bg-gray-50 px-4 py-10 sm:px-8">
            <div className="mx-auto max-w-6xl">
                <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">
                            Shopping Cart
                        </h1>
                        <p className="mt-2 text-gray-500">
                            {totalItems} item(s) in your cart
                        </p>
                    </div>

                    <Link
                        to="/products"
                        className="rounded-lg border border-gray-300 px-5 py-2.5 font-medium text-gray-700 transition hover:border-black hover:bg-white"
                    >
                        Continue Shopping
                    </Link>
                </div>

                {error && (
                    <p
                        role="alert"
                        className="mb-5 rounded-lg bg-red-50 p-4 text-red-700"
                    >
                        {error}
                    </p>
                )}

                {items.length === 0 ? (
                    <section className="rounded-2xl border border-gray-200 bg-white px-6 py-16 text-center">
                        <h2 className="text-xl font-semibold text-gray-800">
                            Your cart is empty
                        </h2>
                        <p className="mt-2 text-gray-500">
                            Explore our products and add something you like.
                        </p>
                        <Link
                            to="/products"
                            className="mt-6 inline-block rounded-lg bg-black px-6 py-3 font-medium text-white transition hover:bg-gray-800"
                        >
                            Browse Products
                        </Link>
                    </section>
                ) : (
                    <div className="grid gap-8 lg:grid-cols-3">
                        <section className="space-y-4 lg:col-span-2">
                            {items.map((item) => {
                                const product = item.product;

                                if (!product) return null;

                                return (
                                    <article
                                        key={product._id}
                                        className="flex flex-col gap-5 rounded-2xl border border-gray-200 bg-white p-4 sm:flex-row sm:items-center"
                                    >
                                        <img
                                            src={
                                                product.images?.[0] ||
                                                "https://placehold.co/160x160?text=Product"
                                            }
                                            alt={product.name}
                                            className="h-32 w-full rounded-xl bg-gray-100 object-cover sm:w-32"
                                        />

                                        <div className="min-w-0 flex-1">
                                            <h2 className="text-lg font-semibold text-gray-900">
                                                {product.name}
                                            </h2>

                                            <p className="mt-1 text-gray-500">
                                                ₹{product.price}
                                            </p>

                                            <p className="mt-2 font-semibold text-gray-800">
                                                Subtotal: ₹
                                                {(
                                                    product.price *
                                                    item.quantity
                                                ).toFixed(2)}
                                            </p>

                                            <div className="mt-4 flex flex-wrap items-center gap-3">
                                                <div className="flex items-center rounded-lg border border-gray-300">
                                                    <button
                                                        type="button"
                                                        aria-label={`Decrease quantity of ${product.name}`}
                                                        disabled={loading}
                                                        onClick={() =>
                                                            dispatch(
                                                                decrementQuantity(
                                                                    product._id
                                                                )
                                                            )
                                                        }
                                                        className="px-3 py-2 hover:bg-gray-100 disabled:opacity-50"
                                                    >
                                                        −
                                                    </button>

                                                    <span className="min-w-10 text-center">
                                                        {item.quantity}
                                                    </span>

                                                    <button
                                                        type="button"
                                                        aria-label={`Increase quantity of ${product.name}`}
                                                        disabled={
                                                            loading ||
                                                            item.quantity >=
                                                                product.stock
                                                        }
                                                        onClick={() =>
                                                            dispatch(
                                                                incrementQuantity(
                                                                    product._id
                                                                )
                                                            )
                                                        }
                                                        className="px-3 py-2 hover:bg-gray-100 disabled:opacity-50"
                                                    >
                                                        +
                                                    </button>
                                                </div>

                                                <button
                                                    type="button"
                                                    disabled={loading}
                                                    onClick={() =>
                                                        dispatch(
                                                            removeFromCart(
                                                                product._id
                                                            )
                                                        )
                                                    }
                                                    className="text-sm font-medium text-red-600 hover:text-red-800 disabled:opacity-50"
                                                >
                                                    Remove
                                                </button>
                                            </div>
                                        </div>
                                    </article>
                                );
                            })}

                            <button
                                type="button"
                                disabled={loading}
                                onClick={() => {
                                    if (
                                        window.confirm(
                                            "Remove all items from your cart?"
                                        )
                                    ) {
                                        dispatch(clearCart());
                                    }
                                }}
                                className="rounded-lg border border-red-200 px-4 py-2.5 text-sm font-medium text-red-600 transition hover:bg-red-50 disabled:opacity-50"
                            >
                                Clear Cart
                            </button>
                        </section>

                        <aside className="h-fit rounded-2xl border border-gray-200 bg-white p-6">
                            <h2 className="text-xl font-bold text-gray-900">
                                Order Summary
                            </h2>

                            <div className="mt-6 flex justify-between text-gray-600">
                                <span>Items ({totalItems})</span>
                                <span>₹{totalPrice.toFixed(2)}</span>
                            </div>

                            <div className="mt-4 flex justify-between border-t border-gray-200 pt-4 text-lg font-bold text-gray-900">
                                <span>Total</span>
                                <span>₹{totalPrice.toFixed(2)}</span>
                            </div>

                            <p className="mt-3 text-sm text-gray-500">
                                Delivery charges will be calculated at checkout.
                            </p>

                           <Link
    to="/checkout"
    className="mt-6 block w-full rounded-lg bg-black px-5 py-3 text-center font-semibold text-white transition hover:bg-gray-800"
>
    Proceed to Checkout
</Link>
                        </aside>
                    </div>
                )}
            </div>
        </main>
    );
}
