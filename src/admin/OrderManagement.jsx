import { useEffect, useState } from "react";
import { axiosInstance } from "../api/axiosInstance";

const statuses = [
    "Processing",
    "Shipped",
    "Delivered",
    "Cancelled",
];

export default function OrderManagement() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [updatingId, setUpdatingId] = useState(null);

    const fetchOrders = async () => {
        try {
            setError("");
            const response = await axiosInstance.get("/order/");
            setOrders(response.data.orders || []);
        } catch (err) {
            setError(
                err.response?.data?.message ||
                    "Unable to load orders. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const handleStatusChange = async (orderId, orderStatus) => {
        const previousOrders = orders;

        setUpdatingId(orderId);
        setError("");

        // Update the displayed status immediately.
        setOrders((currentOrders) =>
            currentOrders.map((order) =>
                order._id === orderId
                    ? { ...order, orderStatus }
                    : order
            )
        );

        try {
            const response = await axiosInstance.patch(
                `/order/${orderId}/status`,
                { orderStatus }
            );

            setOrders((currentOrders) =>
                currentOrders.map((order) =>
                    order._id === orderId
                        ? { ...order, ...response.data.order }
                        : order
                )
            );
        } catch (err) {
            setOrders(previousOrders);
            setError(
                err.response?.data?.message ||
                    "Failed to update order status."
            );
        } finally {
            setUpdatingId(null);
        }
    };

    const formatDate = (date) =>
        new Date(date).toLocaleString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });

    const statusStyle = (status) => {
        switch (status) {
            case "Delivered":
                return "bg-green-100 text-green-800";
            case "Shipped":
                return "bg-blue-100 text-blue-800";
            case "Cancelled":
                return "bg-red-100 text-red-800";
            default:
                return "bg-amber-100 text-amber-800";
        }
    };

    if (loading) {
        return (
            <section className="page-section text-center">
                <p className="text-[#5f6f61]">Loading orders...</p>
            </section>
        );
    }

    return (
        <section className="page-section">
            <div className="mx-auto max-w-7xl">
                <header className="mb-8">
                    <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#71836e]">
                        Administration
                    </p>

                    <h1 className="text-3xl font-semibold tracking-tight text-[#1f2d24] sm:text-4xl">
                        Order Management
                    </h1>

                    <p className="mt-2 text-sm text-[#5f6f61]">
                        View customer purchases and manage delivery status.
                    </p>
                </header>

                <div className="mb-6 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-[#e1e5dc] bg-white p-5">
                    <div>
                        <p className="text-sm text-[#697067]">
                            Total orders
                        </p>
                        <p className="mt-1 text-3xl font-semibold text-[#1f2d24]">
                            {orders.length}
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={fetchOrders}
                        className="rounded-xl border border-[#d9e1d5] px-4 py-2.5 text-sm font-semibold text-[#354f3b] transition hover:bg-[#edf3e9]"
                    >
                        Refresh orders
                    </button>
                </div>

                {error && (
                    <div
                        role="alert"
                        className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800"
                    >
                        {error}
                    </div>
                )}

                {orders.length === 0 ? (
                    <div className="rounded-2xl border border-dashed border-[#cbd4c8] bg-white p-12 text-center">
                        <h2 className="text-xl font-semibold text-[#354439]">
                            No orders yet
                        </h2>
                        <p className="mt-2 text-sm text-[#697067]">
                            Customer orders will appear here after checkout.
                        </p>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {orders.map((order) => {
                            const isFinalized = [
                                "Delivered",
                                "Cancelled",
                            ].includes(order.orderStatus);

                            return (
                                <article
                                    key={order._id}
                                    className="overflow-hidden rounded-2xl border border-[#e1e5dc] bg-white shadow-sm"
                                >
                                    <div className="flex flex-wrap items-start justify-between gap-4 border-b border-[#edf0e9] bg-[#f5f7f2] p-5">
                                        <div>
                                            <p className="text-xs font-semibold uppercase tracking-wider text-[#71836e]">
                                                Order ID
                                            </p>
                                            <p className="mt-1 break-all text-sm font-semibold text-[#1f2d24]">
                                                {order._id}
                                            </p>
                                            <p className="mt-2 text-sm text-[#697067]">
                                                {formatDate(order.createdAt)}
                                            </p>
                                        </div>

                                        <div className="flex flex-wrap gap-2">
                                            <span
                                                className={`rounded-full px-3 py-1 text-xs font-semibold ${statusStyle(order.orderStatus)}`}
                                            >
                                                {order.orderStatus}
                                            </span>

                                            <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-700">
                                                Payment: {order.paymentStatus}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="grid gap-6 p-5 lg:grid-cols-2">
                                        <div>
                                            <h2 className="mb-3 font-semibold text-[#1f2d24]">
                                                Customer details
                                            </h2>

                                            <p className="text-sm text-[#354439]">
                                                {order.user?.name ||
                                                    order.shippingAddress?.fullName ||
                                                    "Customer"}
                                            </p>

                                            <p className="mt-1 break-all text-sm text-[#697067]">
                                                {order.user?.email ||
                                                    "Email unavailable"}
                                            </p>

                                            <div className="mt-4 rounded-xl bg-[#f8f9f6] p-4 text-sm text-[#5f6f61]">
                                                <p className="font-semibold text-[#354439]">
                                                    Delivery address
                                                </p>
                                                <p className="mt-2">
                                                    {order.shippingAddress?.fullName}
                                                </p>
                                                <p>
                                                    {order.shippingAddress?.phone}
                                                </p>
                                                <p>
                                                    {order.shippingAddress?.address}
                                                </p>
                                                <p>
                                                    {order.shippingAddress?.city},{" "}
                                                    {order.shippingAddress?.state}{" "}
                                                    - {order.shippingAddress?.pincode}
                                                </p>
                                            </div>
                                        </div>

                                        <div>
                                            <h2 className="mb-3 font-semibold text-[#1f2d24]">
                                                Ordered products
                                            </h2>

                                            <div className="space-y-4">
                                                {order.items?.map((item, index) => (
                                                    <div
                                                        key={item.product || index}
                                                        className="flex items-center gap-3"
                                                    >
                                                        {item.image ? (
                                                            <img
                                                                src={item.image}
                                                                alt={item.name}
                                                                className="h-14 w-14 rounded-lg border border-[#e1e5dc] object-cover"
                                                            />
                                                        ) : (
                                                            <div className="flex h-14 w-14 items-center justify-center rounded-lg bg-[#f0f2ec] text-xs text-gray-500">
                                                                No image
                                                            </div>
                                                        )}

                                                        <div className="min-w-0 flex-1">
                                                            <p className="font-medium text-[#354439]">
                                                                {item.name}
                                                            </p>
                                                            <p className="mt-1 text-sm text-[#697067]">
                                                                ₹{Number(item.price).toLocaleString("en-IN")}{" "}
                                                                × {item.quantity}
                                                            </p>
                                                        </div>

                                                        <p className="whitespace-nowrap text-sm font-semibold text-[#1f2d24]">
                                                            ₹{(
                                                                Number(item.price) *
                                                                Number(item.quantity)
                                                            ).toLocaleString("en-IN")}
                                                        </p>
                                                    </div>
                                                ))}
                                            </div>

                                            <div className="mt-5 border-t border-[#e1e5dc] pt-4">
                                                <div className="flex justify-between text-sm text-[#697067]">
                                                    <span>Payment method</span>
                                                    <span>
                                                        {order.paymentMethod === "COD"
                                                            ? "Cash on Delivery"
                                                            : order.paymentMethod}
                                                    </span>
                                                </div>

                                                <div className="mt-3 flex items-center justify-between">
                                                    <span className="font-semibold text-[#354439]">
                                                        Total amount
                                                    </span>
                                                    <span className="text-xl font-semibold text-[#1f2d24]">
                                                        ₹{Number(
                                                            order.totalAmount
                                                        ).toLocaleString("en-IN")}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[#edf0e9] p-5">
                                        <label
                                            htmlFor={`status-${order._id}`}
                                            className="text-sm font-semibold text-[#354439]"
                                        >
                                            Update order status
                                        </label>

                                        <select
                                            id={`status-${order._id}`}
                                            value={order.orderStatus}
                                            disabled={
                                                isFinalized ||
                                                updatingId === order._id
                                            }
                                            onChange={(event) =>
                                                handleStatusChange(
                                                    order._id,
                                                    event.target.value
                                                )
                                            }
                                            className="min-w-44 rounded-xl border border-[#d9e1d5] bg-white px-4 py-2.5 text-sm text-[#354439] outline-none focus:border-[#71836e] disabled:cursor-not-allowed disabled:bg-gray-100"
                                        >
                                            {statuses.map((status) => (
                                                <option
                                                    key={status}
                                                    value={status}
                                                >
                                                    {status}
                                                </option>
                                            ))}
                                        </select>

                                        {updatingId === order._id && (
                                            <p className="text-sm text-[#697067]">
                                                Updating...
                                            </p>
                                        )}
                                    </div>
                                </article>
                            );
                        })}
                    </div>
                )}
            </div>
        </section>
    );
}