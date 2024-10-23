// src/mocks/handlers/userHandlers.ts

import { http, HttpResponse } from 'msw';
import { User } from '../../types/types';
import { users, addUser, updateUser, deleteUser } from '../mockData';

// Utility function to authenticate user
const authenticateUser = (request: Request): User | null => {
  const token = request.headers.get('Authorization')?.split(' ')[1];
  if (!token) return null;
  return users.find(user => user.id.toString() === token) || null;
};

export const userHandlers = [
  // Authentication
  http.post('http://localhost:8000/users/login', async ({ request }) => {
    const { email, password } = await request.json();
    const user = users.find(u => u.email === email && u.password === password);

    if (user) {
      return HttpResponse.json(
        {
          id: user.id.toString(),
          role: user.role,
        },
        {
          headers: {
            Authorization: `Bearer ${user.id}`,
          },
        }
      );
    }
    return HttpResponse.json({ message: 'Invalid credentials' }, { status: 401 });
  }),

  // User Registration
  http.post('http://localhost:8000/users/registration', async ({ request }) => {
    const { email, password, name } = await request.json();
    const newUser: User = {
      id: users.length + 1,
      fullName: name,
      email,
      password,
      role: 'applicant',
    };
    addUser(newUser);

    return HttpResponse.json(
      {
        id: newUser.id.toString(),
        role: newUser.role,
      },
      {
        headers: {
          Authorization: `Bearer ${newUser.id}`,
        },
      }
    );
  }),

  // Admin Manager Registration
  http.post('http://localhost:8000/users/registration/admin', async ({ request }) => {
    const user = authenticateUser(request);
    if (!user || user.role !== 'admin') {
      return HttpResponse.json({ message: 'Forbidden' }, { status: 403 });
    }

    const { email, password, name } = await request.json();
    const newUser: User = {
      id: users.length + 1,
      fullName: name,
      email,
      password,
      role: 'hiring-manager',
    };
    addUser(newUser);

    return HttpResponse.json({
      id: newUser.id.toString(),
      role: newUser.role,
    });
  }),

  // Get Users
  http.get('http://localhost:8000/users', ({ request }) => {
    const user = authenticateUser(request);
    if (!user || user.role !== 'admin') {
      return HttpResponse.json({ message: 'Forbidden' }, { status: 403 });
    }
    const usersWithoutPasswords = users.map(({ password, ...rest }) => rest);
    return HttpResponse.json(usersWithoutPasswords);
  }),

  // Get User by ID
  http.get('http://localhost:8000/users/:id', ({ request, params }) => {
    const user = authenticateUser(request);
    const { id } = params;

    if (!user || (user.id.toString() !== id && user.role !== 'admin')) {
      return HttpResponse.json({ message: 'Forbidden' }, { status: 403 });
    }

    const foundUser = users.find(u => u.id.toString() === id);
    if (!foundUser) {
      return HttpResponse.json({ message: 'User not found' }, { status: 404 });
    }

    const { password, ...userWithoutPassword } = foundUser;
    return HttpResponse.json(userWithoutPassword);
  }),

  // Update User
  http.put('http://localhost:8000/users/:id', async ({ request, params }) => {
    const user = authenticateUser(request);
    const { id } = params;

    if (!user || (user.id.toString() !== id && user.role !== 'admin')) {
      return HttpResponse.json({ message: 'Forbidden' }, { status: 403 });
    }

    const updatedData = await request.json();
    updateUser(parseInt(id as string), updatedData);

    const updatedUser = users.find(u => u.id === parseInt(id as string));
    if (!updatedUser) {
      return HttpResponse.json({ message: 'User not found' }, { status: 404 });
    }

    const { password, ...userWithoutPassword } = updatedUser;
    return HttpResponse.json(userWithoutPassword);
  }),

  // Delete User
  http.delete('http://localhost:8000/users/:id', ({ request, params }) => {
    const user = authenticateUser(request);
    const { id } = params;

    if (!user || (user.id.toString() !== id && user.role !== 'admin')) {
      return HttpResponse.json({ message: 'Forbidden' }, { status: 403 });
    }

    deleteUser(parseInt(id as string));
    return new HttpResponse(null, { status: 204 });
  }),

  // Get Manager Public Info
  http.get('http://localhost:8000/users/manager/:id', ({ params }) => {
    const { id } = params;
    const managerId = parseInt(id as string);

    if (isNaN(managerId)) {
      return HttpResponse.json({ message: 'Invalid ID format' }, { status: 400 });
    }

    const manager = users.find(u => u.id === managerId && u.role === 'hiring-manager');
    if (!manager) {
      return HttpResponse.json({ message: 'Manager not found' }, { status: 404 });
    }

    return HttpResponse.json({
      id: manager.id,
      fullName: manager.fullName,
      department: manager.department,
      publicContactInfo: manager.email,
    });
  }),

  // Get Admin's Managers
  http.get('http://localhost:8000/users/admin/:id', ({ request, params }) => {
    const user = authenticateUser(request);
    if (!user || user.role !== 'admin') {
      return HttpResponse.json({ message: 'Forbidden' }, { status: 403 });
    }

    const managersUnderAdmin = users.filter(u => u.role === 'hiring-manager');
    return HttpResponse.json(managersUnderAdmin.map(({ password, ...rest }) => rest));
  }),
];
