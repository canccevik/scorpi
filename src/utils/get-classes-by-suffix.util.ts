import fg from 'fast-glob'

import { Type } from '../interfaces'

export async function getClassesBySuffix(suffix: string): Promise<Type[]> {
  const classes: Type[] = []
  const files = fg.sync(`**/${suffix}`, { absolute: true })

  for await (const file of files) {
    try {
      const exports = await import(file)

      Object.values(exports).forEach((exportedClass: any) => {
        if (!exportedClass.constructor) {
          return
        }
        classes.push(exportedClass)
      })
    } catch (error) {
      throw new Error(`Cannot read files with matched ${suffix} suffix.`)
    }
  }
  return classes
}
