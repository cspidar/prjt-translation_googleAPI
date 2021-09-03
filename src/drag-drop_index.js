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
import logo from "../assets/logox200.png";

const win = new QMainWindow();
win.setWindowTitle("Hello World");

const centralWidget = new QWidget();
centralWidget.setObjectName("myroot");
const rootLayout = new FlexLayout();
centralWidget.setLayout(rootLayout);

const label = new QLabel();
label.setObjectName("mylabel");
label.setText("Drag & Drop");

const button = new QPushButton();
button.setIcon(new QIcon(logo));

const label2 = new QLabel();
label2.setText("111");
label2.setInlineStyle(`
  color: red;
`);

rootLayout.addWidget(label);
rootLayout.addWidget(button);
rootLayout.addWidget(label2);
win.setCentralWidget(centralWidget);
win.setStyleSheet(
  `
    #myroot {
      background-color: #009688;
      height: '100%';
      align-items: 'center';
      justify-content: 'center';
    }
    #mylabel {
      font-size: 16px;
      font-weight: bold;
      padding: 1;
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
  console.log("dragMove");
  label.setText("영문으로 번역됩니다.");
});
win.addEventListener(WidgetEventTypes.DragLeave, (e) => {
  console.log("dragLeave", e);
  let ev = new QDragLeaveEvent(e);
  ev.ignore(); //Ignore the event when it leaves
  console.log("ignored", ev);
  label.setText("이곳으로 파일을 끌어 놓으세요.");
});
win.addEventListener(WidgetEventTypes.Drop, (e) => {
  let dropEvent = new QDropEvent(e);
  let mimeData = dropEvent.mimeData();
  console.log("dropped", dropEvent.type());
  let urls = mimeData.urls();
  for (let url of urls) {
    let str = url.toString();
    console.log("url", str); //Example of inspection of dropped data.
  }
});

win.show();

global.win = win;
