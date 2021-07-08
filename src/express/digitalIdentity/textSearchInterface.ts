import { IDigitalIdentity } from './interface';

export type DigitalIdentityFilters = Partial<{
    type: string | string[];
    source: string | string[];
    isRoleAttachable: boolean;
    mail: string | string[];
    jobTitle: string | string[];
    entityId: string | string[];
}>;

export interface DigitalIdentityTextSearch {
    searchByFullName(uniqueId: string, filters?: Partial<DigitalIdentityFilters>): Promise<IDigitalIdentity[]>;
}
