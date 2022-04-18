import { Schema } from 'mongoose';
import { IDigitalIdentity } from '../digitalIdentity/interface';

export type ProfilePictureData = {
    path: string;
    format: string;
    updatedAt?: Date;
    createdAt?: Date;
};

export type pictures = {
    profile: {
        meta: ProfilePictureData;
    };
};

interface IEntity {
    _id: Schema.Types.ObjectId;
    id: string;
    displayName: string;
    hierarchy: string;
    hierarchyIds: string[];
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
    digitalIdentities: [IDigitalIdentity];
}

export { IEntity };
