import { render, screen, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../context/AuthContext';
import Dashboard from './Dashboard';
import { ThemeProvider } from '../context/ThemeContext';
import * as noteApi from '../services/noteApi';


vi.mock('../services/noteApi');

function renderDashboard() {
  return render(
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <Dashboard />
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

test('Shows an error message when notes fail to load', async () => {
  noteApi.fetchNotes.mockRejectedValue(new Error('Network error'));
  renderDashboard();

  await waitFor(() => {
    expect(screen.getByText(/Could not load your notes/i)).toBeInTheDocument();
  });
});

test('Exits loading state even when the request fails', async () => {
  noteApi.fetchNotes.mockRejectedValue(new Error('Network error'));
  renderDashboard();

  await waitFor(() => {
    expect(screen.queryByText(/loading notes/i)).not.toBeInTheDocument();
  });
});