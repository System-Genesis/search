import { RoleDTO } from '../role/dto';

export interface DigitalIdentityDTO {
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
