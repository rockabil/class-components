import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '../__tests__/test-utils';
import userEvent from '@testing-library/user-event';
import { SearchForm } from './search-form';

describe('SearchForm', () => {
  const mockOnSearch = vi.fn();

  beforeEach(() => {
    mockOnSearch.mockClear();
    localStorage.clear();
  });

  describe('Rendering Tests', () => {
    it('should render the input field and buttons', () => {
      render(<SearchForm onSearch={mockOnSearch} loading={false} />);

      expect(screen.getByRole('textbox')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /find/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /clear/i })).toBeInTheDocument();
    });

    it('should display initialQuery in the input field', () => {
      render(
        <SearchForm
          onSearch={mockOnSearch}
          loading={false}
          initialQuery="Spock"
        />
      );

      expect(screen.getByDisplayValue('Spock')).toBeInTheDocument();
    });

    it('should disable the input fields when loading=true', () => {
      render(<SearchForm onSearch={mockOnSearch} loading={true} />);

      expect(screen.getByRole('textbox')).toBeDisabled();
      expect(screen.getByRole('button', { name: /searching/i })).toBeDisabled();
    });
  });

  describe('User Interaction Tests', () => {
    it('should update the value when text is entered', async () => {
      const user = userEvent.setup();
      render(<SearchForm onSearch={mockOnSearch} loading={false} />);

      const input = screen.getByRole('textbox');
      await user.type(input, 'Kirk');

      expect(input).toHaveValue('Kirk');
    });

    it('should call onSearch with the correct value upon submission', async () => {
      const user = userEvent.setup();
      render(<SearchForm onSearch={mockOnSearch} loading={false} />);

      const input = screen.getByRole('textbox');
      await user.type(input, 'Picard');
      await user.click(screen.getByRole('button', { name: /find/i }));

      expect(mockOnSearch).toHaveBeenCalledWith('Picard');
    });

    it('should clear the field and call onSearch with an empty string when clicking Clear button', async () => {
      const user = userEvent.setup();
      render(<SearchForm onSearch={mockOnSearch} loading={false} />);

      const input = screen.getByRole('textbox');
      await user.type(input, 'Data');
      await user.click(screen.getByRole('button', { name: /clear/i }));

      expect(input).toHaveValue('');
      expect(mockOnSearch).toHaveBeenCalledWith('');
    });
  });
});