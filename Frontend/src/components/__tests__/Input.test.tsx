import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Input from '../Input';

describe('Input', () => {
  it('renders label text', () => {
    render(<Input label="Email" />);
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
  });

  it('accepts user input', async () => {
    render(<Input label="Email" />);
    const input = screen.getByLabelText('Email');

    await userEvent.type(input, 'test@test.com');
    expect(input).toHaveValue('test@test.com');
  });

  it('displays error message', () => {
    render(<Input label="Email" error="Invalid email" />);
    expect(screen.getByText('Invalid email')).toBeInTheDocument();
  });

  it('does not display error when not provided', () => {
    render(<Input label="Email" />);
    expect(screen.queryByText('Invalid email')).not.toBeInTheDocument();
  });
});
