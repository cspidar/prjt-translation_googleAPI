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
// Imports the Google Cloud Translation library
const { TranslationServiceClient } = require("@google-cloud/translate");

// Instantiates a client
const translationClient = new TranslationServiceClient();

async function getGlossary() {
  // Construct request
  const request = {
    parent: `projects/${projectId}/locations/${location}`,
    name: `projects/${projectId}/locations/${location}/glossaries/${glossaryId}`,
  };

  // Get glossary
  const [response] = await translationClient.getGlossary(request);

  console.log(`Glossary name: ${response.name}`);
  console.log(`Entry count: ${response.entryCount}`);
  console.log(`Input URI: ${response.inputConfig.gcsSource.inputUri}`);
}

getGlossary();
