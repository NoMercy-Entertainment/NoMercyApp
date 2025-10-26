import { describe, expect, it } from 'vitest'
import { cn } from '@/lib/utils'

describe('utils.cn', () => {
  it('merges tailwind classes with precedence', () => {
    const result = cn('p-2', 'p-4', ['text-red-500', { hidden: false }])
    expect(result).toContain('p-4')
    expect(result).not.toContain('p-2')
    expect(result).toContain('text-red-500')
    expect(result).not.toContain('hidden')
  })
})
