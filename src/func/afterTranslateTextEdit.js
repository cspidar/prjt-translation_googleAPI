// 번역된 텍스트 후보정
export function afterTranslateTextEdit(beforeEditText) {
  let afterEditText;

  // const plusSpaceAfterLetter = /(?<=\n\+ )[A-Za-z]/g;

  const headingLineNoBracket = /(?<==+.*(?<=\s|\/))\w*/g;
  beforeEditText = beforeEditText.replace(headingLineNoBracket, (p) =>
    p.toLowerCase()
  );

  const headingLetterAfterSpace = /(?<==+.*(?<=\s))[a-z]/g;
  beforeEditText = beforeEditText.replace(headingLetterAfterSpace, (p) =>
    p.toUpperCase()
  );

  //

  // 헤딩 단어 첫글자 대문자화에서 전치사 제외
  beforeEditText = beforeEditText
    .replaceAll(/. On /g, " on ")
    .replaceAll(/. And /g, " and ")
    .replaceAll(/. Or /g, " or ")
    .replaceAll(/. Of /g, " of ")
    .replaceAll(/. For /g, " for ")
    .replaceAll(/. Through /g, " through ");

  // title이 ordered list 로 변경되는 것 복구 (용어집 사용 단어가 타이틀이 될 경우 발생)
  const titleSpaceLetter = /(?<=\n\.) (?=[A-Za-z].*\n(\[|\*|image::))/g;
  beforeEditText = beforeEditText.replace(titleSpaceLetter, "");

  // 플러스 뒤 공백 -> 줄바꿈
  const plusSpaceLetter = /(?<=\n\+) (?=[A-Za-z])/g;
  beforeEditText = beforeEditText.replace(plusSpaceLetter, "\n");

  // 문장 첫글자 대문자화
  const firstLetter =
    /^[a-z]|(?<=\n)[a-z]|(?<=\n\.\s)[a-z]|(?<=\n\*\s)[a-z]|(?<=\n\-\s)[a-z]|(?<=\|\s)[a-z]|(?<=\|)[a-z]/g;
  beforeEditText = beforeEditText.replace(firstLetter, (p) => p.toUpperCase());

  beforeEditText = beforeEditText.replaceAll("‘", "`").replaceAll("’", "`");
  // beforeEditText = beforeEditText
  //   .replaceAll("‘‘‘‘", "''''")
  //   .replaceAll("‘‘‘", "'''")
  //   .replaceAll("’’’’", "''''")
  //   .replaceAll("’’’", "'''");

  afterEditText = beforeEditText

    // 문법
    .replaceAll("Image:", "image:")
    .replaceAll("Options=", "options=")
    .replaceAll("Width=", "width=")
    .replaceAll("Frame=", "frame=")
    .replaceAll("Grid=", "grid=")
    .replaceAll("Menu:", "menu:")
    .replaceAll("Include:", "include:")
    .replaceAll("Btn:", "btn:")
    .replaceAll(":imagesdir:doc", ":imagesdir: doc")
    .replaceAll(":icon_dir:image", ":icon_dir: image")
    .replaceAll("Grid=", "grid=")
    .replaceAll(
      "include::doc\\000_preface\\preface.adoc[]",
      "include::doc\\000_preface\\preface_en.adoc[]"
    )
    .replaceAll("<<_", "<<")
    .replaceAll("<< ", "<<")
    .replaceAll("[ ", "[")
    .replaceAll(" ]", "]")
    .replaceAll("( ", "(")
    .replaceAll(" )", ")")
    .replaceAll(`Options="header, Autowidth"`, `options="header, autowidth"`)
    .replaceAll(`Autowidth"`, `autowidth"`)

    // 용어집 관련
    /// 공백 후 마침표
    .replace(/[a-z] \./g, `.`)

    // 영문 번역
    .replaceAll(".adoc[leveloffset=+1]", "_en.adoc[leveloffset=+1]")
    .replaceAll(".png[", "_en.png[")
    .replaceAll(".pdf[", "_en.pdf[");

  return afterEditText;
}
