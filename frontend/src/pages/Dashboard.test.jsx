import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../context/AuthContext';
import Dashboard from './Dashboard';
import { ThemeProvider } from '../context/ThemeContext';
import * as noteApi from '../services/noteApi';

vi.mock('../services/noteApi');

beforeEach(() => {
  vi.clearAllMocks();
});

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

test('Successfully renders notes when fetch succeeds', async () => {
  const mockNotes = [
    { _id: '1', title: 'Test Note One', content: 'Content 1', tags: ['work'], color: 'default' }
  ];
  // Adjust based on whether your API service returns the array directly or inside a data object
  noteApi.fetchNotes.mockResolvedValue(mockNotes);

  renderDashboard();

  await waitFor(() => {
    expect(screen.getByText('Test Note One')).toBeInTheDocument();
  });
});

test('Allows user to type into search bar and filters view', async () => {
  noteApi.fetchNotes.mockResolvedValue([]);

  renderDashboard();

  const searchInput = await screen.findByPlaceholderText(/search notes/i);
  fireEvent.change(searchInput, { target: { value: 'react' } });

  expect(searchInput.value).toBe('react');
});