
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { axiosInstance } from "../api/axiosInstance";

export default function MyOrders() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchMyOrders = async () => {
            try {
                const response = await axiosInstance.get(
                    "/order/my-orders"
                );

                setOrders(response.data.orders || []);
            } catch (err) {
                setError(
                    err.response?.data?.message ||
                        "Unable to load your orders."
                );
            } finally {
                setLoading(false);
            }
        };

        fetchMyOrders();
    }, []);

    const getStatusStyle = (status) => {
        switch (status) {
            case "Delivered":
            case "Paid":
                return "bg-green-100 text-green-800";
            case "Cancelled":
            case "Failed":
                return "bg-red-100 text-red-800";
            case "Shipped":
                return "bg-blue-100 text-blue-800";
            default:
                return "bg-amber-100 text-amber-800";
        }
    };

    if (loading) {
        return (
            <main className="px-4 py-16 text-center text-gray-600">
                Loading your orders...
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-gray-50 px-4 py-10 sm:px-8">
            <div className="mx-auto max-w-5xl">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">
                        My Orders
                    </h1>
                    <p className="mt-2 text-gray-500">
                        View your purchases and track their status.
                    </p>
                </div>

                {error && (
                    <div
                        role="alert"
                        className="rounded-xl bg-red-50 p-4 text-red-700"
                    >
                        {error}
                    </div>
                )}

                {!error && orders.length === 0 && (
                    <section className="rounded-2xl border border-gray-200 bg-white px-6 py-16 text-center">
                        <h2 className="text-xl font-semibold text-gray-900">
                            No orders yet
                        </h2>
                        <p className="mt-2 text-gray-500">
                            Your orders will appear here after you place one.
                        </p>
                        <Link
                            to="/products"
                            className="mt-6 inline-block rounded-lg bg-black px-6 py-3 font-semibold text-white hover:bg-gray-800"
                        >
                            Explore Products
                        </Link>
                    </section>
                )}

                <div className="space-y-6">
                    {orders.map((order) => (
                        <article
                            key={order._id}
                            className="overflow-hidden rounded-2xl border border-gray-200 bg-white"
                        >
                            <div className="flex flex-col gap-4 border-b border-gray-200 bg-gray-50 p-5 sm:flex-row sm:items-center sm:justify-between">
                                <div>
                                    <p className="text-sm text-gray-500">
                                        Order ID
                                    </p>
                                    <p className="mt-1 break-all font-semibold text-gray-900">
                                        {order._id}
                                    </p>
                                    <p className="mt-2 text-sm text-gray-500">
                                        Placed on{" "}
                                        {new Date(
                                            order.createdAt
                                        ).toLocaleDateString("en-IN", {
                                            day: "numeric",
                                            month: "short",
                                            year: "numeric",
                                        })}
                                    </p>
                                </div>

                                <div className="flex flex-wrap gap-2">
                                    <span
                                        className={`rounded-full px-3 py-1 text-sm font-medium ${getStatusStyle(
                                            order.orderStatus
                                        )}`}
                                    >
                                        {order.orderStatus}
                                    </span>
                                    <span
                                        className={`rounded-full px-3 py-1 text-sm font-medium ${getStatusStyle(
                                            order.paymentStatus
                                        )}`}
                                    >
                                        Payment: {order.paymentStatus}
                                    </span>
                                </div>
                            </div>

                            <div className="space-y-4 p-5">
                                {order.items.map((item, index) => (
                                    <div
                                        key={`${order._id}-${item.product}-${index}`}
                                        className="flex items-center gap-4"
                                    >
                                        <img
                                            src={
                                                item.image ||
                                                "https://placehold.co/100x100?text=Product"
                                            }
                                            alt={item.name}
                                            className="h-20 w-20 rounded-xl bg-gray-100 object-cover"
                                        />

                                        <div className="min-w-0 flex-1">
                                            <h2 className="font-semibold text-gray-900">
                                                {item.name}
                                            </h2>
                                            <p className="mt-1 text-sm text-gray-500">
                                                Quantity: {item.quantity}
                                            </p>
                                            <p className="mt-1 text-sm text-gray-600">
                                                ₹{Number(item.price).toFixed(2)}{" "}
                                                each
                                            </p>
                                        </div>

                                        <p className="shrink-0 font-semibold text-gray-900">
                                            ₹
                                            {(
                                                item.price * item.quantity
                                            ).toFixed(2)}
                                        </p>
                                    </div>
                                ))}
                            </div>

                            <div className="grid gap-5 border-t border-gray-200 p-5 sm:grid-cols-2">
                                <div>
                                    <h3 className="font-semibold text-gray-900">
                                        Delivery Address
                                    </h3>
                                    <p className="mt-2 text-sm leading-6 text-gray-600">
                                        {order.shippingAddress.fullName}
                                        <br />
                                        {order.shippingAddress.phone}
                                        <br />
                                        {order.shippingAddress.address}
                                        <br />
                                        {order.shippingAddress.city},{" "}
                                        {order.shippingAddress.state} -{" "}
                                        {order.shippingAddress.pincode}
                                    </p>
                                </div>

                                <div className="sm:text-right">
                                    <p className="text-sm text-gray-500">
                                        Payment method
                                    </p>
                                    <p className="mt-1 font-medium text-gray-900">
                                        {order.paymentMethod === "Razorpay"
    ? "Razorpay"
    : "Cash on Delivery"}
                                    </p>

                                    <p className="mt-4 text-sm text-gray-500">
                                        Order total
                                    </p>
                                    <p className="mt-1 text-2xl font-bold text-gray-900">
                                        ₹
                                        {Number(
                                            order.totalAmount
                                        ).toFixed(2)}
                                    </p>
                                </div>
                            </div>
                        </article>
                    ))}
                </div>
            </div>
        </main>
    );
}
