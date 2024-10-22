import React from 'react';
import { render } from '@testing-library/react';
import DataTableManagementPage from './DataTableManagementPage';
import { MemoryRouter } from 'react-router';

describe('DataTableManagementPage', () => {
  it('renders without error', () => {
    render(
      <MemoryRouter>
        <DataTableManagementPage />
      </MemoryRouter>
    );
  });
});
