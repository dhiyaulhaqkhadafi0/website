// Advisory language hints only: never use a country or browser locale for access.
export const SUPPORTED_LANGUAGES = [
  ['id','Bahasa Indonesia'],['en','English'],['ar','العربية'],['zh-CN','简体中文'],['zh-TW','繁體中文'],
  ['ja','日本語'],['ko','한국어'],['es','Español'],['fr','Français'],['de','Deutsch'],['pt','Português'],
  ['it','Italiano'],['nl','Nederlands'],['ru','Русский'],['uk','Українська'],['pl','Polski'],['cs','Čeština'],
  ['sk','Slovenčina'],['sl','Slovenščina'],['ro','Română'],['hu','Magyar'],['el','Ελληνικά'],['bg','Български'],
  ['hr','Hrvatski'],['sr','Српски'],['sv','Svenska'],['da','Dansk'],['fi','Suomi'],['no','Norsk'],['is','Íslenska'],
  ['tr','Türkçe'],['he','עברית'],['fa','فارسی'],['hi','हिन्दी'],['bn','বাংলা'],['ur','اردو'],['pa','ਪੰਜਾਬੀ'],
  ['ta','தமிழ்'],['te','తెలుగు'],['mr','मराठी'],['gu','ગુજરાતી'],['kn','ಕನ್ನಡ'],['ml','മലയാളം'],['ne','नेपाली'],
  ['si','සිංහල'],['th','ไทย'],['vi','Tiếng Việt'],['ms','Bahasa Melayu'],['tl','Filipino'],['jv','Basa Jawa'],
  ['su','Basa Sunda'],['km','ភាសាខ្មែរ'],['lo','ລາວ'],['my','မြန်မာ'],['mn','Монгол'],['ka','ქართული'],
  ['hy','Հայերեն'],['az','Azərbaycan'],['kk','Қазақша'],['uz','Oʻzbek'],['ky','Кыргызча'],['tg','Тоҷикӣ'],
  ['sw','Kiswahili'],['af','Afrikaans'],['am','አማርኛ'],['ha','Hausa'],['ig','Igbo'],['yo','Yorùbá'],
  ['zu','isiZulu'],['xh','isiXhosa'],['so','Soomaali'],['st','Sesotho'],['sn','Shona'],['rw','Kinyarwanda'],
  ['mg','Malagasy'],['ny','Chichewa'],['mt','Malti'],['ga','Gaeilge'],['cy','Cymraeg'],['eu','Euskara'],
  ['ca','Català'],['gl','Galego'],['et','Eesti'],['lv','Latviešu'],['lt','Lietuvių'],['sq','Shqip'],['mk','Македонски'],
  ['bs','Bosanski'],['eo','Esperanto'],['ht','Kreyòl ayisyen'],['ps','پښتو'],['sd','سنڌي'],['ku','Kurdî'],
].map(([code,label]) => ({code,label}));
const supported = new Set(SUPPORTED_LANGUAGES.map(l => l.code));
const countryLanguages = {
  ID:'id',US:'en',GB:'en',AU:'en',NZ:'en',CA:'en',IE:'en',SG:'en',PH:'tl',MY:'ms',BN:'ms',
  JP:'ja',KR:'ko',CN:'zh-CN',TW:'zh-TW',HK:'zh-TW',MO:'zh-TW',DE:'de',AT:'de',CH:'de',
  FR:'fr',BE:'fr',LU:'fr',ES:'es',MX:'es',AR:'es',CL:'es',CO:'es',PE:'es',EC:'es',UY:'es',
  BO:'es',PY:'es',VE:'es',CR:'es',PA:'es',GT:'es',HN:'es',SV:'es',NI:'es',CU:'es',DO:'es',
  PT:'pt',BR:'pt',AO:'pt',MZ:'pt',IT:'it',NL:'nl',RU:'ru',UA:'uk',PL:'pl',CZ:'cs',SK:'sk',SI:'sl',
  RO:'ro',HU:'hu',GR:'el',CY:'el',BG:'bg',HR:'hr',RS:'sr',BA:'bs',SE:'sv',DK:'da',FI:'fi',NO:'no',IS:'is',
  TR:'tr',IL:'he',IR:'fa',IN:'hi',BD:'bn',PK:'ur',NP:'ne',LK:'si',TH:'th',VN:'vi',KH:'km',LA:'lo',MM:'my',
  MN:'mn',GE:'ka',AM:'hy',AZ:'az',KZ:'kk',UZ:'uz',KG:'ky',TJ:'tg',SA:'ar',AE:'ar',EG:'ar',MA:'ar',
  DZ:'ar',TN:'ar',JO:'ar',LB:'ar',IQ:'ar',KW:'ar',QA:'ar',BH:'ar',OM:'ar',YE:'ar',LY:'ar',SD:'ar',
  KE:'sw',TZ:'sw',ZA:'en',ET:'am',SO:'so',RW:'rw',HT:'ht',MG:'mg',MW:'ny',ZW:'sn',AL:'sq',MK:'mk',
  EE:'et',LV:'lv',LT:'lt',MT:'mt',AF:'ps',
};
/** @param {string} pathname */
export function isPublicTranslationPath(pathname) {
  return !/^\/(?:api|auth|account|studio|login|register|checkout)(?:\/|$)/.test(pathname);
}
/** @param {string | null} country @param {readonly string[]} languages */
export function suggestedLanguage(country, languages) {
  for (const locale of languages) {
    const lower=locale.toLowerCase(), base=lower.split('-')[0];
    const code=base==='zh' ? (/tw|hk|hant/.test(lower)?'zh-TW':'zh-CN') : base==='fil'?'tl':base==='nb'||base==='nn'?'no':base;
    if (code!=='id' && supported.has(code)) return code;
    if (code==='id') break; // Respect Indonesian first; country can still offer a local alternative.
  }
  return country ? countryLanguages[country.toUpperCase()] || 'en' : 'id';
}
