import { render, screen } from '@testing-library/react';
import RichTextEditor from './RichTextEditor';
import { vi } from 'vitest';

test('Renders the formatting toolbar', () => {
  render(<RichTextEditor content="" onChange={vi.fn()} />);
  expect(screen.getByText('B')).toBeInTheDocument();
  expect(screen.getByText('• List')).toBeInTheDocument();
});