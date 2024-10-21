// src\setupTests.ts
import '@testing-library/jest-dom';
import { server } from './services/mocks/server';

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
