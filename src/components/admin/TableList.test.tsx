import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import TableList from './TableList';
import TableCard from './TableCard';

jest.mock('./TableCard', () => {
  return jest.fn(({ name }) => {
    console.log(`Rendering TableCard with name: ${name}`);
    return <div data-testid="table-card">{name}</div>;
  });
});

describe('TableList Component', () => {
  test('renders the correct number of TableCard components', () => {
    render(<TableList />);

    // Debugging: Log the HTML output of the rendered component
    console.log(screen.debug());

    const tableCards = screen.getAllByTestId('table-card');
    console.log(`Found ${tableCards.length} TableCard components`);
    expect(tableCards).toHaveLength(3);
  });

  test('matches snapshot', () => {
    const { asFragment } = render(<TableList />);
    expect(asFragment()).toMatchSnapshot();
  });
});