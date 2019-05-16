function generateNextBase (data: string[], base: string[], fromIndex: number, combinationsLength: number): string[][] {
  if (base.length === combinationsLength) return [base]
  const combinations = []
  for (let i = fromIndex + 1; i < data.length; i++) {
    const element = data[i]
    const elementBase = [...base, element]
    combinations.push(...generateNextBase(data, elementBase, i, combinationsLength))
  }
  return combinations
}

export default function (data: string[], min: number, max: number): string[][] {
  let total: string[][] = []
  for (let i = min; i <= max; i++) {
    total = total.concat(generateNextBase(data, [], -1, i))
  }
  return total
}
