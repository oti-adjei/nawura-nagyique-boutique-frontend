'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { SelectOption } from '@/types/checkout'; // Import the generic interface

interface SelectComboboxProps {
  options: SelectOption[]; // Now accepts a generic list of options
  initialSelectedValue?: string; // Initial value based on the option's 'value'
  onOptionSelect: (option: SelectOption | null) => void; // Callback for selection
  placeholder?: string;
  label?: string;
  id?: string; // Added an ID prop for better label association
}

export default function SelectCombobox({
  options,
  initialSelectedValue = '',
  onOptionSelect,
  placeholder = 'Start typing or select...',
  label = 'Select Item',
  id = 'select-combobox',
}: SelectComboboxProps) {
  const initialOption = options.find(opt => opt.value === initialSelectedValue);

  const [inputValue, setInputValue] = useState(initialOption ? initialOption.label : '');
  const [filteredOptions, setFilteredOptions] = useState<SelectOption[]>([]);
  const [selectedOption, setSelectedOption] = useState<SelectOption | null>(initialOption || null);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Effect to update inputValue and selectedOption if initialSelectedValue changes
  useEffect(() => {
    const currentInitialOption = options.find(opt => opt.value === initialSelectedValue);
    setInputValue(currentInitialOption ? currentInitialOption.label : '');
    setSelectedOption(currentInitialOption || null);
    // onOptionSelect(currentInitialOption || null); // Inform parent of initial selection
  }, [initialSelectedValue, options, onOptionSelect]);


  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setInputValue(value);

    if (value) {
      const filtered = options.filter(option =>
        option.label.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredOptions(filtered);
    } else {
      setFilteredOptions(options); // Show all if input is empty
    }

    // Clear selected option if input value doesn't match the current selection's label
    if (selectedOption && selectedOption.label.toLowerCase() !== value.toLowerCase()) {
      setSelectedOption(null);
      onOptionSelect(null);
    }
    setShowSuggestions(true);
  };

  const handleOptionClick = useCallback((option: SelectOption) => {
    setInputValue(option.label);
    setSelectedOption(option);
    onOptionSelect(option);
    setShowSuggestions(false);
    setFilteredOptions([]);
    inputRef.current?.focus();
  }, [onOptionSelect]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [wrapperRef]);

  const handleInputFocus = () => {
    setShowSuggestions(true);
    if (!inputValue && options.length > 0) {
      setFilteredOptions(options);
    }
  };

  return (
    <div className="relative w-full" ref={wrapperRef}>
      <label htmlFor={id} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
        {label}
      </label>
      <input
        type="text"
        id={id}
        name={id} // Use the id as the name for form submission
        ref={inputRef}
        value={inputValue}
        onChange={handleInputChange}
        onFocus={handleInputFocus}
        required
        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-pink-500 focus:border-pink-500 dark:bg-gray-700 dark:text-gray-200"
        placeholder={placeholder}
        autoComplete="off"
      />

      {showSuggestions && filteredOptions.length > 0 && (
        <ul className="absolute z-10 w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md mt-1 max-h-60 overflow-y-auto shadow-lg">
          {filteredOptions.map((option) => (
            <li
              key={option.value} // Key off the unique value
              className="px-3 py-2 cursor-pointer hover:bg-pink-100 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => handleOptionClick(option)}
            >
              {option.label}
            </li>
          ))}
        </ul>
      )}

      {showSuggestions && filteredOptions.length === 0 && inputValue && (
        <div className="absolute z-10 w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md mt-1 px-3 py-2 text-gray-500 dark:text-gray-400 shadow-lg">
          No matching items found.
        </div>
      )}

      {selectedOption && (
        <input type="hidden" name={`${id}-value`} value={selectedOption.value} />
      )}
    </div>
  );
}