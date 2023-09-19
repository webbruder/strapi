'use strict';

const _ = require('lodash');
const { yup, validateYupSchema } = require('@strapi/utils');
const { PaginationError, ValidationError } = require('@strapi/utils').errors;

const createModelConfigurationSchema = require('./model-configuration');

const TYPES = ['singleType', 'collectionType'];

/**
 * Validates type kind
 */
const kindSchema = yup.string().oneOf(TYPES).nullable();

const bulkActionInputSchema = yup
  .object({
    ids: yup.array().of(yup.strapiID()).min(1).required(),
  })
  .required();

const generateUIDInputSchema = yup.object({
  contentTypeUID: yup.string().required(),
  field: yup.string().required(),
  data: yup.object().required(),
});

const checkUIDAvailabilityInputSchema = yup.object({
  contentTypeUID: yup.string().required(),
  field: yup.string().required(),
  value: yup
    .string()
    .matches(/^[A-Za-z0-9-_.~]*$/)
    .required(),
});

const validateUIDField = (contentTypeUID, field) => {
  const model = strapi.contentTypes[contentTypeUID];

  if (!model) {
    throw new ValidationError('ContentType not found');
  }

  if (
    !_.has(model, ['attributes', field]) ||
    _.get(model, ['attributes', field, 'type']) !== 'uid'
  ) {
    throw new ValidationError(`${field} must be a valid \`uid\` attribute`);
  }
};

const validatePagination = ({ page, pageSize }) => {
  const pageNumber = parseInt(page, 10);
  const pageSizeNumber = parseInt(pageSize, 10);

  if (Number.isNaN(pageNumber) || pageNumber < 1) {
    throw new PaginationError('invalid pageNumber param');
  }
  if (Number.isNaN(pageSizeNumber) || pageSizeNumber < 1) {
    throw new PaginationError('invalid pageSize param');
  }
};

const validateModelConfiguration = (modelConfiguration, body, opts = {}) => {
  const schema = createModelConfigurationSchema(modelConfiguration, opts);
  const validate = validateYupSchema(schema);
  return validate(body);
};

module.exports = {
  createModelConfigurationSchema,
  validateModelConfiguration,
  validateKind: validateYupSchema(kindSchema),
  validateBulkActionInput: validateYupSchema(bulkActionInputSchema),
  validateGenerateUIDInput: validateYupSchema(generateUIDInputSchema),
  validateCheckUIDAvailabilityInput: validateYupSchema(checkUIDAvailabilityInputSchema),
  validateUIDField,
  validatePagination,
};
