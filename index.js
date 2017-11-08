const { forEachField, chainResolvers } = require("graphql-tools");

module.exports = function addDefaultResolverToSchema(schema, defaultResolver) {
  forEachField(schema, (field, typeName, fieldName) => {
    if (!field.resolve) {
      field.resolve = defaultResolver;
    }
  });
}
addDefaultResolverToSchema.addDefaultResolverToSchema = addDefaultResolverToSchema;
