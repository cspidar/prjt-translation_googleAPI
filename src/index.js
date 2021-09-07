import {
  QDropEvent,
  QDragLeaveEvent,
  WidgetEventTypes,
  QDragMoveEvent,
  QMainWindow,
  QWidget,
  QLabel,
  FlexLayout,
  QPushButton,
  QIcon,
  QFileDialog,
  QGridLayout,
} from "@nodegui/nodegui";
import { afterTranslateTextEdit } from "./func/afterTranslateTextEdit";
import logo from "../assets/logox200.png";
import logo_excel from "../assets/file-excel-2-line.svg";

//

let text;
let fileName = "";
let dirName = "";
let baseName = "";
let extName = "";
let listArr = [];
let gloDir;
let gloBase;
let gloExt;

// == Google translate ==

/// txt ///
const bucketName = "ascii_manual_us";
const projectId = "single-kayak-323502";
const location = "us-central1";
let glossaryId;
const keyFilename = "./key/single-kayak-323502-3376f2f211f4.json";
const fs = require("fs");
const path = require("path");

// Imports the Google Cloud Translation library
const { TranslationServiceClient } = require("@google-cloud/translate");

// Instantiates a client
const translationClient = new TranslationServiceClient({
  projectId,
  keyFilename,
});
async function translateTextWithGlossary() {
  const glossaryConfig = {
    glossary: `projects/${projectId}/locations/${location}/glossaries/${glossaryId}`,
  };

  // Construct request
  const request = {
    parent: `projects/${projectId}/locations/${location}`,
    contents: [text],
    mimeType: "text/plain", // mime types: text/plain, text/html
    sourceLanguageCode: "ko",
    targetLanguageCode: "en",
    glossaryConfig: glossaryConfig,
  };

  // Run request
  const [response] = await translationClient.translateText(request);

  async function writeFirst() {
    for (const translation of response.glossaryTranslations) {
      fs.writeFileSync(
        `${dirName}/${baseName}_en${extName}`,
        translation.translatedText,
        {
          encoding: "utf8",
        }
      );
    }
  }
  writeFirst();

  function editSecond() {
    let editText = fs.readFileSync(
      `${dirName}/${baseName}_en${extName}`,
      "utf-8"
    );
    editText = afterTranslateTextEdit(editText);
    fs.writeFileSync(`${dirName}/${baseName}_en${extName}`, editText, {
      encoding: "utf8",
    });
  }
  editSecond();

  label.setText("Drag to here.");
}

//

//

// Google Storage

//

// == nodegui ==

const win = new QMainWindow();
win.setWindowTitle("Google API tanslate");
win.setMinimumSize(340, 120);

const centralWidget = new QWidget();
centralWidget.setObjectName("myroot");

const rootLayout = new FlexLayout();
centralWidget.setLayout(rootLayout);

const label = new QLabel();
label.setObjectName("mylabel");
label.setText("Drag to here.");

rootLayout.addWidget(label);

//

// Glossary 파일 업로드
const button = new QPushButton(centralWidget);
button.setObjectName("mybutton");
button.setIcon(new QIcon(logo_excel));
button.setText("Add glossary");
let buttonSize = 120;
button.setFixedSize(buttonSize, 25);

button.addEventListener("clicked", () => {
  console.log("the button was clicked");
  const fileDialog = new QFileDialog();
  // fileDialog.setFileMode(FileMode.AnyFile);
  fileDialog.setNameFilter("Glossary file (*.csv)");
  fileDialog.exec();

  const selectedFiles = fileDialog.selectedFiles();
  console.log(path.dirname(selectedFiles[0].toString()));
  //C:/Users/AA19103/Desktop
  console.log(path.basename(selectedFiles[0].toString()));
  //ascii_manual-ko-en.csv
  console.log(path.extname(selectedFiles[0].toString()));
  //.csv

  gloDir = path.dirname(selectedFiles[0].toString().replaceAll("\\", "/"));
  gloBase = path.basename(selectedFiles[0].toString().replaceAll("\\", "/"));
  gloExt = path.extname(selectedFiles[0].toString().replaceAll("\\", "/"));
  //

  function main() {
    const filePath = `${gloDir}/${gloBase}`;
    const destFileName = `${gloBase}`;
    const { Storage } = require("@google-cloud/storage");
    const storage = new Storage({ projectId, keyFilename });
    async function uploadFile() {
      await storage.bucket(bucketName).upload(filePath, {
        destination: destFileName,
      });
      console.log(`${filePath} uploaded to ${bucketName}`);
    }
    uploadFile().catch(console.error);
  }
  main();

  //

  //

  // glossary 업데이트
  glossaryId = gloBase.replace(gloExt, "");

  //// glossary 확인
  async function listGlossaries() {
    // Construct request
    const request = {
      parent: `projects/${projectId}/locations/${location}`,
    };

    // Run request
    const [response] = await translationClient.listGlossaries(request);

    let beforeGlo;
    for (const glossary of response) {
      console.log(`Name: ${glossary.name}`);
      beforeGlo = `${glossary.name}`;
      console.log(`Entry count: ${glossary.entryCount}`);
      console.log(`Input uri: ${glossary.inputConfig.gcsSource.inputUri}`);
      for (const languageCode of glossary.languageCodesSet.languageCodes) {
        console.log(`Language code: ${languageCode}`);
      }
    }
    // console.table(response);
    return beforeGlo;
  }

  async function deleteGlossary() {
    // Construct request
    const request = {
      parent: `projects/${projectId}/locations/${location}`,
      name: `projects/${projectId}/locations/${location}/glossaries/${glossaryId}`,
    };

    // Delete glossary using a long-running operation
    const [operation] = await translationClient.deleteGlossary(request);

    // Wait for operation to complete.
    const [response] = await operation.promise();

    console.log(`Deleted glossary: ${response.name}`);
  }

  //// glossary 생성

  async function createGlossary() {
    // Construct glossary
    const glossary = {
      languageCodesSet: {
        languageCodes: ["ko", "en"],
      },
      inputConfig: {
        gcsSource: {
          inputUri: `gs://${bucketName}/${gloBase}`,
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

  const updateGlossary = async () => {
    const beforeGloName = await listGlossaries();
    if (beforeGloName !== undefined && beforeGloName.includes(glossaryId))
      await deleteGlossary();
    console.log(beforeGloName);
    console.log(glossaryId);
    await createGlossary();
  };

  updateGlossary();

  //
});

const button2 = new QPushButton(centralWidget);
button2.setObjectName("mybutton2");
button2.setIcon(new QIcon(logo));
button2.setText("func2");
button2.setFixedSize(80, 25);
button2.move(buttonSize + 1, 0);

// centralWidget.setLayout(button);

// rootLayout.addWidget(button);
// rootLayout.addWidget(label2);

win.setCentralWidget(centralWidget);
win.setStyleSheet(
  `
    #myroot {
      background-color: #eeeeee;
      align-items: 'center';
      justify-content: 'center';
    }
    #mylabel {
      font-size: 16px;
      font-weight: bold;
    }
    #mybutton {
      font-size: 12px;
      font-weight: regular;
    }
    #mybutton2 {
      font-size: 12px;
      font-weight: regular;
    }
  `
);

//

// 드롭 파일 번역
win.setAcceptDrops(true);
win.addEventListener(WidgetEventTypes.DragEnter, (e) => {
  let ev = new QDragMoveEvent(e);
  console.log("dragEnter", ev.proposedAction());
  let mimeData = ev.mimeData();
  mimeData.text(); //Inspection of text works
  console.log("mimeData", {
    hasColor: mimeData.hasColor(),
    hasHtml: mimeData.hasHtml(),
    hasImage: mimeData.hasImage(),
    hasText: mimeData.hasText(),
    hasUrls: mimeData.hasUrls(),
    html: mimeData.html(),
    text: mimeData.text(),
  }); //Inspection of MIME data works
  let urls = mimeData.urls(); //Get QUrls
  for (let url of urls) {
    let str = url.toString();
    console.log("url", str); //Log out Urls in the event
  }
  ev.accept(); //Accept the drop event, which is crucial for accepting further events
});
win.addEventListener(WidgetEventTypes.DragMove, (e) => {
  let ev = new QDragMoveEvent(e);
  // console.log("dragMove");
  label.setText("KO -> EN");
});
win.addEventListener(WidgetEventTypes.DragLeave, (e) => {
  console.log("dragLeave", e);
  let ev = new QDragLeaveEvent(e);
  ev.ignore(); //Ignore the event when it leaves
  console.log("ignored", ev);
  label.setText("Drag to here.");
});
win.addEventListener(WidgetEventTypes.Drop, (e) => {
  let dropEvent = new QDropEvent(e);
  let mimeData = dropEvent.mimeData();
  console.log("dropped", dropEvent.type());
  label.setText("Translating...");
  let urls = mimeData.urls();
  for (let url of urls) {
    let str = url.toString();
    // console.log("url", str); //Example of inspection of dropped data.
    fileName = str.replace("file:///", "");

    function nameInputer(dir) {
      dirName = path.dirname(dir).replaceAll("\\", "/");
      extName = path.extname(dir);
      baseName = path.basename(dir).replace(`${extName}`, "");
      text = fs.readFileSync(dir, "utf-8");
    }

    nameInputer(fileName);

    if (path.basename(fileName).includes("_en"))
      label.setText("파일명에 _en 이 포함되지 않아야 합니다.");

    if (extName !== "" && !path.basename(fileName).includes("_en")) {
      console.log(`${dirName}/${baseName}${extName}`);
      console.log(extName);
      translateTextWithGlossary();
      console.log("file");
    } else if (extName === "") {
      // console.log("folder");

      function generateComponents(dir) {
        fs.readdirSync(dir).forEach((file) => {
          let fullPath = path.join(dir, file);
          if (fs.lstatSync(fullPath).isDirectory()) {
            // console.log(`directory: ${fullPath}`);
            generateComponents(fullPath);
          } else {
            if (
              path.extname(fullPath) === ".adoc" &&
              !path.basename(fullPath).includes("_en")
            ) {
              listArr.push(fullPath);
            }
          }
        });
      }
      generateComponents(fileName);

      async function dirTranslate() {
        for (let i = 0; i < listArr.length; i++) {
          nameInputer(listArr[i]);
          console.log(fileName, dirName, baseName, extName);
          await translateTextWithGlossary();
        }
      }
      dirTranslate();

      console.log("finished");
    }
  }
});

win.show();

global.win = win;

//
