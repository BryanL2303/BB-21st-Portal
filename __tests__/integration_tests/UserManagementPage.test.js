/* eslint-disable */

import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import mockAxios from 'axios';
import useCookies from '../../app/javascript/packs/general/useCookies';
import { UserManagementPage } from '../../app/javascript/packs/userManagementPage/UserManagementPage';

jest.mock('axios');
jest.mock('../../app/javascript/packs/general/useCookies');

let cookies;

useCookies.mockReturnValue({
  get: jest.fn().mockReturnValue('Admin')
});

describe('UserManagementPage with all of its components', () => {
    beforeEach(() => {
        // Mock window.location.href
        delete window.location;
        window.location = { href: '' };
        jest.clearAllMocks();

        cookies = useCookies();
    });

    it('should redirect if check session is unauthorised', async () => {
        mockAxios.post.mockRejectedValueOnce({
            response: { status: 401, statusText: 'Unauthorized' },
        });
    
        await act(async () => {
            render(<UserManagementPage />)
        })

        // Wait for axios post call and check its parameters
        await waitFor(() => expect(mockAxios.post).toHaveBeenCalledWith(
          '/application/0/check_session',
          {},
          { withCredentials: true }
        ));
    
        // Check if redirection happens
        await waitFor(() => {
            expect(window.location.href).toBe('/');
        });
    })

    it('should display AccountCreationForm by default with all accounts list', async () => {
        // Mock axios.post implementation
        mockAxios.post.mockImplementation((url, data) => {
            if (url === '/application/0/check_session') {
                return Promise.resolve({ data: true })  // Session check returns true
            }
            if (url === '/api/account/0/get_accounts_by_type' && data.account_type === "Officer") {
                // Officer accounts
                return Promise.resolve({ data: [] })
            }
            if (url === '/api/account/0/get_accounts_by_type' && data.account_type === "Primer") {
                // Primer accounts
                return Promise.resolve({
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
                })
            }
            if (url === '/api/account/0/get_accounts_by_type' && data.account_type === "Boy") {
                // Boy accounts
                return Promise.resolve({
                    data: [
                        {
                            id: '3',
                            account_name: 'Elon Musk',
                            account_type: 'Boy',
                            rank: 'REC',
                            level: '1'
                        },
                        {
                            id: '4',
                            account_name: 'Colin Baker',
                            account_type: 'Boy',
                            rank: 'REC',
                            level: '1'
                        }
                    ],
                })
            }
            return Promise.reject(new Error('Unknown API call'))
        })

        await act(async () => {
            render(<UserManagementPage />)
        })

        // Wait for axios post call and check its parameters
        await waitFor(() => expect(mockAxios.post).toHaveBeenCalledWith(
            '/application/0/check_session',
            {},
            { withCredentials: true }
        ));

        await waitFor(() => {
            expect(mockAxios.post).toHaveBeenCalledWith(
                '/api/account/0/get_accounts_by_type',
                {account_type: "Officer"},
                {withCredentials: true}
            )

            expect(mockAxios.post).toHaveBeenCalledWith(
                '/api/account/0/get_accounts_by_type',
                {account_type: "Primer"},
                {withCredentials: true}
            )

            expect(mockAxios.post).toHaveBeenCalledWith(
                '/api/account/0/get_accounts_by_type',
                {account_type: "Boy"},
                {withCredentials: true}
            )
        });

        await waitFor(() => {
            // Accounts lists
            expect(screen.getByText('Primer CLT John Doe')).toBeInTheDocument();
            expect(screen.getByText('Primer SCL Joseph Doe')).toBeInTheDocument();
            expect(screen.getByText('Boy Sec 1 REC Elon Musk')).toBeInTheDocument();
            expect(screen.getByText('Boy Sec 1 REC Colin Baker')).toBeInTheDocument();
            // Accounts Creation Form
            expect(screen.getByPlaceholderText('username')).toBeInTheDocument();
            expect(screen.getByPlaceholderText('password')).toBeInTheDocument();
            expect(screen.getByText('Boy')).toBeInTheDocument();
            expect(screen.getByText('REC')).toBeInTheDocument();
            expect(screen.getByText('1')).toBeInTheDocument();
        })
    })

    it('should display accounts information when clicking on button', async () => {
        // Mock axios.post implementation
        mockAxios.post.mockImplementation((url, data) => {
            if (url === '/application/0/check_session') {
                return Promise.resolve({ data: true })  // Session check returns true
            }
            if (url === '/api/account/0/get_accounts_by_type' && data.account_type === "Officer") {
                // Officer accounts
                return Promise.resolve({ data: [] })
            }
            if (url === '/api/account/0/get_accounts_by_type' && data.account_type === "Primer") {
                // Primer accounts
                return Promise.resolve({
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
                })
            }
            if (url === '/api/account/0/get_accounts_by_type' && data.account_type === "Boy") {
                // Boy accounts
                return Promise.resolve({
                    data: [
                        {
                            id: '3',
                            account_name: 'Elon Musk',
                            account_type: 'Boy',
                            rank: 'REC',
                            level: '1'
                        },
                        {
                            id: '4',
                            account_name: 'Colin Baker',
                            account_type: 'Boy',
                            rank: 'REC',
                            level: '1'
                        }
                    ],
                })
            }
            if (url === '/api/account/1/get_account_information') {
                return Promise.resolve({
                    data: {
                        id: 1,
                        account_name: 'John Doe',
                        password: 'John Doe',
                        account_type: 'Primer',
                        rank: 'CLT',
                        credential: 'Platoon Primer'
                    }
                })
            }
            return Promise.reject(new Error('Unknown API call'))
        })

        await act(async () => {
            render(<UserManagementPage />)
        })

        // Wait for axios post call and check its parameters
        await waitFor(() => expect(mockAxios.post).toHaveBeenCalledWith(
            '/application/0/check_session',
            {},
            { withCredentials: true }
        ));

        await waitFor(() => {
            expect(mockAxios.post).toHaveBeenCalledWith(
                '/api/account/0/get_accounts_by_type',
                {account_type: "Officer"},
                {withCredentials: true}
            )

            expect(mockAxios.post).toHaveBeenCalledWith(
                '/api/account/0/get_accounts_by_type',
                {account_type: "Primer"},
                {withCredentials: true}
            )

            expect(mockAxios.post).toHaveBeenCalledWith(
                '/api/account/0/get_accounts_by_type',
                {account_type: "Boy"},
                {withCredentials: true}
            )
        });

        await waitFor(() => {
            // Accounts lists
            expect(screen.getByText('Primer CLT John Doe')).toBeInTheDocument();
            expect(screen.getByText('Primer SCL Joseph Doe')).toBeInTheDocument();
            expect(screen.getByText('Boy Sec 1 REC Elon Musk')).toBeInTheDocument();
            expect(screen.getByText('Boy Sec 1 REC Colin Baker')).toBeInTheDocument();
            // Accounts Creation Form
            expect(screen.getByPlaceholderText('username')).toBeInTheDocument();
            expect(screen.getByPlaceholderText('password')).toBeInTheDocument();
            expect(screen.getByText('Boy')).toBeInTheDocument();
            expect(screen.getByText('REC')).toBeInTheDocument();
            expect(screen.getByText('1')).toBeInTheDocument();
        })

        const johnDoeButton = screen.getByText('Primer CLT John Doe')
        fireEvent.click(johnDoeButton)

        await waitFor(() => {
            expect(mockAxios.post).toHaveBeenCalledWith(
                '/api/account/1/get_account_information',
                {'id': '1'},
                {withCredentials: true},
            )
        })

        await waitFor(() => {
            // This should check if account information is on the screen
            expect(screen.getByText('Primer CLT John Doe')).toBeInTheDocument();
        })
    })
})