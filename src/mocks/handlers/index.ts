// src/mocks/handlers/index.ts

import { userHandlers } from './userHandlers';
import { jobHandlers } from './jobHandlers';

export const handlers = [...userHandlers, ...jobHandlers];
