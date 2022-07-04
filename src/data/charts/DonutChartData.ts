import { ColorThemes } from './types'

export function useDonutChartData() {
  let generatedData: {
    labels: string[]
    datasets: { label: string; backgroundColor: string[]; data: number[] }[]
  }

  const getDonutChartData = (themes: ColorThemes) => {
    if (generatedData) {
      generatedData.datasets[0].backgroundColor = [themes.danger, themes.info, themes.primary]
    } else {
      generatedData = {
        labels: ['North America', 'South America', 'Australia'],
        datasets: [
          {
            label: 'Population (millions)',
            backgroundColor: [themes.danger, themes.info, themes.primary],
            data: [2478, 5267, 734],
          },
        ],
      }
    }

    return generatedData
  }

  return { getDonutChartData }
}