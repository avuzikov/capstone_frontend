import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import JobSearchForm from './JobSearchForm';

describe('JobSearchForm', () => {
  it('calls setSearchQuery with the correct value on form submission', () => {
    const setSearchQuery = jest.fn();
    render(<JobSearchForm setSearchQuery={setSearchQuery} />);

    const input = screen.getByPlaceholderText('Search...');
    fireEvent.change(input, { target: { value: 'Engineer' } });
    expect(input).toHaveValue('Engineer');

    const button = screen.getByRole('button', { name: /search/i });
    fireEvent.click(button);
    expect(setSearchQuery).toHaveBeenCalledWith('engineer');
  });

  it('calls setSearchQuery with an empty string when input is cleared', () => {
    const setSearchQuery = jest.fn();
    render(<JobSearchForm setSearchQuery={setSearchQuery} />);

    const input = screen.getByPlaceholderText('Search...');
    fireEvent.change(input, { target: { value: 'Engineer' } });
    expect(input).toHaveValue('Engineer');

    fireEvent.change(input, { target: { value: '' } });
    expect(input).toHaveValue('');
    expect(setSearchQuery).toHaveBeenCalledWith('');
  });
});
