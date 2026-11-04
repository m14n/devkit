import { readFile } from 'node:fs/promises';

/**
 * Reads a file. Uses Node types and an empty interface, which must not be reported.
 * @param path - The file path.
 */
export async function read(path: string): Promise<string> {
  const timer: NodeJS.Timeout = setTimeout(() => undefined, 10);
  clearTimeout(timer);
  return readFile(path, 'utf8');
}

export interface Empty {}
