import { render, screen, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';
import ColorPicker, { NOTE_COLORS } from './ColorPicker';
import { ThemeProvider } from '../context/ThemeContext';

test('Renders a swatch for every note color', () => {
  render(
    <ThemeProvider>
      <ColorPicker selected="default" onSelect={vi.fn()} />
    </ThemeProvider>
  );
  NOTE_COLORS.forEach((color) => {
    expect(screen.getByLabelText(`Set note color to ${color.name}`)).toBeInTheDocument();
  });
});

test('Calls onSelect with the chosen color name', () => {
  const onSelect = vi.fn();
  render(
    <ThemeProvider>
      <ColorPicker selected="default" onSelect={onSelect} />
    </ThemeProvider>
  );
  fireEvent.click(screen.getByLabelText('Set note color to mint'));
  expect(onSelect).toHaveBeenCalledWith('mint');
});