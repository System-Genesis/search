import { FilterQueries } from '../../types';
import { EntityFilters } from '../entity/textSearchInterface';
import { IDigitalIdentity } from './interface';

export type DigitalIdentityFilters = Partial<{
    type: string[];
    source: string[];
    isRoleAttachable: boolean[]; // important
    mail: string[];
    jobTitle: string[];
    entityId: string[];
}>;

export const digitalIdentityMapFieldType: Map<string, Map<string, string>> = new Map<string, Map<string, string>>([
    ['type', new Map<string, string>([['digital identity', 'type']])],
    ['source', new Map<string, string>([['digital identity', 'source']])],
    ['isRoleAttachable', new Map<string, string>([['digital identity', 'isRoleAttachable']])],
    ['mail', new Map<string, string>([['digital identity', 'mail']])],
    ['jobTitle', new Map<string, string>([['digital identity', 'jobTitle']])],
    ['entityId', new Map<string, string>([['digital identity', 'entityId']])],
]);

export interface DigitalIdentityTextSearch {
    searchByFullName(uniqueId: string, filters?: FilterQueries<Partial<EntityFilters>>): Promise<IDigitalIdentity[]>;
}
