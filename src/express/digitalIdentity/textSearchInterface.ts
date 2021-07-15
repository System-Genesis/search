import { FilterQueries } from '../../types';
import { EntityFilters } from '../entity/textSearchInterface';
import { IDigitalIdentity } from './interface';

export type DigitalIdentityFilters = Partial<{
    type: string[];
    source: string[];
    isRoleAttachable: boolean;
    mail: string[];
    jobTitle: string[];
    entityId: string[];
}>;

export const groupMapFieldType: Map<string, Map<string, string>> = new Map<string, Map<string, string>>([
    ['type', new Map<string, string>([['Digital Identity', 'type']])],
    ['source', new Map<string, string>([['Digital Identity', 'source']])],
    ['isRoleAttachable', new Map<string, string>([['Digital Identity', 'isRoleAttachable']])],
    ['mail', new Map<string, string>([['Digital Identity', 'mail']])],
    ['jobTitle', new Map<string, string>([['Digital Identity', 'jobTitle']])],
    ['entityId', new Map<string, string>([['Digital Identity', 'entityId']])],
]);

export interface DigitalIdentityTextSearch {
    searchByFullName(uniqueId: string, filters?: FilterQueries<Partial<EntityFilters>>): Promise<IDigitalIdentity[]>;
}
