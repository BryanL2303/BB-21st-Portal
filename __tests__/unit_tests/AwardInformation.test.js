/* eslint-disable */

import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import mockAxios from 'axios';
import useCookies from '../../app/javascript/packs/general/useCookies';
import { AwardInformation } from '../../app/javascript/packs/awardsManagementPage/AwardInformation';

jest.mock('axios');
jest.mock('../../app/javascript/packs/general/useCookies');

let cookies;

useCookies.mockReturnValue({
  get: {
    Type: 'Admin'
  }
});

alert = jest.fn()
showForm = jest.fn()
reLoad = jest.fn()

describe('AwardInformation Component', () => {
    beforeEach(() => {
        jest.clearAllMocks();

        cookies = useCookies();
    });

    it('should display default values of award with no mastery', async () => {
        // Mock axios post response
        const mockResponse = {
            data: {
                id: 1,
                badge_name: 'Target',
                badge_requirements: '...Target Requirements...',
                has_mastery: false,
                recommended_level: '1'
            }
        };
        mockAxios.post.mockResolvedValueOnce(mockResponse);
    
        await act(async () => {
            render(<AwardInformation awardId={1} />)
        })

        // Wait for axios post call and check its parameters
        expect(mockAxios.post).toHaveBeenCalledWith(
            '/api/award/1/get_award',
            {'id': 1},
            {withCredentials: true}
        )
    })

    it('should display default values of award with mastery', async () => {
        // Mock axios post response
        const mockResponse = {
            data: {
                id: 1,
                badge_name: 'Adventure',
                badge_requirements: null,
                has_mastery: true,
                recommended_level: null
            }
        };
        const mockResponse2 = {
            data: [
                {
                    id: 1,
                    mastery_name: 'Basic',
                    mastery_requirements: '...Basic Requirements...',
                    recommended_level: 1
                },
                {
                    id: 2,
                    mastery_name: 'Advanced',
                    mastery_requirements: '...Advanced Requirements...',
                    recommended_level: 2
                }
            ]
        }
        mockAxios.post.mockResolvedValueOnce(mockResponse)
        .mockResolvedValueOnce(mockResponse2);
    
        await act(async () => {
            render(<AwardInformation awardId={1} />)
        })

        // Wait for axios post call and check its parameters
        expect(mockAxios.post).toHaveBeenCalledWith(
            '/api/award/1/get_award',
            {'id': 1},
            {withCredentials: true}
        )

        expect(mockAxios.post).toHaveBeenCalledWith(
            '/api/award/0/get_masteries',
            {'award_id': 1},
            {withCredentials: true}
        )
    })
})