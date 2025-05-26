// components/LocationPopup.tsx

type LocationPopupProps = {
  onSelectLocation: (location: string) => void;
};

const locations = ['New York', 'London', 'Tokyo', 'Berlin', 'Sydney'];

const LocationPopup = ({ onSelectLocation }: LocationPopupProps) => {
  return (
    <div className="absolute right-0 mt-2 w-48 bg-white text-black rounded shadow-lg z-50">
      <ul>
        {locations.map((loc) => (
          <li
            key={loc}
            onClick={() => onSelectLocation(loc)}
            className="px-4 py-2 hover:bg-gray-200 cursor-pointer"
          >
            {loc}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default LocationPopup;
