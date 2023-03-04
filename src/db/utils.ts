import { parseScript } from 'esprima'
import isURL from 'validator/lib/isURL'
import isPort from 'validator/lib/isPort'
import isIP from 'validator/lib/isIP'
import { isEthAddress } from '../utils'

export interface DbRowDataDiff<T> {
  prevValue: T | null
  currentValue: T | null
  type: 'create' | 'change' | 'delete'
  id?: number
}

export interface DiffDbRowDataOptions {
  exceptKeys: string[]
}

const defaultDiffDbRowDataOptions: DiffDbRowDataOptions = {
  exceptKeys: [],
}

export function diffDbRowData<T extends { [key: string]: any }>(
  prevValue: T | null,
  currentValue: T | null,
  options: Partial<DiffDbRowDataOptions> = {}
): DbRowDataDiff<T> | null {
  const opts: DiffDbRowDataOptions = {
    ...defaultDiffDbRowDataOptions,
    ...options,
  }
  const { exceptKeys } = opts
  const ret: DbRowDataDiff<T> = {
    prevValue,
    currentValue,
    type: 'change',
  }
  if (prevValue === null) {
    if (currentValue === null) return null
    ret.type = 'create'
  } else if (currentValue === null) {
    if (prevValue === null) return null
    ret.type = 'delete'
  } else {
    const keys = Object.keys(prevValue)
    let same = true
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i]
      if (exceptKeys.includes(key)) continue
      if (prevValue[key] !== currentValue[key]) {
        same = false
        break
      }
    }
    if (same) return null
    ret.type = 'change'
  }
  return ret
}

const hexReg = /^[a-fA-F0-9]+$/
const hexLowercaseReg = /^[a-f0-9]+$/
export const ColumnValidators = {
  isEthAddress(value: string) {
    if (!isEthAddress(value)) {
      throw new Error(`${value} is not a eth address`)
    }
  },
  isHexString(value: string) {
    if (!hexReg.test(value)) {
      throw new Error(`${value} is not a hex string`)
    }
  },
  isLowercaseHexString(value: string) {
    if (!hexLowercaseReg.test(value)) {
      throw new Error(`${value} is not a lowercase hex string`)
    }
  },
  isJSCodeScript(value: string) {
    try {
      parseScript(`function a(){${value}}`)
    } catch (error) {
      throw new Error(`code parse failed: ${(error as Error).message}`)
    }
  },
  isUrl(value: string) {
    if (!isURL(value, { protocols: ['http', 'https'] })) {
      throw new Error(`${value} is not a url`)
    }
  },
  isPortNumber(value: number) {
    if (parseInt(value.toString()) !== value || !isPort(value.toString())) {
      throw new Error(`${value} is not a port number`)
    }
  },
  isIP(value: string) {
    if (!isIP(value, 4)) {
      throw new Error(`${value} is not a ip v4 string`)
    }
  },
}
