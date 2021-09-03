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
} from "@nodegui/nodegui";
import { file } from "googleapis/build/src/apis/file";
import logo from "../assets/logox200.png";

//

// == Google translate ==

/// txt ///

/**
 * TODO(developer): Uncomment these variables before running the sample.
 */
const projectId = "single-kayak-323502";
const location = "us-central1";
const glossaryId = "ascii_manual-ko-en";
const keyFilename = "./key/single-kayak-323502-3376f2f211f4.json";
const fs = require("fs");
const path = require("path");

let text;
let fileName = "";
let dirName = "";
let baseName = "";
let extName = "";
let listArr = [];

// console.log(fileName);

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

  for (const translation of response.glossaryTranslations) {
    // 번역된 텍스트
    // console.log(`Translation: ${translation.translatedText}`);
    // console.log(translation.translatedText);

    // if (translation.translatedText.includes(":imagesdir:doc"))
    //   console.log("include");

    // afterTranslateTextEdit(translation.translatedText);

    translation.translatedText.replaceAll(":imagesdir:doc", ":imagesdir: doc");

    fs.writeFileSync(
      `${dirName}/${baseName}_en${extName}`,
      "\ufeff" + translation.translatedText,
      {
        encoding: "utf8",
      }
    );
  }
  label.setText("Drag to here.");
}
// translateTextWithGlossary();

//

// 번역된 텍스트 후보정
function afterTranslateTextEdit(beforeEditText) {
  beforeEditText.replaceAll(":imagesdir:doc", ":imagesdir: doc");
}

//

/// doc
//// 클라우드 안에서만 가능 (gs://)
/*
async function docTranslate() {
  const { TranslationServiceClient } =
    require("@google-cloud/translate").v3beta1;

  // Instantiates a client
  const translationClient = new TranslationServiceClient({
    projectId,
    keyFilename,
  });

  const documentInputConfig = {
    gcsSource: {
      inputUri: fileName,
    },
  };

  async function translateDocument() {
    // Construct request
    const request = {
      parent: translationClient.locationPath(projectId, location),
      documentInputConfig: documentInputConfig,
      sourceLanguageCode: "ko",
      targetLanguageCode: "us",
    };

    // Run request
    const [response] = await translationClient.translateDocument(request);

    console.log(
      `Response: Mime Type - ${response.documentTranslation.mimeType}`
    );
  }

  translateDocument();
}
*/

//

// == nodegui ==

const win = new QMainWindow();
win.setWindowTitle("Google API tanslate");
win.setMinimumSize(300, 100);

const centralWidget = new QWidget();
centralWidget.setObjectName("myroot");
const rootLayout = new FlexLayout();
centralWidget.setLayout(rootLayout);

const label = new QLabel();
label.setObjectName("mylabel");
label.setText("Drag to here.");

const button = new QPushButton();
button.setIcon(new QIcon(logo));

const label2 = new QLabel();
label2.setText("111");
label2.setInlineStyle(`
  color: red;
`);

rootLayout.addWidget(label);

// rootLayout.addWidget(button);
// rootLayout.addWidget(label2);

win.setCentralWidget(centralWidget);
win.setStyleSheet(
  `
    #myroot {
      background-color: #eeeeee;
      height: '100%';
      align-items: 'center';
      justify-content: 'center';
    }
    #mylabel {
      font-size: 16px;
      font-weight: bold;
      padding: 5;
    }
  `
);

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
    dirName = path.dirname(fileName);
    extName = path.extname(fileName);
    baseName = path.basename(fileName).replace(`${extName}`, "");
    console.log(`${dirName}/${baseName}${extName}`);
    console.log(extName);
    // text = fs.readFileSync(`${fileName}`, "utf-8");
    // txtTranslate();
    // docTranslate();

    if (extName === "") {
      // console.log("folder");

      function generateComponents(dir) {
        fs.readdirSync(dir).forEach((file) => {
          let fullPath = path.join(dir, file);
          if (fs.lstatSync(fullPath).isDirectory()) {
            // console.log(`directory: ${fullPath}`);
            generateComponents(fullPath);
          } else {
            // console.log(`filename: ${fullPath}, ${path.extname(fullPath)}`);
            if (
              path.extname(fullPath) === ".adoc" &&
              !path.basename(fullPath).includes("_en")
            ) {
              listArr.push(fullPath);
              // console.log(dirName, baseName, extName);
              // console.log(text);
              translateTextWithGlossary();
            }
          }
        });
      }
      generateComponents(fileName);

      function nameInputer(dir) {
        dirName = path.dirname(dir).replaceAll("\\", "/");
        extName = path.extname(dir);
        baseName = path.basename(dir).replace(`${extName}`, "");
        text = fs.readFileSync(dir, "utf-8");
      }

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

    if (extName !== "") console.log("file");
  }
});

win.show();

global.win = win;

//
