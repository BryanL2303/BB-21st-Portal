/* eslint-disable */

import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import mockAxios from 'axios';
import useCookies from '../../app/javascript/packs/general/useCookies';
import { AccountCreationForm } from '../../app/javascript/packs/userManagementPage/AccountCreationForm';

jest.mock('axios');
jest.mock('../../app/javascript/packs/general/useCookies');

let cookies;

useCookies.mockReturnValue({
    get: jest.fn().mockReturnValue('Admin')
});

alert = jest.fn()
reLoad = jest.fn()

describe('AccountCreationForm Component', () => {
    beforeEach(() => {
        jest.clearAllMocks();

        cookies = useCookies();
    });

    it('should handle successful Boy account creation', async () => {
        // Mock axios post response
        mockAxios.post.mockResolvedValueOnce({data: true});
    
        await act(async () => {
            render(<AccountCreationForm account_type={"Admin"} appointment={null} reLoad={reLoad} />)
        })

        // Simulate changing input and creating account
        const fullnameInput = screen.getByPlaceholderText('Enter Full Name')
        const usernameInput = screen.getByPlaceholderText('Enter User Name')
        const passwordInput = screen.getByPlaceholderText('Enter Password')
        const createButton = screen.getByText('Create Account')
        fireEvent.change(fullnameInput, { target: { value: 'John Doe' } })
        fireEvent.change(usernameInput, { target: { value: 'John Doe' } })
        fireEvent.change(passwordInput, { target: { value: 'John Doe' } })

        // Simulate changing levels
        const levelLabel = screen.getByLabelText('Level:')
        fireEvent.change(levelLabel, { target: { value: '2' } })
        fireEvent.click(createButton)

        // Wait for axios post call and check its parameters
        expect(mockAxios.post).toHaveBeenCalledWith(
            '/api/account/0/create_account',
            {   account_name: 'John Doe',
                password: 'John Doe',
                account_type: 'Boy',
                rank: 'REC',
                level: '2',
                class1: null,
                credentials: null,
                abbreviated_name: '',
                honorifics: undefined,
                roll_call: true,
                user_name: 'John Doe'
            },
            {withCredentials: true}
        )

        await waitFor(() => 
            expect(alert).toHaveBeenCalledWith("Account has been created. If the user does not show up on the list to the left please refresh the page!")
        )
        await waitFor(() =>
            expect(reLoad).toHaveBeenCalledWith()
        )
    })

    it('should handle successful Primer account creation', async () => {
        // Mock axios post response
        mockAxios.post.mockResolvedValueOnce({data: true});
    
        await act(async () => {
            render(<AccountCreationForm account_type={"Admin"} appointment={null} reLoad={reLoad} />)
        })

        // Simulate changing input and creating account
        const fullnameInput = screen.getByPlaceholderText('Enter Full Name')
        const usernameInput = screen.getByPlaceholderText('Enter User Name')
        const passwordInput = screen.getByPlaceholderText('Enter Password')
        const createButton = screen.getByText('Create Account')
        fireEvent.change(fullnameInput, { target: { value: 'John Doe' } })
        fireEvent.change(usernameInput, { target: { value: 'John Doe' } })
        fireEvent.change(passwordInput, { target: { value: 'John Doe' } })

        // Switch account type and rank
        const typeLabel = screen.getByLabelText('Account Type:')
        fireEvent.change(typeLabel, { target: { value: 'Primer' } })
        const rankLabel = screen.getByLabelText('Rank:')
        fireEvent.change(rankLabel, { target: { value: 'SCL' } })

        const credentialInput = screen.getByPlaceholderText('Enter Credentials')
        fireEvent.change(credentialInput, { target: { value: 'Sec 1 Platoon Primer' } })

        fireEvent.click(createButton)

        // Wait for axios post call and check its parameters
        expect(mockAxios.post).toHaveBeenCalledWith(
            '/api/account/0/create_account',
            {   account_name: 'John Doe',
                password: 'John Doe',
                account_type: 'Primer',
                rank: 'SCL',
                level: null,
                class1: null,
                credentials: 'Sec 1 Platoon Primer',
                abbreviated_name: '',
                honorifics: undefined,
                roll_call: true,
                user_name: 'John Doe'
            },
            {withCredentials: true}
        )

        await waitFor(() => 
            expect(alert).toHaveBeenCalledWith("Account has been created. If the user does not show up on the list to the left please refresh the page!")
        )
        await waitFor(() =>
            expect(reLoad).toHaveBeenCalledWith()
        )
    })
});