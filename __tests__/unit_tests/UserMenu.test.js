/* eslint-disable no-undef */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { UserMenu } from '../../app/javascript/packs/general/UserMenu';
import useCookies from '../../app/javascript/packs/general/useCookies';
import axios from 'axios';

// Mock the dependencies
jest.mock('axios');
jest.mock('../../app/javascript/packs/general/useCookies');

describe('UserMenu Component', () => {
  let cookies;

  beforeEach(() => {
    useCookies.mockReturnValue({
        get: jest.fn(),
        remove: jest.fn(),
    });
    cookies = useCookies();
  });

  test('renders admin button when Type is Admin', () => {
    // Mock cookie to return 'Admin' when cookies.get("Type") is called
    cookies.get.mockImplementation((key) => {
        if (key === "Type") return 'Admin';
        return null;
    });
    
    render(<UserMenu />);
    
    const adminButton = screen.getByText('Admin Page');
    expect(adminButton).toBeInTheDocument();
  });

  test('renders non-boy buttons when Type is not Boy', () => {
    // Mock cookie to return 'Admin' when cookies.get("Type") is called
    cookies.get.mockImplementation((key) => {
        if (key === "Type") return 'Admin';
        return null;
    });
    
    render(<UserMenu />);

    const userManagementButton = screen.getByText('Users Management');
    expect(userManagementButton).toBeInTheDocument();
    
    const awardsButton = screen.getByText('Awards');
    expect(awardsButton).toBeInTheDocument();

    const resultGenerationButton = screen.getByText('Result Generation');
    expect(resultGenerationButton).toBeInTheDocument();
  });

  test('does not render non-boy buttons when Type is Boy', () => {
    // Mock cookie to return 'Boy' when cookies.get("Type") is called
    cookies.get.mockImplementation((key) => {
        if (key === "Type") return 'Boy';
        return null;
    });
    
    render(<UserMenu />);
  
    // Check that non-boy buttons do not exist in the DOM
    expect(screen.queryByText('Users Management')).not.toBeInTheDocument();
    expect(screen.queryByText('Awards')).not.toBeInTheDocument();
    expect(screen.queryByText('Result Generation')).not.toBeInTheDocument();
    expect(screen.queryByText('Uniform Inspection')).not.toBeInTheDocument();
    expect(screen.queryByText('Help')).not.toBeInTheDocument();
  });

  test('calls logOut function when Log Out button is clicked', async () => {
    // Mock the log out post request
    axios.post.mockResolvedValue({});

    render(<UserMenu />);

    // Find and click the log out button
    const logOutButton = screen.getByText('Log Out');
    fireEvent.click(logOutButton);

    // Check that cookies.remove was called for 'Name' and 'Type'
    await waitFor(() => {
      expect(cookies.remove).toHaveBeenCalledWith('Name', { path: '/' });
      expect(cookies.remove).toHaveBeenCalledWith('Type', { path: '/' });
    })

    // Check that axios.post was called to log out
    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith('/application/0/log_out', {}, { withCredentials: true });
    })
  });

  test('navigates to correct URL when admin button is clicked', async () => {
    // Mock cookie to return 'Admin' when cookies.get("Type") is called
    cookies.get.mockImplementation((key) => {
        if (key === "Type") return 'Admin';
        return null;
    });

    // Mock window.location.href
    delete window.location;
    window.location = { href: '' };

    render(<UserMenu />);

    // Find and click the admin button
    const adminButton = screen.getByText('Admin Page');
    fireEvent.click(adminButton);

    // Check if window.location.href was updated
    await waitFor(() => {
      expect(window.location.href).toBe('/admin');
    });
  });

  test('navigates to correct URL when users management button is clicked', async () => {
    // Mock cookie to return 'Admin' when cookies.get("Type") is called
    cookies.get.mockImplementation((key) => {
        if (key === "Type") return 'Admin';
        return null;
    });

    // Mock window.location.href
    delete window.location;
    window.location = { href: '' };

    render(<UserMenu />);

    // Find and click the admin button
    const button = screen.getByText('Users Management');
    fireEvent.click(button);

    // Check if window.location.href was updated
    await waitFor(() => {
      expect(window.location.href).toBe('/user_management');
    });
  });

  test('navigates to correct URL when award button is clicked', async () => {
    // Mock cookie to return 'Admin' when cookies.get("Type") is called
    cookies.get.mockImplementation((key) => {
        if (key === "Type") return 'Admin';
        return null;
    });

    // Mock window.location.href
    delete window.location;
    window.location = { href: '' };

    render(<UserMenu />);

    // Find and click the admin button
    const button = screen.getByText('Awards');
    fireEvent.click(button);

    // Check if window.location.href was updated
    await waitFor(() => {
      expect(window.location.href).toBe('/awards');
    });
  });

  test('navigates to correct URL when generate result button is clicked', async () => {
    // Mock cookie to return 'Admin' when cookies.get("Type") is called
    cookies.get.mockImplementation((key) => {
        if (key === "Type") return 'Admin';
        return null;
    });

    // Mock window.location.href
    delete window.location;
    window.location = { href: '' };

    render(<UserMenu />);

    // Find and click the admin button
    const button = screen.getByText('Result Generation');
    fireEvent.click(button);

    // Check if window.location.href was updated
    await waitFor(() => {
      expect(window.location.href).toBe('/generate_result');
    });
  });

  test('navigates to correct URL when help button is clicked', async () => {
    // Mock cookie to return 'Admin' when cookies.get("Type") is called
    cookies.get.mockImplementation((key) => {
        if (key === "Type") return 'Admin';
        return null;
    });

    // Mock window.location.href
    delete window.location;
    window.location = { href: '' };

    render(<UserMenu />);

    // Find and click the admin button
    const button = screen.getByText('Help');
    fireEvent.click(button);

    // Check if window.location.href was updated
    await waitFor(() => {
      expect(window.location.href).toBe('/help');
    });
  });
});