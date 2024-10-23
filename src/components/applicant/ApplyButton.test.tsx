import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { useNavigate } from 'react-router';
import ApplyButton from './ApplyButton';

// Mock useNavigate from react-router
jest.mock('react-router', () => ({
  useNavigate: jest.fn(),
}));

describe('ApplyButton', () => {
  it('navigates to the apply page with the correct id when clicked', () => {
    const navigate = jest.fn();
    (useNavigate as jest.Mock).mockReturnValue(navigate);

    const { getByText } = render(<ApplyButton id="123" />);

    fireEvent.click(getByText(/Apply now!/i));

    expect(navigate).toHaveBeenCalledWith('/apply/123');
  });

  it('does not navigate if id is undefined', () => {
    const navigate = jest.fn();
    (useNavigate as jest.Mock).mockReturnValue(navigate);

    const { getByText } = render(<ApplyButton id={undefined} />);

    fireEvent.click(getByText(/Apply now!/i));

    expect(navigate).not.toHaveBeenCalled();
  });
});
