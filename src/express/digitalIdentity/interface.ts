import { IRole } from '../role/interface';

export interface IDigitalIdentity {
    id?: string;
    type: string;
    source: string;
    mail: string;
    uniqueId: string;
    entityId: string;
    createdAt: Date;
    updatedAt: Date;
    isRoleAttachable: boolean;
    role?: IRole;
}
