import { render, screen } from '@testing-library/react';
import App from './App';

test('renders the app title', () => {
  render(<App />);
  const heading = screen.getByText(/Notes App/i);
  expect(heading).toBeInTheDocument();
});