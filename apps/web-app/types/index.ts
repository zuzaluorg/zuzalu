export interface UserDTO {
    code: string
    created_at: Date
    email: string
    id: number
    semaphoreId: string
    userName: string
    role: string
    uui_auth: string
}

export interface EventsDTO {
    created_at: Date
    endDate: Date
    endTime: string
    id: number
    info: string
    location: string
    name: string
    organizers: string[]
    startDate: Date
    startTime: string
    tags: string[]
    slug: string
    publicUrl: string
    type: String
    sessions: SessionsDTO[]
    item_id: number
    image_url: string
    bg_image_url: string
    apply_form: string
}

export interface SessionsDTO {
    created_at: Date
    description: string
    equipment: string
    event_id: number
    event_item_id: number
    event_slug: string
    event_type: string
    favoritedSessions: FavoritedSessionsDTO[]
    favorited_sessions: any
    format: string
    duration: string
    hasTicket: boolean
    id: number
    info: string
    level: string
    location: string
    custom_location: string
    name: string
    participants: ParticipantsDTO[]
    startDate: Date
    startTime: string
    subevent_id: number
    tags: string[]
    team_members: {
        name: string
        role: string
    }[]
    track: string
    end_time: string
    type: any
    events: EventsDTO
    quota_id: number
    creator_id: number
    capacity: number
    totalParticipants: number
}

export interface RsvpDTO {
    id: number
    created_at: Date
    session_id: number
    user_id: number
}

export interface ParticipantsDTO {
    created_at: Date
    event_id: number
    user_id: number
    events: EventsDTO
    users: UserDTO[]
    id: number
}

export interface FavoritedEventsDTO {
    created_at: Date
    id: number
    event_id: number
    user_id: number
    events: EventsDTO
    users: UserDTO[]
}

export interface FavoritedSessionsDTO {
    created_at: Date
    id: number
    session_id: number
    user_id: number
}

export interface TracksDTO {
    id: number
    type: string
}

export interface EventTypeDTO {
    id: number
    type: string
    created_at: Date
}

export interface FormatDTO {
    id: number
    format: string
    created_at: Date
}

export interface LevelDTO {
    id: number
    level: string
    created_at: Date
}

export interface LocationDTO {
    id: number
    location: string
    active: boolean
    created_at: Date
}

export interface NewSessionState {
    description: string
    event_id: number
    event_type: string
    maxRsvp: string
    format: string
    hasTicket: boolean
    equipment: string
    info: string
    level: string
    location: string
    custom_location: string
    name: string
    startDate: Date
    endTime: string
    startTime: string
    tags: string[]
    team_members: {
        name: string
        role: string
    }[]
    track: string
    event_slug: string
    event_item_id: number
}
