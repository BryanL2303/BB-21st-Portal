/* eslint-disable */

import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import mockAxios from 'axios';
import useCookies from '../../app/javascript/packs/general/useCookies';
import { UserInformation } from '../../app/javascript/packs/userManagementPage/UserInformation';

jest.mock('axios');
jest.mock('../../app/javascript/packs/general/useCookies');

let cookies;

useCookies.mockReturnValue({
    get: jest.fn().mockReturnValue('Admin')
});

alert = jest.fn()
showForm = jest.fn()
reLoad = jest.fn()

describe('UserInformation Component', () => {
    beforeEach(() => {
        jest.clearAllMocks();

        cookies = useCookies();
    });

    it('should display default values of returned account', async () => {
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
        mockAxios.post.mockResolvedValueOnce(mockResponse);
    
        await act(async () => {
            render(<UserInformation userId={'1'} showForm={jest.fn()} reLoad={jest.fn()} />)
        })

        // Wait for axios post call and check its parameters
        expect(mockAxios.post).toHaveBeenCalledWith(
            '/api/account/1/get_account_information',
            {'id': '1'},
            {withCredentials: true},
        )
    
        expect(screen.getByText('REC')).toBeInTheDocument();
        expect(screen.getAllByDisplayValue('John Doe')[0]).toBeInTheDocument();
        expect(screen.getByDisplayValue('Boy')).toBeInTheDocument();
        expect(screen.getByText('1')).toBeInTheDocument();
    })

    it('should trigger call to edit account', async () => {
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
        mockAxios.post.mockResolvedValueOnce(mockResponse).mockResolvedValueOnce({data: true});
    
        await act(async () => {
            render(<UserInformation accountType={"Admin"} appointment={null} userId={'1'} showForm={showForm} reLoad={reLoad} />)
        })

        // Wait for axios post call and check its parameters
        expect(mockAxios.post).toHaveBeenCalledWith(
            '/api/account/1/get_account_information',
            {'id': '1'},
            {withCredentials: true},
        )
    
        const rankLabel = screen.getByLabelText('Rank:')
        expect(rankLabel).toBeInTheDocument();
        const nameInput = screen.getByLabelText('Name:')
        expect(nameInput).toBeInTheDocument();
        expect(screen.getByDisplayValue('Boy')).toBeInTheDocument();
        const levelInput = screen.getByLabelText('Secondary:');
        expect(levelInput).toBeInTheDocument();

        // Simulate changing input
        fireEvent.change(rankLabel, { target: { value: "LCP" } })
        fireEvent.change(nameInput, { target: { value: 'Joseph Doe' } })
        fireEvent.change(levelInput, { target: { value: "2" } })

        // Simulate clicking the save button
        const form = screen.getByTestId('user-information-form')
        fireEvent.submit(form)

        expect(mockAxios.post).toHaveBeenCalledWith(
            '/api/account/1/edit_account', {
                id: 1,
                account_name: 'Joseph Doe',
                password: 'John Doe',
                account_type: 'Boy',
                rank: 'LCP',
                rank1: 'LCP',
                rank2: 'LCP',
                rank3: null,
                rank4: null,
                rank5: null,
                level: '2',
                member_id: '',
                class1: "",
                class2: "",
                class3: undefined,
                class4: undefined,
                class5: undefined,
                graduated: undefined,
                credentials: null,
                abbreviated_name: '',
                honorifics: undefined,
                roll_call: undefined,
                user_name: null
            },
            {withCredentials: true}
        )
        await waitFor(() => 
            expect(alert).toHaveBeenCalledWith("Account has been updated. If the change does not register please refresh the page to update user list")
        )
        await waitFor(() =>
            expect(reLoad).toHaveBeenCalledWith()
        )
    });

    it('should handle invalid form values to edit account', async () => {
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
        mockAxios.post.mockResolvedValueOnce(mockResponse);
    
        await act(async () => {
            render(<UserInformation userId={'1'} showForm={showForm} reLoad={reLoad} />)
        })

        // Wait for axios post call and check its parameters
        expect(mockAxios.post).toHaveBeenCalledWith(
            '/api/account/1/get_account_information',
            {'id': '1'},
            {withCredentials: true},
        )
    
        const rankLabel = screen.getByText('REC')
        expect(rankLabel).toBeInTheDocument();
        const nameInput = screen.getAllByDisplayValue('John Doe')[0]
        expect(nameInput).toBeInTheDocument();
        expect(screen.getByDisplayValue('Boy')).toBeInTheDocument();
        const levelInput = screen.getByText('1');
        expect(levelInput).toBeInTheDocument();

        // Simulate changing input
        fireEvent.click(rankLabel)
        const popUpRank = screen.getByText('LCP')
        fireEvent.click(popUpRank)
        fireEvent.change(nameInput, { target: { value: '' } })
        fireEvent.click(levelInput)
        const popUpLevel = screen.getByText('2')
        fireEvent.click(popUpLevel)

        // Simulate clicking the save button
        const saveButton = screen.getByText('Save Changes')
        fireEvent.click(saveButton)

        await waitFor(() => 
            expect(alert).toHaveBeenCalledWith("Please fill in all fields first")
        )
    });

    it('should handle server rejections to edit account', async () => {
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
        mockAxios.post.mockResolvedValueOnce(mockResponse).mockResolvedValueOnce({data: false});
    
        await act(async () => {
            render(<UserInformation userId={'1'} showForm={showForm} reLoad={reLoad} />)
        })

        // Wait for axios post call and check its parameters
        expect(mockAxios.post).toHaveBeenCalledWith(
            '/api/account/1/get_account_information',
            {'id': '1'},
            {withCredentials: true},
        )
    
        const rankLabel = screen.getByLabelText('Rank:')
        expect(rankLabel).toBeInTheDocument();
        const nameInput = screen.getByLabelText('Name:')
        expect(nameInput).toBeInTheDocument();
        expect(screen.getByDisplayValue('Boy')).toBeInTheDocument();
        const levelInput = screen.getByLabelText('Secondary:');
        expect(levelInput).toBeInTheDocument();

        // Simulate changing input
        fireEvent.change(rankLabel, { target: { value: 'LCP' } })
        fireEvent.change(nameInput, { target: { value: 'John Doe' } })
        fireEvent.change(levelInput, { target: { value: '2' } })

        // Simulate clicking the save button
        const form = screen.getByTestId('user-information-form')
        fireEvent.submit(form)

        await waitFor(() => 
            expect(alert).toHaveBeenCalledWith("Failed to update")
        )
    });

    it('should trigger call to delete account', async () => {
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
        mockAxios.post.mockResolvedValueOnce(mockResponse).mockResolvedValueOnce({data: false});
    
        await act(async () => {
            render(<UserInformation userId={'1'} showForm={showForm} reLoad={reLoad} />)
        })

        // Wait for axios post call and check its parameters
        expect(mockAxios.post).toHaveBeenCalledWith(
            '/api/account/1/get_account_information',
            {'id': '1'},
            {withCredentials: true},
        )
    
        // Simulate changing input
        const rankLabel = screen.getByLabelText('Rank:')
        expect(rankLabel).toBeInTheDocument();
        const nameInput = screen.getByLabelText('Name:')
        expect(nameInput).toBeInTheDocument();
        expect(screen.getByDisplayValue('Boy')).toBeInTheDocument();
        const levelInput = screen.getByText('1');
        expect(levelInput).toBeInTheDocument();

        // Simulate clicking the save button
        const deleteButton = screen.getByText('Delete Account')
        fireEvent.click(deleteButton)

        expect(mockAxios.post).toHaveBeenCalledWith(
            '/api/account/0/delete_account',
            {account_name: "John Doe"},
            {withCredentials: true}
        )
        await waitFor(() => 
            expect(alert).toHaveBeenCalledWith("Account has been deleted. If you still see the user in the list on the left, please refresh the page!")
        )
        await waitFor(() =>
            expect(showForm).toHaveBeenCalledWith()
        )
        await waitFor(() =>
            expect(reLoad).toHaveBeenCalledWith()
        )
    });

    it('should handle failure for deleting accounts', async () => {
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
        mockAxios.post.mockResolvedValueOnce(mockResponse).mockResolvedValueOnce({data: true});
    
        await act(async () => {
            render(<UserInformation userId={'1'} showForm={showForm} reLoad={reLoad} />)
        })

        // Wait for axios post call and check its parameters
        expect(mockAxios.post).toHaveBeenCalledWith(
            '/api/account/1/get_account_information',
            {'id': '1'},
            {withCredentials: true},
        )
    
        // Simulate changing input
        const rankLabel = screen.getByText('REC')
        expect(rankLabel).toBeInTheDocument();
        const nameInput = screen.getAllByDisplayValue('John Doe')[0]
        expect(nameInput).toBeInTheDocument();
        expect(screen.getByDisplayValue('Boy')).toBeInTheDocument();
        const levelInput = screen.getByText('1');
        expect(levelInput).toBeInTheDocument();

        // Simulate clicking the save button
        const deleteButton = screen.getByText('Delete Account')
        fireEvent.click(deleteButton)

        expect(mockAxios.post).toHaveBeenCalledWith(
            '/api/account/0/delete_account',
            {account_name: "John Doe"},
            {withCredentials: true}
        )
        await waitFor(() =>
            expect(showForm).toHaveBeenCalledWith()
        )
    });
});