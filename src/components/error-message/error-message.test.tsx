import { describe, it, expect } from 'vitest';
import { render, screen } from '../__tests__/test-utils';
import ErrorMessage from './error-message';

describe('ErrorMessage', () => {
  it('should display the error message', () => {
    render(<ErrorMessage message="Something went wrong" />);

    expect(screen.getByText(/Error:/i)).toBeInTheDocument();
    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
  });

  it('should have role="alert" for accessibility', () => {
    render(<ErrorMessage message="Test error" />);

    expect(screen.getByRole('alert')).toBeInTheDocument();
  });
});