import { OptionQuestion } from '../bot/utils/replyOptionQuestions'

export function arr2obj<T = unknown>(arr: T[]): { [key: number]: T } {
  const ret: { [key: number]: T } = {}
  arr.forEach((item, i) => (ret[i] = item))
  return ret
}

export function getI18nOptionQuestionData(question: OptionQuestion): any {
  const ret = {
    question: question.question,
    options: arr2obj(question.options),
  }
  return ret
}
