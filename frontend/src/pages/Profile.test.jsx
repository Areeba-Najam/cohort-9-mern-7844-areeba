import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../context/AuthContext';
import { ThemeProvider } from '../context/ThemeContext';
import Profile from './Profile';

function renderProfile() {
  return render(
    <ThemeProvider>
      <BrowserRouter>
        <AuthProvider>
          <Profile />
        </AuthProvider>
      </BrowserRouter>
    </ThemeProvider>
  );
}

test('Renders a link back to the dashboard', () => {
  renderProfile();
  expect(screen.getByText(/back to notes/i)).toBeInTheDocument();
});

test('Renders the theme toggle', () => {
  renderProfile();
  expect(screen.getByLabelText(/toggle dark mode/i)).toBeInTheDocument();
});

test('Renders a logout button', () => {
  renderProfile();
  expect(screen.getByText(/log out/i)).toBeInTheDocument();
});