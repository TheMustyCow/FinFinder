export type Lake = {
    id: string;
    name: string;
    lat: number;
    lng: number;
    wdfwUrl: string;
};

export const lakes: Lake[] = [
    {
        id: "badger",
        name: "Badger Lake",
        lat: 47.35371,
        lng: -117.62255,
        wdfwUrl: "https://wdfw.wa.gov/fishing/locations/lowland-lakes/badger-lake"
    },
    {
        id: "loon",
        name: "Loon Lake",
        lat: 48.04596,
        lng: -117.62332,
        wdfwUrl: "https://wdfw.wa.gov/fishing/locations/lowland-lakes/loon-lake"
    },
    {
        id: "medical",
        name: "Medical Lake",
        lat: 47.57163,
        lng: -117.68731,
        wdfwUrl: "https://wdfw.wa.gov/fishing/locations/lowland-lakes/medical-lake"
    },
    {
        id: "washington",
        name: "Lake Washington",
        lat: 47.6177,
        lng: -122.2593,
        wdfwUrl: "https://wdfw.wa.gov/fishing/locations/lowland-lakes/lake-washington"
    },
    {
        id: "keechelus",
        name: "Keechelus Lake",
        lat: 47.35115,
        lng: -121.37077,
        wdfwUrl: "https://wdfw.wa.gov/fishing/locations/lowland-lakes/keechelus-lake"
    }
];