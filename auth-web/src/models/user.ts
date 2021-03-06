import { Contact } from '@/models/contact'

export interface User {
    firstname: string;
    lastname: string;
    username: string;
    contacts?: Contact[];
    modified?: Date
    userTerms?: UserTerms
}

export interface UserTerms {
    isTermsOfUseAccepted: boolean
    termsOfUseAcceptedVersion: string
}
