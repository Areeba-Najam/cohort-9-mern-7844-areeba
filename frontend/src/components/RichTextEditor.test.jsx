import { render, screen } from '@testing-library/react';
import RichTextEditor from './RichTextEditor';
import { vi } from 'vitest';
import { ThemeProvider } from '../context/ThemeContext';

test('Renders the formatting toolbar', () => {
  render(
    <ThemeProvider>
      <RichTextEditor content="" onChange={vi.fn()} />
    </ThemeProvider>
  );
  expect(screen.getByText('B')).toBeInTheDocument();
  expect(screen.getByText('• List')).toBeInTheDocument();
});