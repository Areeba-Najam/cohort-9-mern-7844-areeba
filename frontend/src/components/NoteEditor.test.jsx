import { render, screen, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';
import NoteEditor from './NoteEditor';
import { ThemeProvider } from '../context/ThemeContext';

test('Renders empty fields for a new note', () => {
  render(
    <ThemeProvider>
      <NoteEditor note={null} onSave={vi.fn()} onCancel={vi.fn()} />
    </ThemeProvider>
  );
  expect(screen.getByLabelText(/note title/i)).toHaveValue('');
});

test('Pre-fills fields when editing an existing note', () => {
  const note = { title: 'Existing', content: 'Body text', tags: ['work', 'urgent'] };
  render(
    <ThemeProvider>
      <NoteEditor note={note} onSave={vi.fn()} onCancel={vi.fn()} />
    </ThemeProvider>
  );
  expect(screen.getByLabelText(/note title/i)).toHaveValue('Existing');
  expect(screen.getByLabelText(/note tags/i)).toHaveValue('work, urgent');
});

test('Shows an error when saving without a title', async () => {
  const onSave = vi.fn();
  render(
    <ThemeProvider>
      <NoteEditor note={null} onSave={onSave} onCancel={vi.fn()} />
    </ThemeProvider>
  );
  fireEvent.click(screen.getByText(/save/i));
  expect(await screen.findByText(/title is required/i)).toBeInTheDocument();
  expect(onSave).not.toHaveBeenCalled();
});

test('Calls onCancel when cancel is clicked', () => {
  const onCancel = vi.fn();
  render(
    <ThemeProvider>
      <NoteEditor note={null} onSave={vi.fn()} onCancel={onCancel} />
    </ThemeProvider>
  );
  fireEvent.click(screen.getByText(/cancel/i));
  expect(onCancel).toHaveBeenCalled();
});

test('Warns before discarding unsaved changes on cancel', () => {
  const onCancel = vi.fn();
  const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(false);

  render(
    <ThemeProvider>
      <NoteEditor note={null} onSave={vi.fn()} onCancel={onCancel} />
    </ThemeProvider>
  );

  const titleInput = screen.getByLabelText(/note title/i);
  fireEvent.change(titleInput, { target: { value: 'Draft title' } });
  fireEvent.click(screen.getByText(/cancel/i));

  expect(confirmSpy).toHaveBeenCalled();
  expect(onCancel).not.toHaveBeenCalled();

  confirmSpy.mockRestore();
});