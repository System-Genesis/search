import { FilterQueries } from '../../utils/types';
import { EntityFilters } from '../entity/textSearchInterface';
import { IDigitalIdentity } from './interface';

export type DigitalIdentityFilters = Partial<{
    type: string[];
    source: string[];
    isRoleAttachable: boolean[]; // important
    mail: string[];
    jobTitle: string[];
    entityId: string[];
    expanded: boolean[];
}>;

export const digitalIdentityMapFieldType: Map<string, Map<string, string>> = new Map<string, Map<string, string>>([
    ['type', new Map<string, string>([['digitalIdentity', 'type']])],
    ['source', new Map<string, string>([['digitalIdentity', 'source']])],
    ['isRoleAttachable', new Map<string, string>([['digitalIdentity', 'isRoleAttachable']])],
    ['mail', new Map<string, string>([['digitalIdentity', 'mail']])],
    ['jobTitle', new Map<string, string>([['digitalIdentity', 'jobTitle']])],
    ['expanded', new Map<string, string>([['digitalIdentity', 'expanded']])],
    ['entityId', new Map<string, string>([['digitalIdentity', 'entityId']])],
]);

export interface DigitalIdentityTextSearch {
    searchByFullName(uniqueId: string, filters?: FilterQueries<Partial<EntityFilters>>): Promise<IDigitalIdentity[]>;
}
