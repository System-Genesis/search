import { DigitalIdentityDTO } from '../digitalIdentity/dto';
import { ProfilePictureData } from './interface';

export interface EntityDTO {
    // Entity as it should be returned to client
    id: string;
    displayName: string;
    hierarchy: string;
    directGroup: string;
    entityType: string; // enum
    identityCard: string;
    personalNumber: string;
    goalUserId?: string;
    serviceType: string;
    firstName: string;
    lastName: string;
    fullName: string;
    akaUnit: string;
    dischargeDay: Date;
    rank: string; // enum
    mail: string;
    jobTitle: string;
    phone: string[];
    mobilePhone: string[];
    address: string;
    clearance: string; // string of number - enum
    sex?: string;
    birthDate?: Date;
    createdAt?: Date;
    updatedAt?: Date;
    pictures?: {
        profile?: {
            url: string;
            meta: ProfilePictureData;
        };
    };
    digitalIdentities: DigitalIdentityDTO;
}
