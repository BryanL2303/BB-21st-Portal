/* eslint-disable no-undef */

import React from 'react'
import { render, screen } from '@testing-library/react';
import { LogInPage } from '../app/javascript/packs/logInPage/LogInPage'

test('renders correct text', () => {
  render(<LogInPage />);
  const element = screen.getByText(/expected text/i);
  expect(element).toBeInTheDocument();
});