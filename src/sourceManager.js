const fs = require('fs');
const reader = require('properties-reader');

function getLangFiles(config, supportedLang) {
  const files = [];

  config.targetLanguages.forEach((lang) => {
    if (supportedLang[lang]) {
      const translateDir = config.translateDir ?? `./translated_files`;
      const langFilePrefix = config.langFilePrefix ?? 'lang_';

      const path = `${translateDir}/${langFilePrefix}${lang}.properties`;

      if (!fs.existsSync(translateDir)) {
        fs.mkdirSync(translateDir);
      }

      if (!fs.existsSync(path)) {
        fs.writeFileSync(path, '', {});
      }

      files.push({ name: lang, file: path });
    }
  });

  return files;
}

function getSourceProperties(config) {
  return reader(config.sourceFile);
}

function keyExists(file, key) {
  return !!reader(file).get(key);
}

module.exports = {
  getLangFiles,
  getSourceProperties,
  keyExists,
};
