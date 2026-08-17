import { render, screen, fireEvent } from '@testing-library/react';
import { ThemeProvider, useTheme } from './ThemeContext';

function TestComponent() {
  const { theme, toggleTheme } = useTheme();
  return (
    <div>
      <span data-testid="theme">{theme}</span>
      <button onClick={toggleTheme}>Toggle</button>
    </div>
  );
}

beforeEach(() => {
  localStorage.clear();
  document.documentElement.classList.remove('dark');
});

test('Defaults to light theme', () => {
  render(<ThemeProvider><TestComponent /></ThemeProvider>);
  expect(screen.getByTestId('theme')).toHaveTextContent('light');
});

test('Toggles to dark theme and updates the document class', () => {
  render(<ThemeProvider><TestComponent /></ThemeProvider>);
  fireEvent.click(screen.getByText('Toggle'));
  expect(screen.getByTestId('theme')).toHaveTextContent('dark');
  expect(document.documentElement.classList.contains('dark')).toBe(true);
});

test('Persists theme choice to localStorage', () => {
  render(<ThemeProvider><TestComponent /></ThemeProvider>);
  fireEvent.click(screen.getByText('Toggle'));
  expect(localStorage.getItem('theme')).toBe('dark');
});