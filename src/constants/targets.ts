/* eslint-disable prettier/prettier */
const target: Array<[string, number, string]> = [
  ['T001', 1, '1级目的地'],
  ['T002', 2, '2级目的地'],
  ['T003', 3, '3级目的地'],
  ['T004', 4, '4级目的地'],
  ['T005', 5, '5级目的地'],
]

export interface TargetRawData {
  level: number
  key: string
  description: string
}

const targetRawData: TargetRawData[] = target.map((t) => ({
  key: t[0],
  level: t[1] - 1,
  description: t[2],
}))

export { targetRawData }

const targetRawDataMap: { [key: string]: TargetRawData } = {}
targetRawData.forEach((t) => {
  targetRawDataMap[t.key] = t
})

export default targetRawDataMap
