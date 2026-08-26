import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import ExportImport from './ExportImport';
import api from '../services/api';

vi.mock('../services/api', () => ({
  default: {
    post: vi.fn(),
    get: vi.fn(),
    patch: vi.fn(),
    delete: vi.fn(),
  },
}));

if (!File.prototype.text) {
  File.prototype.text = function () {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsText(this);
    });
  };
}

beforeEach(() => {
  window.alert = vi.fn();
  vi.clearAllMocks();
});

test('Renders export and import buttons correctly', () => {
  render(<ExportImport notes={[]} selectedIds={[]} onImported={vi.fn()} />);
  expect(screen.getByText(/export all/i)).toBeInTheDocument();
  expect(screen.getByText(/^import$/i)).toBeInTheDocument();
});

test('Triggers file input selection on import ', async () => {
  api.post.mockResolvedValue({
    data: { data: { notes: [{ _id: 'n1', title: 'Note 1' }] } },
  });
  const onImported = vi.fn();
  render(<ExportImport notes={[]} selectedIds={[]} onImported={onImported} />);

  const file = new File([JSON.stringify([{ title: 'Note 1' }])], 'notes.json', { type: 'application/json' });
  const input = document.querySelector('input[type="file"]');

  fireEvent.change(input, { target: { files: [file] } });

  await waitFor(() => {
    expect(api.post).toHaveBeenCalledWith('/notes/import', [{ title: 'Note 1' }]);
    expect(onImported).toHaveBeenCalledWith([{ _id: 'n1', title: 'Note 1' }]);
  });
});
;