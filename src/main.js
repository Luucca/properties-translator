const Translator = require('properties-translator');

const config = {
  targetLanguages: ['pt', 'fr'],
  sourceFile: './lang_en.properties',
  sourceLang: 'en',
  translateDir: './translated_files',
  langFilePrefix: 'lang_',
  log: true,
  azureConfig: {
    subscriptionKey: 'YOUR_AZURE_TRANSLATOR_KEY',
    region: 'YOUR_AZURE_TRANSLATOR_REGION',
    endpoint: 'https://api.cognitive.microsofttranslator.com',
    version: '3.0',
  },
};

const translator = new Translator(config);

translator.translate({ rebuild: false });
