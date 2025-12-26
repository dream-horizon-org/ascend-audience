import { ConnectorTypeConfigSchema } from "../network/queries";

/**
 * Extracts default values from a connector config schema
 * @param schema - The connector config schema
 * @returns An object containing all default values from the schema
 */
export const extractDefaultValues = (schema: ConnectorTypeConfigSchema): Record<string, unknown> => {
  const defaults: Record<string, unknown> = {};

  Object.entries(schema.properties).forEach(([key, property]) => {
    if (property.default !== undefined) {
      defaults[key] = property.default;
    }
  });

  return defaults;
};

/**
 * Generates a human-readable label from a camelCase or snake_case key
 * @param key - The property key
 * @returns A formatted label
 */
export const formatFieldLabel = (key: string): string => {
  return key
    .charAt(0)
    .toUpperCase() + 
    key
      .slice(1)
      .replace(/([A-Z])/g, ' $1')
      .replace(/_/g, ' ');
};

