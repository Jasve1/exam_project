import React from 'react';
import { render, cleanup } from '@testing-library/react';
import 'jest-dom/extend-expect';
import Job from './Job';

afterEach(cleanup);

it('showJobLoading', () => {
    const {getByText} = render(<Job />)
    expect(getByText('Job loading...')).toBeInTheDocument();
});