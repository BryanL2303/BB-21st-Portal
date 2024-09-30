/* eslint-disable no-undef */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import mockAxios from 'axios';
import { BoyAccountsList } from '../../app/javascript/packs/userManagementPage/BoyAccountsList';

jest.mock('axios');

setPageState = jest.fn();

describe('BoyAccountsList Component', () => {
  it('should render list with accounts from axios', async () => {
    // Mock axios post response
    const mockResponse = {
        data: [
            {
                id: '1',
                account_name: 'John Doe',
                account_type: 'Boy',
                rank: 'REC',
                level: '1'
            },
            {
                id: '2',
                account_name: 'Joseph Doe',
                account_type: 'Boy',
                rank: 'LCP',
                level: '2'
            }
        ],
    };
    mockAxios.post.mockResolvedValue(mockResponse);

    await waitFor(() => {
        render(<BoyAccountsList setPageState={setPageState} load={false} />);
    });

    const button = screen.getByText('Boy Sec 1 REC John Doe');
    expect(button).toBeInTheDocument()
    const button2 = screen.getByText('Boy Sec 2 LCP Joseph Doe');
    expect(button2).toBeInTheDocument()
  });

  it('should call setPageState on click', async () => {
    // Mock axios post response
    const mockResponse = {
        data: [
            {
                id: '1',
                account_name: 'John Doe',
                account_type: 'Boy',
                rank: 'REC',
                level: '1'
            },
            {
                id: '2',
                account_name: 'Joseph Doe',
                account_type: 'Boy',
                rank: 'LCP',
                level: '2'
            }
        ],
    };
    mockAxios.post.mockResolvedValue(mockResponse);

    await waitFor(() => {
        render(<BoyAccountsList setPageState={setPageState} load={false} />);
    });

    expect(mockAxios.post).toHaveBeenCalledWith(
        '/api/account/0/get_accounts_by_type', {
        account_type: "Boy"},
        {withCredentials: true}
    );
  
    // Find input fields and button
    const johnDoeButton = screen.getByText('Boy Sec 1 REC John Doe');
    const josephDoeButton = screen.getByText('Boy Sec 2 LCP Joseph Doe');
  
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