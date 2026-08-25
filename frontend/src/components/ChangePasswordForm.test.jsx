import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import ChangePasswordForm from './ChangePasswordForm';

test('Renders password input fields and submit button', () => {
  render(<ChangePasswordForm />);
  expect(screen.getByLabelText(/current password/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/^new password/i)).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /update password/i })).toBeInTheDocument();
});

test('Shows success message on valid password change', async () => {
  const mockOnSubmit = vi.fn().mockResolvedValue();
  render(<ChangePasswordForm onSubmit={mockOnSubmit} />);

  fireEvent.change(screen.getByLabelText(/current password/i), { target: { value: 'oldPass123' } });
  fireEvent.change(screen.getByLabelText(/^new password/i), { target: { value: 'newPass123' } });
  
  fireEvent.click(screen.getByRole('button', { name: /update password/i }));

  await waitFor(() => {
    expect(screen.getByText(/password updated successfully/i)).toBeInTheDocument();
  });
});