import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { addProduct } from '../redux/productSlice'

function ProductForm() {
    const [formData, setFormData] = useState({
        name: '',
        price: '',
        category: '',
        stock: '',
        images: []
    })

    const dispatch = useDispatch()

    const handleChange = (e) => {
        const { name, value } = e.target

        setFormData({
            ...formData,
            [name]: value
        })
    }

    const handleImageChange = (e) => {
        setFormData({
            ...formData,
            images: Array.from(e.target.files)
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        const form = e.currentTarget

        const product = new FormData()

        product.append('name', formData.name)
        product.append('price', Number(formData.price))
        product.append('category', formData.category)
        product.append('stock', Number(formData.stock))

        formData.images.forEach((image) => {
            product.append('images', image)
        })

        const result = await dispatch(addProduct(product))
        if (addProduct.fulfilled.match(result)) {
            setFormData({
                name: '',
                price: '',
                category: '',
                stock: '',
                images: []
            })
            form.reset()
        }
    }

    return (
        <form onSubmit={handleSubmit} className="w-full">
            <div className="mb-3">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#71836e]">New listing</p>
                <h2 className="mt-2 text-2xl font-semibold tracking-[-0.05em] text-[#243a2f]">
                    Add Product
                </h2>
            </div>

            <p className="mb-6 text-sm leading-6 text-[#697067]">
                Add an item to your collection.
            </p>

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

            <div className="mb-4">
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

            <div className="mb-5">
                <label htmlFor="product-image" className="mb-1.5 block text-sm font-medium text-[#465248]">
                    Product Image
                </label>
                <input
                    id="product-image"
                    type="file"
                    name="images"
                    multiple
                    onChange={handleImageChange}
                    required
                    className="form-input"
                />
            </div>

            <button type="submit" className="product-submit w-full">
                Add Product
            </button>
        </form>
    )
}

export default ProductForm
