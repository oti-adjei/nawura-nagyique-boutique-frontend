"use client";

import { useState, useMemo, useCallback, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import type { CartItem as CheckoutCartItem, CheckoutFormData, PaymentMethod, SelectOption } from '@/types/checkout';
import { Country as CountryService, State as StateService, City as CityService, ICountry, IState, ICity } from 'country-state-city';
import OrderSummary from './OrderSummary';
import { useCartStore } from '@/store/cart/useCart';
import { useLocationStore } from '@/store/location/useLocationStore';
import SelectCombobox from './CountrySelectCombobox';
import { PayBill } from './PayBill';
import { PaypalPayBill } from './PayBilllPaypal';

interface CheckoutClientProps {
  initialShippingCost: number;
}
const CheckoutClient: React.FC<CheckoutClientProps> = ({
  initialShippingCost
}) => {
  const { data: session } = useSession();
  const { items: cartItemsFromStore } = useCartStore();
  const { currency } = useLocationStore();
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
  });
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentMethod>('bank');
  const [discountCode, setDiscountCode] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState(0);
  const [shippingCost, setShippingCost] = useState(initialShippingCost);

  // New state to track shipping calculation status
  const [isCalculatingShipping, setIsCalculatingShipping] = useState(false);
  const [formSubmissionMessage, setFormSubmissionMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);


  const [countries, setCountries] = useState<SelectOption[]>([]);
  const [states, setStates] = useState<SelectOption[]>([]);
  const [cities, setCities] = useState<SelectOption[]>([]);

  const [isPayBillOpen, setIsPayBillOpen] = useState(false);
  const [isPaypalPayBillOpen, setIsPaypalPayBillOpen] = useState(false);
  const [isLoadingProfile, setIsLoadingProfile] = useState(false);


  // Fetch Countries on component mount
  useEffect(() => {
    const fetchedCountries = CountryService.getAllCountries().map((c: ICountry) => ({
      label: c.name,
      value: c.isoCode,
      originalData: c, // Keep original data if needed
    }));
    setCountries(fetchedCountries);
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
        state: '',
        city: '',
      }));
    } else {
      setStates([]); // Clear states if no country is selected
    }
  }, [formData.country]);

  // Fetch Cities when State changes
  useEffect(() => {
    if (formData.state && formData.country) {
      const fetchedCities = CityService.getCitiesOfState(
        formData.country,
        formData.state
      ).map((c: ICity) => ({
        label: c.name,
        value: `${c.name}-${c.stateCode}-${c.countryCode}`,
        originalData: c,
      }));
      setCities(fetchedCities);
      // Reset city if state changes
      setFormData(prev => ({
        ...prev,
        city: '',
      }));
    } else {
      setCities([]);
    }
  }, [formData.state, formData.country]);

  // Load user profile data if logged in
  useEffect(() => {
    const loadUserProfile = async () => {
      if (session?.user) {
        setIsLoadingProfile(true);
        try {
          const response = await fetch("/api/user/profile");
          if (response.ok) {
            const data = await response.json();
            if (data.profile) {
              const profile = data.profile;
              const address = profile.address ? JSON.parse(profile.address) : null;
              
              // Split name into first and last name
              const nameParts = (profile.name || "").split(" ");
              const firstName = nameParts[0] || "";
              const lastName = nameParts.slice(1).join(" ") || "";

              setFormData(prev => ({
                ...prev,
                firstName,
                lastName,
                email: profile.email || prev.email,
                phone: profile.phone || prev.phone,
                country: address?.country || prev.country,
                state: address?.province || prev.state,
                city: address?.city || prev.city,
                postalCode: address?.postalCode || prev.postalCode,
                address: address?.street || prev.address,
              }));
            }
          }
        } catch (error) {
          console.error('Failed to load user profile:', error);
        } finally {
          setIsLoadingProfile(false);
        }
      }
    };

    loadUserProfile();
  }, [session]);


   // Function to calculate shipping using Canada Post API
  const calculateShipping = useCallback(async (country: string, state: string, city: string): Promise<number> => {
    try {
      // Get cart weight (you might want to add weight to your product types)
      const totalWeight = cartItemsFromStore.reduce((total, item) => {
        // Assuming each item has a weight property in grams, default to 500g if not specified
        const itemWeight = (item as any).weight || 500; // You'll need to add weight to your product type
        return total + (itemWeight * item.quantity);
      }, 0);

      // Your business postal code (replace with your actual postal code)
      const originPostalCode = process.env.NEXT_PUBLIC_ORIGIN_POSTAL_CODE || 'K1A0A6'; // Default to Canada Post HQ

      // Extract postal code from city if it's in the composite format
      const cityParts = city.split('-');
      const destinationPostalCode = formData.postalCode || 'H0H0H0'; // Use form postal code

      const shippingRequest = {
        originPostalCode,
        destinationPostalCode,
        destinationCountry: country,
        destinationProvince: state,
        weight: Math.max(totalWeight, 100), // Minimum 100g
        serviceCode: 'DOM.RP' // Regular Parcel for domestic, will be handled by API
      };

      const response = await fetch('/api/shipping/canada-post', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(shippingRequest)
      });

      if (!response.ok) {
        throw new Error(`Shipping API error: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.success && data.recommendedService) {
        return data.recommendedService.price;
      } else {
        throw new Error('No shipping rates returned');
      }
    } catch (error) {
      console.error('Failed to calculate shipping with Canada Post:', error);
      
      // Fallback to simple calculation if API fails
      let calculatedCost = 15.00;
      
      if (country === 'CA') {
        calculatedCost = 12.00;
      } else if (country === 'US') {
        calculatedCost = 25.00;
      } else {
        calculatedCost = 35.00;
      }

      return calculatedCost;
    }
  }, [cartItemsFromStore, formData.postalCode]);

  // useEffect to trigger shipping calculation
  useEffect(() => {
    // Only calculate if all location fields are selected AND postal code is provided
    if (formData.country && formData.state && formData.city && formData.postalCode) {
      setIsCalculatingShipping(true);
      calculateShipping(formData.country, formData.state, formData.city)
        .then(newCost => {
          setShippingCost(newCost);
        })
        .catch(error => {
          console.error("Failed to calculate shipping:", error);
          setShippingCost(initialShippingCost);
        })
        .finally(() => {
          setIsCalculatingShipping(false);
        });
    }
  }, [formData.city, formData.state, formData.country, formData.postalCode, calculateShipping, initialShippingCost]);


  const handleCountrySelect = (option: SelectOption | null) => {
    setFormData(prevData => ({
      ...prevData,
      country: option ? option.value : '',
      state: '',
      city: '',
    }));
  };


  const handleStateSelect = (option: SelectOption | null) => {
    setFormData(prevData => ({
      ...prevData,
      state: option ? option.value : '',
      city: '',
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
    setFormSubmissionMessage(null);
  }, []);

  const handleApplyDiscount = useCallback(() => {
    // Basic discount logic simulation
    if (discountCode.toUpperCase() === 'DISCOUNT10') {
      setAppliedDiscount(10.00); // Apply a $10 discount
      setFormSubmissionMessage("Discount applied successfully!");
    } else {
      setAppliedDiscount(0);
      setFormSubmissionMessage("Invalid discount code. Please try again.");
    }
  }, [discountCode]);

  // handleSubmit function
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting || isCalculatingShipping) return;

    setIsSubmitting(true);
    setFormSubmissionMessage(null);

   if (selectedPaymentMethod === 'stripe') {
      setIsPayBillOpen(true);
      return;
    } 
    else if (selectedPaymentMethod === 'paypal') {
      setIsPaypalPayBillOpen(true);
      return;
    }
  };

  const subtotal = useMemo(() => cartItemsFromStore.reduce((sum, item) => sum + item.price * item.quantity, 0), [cartItemsFromStore]);
  const total = useMemo(() => subtotal + shippingCost - appliedDiscount, [subtotal, shippingCost, appliedDiscount]);

  if (cartItemsFromStore.length === 0) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Your cart is empty</h2>
        <p className="text-gray-600 mb-4">Add some items to your cart before proceeding to checkout.</p>
        <a href="/shop" className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700">
          Continue Shopping
        </a>
      </div>
    );
  }

  const handleClosePayBill = useCallback(() => {
    setIsPayBillOpen(false);
    setIsSubmitting(false);
  }, []);

  return (
    <>
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 lg:gap-8">
          <div className="lg:col-span-2 space-y-6">
            {/* Personal Information */}
            <div className="bg-white p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">Personal Information</h2>
                {isLoadingProfile && (
                  <div className="flex items-center text-sm text-gray-500">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-pink-500 mr-2"></div>
                    Loading profile...
                  </div>
                )}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="firstName" className="block text-sm text-gray-700 mb-1">First Name</label>
                  <input type="text" id="firstName" name="firstName" placeholder="Enter name" value={formData.firstName} onChange={handleInputChange} required className="w-full px-4 py-3 border border-gray-200 rounded-md focus:border-gray-400 focus:ring-0" />
                </div>
                <div>
                  <label htmlFor="lastName" className="block text-sm text-gray-700 mb-1">Last Name</label>
                  <input type="text" id="lastName" name="lastName" placeholder="Enter name" value={formData.lastName} onChange={handleInputChange} required className="w-full px-4 py-3 border border-gray-200 rounded-md focus:border-gray-400 focus:ring-0" />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm text-gray-700 mb-1">Email</label>
                  <input type="email" id="email" name="email" placeholder="Enter email" value={formData.email} onChange={handleInputChange} required className="w-full px-4 py-3 border border-gray-200 rounded-md focus:border-gray-400 focus:ring-0" />
                </div>
                <div>
                  <label htmlFor="phone" className="block text-sm text-gray-700 mb-1">Phone number</label>
                  <input type="tel" id="phone" name="phone" placeholder="Enter number" value={formData.phone} onChange={handleInputChange} required className="w-full px-4 py-3 border border-gray-200 rounded-md focus:border-gray-400 focus:ring-0" />
                </div>
             
                <div>
                  <label htmlFor="country" className="block text-sm text-gray-700 mb-1">Country</label>
                  <SelectCombobox
                    options={countries} 
                    onOptionSelect={handleCountrySelect}
                    initialSelectedValue={formData.country}
                    placeholder="Select"
                  />
                </div>
                <div>
                  <label htmlFor="postalCode" className="block text-sm text-gray-700 mb-1">Postal Code</label>
                  <input type="text" id="postalCode" name="postalCode" placeholder="Enter postal code" value={formData.postalCode} onChange={handleInputChange} required className="w-full px-4 py-3 border border-gray-200 rounded-md focus:border-gray-400 focus:ring-0" />
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
                  <label htmlFor="address" className="block text-sm text-gray-700 mb-1">Address</label>
                  <input type="text" id="address" name="address" placeholder="Enter address" value={formData.address} onChange={handleInputChange} required className="w-full px-4 py-3 border border-gray-200 rounded-md focus:border-gray-400 focus:ring-0" />
                </div>
              </div>
            </div>


            {/* Payment Options ... */}

            <div className="bg-white p-6">
              <h2 className="text-xl font-semibold mb-2">Payment Options</h2>
              <p className="text-sm text-gray-500 mb-4">Choose your payment option</p>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
                {/* ... payment method selectors ... */}
                {(['bank', 'paypal', 'stripe', 'cash'] as PaymentMethod[]).map((method) => (
                  <button
                    key={method}
                    type="button"
                    onClick={() => handlePaymentChange(method)}
                    className={`w-full flex justify-between items-center p-4 border rounded-md cursor-pointer transition-colors duration-150 ${
                      selectedPaymentMethod === method
                      ? 'border-green-600 ring-1 ring-green-600 bg-white'
                      : 'border-gray-300 bg-white hover:border-gray-400'
                    }`}
                  >
                    <span className="text-sm font-medium capitalize">{method === 'bank' ? 'Bank Card' : method}</span>
                    {/* Custom Radio Lookalike */}
                    <div className={`w-5 h-5 border rounded-full flex items-center justify-center ${
                      selectedPaymentMethod === method ? 'border-green-600' : 'border-gray-400'
                    }`}>
                      {selectedPaymentMethod === method && <div className="w-3 h-3 bg-green-600 rounded-full"></div>}
                    </div>
                  </button>
                ))}
  
              </div>
              </div>
               <div className="bg-white p-6">
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
              isSubmitting={isSubmitting}
              isCalculatingShipping={isCalculatingShipping}
            />
            {formSubmissionMessage && (
              <div className={`mt-4 p-3 rounded-md text-sm ${formSubmissionMessage.includes('success') || formSubmissionMessage.includes('succeeded') || formSubmissionMessage.includes('processing') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                {formSubmissionMessage}
              </div>
            )}
          </div>
        </div>

        {/* Payment Modals */}
        <PayBill
          open={isPayBillOpen}
          onClose={handleClosePayBill} 
        />
        <PaypalPayBill
          open={isPaypalPayBillOpen}
          onClose={handleClosePayBill} 
        />
      </form>
    </>
  );
};

export default CheckoutClient;