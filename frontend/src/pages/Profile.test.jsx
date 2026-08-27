import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../context/AuthContext';
import { ThemeProvider } from '../context/ThemeContext';
import Profile from './Profile';
import { vi } from 'vitest';
import * as noteApi from '../services/noteApi';

vi.mock('../services/noteApi');

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

test('Displays the notes count after loading', async () => {
  noteApi.fetchNotes.mockResolvedValue([{ _id: '1' }, { _id: '2' }, { _id: '3' }]);
  renderProfile();
  await waitFor(() => {
    expect(screen.getByText('3')).toBeInTheDocument();
  });
});

test('Shows a loading indicator before notes count resolves', () => {
  noteApi.fetchNotes.mockReturnValue(new Promise(() => {})); 
  renderProfile();
  expect(screen.getByText('...')).toBeInTheDocument();
});

test('Handles a failed notes fetch gracefully without crashing', async () => {
  noteApi.fetchNotes.mockRejectedValue(new Error('Network error'));
  renderProfile();
  await waitFor(() => {
    expect(screen.getByText('0')).toBeInTheDocument();
  });
});