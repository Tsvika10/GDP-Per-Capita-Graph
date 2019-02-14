import { CountryCode } from "../country-data";

export interface Post {
    userID: string,
    postDate: string,
    dateStamp: number,
    displayName: string
    data: {
        edited: boolean;
        startYear: string;
        endYear: string;
        headline: string;
        countryCodeList: CountryCode[];
    }
}