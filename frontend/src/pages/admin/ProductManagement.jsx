import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { adminAPI } from '../../services/api';
import { getImageUrl } from '../../utils/url';
import toast from 'react-hot-toast';

export const ProductManagement = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [errors, setErrors] = useState({});
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        category: '',
        stockQty: '',
        sizes: [],
        isActive: true,
    });
    const [images, setImages] = useState([]);

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const res = await adminAPI.getAllProducts();
            setProducts(res.data.data);
        } catch (error) {
            console.error('Error fetching products:', error);
            toast.error('Failed to load products');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        let newErrors = {};
        if (!formData.name.trim()) newErrors.name = "Name is required.";
        if (!formData.description.trim()) newErrors.description = "Description is required.";
        if (!formData.price || formData.price <= 0) newErrors.price = "Valid price is required.";
        if (!formData.category.trim()) newErrors.category = "Category is required.";
        if (formData.stockQty === '' || formData.stockQty < 0) newErrors.stockQty = "Valid stock quantity is required.";
        if (!editingProduct && images.length === 0) newErrors.images = "At least one image is required.";
        
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        setErrors({});

        const formDataToSend = new FormData();
        formDataToSend.append('name', formData.name);
        formDataToSend.append('description', formData.description);
        formDataToSend.append('price', formData.price);
        formDataToSend.append('category', formData.category);
        formDataToSend.append('stockQty', formData.stockQty);
        formDataToSend.append('sizes', JSON.stringify(formData.sizes));
        formDataToSend.append('isActive', formData.isActive);

        images.forEach((image) => {
            formDataToSend.append('images', image);
        });

        try {
            if (editingProduct) {
                await adminAPI.updateProduct(editingProduct.id, formDataToSend);
                toast.success('Product updated successfully');
            } else {
                await adminAPI.createProduct(formDataToSend);
                toast.success('Product created successfully');
            }

            setShowModal(false);
            resetForm();
            fetchProducts();
        } catch (error) {
            console.error('Error saving product:', error);
            toast.error(error.response?.data?.message || 'Failed to save product');
        }
    };

    const handleEdit = (product) => {
        setEditingProduct(product);
        setFormData({
            name: product.name,
            description: product.description,
            price: product.price,
            category: product.category,
            stockQty: product.stockQty,
            sizes: product.sizes || [],
            isActive: product.isActive,
        });
        setShowModal(true);
    };

    const handleDelete = async (id) => {
        if (!confirm('Are you sure you want to delete this product?')) return;

        try {
            await adminAPI.deleteProduct(id);
            toast.success('Product deleted successfully');
            fetchProducts();
        } catch (error) {
            console.error('Error deleting product:', error);
            toast.error('Failed to delete product');
        }
    };

    const resetForm = () => {
        setFormData({
            name: '',
            description: '',
            price: '',
            category: '',
            stockQty: '',
            sizes: [],
            isActive: true,
        });
        setImages([]);
        setEditingProduct(null);
        setErrors({});
    };

    const handleImageChange = (e) => {
        setImages(Array.from(e.target.files));
    };

    return (
        <AdminLayout>
            <div>
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-4xl font-bold text-gray-900">Products</h1>
                    <button
                        onClick={() => {
                            resetForm();
                            setShowModal(true);
                        }}
                        className="btn-primary"
                    >
                        + Add Product
                    </button>
                </div>

                {loading ? (
                    <div className="space-y-4">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="skeleton h-24 rounded-xl"></div>
                        ))}
                    </div>
                ) : (
                    <div className="bg-white rounded-xl shadow-md overflow-hidden">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b border-gray-200">
                                <tr>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Product</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Category</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Price</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Stock</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Status</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {products.map((product) => (
                                    <tr key={product.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <a href={getImageUrl(product.images[0])} target="_blank" rel="noopener noreferrer" className="shrink-0 group relative block">
                                                    <img
                                                        src={getImageUrl(product.images[0])}
                                                        alt={product.name}
                                                        className="w-12 h-12 object-cover rounded-lg border border-gray-200 group-hover:opacity-75 transition-opacity"
                                                    />
                                                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <svg className="w-5 h-5 text-gray-900 bg-white/80 rounded-full p-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                                        </svg>
                                                    </div>
                                                </a>
                                                <div>
                                                    <p className="font-semibold text-gray-900">{product.name}</p>
                                                    <p className="text-sm text-gray-600 line-clamp-1">{product.description}</p>
                                                    <a href={getImageUrl(product.images[0])} target="_blank" rel="noopener noreferrer" className="text-xs text-primary-600 hover:underline inline-block mt-0.5 max-w-[150px] truncate" title={getImageUrl(product.images[0])}>
                                                        {getImageUrl(product.images[0])}
                                                    </a>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="badge-info">{product.category}</span>
                                        </td>
                                        <td className="px-6 py-4 font-semibold text-gray-900">
                                            ₹{product.price.toLocaleString()}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={product.stockQty > 10 ? 'badge-success' : 'badge-warning'}>
                                                {product.stockQty}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            {product.isActive ? (
                                                <span className="badge-success">Active</span>
                                            ) : (
                                                <span className="badge-danger">Inactive</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => handleEdit(product)}
                                                    className="text-primary-600 hover:text-primary-700 font-medium"
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(product.id)}
                                                    className="text-red-600 hover:text-red-700 font-medium"
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* Modal */}
                {showModal && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-8"
                        >
                            <h2 className="text-2xl font-bold text-gray-900 mb-6">
                                {editingProduct ? 'Edit Product' : 'Add New Product'}
                            </h2>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Product Name *
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => { setFormData({ ...formData, name: e.target.value }); setErrors({ ...errors, name: '' }); }}
                                        required
                                        className={`input-field ${errors.name ? 'border-red-500 bg-red-50' : ''}`}
                                    />
                                    {errors.name && <p className="text-red-500 text-xs mt-1 font-medium">{errors.name}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Description *
                                    </label>
                                    <textarea
                                        value={formData.description}
                                        onChange={(e) => { setFormData({ ...formData, description: e.target.value }); setErrors({ ...errors, description: '' }); }}
                                        required
                                        rows="3"
                                        className={`input-field ${errors.description ? 'border-red-500 bg-red-50' : ''}`}
                                    />
                                    {errors.description && <p className="text-red-500 text-xs mt-1 font-medium">{errors.description}</p>}
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            Price *
                                        </label>
                                        <input
                                            type="number"
                                            value={formData.price}
                                            onChange={(e) => { setFormData({ ...formData, price: e.target.value }); setErrors({ ...errors, price: '' }); }}
                                            required
                                            min="0"
                                            className={`input-field ${errors.price ? 'border-red-500 bg-red-50' : ''}`}
                                        />
                                        {errors.price && <p className="text-red-500 text-xs mt-1 font-medium">{errors.price}</p>}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            Category *
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.category}
                                            onChange={(e) => { setFormData({ ...formData, category: e.target.value }); setErrors({ ...errors, category: '' }); }}
                                            required
                                            className={`input-field ${errors.category ? 'border-red-500 bg-red-50' : ''}`}
                                        />
                                        {errors.category && <p className="text-red-500 text-xs mt-1 font-medium">{errors.category}</p>}
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Stock Quantity *
                                    </label>
                                    <input
                                        type="number"
                                        value={formData.stockQty}
                                        onChange={(e) => { setFormData({ ...formData, stockQty: e.target.value }); setErrors({ ...errors, stockQty: '' }); }}
                                        required
                                        min="0"
                                        className={`input-field ${errors.stockQty ? 'border-red-500 bg-red-50' : ''}`}
                                    />
                                    {errors.stockQty && <p className="text-red-500 text-xs mt-1 font-medium">{errors.stockQty}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Available Sizes & Quantities
                                    </label>
                                    <div className="space-y-2">
                                        {formData.sizes.map((s, index) => (
                                            <div key={index} className="flex gap-2">
                                                <input
                                                    type="text"
                                                    placeholder="Size (e.g. S, M, L)"
                                                    value={s.size}
                                                    onChange={(e) => {
                                                        const newSizes = [...formData.sizes];
                                                        newSizes[index].size = e.target.value;
                                                        setFormData({ ...formData, sizes: newSizes });
                                                    }}
                                                    className="input-field flex-1"
                                                />
                                                <input
                                                    type="number"
                                                    placeholder="Qty"
                                                    value={s.quantity}
                                                    onChange={(e) => {
                                                        const newSizes = [...formData.sizes];
                                                        newSizes[index].quantity = parseInt(e.target.value) || 0;
                                                        
                                                        // Update total stockQty
                                                        const total = newSizes.reduce((sum, sz) => sum + (parseInt(sz.quantity) || 0), 0);
                                                        setFormData(prev => ({ ...prev, sizes: newSizes, stockQty: total }));
                                                    }}
                                                    className="input-field w-24"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        const newSizes = formData.sizes.filter((_, i) => i !== index);
                                                        const total = newSizes.reduce((sum, sz) => sum + (parseInt(sz.quantity) || 0), 0);
                                                        setFormData({ ...formData, sizes: newSizes, stockQty: total });
                                                    }}
                                                    className="text-red-500 hover:text-red-700 px-2"
                                                >
                                                    ✕
                                                </button>
                                            </div>
                                        ))}
                                        <button
                                            type="button"
                                            onClick={() => setFormData({ ...formData, sizes: [...formData.sizes, { size: '', quantity: 0 }] })}
                                            className="text-sm text-primary-600 font-semibold hover:underline"
                                        >
                                            + Add Size
                                        </button>
                                    </div>
                                </div>

                                <div>
                                    <label className="flex items-center gap-2">
                                        <input
                                            type="checkbox"
                                            checked={formData.isActive}
                                            onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                                            className="w-5 h-5 text-primary-600 rounded"
                                        />
                                        <span className="font-semibold text-gray-700">Active</span>
                                    </label>
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Product Images {!editingProduct && '*'}
                                    </label>
                                    <input
                                        type="file"
                                        onChange={(e) => { handleImageChange(e); setErrors({ ...errors, images: '' }); }}
                                        multiple
                                        accept="image/*"
                                        required={!editingProduct}
                                        className={`input-field ${errors.images ? 'border-red-500 bg-red-50' : ''}`}
                                    />
                                    {errors.images && <p className="text-red-500 text-xs mt-1 font-medium">{errors.images}</p>}
                                    <p className="text-sm text-gray-600 mt-1">
                                        {editingProduct ? 'Leave empty to keep existing images' : 'Select one or more images'}
                                    </p>
                                    {images.length > 0 && (
                                        <div className="flex gap-2 mt-4 overflow-x-auto pb-2">
                                            {images.map((img, i) => (
                                                <img key={i} src={URL.createObjectURL(img)} alt="Preview" className="h-16 w-16 object-cover rounded-md shadow-sm border border-gray-200" />
                                            ))}
                                        </div>
                                    )}
                                </div>

                                <div className="flex gap-4 pt-4">
                                    <button type="submit" className="flex-1 btn-primary">
                                        {editingProduct ? 'Update Product' : 'Create Product'}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setShowModal(false);
                                            resetForm();
                                        }}
                                        className="flex-1 btn-secondary"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
};
