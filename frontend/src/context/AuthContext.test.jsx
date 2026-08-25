import { render, screen } from '@testing-library/react';
import { AuthProvider, useAuth } from './AuthContext';

function TestComponent() {
  const { user } = useAuth();
  return <div>{user ? user.name : 'No User'}</div>;
}

test('AuthProvider provides default unauthenticated context state', () => {
  render(
    <AuthProvider>
      <TestComponent />
    </AuthProvider>
  );
  expect(screen.getByText('No User')).toBeInTheDocument();
});