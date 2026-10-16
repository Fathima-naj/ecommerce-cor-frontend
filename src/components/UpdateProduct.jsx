import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { updateProduct } from '../redux/productSlice'
import { Link, useLocation, useNavigate } from 'react-router-dom'

function UpdateProduct() {
    const location = useLocation()
    const product = location.state?.product
    const navigate = useNavigate()
    const user = useSelector((state) => state.user.user)
    const { error, loading } = useSelector((state) => state.product)

    const [formData, setFormData] = useState({
        name: product?.name || '',
        price: product?.price || '',
        category: product?.category || '',
        stock: product?.stock || ''
    })

    const dispatch = useDispatch()

    const handleChange = (e) => {
        const { name, value } = e.target

        setFormData({
            ...formData,
            [name]: value
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        const updatedProduct = {
            name: formData.name,
            price: Number(formData.price),
            category: formData.category,
            stock: Number(formData.stock)
        }

        const result = await dispatch(updateProduct({ id: product._id, product: updatedProduct }))
        if (updateProduct.fulfilled.match(result)) navigate('/products')
    }

    if (user?.role !== 'admin') {
        return (
            <main className="page-section">
                <div className="mx-auto max-w-xl rounded-2xl border border-[#e1e5dc] bg-white/80 p-8 text-center shadow-sm">
                    <h1 className="text-xl font-semibold text-[#243a2f]">Administrator access required</h1>
                    <p className="mt-2 text-sm leading-6 text-[#697067]">Sign in with an administrator account to edit products.</p>
                    <Link to="/login" className="premium-button mt-5 px-6">Admin sign in</Link>
                </div>
            </main>
        )
    }

    if (!product) {
        return (
            <main className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-6 text-center">
                <p className="text-lg font-semibold text-[#243a2f]">Product not found.</p>
                <Link to="/products" className="ghost-button">
                    Back to products
                </Link>
            </main>
        )
    }

    return (
        <main className="page-section">
            <div className="mx-auto max-w-2xl">
                <form onSubmit={handleSubmit} className="product-form-card p-6 sm:p-8">
                    <div className="mb-6">
                        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#71836e]">Update</p>
                        <h2 className="mt-2 text-3xl font-semibold tracking-[-0.05em] text-[#21392f]">
                            Edit Product
                        </h2>
                    </div>

                    <p className="mb-6 text-sm leading-6 text-[#697067]">
                        Update the details for <span className="font-semibold text-[#2b4138]">{product.name}</span>.
                    </p>

                    {error && (
                        <p className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800" role="alert">
                            {error}
                        </p>
                    )}

                    <div className="mb-4">
                        <label htmlFor="product-name" className="mb-1.5 block text-sm font-medium text-[#465248]">
                            Product Name
                        </label>
                        <input
                            id="product-name"
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="Enter product name"
                            required
                            className="form-input"
                        />
                    </div>

                    <div className="mb-4">
                        <label htmlFor="product-category" className="mb-1.5 block text-sm font-medium text-[#465248]">
                            Category
                        </label>
                        <input
                            id="product-category"
                            type="text"
                            name="category"
                            value={formData.category}
                            onChange={handleChange}
                            placeholder="Enter category"
                            required
                            className="form-input"
                        />
                    </div>

                    <div className="mb-4">
                        <label htmlFor="product-price" className="mb-1.5 block text-sm font-medium text-[#465248]">
                            Price
                        </label>
                        <input
                            id="product-price"
                            type="number"
                            min="0"
                            step="0.01"
                            name="price"
                            value={formData.price}
                            onChange={handleChange}
                            placeholder="Enter price"
                            required
                            className="form-input"
                        />
                    </div>

                    <div className="mb-5">
                        <label htmlFor="product-stock" className="mb-1.5 block text-sm font-medium text-[#465248]">
                            Stock
                        </label>
                        <input
                            id="product-stock"
                            type="number"
                            min="0"
                            step="1"
                            name="stock"
                            value={formData.stock}
                            onChange={handleChange}
                            placeholder="Enter stock quantity"
                            required
                            className="form-input"
                        />
                    </div>

                    <div className="flex flex-col gap-3 sm:flex-row">
                        <button type="submit" disabled={loading} className="product-submit flex-1 disabled:cursor-not-allowed disabled:opacity-60">
                            {loading ? 'Saving...' : 'Update Product'}
                        </button>
                        <Link to="/products" className="secondary-button flex-1">
                            Cancel
                        </Link>
                    </div>
                </form>
            </div>
        </main>
    )
}

export default UpdateProduct