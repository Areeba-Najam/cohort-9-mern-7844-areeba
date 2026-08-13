import { render, screen, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';
import NoteEditor from './NoteEditor';

test('Renders empty fields for a new note', () => {
  render(<NoteEditor note={null} onSave={vi.fn()} onCancel={vi.fn()} />);
  expect(screen.getByLabelText(/note title/i)).toHaveValue('');
});

test('Pre-fills fields when editing an existing note', () => {
  const note = { title: 'Existing', content: 'Body text', tags: ['work', 'urgent'] };
  render(<NoteEditor note={note} onSave={vi.fn()} onCancel={vi.fn()} />);
  expect(screen.getByLabelText(/note title/i)).toHaveValue('Existing');
  expect(screen.getByLabelText(/note tags/i)).toHaveValue('work, urgent');
});

test('Shows an error when saving without a title', async () => {
  const onSave = vi.fn();
  render(<NoteEditor note={null} onSave={onSave} onCancel={vi.fn()} />);
  fireEvent.click(screen.getByText(/save/i));
  expect(await screen.findByText(/title is required/i)).toBeInTheDocument();
  expect(onSave).not.toHaveBeenCalled();
});

test('Calls onCancel when cancel is clicked', () => {
  const onCancel = vi.fn();
  render(<NoteEditor note={null} onSave={vi.fn()} onCancel={onCancel} />);
  fireEvent.click(screen.getByText(/cancel/i));
  expect(onCancel).toHaveBeenCalled();
});