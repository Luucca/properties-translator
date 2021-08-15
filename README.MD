Properties Translator v1.0
------------------

1. Install using ```npm properties-translator```

2. Usage example:

```javascript
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
```
   
* The translated files will be generated in the ```translateDir``` folder defined in ```config```.

## Docs

1. Configuration

   * [Required] ```targetLanguages``` - Array of strings the with target language codes.
   * [Required] ```sourceFile``` - String with the path to your source file.
   * [Required] ```sourceLang``` - String with the source file lang.
   * [Optional] ```translateDir``` - String with the path to a folder where the translated files will be created. Default to ```./translated_files```.
   * [Optional] ```langFilePrefix``` - String with a prefix name for translated files. Default to ```lang_```.
   * [Optional] ```log``` - Boolean that if set to true, will show the properties being translated in the terminal. Default to ```false```.
   * [Required] ```azureConfig.subscriptionKey``` - String with your Azure translator resource key.
   * [Required] ```azureConfig.region``` - String with your Azure translator resource region.
   * [Optional] ```azureConfig.endpoint``` - String with the azure cognitive translator api endpoint. Default to ```api.cognitive.microsofttranslator.com```
   * [Optional] ```azureConfig.version``` - String with the azure cognitive translator version. Default to ```3.0```
  
2. Functions

   * ```translate({ rebuild: boolean })``` - Generate the files and translate them according to the configured source file.
        * ```rebuild``` - Parameter that will force all files to be regenerated. The default behavior ```false``` will only add new updates made to the source file, unless it's the first translation.
   * ```getTranslatableLangs()``` - Returns a promise with an object containing all Azure translatable languages, where the key is the language code and the value is the language name.

   * ```translateSentence(sentence: string, lang: string)``` - Takes a sentence and a language code, then returns a promise with the translation based on ```sourceLang```.

* You can see **Azure Cognitive Translator** documentation <a href="https://azure.microsoft.com/services/cognitive-services/translator/">here</a>

Enjoy! :)
