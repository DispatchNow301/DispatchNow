import { listSlots, readSave, writeNewSave, touchSave, deleteSave } from '../lib/saves';

const mockLocalStorage = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};

beforeEach(() => {
  Object.defineProperty(window, 'localStorage', {
    value: mockLocalStorage,
    writable: true,
  });
  jest.clearAllMocks();
});

describe('listSlots', () => {
  it('returns slots for local scope', () => {
    const slots = listSlots('local');
    expect(slots).toHaveLength(3);
    expect(slots[0]).toEqual({ scope: 'local', index: 1 });
  });

  it('returns slots for cloud scope with userId', () => {
    const slots = listSlots('cloud', 'user123');
    expect(slots).toHaveLength(3);
    expect(slots[0]).toEqual({ scope: 'cloud', index: 1, userId: 'user123' });
  });
});

describe('readSave', () => {
  it('returns null when no save exists', () => {
    mockLocalStorage.getItem.mockReturnValue(null);
    const result = readSave({ scope: 'local', index: 1 });
    expect(result).toBeNull();
  });

  it('returns parsed save data', () => {
    const saveData = {
      meta: { title: 'Test Save', updatedAt: 1234567890 },
      payload: { version: 1 }
    };
    mockLocalStorage.getItem.mockReturnValue(JSON.stringify(saveData));
    const result = readSave({ scope: 'local', index: 1 });
    expect(result).toEqual(saveData);
  });

  it('returns null for invalid JSON', () => {
    mockLocalStorage.getItem.mockReturnValue('invalid json');
    const result = readSave({ scope: 'local', index: 1 });
    expect(result).toBeNull();
  });
});

describe('writeNewSave', () => {
  it('writes new save to localStorage', () => {
    const result = writeNewSave({ scope: 'local', index: 1 }, 'New Game');
    expect(mockLocalStorage.setItem).toHaveBeenCalled();
    expect(result.meta.title).toBe('New Game');
    expect(result.payload).toHaveProperty('version', 1);
  });
});

describe('touchSave', () => {
  it('updates timestamp of existing save', () => {
    const existingSave = {
      meta: { title: 'Old Save', updatedAt: 1000000000 },
      payload: { version: 1 }
    };
    mockLocalStorage.getItem.mockReturnValue(JSON.stringify(existingSave));

    const result = touchSave({ scope: 'local', index: 1 });
    expect(mockLocalStorage.setItem).toHaveBeenCalled();
    expect(result!.meta.updatedAt).toBeGreaterThan(1000000000);
  });

  it('returns null when save does not exist', () => {
    mockLocalStorage.getItem.mockReturnValue(null);
    const result = touchSave({ scope: 'local', index: 1 });
    expect(result).toBeNull();
  });
});

describe('deleteSave', () => {
  it('removes save from localStorage', () => {
    deleteSave({ scope: 'local', index: 1 });
    expect(mockLocalStorage.removeItem).toHaveBeenCalledWith('vigilante:save:local:1');
  });
});