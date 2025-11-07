/**
 * Test Setup Configuration
 * Configures testing environment with mocks and utilities
 */

import { expect, afterEach, vi } from 'vitest';
import { cleanup } from '@testing-library/react';
import * as matchers from '@testing-library/jest-dom/matchers';

// Extend expect with jest-dom matchers
expect.extend(matchers);

// Clean up after each test
afterEach(() => {
  cleanup();
});

// Mock Next.js router
const mockRouter = {
  push: vi.fn(),
  replace: vi.fn(),
  prefetch: vi.fn(),
  back: vi.fn(),
  forward: vi.fn(),
  refresh: vi.fn(),
  pathname: '/',
  query: {},
  asPath: '/',
};

vi.mock('next/router', () => ({
  useRouter: () => mockRouter,
}));

vi.mock('next/navigation', () => ({
  useRouter: () => mockRouter,
  usePathname: () => '/',
  useSearchParams: () => new URLSearchParams(),
}));

// Mock fetch for API calls
global.fetch = vi.fn();

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
  length: 0,
  key: vi.fn(),
} as Storage;
global.localStorage = localStorageMock;

// Mock ResizeObserver
global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

// Mock IntersectionObserver
global.IntersectionObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

// Mock matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // deprecated
    removeListener: vi.fn(), // deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Mock HTMLCanvasElement methods
HTMLCanvasElement.prototype.getContext = vi.fn();

// Mock requestAnimationFrame
global.requestAnimationFrame = vi.fn((cb: FrameRequestCallback) => {
  const id = setTimeout(cb, 16);
  return id as unknown as number;
}) as typeof requestAnimationFrame;
global.cancelAnimationFrame = vi.fn((id: number) => clearTimeout(id)) as typeof cancelAnimationFrame;

// Custom test utilities
export const createMockMetricsData = () => ({
  grantLaptopsPresented: 1250,
  grantLaptopGoal: 1500,
  grantLaptopProgress: 83.3,
  grantTrainingHoursGoal: 200,
  totalLaptopsCollected: 3800,
  totalChromebooksDistributed: 3100,
  countiesServed: 15,
  peopleTrained: 1250,
  eWasteTons: 8.5,
  partnerOrganizations: 45,
  pipeline: {
    donated: 120,
    received: 95,
    dataWipe: 78,
    refurbishing: 65,
    qaTesting: 52,
    ready: 43,
    distributed: 28,
  },
  inPipeline: 353,
  readyToShip: 43,
});

export const createMockDevice = (overrides = {}) => ({
  id: 'device-1',
  serial_number: 'ABC123',
  model: 'Latitude 5420',
  manufacturer: 'Dell',
  status: 'ready',
  location: 'Wake County',
  assigned_to: null,
  received_date: '2024-01-15',
  distributed_date: null,
  notes: 'Good condition',
  ...overrides,
});

export const createMockPartnership = (overrides = {}) => ({
  id: 'partnership-1',
  timestamp: '2024-01-15T10:00:00Z',
  organizationName: 'Community Library',
  status: 'pending',
  email: 'contact@library.org',
  address: '123 Main St',
  county: 'Wake',
  contactPerson: 'Jane Doe',
  phone: '555-0123',
  is501c3: true,
  website: 'https://library.org',
  workssWith: ['education', 'senior'],
  chromebooksNeeded: 25,
  clientStruggles: ['digital divide'],
  howWillUse: ['online learning', 'job search'],
  positiveImpact: ['increased access to education'],
  howHeard: 'community event',
  oneWord: 'empowerment',
  quote: 'This will transform our community\'s access to technology.',
  ...overrides,
});
