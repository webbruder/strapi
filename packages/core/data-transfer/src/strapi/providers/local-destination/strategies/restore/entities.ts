import { Writable } from 'stream';
import type { LoadedStrapi, Common, Schema } from '@strapi/types';

import { get, last } from 'lodash/fp';

import { ProviderTransferError } from '../../../../../errors/providers';
import type { IEntity, Transaction } from '../../../../../../types';
import { json } from '../../../../../utils';
import * as queries from '../../../../queries';

interface IEntitiesRestoreStreamOptions {
  strapi: LoadedStrapi;
  updateMappingTable<TSchemaUID extends Common.UID.Schema>(
    type: TSchemaUID,
    oldID: number,
    newID: number
  ): void;
  transaction?: Transaction;
}

const createEntitiesWriteStream = (options: IEntitiesRestoreStreamOptions) => {
  const { strapi, updateMappingTable, transaction } = options;
  const query = queries.entity.createEntityQuery(strapi);

  return new Writable({
    objectMode: true,

    async write(entity: IEntity, _encoding, callback) {
      await transaction?.attach(async () => {
        const { type, id, data } = entity;
        const { create, getDeepPopulateComponentLikeQuery } = query(type);
        const contentType = strapi.getModel(type);

        let cType:
          | Schema.ContentType
          | Schema.Component
          | ((...opts: any[]) => Schema.ContentType | Schema.Component) = contentType;

        /**
         * Resolve the component UID of an entity's attribute based
         * on a given path (components & dynamic zones only)
         */
        const resolveType = (paths: string[]): Common.UID.Schema | undefined => {
          let value: unknown = data;

          for (const path of paths) {
            value = get(path, value);

            // Needed when the value of cType should be computed
            // based on the next value (eg: dynamic zones)
            if (typeof cType === 'function') {
              cType = cType(value);
            }

            if (path in cType.attributes) {
              const attribute = cType.attributes[path];

              if (attribute.type === 'component') {
                cType = strapi.getModel(attribute.component);
              }

              if (attribute.type === 'dynamiczone') {
                cType = ({ __component }: { __component: Common.UID.Component }) =>
                  strapi.getModel(__component);
              }
            }
          }

          if ('uid' in cType) {
            return cType.uid;
          }

          return undefined;
        };

        try {
          const created = await create({
            data,
            populate: getDeepPopulateComponentLikeQuery(contentType, { select: 'id' }),
            select: 'id',
          });

          // Compute differences between original & new entities
          const diffs = json.diff(data, created);

          updateMappingTable(type, id, created.id);

          // For each difference found on an ID attribute,
          // update the mapping the table accordingly
          diffs.forEach((diff) => {
            if (diff.kind === 'modified' && last(diff.path) === 'id') {
              const target = resolveType(diff.path);

              // If no type is found for the given path, then ignore the diff
              if (!target) {
                return;
              }

              const [oldID, newID] = diff.values as [number, number];

              updateMappingTable(target, oldID, newID);
            }
          });
        } catch (e) {
          if (e instanceof Error) {
            return callback(e);
          }

          return callback(new ProviderTransferError(`Failed to create "${type}" (${id})`));
        }

        return callback(null);
      });
    },
  });
};

export { createEntitiesWriteStream };
