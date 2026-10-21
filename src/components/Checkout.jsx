
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { axiosInstance } from "../api/axiosInstance";
import { fetchCart } from "../redux/cartSlice";

const initialForm = {
    fullName: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
};


const loadRazorpayScript = () => {
    return new Promise((resolve) => {
        const existingScript = document.querySelector(
            'script[src="https://checkout.razorpay.com/v1/checkout.js"]'
        );

        if (existingScript) {
            resolve(true);
            return;
        }

        const script = document.createElement("script");
        script.src = "https://checkout.razorpay.com/v1/checkout.js";
        script.onload = () => resolve(true);
        script.onerror = () => resolve(false);

        document.body.appendChild(script);
    });
};


export default function Checkout() {
    const dispatch = useDispatch();
const [paymentMethod, setPaymentMethod] = useState("COD");
    const { cart, loading: cartLoading } = useSelector(
        (state) => state.cart
    );

    const [formData, setFormData] = useState(initialForm);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");
    const [order, setOrder] = useState(null);

    useEffect(() => {
        dispatch(fetchCart());
    }, [dispatch]);

    const items = cart?.items || [];

    const totalItems = items.reduce(
        (total, item) => total + item.quantity,
        0
    );

    const totalAmount = items.reduce(
        (total, item) =>
            total +
            (item.product?.price || 0) * item.quantity,
        0
    );

    const handleChange = (event) => {
        const { name, value } = event.target;

        setFormData((previous) => ({
            ...previous,
            [name]: value,
        }));
    };

    
const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (items.length === 0) {
        setError("Your cart is empty.");
        return;
    }

    setSubmitting(true);

    try {
        // Keep the existing COD flow
        if (paymentMethod === "COD") {
            const response = await axiosInstance.post(
                "/order/create",
                formData
            );

            setOrder(response.data.order);
            dispatch(fetchCart());
            return;
        }

        // Load Razorpay Checkout
        const loaded = await loadRazorpayScript();

        if (!loaded) {
            throw new Error(
                "Unable to load Razorpay. Check your internet connection."
            );
        }

        // Ask the backend to create a payment order
        const response = await axiosInstance.post(
            "/order/razorpay/create",
            formData
        );

        const {
            key,
            razorpayOrderId,
            amount,
            currency,
        } = response.data;

        const options = {
            key,
            amount,
            currency,
            name: "Goodfinds",
            description: "Purchase payment",
            order_id: razorpayOrderId,

            prefill: {
                name: formData.fullName,
                contact: formData.phone,
            },

            theme: {
                color: "#111827",
            },

            handler: async (paymentResponse) => {
                try {
                    // Verify payment on your backend
                    const verificationResponse =
                        await axiosInstance.post(
                            "/order/razorpay/verify",
                            paymentResponse
                        );

                    setOrder(verificationResponse.data.order);
                    dispatch(fetchCart());
                    setError("");
                } catch (err) {
                    setError(
                        err.response?.data?.message ||
                            "Payment verification failed. If money was deducted, please contact support before trying again."
                    );
                } finally {
                    setSubmitting(false);
                }
            },

            modal: {
                ondismiss: () => {
                    setSubmitting(false);
                },
            },
        };

        const razorpayCheckout = new window.Razorpay(options);

        razorpayCheckout.on("payment.failed", (paymentResponse) => {
            setError(
                paymentResponse.error?.description ||
                    "Payment failed. You can try again."
            );
            setSubmitting(false);
        });

        razorpayCheckout.open();
    } catch (err) {
        setError(
            err.response?.data?.message ||
                err.message ||
                "Unable to place your order. Please try again."
        );

        setSubmitting(false);
    } finally {
        // Razorpay modal remains responsible for its own completion.
        if (paymentMethod === "COD") {
            setSubmitting(false);
        }
    }
};


    if (order) {
        return (
            <main className="min-h-screen bg-gray-50 px-4 py-16">
                <section className="mx-auto max-w-xl rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-sm">
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-3xl text-green-700">
                        ✓
                    </div>

                    <h1 className="mt-5 text-2xl font-bold text-gray-900">
                        Order placed successfully!
                    </h1>

                    <p className="mt-3 text-gray-600">
                        Thank you for shopping with Goodfinds.
                    </p>

                    <div className="mt-6 rounded-xl bg-gray-50 p-4 text-left">
                        <p className="text-sm text-gray-500">
                            Order ID
                        </p>
                        <p className="mt-1 break-all font-semibold text-gray-900">
                            {order._id}
                        </p>

                        <div className="mt-4 flex justify-between gap-4">
                            <span className="text-gray-600">
                                Total amount
                            </span>
                            <span className="font-bold text-gray-900">
                                ₹{Number(order.totalAmount).toFixed(2)}
                            </span>
                        </div>

                        <div className="mt-3 flex justify-between gap-4">
                            <span className="text-gray-600">
                                Payment method
                            </span>
                            <span className="font-medium">
                               {order.paymentMethod === "Razorpay"
                                ? "Razorpay"
                                : "Cash on Delivery"}
                            </span>
                        </div>

                        <div className="mt-3 flex justify-between gap-4">
                            <span className="text-gray-600">
                                Order status
                            </span>
                            <span className="font-medium text-amber-700">
                                {order.orderStatus}
                            </span>
                        </div>
                    </div>

                    <Link
                        to="/products"
                        className="mt-7 inline-block rounded-lg bg-black px-6 py-3 font-semibold text-white transition hover:bg-gray-800"
                    >
                        Continue Shopping
                    </Link>
                </section>
            </main>
        );
    }

    if (cartLoading && !cart) {
        return (
            <p className="py-16 text-center text-gray-600">
                Loading checkout...
            </p>
        );
    }

    if (items.length === 0) {
        return (
            <main className="px-4 py-16 text-center">
                <h1 className="text-2xl font-bold text-gray-900">
                    Your cart is empty
                </h1>
                <Link
                    to="/products"
                    className="mt-5 inline-block rounded-lg bg-black px-5 py-3 text-white"
                >
                    Browse Products
                </Link>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-gray-50 px-4 py-10 sm:px-8">
            <div className="mx-auto max-w-6xl">
                <h1 className="text-3xl font-bold text-gray-900">
                    Checkout
                </h1>
                <p className="mt-2 text-gray-500">
                    Enter your delivery details to place your order.
                </p>

                {error && (
                    <p
                        role="alert"
                        className="mt-6 rounded-lg bg-red-50 p-4 text-red-700"
                    >
                        {error}
                    </p>
                )}

                <div className="mt-8 grid gap-8 lg:grid-cols-3">
                    <form
                        onSubmit={handleSubmit}
                        className="space-y-5 rounded-2xl border border-gray-200 bg-white p-6 sm:p-8 lg:col-span-2"
                    >
                        <h2 className="text-xl font-bold text-gray-900">
                            Delivery Address
                        </h2>

                        <div>
                            <label
                                htmlFor="fullName"
                                className="mb-2 block text-sm font-medium text-gray-700"
                            >
                                Full name
                            </label>
                            <input
                                id="fullName"
                                name="fullName"
                                value={formData.fullName}
                                onChange={handleChange}
                                required
                                maxLength={100}
                                autoComplete="name"
                                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-black"
                                placeholder="Enter your full name"
                            />
                        </div>

                        <div>
                            <label
                                htmlFor="phone"
                                className="mb-2 block text-sm font-medium text-gray-700"
                            >
                                Phone number
                            </label>
                            <input
                                id="phone"
                                name="phone"
                                type="tel"
                                inputMode="numeric"
                                pattern="[0-9]{10}"
                                maxLength={10}
                                value={formData.phone}
                                onChange={handleChange}
                                required
                                autoComplete="tel"
                                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-black"
                                placeholder="10-digit mobile number"
                            />
                        </div>

                        <div>
                            <label
                                htmlFor="address"
                                className="mb-2 block text-sm font-medium text-gray-700"
                            >
                                House name and street address
                            </label>
                            <textarea
                                id="address"
                                name="address"
                                value={formData.address}
                                onChange={handleChange}
                                required
                                maxLength={300}
                                autoComplete="street-address"
                                rows={3}
                                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-black"
                                placeholder="Enter your complete address"
                            />
                        </div>

                        <div className="grid gap-5 sm:grid-cols-2">
                            <div>
                                <label
                                    htmlFor="city"
                                    className="mb-2 block text-sm font-medium text-gray-700"
                                >
                                    City
                                </label>
                                <input
                                    id="city"
                                    name="city"
                                    value={formData.city}
                                    onChange={handleChange}
                                    required
                                    autoComplete="address-level2"
                                    className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-black"
                                />
                            </div>

                            <div>
                                <label
                                    htmlFor="state"
                                    className="mb-2 block text-sm font-medium text-gray-700"
                                >
                                    State
                                </label>
                                <input
                                    id="state"
                                    name="state"
                                    value={formData.state}
                                    onChange={handleChange}
                                    required
                                    autoComplete="address-level1"
                                    className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-black"
                                />
                            </div>
                        </div>

                        <div>
                            <label
                                htmlFor="pincode"
                                className="mb-2 block text-sm font-medium text-gray-700"
                            >
                                PIN code
                            </label>
                            <input
                                id="pincode"
                                name="pincode"
                                inputMode="numeric"
                                pattern="[0-9]{6}"
                                maxLength={6}
                                value={formData.pincode}
                                onChange={handleChange}
                                required
                                autoComplete="postal-code"
                                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-black"
                                placeholder="6-digit PIN code"
                            />
                        </div>

                        
<div className="rounded-xl border border-gray-200 p-4">
    <p className="font-semibold text-gray-900">
        Payment Method
    </p>

    <div className="mt-4 space-y-3">
        <label className="flex cursor-pointer items-start gap-3 rounded-lg border border-gray-200 p-3">
            <input
                type="radio"
                name="paymentMethod"
                value="COD"
                checked={paymentMethod === "COD"}
                onChange={(event) =>
                    setPaymentMethod(event.target.value)
                }
                className="mt-1"
            />

            <span>
                <span className="block font-medium text-gray-900">
                    Cash on Delivery
                </span>
                <span className="text-sm text-gray-500">
                    Pay when your order arrives.
                </span>
            </span>
        </label>

        <label className="flex cursor-pointer items-start gap-3 rounded-lg border border-gray-200 p-3">
            <input
                type="radio"
                name="paymentMethod"
                value="Razorpay"
                checked={paymentMethod === "Razorpay"}
                onChange={(event) =>
                    setPaymentMethod(event.target.value)
                }
                className="mt-1"
            />

            <span>
                <span className="block font-medium text-gray-900">
                    Pay Online
                </span>
                <span className="text-sm text-gray-500">
                    UPI, cards and other methods supported by Razorpay.
                </span>
            </span>
        </label>
    </div>
</div>

                        <button
                            type="submit"
                            disabled={submitting || cartLoading}
                            className="w-full rounded-lg bg-black px-5 py-3 font-semibold text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {submitting
    ? "Processing..."
    : paymentMethod === "COD"
      ? "Place Order"
      : "Pay Now"}
                        </button>
                    </form>

                    <aside className="h-fit rounded-2xl border border-gray-200 bg-white p-6">
                        <h2 className="text-xl font-bold text-gray-900">
                            Order Summary
                        </h2>

                        <div className="mt-5 space-y-4">
                            {items.map((item) => (
                                <div
                                    key={item.product?._id}
                                    className="flex justify-between gap-4 text-sm"
                                >
                                    <span className="text-gray-600">
                                        {item.product?.name} × {item.quantity}
                                    </span>
                                    <span className="shrink-0 font-medium text-gray-900">
                                        ₹
                                        {(
                                            (item.product?.price || 0) *
                                            item.quantity
                                        ).toFixed(2)}
                                    </span>
                                </div>
                            ))}
                        </div>

                        <div className="mt-5 flex justify-between border-t border-gray-200 pt-4 text-sm text-gray-600">
                            <span>Total items</span>
                            <span>{totalItems}</span>
                        </div>

                        <div className="mt-4 flex justify-between border-t border-gray-200 pt-4 text-lg font-bold text-gray-900">
                            <span>Total</span>
                            <span>₹{totalAmount.toFixed(2)}</span>
                        </div>

                        <p className="mt-3 text-xs text-gray-500">
                            Final product prices and stock are validated by
                            the server when you place your order.
                        </p>
                    </aside>
                </div>
            </div>
        </main>
    );
}
