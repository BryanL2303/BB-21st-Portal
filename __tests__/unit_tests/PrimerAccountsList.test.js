/* eslint-disable no-undef */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import mockAxios from 'axios';
import { PrimerAccountsList } from '../../app/javascript/packs/userManagementPage/PrimerAccountsList';

jest.mock('axios');

setPageState = jest.fn();

describe('PrimerAccountsList Component', () => {
  it('should render list with accounts from axios', async () => {
    // Mock axios post response
    const mockResponse = {
        data: [
            {
                id: '1',
                account_name: 'John Doe',
                account_type: 'Primer',
                rank: 'CLT'
            },
            {
                id: '2',
                account_name: 'Joseph Doe',
                account_type: 'Primer',
                rank: 'SCL'
            }
        ],
    };
    mockAxios.post.mockResolvedValue(mockResponse);

    await waitFor(() => {
        render(<PrimerAccountsList setPageState={setPageState} load={false} />);
    });

    const button = screen.getByText('Primer CLT John Doe');
    expect(button).toBeInTheDocument()
    const button2 = screen.getByText('Primer SCL Joseph Doe');
    expect(button2).toBeInTheDocument()
  });

  it('should call setPageState on click', async () => {
    // Mock axios post response
    const mockResponse = {
        data: [
            {
                id: '1',
                account_name: 'John Doe',
                account_type: 'Primer',
                rank: 'CLT'
            },
            {
                id: '2',
                account_name: 'Joseph Doe',
                account_type: 'Primer',
                rank: 'SCL'
            }
        ],
    };
    mockAxios.post.mockResolvedValue(mockResponse);

    await waitFor(() => {
        render(<PrimerAccountsList setPageState={setPageState} load={false} />);
    });

    expect(mockAxios.post).toHaveBeenCalledWith(
        '/api/account/0/get_accounts_by_type', {
        account_type: "Primer"},
        {withCredentials: true}
    );
  
    // Find input fields and button
    const johnDoeButton = screen.getByText('Primer CLT John Doe');
    const josephDoeButton = screen.getByText('Primer SCL Joseph Doe');
  
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