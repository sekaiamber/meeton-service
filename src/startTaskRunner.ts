import TaskRunner from './taskRunner'

const runner = new TaskRunner()

runner
  .init()
  .then(() => {
    console.log('runner inited')
  })
  .then(async () => await runner.start())
  .catch((e) => {
    console.log(e)
  })
