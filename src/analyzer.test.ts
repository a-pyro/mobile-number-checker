import { PhoneNumberAnalyzer } from './utils'
import { describe, it, expect, afterEach } from 'vitest'

describe('PhoneNumberAnalyzer', () => {
  let analyzer = new PhoneNumberAnalyzer([])
  afterEach(() => analyzer.clear())

  it('should be a singleton', () => {
    expect(() => {
      new PhoneNumberAnalyzer([])
    }).toThrowError('This class is a singleton')
  })

  it('should correctly analyze correct number', () => {
    analyzer.analyzeNumber('27831234567')
    expect(analyzer.getAcceptableNumbers()).toContain('27831234567')
    expect(analyzer.getWrongNumbers()).toEqual([])
    expect(analyzer.getCorrectedNumbers()).toEqual([])
  })

  it('should correctly analyze number missing prefix', () => {
    analyzer.analyzeNumber('831234567')
    expect(analyzer.getAcceptableNumbers()).toEqual([])
    expect(analyzer.getWrongNumbers()).toEqual([])
    expect(analyzer.getCorrectedNumbers()).toContainEqual({
      original: '831234567',
      corrected: '27831234567',
      corrections: 'added prefix',
    })
  })

  it('should correctly analyze number missing phone carrier', () => {
    analyzer.analyzeNumber('271234567')
    expect(analyzer.getAcceptableNumbers()).toEqual([])
    expect(analyzer.getWrongNumbers()).toEqual([])
    expect(analyzer.getCorrectedNumbers()).toContainEqual({
      original: '271234567',
      corrected: '27831234567',
      corrections: 'added phone carrier',
    })
  })

  it('should correctly analyze wrong number', () => {
    analyzer.analyzeNumber('1234567890')
    expect(analyzer.getAcceptableNumbers()).toEqual([])
    expect(analyzer.getWrongNumbers()).toContain('1234567890')
    expect(analyzer.getCorrectedNumbers()).toEqual([])
  })

  it('should get empty arrays if no numbers were analyzed', () => {
    expect(analyzer.getAcceptableNumbers()).toEqual([])
    expect(analyzer.getWrongNumbers()).toEqual([])
    expect(analyzer.getCorrectedNumbers()).toEqual([])
  })

  it('should correctly analyze number missing phone carrier & prefix', () => {
    analyzer.analyzeNumber('1234567')
    expect(analyzer.getAcceptableNumbers()).toEqual([])
    expect(analyzer.getWrongNumbers()).toEqual([])
    expect(analyzer.getCorrectedNumbers()).toContainEqual({
      original: '1234567',
      corrected: '27831234567',
      corrections: 'added prefix and phone carrier',
    })
  })
})
