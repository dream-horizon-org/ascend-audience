/**
 * Mutations index file
 * Central export point for all mutations
 */

// Create Audience
export { createAudience, useCreateAudience } from "./createAudience";
export type { CreateAudienceRequest, CreateAudienceResponse } from "./createAudience/types";

// Onboard Datasink
export { onboardDatasink, useOnboardDatasink } from "./onboardDatasink";
export type { OnboardDatasinkRequest, OnboardDatasinkResponse } from "./onboardDatasink/types";

// Onboard Datasource
export { onboardDatasource, useOnboardDatasource } from "./onboardDatasource";
export type { OnboardDatasourceRequest, OnboardDatasourceResponse } from "./onboardDatasource/types";

// Import Cohort
export { importCohort, useImportCohort } from "./importCohort";
export type { ImportCohortRequest, ImportCohortResponse } from "./importCohort/types";
