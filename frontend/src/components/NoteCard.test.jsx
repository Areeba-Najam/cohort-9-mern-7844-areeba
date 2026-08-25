import { render, screen, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';
import NoteCard from './NoteCard';
import { ThemeProvider } from '../context/ThemeContext';

test('Renders note card title and triggers actions correctly', () => {
  const note = { 
    _id: '123', 
    title: 'Sample Title', 
    content: 'Sample Content', 
    tags: ['tag1'], 
    color: 'default',
    updatedAt: new Date().toISOString()
  };
  
  const onOpen = vi.fn();
  const onDelete = vi.fn();
  const onTogglePin = vi.fn();
  const onToggleSelect = vi.fn();

  render(
    <ThemeProvider>
      <NoteCard 
        note={note} 
        onOpen={onOpen}
        onDelete={onDelete} 
        onTogglePin={onTogglePin}
        isSelected={false}
        onToggleSelect={onToggleSelect}
      />
    </ThemeProvider>
  );

  expect(screen.getByText('Sample Title')).toBeInTheDocument();
  
  const editButton = screen.getByRole('button', { name: 'Edit note' });
  fireEvent.click(editButton);
  expect(onOpen).toHaveBeenCalledWith(note);

  const deleteButton = screen.getByRole('button', { name: 'Delete note' });
  fireEvent.click(deleteButton);
  expect(onDelete).toHaveBeenCalledWith(note);
});