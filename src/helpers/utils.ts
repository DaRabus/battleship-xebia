import { NextResponse } from 'next/server';

export function createSortableEnumFromModel<T extends object>(
  model: T
): string[] {
  const keys = Object.keys(model);

  const sortableFields = keys.reduce((accumulator, key) => {
    accumulator.push(`${key}:asc`, `${key}:desc`);
    return accumulator;
  }, [] as string[]);
  return sortableFields;
}

export const errorResponse = (message: string, status: number) =>
  NextResponse.json({ success: false }, { status, statusText: message });

export function formatAiResponse(rawResponse: string) {
  // 1. Extract all lines starting with 0:"..."
  const regex = /0:"(.*?)"/gs;
  const lines = [];
  let match;
  while ((match = regex.exec(rawResponse)) !== null) {
    lines.push(match[1]);
  }
  // 2. Join lines into a single string
  const joined = lines.join('');
  // 3. Replace escaped newlines with real newlines
  return joined.replace(/\\n/g, '\n');
}
