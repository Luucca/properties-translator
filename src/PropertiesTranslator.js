const sourceManager = require('./sourceManager');
const reader = require('properties-reader');
const axios = require('axios').default;
const { v4: uuidv4 } = require('uuid');

class PropertiesTranslator {
  constructor(config) {
    this.config = config;
  }

  async translate({ rebuild }) {
    if (!this.config.targetLanguages) {
      throw new Error('No target language has been defined.');
    } else if (!this.config.sourceLang) {
      throw new Error('Source language has not been defined.');
    }

    const translatableLangs = await this.getTranslatableLangs();

    const langFiles = sourceManager.getLangFiles(this.config, translatableLangs);

    const sourceProperties = sourceManager.getSourceProperties(this.config);

    const jobs = [];

    langFiles.forEach((lang) => {
      const newKeys = [];
      sourceProperties.each((key, value) => {
        if (!sourceManager.keyExists(lang.file, key) || rebuild) {
          newKeys.push({ key, value });
        }
      });
      if (newKeys.length > 0) {
        jobs.push({ lang, newKeys });
      }
    });

    if (jobs.length == 0) {
      console.log('\nAll translated files are up to date with the source file.\n');
    }

    for (const job of jobs) {
      const prop = reader(job.lang.file, { writer: { saveSections: true } });

      for (const newKey of job.newKeys) {
        const translated = await this.translateSentence(newKey.value, job.lang.name, newKey.key);
        prop.set(newKey.key, translated);
      }

      await prop.save(job.lang.file);
    }
  }

  async getTranslatableLangs() {
    const { data } = await axios({
      baseURL: this.config.azureConfig.endpoint || 'https://api.cognitive.microsofttranslator.com',
      url: '/languages',
      method: 'get',
      params: {
        'api-version': this.config.azureConfig.version || '3.0',
        scope: 'translation',
      },
    });

    const { translation } = data;
    const langs = {};

    Object.keys(translation).forEach((key) => {
      langs[key] = translation[key].name;
    });

    return langs;
  }

  async translateSentence(sentence, lang, key) {
    const response = await axios({
      baseURL: this.config.azureConfig.endpoint || 'https://api.cognitive.microsofttranslator.com',
      url: '/translate',
      method: 'post',
      headers: {
        'Ocp-Apim-Subscription-Key': this.config.azureConfig.subscriptionKey,
        'Ocp-Apim-Subscription-Region': this.config.azureConfig.region,
        'Content-type': 'application/json',
        'X-ClientTraceId': uuidv4().toString(),
      },
      params: {
        'api-version': this.config.azureConfig.version || '3.0',
        from: this.config.sourceLang,
        to: [lang],
      },
      data: [
        {
          text: sentence,
        },
      ],
      responseType: 'json',
    });

    const text = response.data[0].translations[0].text;

    if (this.config.log) {
      console.log(
        `\nTranslated${
          key ? ` {${key}}` : ''
        } from ${this.config.sourceLang.toUpperCase()} to ${lang.toUpperCase()}` +
          `\n- ↓ ${sentence} ↓ \n- → ${text} ←`
      );
    }

    return text;
  }
}

module.exports = PropertiesTranslator;
