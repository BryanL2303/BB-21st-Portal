/* eslint-disable no-undef */

import React from 'react'
import { render, screen } from '@testing-library/react';
import { LogInPage } from '../../app/javascript/packs/logInPage/LogInPage'

test('renders correct text', () => {
  render(<LogInPage />);
  const element = screen.getByText(/BB 21st Portal/i);
  expect(element).toBeInTheDocument();
});