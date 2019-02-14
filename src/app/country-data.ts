export interface CountryBasicData {
    name: string,
    capital: string,
    region: string,
    population: number,
    area: number
}

export interface CountryCode {
    label: string,
    code: string
}

export interface CountryGdpData {
    label: string,
    code: string,
    data: number[]
}
export interface CountryGdpDataList {
    startYear: number,
    endYear: number,
    list: CountryGdpData[]
}

