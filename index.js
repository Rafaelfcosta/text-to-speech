const credentials = require('./credentials.json');
const sdk = require("microsoft-cognitiveservices-speech-sdk");
const fs = require('fs');
const outputDir = './output';
const inputFile = './inputs.json';

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir);
}

const speechConfig = sdk.SpeechConfig.fromSubscription(credentials.key, credentials.region);
speechConfig.speechSynthesisVoiceName = "pt-BR-DonatoNeural";



function synthesizeText(projectName, text, index) {
  return new Promise(async (resolve, reject) => {
    const completeOutputDir = `${outputDir}/${projectName}`;
    const audioFile = `audio${index + 1}_${Date.now()}.wav`;
    const audioConfig = sdk.AudioConfig.fromAudioFileOutput(`./${completeOutputDir}/${audioFile}`);
    let synthesizer = new sdk.SpeechSynthesizer(speechConfig, audioConfig);

    try {
      await synthesizer.speakTextAsync(text, (result) => {
        if (result.reason === sdk.ResultReason.SynthesizingAudioCompleted) {
          console.log(`Synthesis finished for: "${text}"`);
          synthesizer.close();
          synthesizer = null;
          resolve();
        } else {
          console.error("Speech synthesis canceled, " + result.errorDetails +
            "\nDid you set the speech resource key and region values?");
        }
      });
    } catch (err) {
      console.error(`Speech synthesis canceled for: "${text}",` + err +
        "\nDid you set the speech resource key and region values?");
      synthesizer.close();
      synthesizer = null;
      reject(err);
    }
  });
}

async function synthesizeAllTexts() {
  const inputProjects = JSON.parse(fs.readFileSync(inputFile)).projects;
  for (let i = 0; i < inputProjects.length; i++) {
    const project = inputProjects[i];
    console.log(`Now synthesizing project "${project.name}"...`);
    const projectNameFormatted = project.name.replace(/\s/g, '_').toLowerCase();
    if (!fs.existsSync(`${outputDir}/${projectNameFormatted}`)) {
      fs.mkdirSync(`${outputDir}/${projectNameFormatted}`);
    }
    const projectTexts = project.texts;
    const promises = [];
    for (let j = 0; j < projectTexts.length; j++) {
      const text = projectTexts[j];
      console.log(`Now synthesizing "${text}"...`);
      promises.push(synthesizeText(projectNameFormatted, text, j));
    }
    await Promise.all(promises);
  }
}

//   const inputTexts = JSON.parse(fs.readFileSync(inputFile)).texts;

//   const promises = [];
//   for (let i = 0; i < inputTexts.length; i++) {
//     const text = inputTexts[i];
//     console.log(`Now synthesizing "${text}"...`);
//     promises.push(synthesizeText(text, i));
//   }
//   await Promise.all(promises);
// }

synthesizeAllTexts();

