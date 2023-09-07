export type DirectionData = {
    arrivalTime: string,
    departureTime: string,
    distance: string,
    duration: string,
    stepsSummary: StepSummary[],
    start_location: LatLng
    end_location: LatLng
}


export type LatLng = {
    lat: number,
    lng: number,
}

export type StepSummary = {
    distance: string,
    duration: string,
    instruction: string
}

export type LocationData = {
    id: number,
    name: string,
    address: string,
    isHome: boolean,
    isWork: boolean,
    createAt: Date,
    updatedAt: Date,
    user_ProfileId: number,
}

export type ChecklistData = {
    id: number,
    title: string,
    description: string,
    isDaily: boolean,
    priority: string,
    createAt: Date,
    updatedAt: Date,
    isChecked: boolean,
    user_ProfileId: number,
}

export type SummaryData = {
    locationData: LocationData[],
    directionData: DirectionData,
    checklistData: ChecklistData[]
}

export type UserData = {
    id: number,
    username: string,
    password: string,
    name: string,
    createAt: Date,
    updatedAt: Date,
}