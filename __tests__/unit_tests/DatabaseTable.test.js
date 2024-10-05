/* eslint-disable */

import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import mockAxios from 'axios';
import { DatabaseTable } from '../../app/javascript/packs/adminPage/DatabaseTable';

jest.mock('axios');

setPageState = jest.fn();

describe('DatabaseTable Component', () => {
    beforeEach(() => {
        // Mock window.location.href
        delete window.location;
        window.location = { href: '' };
        jest.clearAllMocks();
    });

    it('should retrieve table and display it correctly', async () => {
        const mockResponse = {
            data: {
                data: [
                    {
                        id: 1,
                        account_name: 'John Doe',
                        account_type: 'Boy',
                        password: 'John Doe',
                        rank: 'REC',
                        level: 1,
                        credentials: null
                    }
                ],
                columns: ['id', 'account_name', 'account_type', 'password', 'rank', 'level', 'credentials']
            }
        }
        mockAxios.post.mockResolvedValueOnce(mockResponse);
    
        await act(async () => {
            render(<DatabaseTable table_name={'Accounts'} />)
        })

        // Wait for axios post call and check its parameters
        await waitFor(() => expect(mockAxios.post).toHaveBeenCalledWith(
            '/api/admin/0/get_table',
            {table_name: 'Accounts'},
            {withCredentials: true}
        ));
    })

    it('should handle edits to existing rows', async () => {
        const mockResponse = {
            data: {
                data: [
                    {
                        id: 1,
                        account_name: 'John Doe',
                        account_type: 'Boy',
                        password: 'John Doe',
                        rank: 'REC',
                        level: 2,
                        credentials: null
                    }
                ],
                columns: [
                    {name: 'id'},
                    {name: 'account_name'},
                    {name: 'account_type'},
                    {name: 'password'},
                    {name: 'rank'},
                    {name: 'level'},
                    {name: 'credentials'}
                ]
            }
        }
        const mockResponse2 = {
            data: {
                data: [
                    {
                        id: 1,
                        account_name: 'John Doe',
                        account_type: 'Primer',
                        password: 'John Doe',
                        rank: 'CLT',
                        level: null,
                        credentials: null
                    }
                ],
                columns: [
                    {name: 'id'},
                    {name: 'account_name'},
                    {name: 'account_type'},
                    {name: 'password'},
                    {name: 'rank'},
                    {name: 'level'},
                    {name: 'credentials'}
                ]
            }
        }
        mockAxios.post.mockResolvedValueOnce(mockResponse)
        .mockResolvedValueOnce(mockResponse2);
    
        await act(async () => {
            render(<DatabaseTable table_name={'Accounts'} />)
        })

        // Wait for axios post call and check its parameters
        await waitFor(() => expect(mockAxios.post).toHaveBeenCalledWith(
            '/api/admin/0/get_table',
            {table_name: 'Accounts'},
            {withCredentials: true}
        ));

        // const showTableButton = screen.getByText('Show Table')
        // fireEvent.click(showTableButton)

        const editRowButton = screen.getByText('Edit Row')
        fireEvent.click(editRowButton)

        const accountTypeInput = screen.getByDisplayValue('Boy')
        const accountRankInput = screen.getByDisplayValue('REC')
        const accountLevelInput = screen.getByDisplayValue('2')
        fireEvent.change(accountTypeInput, { target: { value: 'Primer' } })
        fireEvent.change(accountRankInput, { target: { value: 'CLT' } })
        fireEvent.change(accountLevelInput, { target: { value: '' } })

        const saveButton = screen.getByText('Save Changes')
        fireEvent.click(saveButton)

        await waitFor(() => expect(mockAxios.post).toHaveBeenCalledWith(
            '/api/admin/1/update_data',
            {
                table_name: 'Accounts',
                columns: [
                    'account_name',
                    'account_type',
                    'password',
                    'rank',
                    'level',
                    'credentials'
                ],
                data:{
                    account_name: 'John Doe',
                    account_type: 'Primer',
                    password: 'John Doe',
                    rank: 'CLT',
                    level: '',
                    credentials: ''
                }
            },
            {withCredentials: true}
        ));
    })

    it('should handle additions of new rows', async () => {
        const mockResponse = {
            data: {
                data: [
                    {
                        id: 1,
                        account_name: 'John Doe',
                        account_type: 'Boy',
                        password: 'John Doe',
                        rank: 'REC',
                        level: 2,
                        credentials: null
                    }
                ],
                columns: [
                    {name: 'id'},
                    {name: 'account_name'},
                    {name: 'account_type'},
                    {name: 'password'},
                    {name: 'rank'},
                    {name: 'level'},
                    {name: 'credentials'}
                ]
            }
        }
        const mockResponse2 = {
            data: {
                data: [
                    {
                        id: 1,
                        account_name: 'John Doe',
                        account_type: 'Boy',
                        password: 'John Doe',
                        rank: 'REC',
                        level: 2,
                        credentials: null
                    },
                    {
                        id: 2,
                        account_name: 'Joseph Doe',
                        account_type: 'Primer',
                        password: 'Joseph Doe',
                        rank: 'CLT',
                        level: null,
                        credentials: null
                    }
                ],
                columns: [
                    {name: 'id'},
                    {name: 'account_name'},
                    {name: 'account_type'},
                    {name: 'password'},
                    {name: 'rank'},
                    {name: 'level'},
                    {name: 'credentials'}
                ]
            }
        }
        mockAxios.post.mockResolvedValueOnce(mockResponse)
        .mockResolvedValueOnce(mockResponse2);
    
        await act(async () => {
            render(<DatabaseTable table_name={'Accounts'} />)
        })

        // Wait for axios post call and check its parameters
        await waitFor(() => expect(mockAxios.post).toHaveBeenCalledWith(
            '/api/admin/0/get_table',
            {table_name: 'Accounts'},
            {withCredentials: true}
        ));

        // const showTableButton = screen.getByText('Show Table')
        // fireEvent.click(showTableButton)

        const inputs = screen.getAllByRole('textbox')
        fireEvent.change(inputs[0], { target: { value: 'Joseph Doe' } })
        fireEvent.change(inputs[1], { target: { value: 'Primer' } })
        fireEvent.change(inputs[2], { target: { value: 'Joseph Doe' } })
        fireEvent.change(inputs[3], { target: { value: 'CLT' } })
        fireEvent.change(inputs[4], { target: { value: '' } })
        fireEvent.change(inputs[5], { target: { value: '' } })

        const addRowButton = screen.getByText('Add Row')
        fireEvent.click(addRowButton)

        await waitFor(() => expect(mockAxios.post).toHaveBeenCalledWith(
            '/api/admin/0/add_data',
            {
                table_name: 'Accounts',
                columns: [
                    'account_name',
                    'account_type',
                    'password',
                    'rank',
                    'level',
                    'credentials'
                ],
                data:{
                    account_name: 'Joseph Doe',
                    account_type: 'Primer',
                    password: 'Joseph Doe',
                    rank: 'CLT',
                    level: '',
                    credentials: ''
                }
            },
            {withCredentials: true}
        ));
    })
})