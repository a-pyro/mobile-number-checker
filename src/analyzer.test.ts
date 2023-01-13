import { IdAndNumbers } from './App'
import { PhoneNumberAnalyzer } from './utils'
import { describe, it, expect, afterEach } from 'vitest'

const correctNumber = '27831234567'
const numberMissingPrefix = '831234567'
const numberMissingPhoneCarrier = '271234567'
const numberMissingPrefixAndPhoneCarrier = '1234567'
const wrongNumber = '1234567890'

describe('PhoneNumberAnalyzer', () => {
  let analyzer = new PhoneNumberAnalyzer([])
  afterEach(() => analyzer.clear())
  const getAcceptableNumbers = analyzer.getAcceptableNumbers.bind(analyzer)
  const getWrongNumbers = analyzer.getWrongNumbers.bind(analyzer)
  const getCorrectedNumbers = analyzer.getCorrectedNumbers.bind(analyzer)

  it('should be a singleton', () => {
    expect(() => {
      new PhoneNumberAnalyzer([])
    }).toThrowError('This class is a singleton')
  })

  it('should correctly analyze correct number', () => {
    analyzer.analyzeNumber(correctNumber)
    expect(getAcceptableNumbers()).toContain(correctNumber)
    expect(getWrongNumbers()).toEqual([])
    expect(getCorrectedNumbers()).toEqual([])
  })

  it('should correctly analyze number missing prefix', () => {
    analyzer.analyzeNumber(numberMissingPrefix)
    expect(getAcceptableNumbers()).toEqual([])
    expect(getWrongNumbers()).toEqual([])
    expect(getCorrectedNumbers()).toContainEqual({
      original: numberMissingPrefix,
      corrected: correctNumber,
      corrections: 'added prefix',
    })
  })

  it('should correctly analyze number missing phone carrier', () => {
    analyzer.analyzeNumber(numberMissingPhoneCarrier)
    expect(getAcceptableNumbers()).toEqual([])
    expect(getWrongNumbers()).toEqual([])
    expect(getCorrectedNumbers()).toContainEqual({
      original: numberMissingPhoneCarrier,
      corrected: correctNumber,
      corrections: 'added phone carrier',
    })
  })

  it('should correctly analyze wrong number', () => {
    analyzer.analyzeNumber(wrongNumber)
    expect(getAcceptableNumbers()).toEqual([])
    expect(getWrongNumbers()).toContain(wrongNumber)
    expect(getCorrectedNumbers()).toEqual([])
  })

  it('should get empty arrays if no numbers were analyzed', () => {
    expect(getAcceptableNumbers()).toEqual([])
    expect(getWrongNumbers()).toEqual([])
    expect(getCorrectedNumbers()).toEqual([])
  })

  it('should correctly analyze number missing phone carrier & prefix', () => {
    analyzer.analyzeNumber(numberMissingPrefixAndPhoneCarrier)
    expect(getAcceptableNumbers()).toEqual([])
    expect(getWrongNumbers()).toEqual([])
    expect(getCorrectedNumbers()).toContainEqual({
      original: numberMissingPrefixAndPhoneCarrier,
      corrected: correctNumber,
      corrections: 'added prefix and phone carrier',
    })
  })
  it('should correctly analyze a list of IdAndNumbers, correct, uncorrect and partially correct', () => {
    const idAndNumbers: IdAndNumbers = [
      ['1', correctNumber],
      ['2', numberMissingPrefix],
      ['3', numberMissingPhoneCarrier],
      ['4', numberMissingPrefixAndPhoneCarrier],
      ['5', wrongNumber],
    ]
    analyzer.analyzeListOfNumbers(idAndNumbers)

    expect(getAcceptableNumbers()).toContain(correctNumber)
    expect(getWrongNumbers()).toContain(wrongNumber)
    expect(getCorrectedNumbers()).toContainEqual({
      original: numberMissingPrefix,
      corrected: correctNumber,
      corrections: 'added prefix',
    })

    expect(getCorrectedNumbers()).toContainEqual({
      original: numberMissingPhoneCarrier,
      corrected: correctNumber,
      corrections: 'added phone carrier',
    })
    expect(getCorrectedNumbers()).toContainEqual({
      original: numberMissingPrefixAndPhoneCarrier,
      corrected: correctNumber,
      corrections: 'added prefix and phone carrier',
    })
  })
})
