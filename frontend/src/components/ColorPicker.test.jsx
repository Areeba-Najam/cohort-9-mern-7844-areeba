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

test('Uses the light background color when theme is light', () => {
  localStorage.setItem('theme', 'light');
  const { container } = render(
    <ThemeProvider>
      <ColorPicker selected="mint" onSelect={vi.fn()} />
    </ThemeProvider>
  );
  const mintSwatch = screen.getByLabelText('Set note color to mint');
  expect(mintSwatch).toHaveStyle({ background: '#e0f2f1' });
});

test('Uses the dark background color when theme is dark', () => {
  localStorage.setItem('theme', 'dark');
  const { container } = render(
    <ThemeProvider>
      <ColorPicker selected="mint" onSelect={vi.fn()} />
    </ThemeProvider>
  );
  const mintSwatch = screen.getByLabelText('Set note color to mint');
  expect(mintSwatch).toHaveStyle({ background: '#16423c' });
});