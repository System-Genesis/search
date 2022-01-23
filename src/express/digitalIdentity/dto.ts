import { RoleDTO } from '../role/dto';

export interface DigitalIdentityDTO {
    // DI as it should be returned to client
    type: string;
    source: string;
    mail: string;
    uniqueId: string;
    entityId: string;
    createdAt: Date;
    updatedAt: Date;
    isRoleAttachable: boolean;
    upn: string;
    role: RoleDTO;
}
