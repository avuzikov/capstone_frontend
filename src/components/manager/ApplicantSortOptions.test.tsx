import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import ApplicantSortOptions from './ApplicantSortOptions';
import { Application } from '../../types/types';

type ApplicationStatus = Application['applicationStatus'];
type SortOption = 'date' | 'status';

describe('ApplicantSortOptions', () => {
  const mockOnSortChange = jest.fn();
  const mockOnFilterChange = jest.fn();

  const defaultProps = {
    sortBy: 'date' as SortOption,
    filterStatus: 'all' as ApplicationStatus | 'all',
    onSortChange: mockOnSortChange,
    onFilterChange: mockOnFilterChange,
    isLoading: false,
    totalApplications: 10,
  };

  it('renders correctly with default props', () => {
    const { getByLabelText, getByText } = render(<ApplicantSortOptions {...defaultProps} />);

    expect(getByLabelText(/Sort By/i)).toBeInTheDocument();
    expect(getByLabelText(/Filter by Status/i)).toBeInTheDocument();
    expect(getByText(/Total Applications: 10/i)).toBeInTheDocument();
  });

  it('calls onSortChange when sort option is changed', () => {
    const { getByLabelText } = render(<ApplicantSortOptions {...defaultProps} />);

    fireEvent.change(getByLabelText(/Sort By/i), { target: { value: 'status' } });

    expect(mockOnSortChange).toHaveBeenCalledWith('status');
  });

  it('calls onFilterChange when filter option is changed', () => {
    const { getByLabelText } = render(<ApplicantSortOptions {...defaultProps} />);

    fireEvent.change(getByLabelText(/Filter by Status/i), { target: { value: 'accepted' } });

    expect(mockOnFilterChange).toHaveBeenCalledWith('accepted');
  });

  it('disables dropdowns when isLoading is true', () => {
    const { getByLabelText } = render(<ApplicantSortOptions {...defaultProps} isLoading={true} />);

    expect(getByLabelText(/Sort By/i)).toBeDisabled();
    expect(getByLabelText(/Filter by Status/i)).toBeDisabled();
  });

  it('shows loading indicator when isLoading is true', () => {
    const { getByText } = render(<ApplicantSortOptions {...defaultProps} isLoading={true} />);

    expect(getByText(/Updating results.../i)).toBeInTheDocument();
  });
});
