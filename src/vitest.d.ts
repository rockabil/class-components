import 'vitest';

declare global {
  interface URL {
    createObjectURL: typeof URL.createObjectURL;
    revokeObjectURL: typeof URL.revokeObjectURL;
  }
}