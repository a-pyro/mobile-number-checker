import { IdAndNumbers } from './App'

export let isInstanciated = false

export interface AnalyzedNumbers {
  acceptableNumbers: string[]
  wrongNumbers: string[]
  correctedNumbers: { corrected: string; corrections: string }[]
}

export class PhoneNumberAnalyzer {
  #data: IdAndNumbers = []
  #acceptableNumbers: string[] = []
  #wrongNumbers: string[] = []
  #correctedNumbers: {
    corrected: string
    corrections: string
    original: string
  }[] = []

  constructor(data: IdAndNumbers) {
    if (isInstanciated) {
      throw new Error('This class is a singleton')
    }
    this.#data = data
    this.analyzeListOfNumbers()
    isInstanciated = true
  }

  // the number is correct it starts with 2783 and has 7 digits after
  private isCorrect(number: string): boolean {
    return number.startsWith('2783') && number.length === 11
  }

  // the number is partially correct if it's missig the prefix, ergo starts with 83 and has 7 digits after
  private isMissingPrefix(number: string): boolean {
    return number.startsWith('83') && number.length === 9
  }

  // the number is also partially correct if starts with 27 and has 7 digits after (missing the carrier)
  private isMissingPhoneCarrier(number: string): boolean {
    return number.startsWith('27') && number.length === 9
  }

  // the number is missing both the prefix and the carrier but has 9 digits
  private isMissingPrefixAndPhoneCarrier(number: string): boolean {
    return number.length === 7
  }

  private addPrefix(number: string): string {
    return `27${number}`
  }

  private addPhoneCarrier(number: string): string {
    // get the first 2 digits of the number
    const prefix = number.slice(0, 2)
    // get the last 7 digits of the number
    const suffix = number.slice(2)

    return `${prefix}83${suffix}`
  }

  private addBothPrefixAndPhoneCarrier(number: string): string {
    return `2783${number}`
  }

  analyzeNumber(num: string) {
    const trimmed = num.trim()
    if (this.isCorrect(trimmed)) {
      this.#acceptableNumbers.push(trimmed)
      console.log(`number ${trimmed} is correct`)
    } else if (this.isMissingPrefix(trimmed)) {
      console.log(`number ${trimmed} is missing prefix`)
      this.#correctedNumbers.push({
        original: trimmed,
        corrected: this.addPrefix(trimmed),
        corrections: 'added prefix',
      })
    } else if (this.isMissingPhoneCarrier(trimmed)) {
      console.log(`number ${trimmed} is missing phone carrier`)
      this.#correctedNumbers.push({
        original: trimmed,
        corrected: this.addPhoneCarrier(trimmed),
        corrections: 'added phone carrier',
      })
    } else if (this.isMissingPrefixAndPhoneCarrier(trimmed)) {
      console.log(`number ${trimmed} is missing prefix and phone carrier`)
      this.#correctedNumbers.push({
        original: trimmed,
        corrected: this.addBothPrefixAndPhoneCarrier(trimmed),
        corrections: 'added prefix and phone carrier',
      })
    } else {
      console.log(`number ${trimmed} is wrong`)
      this.#wrongNumbers.push(trimmed)
    }
  }

  analyzeListOfNumbers(listOfNums: IdAndNumbers = this.#data) {
    console.log('>>>>>>>>>>analyzing list of numbers')
    if (listOfNums.length === 0) {
      return
    }
    listOfNums.forEach(([, number]) => this.analyzeNumber(number))
  }

  getCorrectedNumbers() {
    return this.#correctedNumbers
  }

  getAcceptableNumbers() {
    return this.#acceptableNumbers
  }

  getWrongNumbers() {
    return this.#wrongNumbers
  }

  clear() {
    this.#acceptableNumbers = []
    this.#wrongNumbers = []
    this.#correctedNumbers = []
  }
}
