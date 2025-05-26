// components/checkout/CheckoutClient.tsx
"use client";

import { useState, useMemo, useCallback } from 'react';
import type { CartItem, CheckoutFormData, PaymentMethod } from '@/types/checkout'; // Adjust path
import OrderSummary from './OrderSummary'; // We'll create this next

interface CheckoutClientProps {
  initialCartItems: CartItem[];
  initialShippingCost: number;
}

const CheckoutClient: React.FC<CheckoutClientProps> = ({
  initialCartItems,
  initialShippingCost
}) => {
  const [cartItems, setCartItems] = useState<CartItem[]>(initialCartItems); // Could update if cart changes dynamically
  const [formData, setFormData] = useState<CheckoutFormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    country: '',
    address: '',
  });
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentMethod>('bank');
  const [discountCode, setDiscountCode] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState(10.00); // Example discount
  const [shippingCost, setShippingCost] = useState(initialShippingCost);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  }, []);

  const handlePaymentChange = useCallback((method: PaymentMethod) => {
    setSelectedPaymentMethod(method);
  }, []);

  const handleApplyDiscount = useCallback(() => {
    // Basic discount logic simulation
    console.log("Applying discount code:", discountCode);
    if (discountCode.toUpperCase() === 'DISCOUNT10') {
        setAppliedDiscount(10.00); // Apply a $10 discount
        alert("Discount applied!");
    } else {
        setAppliedDiscount(0);
        alert("Invalid discount code.");
    }
  }, [discountCode]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form Submitted!");
    // Combine all data for submission
    const orderData = {
      personalInfo: formData,
      paymentMethod: selectedPaymentMethod,
      items: cartItems,
      discountCodeApplied: discountCode,
      discountAmount: appliedDiscount,
      shipping: shippingCost,
      // Calculate total again here or ensure it's passed correctly
    };
    console.log("Order Data:", orderData);
    // Add actual submission logic here (e.g., API call to backend)
    alert("Order Placed (Simulation)!");
  };

  // Calculate subtotal
  const subtotal = useMemo(() => {
    return cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }, [cartItems]);

  // Calculate total
  const total = useMemo(() => {
    return subtotal + shippingCost - appliedDiscount;
  }, [subtotal, shippingCost, appliedDiscount]);


  return (
    <form onSubmit={handleSubmit}>
      <div className="grid grid-cols-1 lg:grid-cols-3 lg:gap-8 xl:gap-12">

        {/* Left Column: Personal Info, Payment, Policy */}
        <div className="lg:col-span-2 space-y-8">
          {/* Personal Information */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
            <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-100">Personal Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">First Name</label>
                <input type="text" id="firstName" name="firstName" value={formData.firstName} onChange={handleInputChange} required className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-pink-500 focus:border-pink-500 dark:bg-gray-700 dark:text-gray-200" />
              </div>
              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Last Name</label>
                <input type="text" id="lastName" name="lastName" value={formData.lastName} onChange={handleInputChange} required className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-pink-500 focus:border-pink-500 dark:bg-gray-700 dark:text-gray-200" />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
                <input type="email" id="email" name="email" value={formData.email} onChange={handleInputChange} required className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-pink-500 focus:border-pink-500 dark:bg-gray-700 dark:text-gray-200" />
              </div>
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Phone number</label>
                <input type="tel" id="phone" name="phone" value={formData.phone} onChange={handleInputChange} required className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-pink-500 focus:border-pink-500 dark:bg-gray-700 dark:text-gray-200" />
              </div>
              {/* Using Input for country for simplicity, replace with Select if needed */}
              <div className="md:col-span-2">
                <label htmlFor="country" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Country</label>
                <input type="text" id="country" name="country" value={formData.country} onChange={handleInputChange} required className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-pink-500 focus:border-pink-500 dark:bg-gray-700 dark:text-gray-200" />
                {/* <select id="country" name="country" value={formData.country} onChange={handleInputChange} required className="..."> Options </select> */}
              </div>
              <div className="md:col-span-2">
                <label htmlFor="address" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Address</label>
                <input type="text" id="address" name="address" value={formData.address} onChange={handleInputChange} required className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-pink-500 focus:border-pink-500 dark:bg-gray-700 dark:text-gray-200" />
              </div>
            </div>
          </div>

          {/* Payment Options */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
            <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-100">Payment Options</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Choose your payment option</p>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Payment Method Item */}
              {(['bank', 'paypal', 'stripe', 'cash'] as PaymentMethod[]).map((method) => (
                <button
                  key={method}
                  type="button" // Prevent form submission
                  onClick={() => handlePaymentChange(method)}
                  className={`w-full flex justify-between items-center p-4 border rounded-md cursor-pointer transition-colors duration-150 ${
                    selectedPaymentMethod === method
                      ? 'border-green-500 ring-1 ring-green-500 bg-green-50 dark:bg-green-900/30 dark:border-green-600'
                      : 'border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
                  }`}
                >
                  <span className="text-sm font-medium text-gray-800 dark:text-gray-200 capitalize">{method === 'bank' ? 'Bank Card' : method}</span>
                  {/* Custom Radio Lookalike */}
                  <div className={`w-4 h-4 border rounded-full flex items-center justify-center ${
                    selectedPaymentMethod === method ? 'border-green-500 bg-green-500' : 'border-gray-400 dark:border-gray-500'
                  }`}>
                    {selectedPaymentMethod === method && <div className="w-1.5 h-1.5 bg-white rounded-full"></div>}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Cancellation Policy */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
            <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-100">Cancellation Policy</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
              At Grabit, we understand that plans can change unexpectedly. That’s why we’ve crafted our cancellation policy to provide you with flexibility and peace of mind. When you book a car with us, you have the freedom to modify or cancel your reservation without incurring any cancellation fees up to 12 hours/days before your scheduled pick-up time. See more details.
            </p>
             {/* Optional: Add a "See more details" link/button if needed */}
          </div>
        </div>

        {/* Right Column: Order Summary */}
        <div className="lg:col-span-1 mt-8 lg:mt-0">
          <OrderSummary
            items={cartItems}
            subtotal={subtotal}
            shipping={shippingCost}
            discount={appliedDiscount}
            total={total}
            discountCode={discountCode}
            onDiscountCodeChange={(e) => setDiscountCode(e.target.value)}
            onApplyDiscount={handleApplyDiscount}
            // Note: Pay Now button is inside OrderSummary but form submit is handled here
          />
        </div>

      </div>
    </form>
  );
};

export default CheckoutClient;