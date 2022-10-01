import { stat } from 'fs/promises';

/**
 * Check if the given path exists
 * @param path The path to test
 * @returns Whether or not the path exists
 */
export function exists(path: string): Promise<boolean> {
  return stat(path)
    .then(() => true)
    .catch(() => false);
}
