// 번역된 텍스트 후보정
export function afterTranslateTextEdit(beforeEditText) {
  let afterEditText;
  // const headingSentence = new RegExp("^==.*");
  const spaceAfterLetter = /(?<==+.*(?<=\s))[A-Za-z]/g;

  // const notListButBold = new RegExp("(?<=[\\<&\\*])\\s(?=[A-Za-z]{2,}\\*/g)");

  // beforeEditText.replace(notListButBold, "");

  // beforeEditText.replace(spaceAfterLetter, () => {
  //   if (spaceAfterLetter && headingSentence) return /[A-Z]/;
  // });

  beforeEditText = beforeEditText.replace(spaceAfterLetter, (p) =>
    p.toUpperCase()
  );

  afterEditText = beforeEditText
    .replaceAll(":imagesdir:doc", ":imagesdir: doc")
    .replaceAll(":icon_dir:image", ":icon_dir: image")
    .replaceAll(
      "include::doc\\000_preface\\preface.adoc[]",
      "include::doc\\000_preface\\preface_en.adoc[]"
    )
    .replaceAll("doc.adoc[leveloffset=+1]", "doc_en.adoc[leveloffset=+1]")
    .replaceAll(
      ":title-page-background-image: image:./images/covers/title-bg_A5.png[]",
      "// :title-page-background-image: image:./images/covers/title-bg_A5.png[]"
    )
    .replaceAll(
      ":back-cover-image: image:./images/covers/back-cover_A5.pdf[]",
      "// :back-cover-image: image:./images/covers/back-cover_A5.pdf[]"
    )
    .replaceAll(
      "// :title-page-background-image: image:./images/covers/title-bgEN_A5.png[]",
      ":title-page-background-image: image:./images/covers/title-bgEN_A5.png[]"
    )
    .replaceAll(
      "// :back-cover-image: image:./images/covers/back-coverEN_A5.pdf[]",
      ":back-cover-image: image:./images/covers/back-coverEN_A5.pdf[]"
    )
    .replaceAll("<<_", "<<");

  return afterEditText;
}
