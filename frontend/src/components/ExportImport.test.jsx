import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import ExportImport from './ExportImport';
import * as noteApi from '../services/noteApi';

vi.mock('../services/noteApi');

test('Renders export and import buttons', () => {
  render(<ExportImport onImportSuccess={vi.fn()} />);
  expect(screen.getByText(/export notes/i)).toBeInTheDocument();
  expect(screen.getByText(/import notes/i)).toBeInTheDocument();
});

test('Triggers note import successfully on valid file upload', async () => {
  const onImportSuccess = vi.fn();
  noteApi.importNotes.mockResolvedValue({ data: { notes: [{ title: 'Imported' }] } });

  render(<ExportImport onImportSuccess={onImportSuccess} />);

  const file = new File([JSON.stringify([{ title: 'Imported' }])], 'notes.json', { type: 'application/json' });
  const input = screen.getByLabelText(/import notes/i, { selector: 'input' });

  fireEvent.change(input, { target: { files: [file] } });

  await waitFor(() => {
    expect(onImportSuccess).toHaveBeenCalled();
  });
});

test('Handles import error gracefully when upload fails', async () => {
  const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {});
  noteApi.importNotes.mockRejectedValue({ response: { data: { message: 'Invalid format' } } });

  render(<ExportImport onImportSuccess={vi.fn()} />);

  const file = new File(['invalid json'], 'notes.json', { type: 'application/json' });
  const input = screen.getByLabelText(/import notes/i, { selector: 'input' });

  fireEvent.change(input, { target: { files: [file] } });

  await waitFor(() => {
    expect(alertSpy).toHaveBeenCalled();
  });
  alertSpy.mockRestore();
});