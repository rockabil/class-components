import { useSelectedItemsStore } from './selected-items-store';

describe('SelectedItemsStore', () => {
  beforeEach(() => {   
    useSelectedItemsStore.setState({ selectedIds: [] });
  });

  it('should initialize with empty selectedIds', () => {
    const { selectedIds } = useSelectedItemsStore.getState();
    expect(selectedIds).toEqual([]);
  });

  it('should toggle select an item', () => {
    const { toggleSelect } = useSelectedItemsStore.getState();
    
    toggleSelect('item1');
    expect(useSelectedItemsStore.getState().selectedIds).toEqual(['item1']);
    
    toggleSelect('item2');
    expect(useSelectedItemsStore.getState().selectedIds).toEqual(['item1', 'item2']);
  });

  it('should toggle unselect an item', () => {
    const { toggleSelect } = useSelectedItemsStore.getState();
    
    toggleSelect('item1');
    toggleSelect('item2');
    expect(useSelectedItemsStore.getState().selectedIds).toEqual(['item1', 'item2']);
    
    toggleSelect('item1');
    expect(useSelectedItemsStore.getState().selectedIds).toEqual(['item2']);
  });

  it('should unselect all items', () => {
    const { toggleSelect, unselectAll } = useSelectedItemsStore.getState();
    
    toggleSelect('item1');
    toggleSelect('item2');
    expect(useSelectedItemsStore.getState().selectedIds).toHaveLength(2);
    
    unselectAll();
    expect(useSelectedItemsStore.getState().selectedIds).toEqual([]);
  });

  it('should set selected items', () => {
    const { setSelected } = useSelectedItemsStore.getState();
    
    setSelected(['item1', 'item3', 'item5']);
    expect(useSelectedItemsStore.getState().selectedIds).toEqual(['item1', 'item3', 'item5']);
  });
});