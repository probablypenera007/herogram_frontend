import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const setAuthToken = (token: string) => {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
};

export const removeAuthToken = () => {
    delete api.defaults.headers.common['Authorization'];
};

export interface CreatePollRequest {
    question: string;
    options: string[];
    expires_at: string;
}

export interface VoteRequest {
    option_index: number;
}

export interface Poll {
    id: number;
    question: string;
    options: string[];
    created_at: string;
    expires_at: string;
    is_closed: boolean;
}

export interface PollResult {
    poll: Poll;
    votes: Record<number, number>;
    total_votes: number;
}

export const createPoll = async (data: CreatePollRequest) => {
    const response = await api.post<Poll>('/poll', data);
    return response.data;
};

export const castVote = async (pollId: number, data: VoteRequest) => {
    const response = await api.post(`/poll/${pollId}/vote`, data);
    return response.data;
};

export const getPoll = async (pollId: number) => {
    const response = await api.get<PollResult>(`/poll/${pollId}`);
    return response.data;
};

export const getAnonymousToken = async () => {
    const response = await api.post<{ token: string }>('/auth/anon');
    return response.data.token;
}; 