const { forEachField, chainResolvers } = require("graphql-tools");

const addDefaultResolverToSchema = function addDefaultResolverToSchema(schema, defaultResolver) {
  forEachField(schema, (field, typeName, fieldName) => {
    if (!field.resolve) {
      field.resolve = defaultResolver;
    }
  });
}
addDefaultResolverToSchema.addDefaultResolverToSchema = addDefaultResolverToSchema;

module.exports = addDefaultResolverToSchema;