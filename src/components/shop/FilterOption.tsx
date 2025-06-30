// 'use client';
// import { useState } from 'react';

// // --- TYPE DEFINITIONS ---
// type MainFilter = 'Clothing' | 'Purses' | 'Handbags' | 'Bracelets' | 'Shirts' | 'Necklace' | 'Shoes' | 'Hats';
// type SubFilter = 'All' | 'Men' | 'Women' | 'Kids';
// type ActiveFilters = Partial<Record<MainFilter, SubFilter>>;


// // --- DATA CONFIGURATION ---
// const filterConfig: Record<MainFilter, { subFilters: SubFilter[] | null }> = {
//   Clothing: { subFilters: ['All', 'Men', 'Women', 'Kids'] },
//   Shirts: { subFilters: ['All', 'Men', 'Women'] },
//   Shoes: { subFilters: ['All', 'Men', 'Women', 'Kids'] },
//   Hats: { subFilters: ['All', 'Men', 'Women'] },
//   Purses: { subFilters: null },
//   Handbags: { subFilters: null },
//   Bracelets: { subFilters: null },
//   Necklace: { subFilters: null },
// };

// const mainFilters = Object.keys(filterConfig) as MainFilter[];

// // --- ICONS ---
// // Reused for both "Clear All" and individual "Remove"
// const ClearIcon = ({ className = "h-4 w-4" }: { className?: string }) => (
//   <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
//     <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
//   </svg>
// );


// // --- COMPONENT ---
// const FilterOptions = () => {
//   // This state now represents the "staged" filters before they are applied.
//   const [activeFilters, setActiveFilters] = useState<ActiveFilters>({});
//   const [hoveredFilter, setHoveredFilter] = useState<MainFilter | null>(null);

//   // --- HANDLERS ---

//   const handleFilterToggle = (mainFilter: MainFilter, subFilter: SubFilter = 'All') => {
//     setActiveFilters(prevFilters => {
//       const newFilters = { ...prevFilters };
//       if (newFilters[mainFilter] === subFilter) {
//         delete newFilters[mainFilter];
//       } else {
//         newFilters[mainFilter] = subFilter;
//       }
//       return newFilters;
//     });
//     setHoveredFilter(null);
//   };

//   // NEW: Handler to remove a single filter from the selection.
//   const handleRemoveFilter = (filterToRemove: MainFilter) => {
//     setActiveFilters(prevFilters => {
//         const newFilters = { ...prevFilters };
//         delete newFilters[filterToRemove];
//         return newFilters;
//     });
//   };

//   const handleClearFilters = () => {
//     setActiveFilters({});
//     setHoveredFilter(null);
//   };

//   // NEW: Handler to be called when the user is ready to apply filters.
//   const handleApplyFilters = () => {
//     // This is where you would make your API call to Strapi.
//     // The `activeFilters` object contains the exact data you need.
//     console.log('APPLYING FILTERS (sending to API):', activeFilters);

//     // Example of what your API call might look like:
//     // const queryParams = new URLSearchParams();
//     // Object.entries(activeFilters).forEach(([key, value]) => {
//     //   if (value !== 'All') { // You might not want to send 'All'
//     //     queryParams.append(`filters[${key}][subCategory][$eq]`, value);
//     //   } else {
//     //      queryParams.append(`filters[category][$eq]`, key);
//     //   }
//     // });
//     // fetch(`https://your-strapi-endpoint/products?${queryParams.toString()}`)
//     //   .then(res => res.json())
//     //   .then(data => console.log('Products loaded:', data));

//     alert('Check the console to see the filter object that would be sent to the API!');
//   };


//   return (
//     <div className="font-sans text-gray-400 p-5 md:p-5 lg:mb-4 w-full">

//       {/* Main Filter Buttons Container */}
//       <div onMouseLeave={() => setHoveredFilter(null)} className="min-h-[100px] flex flex-row items-center justify-between">
//         {/* Main Filter Buttons (logic unchanged) */}
//         <div className="flex flex-wrap items-center gap-x-2 gap-y-4">
//           {mainFilters.map((filter) => {
//             const config = filterConfig[filter];
//             const isActive = !!activeFilters[filter];
//             return (
//               <div key={filter} className="relative">
//                 <button
//                   onMouseEnter={() => setHoveredFilter(filter)}
//                   onClick={!config.subFilters ? () => handleFilterToggle(filter) : undefined}
//                   className={`transition-all duration-300 font-semibold tracking-widest text-sm uppercase px-4 py-3 rounded-md
//                     ${isActive ? 'bg-[#9C193D] text-white shadow-lg'
//                       : filter === 'Purses' ? 'bg-white text-gray-500 hover:bg-gray-200'
//                         : 'text-gray-500 hover:text-white'
//                     }`}
//                 >
//                   {filter}
//                 </button>
//                 {hoveredFilter === filter && config.subFilters && (
//                   <div className="absolute top-full mt-2 left-1/2 -translate-x-1/3 z-10 w-max">
//                     <div className="flex flex-wrap items-center gap-x-8 gap-y-2 bg-opacity-90 backdrop-blur-sm p-4 rounded-lg shadow-2xl">
//                       {config.subFilters.map((subFilter) => (
//                         <button
//                           key={subFilter}
//                           onClick={() => handleFilterToggle(hoveredFilter, subFilter)}
//                           className={`text-sm font-semibold transition-colors duration-300 ${
//                             activeFilters[hoveredFilter] === subFilter
//                               ? 'text-[#9C193D]' : 'text-gray-500 hover:text-[#9C193D]'
//                           }`}
//                         >
//                           {subFilter}
//                         </button>
//                       ))}
//                     </div>
//                   </div>
//                 )}
//               </div>
//             );
//           })}
//         </div>
//         <div className="flex flex-wrap items-center gap-x-2 gap-y-4">
//          <span className="text-gray-500">SORT BY</span>
//           <span className="text-gray-500 font-semibold">PRICE</span>
//         </div>
//       </div>

//       {/* MODIFIED: Active Filter Display and Action Buttons */}
//       {Object.keys(activeFilters).length > 0 && (
//         <div className="flex flex-col items-start gap-4 text-sm mt-8 border-t border-gray-800 pt-6">
//           <span className="text-gray-400">Selected Filters:</span>
//           <div className='flex flex-wrap items-center gap-3 w-full'>
//             {/* Pills for each selected filter */}
//             {Object.entries(activeFilters).map(([main, sub]) => (
//               <div key={main} className="flex items-center bg-gray-800 text-white font-semibold pl-3 pr-2 py-1 rounded-full">
//                 <span>{main}</span>
//                 {filterConfig[main as MainFilter]?.subFilters && sub !== 'All' && (
//                   <span className="ml-1 text-gray-400">/ {sub}</span>
//                 )}
//                 {/* NEW: Individual remove button per filter */}
//                 <button
//                     onClick={() => handleRemoveFilter(main as MainFilter)}
//                     className="ml-2 p-0.5 rounded-full hover:bg-gray-600 transition-colors"
//                     aria-label={`Remove ${main} filter`}
//                 >
//                     <ClearIcon className="h-3 w-3"/>
//                 </button>
//               </div>
//             ))}
//             {/* Action Buttons */}
//             <div className="flex items-center gap-4 ml-auto">
//                 <button
//                     onClick={handleClearFilters}
//                     className="flex items-center gap-1.5 text-sm text-red-500/80 hover:text-red-400 transition-colors"
//                 >
//                     <ClearIcon />
//                     Clear All
//                 </button>
//                 {/* NEW: Apply Filters Button */}
//                 <button
//                     onClick={handleApplyFilters}
//                     className="bg-[#9C193D] text-white font-bold tracking-wider text-sm uppercase px-6 py-2 rounded-md hover:bg-opacity-90 transition-all shadow-lg"
//                 >
//                     Apply Filters
//                 </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default FilterOptions;

// components/shop/FilterOptions.tsx
'use client';
import { useState, useEffect } from 'react'; // Added useEffect

// --- TYPE DEFINITIONS ---
export type MainFilter = 'Clothing' | 'Purses' | 'Handbags' | 'Bracelets' | 'Shirts' | 'Necklace' | 'Shoes' | 'Hats';
export type SubFilter = 'All' | 'Men' | 'Women' | 'Kids';
// Export ActiveFilters as it will be used by the parent component
export type ActiveFilters = Partial<Record<MainFilter, SubFilter>>;


// --- DATA CONFIGURATION ---
const filterConfig: Record<MainFilter, { subFilters: SubFilter[] | null }> = {
  Clothing: { subFilters: ['All', 'Men', 'Women', 'Kids'] },
  Shirts: { subFilters: ['All', 'Men', 'Women'] },
  Shoes: { subFilters: ['All', 'Men', 'Women', 'Kids'] },
  Hats: { subFilters: ['All', 'Men', 'Women'] },
  Purses: { subFilters: null },
  Handbags: { subFilters: null },
  Bracelets: { subFilters: null },
  Necklace: { subFilters: null },
};

const mainFilters = Object.keys(filterConfig) as MainFilter[];

// --- ICONS ---
const ClearIcon = ({ className = "h-4 w-4" }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
  </svg>
);


// --- COMPONENT PROPS ---
interface FilterOptionsProps {
  // `currentActiveFilters` are the filters currently applied to products
  currentActiveFilters: ActiveFilters;
  // `onApplyFilters` tells the parent to apply the pending filters
  onApplyFilters: (filters: ActiveFilters) => void;
  // `onClearAllFilters` tells the parent to clear all filters
  onClearAllFilters: () => void;
}


// --- COMPONENT ---
const FilterOptions = ({ currentActiveFilters, onApplyFilters, onClearAllFilters }: FilterOptionsProps) => {
  // `pendingFilters` holds the selections the user has made, but not yet applied.
  const [pendingFilters, setPendingFilters] = useState<ActiveFilters>(currentActiveFilters);
  const [hoveredFilter, setHoveredFilter] = useState<MainFilter | null>(null);

  // Sync internal pendingFilters with external currentActiveFilters if parent changes them
  // This is important if `currentActiveFilters` can be updated by something other than this component's apply button
  useEffect(() => {
    setPendingFilters(currentActiveFilters);
  }, [currentActiveFilters]);


  // --- HANDLERS ---

  const handleFilterToggle = (mainFilter: MainFilter, subFilter: SubFilter = 'All') => {
    setPendingFilters(prevFilters => {
      const newFilters = { ...prevFilters };
      // Toggle logic: if already selected with same sub-filter, unselect. Else, set new selection.
      if (newFilters[mainFilter] === subFilter) {
        delete newFilters[mainFilter];
      } else {
        newFilters[mainFilter] = subFilter;
      }
      return newFilters;
    });
    setHoveredFilter(null);
  };

  const handleRemoveFilter = (filterToRemove: MainFilter) => {
    setPendingFilters(prevFilters => {
        const newFilters = { ...prevFilters };
        delete newFilters[filterToRemove];
        return newFilters;
    });
  };

  const handleClearPendingFilters = () => { // Clears only the pending selection
    setPendingFilters({});
  };

  // When 'Apply Filters' is clicked, notify parent with the pending filters
  const handleApplyClick = () => {
    onApplyFilters(pendingFilters);
  };

  // When 'Clear All' is clicked, notify parent to clear and also clear pending
  const handleClearAllClick = () => {
    onClearAllFilters();
    setPendingFilters({}); // Also reset pending filters
  };


  return (
    <div className="font-sans text-gray-400 p-5 md:p-5 lg:mb-4 w-full">

      {/* Main Filter Buttons Container */}
      <div onMouseLeave={() => setHoveredFilter(null)} className="min-h-[100px] flex flex-row items-center justify-between">
        <div className="flex flex-wrap items-center gap-x-2 gap-y-4">
          {mainFilters.map((filter) => {
            const config = filterConfig[filter];
            // Check against pendingFilters for active state in UI
            const isActive = !!pendingFilters[filter];
            return (
              <div key={filter} className="relative">
                <button
                  onMouseEnter={() => setHoveredFilter(filter)}
                  onClick={!config.subFilters ? () => handleFilterToggle(filter) : undefined}
                  className={`transition-all duration-300 font-semibold tracking-widest text-sm uppercase px-4 py-3 rounded-md
                    ${isActive ? 'bg-[#9C193D] text-white shadow-lg'
                      : filter === 'Purses' ? 'bg-white text-gray-500 hover:bg-gray-200' // Specific styling for Purses?
                        : 'text-gray-500 hover:text-white hover:bg-gray-700' // Default inactive state with hover
                    }`}
                >
                  {filter}
                </button>
                {hoveredFilter === filter && config.subFilters && (
                  <div className="absolute top-full mt-2 left-1/2 -translate-x-1/3 z-10 w-max bg-gray-900 rounded-lg shadow-2xl">
                    <div className="flex flex-wrap items-center gap-x-8 gap-y-2 bg-opacity-90 backdrop-blur-sm p-4 rounded-lg">
                      {config.subFilters.map((subFilter) => (
                        <button
                          key={subFilter}
                          onClick={() => handleFilterToggle(hoveredFilter, subFilter)}
                          className={`text-sm font-semibold transition-colors duration-300 ${
                            // Check against pendingFilters for sub-filter active state
                            pendingFilters[hoveredFilter] === subFilter
                              ? 'text-[#9C193D]' : 'text-gray-300 hover:text-[#9C193D]'
                          }`}
                        >
                          {subFilter}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
        <div className="flex flex-wrap items-center gap-x-2 gap-y-4">
         <span className="text-gray-500">SORT BY</span>
          <span className="text-gray-500 font-semibold">PRICE</span>
        </div>
      </div>

      {/* Active Filter Display and Action Buttons */}
      {Object.keys(pendingFilters).length > 0 && ( // Use pendingFilters to show current selection
        <div className="flex flex-col items-start gap-4 text-sm mt-8 border-t border-gray-800 pt-6">
          <span className="text-gray-400">Selected Filters:</span>
          <div className='flex flex-wrap items-center gap-3 w-full'>
            {/* Pills for each selected filter */}
            {Object.entries(pendingFilters).map(([main, sub]) => (
              <div key={main} className="flex items-center bg-gray-800 text-white font-semibold pl-3 pr-2 py-1 rounded-full">
                <span>{main}</span>
                {filterConfig[main as MainFilter]?.subFilters && sub !== 'All' && (
                  <span className="ml-1 text-gray-400">/ {sub}</span>
                )}
                <button
                    onClick={() => handleRemoveFilter(main as MainFilter)}
                    className="ml-2 p-0.5 rounded-full hover:bg-gray-600 transition-colors"
                    aria-label={`Remove ${main} filter`}
                >
                    <ClearIcon className="h-3 w-3"/>
                </button>
              </div>
            ))}
            {/* Action Buttons */}
            <div className="flex items-center gap-4 ml-auto">
                <button
                    onClick={handleClearAllClick} // Call parent clear handler
                    className="flex items-center gap-1.5 text-sm text-red-500/80 hover:text-red-400 transition-colors"
                >
                    <ClearIcon />
                    Clear All
                </button>
                <button
                    onClick={handleApplyClick} // Call parent apply handler
                    className="bg-[#9C193D] text-white font-bold tracking-wider text-sm uppercase px-6 py-2 rounded-md hover:bg-opacity-90 transition-all shadow-lg"
                >
                    Apply Filters
                </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FilterOptions;