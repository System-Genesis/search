import { IRole } from '../role/interface';

export interface IDigitalIdentity {
    // DI as it saved in the db
    type: string;
    source: string;
    mail: string;
    uniqueId: string;
    entityId: string;
    createdAt: Date;
    updatedAt: Date;
    isRoleAttachable: boolean;
    upn: string;
    role: IRole;
}
