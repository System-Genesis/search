import { DigitalIdentityDTO } from '../digitalIdentity/dto';
import { ProfilePictureData } from './interface';

export interface EntityDTO {
    id: string;
    displayName: string;
    hierarchy: string;
    directGroup: string;
    entityType: string;
    identityCard: string;
    personalNumber: string;
    goalUserId?: string;
    serviceType: string;
    firstName: string;
    lastName: string;
    fullName: string;
    akaUnit: string;
    dischargeDay: Date;
    rank: string;
    mail: string;
    jobTitle: string;
    phone: string[];
    mobilePhone: string[];
    address: string;
    clearance: string;
    fullClearance: string;
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
