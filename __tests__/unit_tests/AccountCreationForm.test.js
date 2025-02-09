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
            render(<AccountCreationForm reLoad={reLoad} />)
        })

        // Simulate changing input and creating account
        const fullnameInput = screen.getByPlaceholderText('full name')
        const usernameInput = screen.getByPlaceholderText('user name')
        const passwordInput = screen.getByPlaceholderText('password')
        const createButton = screen.getByText('Create Account')
        fireEvent.change(fullnameInput, { target: { value: 'John Doe' } })
        fireEvent.change(usernameInput, { target: { value: 'John Doe' } })
        fireEvent.change(passwordInput, { target: { value: 'John Doe' } })

        // Simulate changing levels
        const levelLabel = screen.getByText('1')
        fireEvent.click(levelLabel)
        const popUpLevel = screen.getByText('2')
        fireEvent.click(popUpLevel)

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
            render(<AccountCreationForm reLoad={reLoad} />)
        })

        // Simulate changing input and creating account
        const fullnameInput = screen.getByPlaceholderText('full name')
        const usernameInput = screen.getByPlaceholderText('user name')
        const passwordInput = screen.getByPlaceholderText('password')
        const createButton = screen.getByText('Create Account')
        fireEvent.change(fullnameInput, { target: { value: 'John Doe' } })
        fireEvent.change(usernameInput, { target: { value: 'John Doe' } })
        fireEvent.change(passwordInput, { target: { value: 'John Doe' } })

        // Switch account type and rank
        const typeLabel = screen.getByText('Boy')
        fireEvent.click(typeLabel)
        const popUpType = screen.getByText('Primer')
        fireEvent.click(popUpType)
        const rankLabel = screen.getByText('CLT')
        fireEvent.click(rankLabel)
        const popUpRank = screen.getByText('SCL')
        fireEvent.click(popUpRank)

        const credentialInput = screen.getByPlaceholderText('credentials')
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