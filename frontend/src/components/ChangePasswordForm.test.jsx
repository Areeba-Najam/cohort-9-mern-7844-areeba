import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import ChangePasswordForm from './ChangePasswordForm';
import api from '../services/api';

vi.mock('../services/api');

test('renders current and new password fields', () => {
  render(<ChangePasswordForm />);
  expect(screen.getByPlaceholderText(/current password/i)).toBeInTheDocument();
  expect(screen.getByPlaceholderText(/new password/i)).toBeInTheDocument();
});

test('Submits and shows a success message, then clears the fields', async () => {
  api.patch.mockResolvedValue({ data: { success: true } });
  render(<ChangePasswordForm />);

  const currentInput = screen.getByPlaceholderText(/current password/i);
  const newInput = screen.getByPlaceholderText(/new password/i);

  fireEvent.change(currentInput, { target: { value: 'oldpass' } });
  fireEvent.change(newInput, { target: { value: 'newpass123' } });
  fireEvent.click(screen.getByText(/update password/i));

  await waitFor(() => {
    expect(screen.getByText(/password updated successfully/i)).toBeInTheDocument();
  });

  expect(currentInput.value).toBe('');
  expect(newInput.value).toBe('');
});

test('shows the API error message when the request fails', async () => {
  api.patch.mockRejectedValue({ response: { data: { message: 'Current password is incorrect' } } });
  render(<ChangePasswordForm />);

  fireEvent.change(screen.getByPlaceholderText(/current password/i), { target: { value: 'wrong' } });
  fireEvent.change(screen.getByPlaceholderText(/new password/i), { target: { value: 'newpass123' } });
  fireEvent.click(screen.getByText(/update password/i));

  await waitFor(() => {
    expect(screen.getByText(/current password is incorrect/i)).toBeInTheDocument();
  });
});

test('shows a generic error message when the API gives no message', async () => {
  api.patch.mockRejectedValue({});
  render(<ChangePasswordForm />);

  fireEvent.change(screen.getByPlaceholderText(/current password/i), { target: { value: 'wrong' } });
  fireEvent.change(screen.getByPlaceholderText(/new password/i), { target: { value: 'newpass123' } });
  fireEvent.click(screen.getByText(/update password/i));

  await waitFor(() => {
    expect(screen.getByText(/could not change password/i)).toBeInTheDocument();
  });
});

test('disables the submit button while submitting', async () => {
  let resolvePromise;
  api.patch.mockReturnValue(new Promise((resolve) => { resolvePromise = resolve; }));
  render(<ChangePasswordForm />);

  fireEvent.change(screen.getByPlaceholderText(/current password/i), { target: { value: 'oldpass' } });
  fireEvent.change(screen.getByPlaceholderText(/new password/i), { target: { value: 'newpass123' } });
  fireEvent.click(screen.getByText(/update password/i));

  expect(screen.getByText(/updating/i)).toBeDisabled();
  resolvePromise({ data: { success: true } });
});