// components/checkout/CheckoutClient.tsx
"use client";

import { useState, useMemo, useCallback, useEffect, useRef } from 'react'; // Added useRef
import type { CartItem as CheckoutCartItem, CheckoutFormData, PaymentMethod, SelectOption } from '@/types/checkout';
import { Country as CountryService, State as StateService, City as CityService, ICountry, IState, ICity } from 'country-state-city';
import OrderSummary from './OrderSummary';
// import { Country } from '@/types/checkout';

import { loadStripe, StripeElementsOptions } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import StripeCheckoutForm, { StripeCheckoutFormHandle } from './StripeCheckoutForm'; // Import handle type
import LoadingSpinner from '@/components/common/LoadingSpinner';
import { useCartStore } from '@/store/cart/useCart';
import SelectCombobox from './CountrySelectCombobox';
import { PayBill } from './PayBill';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

interface CheckoutClientProps {
  initialShippingCost: number;
}
const CheckoutClient: React.FC<CheckoutClientProps> = ({
  initialShippingCost
}) => {
  const { items: cartItemsFromStore, clearCart } = useCartStore();
  const [formData, setFormData] = useState<CheckoutFormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    country: '',
    state: '',
    city: '',
    postalCode: '',
    address: '',
    // Optional fields can be marked with ?:
    // company?: string;
    // apartment?: string;
  });
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentMethod>('bank');
  const [discountCode, setDiscountCode] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState(0);
  const [shippingCost, setShippingCost] = useState(initialShippingCost);


  const [clientSecret, setClientSecret] = useState<string | null>(null);
  // const [isStripeLoading, setIsStripeLoading] = useState(false);
  // const [stripeError, setStripeError] = useState<string | null>(null); // For errors initializing Stripe
  const [formSubmissionMessage, setFormSubmissionMessage] = useState<string | null>(null); // For overall form submission status
  const [isSubmitting, setIsSubmitting] = useState(false); // For the main Pay Now button

  const stripeFormRef = useRef<StripeCheckoutFormHandle>(null); // Ref for StripeCheckoutForm


  const [countries, setCountries] = useState<SelectOption[]>([]);
  const [states, setStates] = useState<SelectOption[]>([]);
  const [cities, setCities] = useState<SelectOption[]>([]);

  const [isPayBillOpen, setIsPayBillOpen] = useState(false);


  // Fetch Countries on component mount
  useEffect(() => {
    const fetchedCountries = CountryService.getAllCountries().map((c: ICountry) => ({
      label: c.name,
      value: c.isoCode,
      originalData: c, // Keep original data if needed
    }));
    setCountries(fetchedCountries);;
  }, []);

  // Fetch States when Country changes
  useEffect(() => {
    if (formData.country) {
      const fetchedStates = StateService.getStatesOfCountry(formData.country).map((s: IState) => ({
        label: s.name,
        value: s.isoCode,
        originalData: s,
      }));
      setStates(fetchedStates);
      // Reset state and city if country changes
      setFormData(prev => ({
        ...prev,
        // selectedStateValue: '',
        // selectedStateLabel: '',
        // selectedCityValue: '',
        // selectedCityLabel: '',
      }));
    } else {
      setStates([]); // Clear states if no country is selected
    }
  }, [formData.country]);

  // Fetch Cities when State changes
  useEffect(() => {
    // FIX: Use formData.selectedCountryValue and formData.selectedStateValue
    if (formData.state && formData.country) {
      const fetchedCities = CityService.getCitiesOfState(
        formData.country, // Use country
        formData.state   // Use selectedStateValue
      ).map((c: ICity) => ({
        label: c.name,
        // FIX: Create a composite key for 'value' as 'id' does not exist on ICity
        value: `${c.name}-${c.stateCode}-${c.countryCode}`,
        originalData: c, // Keep original data if needed
      }));
      setCities(fetchedCities);
      // Reset city if state changes
      setFormData(prev => ({
        ...prev,
        // selectedCityValue: '',
        // selectedCityLabel: '',
      }));
    } else {
      setCities([]); // Clear cities if no state/country is selected
    }
    // FIX: Update dependency array to match the formData properties used
  }, [formData.state, formData.country]);


  const handleCountrySelect = (option: SelectOption | null) => {
    setFormData(prevData => ({
      ...prevData,
      country: option ? option.value : '',
      state: '',
      // selectedStateLabel: '',
      city: '',
      // selectedCityLabel: '',
    }));
  };


  const handleStateSelect = (option: SelectOption | null) => {
    setFormData(prevData => ({
      ...prevData,
      state: option ? option.value : '',
      city: '',
      // selectedCityLabel: '',
    }));
  };

  const handleCitySelect = (option: SelectOption | null) => {
    setFormData(prevData => ({
      ...prevData,
      city: option ? option.value : '',
    }));
  };


  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  }, []);

  const handlePaymentChange = useCallback((method: PaymentMethod) => {
    setSelectedPaymentMethod(method);
    setFormSubmissionMessage(null); // Clear previous submission messages
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

  // UPDATED handleSubmit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);
    setFormSubmissionMessage(null);

    //console log form data
    console.log("Form Data:", formData);

   if (selectedPaymentMethod === 'stripe') {
      // Instead of trying to render here...
      // ...you just update the state.
      setIsPayBillOpen(true);
      return; // Stop the rest of the function from running for now
    } 
    // finally {
    //   setIsSubmitting(false); // Reset submitting state after submission
    // }


   /* if (selectedPaymentMethod === 'stripe') {
      if (!stripeFormRef.current) {
        setFormSubmissionMessage("Stripe form is not ready. Please wait.");
        setIsSubmitting(false);
        return;
      }
      if (!clientSecret) {
        setFormSubmissionMessage("Stripe payment is not initialized. Please ensure card details section is loaded.");
        setIsSubmitting(false);
        return;
      }

      // Trigger Stripe payment
      const stripeResult = await stripeFormRef.current.triggerSubmit();

      if (stripeResult.success) {
        // Stripe.js will handle the redirect to the success URL if payment is fully 'succeeded'.
        // If status is 'processing', it might redirect or user might stay on page.
        // The StripeCheckoutForm's internal message state will show "Payment Succeeded! Redirecting..." or "Processing..."
        // We don't strictly need to set a message here unless the Stripe form itself doesn't update user.
        setFormSubmissionMessage(`Stripe payment status: ${stripeResult.paymentIntentStatus}. Follow prompts or wait for redirection.`);
        // Clear cart is handled inside StripeCheckoutForm on 'succeeded' or by webhook.
      } else {
        setFormSubmissionMessage(stripeResult.error || "Stripe payment failed. Please check your details or try another card.");
      }
    } else {
      // Handle other payment methods
      console.log("Form Submitted for non-Stripe payment!");
      const orderData = {
        personalInfo: formData,
        paymentMethod: selectedPaymentMethod,
        items: cartItemsFromStore,
        discountCodeApplied: discountCode,
        discountAmount: appliedDiscount,
        shipping: shippingCost,
        total: total,
        // ... other data
      };
      console.log("Order Data:", orderData);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setFormSubmissionMessage(`Order placed successfully with ${selectedPaymentMethod}!`);
      clearCart(); // Clear cart for non-Stripe successful simulated payments
    }
    setIsSubmitting(false);*/
  };

  const subtotal = useMemo(() => cartItemsFromStore.reduce((sum, item) => sum + item.price * item.quantity, 0), [cartItemsFromStore]);
  const total = useMemo(() => subtotal + shippingCost - appliedDiscount, [subtotal, shippingCost, appliedDiscount]);

  const stripeElementsOptions: StripeElementsOptions | undefined = clientSecret ? { clientSecret, appearance: { theme: 'stripe' } } : undefined;

  if (cartItemsFromStore.length === 0) { /* ... empty cart message ... */ }

  const handleClosePayBill = useCallback(() => {
    setIsPayBillOpen(false);
    setIsSubmitting(false); // Reset isSubmitting when PayBill modal is closed
  }, []);

  return (
    <>
    
      <form onSubmit={handleSubmit}> {/* This form's submit is now primary */}
        <div className="grid grid-cols-1 lg:grid-cols-3 lg:gap-8 xl:gap-12">
          <div className="lg:col-span-2 space-y-8">
            {/* Personal Information ... */}
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
             
                <div className="md:col-span-2">
                  <SelectCombobox
                    options={countries} 
                    onOptionSelect={handleCountrySelect}
                    initialSelectedValue={formData.country}
                    label="Country"
                    placeholder="Search for a country..."
                  />
                </div>

                {formData.country && ( // Only show states if a country is selected
                  <div className="mb-6">
                    <SelectCombobox
                      id="state-select"
                      label="State"
                      placeholder="Search for a state..."
                      options={states}
                      onOptionSelect={handleStateSelect}
                      initialSelectedValue={formData.state}
                    />
                  </div>
                )}

                {formData.state && ( // Only show cities if a state is selected
                  <div className="mb-6">
                    <SelectCombobox
                      id="city-select"
                      label="City"
                      placeholder="Search for a city..."
                      options={cities}
                      onOptionSelect={handleCitySelect}
                      initialSelectedValue={formData.city}
                    />
                  </div>
                )}
                <div className="md:col-span-2">
                  <label htmlFor="address" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Address</label>
                  <input type="text" id="address" name="address" value={formData.address} onChange={handleInputChange} required className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-pink-500 focus:border-pink-500 dark:bg-gray-700 dark:text-gray-200" />
                </div>
              </div>
            </div>


            {/* Payment Options ... */}

            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
              <h2 className="text-lg font-semibold mb-4">Payment Options</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Choose your payment option</p>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* ... payment method selectors ... */}
                {(['bank', 'paypal', 'stripe', 'cash'] as PaymentMethod[]).map((method) => (
                  <button
                    key={method}
                    type="button"
                    onClick={() => handlePaymentChange(method)}
                    className={`w-full flex justify-between items-center p-4 border rounded-md cursor-pointer transition-colors duration-150 ${selectedPaymentMethod === method
                      ? 'border-green-500 ring-1 ring-green-500 bg-green-50 dark:bg-green-900/30 dark:border-green-600'
                      : 'border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
                      }`}
                  >
                    <span className="text-sm font-medium text-gray-800 dark:text-gray-200 capitalize">{method === 'bank' ? 'Bank Card' : method}</span>
                    {/* Custom Radio Lookalike */}
                    <div className={`w-4 h-4 border rounded-full flex items-center justify-center ${selectedPaymentMethod === method ? 'border-green-500 bg-green-500' : 'border-gray-400 dark:border-gray-500'
                      }`}>
                      {selectedPaymentMethod === method && <div className="w-1.5 h-1.5 bg-white rounded-full"></div>}
                    </div>
                  </button>
                ))}

                {/*
                {selectedPaymentMethod === 'stripe' && (
                  <div className="mt-6 border-t pt-6">
                    <h3 className="text-md font-semibold mb-3">Enter Card Details (via Stripe)</h3>
                    {isStripeLoading && <div className="flex items-center justify-center p-4"><LoadingSpinner /><p className="ml-2">Initializing...</p></div>}
                    {stripeError && <div className="text-red-500 p-3 rounded mb-4">{stripeError}</div>}
                    {clientSecret && stripeElementsOptions && !isStripeLoading && !stripeError && (
                      <Elements options={stripeElementsOptions} stripe={stripePromise}>
                        <StripeCheckoutForm ref={stripeFormRef} /> 
                      </Elements>
                    )}
                  </div>
                )}
                */}
  
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

          </div>


          <div className="lg:col-span-1 mt-8 lg:mt-0">
            <OrderSummary
              items={cartItemsFromStore as CheckoutCartItem[]}
              subtotal={subtotal}
              shipping={shippingCost}
              discount={appliedDiscount}
              total={total}
              discountCode={discountCode}
              onDiscountCodeChange={(e) => setDiscountCode(e.target.value)}
              onApplyDiscount={handleApplyDiscount}
              isSubmitting={isSubmitting} // Pass isSubmitting to disable button
            />
            {formSubmissionMessage && (
              <div className={`mt-4 p-3 rounded-md text-sm ${formSubmissionMessage.includes('success') || formSubmissionMessage.includes('succeeded') || formSubmissionMessage.includes('processing') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                {formSubmissionMessage}
              </div>
            )}
          </div>

         <PayBill
        open={isPayBillOpen}
        onClose={handleClosePayBill} 
        // onClose={() => setIsPayBillOpen(false)}
      />
        </div>
      </form>
    </>
  );
};

export default CheckoutClient;