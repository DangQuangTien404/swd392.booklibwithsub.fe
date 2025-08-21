import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from './App';

test('shows loading fallback', () => {
  render(
    <MemoryRouter>
      <App />
    </MemoryRouter>,
  );
  const loading = screen.getByText(/Loading/i);
  expect(loading).toBeInTheDocument();
});
