"use client";

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Country as CountryService, State as StateService, City as CityService, ICountry, IState, ICity } from 'country-state-city';
import SelectCombobox from '@/components/checkout/CountrySelectCombobox';
import type { SelectOption } from '@/types/checkout';


interface UserProfile {
  name: string;
  email: string;
  phone?: string;
  address?: {
    street: string;
    city: string;
    province: string;
    postalCode: string;
    country: string;
  };
}

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    phone: '',
    address: {
      street: '',
      city: '',
      province: '',
      postalCode: '',
      country: 'CA', // Default to Canada
    }
  });
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  // Country, State, City management
  const [countries, setCountries] = useState<SelectOption[]>([]);
  const [states, setStates] = useState<SelectOption[]>([]);
  const [cities, setCities] = useState<SelectOption[]>([]);

  // Fetch Countries on component mount
  useEffect(() => {
    const fetchedCountries = CountryService.getAllCountries().map((c: ICountry) => ({
      label: c.name,
      value: c.isoCode,
      originalData: c,
    }));
    setCountries(fetchedCountries);
  }, []);

  // Fetch States when Country changes
  useEffect(() => {
    if (profile.address?.country) {
      const fetchedStates = StateService.getStatesOfCountry(profile.address.country).map((s: IState) => ({
        label: s.name,
        value: s.isoCode,
        originalData: s,
      }));
      setStates(fetchedStates);
      // Reset state and city if country changes
      setProfile(prev => ({
        ...prev,
        address: {
          ...prev.address!,
          province: '',
          city: '',
        }
      }));
    } else {
      setStates([]);
    }
  }, [profile.address?.country]);

  // Fetch Cities when State changes
  useEffect(() => {
    if (profile.address?.province && profile.address?.country) {
      const fetchedCities = CityService.getCitiesOfState(
        profile.address.country,
        profile.address.province
      ).map((c: ICity) => ({
        label: c.name,
        value: `${c.name}-${c.stateCode}-${c.countryCode}`,
        originalData: c,
      }));
      setCities(fetchedCities);
      // Reset city if state changes
      setProfile(prev => ({
        ...prev,
        address: {
          ...prev.address!,
          city: '',
        }
      }));
    } else {
      setCities([]);
    }
  }, [profile.address?.province, profile.address?.country]);

  // Load profile data
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin");
      return;
    }

    if (session?.user) {
      // Load existing profile data from API
      const loadProfile = async () => {
        try {
          const response = await fetch("/api/user/profile");
          if (response.ok) {
            const data = await response.json();
            if (data.profile) {
              setProfile({
                name: data.profile.name || "",
                email: data.profile.email || "",
                phone: data.profile.phone || "",
                address: data.profile.address ? JSON.parse(data.profile.address) : {
                  street: '',
                  city: '',
                  province: '',
                  postalCode: '',
                  country: 'CA',
                }
              });
            }
          } else {
            // If no profile exists, use session data as fallback
            setProfile(prev => ({
              ...prev,
              name: session.user.name || "",
              email: session.user.email || "",
            }));
          }
        } catch (error) {
          console.error('Failed to load profile:', error);
          // Use session data as fallback
          setProfile(prev => ({
            ...prev,
            name: session.user.name || "",
            email: session.user.email || "",
          }));
        }
      };

      loadProfile();
    }
  }, [session, status, router]);

  // Selection handlers for country, state, city
  const handleCountrySelect = (option: SelectOption | null) => {
    setProfile(prev => ({
      ...prev,
      address: {
        ...prev.address!,
        country: option ? option.value : '',
        province: '',
        city: '',
      }
    }));
  };

  const handleStateSelect = (option: SelectOption | null) => {
    setProfile(prev => ({
      ...prev,
      address: {
        ...prev.address!,
        province: option ? option.value : '',
        city: '',
      }
    }));
  };

  const handleCitySelect = (option: SelectOption | null) => {
    setProfile(prev => ({
      ...prev,
      address: {
        ...prev.address!,
        city: option ? option.value : '',
      }
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setMessage("");

    try {
      const response = await fetch("/api/user/profile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(profile),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to update profile");
      }

      setMessage("Profile updated successfully!");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update profile");
    } finally {
      setIsLoading(false);
    }
  };

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-pink-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-sm">
          {/* Header */}
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold text-gray-900">Profile Settings</h1>
              <Link
                href="/profile/orders"
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                View Orders
              </Link>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {message && (
              <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded">
                {message}
              </div>
            )}
            
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                {error}
              </div>
            )}

            {/* Personal Information */}
            <div>
              <h2 className="text-lg font-medium text-gray-900 mb-4">Personal Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={profile.name}
                    onChange={(e) => setProfile(prev => ({ ...prev, name: e.target.value }))}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-pink-500 focus:border-pink-500"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={profile.email}
                    onChange={(e) => setProfile(prev => ({ ...prev, email: e.target.value }))}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-pink-500 focus:border-pink-500"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    value={profile.phone}
                    onChange={(e) => setProfile(prev => ({ ...prev, phone: e.target.value }))}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-pink-500 focus:border-pink-500"
                  />
                </div>
              </div>
            </div>

            {/* Address Information */}
            <div>
              <h2 className="text-lg font-medium text-gray-900 mb-4">Default Shipping Address</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label htmlFor="street" className="block text-sm font-medium text-gray-700">
                    Street Address
                  </label>
                  <input
                    type="text"
                    id="street"
                    value={profile.address?.street}
                    onChange={(e) => setProfile(prev => ({ 
                      ...prev, 
                      address: { ...prev.address!, street: e.target.value }
                    }))}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-pink-500 focus:border-pink-500"
                  />
                </div>
                
                <div>
                  <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-1">
                    Country
                  </label>
                  <SelectCombobox
                    options={countries} 
                    onOptionSelect={handleCountrySelect}
                    initialSelectedValue={profile.address?.country}
                    placeholder="Select Country"
                  />
                </div>
                
                <div>
                  <label htmlFor="postalCode" className="block text-sm font-medium text-gray-700">
                    Postal Code
                  </label>
                  <input
                    type="text"
                    id="postalCode"
                    value={profile.address?.postalCode}
                    onChange={(e) => setProfile(prev => ({ 
                      ...prev, 
                      address: { ...prev.address!, postalCode: e.target.value }
                    }))}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-pink-500 focus:border-pink-500"
                    placeholder="A1A 1A1"
                  />
                </div>

                {profile.address?.country && (
                  <div>
                    <SelectCombobox
                      id="state-select"
                      label="Province/State"
                      placeholder="Search for a province/state..."
                      options={states}
                      onOptionSelect={handleStateSelect}
                      initialSelectedValue={profile.address?.province}
                    />
                  </div>
                )}

                {profile.address?.province && (
                  <div>
                    <SelectCombobox
                      id="city-select"
                      label="City"
                      placeholder="Search for a city..."
                      options={cities}
                      onOptionSelect={handleCitySelect}
                      initialSelectedValue={profile.address?.city}
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-6">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-pink-600 hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? "Saving..." : "Save Profile"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
