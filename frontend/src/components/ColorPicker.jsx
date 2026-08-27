import PropTypes from 'prop-types';
import { useTheme } from '../context/ThemeContext';
export const NOTE_COLORS = [
  { name: 'default', light: '#ffffff', dark: '#18181b' }, 
  { name: 'peach', light: '#ffe8d6', dark: '#522b29' },
  { name: 'mint', light: '#e0f2f1', dark: '#16423c' },   
  { name: 'blush', light: '#fde2e4', dark: '#5c2b3f' },   
  { name: 'lavender', light: '#e7e6ff', dark: '#3b2c5e' },
  { name: 'butter', light: '#fff3b0', dark: '#52431a' },  
  { name: 'sage', light: '#d8f3dc', dark: '#24422e' },    
];
function ColorPicker({ selected, onSelect }) {
  const { theme } = useTheme();
  return (
    <div className="flex gap-2">
      {NOTE_COLORS.map((color) => (
        <button
          key={color.name}
          type="button"
          aria-label={`Set note color to ${color.name}`}
          aria-pressed={selected === color.name} 
          onClick={() => onSelect(color.name)}
          className={`w-7 h-7 rounded-full border-2 transition-transform ${
            selected === color.name ? 'border-brand scale-110' : 'border-transparent'
          }`}
          style={{ background: theme === 'dark' ? color.dark : color.light,}}
        />
      ))}
    </div>
  );
}

ColorPicker.propTypes = {
  selected: PropTypes.string.isRequired,
  onSelect: PropTypes.func.isRequired,
};

export default ColorPicker;