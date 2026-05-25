import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, beforeEach, afterEach, vi, beforeAll } from 'vitest';
import { Flyout } from './flyout';
import { useSelectedItemsStore } from '../../store/selected-items-store';

const mockCreateObjectURL = vi.fn();
const mockRevokeObjectURL = vi.fn();

beforeAll(() => {
  vi.stubGlobal('URL', {
    createObjectURL: mockCreateObjectURL,
    revokeObjectURL: mockRevokeObjectURL,
  });
});
afterEach(() => {
  vi.clearAllMocks();
});

const mockAllItems = [
  {
    id: '1',
    name: 'Jean-Luc Picard',
    gender: 'M',
    species: 'Human',
    deceased: false,
    organizations: ['Starfleet', 'USS Enterprise'],
    description: 'Captain of the USS Enterprise',
  },
  {
    id: '2',
    name: 'Spock',
    gender: 'M',
    species: 'Vulcan',
    deceased: false,
    organizations: ['Starfleet', 'USS Enterprise'],
    description: 'Science Officer',
  },
];

describe('Flyout', () => {
  beforeEach(() => {
    useSelectedItemsStore.setState({ selectedIds: [] });
  });

  it('should not render when no items are selected', () => {
    render(<Flyout allItems={mockAllItems} />);
    expect(screen.queryByText(/Selected:/)).not.toBeInTheDocument();
  });

  it('should render when at least one item is selected', () => {
    useSelectedItemsStore.setState({ selectedIds: ['1'] });
    render(<Flyout allItems={mockAllItems} />);
    
    expect(screen.getByText(/Selected: 1/)).toBeInTheDocument();
    expect(screen.getByText('Unselect all')).toBeInTheDocument();
    expect(screen.getByText('Download')).toBeInTheDocument();
  });

  it('should display correct number of selected items', () => {
    useSelectedItemsStore.setState({ selectedIds: ['1', '2'] });
    render(<Flyout allItems={mockAllItems} />);
    
    expect(screen.getByText('Selected: 2')).toBeInTheDocument();
  });

  it('should call unselectAll when clicking Unselect all button', () => {
    const unselectAllSpy = vi.spyOn(useSelectedItemsStore.getState(), 'unselectAll');
    
    useSelectedItemsStore.setState({ selectedIds: ['1'] });
    render(<Flyout allItems={mockAllItems} />);
    
    const unselectButton = screen.getByText('Unselect all');
    fireEvent.click(unselectButton);
    
    expect(unselectAllSpy).toHaveBeenCalledTimes(1);
    unselectAllSpy.mockRestore();
  });
});