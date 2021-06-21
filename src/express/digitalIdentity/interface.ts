import { Types } from 'mongoose';
import { IRole } from '../role/interface';

export interface IDigitalIdentity {
    id?: string | Types.ObjectId;
    type: string;
    source: string;
    mail: string;
    uniqueId: string;
    entityId: string;
    createdAt: Date;
    updatedAt: Date;
    isRoleAttachable: boolean;
    role: IRole;
}
