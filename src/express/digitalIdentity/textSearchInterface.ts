import { IDigitalIdentity } from './interface';

export type DigitalIdentityFilters = Partial<{
    type: string;
    source: string;
    isRoleAttachable: boolean;
    mail: string;
    jobTitle: string;
    entityId: string;
}>;

export interface DigitalIdentityTextSearch {
    searchByFullName(uniqueId: string, filters?: Partial<DigitalIdentityFilters>): Promise<IDigitalIdentity[]>;
}
