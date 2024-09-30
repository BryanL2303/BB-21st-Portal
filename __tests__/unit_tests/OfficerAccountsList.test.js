/* eslint-disable no-undef */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import mockAxios from 'axios';
import { OfficerAccountsList } from '../../app/javascript/packs/userManagementPage/OfficerAccountsList';

jest.mock('axios');

setPageState = jest.fn();

describe('OfficerAccountsList Component', () => {
  it('should render list with accounts from axios', async () => {
    // Mock axios post response
    const mockResponse = {
        data: [
            {
                id: 1,
                account_name: 'John Doe',
                account_type: 'Officer',
                rank: '2LT'
            },
            {
                id: 2,
                account_name: 'Joseph Doe',
                account_type: 'Officer',
                rank: 'LTA'
            }
        ],
    };
    mockAxios.post.mockResolvedValue(mockResponse);

    await waitFor(() => {
        render(<OfficerAccountsList setPageState={setPageState} load={false} />);
    });

    const button = screen.getByText('Officer 2LT John Doe');
    expect(button).toBeInTheDocument()
    const button2 = screen.getByText('Officer LTA Joseph Doe');
    expect(button2).toBeInTheDocument()
  });

  it('should call setPageState on click', async () => {
    // Mock axios post response
    const mockResponse = {
        data: [
            {
                id: 1,
                account_name: 'John Doe',
                account_type: 'Officer',
                rank: '2LT'
            },
            {
                id: 2,
                account_name: 'Joseph Doe',
                account_type: 'Officer',
                rank: 'LTA'
            }
        ],
    };
    mockAxios.post.mockResolvedValue(mockResponse);

    await waitFor(() => {
        render(<OfficerAccountsList setPageState={setPageState} load={false} />);
    });

    expect(mockAxios.post).toHaveBeenCalledWith(
        '/api/account/0/get_accounts_by_type', {
        account_type: "Officer"},
        {withCredentials: true}
    );
  
    // Find input fields and button
    const johnDoeButton = screen.getByText('Officer 2LT John Doe');
    const josephDoeButton = screen.getByText('Officer LTA Joseph Doe');
  
    // Simulate button click
    fireEvent.click(johnDoeButton);
    fireEvent.click(josephDoeButton);
  
    // Check if setPageState were called
    await waitFor(() => {
      expect(setPageState).toHaveBeenCalledWith('1');
      expect(setPageState).toHaveBeenCalledWith('2');
    });
  });
});