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
export class CountryGdpDataList {
    startYear: number;
    endYear: number;
    list: CountryGdpData[];
    constructor(startYear, endYear, list) {
        this.startYear = startYear;
        this.endYear = endYear;
        this.list = list;
    }
}

