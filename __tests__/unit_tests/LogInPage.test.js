/* eslint-disable */

import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import mockAxios from 'axios';
import { LogInPage } from '../../app/javascript/packs/logInPage/LogInPage';

jest.mock('axios');

describe('LogInPage Component', () => {
  beforeEach(() => {

    // Mock window.location.href
    delete window.location;
    window.location = { href: '' };
  });

  it('should redirect if check session is ok', async () => {
    mockAxios.post.mockResolvedValue({
      data: {
        user: {
          account_name: 'testuser',
          account_type: 'Admin',
        }
      },
    });

    render(<LogInPage />)

    // Wait for axios post call and check its parameters
    await waitFor(() => expect(mockAxios.post).toHaveBeenCalledWith(
      "/application/0/check_session",
      {},
      { withCredentials: true }
    ));
  
    // Ensure redirection happens
    await waitFor(() => {
      expect(window.location.href).toBe("/home");
    });
  })

  it('should render the Log In button', async () => {
    mockAxios.post.mockRejectedValue({
      response: { status: 401, statusText: 'Unauthorized' },
    });

    render(<LogInPage />);

    // Wait for axios post call and check its parameters
    await act(() => expect(mockAxios.post).toHaveBeenCalledWith(
      '/application/0/check_session',
      {},
      { withCredentials: true }
    ));

    await expect(mockAxios.post).rejects.toEqual({
      response: { status: 401, statusText: 'Unauthorized' },
    });

    const loginButton = screen.getByText('Log In');
    expect(loginButton).toBeInTheDocument()    
  });

  it('should trigger axios call on form submission with correct values', async () => {
    mockAxios.post.mockRejectedValue({
      response: { status: 401, statusText: 'Unauthorized' },
    });

    render(<LogInPage />);
  
    // Wait for axios post call and check its parameters
    expect(mockAxios.post).toHaveBeenCalledWith(
        '/application/0/check_session',
        {},
        { withCredentials: true }
    );

    // Mock axios post response
    const mockResponse = {
      data: {
        account_name: 'testuser',
        account_type: 'Admin',
      },
    };
    mockAxios.post.mockResolvedValue(mockResponse);
  
    // Find input fields and button
    const usernameInput = screen.getByPlaceholderText('Enter Username');
    const passwordInput = screen.getByPlaceholderText('Enter Password');
    const loginButton = screen.getByText('Log In');
  
    // Simulate user input
    fireEvent.change(usernameInput, { target: { value: 'testuser' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });

    // Simulate form submission
    fireEvent.click(loginButton);
  
    await waitFor(() => {
      expect(mockAxios.post).toHaveBeenCalledWith(
        '/api/account/0/authenticate_account',
        {
          user_name: 'testuser',
          password: 'password123',
        },
        { withCredentials: true }
      )
    });
  
    // Check if redirection happens
    await waitFor(() => {
      expect(window.location.href).toBe('/home');
    });
  });
});