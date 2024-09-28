/* eslint-disable no-undef */

import React from 'react'
import { render, screen } from '@testing-library/react';
import { UserManagementPage } from '../../app/javascript/packs/userManagementPage/UserManagementPage'

test('renders correct text', () => {
  render(<UserManagementPage />);
  const element = screen.getByText(/Create New Account/i);
  expect(element).toBeInTheDocument();
});