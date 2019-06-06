import React from 'react';
import { render, cleanup } from '@testing-library/react';
import 'jest-dom/extend-expect';
import User from './User';

afterEach(cleanup);

    let user = {
        username: 'test'
    }


it('showWhenNotloggedIn', () => {
    const {getByText} = render(<User/>)
    expect(getByText('Hello, to post jobs you need to login or sign up')).toBeInTheDocument();
});

it('showOnIsloggedIn', () => {
    const {getByText} = render(<User isLoggedIn={true} user={user}/>)
    expect(getByText('Hello test')).toBeInTheDocument();
});