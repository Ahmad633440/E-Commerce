import { motion } from "framer-motion";
import { ShoppingCart, Trash2 } from "lucide-react";
import { useUserStore } from "../stores/useUserStore";
import { useProductStore } from "../stores/useProductStore";
import toast from "react-hot-toast";

const ProductCard = ({ product }) => {
	const { user } = useUserStore();
	const { deleteProduct } = useProductStore();

	const handleAddToCart = () => {
		if (!user) {
			toast.error("Please login to add items to cart");
			return;
		}
		// Add to cart logic here
		toast.success("Added to cart!");
	};

	const handleDeleteProduct = async () => {
		if (user?.role === "admin") {
			try {
				await deleteProduct(product._id);
				toast.success("Product deleted successfully");
			} catch (error) {
				toast.error("Failed to delete product");
			}
		}
	};

	return (
		<motion.div
			className='bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 max-w-sm w-full'
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.3 }}
		>
			{/* Product Image */}
			<div className='relative h-48 overflow-hidden bg-gray-700 group'>
				{product.image ? (
					<motion.img
						src={product.image}
						alt={product.name}
						className='w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 ease-out'
						initial={{ scale: 1 }}
						whileHover={{ scale: 1.1 }}
						transition={{ duration: 0.5 }}
					/>
				) : (
					<div className='w-full h-full flex items-center justify-center text-gray-500'>
						No Image
					</div>
				)}
			</div>

			{/* Product Info */}
			<div className='p-4'>
				<h3 className='text-lg font-semibold text-white mb-2 truncate'>{product.name}</h3>
				<p className='text-sm text-gray-400 mb-3 line-clamp-2'>{product.description}</p>

				<div className='flex items-center justify-between mb-4'>
					<span className='text-xl font-bold text-emerald-400'>${product.price.toFixed(2)}</span>
					<span className='text-xs bg-gray-700 text-gray-300 px-2 py-1 rounded'>
						{product.category}
					</span>
				</div>

				{/* Actions */}
				<div className='flex gap-2'>
					<button
						onClick={handleAddToCart}
						className='flex-1 bg-emerald-600 hover:bg-emerald-700 text-white py-2 px-3 rounded-md transition-colors duration-200 flex items-center justify-center gap-2'
					>
						<ShoppingCart size={18} />
						Add to Cart
					</button>

					{user?.role === "admin" && (
						<button
							onClick={handleDeleteProduct}
							className='bg-red-600 hover:bg-red-700 text-white py-2 px-3 rounded-md transition-colors duration-200'
						>
							<Trash2 size={18} />
						</button>
					)}
				</div>
			</div>
		</motion.div>
	);
};

export default ProductCard;
