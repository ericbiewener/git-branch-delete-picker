import inquirer from 'inquirer'
import simpleGit from 'simple-git/promise'
import { runCmd } from 'utlz'

const git = simpleGit()

const main = async () => {
  const { branches } = await git.branchLocal()
  const branchNames = []
  for (const name in branches) {
    if (!branches[name].current) branchNames.push(name)
  }

  const { branchesToDelete } = await inquirer.prompt<{ branchesToDelete: string[] }>({
    type: 'checkbox',
    name: 'branchesToDelete',
    message: 'Which branches would you like to delete?',
    choices: branchNames,
  })

  runCmd('git', ['br', '-D', ...branchesToDelete])
}

main()
