import { timeNumber } from '../utils/time'

const favorabilityTargetLevelWeightMap = [
  [80, 18, 2, 0, 0],
  [40, 40, 19, 1, 0],
  [30, 30, 30, 9, 1],
  [20, 20, 30, 25, 5],
  [10, 10, 20, 40, 20],
  [5, 5, 10, 40, 40],
]

const favorabilityTreasureRarityWeightMap = [
  [80, 20, 0, 0, 0],
  [40, 30, 20, 10, 0],
  [20, 30, 30, 15, 5],
  [15, 30, 30, 15, 10],
  [1, 15, 40, 20, 24],
  [0, 0, 50, 20, 30],
]

const targetLevelMovementCostMap = [10, 20, 60, 120, 300]

const targetLevelTimeCostMap = [
  timeNumber.hour * 4,
  timeNumber.hour * 8,
  timeNumber.hour * 12,
  timeNumber.hour * 24,
  timeNumber.hour * 36,
]

const CONSTANTS = {
  startTravelTimeLimit: timeNumber.day,
  addMovementTimeLimit: timeNumber.hour * 4,
  cooldownTravelTimeLimit: timeNumber.day,
  favorabilityTargetLevelWeightMap,
  favorabilityTreasureRarityWeightMap,
  targetLevelMovementCostMap,
  targetLevelTimeCostMap,
}

export default CONSTANTS
