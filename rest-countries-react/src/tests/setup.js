/* eslint-disable no-undef */
// src/tests/setup.js
import { expect, afterEach, beforeEach, vi } from 'vitest'
import { cleanup } from '@testing-library/react'
import * as matchers from '@testing-library/jest-dom/matchers'

// Make testing-library matchers available
expect.extend(matchers)

// Make vi mock utilities available with Jest naming for compatibility
global.jest = {
    fn: vi.fn,
    mock: vi.mock,
    spyOn: vi.spyOn,
    restoreAllMocks: vi.restoreAllMocks,
}

// Automatically clean up after each test
afterEach(() => {
    cleanup()
})

// Add these globals for Jest compatibility
global.beforeAll = beforeAll
global.beforeEach = beforeEach
global.afterEach = afterEach
global.afterAll = afterAll
global.describe = describe
global.it = it
global.test = test
global.expect = expect