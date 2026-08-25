import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import ChangePasswordForm from './ChangePasswordForm';

test('Renders password input fields and submit button', () => {
  render(<ChangePasswordForm />);
  expect(screen.getByPlaceholderText(/current password/i)).toBeInTheDocument();
  expect(screen.getByPlaceholderText(/new password/i)).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /update password/i })).toBeInTheDocument();
});

test('Allows typing into password fields', () => {
  render(<ChangePasswordForm />);
  const currentPassInput = screen.getByPlaceholderText(/current password/i);
  const newPassInput = screen.getByPlaceholderText(/new password/i);

  fireEvent.change(currentPassInput, { target: { value: 'oldPass123' } });
  fireEvent.change(newPassInput, { target: { value: 'newPass123' } });

  expect(currentPassInput.value).toBe('oldPass123');
  expect(newPassInput.value).toBe('newPass123');
});