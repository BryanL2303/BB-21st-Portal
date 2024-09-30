/* eslint-disable */

import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import mockAxios from 'axios';
import { ResetPasswordPage } from '../../app/javascript/packs/userManagementPage/ResetPasswordPage';

jest.mock('axios');

setPageState = jest.fn();

describe('ResetPasswordPage Component', () => {
    beforeEach(() => {
        // Mock window.location.href
        delete window.location;
        window.location = { href: '' };
        jest.clearAllMocks();
    });

    it('should redirect if check session is unauthorised', async () => {
        mockAxios.post.mockRejectedValueOnce({
            response: { status: 401, statusText: 'Unauthorized' },
        });
    
        await act(async () => {
            render(<ResetPasswordPage />)
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

    it('should render page with current password', async () => {
        // Mock axios post response
        const mockResponse = {
            data: {
                id: 1,
                account_name: 'John Doe',
                password: 'John Doe',
                account_type: 'Boy',
                rank: 'REC',
                level: '1'
            }
        };

        mockAxios.post.mockResolvedValueOnce({
            data: true
        }).mockResolvedValueOnce(mockResponse);

        await act(async () => {
            render(<ResetPasswordPage />)
        })

        // Wait for axios post call and check its parameters
        await waitFor(() => expect(mockAxios.post).toHaveBeenCalledWith(
            '/application/0/check_session',
            {},
            { withCredentials: true }
        ));

        // Wait for axios post call and check its parameters
        await waitFor(() => expect(mockAxios.post).toHaveBeenCalledWith(
            '/api/account/0/get_own_account', {}, {withCredentials: true}
        ));

        const passwordInput = screen.getByDisplayValue('John Doe');
        await expect(passwordInput).toBeInTheDocument()
        const button = screen.getByText('Save Changes');
        await expect(button).toBeInTheDocument()
    });

    it('should call edit account with new password and inform user if successfull', async () => {
        // Mock axios post response
        const mockResponse = {
            data: {
                id: 1,
                account_name: 'John Doe',
                password: 'John Doe',
                account_type: 'Boy',
                rank: 'REC',
                level: '1'
            }
        };

        mockAxios.post.mockResolvedValueOnce({data: true})
        .mockResolvedValueOnce(mockResponse)
        .mockResolvedValueOnce({data: true});

        alert = jest.fn();

        await act(async () => {
            render(<ResetPasswordPage />)
        })

        // Wait for axios post call and check its parameters
        await waitFor(() => expect(mockAxios.post).toHaveBeenCalledWith(
            '/application/0/check_session',
            {},
            { withCredentials: true }
        ));

        // Wait for axios post call and check its parameters
        await waitFor(() => expect(mockAxios.post).toHaveBeenCalledWith(
            '/api/account/0/get_own_account', {}, {withCredentials: true}
        ));

        const passwordInput = screen.getByDisplayValue('John Doe');
        await expect(passwordInput).toBeInTheDocument()
        const button = screen.getByText('Save Changes');
        await expect(button).toBeInTheDocument()
    
        // Simulate button click
        fireEvent.change(passwordInput, { target: { value: 'new password' } });
        fireEvent.click(button);
    
        // Check if axios call happened
        await waitFor(() => {
            expect(mockAxios.post).toHaveBeenCalledWith(
                '/api/account/1/edit_account', {
                    id: 1,
                    account_name: 'John Doe',
                    password: 'new password',
                    account_type: 'Boy',
                    rank: 'REC',
                    level: '1',
                    credentials: undefined
                }, {withCredentials: true}
            );
        });

        await waitFor(() => {
            expect(alert).toHaveBeenCalledWith("Password has been updated successfully")
        })
    });

    it('should call edit account with new password and inform user if failed', async () => {
        // Mock axios post response
        const mockResponse = {
            data: {
                id: 1,
                account_name: 'John Doe',
                password: 'John Doe',
                account_type: 'Boy',
                rank: 'REC',
                level: '1'
            }
        };

        mockAxios.post.mockResolvedValueOnce({data: true})
        .mockResolvedValueOnce(mockResponse)
        .mockResolvedValueOnce({data: false});

        alert = jest.fn();

        await act(async () => {
            render(<ResetPasswordPage />)
        })

        // Wait for axios post call and check its parameters
        await waitFor(() => expect(mockAxios.post).toHaveBeenCalledWith(
            '/application/0/check_session',
            {},
            { withCredentials: true }
        ));

        // Wait for axios post call and check its parameters
        await waitFor(() => expect(mockAxios.post).toHaveBeenCalledWith(
            '/api/account/0/get_own_account', {}, {withCredentials: true}
        ));

        const passwordInput = screen.getByDisplayValue('John Doe');
        await expect(passwordInput).toBeInTheDocument()
        const button = screen.getByText('Save Changes');
        await expect(button).toBeInTheDocument()
    
        // Simulate button click
        fireEvent.change(passwordInput, { target: { value: 'new password' } });
        fireEvent.click(button);
    
        // Check if axios call happened
        await waitFor(() => {
            expect(mockAxios.post).toHaveBeenCalledWith(
                '/api/account/1/edit_account', {
                    id: 1,
                    account_name: 'John Doe',
                    password: 'new password',
                    account_type: 'Boy',
                    rank: 'REC',
                    level: '1',
                    credentials: undefined
                }, {withCredentials: true}
            );
        });

        await waitFor(() => {
            expect(alert).toHaveBeenCalledWith("Failed to update password")
        })
    });
});