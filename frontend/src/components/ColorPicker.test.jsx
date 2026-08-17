import { render, screen, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';
import ColorPicker, { NOTE_COLORS } from './ColorPicker';

test('Renders a swatch for every note color', () => {
  render(<ColorPicker selected="default" onSelect={vi.fn()} />);
  NOTE_COLORS.forEach((color) => {
    expect(screen.getByLabelText(`Set note color to ${color.name}`)).toBeInTheDocument();
  });
});

test('Calls onSelect with the chosen color name', () => {
  const onSelect = vi.fn();
  render(<ColorPicker selected="default" onSelect={onSelect} />);
  fireEvent.click(screen.getByLabelText('Set note color to mint'));
  expect(onSelect).toHaveBeenCalledWith('mint');
});