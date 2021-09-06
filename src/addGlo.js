const projectId = "single-kayak-323502";
const location = "us-central1";
const glossaryId = "ascii_manual-ko-en";
const fs = require("fs");
const path = require("path");

/**
 * TODO(developer): Uncomment these variables before running the sample.
 */
// const projectId = 'YOUR_PROJECT_ID';
// const location = 'global';
// const glossaryId = 'your-glossary-display-name';

// Imports the Google Cloud Translation library
const { TranslationServiceClient } = require("@google-cloud/translate");

// Instantiates a client
const translationClient = new TranslationServiceClient();

async function createGlossary() {
  // Construct glossary
  const glossary = {
    languageCodesSet: {
      languageCodes: ["ko", "en"],
    },
    inputConfig: {
      gcsSource: {
        inputUri: "gs://ascii_manual_us/asset/ascii_manual-ko-en.csv",
      },
    },
    name: `projects/${projectId}/locations/${location}/glossaries/${glossaryId}`,
  };

  // Construct request
  const request = {
    parent: `projects/${projectId}/locations/${location}`,
    glossary: glossary,
  };

  // Create glossary using a long-running operation
  const [operation] = await translationClient.createGlossary(request);

  // Wait for the operation to complete
  await operation.promise();

  console.log("Created glossary:");
  console.log(`InputUri ${request.glossary.inputConfig.gcsSource.inputUri}`);
}

createGlossary();
