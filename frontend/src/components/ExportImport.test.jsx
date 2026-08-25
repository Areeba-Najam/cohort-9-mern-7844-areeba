import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import ExportImport from './ExportImport';

test('Renders export and import buttons correctly', () => {
  render(<ExportImport notes={[]} selectedIds={[]} onImported={vi.fn()} />);
  expect(screen.getByText(/export all/i)).toBeInTheDocument();
  expect(screen.getByText(/^import$/i)).toBeInTheDocument();
});

test('Triggers file input selection on import', async () => {
  const onImported = vi.fn();
  render(<ExportImport notes={[]} selectedIds={[]} onImported={onImported} />);

  const file = new File([JSON.stringify([{ title: 'Note 1' }])], 'notes.json', { type: 'application/json' });
  const input = document.querySelector('input[type="file"]');

  fireEvent.change(input, { target: { files: [file] } });

  await waitFor(() => {
    expect(input.files[0]).toBe(file);
  });
});