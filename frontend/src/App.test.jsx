import { render, screen } from '@testing-library/react';
import App from './App';

test('redirects to login page by default', () => {
  render(<App />);
  const emailInput = screen.getByLabelText(/email/i);
  expect(emailInput).toBeInTheDocument();
});