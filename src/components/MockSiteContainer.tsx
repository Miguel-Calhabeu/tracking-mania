"use client";

import { useState } from 'react';
import { sendGTMEvent } from '@/lib/gtm';

export default function MockSiteContainer() {
    const [cartCount, setCartCount] = useState(0);

    return (
        <div className="border border-gray-200 rounded-lg shadow-sm bg-white font-sans">
            {/* Mock Header */}
            <header className="border-b border-gray-100 p-4 flex justify-between items-center">
                <div className="text-xl font-bold text-indigo-600">ShopMania</div>
                <div className="text-sm text-gray-600">
                    Cart: <span id="cart-count" className="font-bold">{cartCount}</span>
                </div>
            </header>

            {/* Mock Product Page */}
            <div className="p-6">
                <div className="flex gap-8">
                    {/* Product Image Placeholder */}
                    <div className="w-1/3 bg-gray-100 h-64 rounded-md flex items-center justify-center text-gray-400">
                        Product Image
                    </div>

                    {/* Product Details */}
                    <div className="flex-1 space-y-4">
                        <h1 className="text-2xl font-bold text-gray-900" id="product-name">
                            Premium Analytics Course
                        </h1>
                        <p className="text-gray-500">
                            Master the art of tracking with this comprehensive guide.
                        </p>
                        <div className="text-3xl font-bold text-gray-900" id="product-price">
                            $99.00
                        </div>

                        <div className="flex gap-4 pt-4">
                            <button
                                id="add-to-cart"
                                className="px-6 py-3 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors font-medium"
                                onClick={() => {
                                    setCartCount(c => c + 1);
                                    sendGTMEvent({
                                        event: 'add_to_cart',
                                        currency: 'USD',
                                        value: 99.00,
                                        items: [{
                                            item_id: 'prod_123',
                                            item_name: 'Premium Analytics Course',
                                            price: 99.00
                                        }]
                                    });
                                }}
                            >
                                Add to Cart
                            </button>
                            <button
                                id="view-details"
                                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors font-medium"
                            >
                                View Details
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mock Related Products */}
                <div className="mt-12">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">Related Products</h3>
                    <div className="grid grid-cols-3 gap-4">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="border border-gray-100 p-4 rounded-md">
                                <div className="h-32 bg-gray-50 rounded mb-2"></div>
                                <div className="font-medium text-gray-800">Related Item {i}</div>
                                <div className="text-sm text-gray-500">$49.00</div>
                                <button
                                    className="mt-2 w-full py-1 bg-gray-100 text-xs text-gray-700 rounded hover:bg-gray-200 related-product-click"
                                    data-id={`related-${i}`}
                                >
                                    View
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Mock Footer */}
            <footer className="mt-8 border-t border-gray-100 p-4 text-center text-xs text-gray-400">
                © 2024 ShopMania Inc.
            </footer>
        </div>
    );
}
