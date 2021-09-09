// 번역된 텍스트 후보정
export function afterTranslateTextEdit(beforeEditText) {
  let afterEditText;
  // const headingSentence = new RegExp("^==.*");
  const headingLine = /(?<==+).*/g;
  const headingLetterAfterSpace = /(?<==+.*(?<=\s))[A-Za-z]/g;
  const headingLetterAfterBracket = /(?<==+.*(?<=\())[A-Za-z]/g;

  // const plusSpaceAfterLetter = /(?<=\n\+ )[A-Za-z]/g;
  const plusSpaceLetter = /(?<=\n\+) (?=[A-Za-z])/g;

  const firstLetter = /^.|(?<=\n)./g;

  beforeEditText = beforeEditText.replace(headingLine, (p) => p.toLowerCase());
  beforeEditText = beforeEditText.replace(headingLetterAfterSpace, (p) =>
    p.toUpperCase()
  );
  beforeEditText = beforeEditText.replace(headingLetterAfterBracket, (p) =>
    p.toUpperCase()
  );
  beforeEditText = beforeEditText
    .replaceAll(/\sOn\s/g, " on ")
    .replaceAll(/\sAnd\s/g, " and ")
    .replaceAll(/\sOr\s/g, " or ")
    .replaceAll(/\sOf\s/g, " of ")
    .replaceAll(/\sFor\s/g, " for ")
    .replaceAll(/\sThrough\s/g, " through ");

  beforeEditText = beforeEditText.replace(plusSpaceLetter, "\n");

  beforeEditText = beforeEditText.replace(firstLetter, (p) => p.toUpperCase());
  beforeEditText = beforeEditText
    .replaceAll("Image:", "image:")
    .replaceAll("Menu:", "menu:")
    .replaceAll("Btn:", "btn:");

  beforeEditText = beforeEditText.replaceAll("‘", "`").replaceAll("’", "`");
  // beforeEditText = beforeEditText
  //   .replaceAll("‘‘‘‘", "''''")
  //   .replaceAll("‘‘‘", "'''")
  //   .replaceAll("’’’’", "''''")
  //   .replaceAll("’’’", "'''");

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
