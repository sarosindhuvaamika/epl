import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

export default function DateInput({ value, onChange, placeholder = 'Select date', dark = true }) {
  const parsed = value ? new Date(value) : null;

  const handleChange = (date) => {
    if (!date) { onChange(''); return; }
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    onChange(`${y}-${m}-${d}`);
  };

  return (
    <div className="datepicker-wrapper">
      <DatePicker
        selected={parsed}
        onChange={handleChange}
        dateFormat="dd MMM yyyy"
        placeholderText={placeholder}
        className={`w-full px-4 py-2.5 text-sm focus:outline-none transition-all ${dark ? 'text-white placeholder-gray-500' : 'text-gray-900 placeholder-gray-400'}`}
        calendarClassName="custom-calendar"
        showPopperArrow={false}
        isClearable
      />
    </div>
  );
}
