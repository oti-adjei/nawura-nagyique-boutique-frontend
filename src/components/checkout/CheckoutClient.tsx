"use client";

import { useState, useMemo, useCallback, useEffect } from 'react'; // Added useRef
import type { CartItem as CheckoutCartItem, CheckoutFormData, PaymentMethod, SelectOption } from '@/types/checkout';
import { Country as CountryService, State as StateService, City as CityService, ICountry, IState, ICity } from 'country-state-city';
import OrderSummary from './OrderSummary';
import { useCartStore } from '@/store/cart/useCart';
import SelectCombobox from './CountrySelectCombobox';
import { PayBill } from './PayBill';
import { PaypalPayBill } from './PayBilllPaypal';

// const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

interface CheckoutClientProps {
  initialShippingCost: number;
}
const CheckoutClient: React.FC<CheckoutClientProps> = ({
  initialShippingCost
}) => {
  const { items: cartItemsFromStore } = useCartStore();
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

  // New state to track shipping calculation status
  const [isCalculatingShipping, setIsCalculatingShipping] = useState(false);


  // const [clientSecret, setClientSecret] = useState<string | null>(null);
  // const [isStripeLoading, setIsStripeLoading] = useState(false);
  // const [stripeError, setStripeError] = useState<string | null>(null); // For errors initializing Stripe
  const [formSubmissionMessage, setFormSubmissionMessage] = useState<string | null>(null); // For overall form submission status
  const [isSubmitting, setIsSubmitting] = useState(false); // For the main Pay Now button


  const [countries, setCountries] = useState<SelectOption[]>([]);
  const [states, setStates] = useState<SelectOption[]>([]);
  const [cities, setCities] = useState<SelectOption[]>([]);

  const [isPayBillOpen, setIsPayBillOpen] = useState(false);
  const [isPaypalPayBillOpen, setIsPaypalPayBillOpen] = useState(false);


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



   // NEW: Function to calculate shipping and taxes from Canada
  const calculateShippingAndTaxes = useCallback(async (country: string, state: string, city: string): Promise<number> => {
    //console.log(`Calculating shipping for ${city}, ${state}, ${country}`);
    // This is a simulation. In a real app, you would make an API call here.
    // e.g., await fetch('/api/shipping-rate', { method: 'POST', body: JSON.stringify({ country, state, city }) });
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));

    let calculatedCost = 0;
    const baseShipping = 15.00; // Base cost for shipping from Canada

    // Country-based cost adjustments
    if (country === 'CA') { // Domestic
      calculatedCost = baseShipping; 
    } else if (country === 'US') { // To USA
      calculatedCost = baseShipping + 10.00;
    } else { // International
      calculatedCost = baseShipping + 25.00;
    }

    // Tax calculation simulation
    let taxRate = 0;
    if (country === 'CA') {
      // Provincial Sales Tax (PST/GST/HST) simulation for Canada
      const provinceTaxes: { [key: string]: number } = {
        'ON': 0.13, 'BC': 0.12, 'NS': 0.15, 'NB': 0.15, 'NL': 0.15,
        'PE': 0.15, 'QC': 0.14975, 'MB': 0.12, 'SK': 0.11
      };
      taxRate = provinceTaxes[state] || 0.05; // Default to 5% GST if not specified
    } else {
      // Simulate flat 5% customs/duties for international shipments
      taxRate = 0.05;
    }
    //use city tax rate and add to state adn country tax
    if(city === 'Montreal'){
      taxRate += 0.02;
    } else if(city === 'Vancouver'){
      taxRate += 0.03;
    } else if(city === 'Toronto'){
      taxRate += 0.07;
    } else if(city === 'Ottawa'){
      taxRate += 0.06;
    } else if(city === 'Calgary'){
      taxRate += 0.01;
    } else if(city === 'Edmonton'){
      taxRate += 0.08;
    } else if(city === 'Winnipeg'){
      taxRate += 0.04;
    } else {
      // Default to 5% GST for other cities
      taxRate = 0.05;
    }
    
    
    const taxAmount = calculatedCost * taxRate;
    const finalCost = calculatedCost + taxAmount;

    //console.log(`Base: $${baseShipping}, Adjusted: $${calculatedCost}, Tax: $${taxAmount.toFixed(2)}, Final: $${finalCost.toFixed(2)}`);
    return parseFloat(finalCost.toFixed(2));
  }, []);

  // NEW: useEffect to trigger shipping calculation
  useEffect(() => {
    // Only calculate if all location fields are selected
    if (formData.country && formData.state && formData.city) {
      setIsCalculatingShipping(true);
      calculateShippingAndTaxes(formData.country, formData.state, formData.city)
        .then(newCost => {
          setShippingCost(newCost);
        })
        .catch(error => {
          console.error("Failed to calculate shipping:", error);
          // Optionally, set a default or show an error
          setShippingCost(initialShippingCost);
        })
        .finally(() => {
          setIsCalculatingShipping(false);
        });
    }
  }, [formData.city, formData.state, formData.country, calculateShippingAndTaxes, initialShippingCost]);


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
    //console.log("Applying discount code:", discountCode);
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
    if (isSubmitting || isCalculatingShipping) return; // Also block submission while calculating shipping

    setIsSubmitting(true);
    setFormSubmissionMessage(null);

    //console log form data
    //console.log("Form Data:", formData);

   if (selectedPaymentMethod === 'stripe') {
      // Instead of trying to render here...
      // ...you just update the state.
      setIsPayBillOpen(true);
      return; // Stop the rest of the function from running for now
    } 
    else if (selectedPaymentMethod === 'paypal') {

      setIsPaypalPayBillOpen(true);
      return; // Stop the rest of the function from running for now
    }
  };

  const subtotal = useMemo(() => cartItemsFromStore.reduce((sum, item) => sum + item.price * item.quantity, 0), [cartItemsFromStore]);
  const total = useMemo(() => subtotal + shippingCost - appliedDiscount, [subtotal, shippingCost, appliedDiscount]);

  // const stripeElementsOptions: StripeElementsOptions | undefined = clientSecret ? { clientSecret, appearance: { theme: 'stripe' } } : undefined;

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
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-lg font-semibold mb-4  dark:text-gray-100">Personal Information</h2>
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

            <div className="bg-white  p-6 rounded-lg shadow">
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
                    <span className="text-sm font-medium  dark:text-gray-200 capitalize">{method === 'bank' ? 'Bank Card' : method}</span>
                    {/* Custom Radio Lookalike */}
                    <div className={`w-4 h-4 border rounded-full flex items-center justify-center ${selectedPaymentMethod === method ? 'border-green-500 bg-green-500' : 'border-gray-400 dark:border-gray-500'
                      }`}>
                      {selectedPaymentMethod === method && <div className="w-1.5 h-1.5 bg-white rounded-full"></div>}
                    </div>
                  </button>
                ))}
  
              </div>
              {/* Cancellation Policy */}
              <div className="bg-white  p-6 rounded-lg shadow">
                <h2 className="text-lg font-semibold mb-4  dark:text-gray-100">Cancellation Policy</h2>
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
              <div className={`mt-4 p-3 rounded-md text-sm ${formSubmissionMessage.includes('success') || formSubmissionMessage.includes('succeeded') || formSubmissionMessage.includes('processing') ? 'bg-green-100 text-green-700' : 'bg-priamry text-primary'}`}>
                {formSubmissionMessage}
              </div>
            )}
          </div>

         <PayBill
        open={isPayBillOpen}
        onClose={handleClosePayBill} 
        // onClose={() => setIsPayBillOpen(false)}
      />
     <PaypalPayBill
        open={isPaypalPayBillOpen}
        onClose={handleClosePayBill} 
        // onClose={() => setIsPayBillOpen(false)}
      />
        </div>
      </form>
    </>
  );
};

export default CheckoutClient;