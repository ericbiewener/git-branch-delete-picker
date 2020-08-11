#!/usr/bin/env node
import inquirer from 'inquirer'
import simpleGit from 'simple-git/promise'
import { runCmd } from 'utlz'

const git = simpleGit()

export const pickBranchesToDelete = async () => {
  const { branches } = await git.branchLocal()
  const branchNames = []
  for (const name in branches) {
    if (!branches[name].current) branchNames.push(name)
  }

  if (!branchNames.length) {
    console.log('No branches found to delete.')
    process.exit(0)
  }

  const { branchesToDelete } = await inquirer.prompt<{ branchesToDelete: string[] }>({
    name: 'branchesToDelete',
    type: 'checkbox',
    pageSize: 30,
    message: 'Which branches would you like to delete?',
    choices: branchNames,
  })

  const { confirm } = await inquirer.prompt<{ confirm: boolean }>({
    name: 'confirm',
    type: 'confirm',
    message: `\n${branchesToDelete.join(
      '\n',
    )}\n\nAre you sure you want to delete the above branches?`,
  })

  if (confirm) runCmd('git', ['br', '-D', ...branchesToDelete])
}
