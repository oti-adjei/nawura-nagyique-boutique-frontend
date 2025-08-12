// components/checkout/OrderSummary.tsx
import type { CartItem } from '@/types/checkout';
import Image from 'next/image';
import { HiLockClosed } from "react-icons/hi2"; // Using Heroicons for lock
import { useLocationStore } from '@/store/location/useLocationStore';
import { useExchangeRates } from '@/hooks/useExchangeRates';



// A simple, reusable skeleton loader component
const SkeletonLoader = ({ className }: { className?: string }) => {
  return <div className={`bg-gray-200 rounded animate-pulse ${className}`} />;
};


interface OrderSummaryProps {
  items: CartItem[];
  subtotal: number;
  shipping: number;
  discount: number;
  total: number;
  discountCode: string;
  onDiscountCodeChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onApplyDiscount: () => void;
  isSubmitting: boolean;
  isCalculatingShipping?: boolean;
}

// Helper function to format currency
export function formatCurrency(amount: number, currency: string): string {
  if (currency === 'CAD') {
    // Use CDN$ for Canadian dollars
    return `CDN$${amount.toFixed(2)}`;
  }
  
  return new Intl.NumberFormat('en-CA', {
    style: 'currency',
    currency: currency,
  }).format(amount);
}

// Helper function to convert CAD to target currency
function convertAndFormat(cadAmount: number, targetCurrency: string, rates: { [key: string]: number }): string {
  if (targetCurrency === 'CAD') {
    return formatCurrency(cadAmount, 'CAD');
  }
  
  const rate = rates[targetCurrency];
  if (!rate) {
    return formatCurrency(cadAmount, 'CAD'); // Fallback to CAD
  }
  
  const convertedAmount = cadAmount * rate;
  const formattedAmount = formatCurrency(convertedAmount, targetCurrency);
  
  // Add approximate symbol for converted currencies
  return `≈ ${formattedAmount}`;
}

interface OrderSummaryProps {
  items: CartItem[];
  subtotal: number;
  shipping: number;
  discount: number;
  total: number;
  discountCode: string;
  onDiscountCodeChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onApplyDiscount: () => void;
  isSubmitting: boolean;
  isCalculatingShipping?: boolean;
}

const OrderSummary: React.FC<OrderSummaryProps> = ({
  items,
  subtotal,
  shipping,
  discount,
  total,
  discountCode,
  onDiscountCodeChange,
  onApplyDiscount,
  isSubmitting,
  isCalculatingShipping = false
}) => {
  const { currency } = useLocationStore();
  const { rates, loading: ratesLoading } = useExchangeRates();
  return (
    <div className="bg-white p-6 rounded-lg shadow top-8"> {/* Sticky positioning */}
      <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-100">Review your cart</h2>

      {/* Cart Items */}
      <div className="space-y-4 mb-6 max-h-60 overflow-y-auto pr-2"> {/* Scrollable item list */}
        {items.map((item) => (
          <div key={item.id} className="flex items-center gap-4">
            <div className="relative w-16 h-16 rounded overflow-hidden bg-gray-100 flex-shrink-0">
              <Image
                src={item.imageUrl}
                alt={item.name}
                fill
                className="object-cover"
                 sizes="64px"
              />
            </div>
            <div className="flex-grow">
              <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{item.name}</p>
              {/* {item.description && (
                 <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-1">{item.description}</p>
              )} */}
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {item.quantity} {item.quantity === 1 ? 'piece' : 'pieces'}
              </p>
            </div>
            <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{ratesLoading ? <SkeletonLoader className="h-5 w-20" /> : convertAndFormat(item.price * item.quantity, currency, rates)}</p>
          </div>
        ))}
      </div>

      {/* Discount Code */}
      <div className="mb-6">
        <label htmlFor="discountCode" className="sr-only">Discount code</label>
        <div className="flex rounded-md shadow-sm">
          <input
            type="text"
            id="discountCode"
            name="discountCode"
            placeholder="Discount code"
            value={discountCode}
            onChange={onDiscountCodeChange}
            className="flex-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-l-md focus:ring-pink-500 focus:border-pink-500 sm:text-sm dark:bg-gray-700 dark:text-gray-200"
          />
          <button
            type="button" // Prevent form submission
            onClick={onApplyDiscount}
            className="inline-flex items-center px-4 py-2 border border-l-0 border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-600 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-500 rounded-r-md focus:outline-none focus:ring-1 focus:ring-pink-500 focus:border-pink-500"
          >
            Apply
          </button>
        </div>
      </div>

      {/* Order Totals */}
      <div className="space-y-2 border-t border-gray-200 dark:border-gray-700 pt-4">
        <div className="flex justify-between text-sm text-gray-600 dark:text-gray-300">
          <span>Subtotal</span>
          <span>{convertAndFormat(subtotal, currency, rates)}</span>
        </div>
        <div className="flex justify-between text-sm text-gray-600 dark:text-gray-300">
          <span>Shipping</span>
          <span>
            {isCalculatingShipping ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-gray-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Calculating...
              </span>
            ) : (
              ratesLoading ? <SkeletonLoader className="h-5 w-20" /> : convertAndFormat(shipping, currency, rates)
            )}
          </span>
        </div>
        {discount > 0 && (
           <div className="flex justify-between text-sm text-green-600 dark:text-green-400">
            <span>Discount</span>
            <span>- {ratesLoading ? <SkeletonLoader className="h-5 w-16" /> : `-${convertAndFormat(discount, currency, rates)}`}</span>
          </div>
        )}
        <div className="flex justify-between text-base font-semibold text-gray-900 dark:text-gray-100 border-t border-gray-200 dark:border-gray-700 pt-2 mt-2">
          <span>Total</span>
          <span>{ratesLoading ? <SkeletonLoader className="h-6 w-28" /> : convertAndFormat(total, currency, rates)}
</span>
        </div>
      </div>

      {/* Pay Now Button */}
      <button
        type="submit" // This button submits the parent CheckoutClient form
        disabled={isSubmitting} // Disable when submitting
        className="w-full mt-6 bg-primary text-white py-3 px-4 rounded-md shadow-sm font-semibold hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 transition disabled:opacity-50"
      >
        {isSubmitting ? 'Processing...' : 'Pay Now'}
      </button>

      {/* Secure Checkout Info */}
      <div className="mt-4 flex items-center justify-center text-sm text-gray-500 dark:text-gray-400">
        <HiLockClosed className="w-4 h-4 mr-1.5 text-gray-400 dark:text-gray-500" aria-hidden="true" />
        Secure Checkout - SSL Encrypted
      </div>
       <p className="mt-1 text-xs text-center text-gray-500 dark:text-gray-400">
            Ensuring your financial and personal details are secure during every transaction.
       </p>
    </div>
  );
};

export default OrderSummary;