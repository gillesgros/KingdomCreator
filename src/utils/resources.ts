const IMAGE_PREFEX = "/img/cards";
const BOXES_IMAGE_PREFEX = "/img/boxes";
const RULE_PDF_PREFEX = "/rules";
const PNG_SET_IMAGES = new Set(["alchemy", "cornucopia", "guilds"]);

export function getCardImageUrlbyDir(cardId: string, lang="" ) {
  let fulimgstr = lang + "/" + cardId;
  let str_splitted = fulimgstr.split('/',2);
  let SetName = str_splitted[1].split('_',2);
  let cardName = str_splitted[1].replace(SetName[0]+'_','')
  /*
  console.log("getCardImageUrlbyDir : " + cardId)
  console.log(str_splitted)
  console.log(SetName)
  console.log(cardName)
  console.log(`${IMAGE_PREFEX}${str_splitted[0]}/${SetName[0]}/${cardName}.jpg`)
  */
  
  return (lang == "" ) 
    ? `${IMAGE_PREFEX}${str_splitted[0]}/${SetName[0]}/${str_splitted[1]}.jpg`
    : `${IMAGE_PREFEX}${str_splitted[0]}/${SetName[0]}/${cardName}.jpg`;
}


export function getSetImageUrl(setId: string, lang = "" ) {
  const ext = PNG_SET_IMAGES.has(setId) ? "png" : "jpg";
    return `${BOXES_IMAGE_PREFEX}${lang}/${setId}.${ext}`;
}

export function getRulebookUrl(setId: string, lang = "" ) {
  return `${RULE_PDF_PREFEX}${lang}/${setId}.pdf`;
}