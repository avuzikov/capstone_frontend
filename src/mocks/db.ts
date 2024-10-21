import low from 'lowdb';
import FileSync from 'lowdb/adapters/FileSync';
import { User, Job, Application } from './types';

type Schema = {
  users: User[];
  jobs: Job[];
  applications: Application[];
}

const adapter = new FileSync<Schema>('db.json');
const db = low(adapter);

// Set default data
db.defaults({ users: [], jobs: [], applications: [] }).write();

// User functions
export const getUsers = () => db.get('users').value();
export const getUserById = (id: number) => db.get('users').find({ id }).value();
export const addUser = (user: User) => db.get('users').push(user).write();
export const updateUser = (id: number, data: Partial<User>) => 
  db.get('users').find({ id }).assign(data).write();
export const deleteUser = (id: number) => db.get('users').remove({ id }).write();

// Job functions
export const getJobs = () => db.get('jobs').value();
export const getJobById = (id: number) => db.get('jobs').find({ id }).value();
export const addJob = (job: Job) => db.get('jobs').push(job).write();
export const updateJob = (id: number, data: Partial<Job>) => 
  db.get('jobs').find({ id }).assign(data).write();
export const deleteJob = (id: number) => db.get('jobs').remove({ id }).write();

// Application functions
export const getApplications = () => db.get('applications').value();
export const getApplicationById = (id: number) => db.get('applications').find({ id }).value();
export const addApplication = (application: Application) => db.get('applications').push(application).write();
export const updateApplication = (id: number, data: Partial<Application>) => 
  db.get('applications').find({ id }).assign(data).write();
export const deleteApplication = (id: number) => db.get('applications').remove({ id }).write();

// Utility functions
export const getNextUserId = () => {
  const users = getUsers();
  return users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1;
};

export const getNextJobId = () => {
  const jobs = getJobs();
  return jobs.length > 0 ? Math.max(...jobs.map(j => j.id)) + 1 : 1;
};

export const getNextApplicationId = () => {
  const applications = getApplications();
  return applications.length > 0 ? Math.max(...applications.map(a => a.id)) + 1 : 1;
};

// Advanced query functions
export const getUsersByRole = (role: User['role']) => 
  db.get('users').filter({ role }).value();

export const getJobsByDepartment = (department: string) => 
  db.get('jobs').filter({ department }).value();

export const getApplicationsByJobId = (jobId: number) => 
  db.get('applications').filter({ jobId }).value();

export const getApplicationsByUserId = (userId: number) => 
  db.get('applications').filter({ userId }).value();

export const getOpenJobs = () => 
  db.get('jobs').filter({ listingStatus: 'open' }).value();

export const getJobsCreatedByUser = (userId: number) => 
  db.get('jobs').filter({ userId }).value();

// Export the entire db object for more complex operations if needed
export default db;