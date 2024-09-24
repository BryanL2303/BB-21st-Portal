process.env.NODE_ENV = process.env.NODE_ENV || 'test'

const environment = require('./environment')

module.exports = environment.toWebpackConfig()


import { render, screen } from '@testing-library/react';
import { LogInPage } from '../../app/javascript/packs/logInPage';

test('renders correct text', () => {
  render(<LogInPage />);
  const element = screen.getByText(/expected text/i);
  expect(element).toBeInTheDocument();
});