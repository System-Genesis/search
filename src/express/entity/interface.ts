import { Types } from 'mongoose';
import { IOrganizationGroup } from '../group/interface';
import { IDigitalIdentity } from '../digitalIdentity/interface';

export interface PictureMeta {
    format?: string;
    updatedAt?: Date;
}

export interface ProfilePictureMeta extends PictureMeta {
    takenAt: Date;
}

export type ProfilePictureDTO = {
    url: string;
    meta: ProfilePictureMeta;
};

export type SetProfilePictureDTO = Omit<ProfilePictureMeta, 'updatedAt'> & {
    path: string;
};

export interface IEntity {
    id: string;
    displayName?: string;
    entityType?: string;
    identityCard?: string;
    personalNumber?: string;
    firstName?: string;
    lastName?: string;
    akaUnit?: string;
    status?: string;
    dischargeDay?: Date;
    rank?: string;
    mail?: string;
    job?: string;
    phone?: string[];
    mobilePhone?: string[];
    address?: string;
    clearance?: string;
    pictures?: {
        profile?: ProfilePictureDTO | SetProfilePictureDTO;
    };
    sex?: string;
    birthDate?: Date;
    createdAt?: Date;
    updatedAt?: Date;
    digitalIdentities: IDigitalIdentity[];

    directGroup: string | Types.ObjectId | IOrganizationGroup;
    managedGroup?: string | Types.ObjectId | IOrganizationGroup;
}
