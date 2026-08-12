import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../context/AuthContext';
import Register from '../pages/Register';

function renderRegister() {
  return render(
    <BrowserRouter>
      <AuthProvider>
        <Register />
      </AuthProvider>
    </BrowserRouter>
  );
}

test('renders name, email, and password fields', () => {
  renderRegister();
  expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
});

test('renders a link to the login page', () => {
  renderRegister();
  expect(screen.getByText(/log in/i)).toBeInTheDocument();
});

test('enforces minimum password length', () => {
  renderRegister();
  const passwordInput = screen.getByLabelText(/password/i);
  expect(passwordInput).toHaveAttribute('minLength', '6');
});