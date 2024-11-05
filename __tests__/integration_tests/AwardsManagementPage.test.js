/* eslint-disable */

import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import mockAxios from 'axios';
import useCookies from '../../app/javascript/packs/general/useCookies';
import { AwardsManagementPage } from '../../app/javascript/packs/awardsManagementPage/AwardsManagementPage';

jest.mock('axios');
jest.mock('../../app/javascript/packs/general/useCookies');

let cookies;
confirm = jest.fn().mockReturnValue(true)

useCookies.mockReturnValue({
  get: jest.fn().mockReturnValue('Admin')
});

describe('AwardsManagementPage with all of its components', () => {
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
            render(<AwardsManagementPage />)
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

    it('should display AwardTracker by default with awards list', async () => {
        // Mock axios.post implementation
        mockAxios.post.mockImplementation((url, data) => {
            if (url === '/application/0/check_session') {
                return Promise.resolve({ data: true })  // Session check returns true
            }
            if (url === '/api/award/0/get_awards') {
                return Promise.resolve({ 
                    data: {
                        awards: [
                            {id: 1, badge_name: 'Target'},
                        ]
                    }
                })
            }
            if (url == '/api/award_tracker/0/get_attainments') {
                return Promise.resolve({
                    data: {

                    }
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
            return Promise.reject({response: { status: 401, statusText: 'Unauthorized' }})
        })

        await act(async () => {
            render(<AwardsManagementPage />)
        })

        // Wait for axios post call and check its parameters
        await waitFor(() => expect(mockAxios.post).toHaveBeenCalledWith(
            '/application/0/check_session',
            {},
            { withCredentials: true }
        ));

        await waitFor(() => {
            expect(mockAxios.post).toHaveBeenCalledWith(
                '/api/award/0/get_awards', {},
                { withCredentials: true }
            )

            expect(mockAxios.post).toHaveBeenCalledWith(
                '/api/award_tracker/0/get_attainments', {},
                {withCredentials: true}
            )
        });

        await waitFor(() => {
            // Awards lists
            expect(screen.getByText('Target')).toBeInTheDocument();
        })
    })

    it('should display awards information on click', async () => {
        // Mock axios.post implementation
        mockAxios.post.mockImplementation((url, data) => {
            if (url === '/application/0/check_session') {
                return Promise.resolve({ data: true })  // Session check returns true
            }
            if (url === '/api/award/0/get_awards') {
                return Promise.resolve({ 
                    data: {
                        awards: [
                            {id: 1, badge_name: 'Target'},
                        ]
                    }
                })
            }
            if (url == '/api/award_tracker/0/get_attainments') {
                return Promise.resolve({
                    data: {

                    }
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
            return Promise.reject({response: { status: 401, statusText: 'Unauthorized' }})
        })

        await act(async () => {
            render(<AwardsManagementPage />)
        })

        // Wait for axios post call and check its parameters
        await waitFor(() => expect(mockAxios.post).toHaveBeenCalledWith(
            '/application/0/check_session',
            {},
            { withCredentials: true }
        ));

        await waitFor(() => {
            expect(mockAxios.post).toHaveBeenCalledWith(
                '/api/award/0/get_awards', {},
                { withCredentials: true }
            )

            expect(mockAxios.post).toHaveBeenCalledWith(
                '/api/award_tracker/0/get_attainments', {},
                {withCredentials: true}
            )
        });

        await waitFor(() => {
            // Awards lists
            expect(screen.getByText('Target')).toBeInTheDocument();
            const targetButton = screen.getByText('Target')
            fireEvent.click(targetButton)
        })
    })

    it('should update AwardTracker and save changes', async () => {
        // Mock axios.post implementation
        mockAxios.post.mockImplementation((url, data) => {
            if (url === '/application/0/check_session') {
                return Promise.resolve({ data: true })  // Session check returns true
            }
            if (url === '/api/award/0/get_awards') {
                return Promise.resolve({ 
                    data: {
                        awards: [
                            {id: 1, badge_name: 'Target'},
                            {id: 2, badge_name: 'Adventure'}
                        ]
                    }
                })
            }
            if (url == '/api/award_tracker/0/get_attainments') {
                return Promise.resolve({
                    data: {
                        3: {
                            'Target': {}
                        }
                    }
                })
            }
            if (url === '/api/account/0/get_accounts_by_type' && data.account_type === "Boy") {
                // Boy accounts
                return Promise.resolve({
                    data: [
                        {
                            id: '3',
                            account_name: 'Colin Baker',
                            account_type: 'Boy',
                            rank: 'REC',
                            level: '1'
                        },
                    ],
                })
            }
            if (url === '/api/award_tracker/0/process_changes') {
                return Promise.resolve({
                    data: {
                        3: {
                            'Target': true
                        }
                    }
                })
            }
            return Promise.reject(new Error('Unknown API call'))
        })

        await act(async () => {
            render(<AwardsManagementPage />)
        })

        // Wait for axios post call and check its parameters
        await waitFor(() => expect(mockAxios.post).toHaveBeenCalledWith(
            '/application/0/check_session',
            {},
            { withCredentials: true }
        ));

        await waitFor(() => {
            expect(mockAxios.post).toHaveBeenCalledWith(
                '/api/award/0/get_awards', {},
                { withCredentials: true }
            )

            expect(mockAxios.post).toHaveBeenCalledWith(
                '/api/award_tracker/0/get_attainments', {},
                {withCredentials: true}
            )

            expect(mockAxios.post).toHaveBeenCalledWith(
                '/api/account/0/get_accounts_by_type',
                {account_type: "Boy"},
                {withCredentials: true}
            )
        });

        await waitFor(() => {
            // Awards lists
            expect(screen.getAllByText('Target')[0]).toBeInTheDocument();
            expect(screen.getAllByText('Colin Baker')[0]).toBeInTheDocument();
        })

        const checkBoxes = screen.getAllByRole('checkbox')
        fireEvent.click(checkBoxes[0])
        fireEvent.click(checkBoxes[21])
        const saveButton = screen.getByText('Save Changes')
        fireEvent.click(saveButton)

        await waitFor(() => {
            expect(confirm).toHaveBeenCalledWith("This will save the following changes:\nColin Baker: add Adventure Advanced,\nColin Baker: delete Target")
        })

        await waitFor(() => {
            expect(mockAxios.post).toHaveBeenCalledWith(
                '/api/award_tracker/0/process_changes',
                {
                    add: [{account_id: '3', award_name: 'Adventure', mastery_name: 'Advanced'}],
                    delete: [{account_id: '3', award_name: 'Target'}]
                },
                {withCredentials: true}
            )
        })
    })
})