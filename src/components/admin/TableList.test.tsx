// src\components\admin\TableList.test.tsx

import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import TableList from './TableList';
import { useAuth } from '../../contexts/AuthContext';

// Mock the useAuth hook
jest.mock('../../contexts/AuthContext', () => ({
  useAuth: jest.fn(),
}));

// Mock the TableCard component
jest.mock('./TableCard.tsx', () => {
  return ({ link, name }: { link: string; name: string }) => (
    <div data-testid="table-card">
      <a href={link}>{name}</a>
    </div>
  );
});

describe('TableList Component', () => {
  const mockToken = 'mock-token';
  const mockTables = [
    { id: '1', name: 'Users', link: '/admin/tables/users' },
    { id: '2', name: 'Jobs', link: '/admin/tables/jobs' },
    { id: '3', name: 'Applications', link: '/admin/tables/jobs' },
  ];

  beforeEach(() => {
    (useAuth as jest.Mock).mockReturnValue({ token: mockToken });
    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  test('displays table cards on successful fetch', async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockTables,
    });

    render(<TableList />);

    await waitFor(() => {
      const tableCards = screen.getAllByTestId('table-card');
      expect(tableCards).toHaveLength(mockTables.length);
      mockTables.forEach(table => {
        expect(screen.getByText(table.name)).toBeInTheDocument();
      });
    });
  });

  test('h1 elements have correct text content', async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockTables,
    });

    render(<TableList />);

    //TODO: Look over this test
    await waitFor(() => {
      mockTables.forEach(table => {
        const h1Element = screen.getByText(table.name);
        console.log('H1:', h1Element.innerHTML);
        console.log('TAG Name', h1Element);
        expect(h1Element.innerHTML).toBe(table.name);
      });
    });
  });
});
