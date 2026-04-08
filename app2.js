// =====================================================
// app.js — Academic Planning Simulator (Dashboard)
// Updates included:
// 1) Adds FULL IT + CS course lists (with basic *simulated* prereq chains)
// 2) Adds SUBJECT list (your big list) for a separate Subject search bar
// 3) Adds Major search (type/pick) + optional Track/Concentration search
//    - Track search only works for: IT, Math, Biology, Psychology, Exercise & Health Sciences, Business/Management
// 4) Starts with EMPTY plan + NO major selected (user must select manually)
// 5) If user searches anything IT-related (major/subject/search text), show ALL IT courses in Add Courses
// 6) ✅ Exposes database globally as window.SS_DB so journey.html can use it
// =====================================================

(function () {

  // =====================================================
  // SUBJECT LIST (for Subject search bar datalist)
  // Format: "CODE | Name"
  // =====================================================
  const subjectCatalog = `AF | Accounting and Finance
AFRSTY | Africana Studies
AMST | American Studies
ANTH | Anthropology
ARABIC | Arabic
ART | Art
ASAMST | Asian American Studies
ASIAN | Asian Studies
ASP | Academic Support Programs
BC | Business Communications
BIOCHM | Biochemistry
BIOL | Biology
BUSADM | Business Administration
CAPS | Advancing and Professional Studies
CHEM | Chemistry
CHINSE | Chinese
CINE | Cinema Studies
CLSICS | Classics
COMM | Communication
COUNSL | Counseling
CRW | Critical Reading and Writing
CS | Computer Science
CSP | Counseling and School Psychology
DANCE | Dance
ECHD | Early Childhood Education
ECON | Economics
EDC U | Education Undergraduate
EHS | Exercise and Health Science
ENGIN | Engineering
ENGL | English
ENGLPL | English Placement
ENVSCI | Environmental Sciences
ENVSTY | Environmental Studies
ESL | English as a Second Language
FOUN | Student Support Programs Course
FRENCH | French
GERMAN | German
GERON | Gerontology Undergraduate
GLBAFF | Global Affairs
GREEK | Greek
HIST | History
HLTH | Health
HONORS | Honors
HUMAN | Humanities
HUMCTR | Human Services
INTR-D | Interdisciplinary Studies
IR | International Relations
IT | Information Technology
ITAL | Italian
JAPAN | Japanese
LABOR | Labor
LATAM | Latin American Studies
LATIN | Latin
LATSTY | Latino Studies
LING | Linguistics
MATH | Mathematics
MGT | Management
MKT | Marketing
MLLC | Modern Languages, Literatures and Cultures
MSIS | Management Science and Information Systems
MUSIC | Music
NAIS | Native American and Indigenous Studies
NAV | Navitas Study Skills
NURSNG | Nursing
PHIL | Philosophy
PHILLAW | Philosophy and Law
PHYSIC | Physics
POLSCI | Political Science
PORT | Portuguese
PRFTRN | Professional Training
PSYCH | Psychology
PUBHTH | Public Health
RELSTY | Study of Religion
RUSS | Russian
SCSM | Supply Chain and Service Management
SEMINR | Freshmen Seminar
FYS | First Year Seminars
IMS | Intermediate Seminars
SL | Sport Leadership
SOCIOL | Sociology
SPAN | Spanish
THRART | Theatre Arts
UPCD | Urban Planning and Community Development
USEA | University Sea-based Skills
VIET | Vietnamese
WGS | Women's, Gender & Sexuality Studies`;


  // =====================================================
  // MAJORS (demo list for major search bar)
  // NOTE: Start with NO selection; user must choose.
  // =====================================================
  const demoMajors = [
    {
  name: "Accelerated Nursing - BS Major",
  subject: "NURSNG",
  degree: "BS",
  minCredits: 120,
  creditCap: 16,
  roadmapFlat: [
    "SEMINR 126G", "BIOL 111", "ENGL 101", "MATH 115", "PHIL 100",
    "ENGL 102", "SOCIOL 101", "ART 100", "SPAN 101", "NURSNG 270",
    "AMST 101", "NURSNG 271", "NURSNG 272", "ENGL 135", "IMS 200",
    "MATH 125", "BIOL 207", "NURSNG 273", "NURSNG 370", "ECON 101",
    "SPAN 102", "BIOL 208", "NURSNG 371", "NURSNG 372", "POLSCI 102",
    "MUSIC 117", "NURSNG 373", "NURSNG 470", "ANTH 106", "ENVSCI 101",
    "IT 110", "NURSNG 471", "NURSNG 472", "CHEM 115", "DANCE 135",
    "CS 110", "NURSNG 473", "THRART 122", "CLSICS 161", "AFRSTY 101"
  ],
  major: [
    "NURSNG 270","NURSNG 271", "NURSNG 272", "NURSNG 273", "NURSNG 370", "NURSNG 371", "NURSNG 372",
    "NURSNG 373", "NURSNG 470", "NURSNG 471", "NURSNG 472", "NURSNG 473"
  ],

  core: [
    "SEMINR 126G", "IMS 200", "ENGL 101", "ENGL 102", "MATH 115" 
  ]
},

{
  name: "Accounting - BS Major",
  subject: "AF",
  degree: "BS",
  minCredits: 120,
  creditCap: 16,
  roadmapFlat: [
    "SEMINR 126G", "ENGL 101", "MATH 115", "ECON 101", "CS 119",
    "ENGL 102", "MSIS 110", "AF 210", "MSIS 301", "IT 110",
    "IMS 200", "IT 111L", "BC 230", "MATH 125", "AF 478",
    "AF 310", "AF 311", "AF 315", "MSIS 212", "BC 290",
    "AF 363", "AF 450", "AF 330", "MGT 303", "ENVSCI 101",
    "AF 470", "SOCIOL 101", "MSIS 310", "PHIL 100", "CLSICS 161",
    "PSYCH 100", "BIOL 101", "ANTH 256", "ITAL 101", "LATAM 100",
    "MGT 490", "AF 475", "AF 410", "AF 451", "THRART 122"
  ],

major: [
    "AF 210", "AF 310", "AF 311", "AF 315",
    "AF 478", "AF 310", "AF 311", "AF 315",
    "AF 363", "AF 450", "AF 330",  
    "AF 470", "AF 475", "AF 410", "AF 451"
  ],

  core: [
    "SEMINR 126G", "ENGL 101", "MATH 115", "MSIS 310",
    "ENGL 102", "BC 230", "ECON 101", "MSIS 212",
    "IMS 200", "BC 290", "MSIS 301", "MGT 303", "MGT 490",
  ]
},

{
  name: "Africana Studies – BA Major",
  subject: "AFRSTY",
  degree: "BA",
  minCredits: 120,
  creditCap: 16,
  roadmapFlat: [
    "SEMINR 126G", "AFRSTY 111", "ENGL 101", "MATH 115", "ART 100",
    "ENGL 102", "AFRSTY 101", "HIST 211", "PSYCH 100", "SPAN 101",
    "IMS 200", "POLSCI 230", "ECON 101", "BIOL 101", "MUSIC 117",
    "AFRSTY 210", "AFRSTY 220", "PHIL 100", "CHEM 111L", "IT 110",
    "AFRSTY 301", "AFRSTY 302", "SOCIOL 101", "CLSICS 161", "SPAN 102",
    "AFRSTY 303", "AFRSTY 304", "ANTH 106", "ENVSCI 101", "DANCE 135",
    "AFRSTY 305", "AFRSTY 401", "AFRSTY 410", "LATAM 101", "THRART 122",
    "AFRSTY 420", "AFRSTY 430", "AFRSTY 440", "MATH 125", "ANTH 256"
  ],

  major: [
    "AFRSTY 111", "AFRSTY 101", "AFRSTY 210", "AFRSTY 220",
    "AFRSTY 301", "AFRSTY 302", "AFRSTY 303", "AFRSTY 304",
    "AFRSTY 305", "AFRSTY 401", "AFRSTY 410",
    "AFRSTY 420", "AFRSTY 430", "AFRSTY 440"
  ],

  core: [
    "SEMINR 126G", "IMS 200", "ENGL 101", "ENGL 102"
  ]
},
  

{
  name: "Aging Studies – BA Major",
  subject: "GERON",
  degree: "BA",
  minCredits: 120,
  creditCap: 16,
  roadmapFlat: [
    "SEMINR 126G", "GERON 150", "ENGL 101", "MATH 115", "ART 100",
    "ENGL 102", "GERON 160", "HIST 211", "PSYCH 100", "SPAN 101",
    "IMS 200", "GERON 180", "ECON 101", "BIOL 101", "MUSIC 117",
    "GERON 250", "GERON 260", "PHIL 100", "CHEM 111L", "IT 110",
    "GERON 325", "GERON 342L", "SOCIOL 101", "CLSICS 161", "SPAN 102",
    "GERON 401", "GERON 170", "POLSCI 102", "ENVSCI 101", "DANCE 135",
    "GERON 190", "GERON 240", "AFRSTY 101", "LATAM 100", "THRART 122",
    "GERON 280", "GERON 350", "GERON 355", "MATH 125", "ANTH 256"
  ],

  major: [
    "GERON 150", "GERON 160", "GERON 180",
    "GERON 250", "GERON 260",
    "GERON 325", "GERON 342L",
    "GERON 401", "GERON 170",
    "GERON 190", "GERON 240",
    "GERON 280", "GERON 350", "GERON 355"
  ],

  core: [
    "SEMINR 126G",
    "IMS 200",
    "ENGL 101",
    "ENGL 102"
  ]
},

{
  name: "Anthropology – BA Major",
  subject: "ANTH",
  degree: "BA",
  minCredits: 120,
  creditCap: 16,
  roadmapFlat: [
    "SEMINR 126G", "ANTH 105", "ENGL 101", "MATH 115", "ART 100",
    "ENGL 102", "ANTH 106", "HIST 211", "PSYCH 100", "SPAN 101",
    "IMS 200", "ANTH 107", "ECON 101", "BIOL 101", "MUSIC 117",
    "ANTH 232", "ANTH 345", "PHIL 100", "CHEM 111L", "IT 110",
    "ANTH 317", "ANTH 272", "SOCIOL 101", "CLSICS 161", "SPAN 102",
    "ANTH 376", "ANTH 360", "POLSCI 102", "ENVSCI 101", "DANCE 135",
    "ANTH 270L", "ANTH 370", "AFRSTY 101", "LATAM 100", "THRART 122",
    "ANTH 425", "ANTH 410", "ANTH 420", "MATH 125", "ANTH 256"
  ],

  major: [
    "ANTH 105", "ANTH 106", "ANTH 107",
    "ANTH 232", "ANTH 345",
    "ANTH 317", "ANTH 272",
    "ANTH 376", "ANTH 360",
    "ANTH 270L", "ANTH 370",
    "ANTH 425", "ANTH 410", "ANTH 420",
    "ANTH 256"
  ],

  core: [
    "SEMINR 126G",
    "IMS 200",
    "ENGL 101",
    "ENGL 102"
  ]
},

{
  name: "Art – BA Major",
  subject: "ART",
  degree: "BA",
  minCredits: 120,
  creditCap: 16,
  roadmapFlat: [
    "SEMINR 126G", "ART 100", "ENGL 101", "MATH 115", "ECON 101",
    "ENGL 102", "ART 101", "ART 208", "BIOL 101", "SPAN 101",
    "IMS 200", "ART 102", "ART 281", "HIST 211", "IT 110",
    "ART 104L", "ART 300", "PHIL 100", "CHEM 111L", "PSYCH 100",
    "ART 305", "ART 320", "ART 380", "SOCIOL 101", "AFRSTY 101",
    "ART 330", "ART 350", "ART 390", "CLSICS 161", "LATAM 100",
    "ART 360", "ART 370", "ART 395", "ART 401", "THRART 122",
    "ART 481", "ART 492", "ART 410", "ART 420", "ENVSCI 101"
  ],

  major: [
    "ART 100", "ART 101", "ART 208", "ART 102", "ART 281",
    "ART 104L", "ART 300", "ART 305", "ART 320", "ART 380",
    "ART 330", "ART 350", "ART 390", "ART 360", "ART 370",
    "ART 395", "ART 401", "ART 481", "ART 492", "ART 410", "ART 420"
  ],

  core: [
    "SEMINR 126G",
    "IMS 200",
    "ENGL 101",
    "ENGL 102"
  ]
},

{
  name: "Biochemistry – BS Major",
  subject: "BIOCHM",
  degree: "BS",
  minCredits: 120,
  creditCap: 16,
  roadmapFlat: [
    "SEMINR 126G", "ART 100", "BIOL 111", "MATH 140", "ENGL 101",
    "SPAN 101", "MSIS 110", "BIOL 112", "ENGL 102", "CHEM 115",
    "IMS 200", "CHEM 251", "CHEM 255", "CHEM 117", "CHEM 116",
    "CHEM 252", "CHEM 256", "MATH 141", "BIOL 210", "CHEM 118",
    "CHEM 311", "CHEM 313", "BIOL 212", "POLSCI 202", "MATH 145",
    "PHYSIC 113", "PHYSIC 181", "BIOCHM 383", "POLSCI 102", "CLSICS 161",
    "PHYSIC 114", "PHYSIC 182", "BIOCHM 384", "BIOCHM 385", "HIST 175",
    "BIOCHM 386", "CHEM 312", "CHEM 354", "AFRSTY 101", "SOCIOL 101"
  ],

  major: [
    "CHEM 115", "CHEM 117", "CHEM 116", "CHEM 118",
    "CHEM 251", "CHEM 255", "CHEM 252", "CHEM 256",
    "CHEM 311", "CHEM 313", "CHEM 312", "CHEM 354",

    "BIOL 111", "BIOL 112", "BIOL 210", "BIOL 212",
    "BIOL 254", "BIOL 372",

    "BIOCHM 383", "BIOCHM 384", "BIOCHM 385", "BIOCHM 386"
  ],

  core: [
    "SEMINR 126G",
    "IMS 200","PHYSIC 113", "PHYSIC 181", "PHYSIC 114", "PHYSIC 182",
    "ENGL 101",
    "ENGL 102", "MATH 140", "MATH 141", "MATH 145"
  ]
},

{
  name: "Chemistry – BA Major",
  subject: "CHEM",
  degree: "BA",
  minCredits: 120,
  creditCap: 16,
  roadmapFlat: [
    "SEMINR 126G", "ART 100", "PHIL 100", "ENGL 101", "MATH 130",
    "SPAN 101", "MUSIC 117", "MATH 140", "ENGL 102", "CHEM 115",
    "IMS 200", "CHEM 251", "CHEM 255", "CHEM 117", "CHEM 116",
    "CHEM 252", "CHEM 256", "MATH 141", "HIST 211", "CHEM 118",
    "CHEM 311", "CHEM 313", "BIOL 101", "SOCIOL 101", "IT 110",
    "PHYSIC 113", "PHYSIC 181", "CHEM 312", "CHEM 314", "PHYSIC 182",
    "PHYSIC 114", "CHEM 187S", "CHEM 370", "CHEM 498", "CHEM 379",
    "CHEM 371", "CHEM 499", "CHEM 408", "AFRSTY 101", "LATAM 100"
  ],

  major: [
    "CHEM 115", "CHEM 117", "CHEM 116", "CHEM 118",
    "CHEM 251", "CHEM 255", "CHEM 252", "CHEM 256",
    "CHEM 311", "CHEM 313", "CHEM 312", "CHEM 314", "CHEM 187S",
    "CHEM 370", "CHEM 371", "CHEM 379", "CHEM 498", "CHEM 499", "CHEM 408",
    
  ],

  core: [
    "SEMINR 126G",
    "IMS 200",
    "ENGL 101",
    "ENGL 102", "MATH 140", "MATH 141", "PHYSIC 113", "PHYSIC 181", "PHYSIC 114", "PHYSIC 182"
  ]
},

{
  name: "Chemistry – BS Major",
  subject: "CHEM",
  degree: "BS",
  minCredits: 120,
  creditCap: 16,
  roadmapFlat: [
    "SEMINR 126G", "SPAN 101", "BIOL 111", "ENGL 101", "MATH 140",
    "HIST 175", "CHEM 118", "ART 100", "ENGL 102", "CHEM 115",
    "IMS 200", "CHEM 251", "MATH 141", "CHEM 116", "CHEM 117",
    "CHEM 252", "CHEM 256", "CHEM 255", "PHYSIC 113", "ENVSCI 101",
    "CHEM 311", "CHEM 313", "PHYSIC 114", "CHEM 314", "CHEM 354",
    "CHEM 312", "CHEM 369", "CHEM 370", "CHEM 371", "HIST 211",
    "CHEM 379", "CHEM 351", "PHYSIC 181", "CHEM 498", "MATH 242",
    "CHEM 408", "CHEM 499", "PHYSIC 182", "BIOL 210", "AFRSTY 101"
  ],

  major: [
    "CHEM 115", "CHEM 117", "CHEM 116", "CHEM 118",
    "CHEM 251", "CHEM 255", "CHEM 252", "CHEM 256",
    "CHEM 311", "CHEM 313", "CHEM 312", "CHEM 314",
    "CHEM 354", "CHEM 369", "CHEM 370", "CHEM 371",
    "CHEM 379", "CHEM 351", "CHEM 498",
    "CHEM 408", "CHEM 499",
,

  ],

  core: [
    "SEMINR 126G",
    "IMS 200",
    "ENGL 101",
    "ENGL 102", "MATH 140", "MATH 141",
    "PHYSIC 113", "PHYSIC 181", "PHYSIC 114", "PHYSIC 182"
  ]
},

    {
  name: "Classical Languages – BA Major",
  subject: "CLSICS",
  degree: "BA",
  minCredits: 120,
  creditCap: 16,
  roadmapFlat: [
    "SEMINR 126G", "GREEK 101", "ENGL 101", "MATH 115", "PSYCH 100",
    "GREEK 102", "ENGL 102", "HIST 211", "BIOL 101", "ART 100",
    "IMS 200", "LATIN 101", "ECON 101", "CHEM 111L", "IT 110",
    "LATIN 102", "PHIL 100", "SOCIOL 101", "SPAN 101", "ENVSCI 101",
    "GREEK 201", "LATIN 201", "CLSICS 161", "POLSCI 102", "MUSIC 117",
    "GREEK 202", "LATIN 202", "ANTH 106", "AFRSTY 101", "LATAM 100",
    "GREEK 301", "LATIN 301", "CLSICS 387", "THRART 122", "DANCE 135",
    "GREEK 302", "LATIN 302", "CLSICS 388", "MATH 125", "ANTH 256"
  ],

  major: [
    "GREEK 101", "GREEK 102", "GREEK 201", "GREEK 202", "GREEK 301", "GREEK 302",
    "LATIN 101", "LATIN 102", "LATIN 201", "LATIN 202", "LATIN 301", "LATIN 302",
    "CLSICS 161", "CLSICS 387", "CLSICS 388"
  ],

  core: [
    "SEMINR 126G",
    "IMS 200",
    "ENGL 101",
    "ENGL 102"
  ]
},
    {
  name: "Classical Studies – BA Major",
  subject: "CLSICS",
  degree: "BA",
  minCredits: 120,
  creditCap: 16,
  roadmapFlat: [
    // Freshman Fall (16)
    "SEMINR 126G", "ENGL 101", "MATH 115", "GREEK 101", "ART 100",
    // Freshman Spring (15)
    "ENGL 102", "GREEK 102", "HIST 211", "BIOL 101", "PSYCH 100",
    // Sophomore Fall (16)
    "IMS 200", "CLSICS 161", "PHIL 100", "ECON 101", "IT 110",
    // Sophomore Spring (15)
    "CLSICS 301", "CLSICS 320", "LATIN 101", "CHEM 111L", "SOCIOL 101",
    // Junior Fall (15)
    "CLSICS 330", "CLSICS 350", "POLSCI 102", "AFRSTY 101", "LATAM 100",
    // Junior Spring (15)
    "CLSICS 360", "CLSICS 387", "ANTH 106", "MUSIC 117", "ENVSCI 101",
    // Senior Fall (15)
    "CLSICS 370", "CLSICS 388", "THRART 122", "DANCE 135", "MATH 125",
    // Senior Spring (15)
    "CLSICS 284", "LATIN 102", "HIST 371", "ART 101", "ANTH 256"
  ],

  major: [
    "GREEK 101", "GREEK 102",
    "LATIN 101", "LATIN 102",
    "CLSICS 161", "CLSICS 301", "CLSICS 320",
    "CLSICS 330", "CLSICS 350",
    "CLSICS 360", "CLSICS 387",
    "CLSICS 370", "CLSICS 388",
    "CLSICS 284"
  ],

  core: [
    "SEMINR 126G",
    "IMS 200",
    "ENGL 101",
    "ENGL 102", "MATH 115"
  ]
},
    {
  name: "Communication – BA Major",
  subject: "COMM",
  degree: "BA",
  minCredits: 120,
  creditCap: 16,
  roadmapFlat: [
    // Freshman Fall (16)
    "SEMINR 126G", "COMM 100", "ENGL 101", "MATH 115", "PSYCH 100",
    // Freshman Spring (15)
    "ENGL 102", "COMM 105", "COMM 200", "BIOL 101", "SPAN 101",
    // Sophomore Fall (16)
    "IMS 200", "COMM 230", "HIST 211", "IT 110", "ART 100",
    // Sophomore Spring (15)
    "COMM 240", "COMM 270", "PHIL 100", "CHEM 111L", "ECON 101",
    // Junior Fall (15)
    "COMM 325", "COMM 351", "SOCIOL 101", "AFRSTY 101", "CLSICS 161",
    // Junior Spring (15)
    "COMM 300", "COMM 305", "PSYCH 230", "LATAM 100", "MUSIC 117",
    // Senior Fall (15)
    "COMM 315", "COMM 340", "ENGL 340", "THRART 122", "ENVSCI 101",
    // Senior Spring (15)
    "COMM 350", "COMM 480", "WGS 220", "SPAN 102", "ANTH 256"
  ],

  major: [
    "COMM 100", "COMM 105", "COMM 200", "COMM 230",
    "COMM 240", "COMM 270", "COMM 325", "COMM 351",
    "COMM 300", "COMM 305", "COMM 315", "COMM 340",
    "COMM 350", "COMM 480"
  ],

  core: [
    "SEMINR 126G",
    "IMS 200",
    "ENGL 101",
    "ENGL 102", "MATH 115"
  ]
},
    {
  name: "Community Studies – BA Major",
  subject: "UPCD",
  degree: "BA",
  minCredits: 120,
  creditCap: 16,
  roadmapFlat: [
    // Freshman Fall (16)
    "SEMINR 126G", "ENGL 101", "MATH 115", "PCSCOR 200", "ART 100",
    // Freshman Spring (15)
    "ENGL 102", "PCSCOR 220", "CSTCTR 225", "PSYCH 100", "BIOL 101",
    // Sophomore Fall (16)
    "IMS 200", "CSTCTR 250", "PCSCOR 325", "HIST 211", "IT 110",
    // Sophomore Spring (16)
    "PCSCOR 350", "PCSCOR 370", "HUMCTR 371", "CHEM 111L", "SPAN 101",
    // Junior Fall (15)
    "CSTCTR 300", "CSTCTR 325", "SOCIOL 101", "PHIL 100", "ECON 101",
    // Junior Spring (15)
    "CSTCTR 330", "CSTCTR 335", "CSTCTR 370", "AFRSTY 101", "LATAM 100",
    // Senior Fall (15)
    "CSTCTR 400", "CSTCTR 430", "ANTH 256", "THRART 122", "GREEK 101",
    // Senior Spring (15)
    "CSTCTR 490", "ENVSCI 101", "MUSIC 117", "CLSICS 161", "SPAN 102"
  ],

  major: [
    "PCSCOR 200", "PCSCOR 220", "PCSCOR 325", "PCSCOR 350", "PCSCOR 370",
    "CSTCTR 225", "CSTCTR 250", "CSTCTR 300", "CSTCTR 325", "CSTCTR 330",
    "CSTCTR 335", "CSTCTR 370", "CSTCTR 400", "CSTCTR 430", "CSTCTR 490",
    "HUMCTR 371"
  ],

  core: [
    "SEMINR 126G",
    "IMS 200",
    "ENGL 101",
    "ENGL 102", "MATH 115"
  ]
},
   {  name: "Computer Engineering – BS",
      subject: "ENGIN",
      degree: "BS",
      minCredits: 120,
      creditCap: 16,
      roadmapFlat: [
    // Freshman Fall (16)
    "SEMINR 126G", "MATH 140", "ENGIN 104", "ART 100", "CS 109",
    // Freshman Spring (15)
    "ENGL 101", "MATH 141", "CS 110", "PHYSIC 113", "ENGIN 187S",
    // Sophomore Fall (16)
    "IMS 200", "CS 210", "MATH 242", "ENGIN 231", "ENGIN 211L",
    // Sophomore Spring (15)
    "ENGIN 271", "ENGIN 232", "CS 220", "PHYSIC 114", "PHYSIC 182",
    // Junior Fall (16)
    "ENGIN 272", "ENGIN 241", "CS 240", "MATH 260", "ENGL 102",
    // Junior Spring (15)
    "ENGIN 246", "ENGIN 365", "CS 310", "ENGIN 321", "ENGIN 322",
    // Senior Fall (15)
    "ENGIN 341", "ENGIN 342", "ENGIN 346", "ENGIN 441", "CS 420",
    // Senior Spring (16)
    "ENGIN 448", "ENGIN 442", "ENGIN 491", "ENGIN 492", "SPAN 101"
  ],

  major: [
    "CS 109", "CS 110", "CS 210", "CS 220", "CS 240", "CS 310", "CS 420",

    "ENGIN 104", "ENGIN 187S", "ENGIN 231", "ENGIN 211L",
    "ENGIN 271", "ENGIN 232", "ENGIN 272", "ENGIN 241",
    "ENGIN 246", "ENGIN 365", "ENGIN 321", "ENGIN 322",
    "ENGIN 341", "ENGIN 342", "ENGIN 346", "ENGIN 441",
    "ENGIN 448", "ENGIN 442", "ENGIN 491", "ENGIN 492",
  ],

  core: [
    "SEMINR 126G",
    "IMS 200",
    "ENGL 101",
    "ENGL 102", 
  "MATH 140", "MATH 141", "MATH 242",
  "MATH 260", "ENGIN 211L", "CS 220", "PHYSIC 113", "PHYSIC 114", "PHYSIC 182"
  ]
},
    {
  name: "Computer Science - BA Major",
  subject: "CS",
  degree: "BA",
  minCredits: 120,
  creditCap: 16,
  roadmapFlat: [
    // Freshman Fall (16)
    "SEMINR 126G", "CS 110", "ENGL 101", "MATH 140", "CS 187SL",
    // Freshman Spring (15)
    "ENGL 102", "CS 210", "CS 220", "MATH 141", "CS 188SL",
    // Sophomore Fall (16)
    "IMS 200", "CS 240", "CS 430", "IT 110", "HIST 211",
    // Sophomore Spring (16)
    "MATH 260", "CS 310", "PHIL 100", "BIOL 101", "SPAN 101",
    // Junior Fall (15)
    "CS 341", "CS 420", "ECON 101", "SOCIOL 101", "CHEM 111L",
    // Junior Spring (15)
    "CS 450", "CS 410", "MATH 345", "AFRSTY 101", "LATAM 100",
    // Senior Fall (16)
    "CS 444", "CS 285L", "ENVSCI 101", "CLSICS 161", "SPAN 102",
    // Senior Spring (15)
    "ANTH 256", "POLSCI 102", "THRART 122", "DANCE 135", "ART 101"
  ],

  major: [
    "CS 110", "CS 187SL", "CS 210", "CS 220", "CS 188SL",
    "CS 240", "CS 430", "CS 310", "CS 341", "CS 420",
    "CS 450", "CS 410", "CS 444", "CS 285L"
  ],

  core: [
    "SEMINR 126G",
    "IMS 200",
    "ENGL 101",
    "ENGL 102",
    "MATH 140",
    "MATH 141",
    "MATH 260",
    "MATH 345"
  ]
},

    {
      name: "Computer Science - BS Major",
      subject: "CS",
      degree: "BS",
      minCredits: 120,
      creditCap: 16,
      roadmapFlat: [
    // Freshman Fall
    "SEMINR 126G", "CS 110", "MATH 140", "ENGL 101", "CS 187SL",
    // Freshman Spring
    "ENGL 102", "CS 210", "MATH 141", "PHYSIC 113", "CS 188SL",
    // Sophomore Fall
    "IMS 200", "CS 220", "CS 240", "MATH 260", "CS 119",
    // Sophomore Spring
    "CS 310", "CS 341", "PHYSIC 114", "PHYSIC 181", "CHEM 111L",
    // Junior Fall
    "PHYSIC 182", "MATH 345", "CS 420", "CS 444", "PHIL 100",
    // Junior Spring
    "CS 446", "CS 449", "CS 451", "CS 415", "SOCIOL 101",
    // Senior Fall
    "CS 410", "CS 443", "CS 413", "CS 430", "HIST 211",
    // Senior Spring
    "AFRSTY 101", "LATAM 100", "CLSICS 161", "ANTH 256", "SPAN 101"
  ],

  major: [
    "CS 110", "CS 187SL", "CS 210", "CS 188SL", "CS 220", "CS 240",
    "CS 119", "CS 310", "CS 341", "CS 420", "CS 444",
    "CS 446", "CS 449", "CS 451", "CS 415",
    "CS 410", "CS 443", "CS 413", "CS 430"
  ],

  core: [
    "SEMINR 126G",
    "IMS 200",
    "ENGL 101",
    "ENGL 102", "MATH 140", "MATH 141", "MATH 260", "MATH 345"
  ]
},

    {
  name: "Criminology and Criminal Justice – BA Major",
  subject: "CRIM",
  degree: "BA",
  minCredits: 120,
  creditCap: 16,
  roadmapFlat: [
    // Freshman Fall (16)
    "SEMINR 126G", "ENGL 101", "MATH 115", "SOCIOL 101", "ART 100",
    // Freshman Spring (16)
    "ENGL 102", "SOCIOL 104", "SOCIOL 202", "PSYCH 100", "SPAN 101",
    // Sophomore Fall (16)
    "IMS 200", "SOCIOL 262", "SOCIOL 350", "HIST 211", "IT 110",
    // Sophomore Spring (16)
    "SOCIOL 316", "SOCIOL 337", "CHEM 111L", "PHIL 100", "SPAN 102",
    // Junior Fall (16)
    "SOCIOL 460", "SOCIOL 338", "ECON 101", "AFRSTY 101", "CS 187SL",
    // Junior Spring (16)
    "SOCIOL 461", "SOCIOL 363", "SOCIOL 352", "LATAM 100", "CS 188SL",
    // Senior Fall (15)
    "SOCIOL 474", "ANTH 256", "ENVSCI 101", "THRART 122", "POLSCI 102",
    // Senior Spring (15)
    "BIOL 101", "MUSIC 117", "DANCE 135", "CLSICS 161", "GREEK 101"
  ],

  major: [
    "SOCIOL 101",
    "SOCIOL 104",
    "SOCIOL 202",
    "SOCIOL 262",
    "SOCIOL 350",
    "SOCIOL 316",
    "SOCIOL 337",
    "SOCIOL 460",
    "SOCIOL 338",
    "SOCIOL 461",
    "SOCIOL 363",
    "SOCIOL 352",
    "SOCIOL 474"
  ],

  core: [
    "SEMINR 126G",
    "IMS 200",
    "ENGL 101",
    "ENGL 102", "MATH 115"
  ]
},

    {
      name: "Economics - BA Major",
      subject: "ECON",
      degree: "BA",
      minCredits: 120,
      creditCap: 16,
      roadmapFlat: [
    // Freshman Fall (16)
    "SEMINR 126G", "ECON 101", "ENGL 101", "MATH 115", "ART 100",
    // Freshman Spring (16)
    "ECON 102", "ENGL 102", "IT 111L", "MATH 125", "SPAN 101",
    // Sophomore Fall (16)
    "IMS 200", "ECON 201", "MATH 140", "HIST 211", "IT 110",
    // Sophomore Spring (15)
    "ECON 202", "ECON 214GL", "PHIL 100", "BIOL 101", "CHEM 111L",
    // Junior Fall (15)
    "ECON 308", "ECON 318", "SOCIOL 101", "AFRSTY 101", "LATAM 100",
    // Junior Spring (15)
    "ECON 327", "ECON 335", "POLSCI 102", "ENVSCI 101", "CLSICS 161",
    // Senior Fall (15)
    "ECON 420", "ANTH 256", "MUSIC 117", "DANCE 135", "THRART 122",
    // Senior Spring (15)
    "CS 187SL", "CS 188SL", "SPAN 102", "ENGL 135", "PSYCH 100"
  ],

  major: [
    "ECON 101",
    "ECON 102",
    "ECON 201",
    "ECON 202",
    "ECON 214GL",
    "ECON 308",
    "ECON 318",
    "ECON 327",
    "ECON 335",
    "ECON 420"
  ],

  core: [
    "SEMINR 126G",
    "IMS 200",
    "ENGL 101",
    "ENGL 102", "MATH 115"
  ]
},
    {
  name: "Electrical Engineering – BS",
  subject: "ENGIN",
  degree: "BS",
  minCredits: 120,
  creditCap: 16,
  roadmapFlat: [
    // Freshman Fall (16)
    "SEMINR 126G", "MATH 140", "ENGIN 104", "ENGL 101", "ART 100",
    // Freshman Spring (16)
    "MATH 141", "PHYSIC 113", "ENGIN 231", "CS 110", "ENGL 102",
    // Sophomore Fall (16)
    "IMS 200", "MATH 242", "PHYSIC 181", "ENGIN 211L", "ENGIN 232",
    // Sophomore Spring (15)
    "MATH 260", "MATH 270", "ENGIN 271", "IT 110", "ENGIN 272",
    // Junior Fall (15)
    "PHYSIC 114", "ENGIN 322", "CS 240", "ENGIN 241", "PHIL 100",
    // Junior Spring (15)
    "ENGIN 365", "ENGIN 366", "ENGIN 321", "PHYSIC 182", "SOCIOL 101",
    // Senior Fall (15)
    "ENGIN 331", "ENGIN 342", "ENGIN 351", "ENGIN 344", "ENGIN 491",
    // Senior Spring (15)
    "AFRSTY 101", "ENGIN 492", "ENGIN 435", "ENGIN 471", "ENGIN 353"
  ],

  major: [
    "ENGIN 104", "ENGIN 231", "ENGIN 211L",
    "ENGIN 271", "ENGIN 232", "ENGIN 272", "ENGIN 241",
    "ENGIN 365", "ENGIN 366", "ENGIN 321", "ENGIN 322",
    "ENGIN 331", "ENGIN 342", "ENGIN 351", "ENGIN 344",
    "ENGIN 491", "ENGIN 492", "ENGIN 435", "ENGIN 471", "ENGIN 353"
  ],

  core: [
    "SEMINR 126G",
    "IMS 200",
    "ENGL 101",
    "ENGL 102",
    "MATH 140", "MATH 141", "MATH 242", "MATH 260", "MATH 270",
    "PHYSIC 113", "PHYSIC 181", "PHYSIC 114", "PHYSIC 182",
    "CS 110", "CS 240"
  ]
},
    {
  name: "Entrepreneurship - BS Major",
  subject: "BUSADM",
  degree: "BS",
  minCredits: 120,
  creditCap: 16,
  roadmapFlat: [
    // Freshman Fall (16)
    "SEMINR 126G", "ENGL 101", "MATH 115", "MSIS 110", "ART 100",
    // Freshman Spring (16)
    "ENGL 102", "ECON 101", "AF 210", "BC 290", "SPAN 101",
    // Sophomore Fall (16)
    "IMS 200", "IT 111L", "AF 211", "MKT 301", "HIST 211",
    // Sophomore Spring (15)
    "AF 301", "MSIS 212", "MGT 303", "PHIL 100", "BIOL 101",
    // Junior Fall (15)
    "MSIS 301", "MGT 330", "MGT 331", "SOCIOL 101", "CHEM 111L",
    // Junior Spring (15)
    "MGT 470", "MKT 465", "MGT 350", "AFRSTY 101", "LATAM 100",
    // Senior Fall (15)
    "MGT 434", "MGT 490", "POLSCI 102", "ENVSCI 101", "CLSICS 161",
    // Senior Spring (15)
    "ANTH 256", "MUSIC 117", "DANCE 135", "THRART 122", "IT 110"
  ],

  major: [
    "MSIS 110", "MSIS 212", "MSIS 301",
    "MKT 301", "MKT 465",
    "MGT 303", "MGT 330", "MGT 331", "MGT 470", "MGT 350", "MGT 434", "MGT 490"
  ],

  core: [
    "SEMINR 126G",
    "IMS 200",
    "ENGL 101",
    "ENGL 102",
    "MATH 115", "AF 210", "AF 211",
    "BC 290"
  ]
},

{
  name: "Environmental Studies and Sustainability - BA Major",
  subject: "ENVSTY",
  degree: "BA",
  minCredits: 120,
  creditCap: 16,

  roadmapFlat: [
    "SEMINR 126G","ENVSCI 120","ENGL 101","MATH 115","ART 100",
    "ENGL 102","ENVSCI 121","PSYCH 100","SPAN 101","BIOL 101",
    "IMS 200","ENVSCI 122","POLSCI 203","IT 110","HIST 211",
    "ENVSCI 260","PHIL 220","ENVSTY 230","SPAN 102","CHEM 111L",
    "ENVSCI 261","ENVSTY 210","ECON 345L","ENVSCI 270","AFRSTY 101",
    "ENVSTY 310","ENVSTY 331","ANTH 263","CLSICS 161","LATAM 101",
    "ENVSTY 410","ENVSCI 476","UPCD 201","COMM 340","THRART 122",
    "MATH 125","SOCIOL 301","ENVSTY 320","MUSIC 117","ANTH 256"
  ],
      major: [
    "ENVSCI 120",
    "ENVSCI 121",
    "ENVSCI 122",
    "ENVSCI 260",
    "ENVSCI 261",
    "ENVSCI 270",
    "ENVSCI 476",

    "ENVSTY 230",
    "ENVSTY 210",
    "ENVSTY 310",
    "ENVSTY 331",
    "ENVSTY 410",
    "ENVSTY 320"
  ],

  core: [
    "SEMINR 126G",
    "IMS 200",
    "ENGL 101",
    "ENGL 102",
    "MATH 115",
    "MATH 125",
    "ECON 345L"
  ]
},


{
  name: "Exercise and Health Sciences - BS Major",
  subject: "EHS",
  degree: "BS",
  minCredits: 120,
  creditCap: 16,

  roadmapFlat: [
    // Freshman Fall (16)
    "SEMINR 126G", "ENGL 101", "MATH 115", "BIOL 101", "ART 100",
    // Freshman Spring (15)
    "ENGL 102", "EHS 120", "EHS 160", "MATH 125", "CHEM 111L",
    // Sophomore Fall (16)
    "IMS 200", "BIOL 207", "EHS 230", "HIST 211", "IT 110",
    // Sophomore Spring (15)
    "BIOL 208", "EHS 260", "PHIL 100", "SOCIOL 101", "AFRSTY 101",
    // Junior Fall (16)
    "EHS 300", "EHS 310", "POLSCI 102", "CLSICS 161", "ENVSCI 101",
    // Junior Spring (15)
    "EHS 345", "EHS 370", "ECON 101", "LATAM 101", "THRART 122",
    // Senior Fall (15)
    "EHS 385", "EHS 320", "EHS 286", "ANTH 106", "MUSIC 117",
    // Senior Spring (15)
    "EHS 491", "EHS 400", "PSYCH 100", "BIOL 111"
  ],

  major: [
    "EHS 120","EHS 160","EHS 230","EHS 260",
    "EHS 300","EHS 310","EHS 345","EHS 370",
    "EHS 385","EHS 320","EHS 286","EHS 491","EHS 400"
  ],

  core: [
    "SEMINR 126G",
    "IMS 200",
    "ENGL 101",
    "ENGL 102",

    "MATH 115",
    "MATH 125",

    "BIOL 101",
    "BIOL 207",
    "BIOL 208",
    "BIOL 111"
  ]
},



    {
  name: "Finance - BS Major",
  subject: "AF",
  degree: "BS",
  minCredits: 120,
  creditCap: 16,
  roadmapFlat: [
    // Freshman Fall (16)
    "SEMINR 126G", "ENGL 101", "MATH 115", "ECON 101", "ART 100",
    // Freshman Spring (16)
    "ENGL 102", "MSIS 110", "AF 210", "IT 110", "SPAN 101",
    // Sophomore Fall (16)
    "IMS 200", "IT 111L", "AF 211", "HIST 211", "BC 290",
    // Sophomore Spring (15)
    "AF 301", "MSIS 212", "MGT 303", "PHIL 100", "BIOL 101",
    // Junior Fall (15)
    "MGT 330", "MGT 331", "MKT 301", "AF 325", "SOCIOL 101",
    // Junior Spring (15)
    "MSIS 301", "AF 335", "AF 405", "AFRSTY 101", "LATAM 101",
    // Senior Fall (15)
    "AF 426", "AF 495", "POLSCI 102", "ENVSCI 101", "CLSICS 161",
    // Senior Spring (15)
    "MGT 490", "THRART 122", "DANCE 135", "MUSIC 117", "ANTH 256"
  ],

  major: [
    "AF 210", "AF 211", "AF 301", "AF 325", "AF 335", "AF 405", "AF 426", "AF 495",
    "MGT 303", "MGT 330", "MGT 331", "MGT 490",
    "MKT 301"
  ],

  core: [
    "SEMINR 126G",
    "IMS 200",
    "ENGL 101",
    "ENGL 102",
    "MATH 115",
    "BC 290"
  ]
},


   {
      name: "Marketing Major - BS Major",
      subject: "MKT",
      degree: "BS",
      minCredits: 120,
      creditCap: 16,
      roadmapFlat: [
    // Freshman Fall (15)
    "SEMINR 126G", "ENGL 101", "MATH 115", "ECON 101", "ART 100",
    // Freshman Spring (15)
    "ENGL 102", "MSIS 110", "AF 210", "HIST 211", "SPAN 101",
    // Sophomore Fall (16)
    "IMS 200", "IT 111L", "AF 211", "CHEM 111L", "BC 290",
    // Sophomore Spring (15)
    "AF 301", "MSIS 212", "MGT 303", "PHIL 100", "BIOL 101",
    // Junior Fall (15)
    "MGT 330", "MGT 331", "MSIS 301", "MKT 310", "MKT 301",
    // Junior Spring (15)
    "MKT 403", "MKT 405", "PSYCH 100", "IT 110", "AFRSTY 101",
    // Senior Fall (15)
    "MKT 407", "MKT 425", "POLSCI 102", "CLSICS 161", "ENVSCI 101",
    // Senior Spring (16)
    "MGT 490", "ANTH 256", "LATAM 101", "THRART 122", "SPAN 102"
  ],

  major: [
    "AF 210","AF 211","AF 301",
    "MKT 301","MKT 310","MKT 403","MKT 405","MKT 407","MKT 425",
    "MGT 303","MGT 330","MGT 331","MGT 490"
  ],

  core: [
    "SEMINR 126G",
    "IMS 200",
    "ENGL 101",
    "ENGL 102",
    "MATH 115",
    "BC 290"
  ]
},

{
  name: "French - BA Major",
  subject: "FRENCH",
  degree: "BA",
  minCredits: 120,
  creditCap: 16,
  roadmapFlat: [
    // Freshman Fall (16)
    "SEMINR 126G", "ENGL 101", "MATH 115", "PSYCH 100", "ART 100",
    // Freshman Spring (16)
    "ENGL 102", "FRENCH 101", "ECON 101", "BIOL 101", "IT 110",
    // Sophomore Fall (16)
    "IMS 200", "HIST 211", "MATH 125", "CHEM 111L", "FRENCH 102",
    // Sophomore Spring (16)
    "FRENCH 201", "SOCIOL 101", "AFRSTY 101", "ENVSCI 101", "THRART 122",
    // Junior Fall (16)
    "FRENCH 202", "POLSCI 102", "CLSICS 161", "PHIL 100", "FRENCH 345L",
    // Junior Spring (16)
    "MUSIC 117", "FRENCH 301", "ANTH 106", "FRENCH 374L", "MUSIC 117",
    // Senior Fall (15)
    "FRENCH 377L", "FRENCH 303", "FRENCH 411", "DANCE 135", "FRENCH 360",
    // Senior Spring (15)
    "FRENCH 440", "LATAM 101", "FRENCH 465", "FRENCH 498", "FRENCH 499"
  ],

  major: [
    "FRENCH 101", "FRENCH 102", "FRENCH 201", "FRENCH 202",
    "FRENCH 301", "FRENCH 345L", "FRENCH 303", "FRENCH 411",
    "FRENCH 374L", "FRENCH 360", "FRENCH 440", "FRENCH 377L",
    "FRENCH 465", "FRENCH 498", "FRENCH 499"
  ],

  core: [
    "SEMINR 126G",
    "IMS 200",
    "ENGL 101",
    "ENGL 102",
    "MATH 115"
  ]
},


{
  name: "History - BA Major",
  subject: "HIST",
  degree: "BA",
  minCredits: 120,
  creditCap: 16,
  roadmapFlat: [
    // Freshman Fall (16)
    "SEMINR 126G", "HIST 101", "ENGL 101", "MATH 115", "ART 100",
    // Freshman Spring (16)
    "ENGL 102", "HIST 150", "PSYCH 100", "BIOL 101", "SOCIOL 101",
    // Sophomore Fall (16)
    "IMS 200", "HIST 211", "PHIL 100", "CHEM 111L", "IT 110",
    // Sophomore Spring (15)
    "HIST 152", "HIST 214", "ECON 101", "AFRSTY 101", "ENVSCI 101",
    // Junior Fall (15)
    "HIST 302L", "HIST 304", "SPAN 101", "CLSICS 161", "LATAM 101",
    // Junior Spring (15)
    "HIST 305", "HIST 115L", "POLSCI 102", "THRART 122", "DANCE 135",
    // Senior Fall (15)
    "HIST 481", "HIST 413", "HIST 255L", "MUSIC 117", "ANTH 256",
    // Senior Spring (15)
    "ENGL 135", "MATH 125", "HIST 371", "SPAN 102", "ART 101"
  ],

  major: [
    "HIST 101", "HIST 150", "HIST 211", "HIST 152", "HIST 214",
    "HIST 302L", "HIST 304", "HIST 305", "HIST 115L",
    "HIST 481", "HIST 413", "HIST 255L", "HIST 371"
  ],

  core: [
    "SEMINR 126G",
    "IMS 200",
    "ENGL 101",
    "ENGL 102",
    "MATH 115",
  ]
},


 {
  name: "Human Services - BA Major",
  subject: "HUMCTR",
  degree: "BA",
  minCredits: 120,
  creditCap: 16,
  roadmapFlat: [
    // Freshman Fall (15)
    "SEMINR 126G", "ENGL 101", "MATH 115", "PSYCH 100", "ART 100",
    // Freshman Spring (16)
    "ENGL 102", "HUMCTR 220", "ECON 101", "BIOL 101", "SPAN 101",
    // Sophomore Fall (15)
    "IMS 200", "HUMCTR 230", "HIST 211", "IT 110", "CHEM 111L",
    // Sophomore Spring (15)
    "HUMCTR 320", "HUMCTR 322", "PHIL 100", "AFRSTY 101", "ENVSCI 101",
    // Junior Fall (16)
    "HUMCTR 330", "HUMCTR 345", "SOCIOL 101", "POLSCI 102", "SPAN 102",
    // Junior Spring (15)
    "HUMCTR 401", "HUMCTR 420", "CLSICS 161", "LATAM 101", "THRART 122",
    // Senior Fall (15)
    "HUMCTR 425", "HUMCTR 421", "ANTH 256", "MUSIC 117", "DANCE 135",
    // Senior Spring (16)
    "ENGL 135", "MATH 125", "CS 105", "ART 101", "ITAL 101"
  ],

  major: [
    "HUMCTR 220",
    "HUMCTR 230",
    "HUMCTR 320",
    "HUMCTR 322",
    "HUMCTR 330",
    "HUMCTR 345",
    "HUMCTR 401",
    "HUMCTR 420",
    "HUMCTR 425",
    "HUMCTR 421"
  ],

  core: [
    "SEMINR 126G",
    "IMS 200",
    "ENGL 101",
    "ENGL 102",
    "MATH 115",
  ]
},

{
  name: "Information Systems & Business Analytics – BS Major",
  subject: "IT",
  degree: "BS",
  minCredits: 120,
  creditCap: 16,
  roadmapFlat: [
    // Freshman Fall (16)
    "SEMINR 126G", "ENGL 101", "MATH 115", "ECON 101", "ART 100",
    // Freshman Spring (16)
    "ENGL 102", "IT 110", "AF 210", "BC 290", "SPAN 101",
    // Sophomore Fall (16)
    "IMS 200", "IT 111L", "AF 211", "MGT 303", "SPAN 102",
    // Sophomore Spring (15)
    "AF 301", "MSIS 212", "SOCIOL 101", "HIST 211", "BIOL 101",
    // Junior Fall (15)
    "MSIS 301", "MSIS 310", "IT 230L", "MGT 330", "PHIL 100",
    // Junior Spring (15)
    "IT 370", "IT 471", "IT 425L", "MGT 331", "MKT 301",
    // Senior Fall (15)
    "IT 456", "IT 485", "AFRSTY 101", "LATAM 101", "CLSICS 161",
    // Senior Spring (15)
    "POLSCI 102", "ENVSCI 101", "THRART 122", "MUSIC 117", "ANTH 256"
  ],

  major: [
    "MSIS 110", "MSIS 212", "MSIS 301", "MSIS 310",
    "IT 111L", "IT 110", "IT 230L", "IT 370", "IT 471", "IT 425L", "IT 456", "IT 485",
    "MGT 303", "MGT 330", "MGT 331",
    "MKT 301"
  ],

  core: [
    "SEMINR 126G",
    "IMS 200",
    "ENGL 101",
    "ENGL 102",
    "MATH 115", "AF 210", "AF 211",
    "BC 290"
  ]
},


{
  name: "Interdisciplinary Business – BS Major",
  subject: "BUSADM",
  degree: "BS",
  minCredits: 120,
  creditCap: 16,
  roadmapFlat: [
    // Freshman Fall
    "SEMINR 126G", "ENGL 101", "MATH 115", "ECON 101", "ART 100",
    // Freshman Spring
    "ENGL 102", "MSIS 110", "AF 210", "HIST 211", "SPAN 101",
    // Sophomore Fall
    "IMS 200", "IT 111L", "AF 211", "MGT 303", "BC 290",
    // Sophomore Spring
    "AF 301", "MSIS 212", "MKT 301", "BIOL 101", "PHIL 100",
    // Junior Fall
    "AF 325", "MGT 470", "MKT 405", "IT 370", "CHEM 111L",
    // Junior Spring
    "AF 315", "MSIS 301", "MGT 330", "SOCIOL 101", "ENVSCI 101",
    // Senior Fall
    "MSIS 454L", "MGT 331", "AFRSTY 101", "CLSICS 161", "LATAM 101",
    // Senior Spring
    "MGT 490", "ANTH 256", "POLSCI 102", "THRART 122", "MUSIC 117"
  ],

  major: [
    "MGT 303", "MGT 470", "MGT 330", "MGT 331", "MGT 490",
    "MKT 301", "MKT 405", "MSIS 301", "MSIS 454L", "AF 301", "AF 325", "AF 315"
  ],

  core: [
    "SEMINR 126G",
    "IMS 200",
    "ENGL 101",
    "ENGL 102",
    "MATH 115", "BC 290",
    "AF 210", "AF 211", 
    "MSIS 110", "MSIS 212"
  ]
},


 {
  name: "International Management - BS Major",
  subject: "MGT",
  degree: "BS",
  minCredits: 120,
  creditCap: 16,
  roadmapFlat: [
    // Freshman Fall (16)
    "SEMINR 126G", "ENGL 101", "MATH 115", "ECON 101", "ART 100",
    // Freshman Spring (16)
    "ENGL 102", "MSIS 110", "AF 210", "HIST 211", "SPAN 101",
    // Sophomore Fall (16)
    "IMS 200", "IT 111L", "AF 211", "ECON 102", "BC 290",
    // Sophomore Spring (15)
    "AF 301", "MSIS 212", "MGT 303", "PHIL 100", "BIOL 101",
    // Junior Fall (15)
    "MGT 330", "MGT 331", "MKT 301", "MKT 430", "SOCIOL 101",
    // Junior Spring (15)
    "MSIS 301", "AF 455", "MGT 434", "ECON 334", "LATAM 101",
    // Senior Fall (15)
    "MGT 480", "MKT 405", "AFRSTY 101", "CLSICS 161", "ENVSCI 101",
    // Senior Spring (15)
    "MGT 490", "THRART 122", "DANCE 135", "MUSIC 117", "ANTH 256"
  ],

  major: [
    "MGT 303",
    "MGT 330",
    "MGT 331",
    "MGT 434",
    "MGT 480",
    "MGT 490",
    "MKT 301",
    "MKT 430", "AF 301", "AF 455",
    "MKT 405", "MSIS 212", "MSIS 301",
  ],

  core: [
    "SEMINR 126G",
    "IMS 200",
    "ENGL 101",
    "ENGL 102",
    "MATH 115",
    "AF 210",
    "AF 211",
    "MSIS 110",
    "BC 290"
  ]
},


{
  name: "International Relations – BA Major",
  subject: "IR",
  degree: "BA",
  minCredits: 120,
  creditCap: 16,
  roadmapFlat: [
    // Freshman Fall (15)
    "SEMINR 126G", "POLSCI 102", "ENGL 101", "MATH 115", "ART 100",
    // Freshman Spring (16)
    "POLSCI 103", "POLSCI 202", "ENGL 102", "ECON 101", "SPAN 101",
    // Sophomore Fall (15)
    "IMS 200", "POLSCI 220", "HIST 211", "IT 110", "BIOL 101",
    // Sophomore Spring (16)
    "POLSCI 333", "POLSCI 369", "ECON 102", "CHEM 111L", "SPAN 102",
    // Junior Fall (15)
    "POLSCI 380", "POLSCI 387", "POLSCI 404", "SOCIOL 101", "ENVSCI 101",
    // Junior Spring (15)
    "ECON 334", "ECON 335", "GLBAFF 308", "ANTH 106", "CLSICS 161",
    // Senior Fall (15)
    "POLSCI 407", "POLSCI 410", "POLSCI 435", "AMST 101", "THRART 122",
    // Senior Spring (15)
    "IR 499L", "PSYCH 100", "AFRSTY 101", "LATAM 101", "DANCE 135"
  ],

  major: [
    "POLSCI 102",
    "POLSCI 103",
    "POLSCI 202",
    "POLSCI 220",
    "POLSCI 333",
    "POLSCI 369",
    "POLSCI 380",
    "POLSCI 387",
    "POLSCI 404",
    "POLSCI 407",
    "POLSCI 410",
    "POLSCI 435"
  ],

  core: [
    "SEMINR 126G",
    "IMS 200",
    "ENGL 101",
    "ENGL 102",
    "MATH 115"
  ]
},


{
  name: "Italian Studies - BA Major",
  subject: "ITAL",
  degree: "BA",
  minCredits: 120,
  creditCap: 16,
  roadmapFlat: [
    // Freshman Fall (16)
    "SEMINR 126G", "ENGL 101", "MATH 115", "ART 100", "PSYCH 100",
    // Freshman Spring (16)
    "ITAL 101", "ENGL 102", "HIST 211", "BIOL 101", "ECON 101",
    // Sophomore Fall (16)
    "IMS 200", "ITAL 201", "PHIL 100", "IT 110", "CHEM 111L",
    // Sophomore Spring (16)
    "ITAL 102", "ITAL 202", "SOCIOL 101", "ENVSCI 101", "AFRSTY 101",
    // Junior Fall (15)
    "ITAL 301", "ITAL 311", "HIST 302L", "CLSICS 161", "HIST 175",
    // Junior Spring (15)
    "ITAL 345L", "MLLC 235L", "MLLC 270", "HIST 433", "LATAM 101",
    // Senior Fall (15)
    "ITAL 476", "ITAL 479", "ITAL 276L", "ANTH 256", "MUSIC 117",
    // Senior Spring (15)
    "ITAL 498", "ITAL 340L", "ITAL 355L", "POLSCI 202", "MATH 125"
  ],

  major: [
    "ITAL 101",
    "ITAL 201",
    "ITAL 102",
    "ITAL 202",
    "ITAL 301",
    "ITAL 311",
    "ITAL 345L",
    "ITAL 476",
    "ITAL 479",
    "ITAL 276L",
    "ITAL 498",
    "ITAL 340L",
    "ITAL 355L"
  ],

  core: [
    "SEMINR 126G",
    "IMS 200",
    "ENGL 101",
    "ENGL 102",
    "MATH 115"
  ]
},


{
  name: "Labor Studies – BA Major",
  subject: "LABOR",
  degree: "BA",
  minCredits: 120,
  creditCap: 16,
  roadmapFlat: [
    // Freshman Fall (16)
    "SEMINR 126G", "ENGL 101", "MATH 115", "LABOR 120L", "ART 100",
    // Freshman Spring (16)
    "ENGL 102", "ECON 101", "SOCIOL 101", "AMST 101", "SPAN 101",
    // Sophomore Fall (16)
    "IMS 200", "ECON 102", "LABOR 210L", "HIST 211", "IT 110",
    // Sophomore Spring (16)
    "LABOR 240L", "HIST 266", "PHIL 100", "CHEM 111L", "SPAN 102",
    // Junior Fall (15)
    "LABOR 250L", "LABOR 275L", "POLSCI 350", "SOCIOL 202", "AFRSTY 101",
    // Junior Spring (15)
    "LABOR 315", "LABOR 325", "LABOR 330", "CLSICS 161", "LATAM 100",
    // Senior Fall (15)
    "LABOR 340", "ANTH 256", "ENVSCI 101", "THRART 122", "MUSIC 117",
    // Senior Spring (15)
    "MATH 125", "DANCE 135", "BIOL 101", "PSYCH 100", "ART 101"
  ],

  major: [
    "LABOR 120L",
    "LABOR 210L",
    "LABOR 240L",
    "LABOR 250L",
    "LABOR 275L",
    "LABOR 315",
    "LABOR 325",
    "LABOR 330",
    "LABOR 340", "POLSCI 350"
  ],

  core: [
    "SEMINR 126G",
    "IMS 200",
    "ENGL 101",
    "ENGL 102",
    "MATH 115"
  ]
},


{
  name: "Management & Leadership – BS Major",
  subject: "MGT",
  degree: "BS",
  minCredits: 120,
  creditCap: 16,
  roadmapFlat: [
    // Freshman Fall (16)
    "SEMINR 126G", "ENGL 101", "MATH 115", "ECON 101", "ART 100",
    // Freshman Spring (15–16)
    "ENGL 102", "MSIS 110", "AF 210", "BC 290", "SPAN 101",
    // Sophomore Fall (16)
    "IMS 200", "IT 110", "AF 211", "MGT 303", "HIST 211",
    // Sophomore Spring (15)
    "IT 111L", "AF 301", "MSIS 212", "MGT 330", "CHEM 111L",
    // Junior Fall (15)
    "MSIS 301", "MGT 331", "MKT 301", "SOCIOL 101", "AFRSTY 101",
    // Junior Spring (15)
    "MGT 421", "MGT 434", "MGT 401", "CLSICS 161", "LATAM 101",
    // Senior Fall (15)
    "MGT 431", "MGT 470", "ENVSCI 101", "THRART 122", "MUSIC 117",
    // Senior Spring (15–16)
    "MGT 490", "ANTH 256", "DANCE 135", "MATH 125", "SPAN 102"
  ],

  major: [
    "MGT 303",
    "MGT 330",
    "MGT 331",
    "MGT 421",
    "MGT 434",
    "MGT 401",
    "MGT 431",
    "MGT 470",
    "MGT 490",
    "MKT 301"
  ],

  core: [
    "SEMINR 126G",
    "IMS 200",
    "ENGL 101",
    "ENGL 102",
    "MATH 115"
  ]
},


{
  name: "Music – BA Major",
  subject: "MUSIC",
  degree: "BA",
  minCredits: 120,
  creditCap: 16,
  roadmapFlat: [
    // Freshman Fall (15–16)
    "SEMINR 126G", "MUSIC 121", "MUSIC 123", "MUSIC 131", "ENGL 101",
    // Freshman Spring (15–16)
    "ENGL 102", "MUSIC 122", "MUSIC 124", "MUSIC 132", "ART 100",
    // Sophomore Fall (15–16)
    "IMS 200", "MUSIC 221", "MUSIC 223", "MUSIC 101", "MATH 115",
    // Sophomore Spring (15–16)
    "MUSIC 222", "MUSIC 224", "MUSIC 102", "HIST 211", "PSYCH 100",
    // Junior Fall (15–16)
    "MUSIC 302", "MUSIC 104", "PHIL 100", "BIOL 101", "IT 110",
    // Junior Spring (15–16)
    "MUSIC 303", "MUSIC 106", "ECON 101", "CHEM 111L", "SPAN 101",
    // Senior Fall (15–16)
    "MUSIC 315", "MUSIC 109", "POLSCI 102", "ENVSCI 101", "CLSICS 161",
    // Senior Spring (15–16)
    "MUSIC 185", "MUSIC 185", "SPAN 102", "AFRSTY 101", "ANTH 256"
  ],

  major: [
    "MUSIC 121","MUSIC 123","MUSIC 131",
    "MUSIC 122","MUSIC 124","MUSIC 132",
    "MUSIC 221","MUSIC 223","MUSIC 101",
    "MUSIC 222","MUSIC 224","MUSIC 102",
    "MUSIC 302","MUSIC 104",
    "MUSIC 303","MUSIC 106",
    "MUSIC 315","MUSIC 109",
    "MUSIC 185"
  ],

  core: [
    "SEMINR 126G",
    "IMS 200",
    "ENGL 101",
    "ENGL 102",
    "MATH 115"
  ]
},


{
  name: "Nursing - BS Major",
  subject: "NURSNG",
  degree: "BS",
  minCredits: 120,
  creditCap: 16,
  roadmapFlat: [
    // Freshman Fall (16)
    "SEMINR 126G", "ENGL 101", "MATH 115", "BIOL 101", "PSYCH 100",
    // Freshman Spring (16)
    "ENGL 102", "CHEM 115", "CHEM 117", "EHS 150", "SPAN 101",
    // Sophomore Fall (16)
    "IMS 200", "BIOL 207", "CHEM 116", "CHEM 118", "HLTH 201",
    // Sophomore Spring (15)
    "BIOL 208", "BIOL 209", "HLTH 212", "SOCIOL 101", "IT 110",
    // Junior Fall (15)
    "HLTH 230", "HLTH 314", "NURSNG 220", "NURSNG 226", "PHIL 100",
    // Junior Spring (16)
    "NURSNG 310", "NURSNG 320", "NURSNG 332", "HIST 211", "ECON 101",
    // Senior Fall (16)
    "NURSNG 335", "NURSNG 345", "NURSNG 430", "NURSNG 405", "POLSCI 102",
    // Senior Spring (15)
    "NURSNG 435", "NURSNG 455", "NURSNG 456", "ART 100", "SPAN 102"
  ],

  major: [
    "HLTH 201",
    "HLTH 212",
    "HLTH 230",
    "HLTH 314",

    "NURSNG 220",
    "NURSNG 226",
    "NURSNG 310",
    "NURSNG 320",
    "NURSNG 332",
    "NURSNG 335",
    "NURSNG 345",
    "NURSNG 430",
    "NURSNG 405",
    "NURSNG 435",
    "NURSNG 455",
    "NURSNG 456"
  ],

  core: [
    "SEMINR 126G",
    "IMS 200",
    "ENGL 101",
    "ENGL 102",

    "MATH 115",

    "EHS 150",

    "CHEM 115",
    "CHEM 117",
    "CHEM 116",
    "CHEM 118",

    "BIOL 101",
    "BIOL 207",
    "BIOL 208",
    "BIOL 209"
  ]
},


{
  name: "Nursing For RNS - BS Major",
  subject: "NURSNG",
  degree: "BS",
  minCredits: 120,
  creditCap: 16,
  roadmapFlat: [
    // Freshman Fall (16)
    "SEMINR 126G", "ENGL 101", "MATH 115", "BIOL 207", "ART 100",
    // Freshman Spring (16)
    "ENGL 102", "BIOL 208", "HLTH 230", "PSYCH 100", "SOCIOL 101",
    // Sophomore Fall (16)
    "IMS 200", "BIOL 209", "ECON 101", "IT 110", "HIST 211",
    // Sophomore Spring (15)
    "NURSNG 360", "NURSNG 361", "HLTH 314",
    // Junior Fall (15)
    "NURSNG 362", "NURSNG 461", "NURSNG 455",
    // Junior Spring (15)
    "NURSNG 462", "NURSNG 226", "MATH 125",
    // Senior Fall (15)
    "NURSNG 310", "NURSNG 335",
    // Senior Spring (15)
    "NURSNG 345", "NURSNG 435", "PHIL 100", "IT 111L"
  ],

  major: [
    "HLTH 230",
    "HLTH 314",

    "NURSNG 360",
    "NURSNG 361",
    "NURSNG 362",
    "NURSNG 461",
    "NURSNG 455",
    "NURSNG 462",
    "NURSNG 226",
    "NURSNG 310",
    "NURSNG 335",
    "NURSNG 345",
    "NURSNG 435"
  ],

  core: [
    "SEMINR 126G",
    "IMS 200",
    "ENGL 101",
    "ENGL 102",
    "MATH 115",
    "MATH 125",
    "BIOL 207",
    "BIOL 208",
    "BIOL 209"
  ]
},


{
  name: "Philosophy – BA Major",
  subject: "PHIL",
  degree: "BA",
  minCredits: 120,
  creditCap: 16,
  roadmapFlat: [
    // Freshman Fall (16)
    "SEMINR 126G", "ENGL 101", "MATH 115", "PHIL 100", "ART 100",
    // Freshman Spring (15)
    "ENGL 102", "PHIL 108", "SPAN 101", "BIOL 101", "PSYCH 100",
    // Sophomore Fall (15)
    "IMS 200", "PHIL 211", "PHIL 250", "HIST 211", "IT 110",
    // Sophomore Spring (15)
    "PHIL 212", "ECON 101", "CHEM 111L", "SOCIOL 101", "MUSIC 117",
    // Junior Fall (15)
    "PHIL 311", "PHIL 333", "POLSCI 102", "ENVSCI 101", "CLSICS 161",
    // Junior Spring (15)
    "PHIL 344", "PHIL 346", "SPAN 102", "AFRSTY 101", "LATAM 101",
    // Senior Fall (15)
    "PHIL 475", "ANTH 106", "DANCE 135", "THRART 122", "MATH 125",
    // Senior Spring (15)
    "PHIL 230", "PHIL 290", "PHIL 200", "ANTH 256", "PHIL 208"
  ],

  major: [
    "PHIL 100",
    "PHIL 108",
    "PHIL 211",
    "PHIL 250",
    "PHIL 212",
    "PHIL 311",
    "PHIL 333",
    "PHIL 344",
    "PHIL 346",
    "PHIL 475",
    "PHIL 230",
    "PHIL 290",
    "PHIL 200",
    "PHIL 208"
  ],

  core: [
    "SEMINR 126G",
    "IMS 200",
    "ENGL 101",
    "ENGL 102",
    "MATH 115"
  ]
},


{
  name: "Philosophy and Public Policy - BA Major",
  subject: "PHIL",
  degree: "BA",
  minCredits: 120,
  creditCap: 16,
  roadmapFlat: [
    // Freshman Fall (16)
    "SEMINR 126G", "ENGL 101", "MATH 115", "PHIL 100", "ART 100",
    // Freshman Spring (15)
    "ENGL 102", "PHIL 215", "SPAN 101", "BIOL 101", "PSYCH 100",
    // Sophomore Fall (16)
    "IMS 200", "PHIL 216", "PHIL 212", "HIST 211", "IT 110",
    // Sophomore Spring (15)
    "PHIL 250", "ECON 101", "CHEM 111L", "SOCIOL 101", "MUSIC 117",
    // Junior Fall (15)
    "PHIL 222", "PHIL 224", "ECON 330", "POLSCI 102", "ENVSCI 101",
    // Junior Spring (15)
    "PHIL 265", "PHIL 333", "SOCIOL 343", "AFRSTY 101", "PHIL 478",
    // Senior Fall (15)
    "PHIL 478", "THRART 122", "DANCE 135", "CLSICS 161", "MATH 125",
    // Senior Spring (15)
    "PHIL 478", "ANTH 106", "ANTH 256", "SPAN 102", "LATAM 101"
  ],

  major: [
    "PHIL 100",
    "PHIL 215",
    "PHIL 216",
    "PHIL 212",
    "PHIL 250",
    "PHIL 222",
    "PHIL 224",
    "PHIL 265",
    "PHIL 333",
    "PHIL 478"
  ],

  core: [
    "SEMINR 126G",
    "IMS 200",
    "ENGL 101",
    "ENGL 102",
    "MATH 115"
  ]
},



{
  name: "Philosophy, Law, and Ethics – BA Major",
  subject: "PHIL",
  degree: "BA",
  minCredits: 120,
  creditCap: 16,

  roadmapFlat: [
    // Freshman Fall (15)
    "SEMINR 126G", "ENGL 101", "PHIL 150", "ART 100", "MATH 115",
    // Freshman Spring (16)
    "ENGL 102", "PHIL 216", "PHIL 218", "SPAN 101", "BIOL 101",
    // Sophomore Fall (15)
    "IMS 200", "PHIL 290", "PHIL 222", "HIST 211", "ECON 101",
    // Sophomore Spring (16)
    "PHIL 311", "PHILLAW 300", "PHIL 333", "SPAN 102", "CHEM 111L",
    // Junior Fall (15)
    "PHIL 318", "PHIL 327", "PHIL 344", "PSYCH 100", "AFRSTY 101",
    // Junior Spring (15)
    "PHIL 345", "PHIL 440", "PHIL 455", "SOCIOL 101", "IT 110",
    // Senior Fall (15)
    "PHIL 475", "ENVSCI 101", "POLSCI 102", "MUSIC 117", "CLSICS 161",
    // Senior Spring (15)
    "ANTH 256", "LATAM 101", "THRART 122", "DANCE 135", "PHIL 100"
  ],

  major: [
    "PHIL 150",
    "PHIL 216",
    "PHIL 218",
    "PHIL 290",
    "PHIL 222",
    "PHIL 311",
    "PHILLAW 300",
    "PHIL 333",
    "PHIL 318",
    "PHIL 327",
    "PHIL 344",
    "PHIL 345",
    "PHIL 440",
    "PHIL 455",
    "PHIL 475",
    "PHIL 100"
  ],

  core: [
    "SEMINR 126G",
    "ENGL 101",
    "ENGL 102",
    "IMS 200",
    "MATH 115"
  ]
},



{
  name: "Physics - BA Major",
  subject: "PHYSIC",
  degree: "BA",
  minCredits: 120,
  creditCap: 16,

  roadmapFlat: [
    // Freshman Fall (16)
    "SEMINR 126G", "ENGL 101", "MATH 115", "PHYSIC 113", "ART 100",
    // Freshman Spring (16)
    "ENGL 102", "MATH 125", "PHYSIC 114", "PHYSIC 181", "PHIL 100",
    // Sophomore Fall (15)
    "IMS 200", "MATH 240", "PHYSIC 107", "ECON 101", "MUSIC 117",
    // Sophomore Spring (15)
    "MATH 270", "PHYSIC 108", "PHYSIC 182", "SOCIOL 101", "HIST 211",
    // Junior Fall (15)
    "PHYSIC 211", "PHYSIC 214", "PHYSIC 281", "CHEM 111L", "CLSICS 161",
    // Junior Spring (15)
    "PHYSIC 312", "PHYSIC 321", "PHYSIC 382", "PSYCH 100", "LATAM 101",
    // Senior Fall (15)
    "PHYSIC 350", "PHYSIC 421", "AFRSTY 101", "THRART 122", "IT 110",
    // Senior Spring (15)
    "DANCE 135", "ANTH 256", "POLSCI 102", "BIOL 101", "ENVSCI 101"
  ],

  major: [
    "PHYSIC 113",
    "PHYSIC 114",
    "PHYSIC 181",
    "PHYSIC 107",
    "PHYSIC 108",
    "PHYSIC 182",
    "PHYSIC 211",
    "PHYSIC 214",
    "PHYSIC 281",
    "PHYSIC 312",
    "PHYSIC 321",
    "PHYSIC 382",
    "PHYSIC 350",
    "PHYSIC 421"
  ],

  core: [
    "SEMINR 126G",
    "ENGL 101",
    "ENGL 102",
    "IMS 200",
    "MATH 115",
    "MATH 125",
    "MATH 240",
    "MATH 270"
  ]
},


{
  name: "Physics - BS Major",
  subject: "PHYSIC",
  degree: "BS",
  minCredits: 120,
  creditCap: 16,

  roadmapFlat: [
    // Freshman Fall (15)
    "SEMINR 126G", "ENGL 101", "CHEM 115", "ART 100", "MATH 140",
    // Freshman Spring (15)
    "PHYSIC 113", "PHYSIC 181", "ENGL 102", "CHEM 117", "MATH 141",
    // Sophomore Fall (16)
    "IMS 200", "PHYSIC 114", "PHYSIC 182", "MATH 115", "ENVSCI 188S",
    // Sophomore Spring (16)
    "MATH 242", "CS 110", "PHYSIC 211", "CHEM 111L", "HIST 211",
    // Junior Fall (16)
    "PHYSIC 214", "PHYSIC 281", "PHYSIC 312", "MATH 270", "ECON 101",
    // Junior Spring (16)
    "PHYSIC 321", "PHYSIC 322", "PHYSIC 382", "PHYSIC 397", "PHIL 100",
    // Senior Fall (16)
    "PHYSIC 350", "PHYSIC 421", "PHYSIC 362", "SOCIOL 101", "HIST 175",
    // Senior Spring (16)
    "PHYSIC 421", "PHYSIC 351", "SPAN 101", "POLSCI 202", "LATAM 101"
  ],

  major: [
    "PHYSIC 113",
    "PHYSIC 181",
    "PHYSIC 114",
    "PHYSIC 182",
    "PHYSIC 211",
    "PHYSIC 214",
    "PHYSIC 281",
    "PHYSIC 312",
    "PHYSIC 321",
    "PHYSIC 322",
    "PHYSIC 382",
    "PHYSIC 350",
    "PHYSIC 421",
    "PHYSIC 362",
    "PHYSIC 421",
    "PHYSIC 351"
  ],

  core: [
    "SEMINR 126G",
    "ENGL 101",
    "ENGL 102",
    "IMS 200",
    "MATH 115",
    "MATH 242",
    "MATH 270",
    "MATH 140", "MATH 141",
    "CHEM 115",
    "CHEM 117",
    "CHEM 111L", "PHYSIC 397",
    "CS 110"
  ]
},


{
  name: "Political Science - BA Major",
  subject: "POLSCI",
  degree: "BA",
  minCredits: 120,
  creditCap: 16,

  roadmapFlat: [
    // Freshman Fall (16)
    "SEMINR 126G", "POLSCI 101", "ENGL 101", "MATH 115", "ART 100",
    // Freshman Spring (15)
    "POLSCI 102", "ENGL 102", "PSYCH 100", "BIOL 101", "SPAN 101",
    // Sophomore Fall (16)
    "IMS 200", "POLSCI 203", "HIST 211", "IT 110", "CHEM 111L",
    // Sophomore Spring (15)
    "POLSCI 220", "POLSCI 251", "ECON 101", "SOCIOL 101", "SPAN 102",
    // Junior Fall (15)
    "POLSCI 343", "POLSCI 309", "POLSCI 333", "AFRSTY 101", "CLSICS 161",
    // Junior Spring (15)
    "POLSCI 340", "POLSCI 375", "POLSCI 387", "LATAM 101", "ENVSCI 101",
    // Senior Fall (15)
    "POLSCI 390", "POLSCI 404", "THRART 122", "DANCE 135", "MUSIC 117",
    // Senior Spring (15)
    "POLSCI 350", "ANTH 106", "ANTH 256", "PHIL 100", "MATH 125"
  ],

  major: [
    "POLSCI 101",
    "POLSCI 102",
    "POLSCI 203",
    "POLSCI 220",
    "POLSCI 251",
    "POLSCI 343",
    "POLSCI 309",
    "POLSCI 333",
    "POLSCI 340",
    "POLSCI 375",
    "POLSCI 387",
    "POLSCI 390",
    "POLSCI 404",
    "POLSCI 350"
  ],

  core: [
    "SEMINR 126G",
    "ENGL 101",
    "ENGL 102",
    "IMS 200",
    "MATH 115"
  ]
},


{
  name: "Psychology - BA Major",
  subject: "PSYCH",
  degree: "BA",
  minCredits: 120,
  creditCap: 16,

  roadmapFlat: [
    // Freshman Fall (16)
    "SEMINR 126G", "PSYCH 100", "ENGL 101", "MATH 115", "ART 100",
    // Freshman Spring (15)
    "PSYCH 201", "ENGL 102", "HIST 211", "BIOL 101", "MUSIC 117",
    // Sophomore Fall (16)
    "IMS 200", "PSYCH 230", "IT 110", "PHIL 100", "ECON 101",
    // Sophomore Spring (15)
    "PSYCH 260", "PSYCH 210", "CHEM 111L", "SOCIOL 101", "CLSICS 161",
    // Junior Fall (15)
    "PSYCH 241", "PSYCH 250", "PSYCH 333", "POLSCI 102", "ENVSCI 101",
    // Junior Spring (15)
    "PSYCH 339", "PSYCH 360", "PSYCH 370", "AFRSTY 101", "LATAM 101",
    // Senior Fall (15)
    "PSYCH 415", "PSYCH 466", "THRART 122", "DANCE 135", "GREEK 201",
    // Senior Spring (15)
    "PSYCH 477", "ANTH 256", "GREEK 202", "AMST 101", "PSYCH 242"
  ],

  major: [
    "PSYCH 100",
    "PSYCH 201",
    "PSYCH 230",
    "PSYCH 260",
    "PSYCH 210",
    "PSYCH 241",
    "PSYCH 250",
    "PSYCH 333",
    "PSYCH 339",
    "PSYCH 360",
    "PSYCH 370",
    "PSYCH 415",
    "PSYCH 466",
    "PSYCH 477",
    "PSYCH 242"
  ],

  core: [
    "SEMINR 126G",
    "ENGL 101",
    "ENGL 102",
    "IMS 200",
    "MATH 115"
  ]
},


{
  name: "Psychology - BS Major",
  subject: "PSYCH",
  degree: "BS",
  minCredits: 120,
  creditCap: 16,

  roadmapFlat: [
    // Freshman Fall (16)
    "SEMINR 126G", "PSYCH 100", "ENGL 101", "MATH 115", "ART 100",
    // Freshman Spring (15)
    "PSYCH 201", "ENGL 102", "HIST 211", "BIOL 101", "MUSIC 117",
    // Sophomore Fall (16)
    "IMS 200", "PSYCH 230", "MATH 125", "PHIL 100", "ECON 101",
    // Sophomore Spring (15)
    "PSYCH 260", "PSYCH 210", "CHEM 111L", "SOCIOL 101", "CLSICS 161",
    // Junior Fall (15)
    "PSYCH 241", "PSYCH 250", "PSYCH 370", "POLSCI 102", "ENVSCI 101",
    // Junior Spring (16)
    "PSYCH 286", "PSYCH 302", "ANTH 106", "AFRSTY 101", "SPAN 101",
    // Senior Fall (15)
    "PSYCH 415", "PSYCH 420", "THRART 122", "DANCE 135", "IT 110",
    // Senior Spring (16)
    "PSYCH 477", "SPAN 102", "AMST 101", "ANTH 256", "LATAM 101"
  ],

  major: [
    "PSYCH 100",
    "PSYCH 201",
    "PSYCH 230",
    "PSYCH 260",
    "PSYCH 210",
    "PSYCH 241",
    "PSYCH 250",
    "PSYCH 370",
    "PSYCH 286",
    "PSYCH 302",
    "PSYCH 415",
    "PSYCH 420",
    "PSYCH 477"
  ],

  core: [
    "SEMINR 126G",
    "ENGL 101",
    "ENGL 102",
    "IMS 200",
    "MATH 115",
    "MATH 125"
  ]
},



{
  name: "Sociology - BA Major",
  subject: "SOCIOL",
  degree: "BA",
  minCredits: 120,
  creditCap: 16,

  roadmapFlat: [
    // Freshman Fall (16)
    "SEMINR 126G", "SOCIOL 101", "ENGL 101", "MATH 115", "ART 100",
    // Freshman Spring (16)
    "SOCIOL 102", "HIST 211", "ENGL 102", "BIOL 101", "SPAN 101",
    // Sophomore Fall (16)
    "IMS 200", "SOCIOL 201", "ECON 101", "IT 110", "PHIL 100",
    // Sophomore Spring (15)
    "SOCIOL 262", "SOCIOL 350", "ECON 102", "CHEM 111L", "MUSIC 117",
    // Junior Fall (16)
    "SOCIOL 311", "SOCIOL 331", "SOCIOL 461", "USEA 100", "USEA 106",
    // Junior Spring (15)
    "CLSICS 161", "LATAM 101", "ANTH 106", "ENVSCI 101", "MATH 125",
    // Senior Fall (16)
    "SOCIOL 470", "SPAN 102", "THRART 122", "PSYCH 100", "POLSCI 102",
    // Senior Spring (15)
    "POLSCI 230", "POLSCI 202", "ANTH 256", "LATAM 100", "ART 101"
  ],

  major: [
    "SOCIOL 101",
    "SOCIOL 102",
    "SOCIOL 201",
    "SOCIOL 202",
    "SOCIOL 262",
    "SOCIOL 350",
    "SOCIOL 311",
    "SOCIOL 331",
    "SOCIOL 461",
    "SOCIOL 470"
  ],

  core: [
    "SEMINR 126G",
    "IMS 200",
    "ENGL 101",
    "ENGL 102",
    "MATH 115"
  ]
},


{
  name: "Sport Business - BS Major",
  subject: "CAPS",
  degree: "BS",
  minCredits: 120,
  creditCap: 16,

  roadmapFlat: [
    // Freshman Fall (15)
    "SEMINR 126G", "ENGL 101", "MATH 115", "ECON 101", "ART 100",
    // Freshman Spring (15)
    "ENGL 102", "ECON 102", "AF 210", "MATH 125", "SPAN 101",
    // Sophomore Fall (15–16)
    "IMS 200", "BC 290", "AF 211", "MGT 303", "IT 110",
    // Sophomore Spring (15)
    "AF 301", "MKT 301", "IT 111L", "BIOL 101", "PHIL 100",
    // Junior Fall (15–16)
    "AF 405", "MGT 415", "SL 180", "CHEM 111L", "SOCIOL 101",
    // Junior Spring (15)
    "MKT 425", "MSIS 461L", "MGT 350", "AFRSTY 101", "LATAM 101",
    // Senior Fall (15)
    "MGT 490", "POLSCI 202", "ENVSCI 101", "CLSICS 161", "THRART 122",
    // Senior Spring (15)
    "ANTH 256", "MUSIC 117", "HIST 175", "SPAN 102", "HIST 211"
  ],

  // Keep both in sync so journey.html works regardless of which field it reads.
  major: [
    "AF 210",
    "AF 211",
    "AF 301",
    "AF 405",
    "MGT 303",
    "MKT 301",
    "MGT 415",
    "SL 180",
    "MKT 425",
    "MGT 350",
    "MGT 490"
  ],

  core: [
    "SEMINR 126G",
    "IMS 200", "ECON 101", "ECON 102",
    "ENGL 101",
    "ENGL 102",
    "MATH 115",
    "MATH 125", "BC 290",
  ]
},


{
  name: "Sport Leadership & Administration – BA Major",
  subject: "SL",
  degree: "BA",
  minCredits: 120,
  creditCap: 16,

  roadmapFlat: [
    // Freshman Fall (16)
    "SEMINR 126G", "SL 101", "ENGL 101", "MATH 115", "ART 100",
    // Freshman Spring (15)
    "SL 180", "ENGL 102", "PSYCH 100", "BIOL 101", "SPAN 101",
    // Sophomore Fall (16)
    "IMS 200", "SL 201", "HIST 211", "ECON 101", "IT 110",
    // Sophomore Spring (15)
    "POLSCI 202", "SL 280", "PHIL 100", "CHEM 111L", "MUSIC 117",
    // Junior Fall (15)
    "SL 301", "SL 331", "SOCIOL 101", "AFRSTY 101", "SPAN 102",
    // Junior Spring (15)
    "SL 380", "SL 410", "POLSCI 345", "CLSICS 161", "LATAM 101",
    // Senior Fall (15)
    "SL 381", "SL 302", "SL 420", "ANTH 120L", "ENVSCI 101",
    // Senior Spring (15)
    "SL 401", "SL 498", "THRART 122", "DANCE 135", "ANTH 256"
  ],

  major: [
    "SL 101",
    "SL 180",
    "SL 201",
    "SL 280",
    "SL 301",
    "SL 331",
    "SL 380",
    "SL 410",
    "SL 381",
    "SL 302",
    "SL 420",
    "SL 401",
    "SL 498"
  ],

  core: [
    "SEMINR 126G",
    "IMS 200",
    "ENGL 101",
    "ENGL 102",
    "MATH 115"
  ]
},


{
  name: "Supply Chain Management - BS Major",
  subject: "SCSM",
  degree: "BS",
  minCredits: 120,
  creditCap: 16,

  roadmapFlat: [
    // Freshman Fall
    "SEMINR 126G", "ENGL 101", "MATH 115", "MSIS 110", "ART 100",
    // Freshman Spring
    "ENGL 102", "ECON 101", "AF 210", "ATH 125", "SPAN 101",
    // Sophomore Fall
    "IMS 200", "IT 111L", "AF 211", "MKT 301", "BC 290",
    // Sophomore Spring
    "AF 301", "MSIS 212", "MGT 303", "PHIL 100", "BIOL 101",
    // Junior Fall
    "MSIS 301", "SCSM 350", "SCSM 454L", "IT 110", "SOCIOL 101",
    // Junior Spring
    "SCSM 450", "SCSM 451", "MSIS 480", "AFRSTY 101", "LATAM 101",
    // Senior Fall
    "SCSM 495", "MGT 490", "POLSCI 102", "ENVSCI 101", "CLSICS 161",
    // Senior Spring
    "ANTH 256", "MUSIC 117", "THRART 122", "DANCE 135", "HIST 211"
  ],

  major: [
    "MKT 301",
    "MGT 303",
    "SCSM 350",
    "SCSM 454L",
    "SCSM 450",
    "SCSM 451",
    "SCSM 495",
    "MGT 490", "AF 211", "AF 301"
  ],

  core: [
    "SEMINR 126G",
    "IMS 200", "BC 290",
    "ENGL 101",
    "ENGL 102",
    "MATH 115",
    "MATH 125",
    "AF 210",
    
  ]
},


{
  name: "Theatre Arts – BA Major",
  subject: "THRART",
  degree: "BA",
  minCredits: 120,
  creditCap: 16,

  roadmapFlat: [
    // Freshman Fall (15–16)
    "SEMINR 126G", "THRART 105", "THRART 122", "ENGL 101", "MATH 115",
    // Freshman Spring (15–16)
    "ENGL 102", "THRART 123", "THRART 125", "ART 100", "PSYCH 100",
    // Sophomore Fall (15–16)
    "IMS 200", "THRART 201", "THRART 205", "HIST 211", "IT 110",
    // Sophomore Spring (15–16)
    "THRART 202", "THRART 236", "THRART 251", "PHIL 100", "SOCIOL 101",
    // Junior Fall (15–16)
    "THRART 305", "THRART 301", "THRART 337", "ECON 101", "BIOL 101",
    // Junior Spring (15–16)
    "THRART 361", "THRART 435", "CHEM 111L", "AFRSTY 101", "LATAM 101",
    // Senior Fall (15–16)
    "THRART 405", "SPAN 101", "POLSCI 102", "CLSICS 161", "MUSIC 117",
    // Senior Spring (15–16)
    "SPAN 102", "ENVSCI 101", "ANTH 106", "ANTH 256", "DANCE 135"
  ],

  major: [
    "THRART 105",
    "THRART 122",
    "THRART 123",
    "THRART 125",
    "THRART 201",
    "THRART 205",
    "THRART 202",
    "THRART 236",
    "THRART 251",
    "THRART 305",
    "THRART 301",
    "THRART 337",
    "THRART 361",
    "THRART 435",
    "THRART 405"
  ],

  core: [
    "SEMINR 126G",
    "IMS 200",
    "ENGL 101",
    "ENGL 102",
    "MATH 115"
  ]
},


{
  name: "Urban Public Health – BS Major",
  subject: "PUBHTH",
  degree: "BS",
  minCredits: 120,
  creditCap: 16,

  roadmapFlat: [
    // Freshman Fall (15)
    "SEMINR 126G", "PUBHTH 101", "ENGL 101", "MATH 115", "ART 100",
    // Freshman Spring (16)
    "PUBHTH 102", "ENGL 102", "BIOL 101", "SPAN 101", "PSYCH 100",
    // Sophomore Fall (15)
    "IMS 200", "PUBHTH 220", "PUBHTH 240", "HIST 211", "IT 110",
    // Sophomore Spring (15)
    "EHS 280", "CHEM 111L", "ECON 101", "SOCIOL 101", "CLSICS 161",
    // Junior Fall (15)
    "PUBHTH 330", "PUBHTH 350", "PUBHTH 355", "PHIL 100", "AFRSTY 101",
    // Junior Spring (15)
    "PUBHTH 356", "PUBHTH 360", "PUBHTH 203", "LATAM 101", "THRART 122",
    // Senior Fall (15)
    "PUBHTH 400", "PUBHTH 480", "ENVSCI 101", "POLSCI 102", "DANCE 135",
    // Senior Spring (15)
    "PUBHTH 265", "PUBHTH 480", "ANTH 256", "MUSIC 117", "MATH 125"
  ],

  major: [
    "PUBHTH 101",
    "PUBHTH 102",
    "PUBHTH 220",
    "PUBHTH 240",
    "PUBHTH 330",
    "PUBHTH 350",
    "PUBHTH 355",
    "PUBHTH 356",
    "PUBHTH 360",
    "PUBHTH 203",
    "PUBHTH 400",
    "PUBHTH 480",
    "PUBHTH 265",
    "PUBHTH 480"
  ],

  core: [
    "SEMINR 126G",
    "IMS 200",
    "ENGL 101",
    "ENGL 102",
    "MATH 115", "ECON 101"
  ]
},


{
  name: "Women’s, Gender, and Sexuality Studies – BA Major",
  subject: "WGS",
  degree: "BA",
  minCredits: 120,
  creditCap: 16,

  roadmapFlat: [
    // Freshman Fall (15)
    "SEMINR 126G", "WGS 100", "ENGL 101", "ART 100", "MATH 115",
    // Freshman Spring (15)
    "WGS 110", "ENGL 102", "ECON 101", "BIOL 101", "SPAN 101",
    // Sophomore Fall (15)
    "IMS 200", "WGS 201", "ECON 102", "PHIL 230", "CHEM 111L",
    // Sophomore Spring (15)
    "WGS 290", "WGS 311L", "WGS 250", "IT 110", "AFRSTY 101",
    // Junior Fall (15)
    "WGS 260", "WGS 263G", "WGS 268", "WGS 270", "HIST 175",
    // Junior Spring (15)
    "WGS 300L", "WGS 345L", "WGS 347", "WGS 350", "HIST 211",
    // Senior Fall (15)
    "WGS 359L", "WGS 360", "SPAN 102", "WGS 490", "WGS 491",
    // Senior Spring (15)
    "WGS 370", "WGS 420", "WGS 498", "POLSCI 202", "HIST 346"
  ],

  major: [
    "WGS 100",
    "WGS 110",
    "WGS 201",
    "WGS 290",
    "WGS 311L",
    "WGS 250",
    "WGS 260",
    "WGS 263G",
    "WGS 268",
    "WGS 270",
    "WGS 300L",
    "WGS 345L",
    "WGS 347",
    "WGS 350",
    "WGS 359L",
    "WGS 360",
    "WGS 490",
    "WGS 491",
    "WGS 370",
    "WGS 420",
    "WGS 498",
    "HIST 346"
  ],

  core: [
    "SEMINR 126G",
    "IMS 200", "ECON 101",
    "ENGL 101",
    "ENGL 102",
    "MATH 115"
  ]
},




   
    

   
    
   
    
    {
  name: "Business Intelligence Track (CM)",
  subject: "IT",
  degree: "BS",
  minCredits: 120,
  creditCap: 16,
  notes: "8-semester plan (Freshman–Senior Fall/Spring), 5 courses per semester, 30 credits planned each year, 15–16 credits max per term, target 120 total credits (121–123 allowed if needed). First Year Seminar only in Freshman year. Intermediate Seminar only in Sophomore year. ENGL 101 is placed in Freshman Fall and ENGL 102 is placed in Freshman Spring. Includes 9+ Distribution II courses across AR, HU, SB, NS, MT, WL, and WC.",

  roadmapFlat: [
    // Freshman Fall (16)
    "SEMINR 126G", "ENGL 101", "MATH 115", "IT 110", "ART 100",
    // Freshman Spring (16)
    "ENGL 102", "IT 111L", "IT 114L", "IT 116", "SPAN 101",
    // Sophomore Fall (16)
    "IMS 200", "IT 230L", "IT 240", "IT 244", "ECON 101",
    // Sophomore Spring (15)
    "IT 246", "IT 285L", "MATH 125", "BIOL 101", "PHIL 100",
    // Junior Fall (15)
    "IT 341", "IT 360", "IT 370", "AF 210", "HIST 211",
    // Junior Spring (15)
    "IT 425L", "IT 428L", "IT 456", "IT 461L", "PSYCH 100",
    // Senior Fall (15)
    "IT 460", "IT 471", "BC 290", "AF 211", "AFRSTY 101",
    // Senior Spring (16)
    "IT 485", "SOCIOL 262", "POLSCI 102", "ANTH 106", "SPAN 102"
  ],

  major: [
    "IT 110",
    "IT 111L",
    "IT 114L",
    "IT 116",
    "IT 230L",
    "IT 240",
    "IT 244",
    "IT 246",
    "IT 285L",
    "IT 341",
    "IT 360",
    "IT 370",
    "IT 425L",
    "IT 428L",
    "IT 456",
    "IT 461L",
    "IT 460",
    "IT 471",
    "IT 485"
  ],

  track: [
    "IT 370",
    "IT 428L",
    "IT 456"
  ],

  core: [
    "SEMINR 126G",
    "IMS 200",
    "ENGL 101",
    "ENGL 102",
    "MATH 115",
    "MATH 125",
    "BC 290"
  ]
},
{
  name: "Computer Forensics Track (CM)",
  subject: "IT",
  degree: "BS",
  minCredits: 120,
  creditCap: 16,
  notes: "8-semester plan (Freshman–Senior Fall/Spring), 5 courses per semester, 30 credits planned each year, 15–16 credits max per term, target 120 total credits (121–123 allowed if needed). First Year Seminar only in Freshman year. Intermediate Seminar only in Sophomore year. ENGL 101 is placed in Freshman Fall and ENGL 102 is placed in Freshman Spring. Includes 9+ Distribution II courses across AR, HU, SB, NS, MT, WL, and WC.",

  roadmapFlat: [
    // Freshman Fall (16)
    "SEMINR 126G", "ENGL 101", "MATH 115", "IT 110", "ART 100",
    // Freshman Spring (16)
    "ENGL 102", "IT 111L", "IT 114L", "IT 116", "SPAN 101",
    // Sophomore Fall (15)
    "IMS 200", "IT 220", "IT 230L", "IT 240", "ECON 101",
    // Sophomore Spring (15)
    "IT 221", "IT 244", "IT 246", "IT 285L", "BIOL 101",
    // Junior Fall (15)
    "IT 341", "BC 290", "IT 370", "MATH 125", "PHIL 100",
    // Junior Spring (15)
    "IT 420", "IT 421", "IT 425L", "IT 461L", "SOCIOL 104",
    // Senior Fall (15)
    "IT 456", "IT 460", "AF 210", "AFRSTY 101", "HIST 211",
    // Senior Spring (15)
    "IT 485", "AF 211", "SOCIOL 262", "POLSCI 102", "ANTH 106"
  ],

  major: [
    "IT 110",
    "IT 111L",
    "IT 114L",
    "IT 116",
    "IT 220",
    "IT 230L",
    "IT 240",
    "IT 221",
    "IT 244",
    "IT 246",
    "IT 285L",
    "IT 341",
    "IT 370",
    "IT 420",
    "IT 421",
    "IT 425L",
    "IT 461L",
    "IT 456",
    "IT 460",
    "IT 485"
  ],

  track: [
    "IT 220",
    "IT 221",
    "IT 420",
    "IT 421",
    "SOCIOL 104"
  ],

  core: [
    "SEMINR 126G",
    "IMS 200",
    "ENGL 101",
    "ENGL 102",
    "MATH 115",
    "MATH 125",
    "BC 290"
  ]
},


    {
  name: "Information Architecture Track (CM)",
  subject: "IT",
  degree: "BS",
  minCredits: 120,
  creditCap: 16,
  notes: "8-semester plan (Freshman–Senior Fall/Spring), 5 courses per semester, 30 credits planned each year, 15–16 credits max per term, target 120 total credits (121–123 allowed if needed). First Year Seminar only in Freshman year. Intermediate Seminar only in Sophomore year. ENGL 101 is placed in Freshman Fall and ENGL 102 is placed in Freshman Spring. Includes 9+ Distribution II courses across AR, HU, SB, NS, MT, WL, and WC.",

  roadmapFlat: [
    // Freshman Fall (16)
    "SEMINR 126G", "ENGL 101", "MATH 115", "IT 110", "ART 100",
    // Freshman Spring (16)
    "ENGL 102", "IT 111L", "IT 114L", "IT 116", "SPAN 101",
    // Sophomore Fall (15)
    "IMS 200", "IT 230L", "IT 240", "IT 244", "ECON 101",
    // Sophomore Spring (15)
    "IT 246", "IT 285L", "MATH 125", "BIOL 101", "HIST 175",
    // Junior Fall (15)
    "IT 341", "IT 360", "IT 220", "IT 370", "HIST 211",
    // Junior Spring (15)
    "IT 425L", "IT 428L", "IT 456", "IT 461L", "PSYCH 100",
    // Senior Fall (15)
    "IT 460", "BC 290", "AF 210", "ECON 102", "SOCIOL 262",
    // Senior Spring (16)
    "IT 485", "AF 211", "POLSCI 202", "ANTH 106", "SPAN 102"
  ],

  major: [
    "IT 110",
    "IT 111L",
    "IT 114L",
    "IT 116",
    "IT 220",
    "IT 230L",
    "IT 240",
    "IT 244",
    "IT 246",
    "IT 285L",
    "IT 341",
    "IT 360",
    "IT 370",
    "IT 425L",
    "IT 428L",
    "IT 456",
    "IT 461L",
    "IT 460",
    "IT 485"
  ],

  track: [
    "IT 360",
    "IT 428L",
    "IT 456",
    "IT 461L"
  ],

  core: [
    "SEMINR 126G",
    "IMS 200",
    "ENGL 101",
    "ENGL 102",
    "ECON 101",
    "ECON 102",
    "MATH 115",
    "MATH 125",
    "BC 290"
  ]
},

   {
  name: "System Administration Track (CM)",
  subject: "IT",
  degree: "BS",
  minCredits: 120,
  creditCap: 16,
  notes: "8-semester plan (Freshman–Senior Fall/Spring), 5 courses per semester, 30 credits planned each year, 15–16 credits max per term, target 120 total credits (121–123 allowed if needed). First Year Seminar only in Freshman year. Intermediate Seminar only in Sophomore year. ENGL 101 is placed in Freshman Fall and ENGL 102 is placed in Freshman Spring. Includes 9+ Distribution II courses across AR, HU, SB, NS, MT, WL, and WC.",

  roadmapFlat: [
    // Freshman Fall (16)
    "SEMINR 126G", "ENGL 101", "MATH 115", "IT 110", "ART 100",
    // Freshman Spring (16)
    "ENGL 102", "IT 111L", "IT 114L", "IT 116", "SPAN 101",
    // Sophomore Fall (15)
    "IMS 200", "IT 230L", "IT 240", "IT 244", "ECON 101",
    // Sophomore Spring (15)
    "IT 246", "IT 285L", "MATH 125", "BIOL 101", "IT 341",
    // Junior Fall (15)
    "ECON 102", "IT 360", "IT 370", "IT 442", "HIST 211",
    // Junior Spring (15)
    "IT 425L", "IT 443", "AF 210", "BC 290", "PSYCH 100",
    // Senior Fall (15)
    "IT 460", "IT 471", "IT 444", "HIST 175", "SOCIOL 262",
    // Senior Spring (16)
    "IT 485", "AF 211", "POLSCI 202", "ANTH 106", "SPAN 102"
  ],

  major: [
    "IT 110",
    "IT 111L",
    "IT 114L",
    "IT 116",
    "IT 230L",
    "IT 240",
    "IT 244",
    "IT 246",
    "IT 285L",
    "IT 341",
    "IT 360",
    "IT 370",
    "IT 442",
    "IT 425L",
    "IT 443",
    "IT 460",
    "IT 471",
    "IT 444",
    "IT 485"
  ],

  track: [
    "IT 341",
    "IT 442",
    "IT 443",
    "IT 444"
  ],

  core: [
    "SEMINR 126G",
    "IMS 200",
    "ENGL 101",
    "ENGL 102",
    "ECON 101",
    "ECON 102",
    "MATH 115",
    "MATH 125",
    "BC 290"
  ]
},

    {
  name: "Business Intelligence Track (CSM)",
  subject: "IT",
  degree: "BS",
  minCredits: 120,
  creditCap: 16,
  notes: "8-semester plan (Freshman–Senior Fall/Spring), 5 courses per semester, 30 credits planned each year, 15–16 credits max per term, target 120 total credits (121–123 allowed if needed). First Year Seminar only in Freshman year. Intermediate Seminar only in Sophomore year. ENGL 101 is placed in Freshman Fall and ENGL 102 is placed in Freshman Spring. Includes 9+ Distribution II courses across AR, HU, SB, NS, MT, WL, and WC.",

  roadmapFlat: [
    // Freshman Fall (16)
    "SEMINR 126G", "ENGL 101", "MATH 125", "IT 110", "ART 100",
    // Freshman Spring (16)
    "ENGL 102", "IT 111L", "IT 114L", "IT 116", "SPAN 101",
    // Sophomore Fall (16)
    "IMS 200", "IT 230L", "IT 240", "MATH 135", "ECON 101",
    // Sophomore Spring (15)
    "IT 244", "IT 246", "IT 285L", "MATH 140", "BIOL 101",
    // Junior Fall (15)
    "IT 341", "IT 360", "IT 370", "MATH 125", "PHIL 100",
    // Junior Spring (15)
    "IT 425L", "IT 428L", "IT 456", "IT 461L", "PSYCH 100",
    // Senior Fall (15)
    "IT 460", "IT 471", "AF 210", "AFRSTY 101", "HIST 211",
    // Senior Spring (16)
    "IT 485", "AF 211", "SOCIOL 262", "POLSCI 102", "SPAN 102"
  ],

  major: [
    "IT 110",
    "IT 111L",
    "IT 114L",
    "IT 116",
    "IT 230L",
    "IT 240",
    "IT 244",
    "IT 246",
    "IT 285L",
    "IT 341",
    "IT 360",
    "IT 370",
    "IT 425L",
    "IT 428L",
    "IT 456",
    "IT 461L",
    "IT 460",
    "IT 471",
    "IT 485"
  ],

  track: [
    "IT 370",
    "IT 428L",
    "IT 456"
  ],

  core: [
    "SEMINR 126G",
    "IMS 200",
    "ENGL 101",
    "ENGL 102",
    "MATH 125",
    "MATH 135",
    "MATH 140",
    "MATH 125"
  ]
},

    {
  name: "Computer Forensics Track (CSM)",
  subject: "IT",
  degree: "BS",
  minCredits: 120,
  creditCap: 16,
  notes: "8-semester plan (Freshman–Senior Fall/Spring), 5 courses per semester, 30 credits planned each year, 15–16 credits max per term, target 120 total credits (121–123 allowed if needed). First Year Seminar only in Freshman year. Intermediate Seminar only in Sophomore year. ENGL 101 is placed in Freshman Fall and ENGL 102 is placed in Freshman Spring. Includes 9+ Distribution II courses across AR, HU, SB, NS, MT, WL, and WC.",

  roadmapFlat: [
    // Freshman Fall (16)
    "SEMINR 126G", "ENGL 101", "MATH 115", "IT 110", "ART 100",
    // Freshman Spring (16)
    "ENGL 102", "IT 111L", "IT 114L", "IT 116", "SPAN 101",
    // Sophomore Fall (16)
    "IMS 200", "IT 220", "IT 230L", "IT 240", "MATH 135",
    // Sophomore Spring (15)
    "IT 221", "IT 244", "IT 246", "IT 285L", "MATH 140",
    // Junior Fall (15)
    "IT 341", "IT 360", "IT 370", "ECON 101", "BIOL 101",
    // Junior Spring (15)
    "IT 420", "IT 421", "IT 425L", "IT 461L", "SOCIOL 104",
    // Senior Fall (15)
    "IT 456", "IT 460", "AF 210", "AFRSTY 101", "HIST 211",
    // Senior Spring (16)
    "IT 485", "AF 211", "SOCIOL 262", "POLSCI 102", "ANTH 106"
  ],

  major: [
    "IT 110",
    "IT 111L",
    "IT 114L",
    "IT 116",
    "IT 220",
    "IT 230L",
    "IT 240",
    "IT 221",
    "IT 244",
    "IT 246",
    "IT 285L",
    "IT 341",
    "IT 360",
    "IT 370",
    "IT 420",
    "IT 421",
    "IT 425L",
    "IT 461L",
    "IT 456",
    "IT 460",
    "IT 485"
  ],

  track: [
    "IT 220",
    "IT 221",
    "IT 420",
    "IT 421",
    "SOCIOL 104"
  ],

  core: [
    "SEMINR 126G",
    "IMS 200",
    "ENGL 101",
    "ENGL 102",
    "MATH 115",
    "MATH 135",
    "MATH 140"
  ]
},

    {
  name: "Information Architecture Track (CSM)",
  subject: "IT",
  degree: "BS",
  minCredits: 120,
  creditCap: 16,
  notes: "8-semester plan (Freshman–Senior Fall/Spring), 5 courses per semester, 30 credits planned each year, 15–16 credits max per term, target 120 total credits (121–123 allowed if needed). First Year Seminar only in Freshman year. Intermediate Seminar only in Sophomore year. ENGL 101 is placed in Freshman Fall and ENGL 102 is placed in Freshman Spring. Includes 9+ Distribution II courses across AR, HU, SB, NS, MT, WL, and WC.",

  roadmapFlat: [
    // Freshman Fall (16)
    "SEMINR 126G", "ENGL 101", "MATH 115", "IT 110", "ART 100",
    // Freshman Spring (16)
    "ENGL 102", "IT 111L", "IT 114L", "IT 116", "SPAN 101",
    // Sophomore Fall (16)
    "IMS 200", "IT 230L", "IT 240", "MATH 135", "ECON 101",
    // Sophomore Spring (15)
    "IT 244", "IT 246", "IT 285L", "MATH 140", "BIOL 101",
    // Junior Fall (15)
    "IT 341", "IT 220", "IT 360", "IT 370", "PHIL 100",
    // Junior Spring (15)
    "IT 425L", "IT 428L", "IT 456", "IT 461L", "HIST 211",
    // Senior Fall (15)
    "IT 460", "IT 471", "AF 210", "AFRSTY 101", "SOCIOL 262",
    // Senior Spring (16)
    "IT 485", "AF 211", "POLSCI 102", "ANTH 106", "SPAN 102"
  ],

  major: [
    "IT 110",
    "IT 111L",
    "IT 114L",
    "IT 116",
    "IT 230L",
    "IT 240",
    "IT 244",
    "IT 246",
    "IT 285L",
    "IT 341",
    "IT 220",
    "IT 360",
    "IT 370",
    "IT 425L",
    "IT 428L",
    "IT 456",
    "IT 461L",
    "IT 460",
    "IT 471",
    "IT 485"
  ],

  track: [
    "IT 360",
    "IT 428L",
    "IT 456",
    "IT 461L"
  ],

  core: [
    "SEMINR 126G",
    "IMS 200",
    "ENGL 101",
    "ENGL 102",
    "MATH 115",
    "MATH 135",
    "MATH 140"
  ]
},

{
  name: "System Administration Track (CSM)",
  subject: "IT",
  degree: "BS",
  minCredits: 120,
  creditCap: 16,
  notes: "8-semester plan (Freshman–Senior Fall/Spring), 5 courses per semester, 30 credits planned each year, 15–16 credits max per term, target 120 total credits (121–123 allowed if needed). First Year Seminar only in Freshman year. Intermediate Seminar only in Sophomore year. ENGL 101 is placed in Freshman Fall and ENGL 102 is placed in Freshman Spring. Includes 9+ Distribution II courses across AR, HU, SB, NS, MT, WL, and WC.",

  roadmapFlat: [
    // Freshman Fall (16)
    "SEMINR 126G", "ENGL 101", "IT 110", "ART 100", "MATH 125",
    // Freshman Spring (16)
    "ENGL 102", "IT 111L", "IT 114L", "IT 116", "SPAN 101",
    // Sophomore Fall (16)
    "IMS 200", "IT 230L", "IT 240", "MATH 135", "IT 244",
    // Sophomore Spring (15)
    "ECON 101", "IT 246", "IT 285L", "MATH 140", "IT 341",
    // Junior Fall (15)
    "IT 442", "IT 360", "IT 370", "BIOL 101", "PHIL 100",
    // Junior Spring (15)
    "IT 425L", "IT 443", "IT 461L", "IT 428L", "HIST 211",
    // Senior Fall (15)
    "IT 444", "IT 460", "IT 471", "AF 210", "AFRSTY 101",
    // Senior Spring (15)
    "IT 485", "AF 211", "SOCIOL 262", "POLSCI 102", "ANTH 106"
  ],

  major: [
    "IT 110",
    "IT 111L",
    "IT 114L",
    "IT 116",
    "IT 230L",
    "IT 240",
    "IT 244",
    "IT 246",
    "IT 285L",
    "IT 442",
    "IT 341",
    "IT 360",
    "IT 370",
    "IT 425L",
    "IT 443",
    "IT 461L",
    "IT 428L",
    "IT 444",
    "IT 460",
    "IT 471",
    "IT 485"
  ],

  track: [
    "IT 341",
    "IT 442",
    "IT 443",
    "IT 444"
  ],

  core: [
    "SEMINR 126G",
    "IMS 200",
    "ENGL 101",
    "ENGL 102",
    "MATH 125",
    "MATH 135",
    "MATH 140"
  ]
},

    {
  name: "Media and Culture Track",
  subject: "AMST",
  degree: "BA",
  minCredits: 120,
  creditCap: 16,
  notes: "8-semester plan (Freshman–Senior Fall/Spring), 5 courses per semester, 30 credits planned each year, 15–16 credits max per term, target 120 total credits (121–123 allowed if needed). First Year Seminar only in Freshman year. Intermediate Seminar only in Sophomore year. ENGL 101 is placed in Freshman Fall and ENGL 102 is placed in Freshman Spring. Includes 11+ Distribution II courses across AR, HU, SB, NS, MT, WL, and WC.",

  roadmapFlat: [
    // Freshman Fall (15)
    "SEMINR 126G", "ENGL 101", "AMST 100", "ART 100", "MATH 115",
    // Freshman Spring (16)
    "ENGL 102", "AMST 101", "AMST 210", "SPAN 101", "PSYCH 100",
    // Sophomore Fall (16)
    "IMS 200", "AMST 278L", "AMST 285L", "PHIL 100", "BIOL 101",
    // Sophomore Spring (16)
    "AMST 310", "AMST 335", "AMST 352L", "SPAN 102", "ECON 101",
    // Junior Fall (15)
    "AMST 343L", "AMST 350L", "AMST 355L", "HIST 211", "IT 110",
    // Junior Spring (15)
    "AMST 372L", "AMST 375", "AMST 376", "SOCIOL 101", "CHEM 111L",
    // Senior Fall (15)
    "AMST 402L", "AMST 405", "AMST 430", "AFRSTY 101", "CLSICS 161",
    // Senior Spring (15)
    "AMST 440L", "AMST 470L", "AMST 471L", "ANTH 256", "AMST 211"
  ],

  major: [
    "AMST 100",
    "AMST 101",
    "AMST 210",
    "AMST 278L",
    "AMST 285L",
    "AMST 310",
    "AMST 335",
    "AMST 352L",
    "AMST 343L",
    "AMST 350L",
    "AMST 355L",
    "AMST 372L",
    "AMST 375",
    "AMST 376",
    "AMST 402L",
    "AMST 405",
    "AMST 430",
    "AMST 440L",
    "AMST 470L",
    "AMST 471L",
    "AMST 211"
  ],

  track: [
    "AMST 352L",
    "AMST 355L",
    "AMST 375"
  ],

  core: [
    "SEMINR 126G",
    "IMS 200",
    "ENGL 101",
    "ENGL 102",
    "MATH 115"
  ]
},

    {
  name: "Migration and Empire Track",
  subject: "AMST",
  degree: "BA",
  minCredits: 120,
  creditCap: 16,
  notes: "8-semester plan (Freshman–Senior Fall/Spring), 5 courses per semester, 30 credits planned each year, 15–16 credits max per term, target 120 total credits (121–123 allowed if needed). First Year Seminar only in Freshman year. Intermediate Seminar only in Sophomore year. ENGL 101 is placed in Freshman Fall and ENGL 102 is placed in Freshman Spring. Includes 11+ Distribution II courses across AR, HU, SB, NS, MT, WL, and WC.",

  roadmapFlat: [
    // Freshman Fall (15)
    "SEMINR 126G", "ENGL 101", "AMST 100", "ART 100", "MATH 115",
    // Freshman Spring (15)
    "ENGL 102", "AMST 101", "AMST 201L", "SPAN 101", "PHIL 100",
    // Sophomore Fall (15)
    "IMS 200", "AMST 210", "AMST 203", "HIST 211", "BIOL 101",
    // Sophomore Spring (15)
    "AMST 278L", "AMST 285L", "ECON 101", "SPAN 102", "CHEM 111L",
    // Junior Fall (15)
    "AMST 310", "AMST 225L", "AMST 343L", "AFRSTY 101", "SOCIOL 101",
    // Junior Spring (15)
    "AMST 335", "AMST 350L", "AMST 372L", "CLSICS 161", "IT 110",
    // Senior Fall (15)
    "AMST 376", "AMST 402L", "AMST 405", "AMST 430", "ANTH 256",
    // Senior Spring (15)
    "AF 210", "AMST 270L", "HIST 175", "POLSCI 202", "PSYCH 100"
  ],

  major: [
    "AMST 100",
    "AMST 101",
    "AMST 201L",
    "AMST 210",
    "AMST 203",
    "AMST 278L",
    "AMST 285L",
    "AMST 310",
    "AMST 225L",
    "AMST 343L",
    "AMST 335",
    "AMST 350L",
    "AMST 372L",
    "AMST 376",
    "AMST 402L",
    "AMST 405",
    "AMST 430",
    "AMST 250",
    "AMST 270L",
    "AMST 353"
  ],

  track: [
    "AMST 201L",
    "AMST 203",
    "AMST 225L",
    "AMST 270L",
    "AMST 285L"
  ],

  core: [
    "SEMINR 126G",
    "IMS 200",
    "ENGL 101",
    "ENGL 102",
    "MATH 115"
  ]
},

    {
  name: "Social Movement and Identity Formation Track",
  subject: "AMST",
  degree: "BA",
  minCredits: 120,
  creditCap: 16,
  notes: "8-semester plan (Freshman–Senior Fall/Spring), 5 courses per semester, 30 credits planned each year, 15–16 credits max per term, target 120 total credits (121–123 allowed if needed). First Year Seminar only in Freshman year. Intermediate Seminar only in Sophomore year. ENGL 101 is placed in Freshman Fall and ENGL 102 is placed in Freshman Spring. Includes 11+ Distribution II courses across AR, HU, SB, NS, MT, WL, and WC.",

  roadmapFlat: [
    // Freshman Fall (15)
    "SEMINR 126G", "ENGL 101", "AMST 100", "ART 100", "MATH 115",
    // Freshman Spring (15)
    "ENGL 102", "AMST 101", "AMST 206", "SPAN 101", "PHIL 100",
    // Sophomore Fall (15)
    "IMS 200", "AMST 210", "AMST 209", "HIST 211", "BIOL 101",
    // Sophomore Spring (15)
    "AMST 278L", "AMST 285L", "AMST 212G", "SPAN 102", "ECON 101",
    // Junior Fall (15)
    "AMST 310", "AMST 223L", "AMST 343L", "AFRSTY 101", "SOCIOL 101",
    // Junior Spring (15)
    "AMST 335", "AMST 228L", "AMST 350L", "CLSICS 161", "CHEM 111L",
    // Senior Fall (15)
    "AMST 372L", "AMST 402L", "AMST 405", "AMST 430", "IT 110",
    // Senior Spring (15)
    "AMST 325L", "AMST 353L", "AMST 360", "POLSCI 102", "ANTH 256"
  ],

  major: [
    "AMST 100",
    "AMST 101",
    "AMST 206",
    "AMST 210",
    "AMST 209",
    "AMST 278L",
    "AMST 285L",
    "AMST 212G",
    "AMST 310",
    "AMST 223L",
    "AMST 343L",
    "AMST 335",
    "AMST 228L",
    "AMST 350L",
    "AMST 372L",
    "AMST 402L",
    "AMST 405",
    "AMST 430",
    "AMST 325L",
    "AMST 353L",
    "AMST 360"
  ],

  track: [
    "AMST 350L",
    "AMST 353L",
    "AMST 360"
  ],

  core: [
    "SEMINR 126G",
    "IMS 200",
    "ENGL 101",
    "ENGL 102",
    "MATH 115"
  ]
},

    {
  name: "East Asian Studies Track",
  subject: "ASIAN",
  degree: "BA",
  minCredits: 120,
  creditCap: 16,
  notes: "8-semester plan (Freshman–Senior Fall/Spring), 5 courses per semester, 30 credits planned each year, 15–16 credits max per term, target 120 total credits (121–123 allowed if needed). First Year Seminar only in Freshman year. Intermediate Seminar only in Sophomore year. ENGL 101 is placed in Freshman Fall and ENGL 102 is placed in Freshman Spring. Includes 11+ Distribution II courses across AR, HU, SB, NS, MT, WL, and WC.",

  roadmapFlat: [
    // Freshman Fall (15)
    "SEMINR 126G", "ENGL 101", "HIST 115L", "ART 100", "MATH 115",
    // Freshman Spring (16)
    "ENGL 102", "HIST 161L", "CHINSE 201", "PSYCH 100", "PHIL 100",
    // Sophomore Fall (16)
    "IMS 200", "PHIL 297", "CHINSE 202", "BIOL 101", "ECON 101",
    // Sophomore Spring (15)
    "ASIAN 314L", "ASIAN 358L", "SPAN 101", "CHEM 111L", "SOCIOL 101",
    // Junior Fall (15)
    "ASIAN 488L", "CHINSE 301", "CHINSE 302", "AFRSTY 101", "CLSICS 161",
    // Junior Spring (15)
    "CHINSE 305", "CHINSE 315", "ASIAN 357L", "HIST 211", "IT 110",
    // Senior Fall (15)
    "CHINSE 320", "ASIAN 359L", "ASIAN 361L", "ANTH 256", "POLSCI 102",
    // Senior Spring (15)
    "ASIAN 363L", "ART 256", "RELSTY 112L", "THRART 122", "ENVSCI 101"
  ],

  major: [
    "CHINSE 201",
    "CHINSE 202",
    "ASIAN 314L",
    "ASIAN 358L",
    "ASIAN 488L",
    "CHINSE 301",
    "CHINSE 302",
    "CHINSE 305",
    "CHINSE 315",
    "ASIAN 357L",
    "CHINSE 320",
    "ASIAN 359L",
    "ASIAN 361L",
    "ASIAN 363L"
  ],

  track: [
    "CHINSE 201",
    "CHINSE 202",
    "CHINSE 302",
    "CHINSE 305",
    "CHINSE 315"
  ],

  core: [
    "SEMINR 126G",
    "IMS 200",
    "ENGL 101",
    "ENGL 102",
    "MATH 115"
  ]
},

    {
  name: "South Asian Studies Track",
  subject: "ASIAN",
  degree: "BA",
  minCredits: 120,
  creditCap: 16,
  notes: "8-semester plan (Freshman–Senior Fall/Spring), 5 courses per semester, 30 credits planned each year, 15–16 credits max per term, target 120 total credits (121–123 allowed if needed). First Year Seminar only in Freshman year. Intermediate Seminar only in Sophomore year. ENGL 101 is placed in Freshman Fall and ENGL 102 is placed in Freshman Spring. Includes 11+ Distribution II courses across AR, HU, SB, NS, MT, WL, and WC.",

  roadmapFlat: [
    // Freshman Fall (15)
    "SEMINR 126G", "ENGL 101", "HIST 115L", "ART 100", "MATH 115",
    // Freshman Spring (15)
    "ENGL 102", "HIST 161L", "ASAMST 226", "PSYCH 100", "PHIL 297",
    // Sophomore Fall (15)
    "IMS 200", "ASIAN 215L", "ASIAN 233L", "BIOL 101", "ECON 101",
    // Sophomore Spring (15)
    "ASIAN 235L", "ASIAN 239L", "SPAN 101", "CHEM 111L", "ECON 102",
    // Junior Fall (15)
    "ASIAN 488L", "ASIAN 314L", "ASIAN 345L", "AFRSTY 101", "CLSICS 161",
    // Junior Spring (15)
    "ASIAN 355L", "ASIAN 357L", "HIST 364L", "SOCIOL 101", "IT 110",
    // Senior Fall (15)
    "ECON 336", "ECON 337", "SOCIOL 355L", "ANTH 256", "POLSCI 365",
    // Senior Spring (15)
    "SOCIOL 375L", "POLSCI 365", "RELSTY 314L", "THRART 122", "ENVSCI 101"
  ],

  major: [
    "ASAMST 226",
    "ASIAN 215L",
    "ASIAN 233L",
    "ASIAN 235L",
    "ASIAN 239L",
    "ASIAN 488L",
    "ASIAN 314L",
    "ASIAN 345L",
    "ASIAN 355L",
    "ASIAN 357L"
  ],

  track: [
    "RELSTY 314L",
    "ASIAN 314L",
    "ASIAN 355L",
    "ASIAN 357L"
  ],

  core: [
    "SEMINR 126G",
    "IMS 200",
    "ENGL 101",
    "ENGL 102",
    "MATH 115"
  ]
},

    {
  name: "Biotechnology Track",
  subject: "BIOL",
  degree: "BS",
  minCredits: 120,
  creditCap: 16,
  notes: "8-semester plan (Freshman–Senior Fall/Spring), 5 courses per semester, 30 credits planned each year, 15–16 credits max per term, target 120 total credits (121–123 allowed if needed). First Year Seminar only in Freshman year. Intermediate Seminar only in Sophomore year. ENGL 101 is placed in Freshman Fall and ENGL 102 is placed in Freshman Spring. Includes 9 Distribution II courses across AR, HU, SB, NS, MT, WL, and WC. Biotechnology requirements represented here include: Intro Biology (BIOL 111, BIOL 112); Chemistry with Labs (CHEM 115 & 117, CHEM 116 & 118); Math (MATH 135); Physics with Labs (PHYSIC 107, PHYSIC 171, PHYSIC 108, PHYSIC 172); Intermediate Biology (BIOL 210, BIOL 252, BIOL 290); Organic Chemistry (CHEM 251 & 255, CHEM 252 & 256); Required Advanced Biology courses selected in this roadmap (BIOL 304, BIOL 308, BIOL 318, BIOL 319, BIOL 329, BIOL 354, BIOL 370, BIOCHM 383); and approved lab work satisfied through CHEM 255, CHEM 256, BIOL 334, and BIOCHM 385.",

  roadmapFlat: [
    // Freshman Fall (15–16)
    "SEMINR 126G", "ENGL 101", "BIOL 111", "CHEM 115", "CHEM 117",
    // Freshman Spring (15–16)
    "ENGL 102", "BIOL 112", "CHEM 116", "PHYSIC 107", "MATH 135",
    // Sophomore Fall (15–16)
    "IMS 200", "CHEM 118", "PHYSIC 171", "BIOL 210", "POLSCI 202",
    // Sophomore Spring (15–16)
    "PHYSIC 108", "PHYSIC 172", "BIOL 252", "BIOL 290", "SOCIOL 101",
    // Junior Fall (15–16)
    "CHEM 251", "CHEM 255", "BIOL 304", "BIOL 308", "AFRSTY 101",
    // Junior Spring (15–16)
    "CHEM 252", "CHEM 256", "BIOL 318", "BIOL 319", "SPAN 101",
    // Senior Fall (15–16)
    "BIOL 329", "BIOL 334", "BIOL 354", "ENGL 135", "HIST 175",
    // Senior Spring (15–16)
    "BIOCHM 383", "BIOCHM 385", "ART 100", "ECON 102", "CLSICS 161"
  ],

  major: [
    "BIOL 111",
    "BIOL 112",
    "BIOL 210",
    "BIOL 252",
    "BIOL 290",
    "BIOL 304",
    "BIOL 308",
    "BIOL 318",
    "BIOL 319",
    "BIOL 329",
    "BIOL 334",
    "BIOL 354",
    "BIOCHM 383",
    "BIOCHM 385"
  ],

  track: [
    "BIOL 318",
    "BIOL 319",
    "BIOL 329",
    "BIOL 354",
    "BIOL 334",
    "BIOL 370",
    "BIOCHM 383",
    "BIOCHM 385"
  ],

  core: [
    "SEMINR 126G",
    "IMS 200",
    "ENGL 101",
    "ENGL 102",
    "MATH 135",
    "CHEM 115",
    "CHEM 117",
    "CHEM 116",
    "CHEM 118",
    "CHEM 251",
    "CHEM 255",
    "CHEM 252",
    "CHEM 256",
    "PHYSIC 107",
    "PHYSIC 171",
    "PHYSIC 108",
    "PHYSIC 172"
  ]
},

    {
  name: "Community Health Concentration",
  subject: "UPCD",
  degree: "BA",
  minCredits: 120,
  creditCap: 16,
  notes: "8-semester plan (Freshman–Senior Fall/Spring), 5 courses per semester, 30 credits planned each year, 15–16 credits max per term, target 120 total credits (121–123 allowed if needed). First Year Seminar only in Freshman year. Intermediate Seminar only in Sophomore year. ENGL 101 is placed in Freshman Fall and ENGL 102 is placed in Freshman Spring. Includes 11 Distribution II courses across AR, HU, SB, NS, MT, WL, and WC. Community Health Concentration requirements represented here include: 100-level core (ECON 101, ENVSTY 101, UPCD 120L); statistics/quantitative requirement (MATH 125); 200-level core (UPCD 201, UPCD 210, ENVSCI 281); methods (UPCD 301, UPCD 303); practicum (UPCD 457); seminars (ENVSTY 210, ENVSTY 310); 300/400-level electives selected in this roadmap (UPCD 321, UPCD 351L, UPCD 353L, ENVSCI 340L); and diversity courses (POLSCI 202 and HIST 175).",

  roadmapFlat: [
    // Freshman Fall (15–16)
    "SEMINR 126G", "ENGL 101", "ECON 101", "ENVSTY 101", "ART 100",
    // Freshman Spring (15–16)
    "ENGL 102", "UPCD 120L", "MATH 125", "BIOL 101", "SPAN 101",
    // Sophomore Fall (15–16)
    "IMS 200", "UPCD 201", "UPCD 210", "ENVSCI 101", "CHEM 111L",
    // Sophomore Spring (15–16)
    "ENVSCI 281", "UPCD 301", "UPCD 303", "HIST 175", "SPAN 102",
    // Junior Fall (15–16)
    "ENVSTY 210", "UPCD 321", "UPCD 351L", "POLSCI 202", "AFRSTY 101",
    // Junior Spring (15–16)
    "ENVSTY 310", "UPCD 353L", "ENVSCI 340L", "HIST 211", "PSYCH 100",
    // Senior Fall (15–16)
    "UPCD 457", "ENVSCI 476", "SOCIOL 101", "CLSICS 161", "IT 110",
    // Senior Spring (15–16)
    "ANTH 106", "PHIL 100", "MUSIC 117", "DANCE 135", "THRART 122"
  ],

  major: [
    "ENVSTY 101",
    "UPCD 120L",
    "UPCD 201",
    "UPCD 210",
    "ENVSCI 281",
    "UPCD 301",
    "UPCD 303",
    "ENVSTY 210",
    "UPCD 321",
    "UPCD 351L",
    "ENVSTY 310",
    "UPCD 353L",
    "ENVSCI 340L",
    "UPCD 457",
    "ENVSCI 476",
    "ENVSCI 101"
  ],

  core: [
    "SEMINR 126G",
    "IMS 200",
    "ENGL 101",
    "ENGL 102",
    "MATH 125"
  ]
},
{
  name: "Economic Development Concentration",
  subject: "UPCD",
  degree: "BA",
  minCredits: 120,
  creditCap: 16,
  notes: "8-semester plan (Freshman–Senior Fall/Spring), 5 courses per semester, 30 credits planned each year, 15–16 credits max per term, target 120 total credits (121–123 allowed if needed). First Year Seminar only in Freshman year. Intermediate Seminar only in Sophomore year. ENGL 101 is placed in Freshman Fall and ENGL 102 is placed in Freshman Spring. Includes 11 Distribution II courses across AR, HU, SB, NS, MT, WL, and WC. Economic Development Concentration requirements represented here include: 100-level core (ECON 101, ENVSTY 101, UPCD 120L); statistics/quantitative requirement (MATH 125); 200-level core (UPCD 201, UPCD 210, ENVSCI 281); methods (UPCD 301, UPCD 303); practicum (UPCD 457); seminars (ENVSTY 210, ENVSTY 310); 300/400-level electives selected in this roadmap (UPCD 321, UPCD 351L, UPCD 353L, ENVSCI 340L); and diversity courses (POLSCI 202 and HIST 175).",

  roadmapFlat: [
    // Freshman Fall (15–16)
    "SEMINR 126G", "ENGL 101", "ECON 101", "ENVSTY 101", "ART 100",
    // Freshman Spring (15–16)
    "ENGL 102", "UPCD 120L", "MATH 125", "BIOL 101", "SPAN 101",
    // Sophomore Fall (15–16)
    "IMS 200", "UPCD 201", "UPCD 210", "ENVSCI 101", "CHEM 111L",
    // Sophomore Spring (15–16)
    "ENVSCI 281", "UPCD 301", "UPCD 303", "HIST 175", "SPAN 102",
    // Junior Fall (15–16)
    "ENVSTY 210", "UPCD 321", "UPCD 351L", "POLSCI 202", "AFRSTY 101",
    // Junior Spring (15–16)
    "ENVSTY 310", "UPCD 353L", "ENVSCI 340L", "HIST 211", "PSYCH 100",
    // Senior Fall (15–16)
    "UPCD 364L", "ENVSCI 476", "SOCIOL 101", "CLSICS 161", "IT 110",
    // Senior Spring (15–16)
    "ANTH 106", "PHIL 100", "MUSIC 117", "DANCE 135", "THRART 122"
  ],

  major: [
    "ENVSTY 101",
    "UPCD 120L",
    "UPCD 201",
    "UPCD 210",
    "ENVSCI 281",
    "UPCD 301",
    "UPCD 303",
    "ENVSTY 210",
    "UPCD 321",
    "UPCD 351L",
    "ENVSTY 310",
    "UPCD 353L",
    "ENVSCI 340L",
    "UPCD 364L",
    "ENVSCI 476",
    "ENVSCI 101"
  ],

  core: [
    "SEMINR 126G",
    "IMS 200",
    "ENGL 101",
    "ENGL 102",
    "MATH 125"
  ]
},
    
   {
  name: "Early Childhood Licensure Prek-2 Concentration",
  subject: "ECHD",
  degree: "BA",
  minCredits: 120,
  creditCap: 16,
  notes: "8-semester plan (Freshman–Senior Fall/Spring), 5 courses per semester, 30 credits planned each year, 15–16 credits max per term, target 120 total credits (121–123 allowed if needed). First Year Seminar only in Freshman year. Intermediate Seminar only in Sophomore year. ENGL 101 is placed in Freshman Fall and ENGL 102 is placed in Freshman Spring. Includes 11 Distribution II courses across AR, HU, SB, NS, MT, WL, and WC. Early Childhood Licensure Prek-2 Concentration requirements represented here include: foundation course (ECHD 201); 200-level courses (ECHD 211, ECHD 221); upper-level courses (ECHD 317, ECHD 422, ECHD 440, ECHD 435, EDC U 406); required courses (ECHD 441, EDC U 446, EDC U 451); internship courses (ECHD 490, ECHD 494); and diversity courses (POLSCI 202 and HIST 175).",

  roadmapFlat: [
    // Freshman Fall (15–16)
    "SEMINR 126G", "ENGL 101", "ECHD 201", "ART 100", "PSYCH 100",
    // Freshman Spring (15–16)
    "ENGL 102", "ECHD 211", "ECHD 221", "MATH 115", "SPAN 101",
    // Sophomore Fall (15–16)
    "IMS 200", "ECHD 317", "PHIL 100", "BIOL 101", "HIST 211",
    // Sophomore Spring (15–16)
    "ECHD 422", "ECHD 435", "CHEM 111L", "POLSCI 202", "SPAN 102",
    // Junior Fall (15–16)
    "ECHD 440", "EDC U 406", "SOCIOL 101", "AFRSTY 101", "IT 110",
    // Junior Spring (15–16)
    "ECHD 441", "EDC U 446", "HIST 175", "ECON 101", "CLSICS 161",
    // Senior Fall (15–16)
    "EDC U 451", "ECHD 490", "ANTH 106", "ENVSCI 101", "MUSIC 117",
    // Senior Spring (15–16)
    "ECHD 494", "DANCE 135", "THRART 122", "LATAM 101"
  ],

  major: [
    "ECHD 201",
    "ECHD 211",
    "ECHD 221",
    "ECHD 317",
    "EDC U 406",
    "ECHD 422",
    "ECHD 435",
    "ECHD 440",
    "ECHD 441",
    "ECHD 490",
    "ECHD 494"
  ],

  concentration: [
    "ECHD 441",
    "EDC U 446",
    "EDC U 451"
  ],

  core: [
    "SEMINR 126G",
    "IMS 200",
    "ENGL 101",
    "ENGL 102",
    "MATH 115"
  ]
},

    {
  name: "Early Intervention Concentration",
  subject: "ECHD",
  degree: "BA",
  minCredits: 120,
  creditCap: 16,
  notes: "8-semester plan (Freshman–Senior Fall/Spring), 5 courses per semester, 30 credits planned each year, 15–16 credits max per term, target 120 total credits (121–123 allowed if needed). First Year Seminar only in Freshman year. Intermediate Seminar only in Sophomore year. ENGL 101 is placed in Freshman Fall and ENGL 102 is placed in Freshman Spring. Includes 11 Distribution II courses across AR, HU, SB, NS, MT, WL, and WC. Early Intervention Concentration requirements represented here include: foundation course (ECHD 201); 200-level courses (ECHD 211, ECHD 221); required courses (ECHD 208, ECHD 466, ECHD 453); internship courses (ECHD 290, ECHD 493); and diversity courses (POLSCI 202 and HIST 175).",

  roadmapFlat: [
    // Freshman Fall (15–16)
    "SEMINR 126G", "ENGL 101", "ECHD 201", "ART 100", "PSYCH 100",
    // Freshman Spring (15–16)
    "ENGL 102", "ECHD 211", "ECHD 221", "MATH 115", "SPAN 101",
    // Sophomore Fall (15–16)
    "IMS 200", "ECHD 208", "PHIL 100", "BIOL 101", "HIST 211",
    // Sophomore Spring (15–16)
    "ECHD 466", "ECHD 453", "CHEM 111L", "POLSCI 202", "SPAN 102",
    // Junior Fall (15–16)
    "ECHD 290", "SOCIOL 101", "AFRSTY 101", "IT 110", "ECON 101",
    // Junior Spring (15–16)
    "ENGL 135", "ENVSCI 101", "CLSICS 161", "HIST 175",
    // Senior Fall (15–16)
    "DANCE 135", "THRART 122", "LATAM 101", "MUSIC 117", "MATH 125",
    // Senior Spring (15–16)
    "POLSCI 102", "ANTH 256", "ECHD 493", "AMST 101", "COMM 100"
  ],

  major: [
    "ECHD 201",
    "ECHD 211",
    "ECHD 221",
    "ECHD 208",
    "ECHD 466",
    "ECHD 453",
    "ECHD 290",
    "ECHD 493"
  ],

  concentration: [
    "ECHD 208",
    "ECHD 466",
    "ECHD 453"
  ],

  core: [
    "SEMINR 126G",
    "IMS 200",
    "ENGL 101",
    "ENGL 102",
    "MATH 115",
    "MATH 125"
  ]
},

{
  name: "Infant/toddler Early Intervention Concentration",
  subject: "ECHD",
  degree: "BA",
  minCredits: 120,
  creditCap: 16,
  notes: "8-semester plan (Freshman–Senior Fall/Spring), 5 courses per semester, 30 credits planned each year, 15–16 credits max per term, target 120 total credits (121–123 allowed if needed). First Year Seminar only in Freshman year. Intermediate Seminar only in Sophomore year. ENGL 101 is placed in Freshman Fall and ENGL 102 is placed in Freshman Spring. Includes 11 Distribution II courses across AR, HU, SB, NS, MT, WL, and WC. Infant/toddler Early Intervention Concentration requirements represented here include: foundation course (ECHD 201); 200-level courses (ECHD 211, ECHD 221); required courses (ECHD 441, EDC U 446, EDC U 451, ECHD 208, ECHD 466); upper-level courses (ECHD 317, ECHD 422, ECHD 440, ECHD 435, EDC U 406); internship courses (ECHD 490, ECHD 494); elective courses (ENGL 335, ANTH 301L, ANTH 385, PSYCH 210, PSYCH 441, SOCIOL 242); and diversity courses (POLSCI 202 and HIST 175).",

  roadmapFlat: [
    // Freshman Fall (15–16)
    "SEMINR 126G", "ENGL 101", "ECHD 201", "ART 100", "PSYCH 100",
    // Freshman Spring (15–16)
    "ENGL 102", "ECHD 211", "ECHD 221", "MATH 115", "SPAN 101",
    // Sophomore Fall (15–16)
    "IMS 200", "ECHD 208", "PHIL 100", "BIOL 101", "HIST 211",
    // Sophomore Spring (15–16)
    "ECHD 317", "ECHD 422", "CHEM 111L", "POLSCI 202", "SPAN 102",
    // Junior Fall (15–16)
    "ECHD 440", "ECHD 435", "EDC U 406", "SOCIOL 101", "AFRSTY 101",
    // Junior Spring (15–16)
    "ECHD 441", "EDC U 446", "EDC U 451", "IT 110", "ECON 101",
    // Senior Fall (15–16)
    "ECHD 466", "ECHD 490", "HIST 175", "CLSICS 161", "LATAM 101",
    // Senior Spring (15–16)
    "ECHD 494", "ENGL 335", "ENVSCI 101", "MUSIC 117", "THRART 122"
  ],

  major: [
    "ECHD 201",
    "ECHD 211",
    "ECHD 221",
    "ECHD 208",
    "ECHD 317",
    "ECHD 422",
    "ECHD 440",
    "ECHD 435",
    "EDC U 406",
    "ECHD 441",
    "EDC U 446",
    "EDC U 451",
    "ECHD 466",
    "ECHD 490",
    "ECHD 494"
  ],

  concentration: [
    "ECHD 208",
    "ECHD 466",
    "ECHD 441",
    "EDC U 446",
    "EDC U 451"
  ],

  core: [
    "SEMINR 126G",
    "IMS 200",
    "ENGL 101",
    "ENGL 102",
    "MATH 115"
  ]
},

    {
  name: "Infant/Toddler Education Concentration",
  subject: "ECHD",
  degree: "BA",
  minCredits: 120,
  creditCap: 16,
  notes: "8-semester plan (Freshman–Senior Fall/Spring), 5 courses per semester, 30 credits planned each year, 15–16 credits max per term, target 120 total credits (121–123 allowed if needed). First Year Seminar only in Freshman year. Intermediate Seminar only in Sophomore year. ENGL 101 is placed in Freshman Fall and ENGL 102 is placed in Freshman Spring. Includes 11 Distribution II courses across AR, HU, SB, NS, MT, WL, and WC. Infant/Toddler Education Concentration requirements represented here include: foundation course (ECHD 201); 200-level courses (ECHD 211, ECHD 221); upper-level courses (ECHD 317, ECHD 422, ECHD 440, ECHD 435, EDC U 406); required courses (ECHD 208, ECHD 466, ECHD 430); internship courses (ECHD 290, ECHD 493); and diversity courses (POLSCI 202 and HIST 175).",

  roadmapFlat: [
    // Freshman Fall (15–16)
    "SEMINR 126G", "ENGL 101", "ECHD 201", "ART 100", "PSYCH 100",
    // Freshman Spring (15–16)
    "ENGL 102", "ECHD 211", "ECHD 221", "MATH 115", "SPAN 101",
    // Sophomore Fall (15–16)
    "IMS 200", "ECHD 208", "PHIL 100", "BIOL 101", "HIST 211",
    // Sophomore Spring (15–16)
    "ECHD 317", "ECHD 422", "CHEM 111L", "POLSCI 202", "SPAN 102",
    // Junior Fall (15–16)
    "ECHD 440", "ECHD 435", "EDC U 406", "SOCIOL 101", "AFRSTY 101",
    // Junior Spring (15–16)
    "ECHD 466", "ECHD 430", "IT 110", "ECON 101", "CLSICS 161",
    // Senior Fall (15–16)
    "ECHD 290", "HIST 175", "LATAM 101", "MUSIC 117", "THRART 122",
    // Senior Spring (15–16)
    "ECHD 493", "ENVSCI 101", "DANCE 135", "ANTH 256", "MATH 125"
  ],

  major: [
    "ECHD 201",
    "ECHD 211",
    "ECHD 221",
    "ECHD 208",
    "ECHD 317",
    "ECHD 422",
    "ECHD 440",
    "ECHD 435",
    "EDC U 406",
    "ECHD 466",
    "ECHD 430",
    "ECHD 290",
    "ECHD 493"
  ],

  concentration: [
    "ECHD 208",
    "ECHD 466",
    "ECHD 430"
  ],

  core: [
    "SEMINR 126G",
    "IMS 200",
    "ENGL 101",
    "ENGL 102",
    "MATH 115",
  ]
},

   {
  name: "Leadership & Administration Concentration",
  subject: "ECHD",
  degree: "BA",
  minCredits: 120,
  creditCap: 16,
  notes: "8-semester plan (Freshman–Senior Fall/Spring), 5 courses per semester, 30 credits planned each year, 15–16 credits max per term, target 120 total credits (121–123 allowed if needed). First Year Seminar only in Freshman year. Intermediate Seminar only in Sophomore year. ENGL 101 is placed in Freshman Fall and ENGL 102 is placed in Freshman Spring. Includes 11 Distribution II courses across AR, HU, SB, NS, MT, WL, and WC. Leadership & Administration Concentration requirements represented here include: foundation course (ECHD 201); 200-level courses (ECHD 211, ECHD 221); upper-level courses (ECHD 317, ECHD 422, ECHD 440, ECHD 435, EDC U 406); required courses (ECHD 450, ECHD 453, ECHD 459); internship courses (ECHD 290, ECHD 493); and diversity courses (POLSCI 202 and HIST 175).",

  roadmapFlat: [
    // Freshman Fall (15–16)
    "SEMINR 126G", "ENGL 101", "ECHD 201", "ART 100", "PSYCH 100",
    // Freshman Spring (15–16)
    "ENGL 102", "ECHD 211", "ECHD 221", "MATH 115", "SPAN 101",
    // Sophomore Fall (15–16)
    "IMS 200", "ECHD 317", "MATH 125", "BIOL 101", "HIST 211",
    // Sophomore Spring (15–16)
    "ECHD 422", "ECHD 440", "CHEM 111L", "POLSCI 202", "SPAN 102",
    // Junior Fall (15–16)
    "ECHD 435", "EDC U 406", "ECHD 450", "SOCIOL 101", "AFRSTY 101",
    // Junior Spring (15–16)
    "ECHD 453", "ECHD 459", "IT 110", "ECON 101", "CLSICS 161",
    // Senior Fall (15–16)
    "ECHD 290", "HIST 175", "LATAM 101", "MUSIC 117", "THRART 122",
    // Senior Spring (15–16)
    "ECHD 493", "ENVSCI 101", "DANCE 135", "ANTH 256", "PHIL 100"
  ],

  major: [
    "ECHD 201",
    "ECHD 211",
    "ECHD 221",
    "ECHD 317",
    "ECHD 422",
    "ECHD 440",
    "ECHD 435",
    "EDC U 406",
    "ECHD 450",
    "ECHD 453",
    "ECHD 459",
    "ECHD 290",
    "ECHD 493"
  ],

  concentration: [
    "ECHD 450",
    "ECHD 453",
    "ECHD 459"
  ],

  core: [
    "SEMINR 126G",
    "IMS 200",
    "ENGL 101",
    "ENGL 102",
    "MATH 115",
  ]
},

   {
  name: "Preschool Education And Care Concentration",
  subject: "ECHD",
  degree: "BA",
  minCredits: 120,
  creditCap: 16,
  notes: "8-semester plan (Freshman–Senior Fall/Spring), 5 courses per semester, 30 credits planned each year, 15–16 credits max per term, target 120 total credits (121–123 allowed if needed). First Year Seminar only in Freshman year. Intermediate Seminar only in Sophomore year. ENGL 101 is placed in Freshman Fall and ENGL 102 is placed in Freshman Spring. Includes 11 Distribution II courses across AR, HU, SB, NS, MT, WL, and WC. Preschool Education And Care Concentration requirements represented here include: foundation course (ECHD 201); 200-level courses (ECHD 211, ECHD 221); upper-level courses (ECHD 317, ECHD 422, ECHD 440, ECHD 435, EDC U 406); required courses (ECHD 420, ECHD 430, ECHD 441); internship courses (ECHD 290, ECHD 493); and diversity courses (POLSCI 202 and HIST 175).",

  roadmapFlat: [
    // Freshman Fall (15–16)
    "SEMINR 126G", "ENGL 101", "ECHD 201", "ART 100", "PSYCH 100",
    // Freshman Spring (15–16)
    "ENGL 102", "ECHD 211", "ECHD 221", "MATH 115", "SPAN 101",
    // Sophomore Fall (15–16)
    "IMS 200", "ECHD 317", "MATH 125", "BIOL 101", "HIST 211",
    // Sophomore Spring (15–16)
    "ECHD 422", "ECHD 440", "CHEM 111L", "POLSCI 202", "SPAN 102",
    // Junior Fall (15–16)
    "ECHD 435", "EDC U 406", "ECHD 420", "SOCIOL 101", "AFRSTY 101",
    // Junior Spring (15–16)
    "ECHD 430", "ECHD 441", "IT 110", "ECON 101", "CLSICS 161",
    // Senior Fall (15–16)
    "ECHD 290", "HIST 175", "LATAM 101", "MUSIC 117", "THRART 122",
    // Senior Spring (15–16)
    "ECHD 493", "ENVSCI 101", "DANCE 135", "ANTH 256", "PHIL 100"
  ],

  major: [
    "ECHD 201",
    "ECHD 211",
    "ECHD 221",
    "ECHD 317",
    "ECHD 422",
    "ECHD 440",
    "ECHD 435",
    "EDC U 406",
    "ECHD 420",
    "ECHD 430",
    "ECHD 441",
    "ECHD 290",
    "ECHD 493"
  ],

  concentration: [
    "ECHD 420",
    "ECHD 430",
    "ECHD 441"
  ],

  core: [
    "SEMINR 126G",
    "IMS 200",
    "ENGL 101",
    "ENGL 102",
    "MATH 115",
  ]
},

    {
  name: "Applied Physics Concentration",
  subject: "PHYSIC",
  degree: "BS",
  minCredits: 120,
  creditCap: 16,
  notes: "8-semester plan (Freshman–Senior Fall/Spring), 5 courses per semester, 30 credits planned each year, 15–16 credits max per term, target 120 total credits (121–123 allowed if needed). First Year Seminar only in Freshman year. Intermediate Seminar only in Sophomore year. ENGL 101 is placed in Freshman Fall and ENGL 102 is placed in Freshman Spring. Includes 9 courses represented across AR, HU, SB, NS, MT, WL, and WC in the roadmap. Applied Physics Concentration requirements represented here include: introductory physics set (PHYSIC 113 and PHYSIC 181); PHYSIC 211; math sequence (MATH 140, MATH 141, MATH 242); chemistry set (CHEM 115 and CHEM 117); computing requirement (CS 110); engineering intro/core (ENGIN 103, ENGIN 231, ENGIN 232, ENGIN 271, ENGIN 272); math requirement (MATH 270); advanced physics (PHYSIC 322, PHYSIC 421); intermediate physics (PHYSIC 214, PHYSIC 312, PHYSIC 321); laboratory choices selected here (PHYSIC 281, ENGIN 241, ENGIN 365); engineering electives selected here (ENGIN 211L, ENGIN 321, ENGIN 331); and applied physics electives selected here (PHYSIC 247, PHYSIC 347, PHYSIC 447).",

  roadmapFlat: [
    // Freshman Fall (15-16)
    "SEMINR 126G", "ENGL 101", "MATH 140", "PHYSIC 113", "PHYSIC 181",
    // Freshman Spring (15-16)
    "ENGL 102", "MATH 141", "PHYSIC 211", "CHEM 115", "CHEM 117",
    // Sophomore Fall (15-16)
    "IMS 200", "ECON 101", "ENGIN 103", "PHYSIC 214", "CS 110",
    // Sophomore Spring (15-16)
    "MATH 242", "PHYSIC 114", "PHYSIC 182", "ENGIN 231", "PHIL 100",
    // Junior Fall (15-16)
    "MATH 270", "ENGIN 232", "ENGIN 271", "PHYSIC 312", "PHYSIC 247",
    // Junior Spring (15-16)
    "ENGIN 272", "PHYSIC 321", "PHYSIC 322", "ENGIN 211L", "PHYSIC 347",
    // Senior Fall (15-16)
    "PHYSIC 421", "ENGIN 241", "ENGIN 321", "PHYSIC 281", "PHYSIC 351",
    // Senior Spring (15-16)
    "ENGIN 365", "ENGIN 331", "HIST 211", "SPAN 101", "PHYSIC 447"
  ],

  major: [
    "PHYSIC 113",
    "PHYSIC 181",
    "PHYSIC 211",
    "PHYSIC 214",
    "PHYSIC 114",
    "PHYSIC 182",
    "PHYSIC 312",
    "PHYSIC 321",
    "PHYSIC 322",
    "PHYSIC 421",
    "PHYSIC 281",
    "PHYSIC 351",
    "PHYSIC 247",
    "PHYSIC 347",
    "PHYSIC 447",
    "ENGIN 103",
    "ENGIN 231",
    "ENGIN 232",
    "ENGIN 271",
    "ENGIN 272",
    "ENGIN 211L",
    "ENGIN 241",
    "ENGIN 321",
    "ENGIN 331",
    "ENGIN 365"
  ],

  concentration: [
    "PHYSIC 247",
    "PHYSIC 347",
    "PHYSIC 447"
  ],

  core: [
    "SEMINR 126G",
    "IMS 200",
    "ENGL 101",
    "ENGL 102",
    "MATH 140",
    "MATH 141",
    "MATH 242",
    "MATH 270"
  ]
},

    {
  name: "Computer Science Concentration",
  subject: "PHYSIC",
  degree: "BS",
  minCredits: 120,
  creditCap: 16,
  notes: "8-semester plan (Freshman–Senior Fall/Spring), 5 courses per semester, 30 credits planned each year, 15–16 credits max per term, target 120 total credits (121–123 allowed if needed). First Year Seminar only in Freshman year. Intermediate Seminar only in Sophomore year. ENGL 101 is placed in Freshman Fall and ENGL 102 is placed in Freshman Spring. Includes 9 courses represented across AR, HU, SB, NS, MT, WL, and WC in the roadmap. Computer Science Concentration requirements represented here include: introductory physics set (PHYSIC 113 and PHYSIC 181); PHYSIC 211; engineering intro/core (ENGIN 103, ENGIN 231, ENGIN 232, ENGIN 271, ENGIN 272); math sequence (MATH 140, MATH 141, MATH 242); computing requirement (CS 110); chemistry set (CHEM 115 and CHEM 117); intermediate physics (PHYSIC 214, PHYSIC 312, PHYSIC 321); advanced physics (PHYSIC 322, PHYSIC 421); laboratory choices selected here (PHYSIC 281, PHYSIC 382, ENGIN 241); math requirement (MATH 270); engineering elective selected here (ENGIN 321); CS courses (CS 210, CS 220, CS 240); and CS electives selected here (CS 310, CS 415).",

  roadmapFlat: [
    // Freshman Fall (15-16)
    "SEMINR 126G", "ENGL 101", "MATH 140", "PHYSIC 113", "PHYSIC 181",
    // Freshman Spring (15-16)
    "ENGL 102", "MATH 141", "PHYSIC 211", "CHEM 115", "CHEM 117",
    // Sophomore Fall (15-16)
    "IMS 200", "CS 110", "ENGIN 103", "PHYSIC 214", "SPAN 101",
    // Sophomore Spring (15-16)
    "MATH 242", "PHYSIC 114", "PHYSIC 182", "ENGIN 231", "CS 210",
    // Junior Fall (15-16)
    "ENGIN 232", "ENGIN 271", "PHIL 100", "CS 220", "ECON 101",
    // Junior Spring (15-16)
    "ENGIN 272", "MATH 270", "CS 240", "PHYSIC 312", "HIST 211",
    // Senior Fall (15-16)
    "PHYSIC 321", "PHYSIC 322", "PHYSIC 281", "ENGIN 321", "SPAN 102",
    // Senior Spring (15-16)
    "PHYSIC 421", "PHYSIC 382", "ENGIN 241", "CS 310", "CS 415"
  ],

  major: [
    "PHYSIC 113",
    "PHYSIC 181",
    "PHYSIC 211",
    "PHYSIC 214",
    "PHYSIC 114",
    "PHYSIC 182",
    "PHYSIC 312",
    "PHYSIC 321",
    "PHYSIC 322",
    "PHYSIC 281",
    "PHYSIC 421",
    "PHYSIC 382",
    "ENGIN 103",
    "ENGIN 231",
    "ENGIN 232",
    "ENGIN 271",
    "ENGIN 272",
    "ENGIN 321",
    "ENGIN 241",
    "CS 240",
    "CS 310",
    "CS 415"
  ],

  core: [
    "SEMINR 126G",
    "IMS 200",
    "ENGL 101",
    "ENGL 102",
    "MATH 140",
    "MATH 141",
    "MATH 242",
    "MATH 270",
    "CS 110",
    "CS 210",
    "CS 220"
  ]
},

    {
  name: "Digital Electronics Concentration",
  subject: "PHYSIC",
  degree: "BS",
  minCredits: 120,
  creditCap: 16,
  notes: "8-semester plan (Freshman–Senior Fall/Spring), 5 courses per semester, 30 credits planned each year, 15–16 credits max per term, target 120 total credits (121–123 allowed if needed). First Year Seminar only in Freshman year. Intermediate Seminar only in Sophomore year. ENGL 101 is placed in Freshman Fall and ENGL 102 is placed in Freshman Spring. Includes 9 courses represented across AR, HU, SB, NS, MT, WL, and WC in the roadmap. Digital Electronics Concentration requirements represented here include: introductory physics set (PHYSIC 113 and PHYSIC 181); PHYSIC 211; engineering intro/core (ENGIN 103, ENGIN 231, ENGIN 232, ENGIN 271, ENGIN 272); math sequence (MATH 140, MATH 141, MATH 242); computing requirement (CS 110); chemistry set (CHEM 115 and CHEM 117); intermediate physics (PHYSIC 214, PHYSIC 312, PHYSIC 321); laboratory choices selected here (PHYSIC 281, ENGIN 241, PHYSIC 398); advanced physics (PHYSIC 322, PHYSIC 421); math requirement (MATH 270); engineering electives selected here (ENGIN 202, ENGIN 221); CS courses (CS 210, CS 240); and digital electronics electives selected here (ENGIN 341, ENGIN 451).",

  roadmapFlat: [
    // Freshman Fall (15-16)
    "SEMINR 126G", "ENGL 101", "MATH 140", "PHYSIC 113", "PHYSIC 181",
    // Freshman Spring (15-16)
    "ENGL 102", "MATH 141", "PHYSIC 211", "CHEM 115", "CHEM 117",
    // Sophomore Fall (15-16)
    "IMS 200", "CS 110", "ENGIN 103", "PHYSIC 214", "SPAN 101",
    // Sophomore Spring (15-16)
    "MATH 242", "PHYSIC 114", "PHYSIC 182", "ENGIN 231", "PHIL 100",
    // Junior Fall (15-16)
    "ENGIN 232", "ENGIN 271", "CS 210", "PHYSIC 312", "ECON 101",
    // Junior Spring (15-16)
    "ENGIN 272", "MATH 270", "CS 240", "PHYSIC 321", "HIST 211",
    // Senior Fall (15-16)
    "PHYSIC 322", "PHYSIC 421", "PHYSIC 281", "HIST 175", "ENGIN 341",
    // Senior Spring (15-16)
    "ENGIN 241", "PHYSIC 398", "POLSCI 202", "SPAN 102", "ENGIN 451"
  ],

  major: [
    "PHYSIC 113",
    "PHYSIC 181",
    "PHYSIC 211",
    "PHYSIC 214",
    "PHYSIC 114",
    "PHYSIC 182",
    "PHYSIC 312",
    "PHYSIC 321",
    "PHYSIC 322",
    "PHYSIC 421",
    "PHYSIC 281",
    "PHYSIC 398",
    "ENGIN 103",
    "ENGIN 231",
    "ENGIN 232",
    "ENGIN 271",
    "ENGIN 272",
    "ENGIN 341",
    "ENGIN 241",
    "ENGIN 451"
  ],

  concentration: [
    "ENGIN 341",
    "ENGIN 451"
  ],

  core: [
    "SEMINR 126G",
    "IMS 200",
    "ENGL 101",
    "ENGL 102",
    "MATH 140",
    "MATH 141",
    "MATH 242",
    "MATH 270",
    "CS 110",
    "CS 210",
    "CS 240"
  ]
},

    {
  name: "Organic Chemistry Concentration",
  subject: "PHYSIC",
  degree: "BS",
  minCredits: 120,
  creditCap: 16,
  notes: "8-semester plan (Freshman–Senior Fall/Spring), 5 courses per semester, 30 credits planned each year, 15–16 credits max per term, target 120 total credits (121–123 allowed if needed). First Year Seminar only in Freshman year. Intermediate Seminar only in Sophomore year. ENGL 101 is placed in Freshman Fall and ENGL 102 is placed in Freshman Spring. Includes 9 courses represented across AR, HU, SB, NS, MT, WL, and WC in the roadmap. Organic Chemistry Concentration requirements represented here include: introductory physics set (PHYSIC 113 and PHYSIC 181); PHYSIC 211; engineering intro/core (ENGIN 103, ENGIN 231, ENGIN 232, ENGIN 271, ENGIN 272); math sequence (MATH 140, MATH 141, MATH 242); computing requirement (CS 110); chemistry set (CHEM 115 and CHEM 117); intermediate physics (PHYSIC 214, PHYSIC 312, PHYSIC 321); laboratory choices selected here (PHYSIC 281, ENGIN 241, PHYSIC 398); advanced physics (PHYSIC 322, PHYSIC 421); math requirement (MATH 270); engineering electives selected here (ENGIN 202, ENGIN 221); organic chemistry sequence (CHEM 251 and CHEM 255; CHEM 252 and CHEM 256); and organic quantitative analysis requirement (CHEM 351).",

  roadmapFlat: [
    // Freshman Fall (15-16)
    "SEMINR 126G", "ENGL 101", "MATH 140", "PHYSIC 113", "PHYSIC 181",
    // Freshman Spring (15-16)
    "ENGL 102", "MATH 141", "PHYSIC 211", "CHEM 115", "CHEM 117",
    // Sophomore Fall (15-16)
    "IMS 200", "CS 110", "ENGIN 103", "PHYSIC 214", "CHEM 251",
    // Sophomore Spring (15-16)
    "MATH 242", "PHYSIC 114", "PHYSIC 182", "ENGIN 231", "CHEM 252",
    // Junior Fall (15-16)
    "ENGIN 232", "ENGIN 271", "CLSICS 161", "CHEM 255", "ECON 101",
    // Junior Spring (15-16)
    "ENGIN 272", "MATH 270", "PHIL 100", "CHEM 256", "HIST 211",
    // Senior Fall (15-16)
    "PHYSIC 312", "PHYSIC 321", "PHYSIC 322", "HIST 175", "SPAN 101",
    // Senior Spring (15-16)
    "PHYSIC 421", "ENGIN 241", "PHYSIC 398", "POLSCI 202", "CHEM 351"
  ],

  major: [
    "PHYSIC 113",
    "PHYSIC 181",
    "PHYSIC 211",
    "PHYSIC 214",
    "PHYSIC 114",
    "PHYSIC 182",
    "PHYSIC 312",
    "PHYSIC 321",
    "PHYSIC 322",
    "PHYSIC 421",
    "PHYSIC 398",
    "ENGIN 103",
    "ENGIN 231",
    "ENGIN 232",
    "ENGIN 271",
    "ENGIN 272",
    "ENGIN 241",
    "CHEM 115",
    "CHEM 117",
    "CHEM 251",
    "CHEM 255",
    "CHEM 252",
    "CHEM 256",
    "CHEM 351"
  ],

  concentration: [
    "CHEM 251",
    "CHEM 255",
    "CHEM 252",
    "CHEM 256",
    "CHEM 351"
  ],

  core: [
    "SEMINR 126G",
    "IMS 200",
    "ENGL 101",
    "ENGL 102",
    "MATH 140",
    "MATH 141",
    "MATH 242",
    "MATH 270",
    "CS 110"
  ]
},

  
    {
  name: "Physical Chemistry Concentration",
  subject: "PHYSIC",
  degree: "BS",
  minCredits: 120,
  creditCap: 16,
  notes: "8-semester plan (Freshman–Senior Fall/Spring), 5 courses per semester, 30 credits planned each year, 15–16 credits max per term, target 120 total credits (121–123 allowed if needed). First Year Seminar only in Freshman year. Intermediate Seminar only in Sophomore year. ENGL 101 is placed in Freshman Fall and ENGL 102 is placed in Freshman Spring. Includes 9 courses represented across AR, HU, SB, NS, MT, WL, and WC in the roadmap. Physical Chemistry Concentration requirements represented here include: introductory physics set (PHYSIC 113 and PHYSIC 181); PHYSIC 211; engineering intro/core (ENGIN 103, ENGIN 231, ENGIN 232, ENGIN 271, ENGIN 272); math sequence (MATH 140, MATH 141, MATH 242); computing requirement (CS 110); chemistry set (CHEM 115 and CHEM 117); intermediate physics (PHYSIC 214, PHYSIC 312, PHYSIC 321); laboratory choices selected here (PHYSIC 281, ENGIN 241, PHYSIC 398); advanced physics (PHYSIC 322, PHYSIC 421); math requirement (MATH 270); engineering electives selected here (ENGIN 202, ENGIN 221); physical chemistry sequence (CHEM 312 and CHEM 314); and analytical chemistry sequence (CHEM 311 and CHEM 313).",

  roadmapFlat: [
    // Freshman Fall (15-16)
    "SEMINR 126G", "ENGL 101", "MATH 140", "PHYSIC 113", "PHYSIC 181",
    // Freshman Spring (15-16)
    "ENGL 102", "MATH 141", "PHYSIC 211", "CHEM 115", "CHEM 117",
    // Sophomore Fall (15-16)
    "IMS 200", "CS 110", "ENGIN 103", "PHYSIC 214", "CHEM 311",
    // Sophomore Spring (15-16)
    "MATH 242", "PHYSIC 114", "PHYSIC 182", "ENGIN 231", "CHEM 312",
    // Junior Fall (15-16)
    "ENGIN 232", "ENGIN 271", "SPAN 101", "CHEM 313", "ECON 101",
    // Junior Spring (15-16)
    "ENGIN 272", "MATH 270", "PHIL 100", "CHEM 314", "HIST 211",
    // Senior Fall (15-16)
    "PHYSIC 312", "PHYSIC 321", "PHYSIC 322", "HIST 175", "SPAN 102",
    // Senior Spring (15-16)
    "PHYSIC 421", "ENGIN 241", "PHYSIC 398", "POLSCI 202", "AFRSTY 101"
  ],

  major: [
    "PHYSIC 113",
    "PHYSIC 181",
    "PHYSIC 211",
    "PHYSIC 214",
    "PHYSIC 114",
    "PHYSIC 182",
    "PHYSIC 312",
    "PHYSIC 321",
    "PHYSIC 322",
    "PHYSIC 421",
    "PHYSIC 398",
    "ENGIN 103",
    "ENGIN 231",
    "ENGIN 232",
    "ENGIN 271",
    "ENGIN 272",
    "ENGIN 241",
    "CHEM 115",
    "CHEM 117",
    "CHEM 311",
    "CHEM 313",
    "CHEM 312",
    "CHEM 314"
  ],

  concentration: [
    "CHEM 312",
    "CHEM 314",
    "CHEM 311",
    "CHEM 313"
  ],

  core: [
    "SEMINR 126G",
    "IMS 200",
    "ENGL 101",
    "ENGL 102",
    "MATH 140",
    "MATH 141",
    "MATH 242",
    "MATH 270",
    "CS 110"
  ]
},

    {
  name: "Creative Writing Concentration",
  subject: "ENGL",
  degree: "BA",
  minCredits: 120,
  creditCap: 16,
  notes: "8-semester plan (Freshman–Senior Fall/Spring), 5 courses per semester, 30 credits planned each year, 15–16 credits max per term, target 120 total credits (121–123 allowed if needed). First Year Seminar only in Freshman year. Intermediate Seminar only in Sophomore year. ENGL 101 is placed in Freshman Fall and ENGL 102 is placed in Freshman Spring. Includes 11 courses represented across AR, HU, SB, NS, MT, WL, and WC in the roadmap. Creative Writing Concentration requirements represented here include: core English courses (ENGL 200, ENGL 201, ENGL 202); upper-level English courses selected here (ENGL 300, ENGL 302, ENGL 303, ENGL 304, ENGL 309, AMST 405); before 1660 requirement selected here (ENGL 326); 1660–1900 requirement selected here (ENGL 320); after 1900 requirement selected here (ENGL 328); capstone selected here (ENGL 496); electives selected here (ENGL 130, ENGL 272G); creative writing courses (ENGL 210, ENGL 211, ENGL 212, ENGL 306); international diversity course (POLSCI 202); and U.S. diversity course (HIST 175).",

  roadmapFlat: [
    // Freshman Fall (15-16)
    "SEMINR 126G", "ENGL 101", "ENGL 130", "MATH 115", "ART 100",
    // Freshman Spring (15-16)
    "ENGL 102", "ENGL 200", "ENGL 210", "HIST 175", "SPAN 101",
    // Sophomore Fall (15-16)
    "IMS 200", "ENGL 201", "ENGL 211", "PHIL 100", "BIOL 101",
    // Sophomore Spring (15-16)
    "ENGL 202", "ENGL 212", "POLSCI 202", "CHEM 111L", "IT 110",
    // Junior Fall (15-16)
    "ENGL 300", "ENGL 302", "ENGL 326", "PSYCH 100", "AFRSTY 101",
    // Junior Spring (15-16)
    "ENGL 303", "ENGL 304", "ENGL 320", "ECON 101", "LATAM 101",
    // Senior Fall (15-16)
    "ENGL 309", "AMST 405", "ENGL 328", "ENGL 272G", "CLSICS 161",
    // Senior Spring (15-16)
    "ENGL 306", "ENGL 496", "SOCIOL 101", "ENVSCI 101", "SPAN 102"
  ],

  major: [
    "ENGL 300",
    "ENGL 302",
    "ENGL 326",
    "ENGL 303",
    "ENGL 304",
    "ENGL 320",
    "ENGL 309",
    "ENGL 328",
    "ENGL 306",
    "ENGL 496"
  ],

  concentration: [
    "ENGL 210",
    "ENGL 211",
    "ENGL 212",
    "ENGL 306"
  ],

  core: [
    "SEMINR 126G",
    "IMS 200",
    "ENGL 101",
    "ENGL 102",
    "ENGL 200",
    "ENGL 210",
    "ENGL 201",
    "ENGL 211",
    "ENGL 202",
    "ENGL 212",
    "ENGL 272G",
    "MATH 115"
  ]
},

   {
  name: "English Teaching Concentration",
  subject: "ENGL",
  degree: "BA",
  minCredits: 120,
  creditCap: 16,
  notes: "8-semester plan (Freshman–Senior Fall/Spring), 5 courses per semester, 30 credits planned each year, 15–16 credits max per term, target 120 total credits (121–123 allowed if needed). First Year Seminar only in Freshman year. Intermediate Seminar only in Sophomore year. ENGL 101 is placed in Freshman Fall and ENGL 102 is placed in Freshman Spring. Includes 11 courses represented across AR, HU, SB, NS, MT, WL, and WC in the roadmap. English Teaching Concentration requirements represented here include: core English courses (ENGL 200, ENGL 201, ENGL 202); upper-level English courses selected here (ENGL 300, ENGL 302, ENGL 303, ENGL 304, ENGL 309, AMST 405); before 1660 requirement selected here (ENGL 326); 1660–1900 requirement selected here (ENGL 320); after 1900 requirement selected here (ENGL 328); capstone selected here (ENGL 475); electives selected here (ENGL 130, ENGL 242); language-focused course selected here (ENGL 440); literacy-focused course selected here (ENGL 448); methods course selected here (ENGL 450); and upper-level electives selected here (ENGL 320, ENGL 324, ENGL 326).",

  roadmapFlat: [
    // Freshman Fall (15-16)
    "SEMINR 126G", "ENGL 101", "ENGL 130", "MATH 115", "ART 100",
    // Freshman Spring (15-16)
    "ENGL 102", "ENGL 200", "ECON 101", "SPAN 101", "PSYCH 100",
    // Sophomore Fall (15-16)
    "IMS 200", "ENGL 201", "ENGL 300", "PHIL 100", "BIOL 101",
    // Sophomore Spring (15-16)
    "ENGL 202", "ENGL 302", "ENGL 303", "CHEM 111L", "IT 110",
    // Junior Fall (15-16)
    "ENGL 304", "ENGL 309", "ENGL 326", "AFRSTY 101", "ENGL 442",
    // Junior Spring (15-16)
    "AMST 405", "ENGL 320", "ENGL 324", "LATAM 101", "SOCIOL 101",
    // Senior Fall (15-16)
    "ENGL 328", "ENGL 440", "ENGL 448", "HIST 175", "CLSICS 161",
    // Senior Spring (15-16)
    "ENGL 450", "ENGL 475", "SPAN 102", "ENVSCI 101", "POLSCI 202"
  ],

  major: [
    "ENGL 300",
    "ENGL 302",
    "ENGL 303",
    "ENGL 304",
    "ENGL 309",
    "ENGL 326",
    "ENGL 442",
    "ENGL 320",
    "ENGL 324",
    "ENGL 328",
    "ENGL 440",
    "ENGL 448",
    "ENGL 450",
    "ENGL 475"
  ],

  concentration: [
    "ENGL 442",
    "ENGL 450",
    "ENGL 448"
  ],

  core: [
    "SEMINR 126G",
    "IMS 200",
    "ENGL 101",
    "ENGL 102",
    "ENGL 200",
    "ENGL 201",
    "ENGL 202",
    "MATH 115"
  ]
},

   {
  name: "Irish Studies Concentration",
  subject: "ENGL",
  degree: "BA",
  minCredits: 120,
  creditCap: 16,
  notes: "8-semester plan (Freshman–Senior Fall/Spring), 5 courses per semester, 30 credits planned each year, 15–16 credits max per term, target 120 total credits (121–123 allowed if needed). First Year Seminar only in Freshman year. Intermediate Seminar only in Sophomore year. ENGL 101 is placed in Freshman Fall and ENGL 102 is placed in Freshman Spring. Includes 11 courses represented across AR, HU, SB, NS, MT, WL, and WC in the roadmap. Irish Studies Concentration requirements represented here include: core English courses (ENGL 200, ENGL 201, ENGL 202); upper-level English courses selected here (ENGL 300, ENGL 302, ENGL 303, ENGL 304, ENGL 309, AMST 405); before 1660 requirement selected here (ENGL 326); 1660–1900 requirement selected here (ENGL 320); after 1900 requirement selected here (ENGL 328); capstone selected here (ENGL 466); electives selected here (ENGL 130, ENGL 242); and Irish Studies courses (ENGL 391, ENGL 415, ENGL 417, ENGL 418, ENGL 419, HIST 339).",

  roadmapFlat: [
    // Freshman Fall (15-16)
    "SEMINR 126G", "ENGL 101", "ENGL 130", "MATH 115", "ART 100",
    // Freshman Spring (15-16)
    "ENGL 102", "ENGL 200", "ENGL 242", "SPAN 101", "PSYCH 100",
    // Sophomore Fall (15-16)
    "IMS 200", "ENGL 201", "ENGL 300", "PHIL 100", "BIOL 101",
    // Sophomore Spring (15-16)
    "ENGL 202", "ENGL 302", "ENGL 303", "CHEM 111L", "IT 110",
    // Junior Fall (15-16)
    "ENGL 304", "ENGL 309", "ENGL 326", "AFRSTY 101", "ECON 101",
    // Junior Spring (15-16)
    "AMST 405", "ENGL 320", "ENGL 340", "LATAM 101", "HIST 175",
    // Senior Fall (15-16)
    "ENGL 328", "ENGL 415", "ENGL 343", "ENGL 444", "CLSICS 161",
    // Senior Spring (15-16)
    "ENGL 465", "ENGL 418", "ENGL 466", "SPAN 102", "POLSCI 202"
  ],

  major: [
    "ENGL 300",
    "ENGL 302",
    "ENGL 303",
    "ENGL 304",
    "ENGL 309",
    "ENGL 326",
    "ENGL 320",
    "ENGL 340",
    "ENGL 343",
    "ENGL 328",
    "ENGL 444",
    "ENGL 465",
    "ENGL 466"
  ],

  concentration: [
    "ENGL 415",
    "ENGL 418",
  ],

  core: [
    "SEMINR 126G",
    "IMS 200",
    "ENGL 101",
    "ENGL 102",
    "ENGL 200",
    "ENGL 242",
    "ENGL 201",
    "ENGL 202",
    "MATH 115"
  ]
},

    {
  name: "Literary History Concentration",
  subject: "ENGL",
  degree: "BA",
  minCredits: 120,
  creditCap: 16,
  notes: "8-semester plan (Freshman–Senior Fall/Spring), 5 courses per semester, 30 credits planned each year, 15–16 credits max per term, target 120 total credits (121–123 allowed if needed). First Year Seminar only in Freshman year. Intermediate Seminar only in Sophomore year. ENGL 101 is placed in Freshman Fall and ENGL 102 is placed in Freshman Spring. Includes 11 courses represented across AR, HU, SB, NS, MT, WL, and WC in the roadmap. Literary History Concentration requirements represented here include: core English courses (ENGL 200, ENGL 201, ENGL 202); upper-level English courses selected here (ENGL 300, ENGL 302, ENGL 303, ENGL 304, ENGL 309, AMST 405); before 1660 requirement selected here (ENGL 326); 1660–1900 requirement selected here (ENGL 320); after 1900 requirement selected here (ENGL 331); capstone selected here (ENGL 465); electives selected here (ENGL 130, ENGL 242); Literary History courses selected here (ENGL 322, ENGL 327, ENGL 351, ENGL 365, ENGL 382, ENGL 406); pre-1900 capstone selected here (ENGL 483); international diversity course (POLSCI 202); and U.S. diversity course (HIST 175).",

  roadmapFlat: [
    // Freshman Fall (15-16)
    "SEMINR 126G", "ENGL 101", "ENGL 130", "MATH 115", "ART 100",
    // Freshman Spring (15-16)
    "ENGL 102", "ENGL 200", "ENGL 242", "SPAN 101", "PSYCH 100",
    // Sophomore Fall (15-16)
    "IMS 200", "ENGL 201", "ENGL 300", "PHIL 100", "BIOL 101",
    // Sophomore Spring (15-16)
    "ENGL 202", "ENGL 302", "ENGL 303", "CHEM 111L", "IT 110",
    // Junior Fall (15-16)
    "ENGL 304", "ENGL 309", "ENGL 326", "AFRSTY 101", "ECON 101",
    // Junior Spring (15-16)
    "AMST 405", "ENGL 320", "ENGL 322", "ENGL 327", "LATAM 101",
    // Senior Fall (15-16)
    "ENGL 331", "ENGL 351", "ENGL 365", "ENGL 382", "POLSCI 202",
    // Senior Spring (15-16)
    "ENGL 406", "ENGL 465", "ENGL 466", "HIST 175", "CLSICS 161"
  ],

  major: [
    "ENGL 300",
    "ENGL 302",
    "ENGL 303",
    "ENGL 304",
    "ENGL 309",
    "ENGL 326",
    "ENGL 320",
    "ENGL 322",
    "ENGL 327",
    "ENGL 331",
    "ENGL 351",
    "ENGL 365",
    "ENGL 382",
    "ENGL 406",
    "ENGL 465",
    "ENGL 466"
  ],

  concentration: [
    "ENGL 322",
    "ENGL 327",
    "ENGL 351",
    "ENGL 365",
    "ENGL 382",
    "ENGL 406"
  ],

  core: [
    "SEMINR 126G",
    "IMS 200",
    "ENGL 101",
    "ENGL 102",
    "ENGL 200",
    "ENGL 242",
    "ENGL 201",
    "ENGL 202",
    "MATH 115"
  ]
},

    {
  name: "Professional Writing Concentration",
  subject: "ENGL",
  degree: "BA",
  minCredits: 120,
  creditCap: 16,
  notes: "8-semester plan (Freshman–Senior Fall/Spring), 5 courses per semester, 30 credits planned each year, 15–16 credits max per term, target 120 total credits (121–123 allowed if needed). First Year Seminar only in Freshman year. Intermediate Seminar only in Sophomore year. ENGL 101 is placed in Freshman Fall and ENGL 102 is placed in Freshman Spring. Includes 11 courses represented across AR, HU, SB, NS, MT, WL, and WC in the roadmap. Professional Writing Concentration requirements represented here include: core English courses (ENGL 200, ENGL 201, ENGL 202); upper-level English courses selected here (ENGL 300, ENGL 302, ENGL 303, ENGL 304, ENGL 309, AMST 405); before 1660 requirement selected here (ENGL 326); 1660–1900 requirement selected here (ENGL 320); after 1900 requirement selected here (ENGL 328); capstone selected here (ENGL 477); electives selected here (ENGL 130, ENGL 242); professional writing core (ENGL 306, ENGL 307, ENGL 308); writing electives selected here (ENGL 203, ENGL 312); English internship selected here (ENGL 475); international diversity course (POLSCI 202); and U.S. diversity course (HIST 175).",

  roadmapFlat: [
    // Freshman Fall (15-16)
    "SEMINR 126G", "ENGL 101", "ENGL 130", "MATH 115", "ART 100",
    // Freshman Spring (15-16)
    "ENGL 102", "ENGL 200", "ENGL 242", "SPAN 101", "PSYCH 100",
    // Sophomore Fall (15-16)
    "IMS 200", "ENGL 201", "CHEM 111L", "PHIL 100", "BIOL 101",
    // Sophomore Spring (15-16)
    "ENGL 202", "ENGL 300", "ENGL 302", "ENGL 303", "IT 110",
    // Junior Fall (15-16)
    "ENGL 203", "ENGL 304", "ENGL 309", "ENGL 320", "ECON 101",
    // Junior Spring (15-16)
    "AMST 405", "ENGL 326", "ENGL 328", "ENGL 306", "LATAM 101",
    // Senior Fall (15-16)
    "ENGL 307", "ENGL 308", "AFRSTY 101", "ENGL 312", "POLSCI 202",
    // Senior Spring (15-16)
    "ENGL 475", "ENGL 477", "HIST 175", "CLSICS 161", "THRART 122"
  ],

  major: [
    "ENGL 300",
    "ENGL 302",
    "ENGL 303",
    "ENGL 304",
    "ENGL 309",
    "ENGL 326",
    "ENGL 320",
    "ENGL 328",
    "ENGL 306",
    "ENGL 307",
    "ENGL 308",
    "ENGL 312",
    "ENGL 475",
    "ENGL 477"
  ],

  concentration: [
    "ENGL 306",
    "ENGL 307",
    "ENGL 308"
  ],

  core: [
    "SEMINR 126G",
    "IMS 200",
    "ENGL 101",
    "ENGL 102",
    "ENGL 200",
    "ENGL 242",
    "ENGL 201",
    "ENGL 202",
    "ENGL 203",
    "MATH 115"
  ]
},

    {
  name: "Race, Ethnicity, and Literature Concentration",
  subject: "ENGL",
  degree: "BA",
  minCredits: 120,
  creditCap: 16,
  notes: "8-semester plan (Freshman–Senior Fall/Spring), 5 courses per semester, 30 credits planned each year, 15–16 credits max per term, target 120 total credits (121–123 allowed if needed). First Year Seminar only in Freshman year. Intermediate Seminar only in Sophomore year. ENGL 101 is placed in Freshman Fall and ENGL 102 is placed in Freshman Spring. Includes 11 courses represented across AR, HU, SB, NS, MT, WL, and WC in the roadmap. Race, Ethnicity, and Literature Concentration requirements represented here include: core English courses (ENGL 200, ENGL 201, ENGL 202); upper-level English courses selected here (ENGL 300, ENGL 302, ENGL 303, ENGL 304, ENGL 309, AMST 405); before 1660 requirement selected here (ENGL 326); 1660–1900 requirement selected here (ENGL 320); after 1900 requirement selected here (ENGL 335); capstone selected here (ENGL 465); electives selected here (ENGL 130, ENGL 242); intro courses (ENGL 135, ENGL 223); Race, Ethnicity, and Literature capstone selected here (ENGL 489); core courses (ENGL 331, ENGL 335, ENGL 350L, ENGL 351); international diversity course (POLSCI 202); and U.S. diversity course (HIST 175).",

  roadmapFlat: [
    // Freshman Fall (15-16)
    "SEMINR 126G", "ENGL 101", "ENGL 130", "MATH 115", "ART 100",
    // Freshman Spring (15-16)
    "ENGL 102", "ENGL 200", "ENGL 135", "SPAN 101", "PSYCH 100",
    // Sophomore Fall (15-16)
    "IMS 200", "ENGL 201", "ENGL 223L", "PHIL 100", "BIOL 101",
    // Sophomore Spring (15-16)
    "ENGL 202", "ENGL 300", "ENGL 302", "CHEM 111L", "IT 110",
    // Junior Fall (15-16)
    "ENGL 303", "ENGL 304", "ENGL 309", "AFRSTY 101", "ECON 101",
    // Junior Spring (15-16)
    "ENGL 242", "ENGL 326", "ENGL 320", "ENGL 331", "LATAM 101",
    // Senior Fall (15-16)
    "ENGL 335", "ENGL 350L", "ENGL 351", "POLSCI 202", "CLSICS 161",
    // Senior Spring (15-16)
    "ENGL 465", "ENGL 489", "AMST 405", "HIST 175", "THRART 122"
  ],

  major: [
    "ENGL 300",
    "ENGL 302",
    "ENGL 303",
    "ENGL 304",
    "ENGL 309",
    "ENGL 326",
    "ENGL 320",
    "ENGL 331",
    "ENGL 335",
    "ENGL 350L",
    "ENGL 351",
    "ENGL 465",
    "ENGL 489"
  ],

  concentration: [
    "ENGL 489",
    "ENGL 331",
    "ENGL 335",
    "ENGL 350L",
    "ENGL 351"
  ],

  core: [
    "SEMINR 126G",
    "IMS 200",
    "ENGL 101",
    "ENGL 102",
    "ENGL 200",
    "ENGL 201",
    "ENGL 202",
    "MATH 115"
  ]
},

    {
  name: "Earth and Hydrologic Science Track BA",
  subject: "ENVSCI",
  degree: "BA",
  minCredits: 120,
  creditCap: 16,
  notes: "8-semester plan (Freshman–Senior Fall/Spring), 5 courses per semester, 30 credits planned each year, 15–16 credits max per term, target 120 total credits (121–123 allowed if needed). First Year Seminar only in Freshman year. Intermediate Seminar only in Sophomore year. ENGL 101 is placed in Freshman Fall and ENGL 102 is placed in Freshman Spring. Includes 11 Distribution II courses across AR, HU, SB, NS, MT, WL, and WC. Earth and Hydrologic Science Track BA requirements represented here include: introductory courses (ENVSCI 120, ENVSCI 121, ENVSCI 122); designated skills courses (ENVSCI 261 and MATH 125); intermediate natural science electives (ENVSCI 210, ENVSCI 226, ENVSCI 267L); intermediate social science electives (ENVSCI 270, ENVSCI 280, ENVSTY 230); residency courses (ENVSCI 215, ENVSCI 216, ENVSCI 256, ENVSTY 280, ENVSTY 323); Earth and Hydrologic Science electives (ENVSCI 305, ENVSCI 318, ENVSCI 336L, ENVSCI 341, ENVSCI 381, ENVSCI 405); Marine Science elective set (BIOL 306 and BIOL 311); Environmental Policy and Management electives (ENVSCI 324 and ENVSTY 364L); capstone (ENVSCI 476); and diversity courses (POLSCI 202 and HIST 175).",

  roadmapFlat: [
    // Freshman Fall (15)
    "SEMINR 126G", "ENGL 101", "ENVSCI 120", "MATH 115", "ART 100",
    // Freshman Spring (15)
    "ENGL 102", "ENVSCI 121", "ENVSCI 122", "SPAN 101", "PHIL 100",
    // Sophomore Fall (16)
    "IMS 200", "ENVSCI 261", "MATH 125", "ENVSCI 210", "HIST 175",
    // Sophomore Spring (16)
    "ENVSCI 226", "ENVSCI 270", "ENVSCI 280", "POLSCI 202", "SPAN 102",
    // Junior Fall (15)
    "ENVSCI 215", "ENVSCI 216", "ENVSCI 256", "ENVSCI 305", "ENVSCI 345L",
    // Junior Spring (15)
    "ENVSTY 280", "ENVSCI 318", "ENVSCI 267L", "ENVSCI 341", "ENVSCI 349L",
    // Senior Fall (16)
    "ENVSTY 323", "ENVSCI 336L", "ENVSCI 324", "ENVSCI 476", "AFRSTY 101",
    // Senior Spring (16)
    "ENVSCI 381", "ENVSCI 405", "ENVSTY 364L", "CLSICS 161", "PSYCH 100"
  ],

  major: [
    "ENVSCI 120",
    "ENVSCI 121",
    "ENVSCI 122",
    "ENVSCI 261",
    "ENVSCI 210",
    "ENVSCI 226",
    "ENVSCI 270",
    "ENVSCI 280",
    "ENVSCI 215",
    "ENVSCI 216",
    "ENVSCI 256",
    "ENVSCI 305",
    "ENVSCI 267L",
    "ENVSCI 341",
    "ENVSCI 345L",
    "ENVSCI 349L",
    "ENVSCI 323",
    "ENVSCI 336L",
    "ENVSCI 324",
    "ENVSCI 476",
    "ENVSCI 381",
    "ENVSCI 405",
    "ENVSTY 280",
    "ENVSTY 323",
    "ENVSTY 364L",
    "BIOL 306",
    "BIOL 311"
  ],

  track: [
    "ENVSCI 305",
    "ENVSCI 318",
    "ENVSCI 336L"
  ],

  core: [
    "SEMINR 126G",
    "IMS 200",
    "ENGL 101",
    "ENGL 102",
    "MATH 115" 
  ]
},

    {
  name: "Environmental Science Track BA",
  subject: "ENVSCI",
  degree: "BA",
  minCredits: 120,
  creditCap: 16,
  notes: "8-semester plan (Freshman–Senior Fall/Spring), 5 courses per semester, 30 credits planned each year, 15–16 credits max per term, target 120 total credits (121–123 allowed if needed). First Year Seminar only in Freshman year. Intermediate Seminar only in Sophomore year. ENGL 101 is placed in Freshman Fall and ENGL 102 is placed in Freshman Spring. Includes 11 Distribution II courses across AR, HU, SB, NS, MT, WL, and WC. Environmental Science Track BA requirements represented here include: introductory courses (ENVSCI 120, ENVSCI 121, ENVSCI 122); designated skills courses (ENVSCI 261, MATH 125, ENVSCI 281); intermediate natural science electives (ENVSCI 210 and ENVSCI 226); intermediate social science electives (ENVSCI 270, ENVSCI 280, ENVSTY 230); upper-level electives across Marine Science, Earth and Hydrologic Science, and Environmental Management and Policy; additional upper-level electives; residency courses (ENVSCI 215, ENVSCI 216, ENVSCI 256, ENVSTY 280, ENVSTY 323); capstone (ENVSCI 476); and diversity courses (POLSCI 202 and HIST 175).",

  roadmapFlat: [
    // Freshman Fall (15)
    "SEMINR 126G", "ENGL 101", "ENVSCI 120", "MATH 115", "ART 100",
    // Freshman Spring (15)
    "ENGL 102", "ENVSCI 121", "ENVSCI 122", "SPAN 101", "PHIL 100",
    // Sophomore Fall (15)
    "IMS 200", "ENVSCI 261", "MATH 125", "ENVSCI 281", "HIST 211",
    // Sophomore Spring (16)
    "ENVSCI 210", "ENVSCI 226", "ENVSCI 270", "ENVSCI 280", "SPAN 102",
    // Junior Fall (15)
    "ENVSTY 230", "ENVSCI 215", "ENVSCI 216", "ENVSCI 256", "ENVSCI 359",
    // Junior Spring (15)
    "ENVSTY 280", "ENVSTY 323", "ENVSCI 315L", "ENVSCI 318", "ENVSCI 368",
    // Senior Fall (15)
    "ENVSCI 324", "ENVSCI 336L", "ENVSCI 341", "ENVSCI 476", "POLSCI 202",
    // Senior Spring (15)
    "ENVSCI 381", "ENVSCI 405", "AFRSTY 101", "CLSICS 161", "HIST 175"
  ],

  major: [
    "ENVSCI 120",
    "ENVSCI 121",
    "ENVSCI 122",
    "ENVSCI 261",
    "ENVSCI 281",
    "ENVSCI 210",
    "ENVSCI 226",
    "ENVSCI 270",
    "ENVSCI 280",
    "ENVSCI 215",
    "ENVSCI 216",
    "ENVSCI 256",
    "ENVSCI 315L",
    "ENVSCI 318",
    "ENVSCI 324",
    "ENVSCI 336L",
    "ENVSCI 341",
    "ENVSCI 359",
    "ENVSCI 368",
    "ENVSCI 476",
    "ENVSCI 381",
    "ENVSCI 405",
    "ENVSTY 230",
    "ENVSTY 280",
    "ENVSTY 323"
  ],

  track: [
    "ENVSCI 315L",
    "ENVSCI 324"
  ],

  core: [
    "SEMINR 126G",
    "IMS 200",
    "ENGL 101",
    "ENGL 102",
    "MATH 115"
  ]
},

    {
  name: "Marine Science Track BA",
  subject: "ENVSCI",
  degree: "BA",
  minCredits: 120,
  creditCap: 16,
  notes: "8-semester plan (Freshman–Senior Fall/Spring), 5 courses per semester, 30 credits planned each year, 15–16 credits max per term, target 120 total credits (121–123 allowed if needed). First Year Seminar only in Freshman year. Intermediate Seminar only in Sophomore year. ENGL 101 is placed in Freshman Fall and ENGL 102 is placed in Freshman Spring. Includes 11 Distribution II courses across AR, HU, SB, NS, MT, WL, and WC. Marine Science Track BA requirements represented here include: introductory courses (ENVSCI 120, ENVSCI 121, ENVSCI 122); designated skills courses (ENVSCI 261, MATH 125, ENVSCI 281); intermediate natural science electives (ENVSCI 210 and ENVSCI 226); intermediate social science electives (ENVSCI 270, ENVSCI 280, ENVSTY 230); upper-level electives across Marine Science, Earth and Hydrologic Science, and Environmental Management and Policy; additional electives; residency courses (ENVSCI 215, ENVSCI 216, ENVSCI 256, ENVSTY 280, ENVSTY 323); Marine Science electives (BIOL 306, BIOL 311, ENVSCI 316, ENVSCI 325, ENVSCI 327, ENVSCI 422); Earth and Hydrologic Science elective (ENVSCI 318); Environmental Policy and Management elective (ENVSCI 324); capstone (ENVSCI 476); and diversity courses (POLSCI 202 and HIST 175).",

  roadmapFlat: [
    // Freshman Fall (15)
    "SEMINR 126G", "ENGL 101", "ENVSCI 120", "MATH 115", "ART 100",
    // Freshman Spring (15)
    "ENGL 102", "ENVSCI 121", "ENVSCI 122", "SPAN 101", "PHIL 100",
    // Sophomore Fall (15)
    "IMS 200", "ENVSCI 261", "MATH 125", "ENVSCI 281", "HIST 211",
    // Sophomore Spring (16)
    "ENVSCI 210", "ENVSCI 226", "ENVSCI 270", "ENVSCI 280", "SPAN 102",
    // Junior Fall (15)
    "ENVSTY 230", "ENVSCI 215", "ENVSCI 216", "ENVSCI 256", "ENVSCI 345L",
    // Junior Spring (15)
    "ENVSTY 280", "ENVSTY 323", "ENVSCI 316", "ENVSCI 318", "ENVSCI 349L",
    // Senior Fall (15)
    "ENVSCI 324", "ENVSCI 325", "ENVSCI 327", "ENVSCI 476", "POLSCI 202",
    // Senior Spring (15)
    "ENVSCI 422", "AFRSTY 101", "CLSICS 161", "HIST 175", "PSYCH 100"
  ],

  major: [
    "ENVSCI 120",
    "ENVSCI 121",
    "ENVSCI 122",
    "ENVSCI 261",
    "ENVSCI 281",
    "ENVSCI 210",
    "ENVSCI 226",
    "ENVSCI 270",
    "ENVSCI 280",
    "ENVSCI 215",
    "ENVSCI 216",
    "ENVSCI 256",
    "ENVSCI 345L",
    "ENVSCI 316",
    "ENVSCI 318",
    "ENVSCI 349L",
    "ENVSCI 324",
    "ENVSCI 325",
    "ENVSCI 327",
    "ENVSCI 476",
    "ENVSCI 422",
    "ENVSTY 230",
    "ENVSTY 280",
    "ENVSTY 323"
  ],

  track: [
    "ENVSCI 316",
    "ENVSCI 325"
  ],

  core: [
    "SEMINR 126G",
    "IMS 200",
    "ENGL 101",
    "ENGL 102",
    "MATH 115"
  ]
},

    {
  name: "Earth and Hydrologic Science Track BS",
  subject: "ENVSCI",
  degree: "BS",
  minCredits: 120,
  creditCap: 16,
  notes: "8-semester plan (Freshman–Senior Fall/Spring), 5 courses per semester, 30 credits planned each year, 15–16 credits max per term, target 120 total credits (121–123 allowed if needed). First Year Seminar only in Freshman year. Intermediate Seminar only in Sophomore year. ENGL 101 is placed in Freshman Fall and ENGL 102 is placed in Freshman Spring. Includes 9 Distribution II courses across AR, HU, SB, NS, MT, WL, and WC. Earth and Hydrologic Science Track BS requirements represented here include: introductory courses (ENVSCI 120, ENVSCI 121, ENVSCI 122); designated skills courses (ENVSCI 261, MATH 125, ENVSCI 281); calculus requirement (MATH 135); natural science foundation courses represented here by BIOL 111, BIOL 112, CHEM 115, CHEM 117, CHEM 116, CHEM 118, PHYSIC 113, PHYSIC 181, PHYSIC 114, and PHYSIC 182; residency courses (ENVSCI 215, ENVSCI 216, ENVSCI 256, ENVSTY 280, ENVSTY 323); intermediate social science elective (ENVSCI 270); intermediate natural science electives (ENVSCI 210, ENVSCI 226, ENVSCI 260); Earth and Hydrologic Sciences electives (ENVSCI 318, ENVSCI 336L, ENVSCI 341); Marine Science elective set represented here by BIOL 306 and BIOL 311; Environmental Policy and Management elective (ENVSCI 324); capstone (ENVSCI 476); and diversity courses (POLSCI 202 and HIST 175).",

  roadmapFlat: [
    // Freshman Fall (16)
    "SEMINR 126G", "ENGL 101", "ENVSCI 120", "MATH 115", "ART 100",
    // Freshman Spring (16)
    "ENGL 102", "ENVSCI 121", "ENVSCI 122", "SPAN 101", "PHIL 100",
    // Sophomore Fall (16)
    "IMS 200", "ENVSCI 261", "MATH 125", "POLSCI 202", "HIST 175",
    // Sophomore Spring (16)
    "BIOL 111", "CHEM 115", "CHEM 117", "ENVSCI 210", "MATH 135",
    // Junior Fall (16)
    "BIOL 112", "CHEM 116", "CHEM 118", "ENVSCI 226", "ENVSCI 270",
    // Junior Spring (16)
    "PHYSIC 113", "PHYSIC 181", "ENVSCI 215", "ENVSCI 216", "ENVSCI 256",
    // Senior Fall (16)
    "PHYSIC 114", "ENVSCI 325", "ENVSTY 280", "ENVSTY 323", "ENVSCI 318",
    // Senior Spring (16)
    "ENVSCI 260", "ENVSCI 336L", "ENVSCI 341", "PHYSIC 182", "ENVSCI 327"
  ],

  major: [
    "ENVSCI 120",
    "ENVSCI 121",
    "ENVSCI 122",
    "ENVSCI 261",
    "ENVSCI 210",
    "ENVSCI 226",
    "ENVSCI 270",
    "ENVSCI 215",
    "ENVSCI 216",
    "ENVSCI 256",
    "ENVSCI 325",
    "ENVSTY 280",
    "ENVSTY 323",
    "ENVSCI 318",
    "ENVSCI 260",
    "ENVSCI 336L",
    "ENVSCI 341",
    "ENVSCI 327"
  ],

  track: [
    "ENVSCI 318",
    "ENVSCI 336L",
    "ENVSCI 341"
  ],

  core: [
    "SEMINR 126G",
    "IMS 200",
    "ENGL 101",
    "ENGL 102",
    "MATH 115",
    "MATH 125",
    "MATH 135",
    "CHEM 115",
    "CHEM 117",
    "CHEM 116",
    "CHEM 118",
    "BIOL 111",
    "BIOL 112",
    "PHYSIC 113",
    "PHYSIC 181",
    "PHYSIC 114",
    "PHYSIC 182"
  ]
},

    {
  name: "Environmental Science Track BS",
  subject: "ENVSCI",
  degree: "BS",
  minCredits: 120,
  creditCap: 16,
  notes: "8-semester plan (Freshman–Senior Fall/Spring), 5 courses per semester, 30 credits planned each year, 15–16 credits max per term, target 120 total credits (121–123 allowed if needed). First Year Seminar only in Freshman year. Intermediate Seminar only in Sophomore year. ENGL 101 is placed in Freshman Fall and ENGL 102 is placed in Freshman Spring. Includes 9 Distribution II courses across AR, HU, SB, NS, MT, WL, and WC. Environmental Science Track BS requirements represented here include: introductory courses (ENVSCI 120, ENVSCI 121, ENVSCI 122); designated skills courses (ENVSCI 261, MATH 125, ENVSCI 281); calculus requirement (MATH 135, MATH 140, MATH 145); natural science foundation courses represented here by BIOL 111, BIOL 112, CHEM 115, CHEM 117, CHEM 116, CHEM 118, PHYSIC 113, PHYSIC 181, PHYSIC 114, and PHYSIC 182; residency courses (ENVSCI 215, ENVSCI 216, ENVSCI 256, ENVSTY 280, ENVSTY 323); intermediate social science elective (ENVSCI 280); intermediate natural science electives (ENVSCI 210, ENVSCI 260, ENVSCI 226); Marine Science elective set represented here by BIOL 306 and BIOL 311; Earth and Hydrologic Sciences elective (ENVSCI 318); Environmental Policy and Management elective (ENVSCI 324); additional electives represented here by ENVSCI 315L, ENVSCI 316, ENVSCI 325, and ENVSTY 331; capstone (ENVSCI 476); and diversity courses (POLSCI 202 and HIST 175).",

  roadmapFlat: [
    // Freshman Fall (16)
    "SEMINR 126G", "ENGL 101", "ENVSCI 120", "MATH 115", "ART 100",
    // Freshman Spring (16)
    "ENGL 102", "ENVSCI 121", "ENVSCI 122", "SPAN 101", "PHIL 100",
    // Sophomore Fall (16)
    "IMS 200", "ENVSCI 261", "MATH 125", "POLSCI 202", "HIST 175",
    // Sophomore Spring (16)
    "BIOL 111", "CHEM 115", "CHEM 117", "ENVSCI 210", "MATH 135",
    // Junior Fall (16)
    "BIOL 112", "CHEM 116", "CHEM 118", "ENVSCI 260", "ENVSCI 280",
    // Junior Spring (16)
    "PHYSIC 113", "PHYSIC 181", "ENVSCI 215", "ENVSCI 216", "ENVSCI 256",
    // Senior Fall (16)
    "PHYSIC 114", "ENVSCI 316", "ENVSTY 280", "ENVSTY 323", "ENVSCI 226",
    // Senior Spring (16)
    "PHYSIC 182", "ENVSCI 318", "ENVSCI 324", "ENVSCI 325", "ENVSCI 476"
  ],

  major: [
    "ENVSCI 120",
    "ENVSCI 121",
    "ENVSCI 122",
    "ENVSCI 261",
    "ENVSCI 210",
    "ENVSCI 260",
    "ENVSCI 280",
    "ENVSCI 215",
    "ENVSCI 216",
    "ENVSCI 256",
    "ENVSCI 316",
    "ENVSTY 280",
    "ENVSTY 323",
    "ENVSCI 226",
    "ENVSCI 318",
    "ENVSCI 324",
    "ENVSCI 325",
    "ENVSCI 476"
  ],

  track: [
    "ENVSCI 324"
  ],

  core: [
    "SEMINR 126G",
    "IMS 200",
    "ENGL 101",
    "ENGL 102",
    "MATH 115",
    "MATH 125",
    "MATH 135",
    "CHEM 115",
    "CHEM 117",
    "CHEM 116",
    "CHEM 118",
     "BIOL 111",
    "BIOL 112",
    "PHYSIC 113",
    "PHYSIC 181",
    "PHYSIC 114",
    "PHYSIC 182"
  ]
},

    {
  name: "Marine Science Track BS",
  subject: "ENVSCI",
  degree: "BS",
  minCredits: 120,
  creditCap: 16,
  notes: "8-semester plan (Freshman–Senior Fall/Spring), 5 courses per semester, 30 credits planned each year, 15–16 credits max per term, target 120 total credits (121–123 allowed if needed). First Year Seminar only in Freshman year. Intermediate Seminar only in Sophomore year. ENGL 101 is placed in Freshman Fall and ENGL 102 is placed in Freshman Spring. Includes 9 Distribution II courses across AR, HU, SB, NS, MT, WL, and WC. Marine Science Track BS requirements represented here include: introductory courses (ENVSCI 120, ENVSCI 121, ENVSCI 122); designated skills courses (ENVSCI 261, MATH 125, ENVSCI 281); calculus requirement (MATH 135); natural science foundation courses represented here by BIOL 111, BIOL 112, CHEM 115, CHEM 117, CHEM 116, CHEM 118, PHYSIC 113, PHYSIC 181, PHYSIC 114, and PHYSIC 182; residency courses (ENVSCI 215, ENVSCI 216, ENVSCI 256, ENVSTY 280, ENVSTY 323); intermediate social science elective represented here by ENVSCI 280; intermediate natural science electives represented here by ENVSCI 210, ENVSCI 226, and ENVSCI 260; Marine Science elective set represented here by BIOL 306 and BIOL 311; Earth and Hydrologic Sciences elective represented here by ENVSCI 318; Environmental Policy and Management elective represented here by ENVSCI 324; capstone represented here by ENVSCI 476; and diversity courses (POLSCI 202 and HIST 175).",

  roadmapFlat: [
    // Freshman Fall (16)
    "SEMINR 126G", "ENGL 101", "ENVSCI 120", "MATH 115", "ART 100",
    // Freshman Spring (16)
    "ENGL 102", "ENVSCI 121", "ENVSCI 122", "SPAN 101", "PHIL 100",
    // Sophomore Fall (16)
    "IMS 200", "ENVSCI 261", "MATH 125", "POLSCI 202", "HIST 175",
    // Sophomore Spring (16)
    "BIOL 111", "CHEM 115", "CHEM 117", "ENVSCI 210", "MATH 135",
    // Junior Fall (16)
    "BIOL 112", "CHEM 116", "CHEM 118", "ENVSCI 226", "ENVSCI 280",
    // Junior Spring (16)
    "PHYSIC 113", "PHYSIC 181", "ENVSCI 215", "ENVSCI 216", "ENVSCI 256",
    // Senior Fall (16)
    "PHYSIC 114", "ENVSCI 316", "ENVSTY 280", "ENVSTY 323", "ENVSCI 260",
    // Senior Spring (15)
    "PHYSIC 182", "ENVSCI 325", "ENVSCI 318", "ENVSCI 324", "ENVSCI 476"
  ],

  major: [
    "ENVSCI 120",
    "ENVSCI 121",
    "ENVSCI 122",
    "ENVSCI 261",
    "ENVSCI 210",
    "ENVSCI 226",
    "ENVSCI 280",
    "ENVSCI 215",
    "ENVSCI 216",
    "ENVSCI 256",
    "ENVSCI 316",
    "ENVSTY 280",
    "ENVSTY 323",
    "ENVSCI 260",
    "ENVSCI 325",
    "ENVSCI 318",
    "ENVSCI 324",
    "ENVSCI 476"
  ],

  track: [
    "ENVSCI 316",
    "ENVSCI 325"
  ],

  core: [
    "SEMINR 126G",
    "IMS 200",
    "ENGL 101",
    "ENGL 102",
    "MATH 115",
    "MATH 125",
    "MATH 135",
    "BIOL 111",
    "BIOL 112",
    "CHEM 115",
    "CHEM 117",
    "CHEM 116",
    "CHEM 118",
    "PHYSIC 113",
    "PHYSIC 181",
    "PHYSIC 114",
    "PHYSIC 182"
  ]
},

    {
  name: "Language, Culture, and Society Track",
  subject: "LATAM",
  degree: "BA",
  minCredits: 120,
  creditCap: 16,
  notes: "8-semester plan (Freshman–Senior Fall/Spring), 5 courses per semester, 30 credits planned each year, 15–16 credits max per term, target 120 total credits (121–123 allowed if needed). First Year Seminar only in Freshman year. Intermediate Seminar only in Sophomore year. ENGL 101 is placed in Freshman Fall and ENGL 102 is placed in Freshman Spring. Includes 11 Distribution II courses across AR, HU, SB, NS, MT, WL, and WC. Language, Culture, and Society Track requirements represented here include language proficiency preparation (SPAN 101 and SPAN 102); core requirements selected here from the listed pairings (LATAM 101, LATAM 262L, LATAM 360); language courses selected here (SPAN 230, SPAN 289, SPAN 304, SPAN 316); 300-level advanced courses selected here (PORT 375L, SPAN 351, SPAN 352, SPAN 353); 400-level advanced course selected here (SPAN 432); international diversity course (POLSCI 202); and United States diversity course (HIST 175).",

  roadmapFlat: [
    // Freshman Fall (16)
    "SEMINR 126G", "ENGL 101", "MATH 115", "ART 100", "SPAN 101",
    // Freshman Spring (16)
    "ENGL 102", "SPAN 102", "PHIL 100", "PSYCH 100", "MUSIC 117",
    // Sophomore Fall (15)
    "IMS 200", "LATAM 101", "SPAN 230", "HIST 211", "BIOL 101",
    // Sophomore Spring (15)
    "LATAM 262L", "SPAN 289", "CHEM 111L", "IT 110", "POLSCI 102",
    // Junior Fall (15)
    "LATAM 360", "SPAN 304", "SPAN 316", "ECON 101", "AFRSTY 101",
    // Junior Spring (15)
    "PORT 375L", "SPAN 370", "SPAN 352", "SOCIOL 101", "CLSICS 161",
    // Senior Fall (15)
    "SPAN 362", "SPAN 432", "POLSCI 202", "ENVSCI 101", "THRART 122",
    // Senior Spring (15)
    "HIST 175", "ANTH 106", "DANCE 135", "MATH 125", "ANTH 256"
  ],

  major: [
    "LATAM 360",
    "SPAN 304",
    "SPAN 316",
    "SPAN 351",
    "SPAN 352",
    "SPAN 362",
    "SPAN 370",
    "SPAN 432"
  ],

  track: [
    "SPAN 230",
    "SPAN 289",
    "SPAN 304",
    "SPAN 316",
    "SPAN 352",
    "SPAN 362",
    "SPAN 432",
    "PORT 375L"
  ],

  core: [
    "SEMINR 126G",
    "IMS 200",
    "ENGL 101",
    "ENGL 102",
    "MATH 115",
    "SPAN 101",
    "SPAN 102",
    "LATAM 101",
    "LATAM 262L"
  ]
},

    {
  name: "Latin America Studies Track",
  subject: "LATAM",
  degree: "BA",
  minCredits: 120,
  creditCap: 16,
  notes: "8-semester plan (Freshman–Senior Fall/Spring), 5 courses per semester, 30 credits planned each year, 15–16 credits max per term, target 120 total credits (121–123 allowed if needed). First Year Seminar only in Freshman year. Intermediate Seminar only in Sophomore year. ENGL 101 is placed in Freshman Fall and ENGL 102 is placed in Freshman Spring. Includes 11 Distribution II courses across AR, HU, SB, NS, MT, WL, and WC. Latin America Studies Track requirements represented here include core requirements selected here from the listed pairings (LATAM 101, LATAM 262L, LATAM 360); one foundational course selected here (LATAM 255L); intermediate courses selected here (LATAM 205L, LATAM 210G, LATAM 270); 300-level advanced courses selected here (LATAM 303, SPAN 301, SPAN 320, LATAM 340); one 400-level advanced course selected here (LATAM 454L); international diversity course (POLSCI 202); and United States diversity course (HIST 175).",

  roadmapFlat: [
    // Freshman Fall (16)
    "SEMINR 126G", "ENGL 101", "MATH 115", "ART 100", "SPAN 101",
    // Freshman Spring (16)
    "ENGL 102", "SPAN 102", "PHIL 100", "PSYCH 100", "MUSIC 117",
    // Sophomore Fall (15)
    "IMS 200", "LATAM 101", "LATAM 205L", "HIST 211", "BIOL 101",
    // Sophomore Spring (15)
    "LATAM 255L", "LATAM 210G", "CHEM 111L", "IT 110", "POLSCI 102",
    // Junior Fall (15)
    "LATAM 262L", "LATAM 270", "SPAN 301", "ECON 101", "AFRSTY 101",
    // Junior Spring (15)
    "LATAM 360", "LATAM 303", "SPAN 320", "SOCIOL 101", "CLSICS 161",
    // Senior Fall (15)
    "LATAM 375L", "LATAM 454L", "POLSCI 202", "ENVSCI 101", "THRART 122",
    // Senior Spring (15)
    "HIST 175", "ANTH 106", "DANCE 135", "MATH 125", "ANTH 256"
  ],

  major: [
    "SPAN 301",
    "LATAM 360",
    "LATAM 303",
    "SPAN 320",
    "LATAM 375L",
    "LATAM 454L"
  ],

  track: [
    "LATAM 255L",
    "LATAM 205L",
    "LATAM 210G",
    "LATAM 270",
    "LATAM 303",
    "SPAN 301",
    "SPAN 320",
    "LATAM 360",
    "LATAM 454L"
  ],

  core: [
    "SEMINR 126G",
    "IMS 200",
    "ENGL 101",
    "ENGL 102",
    "MATH 115",
    "SPAN 101",
    "SPAN 102",
    "MATH 115",
    "LATAM 101",
    "LATAM 262L"
  ]
},   
    
   {
  name: "Translation Studies Track",
  subject: "LATAM",
  degree: "BA",
  minCredits: 120,
  creditCap: 16,
  notes: "8-semester plan (Freshman–Senior Fall/Spring), 5 courses per semester, 30 credits planned each year, 15–16 credits max per term, target 120 total credits (121–123 allowed if needed). First Year Seminar only in Freshman year. Intermediate Seminar only in Sophomore year. ENGL 101 is placed in Freshman Fall and ENGL 102 is placed in Freshman Spring. Includes 11 Distribution II courses across AR, HU, SB, NS, MT, WL, and WC. Translation Studies Track requirements represented here include language courses selected here (LATAM 101, LATAM 160, LATAM 262L, LATAM 360); translation courses selected here (SPAN 230, SPAN 289, SPAN 304); advanced course selected here (SPAN 317); advanced 400-level course selected here (SPAN 403); international diversity course (POLSCI 202); and United States diversity course (HIST 175).",

  roadmapFlat: [
    // Freshman Fall (16)
    "SEMINR 126G", "ENGL 101", "MATH 115", "ART 100", "SPAN 101",
    // Freshman Spring (16)
    "ENGL 102", "SPAN 102", "PHIL 100", "PSYCH 100", "MUSIC 117",
    // Sophomore Fall (15)
    "IMS 200", "LATAM 101", "SPAN 230", "HIST 211", "BIOL 101",
    // Sophomore Spring (15)
    "LATAM 160", "SPAN 289", "CHEM 111L", "IT 110", "POLSCI 102",
    // Junior Fall (15)
    "LATAM 262L", "SPAN 304", "SPAN 316", "ECON 101", "AFRSTY 101",
    // Junior Spring (15)
    "LATAM 305", "MATH 125", "SOCIOL 101", "CLSICS 161", "ENVSCI 101",
    // Senior Fall (15)
    "SPAN 317", "POLSCI 202", "LATAM 360", "DANCE 135", "SPAN 403",
    // Senior Spring (15)
    "SPAN 352", "ANTH 106", "ANTH 256", "THRART 122", "HIST 175"
  ],

  major: [
    "SPAN 304",
    "SPAN 316",
    "LATAM 360",
    "SPAN 403",
    "SPAN 317",
    "LATAM 305",
    "SPAN 352"
  ],

  track: [
    "SPAN 230",
    "SPAN 289",
    "SPAN 304",
    "SPAN 317",
    "SPAN 403"
  ],

  core: [
    "SEMINR 126G",
    "IMS 200",
    "ENGL 101",
    "ENGL 102",
    "MATH 115",
    "SPAN 101",
    "SPAN 102",
    "LATAM 101",
    "LATAM 160",
    "LATAM 262L",
    "LATAM 360"
  ]
},

    {
  name: "General Math Concentration BA",
  subject: "MATH",
  degree: "BA",
  minCredits: 120,
  creditCap: 16,
  notes: "8-semester plan (Freshman–Senior Fall/Spring), 5 courses per semester, 30 credits planned each year, 15–16 credits max per term, target 120 total credits (121–123 allowed if needed). First Year Seminar only in Freshman year. Intermediate Seminar only in Sophomore year. ENGL 101 is placed in Freshman Fall and ENGL 102 is placed in Freshman Spring. Includes 11 Distribution II courses across AR, HU, SB, NS, MT, WL, and WC. General Math Concentration BA requirements represented here include science core courses selected here (PHYSIC 113, CS 110); mathematics core (MATH 140, MATH 141, MATH 242, MATH 260, MATH 265, MATH 270, MATH 291, MATH 314, MATH 345); capstone selected here (MATH 420); math courses selected here (MATH 309, MATH 370, MATH 380, MATH 390); upper-level math group courses selected here (MATH 358, MATH 360, MATH 361, MATH 440); upper-level math electives selected here (MATH 450, MATH 455); one International Diversity course (POLSCI 202); and one United States Diversity course (HIST 175).",

  roadmapFlat: [
    // Freshman Fall (16)
    "SEMINR 126G", "ENGL 101", "ART 100", "PHIL 100", "ECON 101",
    // Freshman Spring (16)
    "MATH 140", "ENGL 102", "HIST 211", "BIOL 101", "AFRSTY 101",
    // Sophomore Fall (16)
    "IMS 200", "MATH 260", "MATH 265", "MATH 141", "CS 110",
    // Sophomore Spring (16)
    "POLSCI 102", "MATH 291", "MATH 309", "CHEM 111L", "THRART 122",
    // Junior Fall (16)
    "MATH 242", "MATH 270", "MATH 314", "MATH 345", "ANTH 256",
    // Junior Spring (15)
    "IT 110", "PHYSIC 113", "MATH 358", "MATH 360", "MATH 390",
    // Senior Fall (16)
    "SPAN 101", "MATH 361", "MATH 370", "MATH 380", "POLSCI 202",
    // Senior Spring (15)
    "MATH 420", "MATH 440", "MATH 450", "MATH 455", "HIST 175"
  ],

  major: [
    "MATH 309",
    "MATH 358",
    "MATH 360",
    "MATH 361",
    "MATH 370",
    "MATH 380",
    "MATH 390",
    "MATH 420",
    "MATH 440",
    "MATH 450",
    "MATH 455"
  ],

  core: [
    "SEMINR 126G",
    "IMS 200",
    "CS 110",
    "PHYSIC 113",
    "ENGL 101",
    "ENGL 102",
    "MATH 140",
    "MATH 141",
    "MATH 242",
    "MATH 260",
    "MATH 265",
    "MATH 270",
    "MATH 291",
    "MATH 314",
    "MATH 345"
  ]
},

    {
  name: "Teaching Mathematics Concentration BA",
  subject: "MATH",
  degree: "BA",
  minCredits: 120,
  creditCap: 16,
  notes: "8-semester plan (Freshman–Senior Fall/Spring), 5 courses per semester, 30 credits planned each year, 15–16 credits max per term, target 120 total credits (121–123 allowed if needed). First Year Seminar only in Freshman year. Intermediate Seminar only in Sophomore year. ENGL 101 is placed in Freshman Fall and ENGL 102 is placed in Freshman Spring. Includes 11 Distribution II courses across AR, HU, SB, NS, MT, WL, and WC. Teaching Mathematics Concentration BA requirements represented here include science core courses selected here (PHYSIC 113, CS 110); mathematics core (MATH 140, MATH 141, MATH 242, MATH 260, MATH 265, MATH 270, MATH 291, MATH 314, MATH 345); capstone selected here (MATH 420); math courses selected here (MATH 309, MATH 370, MATH 380, MATH 390); required concentration courses selected here (MATH 360, MATH 370, MATH 458, MATH 460); upper-level math electives selected here (MATH 358, MATH 455); one International Diversity course (POLSCI 202); and one United States Diversity course (HIST 175).",

  roadmapFlat: [
    // Freshman Fall (16)
    "SEMINR 126G", "ENGL 101", "ART 100", "PHIL 100", "ECON 101",
    // Freshman Spring (16)
    "MATH 140", "ENGL 102", "HIST 211", "BIOL 101", "AFRSTY 101",
    // Sophomore Fall (16)
    "IMS 200", "MATH 260", "MATH 265", "MATH 141", "CS 110",
    // Sophomore Spring (16)
    "POLSCI 102", "MATH 291", "MATH 309", "CHEM 111L", "THRART 122",
    // Junior Fall (16)
    "MATH 242", "MATH 270", "MATH 314", "MATH 345", "ANTH 256",
    // Junior Spring (15)
    "IT 110", "PHYSIC 113", "MATH 358", "MATH 360", "MATH 390",
    // Senior Fall (16)
    "SPAN 101", "MATH 370", "MATH 380", "MATH 458", "POLSCI 202",
    // Senior Spring (15)
    "MATH 420", "MATH 455", "MATH 460", "HIST 175", "DANCE 135"
  ],

  major: [
    "MATH 309",
    "MATH 358",
    "MATH 360",
    "MATH 370",
    "MATH 380",
    "MATH 390",
    "MATH 420",
    "MATH 455",
    "MATH 458",
    "MATH 460"
  ],

  concentration: [
    "MATH 360",
    "MATH 370",
    "MATH 458",
    "MATH 460"
  ],

  core: [
    "SEMINR 126G",
    "IMS 200",
    "CS 110",
    "PHYSIC 113",
    "PHYSIC 114",
    "ENGL 101",
    "ENGL 102",
    "MATH 140",
    "MATH 141",
    "MATH 242",
    "MATH 260",
    "MATH 265",
    "MATH 270",
    "MATH 291",
    "MATH 314",
    "MATH 345"
  ]
},

    {
  name: "General Math Concentration BS",
  subject: "MATH",
  degree: "BS",
  minCredits: 120,
  creditCap: 16,
  notes: "8-semester plan (Freshman–Senior Fall/Spring), 5 courses per semester, 30 credits planned each year, 15–16 credits max per term, target 120 total credits (121–123 allowed if needed). First Year Seminar only in Freshman year. Intermediate Seminar only in Sophomore year. ENGL 101 is placed in Freshman Fall and ENGL 102 is placed in Freshman Spring. Includes 9 Distribution II courses across AR, HU, SB, NS, MT, WL, and WC. General Math Concentration BS requirements represented here include science core courses (PHYSIC 113, CS 110); mathematics core (MATH 140, MATH 141, MATH 242, MATH 260, MATH 265, MATH 270, MATH 291, MATH 314, MATH 345); capstone selected here (MATH 420); math courses (MATH 309, MATH 370, MATH 380, MATH 390); Fundamentals of Physics II (PHYSIC 114); additional science courses selected here (CHEM 115, BIOL 111, BIOCHM 383); additional lab or non-lab course selected here (PHYSIC 211); General Mathematics Concentration courses selected here (MATH 450, MATH 356, MATH 360, MATH 361); upper-level math electives selected here (MATH 358, MATH 455); one International Diversity course (POLSCI 202); and one United States Diversity course (HIST 175).",

  roadmapFlat: [
    // Freshman Fall (15-16)
    "SEMINR 126G", "ENGL 101", "MATH 140", "PHIL 100", "ART 100",
    // Freshman Spring (15-16)
    "ENGL 102", "MATH 141", "HIST 211", "CHEM 115", "PHYSIC 113",
    // Sophomore Fall (15-16)
    "IMS 200", "MATH 242", "MATH 260", "MATH 265", "CS 110",
    // Sophomore Spring (15-16)
    "MATH 270", "MATH 291", "PHYSIC 114", "POLSCI 102", "IT 110",
    // Junior Fall (15-16)
    "MATH 309", "MATH 314", "MATH 345", "PHYSIC 211", "SPAN 101",
    // Junior Spring (15-16)
    "MATH 356", "MATH 360", "MATH 370", "ECON 101", "BIOL 111",
    // Senior Fall (15-16)
    "MATH 358", "MATH 361", "MATH 380", "MATH 390", "BIOCHM 383",
    // Senior Spring (15-16)
    "MATH 450", "MATH 455", "MATH 420", "POLSCI 202", "HIST 175"
  ],

  major: [
    "MATH 309",
    "MATH 356",
    "MATH 358",
    "MATH 360",
    "MATH 361",
    "MATH 370",
    "MATH 380",
    "MATH 390",
    "MATH 420",
    "MATH 450",
    "MATH 455"
  ],

  concentration: [
    "PHYSIC 114",
    "MATH 358",
    "MATH 360",
    "MATH 450",
    "MATH 361"
  ],

  core: [
    "SEMINR 126G",
    "IMS 200",
    "ENGL 101",
    "ENGL 102",
    "PHYSIC 113",
    "PHYSIC 114",
    "CS 110",
    "MATH 140",
    "MATH 141",
    "MATH 242",
    "MATH 260",
    "MATH 265",
    "MATH 270",
    "MATH 291",
    "MATH 314",
    "MATH 345"
  ]
},

   {
  name: "Computational Math Concentration BS",
  subject: "MATH",
  degree: "BS",
  minCredits: 120,
  creditCap: 16,
  notes: "8-semester plan (Freshman–Senior Fall/Spring), 5 courses per semester, 30 credits planned each year, 15–16 credits max per term, target 120 total credits (121–123 allowed if needed). First Year Seminar only in Freshman year. Intermediate Seminar only in Sophomore year. ENGL 101 is placed in Freshman Fall and ENGL 102 is placed in Freshman Spring. Includes 9 Distribution II courses across AR, HU, SB, NS, MT, WL, and WC. Computational Math Concentration BS requirements represented here include science core courses (PHYSIC 113, CS 110); mathematics core (MATH 140, MATH 141, MATH 242, MATH 260, MATH 265, MATH 270, MATH 291, MATH 314, MATH 345); capstone selected here (MATH 420); math courses (MATH 309, MATH 370, MATH 380, MATH 390); Fundamentals of Physics II (PHYSIC 114); additional science courses selected here (CHEM 115, BIOL 111, BIOCHM 383); additional lab or non-lab course selected here (PHYSIC 211); required concentration courses selected here (MATH 360, MATH 425, MATH 426, MATH 447, MATH 448); upper-level math elective selected here (MATH 455); one International Diversity course (POLSCI 202); and one United States Diversity course (HIST 175).",

  roadmapFlat: [
    // Freshman Fall (15-16)
    "SEMINR 126G", "ENGL 101", "MATH 140", "ART 100", "PHYSIC 181",
    // Freshman Spring (15-16)
    "ENGL 102", "MATH 141", "LATAM 101", "CHEM 115", "PHYSIC 113",
    // Sophomore Fall (15-16)
    "IMS 200", "MATH 242", "MATH 260", "MATH 265", "CS 110",
    // Sophomore Spring (15-16)
    "MATH 270", "MATH 291", "PHYSIC 114", "PHIL 100", "IT 110",
    // Junior Fall (15-16)
    "MATH 309", "MATH 314", "MATH 345", "PHYSIC 211", "SPAN 101",
    // Junior Spring (15-16)
    "MATH 360", "MATH 370", "MATH 380", "ECON 101", "BIOL 111",
    // Senior Fall (15-16)
    "MATH 390", "MATH 425", "MATH 426", "MATH 447", "BIOCHM 383",
    // Senior Spring (15-16)
    "MATH 448", "MATH 455", "MATH 420", "POLSCI 202", "HIST 175"
  ],

  major: [
    "MATH 309",
    "MATH 360",
    "MATH 370",
    "MATH 380",
    "MATH 390",
    "MATH 425",
    "MATH 426",
    "MATH 447",
    "MATH 448",
    "MATH 455",
    "MATH 420"
  ],

  concentration: [
    "PHYSIC 114",
    "MATH 360",
    "MATH 425",
    "MATH 426",
    "MATH 447",
    "MATH 448"
  ],

  core: [
    "SEMINR 126G",
    "IMS 200",
    "ENGL 101",
    "ENGL 102",
    "PHYSIC 113",
    "CS 110",
    "MATH 140",
    "MATH 141",
    "MATH 242",
    "MATH 260",
    "MATH 265",
    "MATH 270",
    "MATH 291",
    "MATH 314",
    "MATH 345"
  ]
},

    {
  name: "Pure and Applied Math Concentration BS",
  subject: "MATH",
  degree: "BS",
  minCredits: 120,
  creditCap: 16,
  notes: "8-semester plan (Freshman–Senior Fall/Spring), 5 courses per semester, 30 credits planned each year, 15–16 credits max per term, target 120 total credits (121–123 allowed if needed). First Year Seminar only in Freshman year. Intermediate Seminar only in Sophomore year. ENGL 101 is placed in Freshman Fall and ENGL 102 is placed in Freshman Spring. Includes 9 Distribution II courses across AR, HU, SB, NS, MT, WL, and WC. Pure and Applied Math Concentration BS requirements represented here include science core courses (PHYSIC 113, CS 110); mathematics core (MATH 140, MATH 141, MATH 242, MATH 260, MATH 265, MATH 270, MATH 291, MATH 314, MATH 345); capstone selected here (MATH 420); math courses (MATH 309, MATH 370, MATH 380, MATH 390); Fundamentals of Physics II (PHYSIC 114); additional science courses selected here (CHEM 115, BIOL 111, BIOCHM 383); additional lab or non-lab course selected here (PHYSIC 211); concentration courses (MATH 358, MATH 360, MATH 361, MATH 450); upper-level math electives selected here (MATH 350, MATH 455); one International Diversity course (POLSCI 202); and one United States Diversity course (HIST 175).",

  roadmapFlat: [
    // Freshman Fall (15-16)
    "SEMINR 126G", "ENGL 101", "MATH 140", "ART 100", "PHYSIC 181",
    // Freshman Spring (15-16)
    "ENGL 102", "MATH 141", "LATAM 101", "CHEM 115", "PHYSIC 113",
    // Sophomore Fall (15-16)
    "IMS 200", "MATH 242", "MATH 260", "MATH 265", "CS 110",
    // Sophomore Spring (15-16)
    "MATH 270", "MATH 291", "PHYSIC 114", "PHIL 100", "IT 110",
    // Junior Fall (15-16)
    "MATH 309", "MATH 314", "MATH 345", "PHYSIC 211", "SPAN 101",
    // Junior Spring (15-16)
    "MATH 358", "MATH 360", "MATH 370", "ECON 102", "BIOL 111",
    // Senior Fall (15-16)
    "MATH 361", "MATH 380", "MATH 390", "MATH 450", "BIOCHM 383",
    // Senior Spring (15-16)
    "MATH 350", "MATH 455", "MATH 420", "POLSCI 202", "HIST 175"
  ],

  major: [
    "MATH 309",
    "MATH 350",
    "MATH 358",
    "MATH 360",
    "MATH 361",
    "MATH 370",
    "MATH 380",
    "MATH 390",
    "MATH 420",
    "MATH 450",
    "MATH 455"
  ],

  concentration: [
    "MATH 358",
    "MATH 360",
    "MATH 361",
    "MATH 450"
  ],

  core: [
    "SEMINR 126G",
    "IMS 200",
    "ENGL 101",
    "ENGL 102",
    "PHYSIC 113",
    "CS 110",
    "MATH 140",
    "MATH 141",
    "MATH 242",
    "MATH 260",
    "MATH 265",
    "MATH 270",
    "MATH 291",
    "MATH 314",
    "MATH 345"
  ]
},


{
  name: "Accounting Concentration",
  subject: "MGT",
  degree: "BS",
  minCredits: 120,
  creditCap: 16,
  notes: "8-semester plan (Freshman–Senior Fall/Spring), 5 courses per semester, 30 credits planned each year, 15–16 credits max per term, target 120 total credits (121–123 allowed if needed). First Year Seminar only in Freshman Fall. Intermediate Seminar only in Sophomore year. ENGL 101 is placed in Freshman Fall and ENGL 102 is placed in Freshman Spring. Includes 9 Distribution II courses across AR, HU, SB, NS, MT, WL, and WC. Management BS core includes Business Foundation (MSIS 110, MSIS 111L, MSIS 212), Accounting Core (AF 210, AF 211, AF 301), Management Core (MGT 303, MGT 330, MGT 331), Marketing Core (MKT 301), Information Systems Core (MSIS 301), and Capstone (MGT 490). Accounting Concentration includes AF 310, AF 311, AF 315, AF 363, AF 450, AF 470, and one accounting elective. Includes one International Diversity course (POLSCI 202) and one United States Diversity course (HIST 175).",

  roadmapFlat: [
    // Freshman Fall (15-16)
    "SEMINR 126G", "ENGL 101", "MSIS 110", "ECON 101", "ART 100",

    // Freshman Spring (15-16)
    "ENGL 102", "MSIS 111L", "AF 210", "MATH 115", "PHIL 100",

    // Sophomore Fall (15-16)
    "IMS 200", "MSIS 212", "AF 211", "ECON 102", "BC 290",

    // Sophomore Spring (15-16)
    "AF 301", "MGT 303", "BC 298", "SPAN 101", "SOCIOL 101",

    // Junior Fall (15-16)
    "MGT 330", "MSIS 301", "AF 310", "AF 311", "MGT 331",

    // Junior Spring (15-16)
    "AF 315", "AF 363", "AF 470", "MKT 301", "BIOL 111",

    // Senior Fall (15-16)
    "AF 450", "AF 330", "MGT 490", "POLSCI 202", "CHEM 115",

    // Senior Spring (15-16)
    "HIST 175", "PSYCH 100", "MUSIC 117", "PHYSIC 107", "DANCE 135"
  ],

  major: [
    "MGT 303",
    "MGT 330",
    "MGT 331",
    "MGT 490"
  ],

  concentration: [
    "AF 310",
    "AF 311",
    "AF 315",
    "AF 363",
    "AF 450",
    "AF 470",
    "AF 330"
  ],

  core: [
    "SEMINR 126G",
    "IMS 200",
    "ENGL 101",
    "ENGL 102",
    "ECON 101",
    "ECON 102",
    "MSIS 110",
    "MSIS 111L",
    "MSIS 212",
    "AF 210",
    "AF 211",
    "AF 301",
    "MGT 303",
    "MGT 330",
    "MGT 331",
    "MKT 301",
    "MSIS 301"
  ]
},


{
  name: "Entrepreneurship Concentration",
  subject: "MGT",
  degree: "BS",
  minCredits: 120,
  creditCap: 16,
  notes: "8-semester plan (Freshman–Senior Fall/Spring), 5 courses per semester, 30 credits planned each year, 15–16 credits max per term, target 120 total credits (121–123 allowed if needed). First Year Seminar only in Freshman Fall. Intermediate Seminar only in Sophomore year. ENGL 101 is placed in Freshman Fall and ENGL 102 is placed in Freshman Spring. Includes 9 Distribution II courses across AR, HU, SB, NS, MT, WL, and WC. Management BS core includes Business Foundation (MSIS 110, MSIS 111L, MSIS 212), Accounting Core (AF 210, AF 211, AF 301), Management Core (MGT 303, MGT 330, MGT 331), Marketing Core (MKT 301), Information Systems Core (MSIS 301), and Capstone (MGT 490). Entrepreneurship Concentration includes required courses (MGT 470, MKT 465) and elective courses selected here (BC 298, MGT 350, MGT 415, MGT 434, MGT 474). Includes one International Diversity course (POLSCI 202) and one United States Diversity course (HIST 175).",

  roadmapFlat: [
    // Freshman Fall (15-16)
    "SEMINR 126G", "ENGL 101", "MSIS 110", "ECON 101", "ART 100",

    // Freshman Spring (15-16)
    "ENGL 102", "MSIS 111L", "AF 210", "MATH 115", "PHIL 100",

    // Sophomore Fall (15-16)
    "IMS 200", "MSIS 212", "AF 211", "ECON 102", "BC 290",

    // Sophomore Spring (15-16)
    "AF 301", "MGT 303", "SPAN 101", "IT 110", "SOCIOL 101",

    // Junior Fall (15-16)
    "MGT 330", "MSIS 301", "BC 298", "MGT 350", "MGT 331",

    // Junior Spring (15-16)
    "MGT 415", "MGT 434", "MKT 465", "MKT 301", "BIOL 111",

    // Senior Fall (15-16)
    "MGT 470", "MGT 474", "MGT 490", "POLSCI 202", "CHEM 115",

    // Senior Spring (15-16)
    "HIST 175", "PSYCH 100", "MUSIC 117", "PHYSIC 107", "DANCE 135"
  ],

  major: [
    "MGT 303",
    "MGT 330",
    "MGT 331",
    "MGT 350",
    "MGT 415",
    "MGT 434",
    "MGT 470",
    "MGT 474",
    "MGT 490",
  ],

  concentration: [
    "MGT 470",
    "MKT 465",
  ],

  core: [
    "SEMINR 126G",
    "IMS 200",
    "ENGL 101",
    "ENGL 102",
    "ECON 101",
    "ECON 102",
    "MSIS 110",
    "MSIS 111L",
    "MSIS 212",
    "AF 210",
    "AF 211",
    "AF 301",
    "MGT 303",
    "MGT 330",
    "MGT 331",
    "MKT 301",
    "MSIS 301"
  ]
},


{
  name: "Finance Concentration",
  subject: "MGT",
  degree: "BS",
  minCredits: 120,
  creditCap: 16,
  notes: "8-semester plan (Freshman–Senior Fall/Spring), 5 courses per semester, 30 credits planned each year, 15–16 credits max per term, target 120 total credits (121–123 allowed if needed). First Year Seminar only in Freshman Fall. Intermediate Seminar only in Sophomore year. ENGL 101 is placed in Freshman Fall and ENGL 102 is placed in Freshman Spring. Includes 9 Distribution II courses across AR, HU, SB, NS, MT, WL, and WC. Management BS core includes Business Foundation (MSIS 110, MSIS 111L, MSIS 212), Accounting Core (AF 210, AF 211, AF 301), Management Core (MGT 303, MGT 330, MGT 331), Marketing Core (MKT 301), Information Systems Core (MSIS 301), and Capstone (MGT 490). Finance Concentration includes required courses (AF 325, AF 335, AF 495) and elective courses selected here (AF 426, AF 435). Includes one International Diversity course (POLSCI 202) and one United States Diversity course (HIST 175).",

  roadmapFlat: [
    // Freshman Fall (15-16)
    "SEMINR 126G", "ENGL 101", "MSIS 110", "ECON 101", "ART 100",

    // Freshman Spring (15-16)
    "ENGL 102", "MSIS 111L", "AF 210", "MATH 115", "PHIL 100",

    // Sophomore Fall (15-16)
    "IMS 200", "MSIS 212", "AF 211", "ECON 102", "BC 290",

    // Sophomore Spring (15-16)
    "AF 301", "MGT 303", "SPAN 101", "IT 110", "SOCIOL 101",

    // Junior Fall (15-16)
    "MGT 330", "MSIS 301", "AF 325", "MKT 301", "MGT 331",

    // Junior Spring (15-16)
    "AF 426", "AF 435", "HIST 175", "BIOL 111", "PSYCH 100",

    // Senior Fall (15-16)
    "AF 435", "MGT 490", "POLSCI 202", "CHEM 115", "MUSIC 117",

    // Senior Spring (15-16)
    "AF 495", "PHYSIC 107", "DANCE 135", "SOCIOL 101", "PHIL 100"
  ],

  major: [
    "MGT 303",
    "MGT 330",
    "MGT 331",
    "MGT 490",
  ],

  concentration: [
    "AF 325",
    "AF 335",
    "AF 495",
    "AF 426",
    "AF 435"
  ],

  core: [
    "SEMINR 126G",
    "IMS 200",
    "ENGL 101",
    "ENGL 102",
    "ECON 101",
    "ECON 102",
    "MSIS 110",
    "MSIS 111L",
    "MSIS 212",
    "AF 210",
    "AF 211",
    "AF 301",
    "MGT 303",
    "MGT 330",
    "MGT 331",
    "MKT 301",
    "MSIS 301"
  ]
},


{
  name: "Human Resource Management Concentration",
  subject: "MGT",
  degree: "BS",
  minCredits: 120,
  creditCap: 16,
  notes: "8-semester plan (Freshman–Senior Fall/Spring), 5 courses per semester, 30 credits planned each year, 15–16 credits max per term, target 120 total credits (121–123 allowed if needed). First Year Seminar only in Freshman Fall. Intermediate Seminar only in Sophomore year. ENGL 101 is placed in Freshman Fall and ENGL 102 is placed in Freshman Spring. Includes 9 Distribution II courses across AR, HU, SB, NS, MT, WL, and WC. Management BS core includes Business Foundation (MSIS 110, MSIS 111L, MSIS 212), Accounting Core (AF 210, AF 211, AF 301), Management Core (MGT 303, MGT 330, MGT 331), Marketing Core (MKT 301), Information Systems Core (MSIS 301), and Capstone (MGT 490). Human Resource Management Concentration includes required courses (MGT 401, MGT 421, MGT 450) and additional major courses selected here (MGT 402, MGT 480). Includes one International Diversity course (POLSCI 202) and one United States Diversity course (HIST 175).",

  roadmapFlat: [
    // Freshman Fall (15-16)
    "SEMINR 126G", "ENGL 101", "MSIS 110", "ECON 101", "ART 100",

    // Freshman Spring (15-16)
    "ENGL 102", "MSIS 111L", "AF 210", "MATH 115", "PHIL 100",

    // Sophomore Fall (15-16)
    "IMS 200", "MSIS 212", "AF 211", "ECON 102", "BC 290",

    // Sophomore Spring (15-16)
    "AF 301", "MGT 303", "SPAN 101", "SOCIOL 101", "ENVSCI 120",

    // Junior Fall (15-16)
    "MGT 330", "MSIS 301", "MGT 401", "MGT 421", "MGT 331",

    // Junior Spring (15-16)
    "MGT 402", "MGT 480", "MKT 301", "BIOL 111", "PSYCH 100",

    // Senior Fall (15-16)
    "MGT 450", "MGT 490", "POLSCI 202", "CHEM 115", "SPAN 101",

    // Senior Spring (15-16)
    "HIST 175", "PHYSIC 107", "DANCE 135", "SOCIOL 101", "PHIL 100"
  ],

  major: [
    "MGT 303",
    "MGT 330",
    "MGT 331",
    "MGT 401",
    "MGT 421",
    "MGT 450",
    "MGT 402",
    "MGT 480",
    "MGT 490",
  ],

  concentration: [
    "MGT 401",
    "MGT 421",
    "MGT 450",
    "MGT 402",
    "MGT 480"
  ],

  core: [
    "SEMINR 126G",
    "IMS 200",
    "ENGL 101",
    "ENGL 102",
    "ECON 101",
    "ECON 102",
    "MSIS 110",
    "MSIS 111L",
    "MSIS 212",
    "BC 290",
    "AF 210",
    "AF 211",
    "AF 301",
    "MGT 303",
    "MGT 330",
    "MGT 331",
    "MKT 301",
    "MSIS 301"
  ]
},


{
  name: "Information System & Business Analytics Concentration",
  subject: "MGT",
  degree: "BS",
  minCredits: 120,
  creditCap: 16,
  notes: "8-semester plan (Freshman–Senior Fall/Spring), 5 courses per semester, 30 credits planned each year, 15–16 credits max per term, target 120 total credits (121–123 allowed if needed). First Year Seminar only in Freshman Fall. Intermediate Seminar only in Sophomore year. ENGL 101 is placed in Freshman Fall and ENGL 102 is placed in Freshman Spring. Includes 9 Distribution II courses across AR, HU, SB, NS, MT, WL, and WC. Management BS core includes Business Foundation (MSIS 110, MSIS 111L, MSIS 212), Accounting Core (AF 210, AF 211, AF 301), Management Core (MGT 303, MGT 330, MGT 331), Marketing Core (MKT 301), Information Systems Core (MSIS 301), and Capstone (MGT 490). Information System & Business Analytics Concentration includes required courses (IT 116, IT 230L, IT 370, IT 471) and elective courses (IT 425L, IT 456). Includes one International Diversity course (POLSCI 202) and one United States Diversity course (HIST 175).",

  roadmapFlat: [
    // Freshman Fall (15-16)
    "SEMINR 126G", "ENGL 101", "MSIS 110", "ECON 101", "ART 100",

    // Freshman Spring (15-16)
    "ENGL 102", "MSIS 111L", "AF 210", "MATH 115", "PHIL 100",

    // Sophomore Fall (15-16)
    "IMS 200", "MSIS 212", "AF 211", "ECON 102", "BC 290",

    // Sophomore Spring (15-16)
    "AF 301", "MGT 303", "SPAN 101", "IT 110", "SOCIOL 101",

    // Junior Fall (15-16)
    "MGT 331", "MSIS 301", "IT 116", "IT 230L", "MGT 330",

    // Junior Spring (15-16)
    "IT 370", "IT 425L", "MKT 301", "BIOL 111", "PSYCH 100",

    // Senior Fall (15-16)
    "IT 471", "IT 456", "MGT 490", "POLSCI 202", "CHEM 115",

    // Senior Spring (15-16)
    "HIST 175", "PHYSIC 107", "DANCE 135", "MUSIC 117", "PHIL 100"
  ],

  major: [
    "MGT 303",
    "MGT 330",
    "MGT 331",
    "MGT 490"
  ],

  concentration: [
    "IT 116",
    "IT 230L",
    "IT 370",
    "IT 471",
    "IT 425L",
    "IT 456"
  ],

  core: [
    "SEMINR 126G",
    "IMS 200",
    "ENGL 101",
    "ENGL 102",
    "ECON 101",
    "ECON 102",
    "BC 290",
    "MSIS 110",
    "MSIS 111L",
    "MSIS 212",
    "AF 210",
    "AF 211",
    "AF 301",
    "MGT 303",
    "MGT 330",
    "MGT 331",
    "MKT 301",
    "MSIS 301"
  ]
},


{
  name: "Interdisciplinary Business Concentration",
  subject: "MGT",
  degree: "BS",
  minCredits: 120,
  creditCap: 16,
  notes: "8-semester plan (Freshman–Senior Fall/Spring), 5 courses per semester, 30 credits planned each year, 15–16 credits max per term, target 120 total credits (121–123 allowed if needed). First Year Seminar only in Freshman Fall. Intermediate Seminar only in Sophomore year. ENGL 101 is placed in Freshman Fall and ENGL 102 is placed in Freshman Spring. Includes 9 Distribution II courses across AR, HU, SB, NS, MT, WL, and WC. Management BS core includes Business Foundation (MSIS 110, MSIS 111L, MSIS 212), Accounting Core (AF 210, AF 211, AF 301), Management Core (MGT 303, MGT 330, MGT 331), Marketing Core (MKT 301), Information Systems Core (MSIS 301), and Capstone (MGT 490). Interdisciplinary Business Concentration includes Accounting/Finance course (AF 315), Management course (MGT 401), Marketing course (MKT 403), and elective selected here (IT 370). Includes one International Diversity course (POLSCI 202) and one United States Diversity course (HIST 175).",

  roadmapFlat: [
    // Freshman Fall (15-16)
    "SEMINR 126G", "ENGL 101", "MSIS 110", "ECON 101", "ART 100",

    // Freshman Spring (15-16)
    "ENGL 102", "MSIS 111L", "AF 210", "MATH 115", "PHIL 100",

    // Sophomore Fall (15-16)
    "IMS 200", "MSIS 212", "AF 211", "BIOL 111", "BC 290",

    // Sophomore Spring (15-16)
    "AF 301", "MGT 303", "SPAN", "IT 110", "ECON 102",

    // Junior Fall (15-16)
    "MGT 331", "MSIS 301", "AF 315", "MGT 401", "MGT 330",

    // Junior Spring (15-16)
    "MKT 403", "IT 370", "SOCIOL 101", "MKT 301", "PSYCH 100",

    // Senior Fall (15-16)
    "MGT 490", "POLSCI 202", "CHEM 115", "MUSIC 117", "PHYSIC 107",

    // Senior Spring (15-16)
    "HIST 175", "DANCE 135", "PHIL 100", "SOCIOL 101", "ART 100"
  ],

  major: [
    "MGT 303",
    "MGT 330",
    "MGT 331",
    "MGT 401",
    "MGT 490",
    
  ],

  concentration: [
    "AF 315",
    "MGT 401",
    "MKT 403",
    "IT 370"
  ],

  core: [
    "SEMINR 126G",
    "IMS 200",
    "ENGL 101",
    "ENGL 102",
    "ECON 101",
    "ECON 102",
    "BC 290",
    "MSIS 110",
    "MSIS 111L",
    "MSIS 212",
    "AF 210",
    "AF 211",
    "AF 301",
    "MGT 303",
    "MGT 330",
    "MGT 331",
    "MKT 301",
    "MSIS 301"
  ]
},



{
  name: "International Management Concentration",
  subject: "MGT",
  degree: "BS",
  minCredits: 120,
  creditCap: 16,
  notes: "8-semester plan (Freshman–Senior Fall/Spring), 5 courses per semester, 30 credits planned each year, 15–16 credits max per term, target 120 total credits (121–123 allowed if needed). First Year Seminar only in Freshman Fall. Intermediate Seminar only in Sophomore year. ENGL 101 is placed in Freshman Fall and ENGL 102 is placed in Freshman Spring. Includes 9 Distribution II courses across AR, HU, SB, NS, MT, WL, and WC. Management BS core includes Business Foundation (MSIS 110, MSIS 111L, MSIS 212), Accounting Core (AF 210, AF 211, AF 301), Management Core (MGT 303, MGT 330, MGT 331), Marketing Core (MKT 301), Information Systems Core (MSIS 301), and Capstone (MGT 490). International Management Concentration includes required courses (AF 455, MGT 434, MKT 430) and elective courses selected here (ECON 334, GLBAFF 220). Includes one International Diversity course (POLSCI 202) and one United States Diversity course (HIST 175).",

  roadmapFlat: [
    // Freshman Fall (15-16)
    "SEMINR 126G", "ENGL 101", "MSIS 110", "ECON 101", "ART 100",

    // Freshman Spring (15-16)
    "ENGL 102", "MSIS 111L", "AF 210", "MATH 115", "PHIL 100",

    // Sophomore Fall (15-16)
    "IMS 200", "MSIS 212", "AF 211", "BC 290", "SOCIOL 101",

    // Sophomore Spring (15-16)
    "AF 301", "MGT 303", "BIOL 111", "IT 110", "SPAN 101",

    // Junior Fall (15-16)
    "MGT 331", "MSIS 301", "MGT 330", "MKT 430", "MKT 301",

    // Junior Spring (15-16)
    "AF 455", "ECON 334", "GLBAFF 220", "MGT 434", "PSYCH 100",

    // Senior Fall (15-16)
    "MGT 490", "POLSCI 202", "CHEM 115", "MUSIC 117", "PHYSIC 107",

    // Senior Spring (15-16)
    "HIST 175", "DANCE 135", "PHIL 100", "SOCIOL 101", "ART 100"
  ],

  major: [
    "MGT 303",
    "MGT 330",
    "MGT 331",
    "MGT 434",
    "MGT 490",
  ],

  concentration: [
    "AF 455",
    "MGT 434",
    "MKT 430",
    "ECON 334",
    "GLBAFF 220"
  ],

  core: [
    "SEMINR 126G",
    "IMS 200",
    "ENGL 101",
    "ENGL 102",
    "ECON 101",
    "ECON 102",
    "BC 290",
    "MSIS 110",
    "MSIS 111L",
    "MSIS 212",
    "AF 210",
    "AF 211",
    "AF 301",
    "MGT 303",
    "MGT 330",
    "MGT 331",
    "MKT 301",
    "MSIS 301"
  ]
},



{
  name: "Leadership and Organizational Change Concentration",
  subject: "MGT",
  degree: "BS",
  minCredits: 120,
  creditCap: 16,
  notes: "8-semester plan (Freshman–Senior Fall/Spring), 5 courses per semester, 30 credits planned each year, 15–16 credits max per term, target 120 total credits (121–123 allowed if needed). First Year Seminar only in Freshman Fall. Intermediate Seminar only in Sophomore year. ENGL 101 is placed in Freshman Fall and ENGL 102 is placed in Freshman Spring. Includes 9 Distribution II courses across AR, HU, SB, NS, MT, WL, and WC. Management BS core includes Business Foundation (MSIS 110, MSIS 111L, MSIS 212), Accounting Core (AF 210, AF 211, AF 301), Management Core (MGT 303, MGT 330, MGT 331), Marketing Core (MKT 301), Information Systems Core (MSIS 301), and Capstone (MGT 490). Leadership and Organizational Change Concentration includes required courses (MGT 421, MGT 434) and elective courses selected here (MGT 401, MGT 450, MGT 470). Includes one International Diversity course (POLSCI 202) and one United States Diversity course (HIST 175).",

  roadmapFlat: [
    // Freshman Fall (15-16)
    "SEMINR 126G", "ENGL 101", "MSIS 110", "ECON 101", "ART 100",

    // Freshman Spring (15-16)
    "ENGL 102", "MSIS 111L", "AF 210", "MATH 115", "PHIL 100",

    // Sophomore Fall (15-16)
    "IMS 200", "MSIS 212", "AF 211", "IT 110", "BC 290",

    // Sophomore Spring (15-16)
    "AF 301", "MGT 303", "SPAN 101", "ECON 102", "SOCIOL 101",

    // Junior Fall (15-16)
    "MGT 331", "MSIS 301", "MGT 421", "MGT 434", "MGT 330",

    // Junior Spring (15-16)
    "MGT 401", "MGT 450", "MGT 470", "MKT 301", "BIOL 111",

    // Senior Fall (15-16)
    "MGT 490", "POLSCI 202", "CHEM 115", "MUSIC 117", "PHYSIC 107",

    // Senior Spring (15-16)
    "HIST 175", "DANCE 135", "PHIL 100", "SOCIOL 101", "PSYCH 100"
  ],

  major: [
    "MGT 303",
    "MGT 330",
    "MGT 331",
    "MGT 401",
    "MGT 421",
    "MGT 434",
    "MGT 450",
    "MGT 470",
    "MGT 490",
  ],

  concentration: [
    "MGT 421",
    "MGT 434",
    "MGT 401",
    "MGT 450",
    "MGT 470"
  ],

  core: [
    "SEMINR 126G",
    "IMS 200",
    "ENGL 101",
    "ENGL 102",
    "ECON 101",
    "ECON 102",
    "BC 290",
    "MSIS 110",
    "MSIS 111L",
    "MSIS 212",
    "AF 210",
    "AF 211",
    "AF 301",
    "MGT 303",
    "MGT 330",
    "MGT 331",
    "MKT 301",
    "MSIS 301"
  ]
},



{
  name: "Marketing Concentration",
  subject: "MGT",
  degree: "BS",
  minCredits: 120,
  creditCap: 16,
  notes: "8-semester plan (Freshman–Senior Fall/Spring), 5 courses per semester, 30 credits planned each year, 15–16 credits max per term, target 120 total credits (121–123 allowed if needed). First Year Seminar only in Freshman Fall. Intermediate Seminar only in Sophomore year. ENGL 101 is placed in Freshman Fall and ENGL 102 is placed in Freshman Spring. Includes 9 Distribution II courses across AR, HU, SB, NS, MT, WL, and WC. Management BS core includes Business Foundation (MSIS 110, MSIS 111L, MSIS 212), Accounting Core (AF 210, AF 211, AF 301), Management Core (MGT 303, MGT 330, MGT 331), Marketing Core (MKT 301), Information Systems Core (MSIS 301), and Capstone (MGT 490). Marketing Concentration includes data analysis course (MKT 310) and elective marketing courses selected here (MKT 403, MKT 405, MKT 409, MKT 430). Includes one International Diversity course (POLSCI 202) and one United States Diversity course (HIST 175).",

  roadmapFlat: [
    // Freshman Fall (15-16)
    "SEMINR 126G", "ENGL 101", "MSIS 110", "ECON 101", "ART 100",

    // Freshman Spring (15-16)
    "ENGL 102", "MSIS 111L", "AF 210", "MATH 115", "ECON 102",

    // Sophomore Fall (15-16)
    "IMS 200", "MSIS 212", "AF 211", "IT 110", "BC 290",

    // Sophomore Spring (15-16)
    "AF 301", "MGT 303", "SPAN 101", "PHIL 100", "SOCIOL 101",

    // Junior Fall (15-16)
    "MGT 331", "MSIS 301", "MKT 310", "MKT 403", "MGT 330",

    // Junior Spring (15-16)
    "MKT 405", "MKT 409", "MKT 301", "BIOL 111", "PSYCH 100",

    // Senior Fall (15-16)
    "MKT 430", "MGT 490", "POLSCI 202", "CHEM 115", "MUSIC 117",

    // Senior Spring (15-16)
    "HIST 175", "PHYSIC 107", "DANCE 135", "PHIL 100", "ART 100"
  ],

  major: [
    "MGT 303",
    "MGT 330",
    "MGT 331",
    "MGT 490",
    "MKT 310",
    "MKT 403",
    "MKT 405",
    "MKT 409",
    "MKT 430",
  ],

  concentration: [
    "MKT 310",
    "MKT 403",
    "MKT 405",
    "MKT 409",
    "MKT 430"
  ],

  core: [
    "SEMINR 126G",
    "IMS 200",
    "ENGL 101",
    "ENGL 102",
    "ECON 101",
    "ECON 102",
    "BC 290",
    "MSIS 110",
    "MSIS 111L",
    "MSIS 212",
    "AF 210",
    "AF 211",
    "AF 301",
    "MGT 303",
    "MGT 330",
    "MGT 331",
    "MKT 301",
    "MSIS 301"
  ]
},



{
  name: "Sport Business Concentration",
  subject: "MGT",
  degree: "BS",
  minCredits: 120,
  creditCap: 16,
  notes: "8-semester plan (Freshman–Senior Fall/Spring), 5 courses per semester, 30 credits planned each year, 15–16 credits max per term, target 120 total credits (121–123 allowed if needed). First Year Seminar only in Freshman Fall. Intermediate Seminar only in Sophomore year. ENGL 101 is placed in Freshman Fall and ENGL 102 is placed in Freshman Spring. Includes 9 Distribution II courses across AR, HU, SB, NS, MT, WL, and WC. Management BS core includes Business Foundation (MSIS 110, MSIS 111L, MSIS 212), Accounting Core (AF 210, AF 211, AF 301), Management Core (MGT 303, MGT 330, MGT 331), Marketing Core (MKT 301), Information Systems Core (MSIS 301), and Capstone (MGT 490). Sport Business Concentration includes required courses (AF 405, MGT 415, MKT 425, MSIS 435), elective selected here (MGT 350), and sport business elective selected here (SL 180). Includes one International Diversity course (POLSCI 202) and one United States Diversity course (HIST 175).",

  roadmapFlat: [
    // Freshman Fall (15-16)
    "SEMINR 126G", "ENGL 101", "MSIS 110", "ECON 101", "ART 100",

    // Freshman Spring (15-16)
    "ENGL 102", "MSIS 111L", "AF 210", "MATH 115", "PHIL 100",

    // Sophomore Fall (15-16)
    "IMS 200", "MSIS 212", "AF 211", "ECON 102", "BC 290",

    // Sophomore Spring (15-16)
    "AF 301", "MGT 303", "SPAN 101", "SOCIOL 101", "IT 110",

    // Junior Fall (15-16)
    "MGT 331", "MSIS 301", "MGT 415", "MKT 425", "MGT 330",

    // Junior Spring (15-16)
    "AF 405", "MSIS 461L", "MGT 350", "MKT 301", "BIOL 111",

    // Senior Fall (15-16)
    "SL 180", "MGT 490", "SPAN 102", "CHEM 115", "MUSIC 117",

    // Senior Spring (15-16)
    "HIST 175", "POLSCI 202", "DANCE 135", "PHIL 100", "PSYCH 100"
  ],

  major: [
    "MGT 303",
    "MGT 330",
    "MGT 331",
    "MGT 350",
    "MGT 415",
    "MGT 490",
    "MKT 301",
    "MKT 425",
  ],

  concentration: [
    "AF 405",
    "MGT 415",
    "MKT 425",
    "MSIS 435",
    "MGT 350",
    "SL 180"
  ],

  core: [
    "SEMINR 126G",
    "IMS 200",
    "ENGL 101",
    "ENGL 102",
    "ECON 101",
    "ECON 102",
    "BC 290",
    "MSIS 110",
    "MSIS 111L",
    "MSIS 212",
    "AF 210",
    "AF 211",
    "AF 301",
    "MGT 303",
    "MGT 330",
    "MGT 331",
    "MKT 301",
    "MSIS 301"
  ]
},



{
  name: "Supply Chain & Service Management Concentration",
  subject: "MGT",
  degree: "BS",
  minCredits: 120,
  creditCap: 16,
  notes: "8-semester plan (Freshman–Senior Fall/Spring), 5 courses per semester, 30 credits planned each year, 15–16 credits max per term, target 120 total credits (121–123 allowed if needed). First Year Seminar only in Freshman Fall. Intermediate Seminar only in Sophomore year. ENGL 101 is placed in Freshman Fall and ENGL 102 is placed in Freshman Spring. Includes 9 Distribution II courses across AR, HU, SB, NS, MT, WL, and WC. Management BS core includes Business Foundation (MSIS 110, MSIS 111L, MSIS 212), Accounting Core (AF 210, AF 211, AF 301), Management Core (MGT 303, MGT 330, MGT 331), Marketing Core (MKT 301), Information Systems Core (MSIS 301), and Capstone (MGT 490). Supply Chain & Service Management Concentration includes required courses (SCSM 454L, SCSM 495) and elective courses selected here (SCSM 350, SCSM 450, MSIS 480). Includes one International Diversity course (POLSCI 202) and one United States Diversity course (HIST 175).",

  roadmapFlat: [
    // Freshman Fall (15-16)
    "SEMINR 126G", "ENGL 101", "MSIS 110", "ECON 101", "ART 100",

    // Freshman Spring (15-16)
    "ENGL 102", "MSIS 111L", "AF 210", "MATH 115", "ECON 102",

    // Sophomore Fall (15-16)
    "IMS 200", "MSIS 212", "AF 211", "IT 110", "BC 290",

    // Sophomore Spring (15-16)
    "AF 301", "MGT 303", "SPAN 101", "PHIL 100", "SOCIOL 101",

    // Junior Fall (15-16)
    "MKT 301", "MSIS 301", "SCSM 350", "PSYCH 100", "MGT 330",

    // Junior Spring (15-16)
    "SCSM 454L", "MSIS 480", "MGT 331", "BIOL 111", "SCSM 450",

    // Senior Fall (15-16)
    "SCSM 495", "MGT 490", "POLSCI 202", "CHEM 115", "MUSIC 117",

    // Senior Spring (15-16)
    "HIST 175", "PHYSIC 107", "DANCE 135", "PHIL 100", "ART 100"
  ],

  major: [
    "MGT 303",
    "MGT 330",
    "MGT 331",
    "MGT 490",
    "SCSM 350",
    "SCSM 450",
    "SCSM 454L",
    "SCSM 495",
    "MSIS 480"
  ],

  concentration: [
    "SCSM 454L",
    "SCSM 495",
    "SCSM 350",
    "SCSM 450",
    "MSIS 480"
  ],

  core: [
    "SEMINR 126G",
    "IMS 200",
    "ENGL 101",
    "ENGL 102",
    "ECON 101",
    "ECON 102",
    "BC 290",
    "MSIS 110",
    "MSIS 111L",
    "MSIS 212",
    "AF 210",
    "AF 211",
    "AF 301",
    "MGT 303",
    "MGT 330",
    "MGT 331",
    "MKT 301",
    "MSIS 301"
  ]
},






  ];


  const trackMajorOptions = [
    "Information Technology - College of Management BS Major",
    "Information Technology - College of Science and Mathematics BS Major",
    "American Studies - BA Major",
    "Asian Studies - BA Major",
    "Biology - BS Major",
    "Community Development - BA Major",
    "Early Education & Care In Business Settings - BA Major",
    "Engineering Physics - BS Major",
    "English - BA Major",
    "Environmental Science - BA Major",
    "Environmental Science - BS Major",
    "Latin American and Iberian Studies - BA Major",
    "Management - BS Major",
    "Mathematics - BA Major",
    "Mathematics - BS Major",
  ];

  const trackOptionsByMajor = {
    "Information Technology - College of Management BS Major": [
      "Business Intelligence Track (CM)",
      "Computer Forensics Track (CM)",
      "Information Architecture Track (CM)",
      "System Administration Track (CM)",
    ],
    "Information Technology - College of Science and Mathematics BS Major": [
      "Business Intelligence Track (CSM)",
      "Computer Forensics Track (CSM)",
      "Information Architecture Track (CSM)",
      "System Administration Track (CSM)",
    ],
    "American Studies - BA Major": [
      "Media and Culture Track",
      "Migration and Empire Track",
      "Social Movement and Identity Formation Track",
    ],
    "Asian Studies - BA Major": [
      "East Asian Studies Track",
      "South Asian Studies Track",
    ],
    "Biology - BS Major": [
      "Biotechnology Track",
    ],
    "Community Development - BA Major": [
      "Community Health Concentration",
      "Economic Development Concentration",
    ],
    "Early Education & Care In Business Settings - BA Major": [
      "Early Childhood Licensure Prek-2 Concentration",
      "Early Intervention Concentration",
      "Infant/toddler Early Intervention Concentration",
      "Infant/Toddler Education Concentration",
      "Leadership & Administration Concentration",
      "Preschool Education And Care Concentration",
    ],
    "Engineering Physics - BS Major": [
      "Applied Physics Concentration",
      "Computer Science Concentration",
      "Digital Electronics Concentration",
      "Organic Chemistry Concentration",
      "Physical Chemistry Concentration",
    ],
    "English - BA Major": [
      "Creative Writing Concentration",
      "English Teaching Concentration",
      "Irish Studies Concentration",
      "Literary History Concentration",
      "Professional Writing Concentration",
      "Race, Ethnicity, and Literature Concentration",
    ],
    "Environmental Science - BA Major": [
      "Earth and Hydrologic Science Track BA",
      "Environmental Science Track BA",
      "Marine Science Track BA",
    ],
    "Environmental Science - BS Major": [
      "Earth and Hydrologic Science Track BS",
      "Environmental Science Track BS",
      "Marine Science Track BS",
    ],
    "Latin American and Iberian Studies - BA Major": [
      "Language, Culture, and Society Track",
      "Latin America Studies Track",
      "Translation Studies Track",
    ],
    "Management - BS Major": [
      "Accounting Concentration",
      "Entrepreneurship Concentration",
      "Finance Concentration",
      "Human Resource Management Concentration",
      "Information System & Business Analytics Concentration",
      "Interdisciplinary Business Concentration",
      "International Management Concentration",
      "Leadership and Organizational Change Concentration",
      "Marketing Concentration",
      "Sport Business Concentration",
      "Supply Chain & Service Management Concentration",
    ],
    "Mathematics - BA Major": [
      "General Math Concentration BA",
      "Teaching Mathematics Concentration BA",
    ],
    "Mathematics - BS Major": [
      "Computational Math Concentration BS",
      "General Math Concentration BS",
      "Pure and Applied Math Concentration BS",
    ],
  };

  const demoTracksByMajor = trackOptionsByMajor;
  const majorsWithTracks = new Set(trackMajorOptions);

  
  // =====================================================
  // DISTRIBUTION II (Gen Ed) RULES + HELPERS
  // BA majors: 11 courses designated with a Distribution II area
  // BS majors: 9 courses designated with a Distribution II area
  // Areas: AR, HU, SB, NS, MT, WL, WC
  // NOTE: Many course objects in allCourses do not currently include AR/HU/SB/NS/MT/WL/WC tags in their "type" array.
  // We provide a lightweight classification layer (overrides + prefix rules) so journey.html can count these consistently.
  // =====================================================
  const distributionII = {
    requiredCountByDegree: { BA: 11, BS: 9 },
    areas: {
      AR: { name: "Arts", prefixes: ["ART","MUSIC","THRART","DANCE","CINE"] },
      HU: { name: "Humanities", prefixes: ["PHIL","HIST","ENGL","CLSICS","RELSTY"] },
      SB: { name: "Social & Behavioral Sciences", prefixes: ["PSYCH","SOCIOL","ECON","POLSCI","ANTH"] },
      NS: { name: "Natural Sciences", prefixes: ["BIOL","CHEM","PHYSIC","ENVSCI"] },
      MT: { name: "Mathematics/Technology", prefixes: ["MATH","CS","IT","MSIS"] },
      WL: { name: "World Languages", prefixes: ["SPAN","FRENCH","CHINSE","JAPAN","ITAL","ARABIC","PORT","VIET","RUSS","GERMAN","GREEK","LATIN"] },
      WC: { name: "World Cultures", prefixes: ["ASIAN","AFRSTY","LATAM","ANTH"] }
    },

    // Course-level overrides for Distribution II area tagging.
    // Use these when a course's prefix could belong to multiple areas or when you want explicit control.
    // Value is a single area code or an array of area codes.
    overrides: {
      "ART 100": "AR",
      "ART 101": "AR",
      "MUSIC 100": "AR",
      "MUSIC 115": "AR",
      "THRART 100": "AR",
      "PHIL 100": "HU",
      "HIST 101": "HU",
      "ENGL 200": "HU",
      "CLSICS 284": "HU",
      "PSYCH 100": "SB",
      "SOCIOL 101": "SB",
      "ECON 101": "SB",
      "POLSCI 102": "SB",
      "ANTH 106": ["SB","WC"],

      "BIOL 101": "NS",
      "CHEM 115": "NS",
      "PHYSIC 107": "NS",
      "ENVSCI 120": "NS",

      "MATH 115": "MT",
      "MATH 125": "MT",
      "CS 110": "MT",
      "IT 110": "MT",

      "SPAN 101": "WL",
      "FRENCH 101": "WL",
      "CHINSE 101": "WL",
      "JAPAN 101": "WL",
      "ITAL 101": "WL",
      "ITAL 102": "WL",
      "ARABIC 101": "WL",

      "AFRSTY 101": "WC",
      "ASIAN 115": "WC",
      "LATAM 100": "WC"
    }
  };

  function getDegreeTypeFromMajorName(name){
    // Common patterns used in your major list.
    // Examples: "Accounting BS", "Africana Studies BA", "Accelerated Bachelor of Science in Nursing"
    const n = String(name || "").toUpperCase();
    if (/\bBA\b/.test(n) || n.includes("BACHELOR OF ARTS")) return "BA";
    if (/\bBS\b/.test(n) || n.includes("BACHELOR OF SCIENCE")) return "BS";
    // Default to BA if unknown (safer for gen-ed counting, because BA requires more Dist II courses)
    return "BA";
  }

  function getDist2AreasForCourse(course){
    if (!course || !course.code) return [];
    const code = course.code.trim();
    // 1) Explicit override
    const ov = distributionII.overrides[code];
    if (ov) return Array.isArray(ov) ? ov.slice() : [ov];

    // 2) If the course already has tags in its type array
    const t = Array.isArray(course.type) ? course.type : [];
    const direct = ["AR","HU","SB","NS","MT","WL","WC"].filter(a => t.includes(a));
    if (direct.length) return direct;

    // 3) Prefix inference
    const prefix = code.split(/\s+/)[0];
    const hits = [];
    Object.keys(distributionII.areas).forEach(area => {
      if (distributionII.areas[area].prefixes.includes(prefix)) hits.push(area);
    });
    return hits;
  }



  // =====================================================
  // COURSE DATA
  // - Includes: IT full list + CS full list + a few demo gen-ed placeholders
  // - prereqs are SIMULATED (basic chains) to support “can take / warning” logic
  // - subject is derived from course code prefix (e.g., "IT", "CS")
  // =====================================================
  const allCourses = [

  // ===== Additional shared seminar + gen-ed courses (added for plans) =====
  { code:"SEMINR 126G", title:"First Year Seminar Requirement", credits:4, difficulty:"Easy", type:["SEMINR","FYS","First Year Seminar"], prereqs:[] },
  { code:"IMS 200", title:"Intermediate Seminar Requirement", credits:3, difficulty:"Easy", type:["IMS","Intermediate Seminar"], prereqs:[] },
  { code:"THRART 122", title:"Theatre Arts (Arts Requirement)", credits:3, difficulty:"Easy", type:["THRART","AR"], prereqs:[] },

  // ===== Added for Classical Languages (BA) roadmap =====
  { code:"GREEK 201", title:"Intermediate Greek I", credits:3, difficulty:"Moderate", type:["GREEK","WL"], prereqs:["GREEK 102"] },
  { code:"GREEK 202", title:"Intermediate Greek II", credits:3, difficulty:"Moderate", type:["GREEK","WL"], prereqs:["GREEK 201"] },
  { code:"LATIN 302", title:"Advanced Latin II (300-level)", credits:3, difficulty:"Hard", type:["LATIN","WL"], prereqs:["LATIN 301"] },
  // ===== Added for Classical Studies (BA) roadmap =====
  { code:"CLSICS 301", title:"Classical Studies (300-level)", credits:3, difficulty:"Moderate", type:["CLSICS","HU"], prereqs:[] },
  { code:"CLSICS 320", title:"Classical Studies (300-level)", credits:3, difficulty:"Moderate", type:["CLSICS","HU"], prereqs:[] },
  { code:"CLSICS 330", title:"Classical Studies (300-level)", credits:3, difficulty:"Moderate", type:["CLSICS","HU"], prereqs:[] },
  { code:"CLSICS 350", title:"Classical Studies (300-level)", credits:3, difficulty:"Moderate", type:["CLSICS","HU"], prereqs:[] },
  { code:"CLSICS 360", title:"Classical Studies (300-level)", credits:3, difficulty:"Moderate", type:["CLSICS","HU"], prereqs:[] },
  { code:"CLSICS 370", title:"Classical Studies (300-level)", credits:3, difficulty:"Moderate", type:["CLSICS","HU"], prereqs:[] },

  // ===== Added for Art (BA) roadmap =====
  { code:"ART 300", title:"Advanced Art History (300-level)", credits:3, difficulty:"Moderate", type:["ART","AR"], prereqs:[] },
  { code:"ART 330", title:"Art 300-Level Elective", credits:3, difficulty:"Moderate", type:["ART","AR"], prereqs:[] },
  { code:"ART 350", title:"Art 300-Level Elective", credits:3, difficulty:"Moderate", type:["ART","AR"], prereqs:[] },
  { code:"ART 360", title:"Art 300-Level Elective", credits:3, difficulty:"Moderate", type:["ART","AR"], prereqs:[] },
  { code:"ART 370", title:"Art 300-Level Elective", credits:3, difficulty:"Moderate", type:["ART","AR"], prereqs:[] },
  { code:"ART 390", title:"Advanced Studio / Art Elective", credits:3, difficulty:"Moderate", type:["ART","AR"], prereqs:[] },
  { code:"ART 395", title:"Advanced Studio / Art Elective", credits:3, difficulty:"Moderate", type:["ART","AR"], prereqs:[] },
  { code:"ART 401", title:"Advanced Studio / Art Elective", credits:3, difficulty:"Moderate", type:["ART","AR"], prereqs:[] },
  { code:"ART 410", title:"Art Elective", credits:3, difficulty:"Moderate", type:["ART","AR"], prereqs:[] },
  { code:"ART 420", title:"Art Elective", credits:3, difficulty:"Moderate", type:["ART","AR"], prereqs:[] },


  // ===== Added for Anthropology (BA) roadmap =====
  { code:"ANTH 360", title:"Upper-Level Anthropology", credits:3, difficulty:"Moderate", type:["ANTH"], prereqs:[] },
  { code:"ANTH 370", title:"Upper-Level Anthropology", credits:3, difficulty:"Moderate", type:["ANTH"], prereqs:[] },
  { code:"ANTH 376", title:"Comparative Analysis", credits:3, difficulty:"Moderate", type:["ANTH"], prereqs:[] },
  { code:"ANTH 410", title:"Upper-Level Anthropology", credits:3, difficulty:"Moderate", type:["ANTH"], prereqs:[] },
  { code:"ANTH 420", title:"Upper-Level Anthropology", credits:3, difficulty:"Moderate", type:["ANTH"], prereqs:[] },

  // ===== Added for Africana Studies (BA) roadmap =====
  { code:"AFRSTY 210", title:"Africana Studies Elective", credits:3, difficulty:"Moderate", type:["AFRSTY"], prereqs:[] },
  { code:"AFRSTY 220", title:"Africana Studies Elective", credits:3, difficulty:"Moderate", type:["AFRSTY"], prereqs:[] },
  { code:"AFRSTY 302", title:"Africana Studies Upper-Level", credits:3, difficulty:"Moderate", type:["AFRSTY"], prereqs:[] },
  { code:"AFRSTY 303", title:"Africana Studies Upper-Level", credits:3, difficulty:"Moderate", type:["AFRSTY"], prereqs:[] },
  { code:"AFRSTY 304", title:"Africana Studies Upper-Level", credits:3, difficulty:"Moderate", type:["AFRSTY"], prereqs:[] },
  { code:"AFRSTY 305", title:"Africana Studies Upper-Level", credits:3, difficulty:"Moderate", type:["AFRSTY"], prereqs:[] },
  { code:"AFRSTY 401", title:"Africana Studies Upper-Level", credits:3, difficulty:"Moderate", type:["AFRSTY"], prereqs:[] },
  { code:"AFRSTY 410", title:"Africana Studies Upper-Level", credits:3, difficulty:"Moderate", type:["AFRSTY"], prereqs:[] },
  { code:"AFRSTY 420", title:"Africana Studies Upper-Level", credits:3, difficulty:"Moderate", type:["AFRSTY"], prereqs:[] },
  { code:"AFRSTY 430", title:"Africana Studies Upper-Level", credits:3, difficulty:"Moderate", type:["AFRSTY"], prereqs:[] },
  { code:"POLSCI 230", title:"Methods Requirement", credits:3, difficulty:"Moderate", type:["POLSCI", "SB"], prereqs:[] },
  { code:"SOCIOL 202", title:"Methods Requirement", credits:3, difficulty:"Moderate", type:["SOCIOL", "SB"], prereqs:[] },

  { code:"THRART 361", title:"Theatre Arts (Arts Requirement)", credits:3, difficulty:"Moderate", type:["THRART","AR"], prereqs:[] },
  { code:"PSYCH 100", title:"Introductory Psychology", credits:3, difficulty:"Easy", type:["PSYCH","SB"], prereqs:[] },
  { code:"PSYCH 230", title:"Social Psychology", credits:3, difficulty:"Moderate", type:["PSYCH","SB"], prereqs:["PSYCH 100"] },

  { code:"SPAN 101", title:"Elementary Spanish I", credits:4, difficulty:"Easy", type:["SPAN","WL"], prereqs:[] },
  { code:"SPAN 102", title:"Elementary Spanish II", credits:4, difficulty:"Easy", type:["SPAN","WL"], prereqs:["SPAN 101"] },
  { code:"SOCIOL 101", title:"Introduction to Sociology", credits:3, difficulty:"Easy", type:["SOCIOL","SB"], prereqs:[] },
  { code:"SOCIOL 343", title:"Sociology of Education", credits:3, difficulty:"Moderate", type:["SOCIOL","SB"], prereqs:[] },
{ code:"MUSIC 100", title:"Music Appreciation", credits:3, difficulty:"Easy", type:["MUSIC"], prereqs:[] },
{ code:"LATAM 100", title:"Intro to Latin American Studies", credits:3, difficulty:"Easy", type:["LATAM"], prereqs:[] },
{ code:"THRART 100", title:"Introduction to Theatre", credits:3, difficulty:"Easy", type:["THRART"], prereqs:[] },


  { code:"PCSCOR 200", title:"PCSCOR 200 Course", credits:3, difficulty:"Moderate", type:["UPCD"], prereqs:[] },

  { code:"PCSCOR 220", title:"PCSCOR 220 Course", credits:3, difficulty:"Moderate", type:["UPCD"], prereqs:[] },

  { code:"PCSCOR 325", title:"PCSCOR 325 Course", credits:3, difficulty:"Moderate", type:["UPCD"], prereqs:[] },

  { code:"PCSCOR 350", title:"PCSCOR 350 Course", credits:3, difficulty:"Moderate", type:["UPCD"], prereqs:[] },

  { code:"PCSCOR 370", title:"PCSCOR 370 Course", credits:3, difficulty:"Moderate", type:["UPCD"], prereqs:[] },

  { code:"CSTCTR 225", title:"CSTCTR 225 Course", credits:3, difficulty:"Moderate", type:["UPCD"], prereqs:[] },

  { code:"CSTCTR 250", title:"CSTCTR 250 Course", credits:3, difficulty:"Moderate", type:["UPCD"], prereqs:[] },

  { code:"CSTCTR 300", title:"CSTCTR 300 Course", credits:3, difficulty:"Moderate", type:["UPCD"], prereqs:[] },

  { code:"CSTCTR 325", title:"CSTCTR 325 Course", credits:3, difficulty:"Moderate", type:["UPCD"], prereqs:[] },

  { code:"CSTCTR 330", title:"CSTCTR 330 Course", credits:3, difficulty:"Moderate", type:["UPCD"], prereqs:[] },

  { code:"CSTCTR 335", title:"CSTCTR 335 Course", credits:3, difficulty:"Moderate", type:["UPCD"], prereqs:[] },

  { code:"CSTCTR 370", title:"CSTCTR 370 Course", credits:3, difficulty:"Moderate", type:["UPCD"], prereqs:[] },

  { code:"CSTCTR 400", title:"CSTCTR 400 Course", credits:3, difficulty:"Moderate", type:["UPCD"], prereqs:[] },

  { code:"CSTCTR 430", title:"CSTCTR 430 Course", credits:3, difficulty:"Moderate", type:["UPCD"], prereqs:[] },

  { code:"CSTCTR 490", title:"CSTCTR 490 Course", credits:3, difficulty:"Moderate", type:["UPCD"], prereqs:[] },

  // ===== Added for Computer Engineering (BS) roadmap =====
  { code:"ENGIN 187S", title:"Engineering Gateway Seminar", credits:1, difficulty:"Moderate", type:["ENGIN","Seminar"], prereqs:[] },
  { code:"ENGIN 441", title:"Computer Engineering Elective", credits:3, difficulty:"Moderate", type:["ENGIN","Elective"], prereqs:[] },


  // ===== Added for Criminology & Criminal Justice (BA) roadmap =====
  { code:"SOCIOL 104", title:"Social Problems / Intro to Criminology Topics", credits:3, difficulty:"Moderate", type:["SOCIOL","SB"], prereqs:[] },
  { code:"SOCIOL 262", title:"Criminology", credits:3, difficulty:"Moderate", type:["SOCIOL","SB"], prereqs:[] },
  { code:"SOCIOL 316", title:"Advanced Criminology", credits:3, difficulty:"Moderate", type:["SOCIOL","SB"], prereqs:[] },
  { code:"SOCIOL 337", title:"Systems of Criminal Justice", credits:3, difficulty:"Moderate", type:["SOCIOL","SB"], prereqs:[] },
  { code:"SOCIOL 338", title:"Systems of Criminal Justice", credits:3, difficulty:"Moderate", type:["SOCIOL","SB"], prereqs:[] },
  { code:"SOCIOL 363", title:"Systems of Criminal Justice", credits:3, difficulty:"Moderate", type:["SOCIOL","SB"], prereqs:[] },
  { code:"SOCIOL 350", title:"Quantitative Methods", credits:3, difficulty:"Moderate", type:["SOCIOL","SB"], prereqs:[] },
  { code:"SOCIOL 352", title:"Quantitative Methods", credits:3, difficulty:"Moderate", type:["SOCIOL","SB"], prereqs:[] },
  { code:"SOCIOL 474", title:"Criminology & Criminal Justice Capstone", credits:3, difficulty:"Moderate", type:["SOCIOL","SB","Capstone"], prereqs:[] },
  { code:"SOCIOL 460", title:"Major Elective (Field/Internship)", credits:6, difficulty:"Moderate", type:["SOCIOL","SB","Elective"], prereqs:[] },
  { code:"SOCIOL 461", title:"Major Elective (Field/Internship)", credits:6, difficulty:"Moderate", type:["SOCIOL","SB","Elective"], prereqs:[] },


  // ===== Added for Environmental Studies & Sustainability (BA) roadmap =====
  { code:"ENVSTY 320", title:"Environmental Studies Elective", credits:3, difficulty:"Moderate", type:["ENVSTY","SB"], prereqs:[] },
  { code:"UPCD 310", title:"Urban Planning / Development Elective", credits:3, difficulty:"Moderate", type:["UPCD","SB"], prereqs:[] },
  { code:"ECON 345L", title:"Economics / Development (Lab)", credits:3, difficulty:"Moderate", type:["ECON","SB"], prereqs:[] },
  { code:"SOCIOL 301", title:"Sociology Elective", credits:3, difficulty:"Moderate", type:["SOCIOL","SB"], prereqs:[] },


  // ===== Added for Exercise & Health Sciences (BS) major roadmap =====
  { code:"EHS 286", title:"Exercise & Health Sciences Elective", credits:3, difficulty:"Moderate", type:["EHS"], prereqs:[] },


  // ===== Added for French (BA) major roadmap =====
  { code:"FRENCH 302", title:"French (300-level, taught in French)", credits:3, difficulty:"Moderate", type:["FRENCH","WL"], prereqs:[] },

// --------------------------
    // IT COURSES (your updated list)
    // --------------------------
    { code:"IT 110",  title:"Information Technology Problem Solving", credits:3, difficulty:"Easy",     type:["IT"], prereqs:[] },
    { code:"IT 111L", title:"Managerial Statistics",                 credits:3, difficulty:"Moderate", type:["IT"], prereqs:["IT 110"] }, // simulated order
    { code:"IT 114L", title:"Introduction To Java",                  credits:3, difficulty:"Moderate", type:["IT","Programming"], prereqs:["IT 110"] }, // simulated
    { code:"IT 116",  title:"Introduction to Scripting",             credits:3, difficulty:"Moderate", type:["IT","Programming"], prereqs:["IT 110"] }, // simulated
    { code:"IT 117",  title:"Intermediate Scripting",                credits:3, difficulty:"Hard",     type:["IT","Programming"], prereqs:["IT 116"] }, // simulated
    { code:"IT 187SL",title:"Science Gateway Seminar I",             credits:1, difficulty:"Easy",     type:["IT","Seminar"], prereqs:[] },
    { code:"IT 188SL",title:"Science Gateway Seminar II",            credits:1, difficulty:"Easy",     type:["IT","Seminar"], prereqs:["IT 187SL"] }, // simulated
    { code:"IT 220",  title:"Computer Forensics I",                  credits:3, difficulty:"Moderate",     type:["IT","Forensics"], prereqs:["IT 244","IT 246"] }, // simulated
    { code:"IT 221",  title:"Computer Forensics II",                 credits:3, difficulty:"Moderate",     type:["IT","Forensics"], prereqs:["IT 220"] }, // simulated
    { code:"IT 230L", title:"Relational Databases",                  credits:3, difficulty:"Moderate", type:["IT","Database"], prereqs:["IT 110"] }, // simulated
    { code:"IT 240",  title:"Web Fluency",                           credits:3, difficulty:"Moderate", type:["IT","Web"], prereqs:["IT 110"] }, // simulated
    { code:"IT 244",  title:"Introduction to Linux/Unix",            credits:3, difficulty:"Moderate", type:["IT","Systems"], prereqs:["IT 110"] }, // simulated
    { code:"IT 246",  title:"Introduction to Networks",              credits:3, difficulty:"Moderate", type:["IT","Networks"], prereqs:["IT 110"] }, // simulated
    { code:"IT 285L", title:"Social Issues and Ethics in Computing", credits:3, difficulty:"Easy",     type:["IT","Ethics"], prereqs:[] },
    { code:"IT 341",  title:"Introduction to System Administration", credits:3, difficulty:"Hard",     type:["IT","Systems"], prereqs:["IT 244","IT 246"] }, // simulated
    { code:"IT 360",  title:"Enterprise Software",                   credits:3, difficulty:"Moderate", type:["IT"], prereqs:["IT 230L"] }, // simulated
    { code:"IT 370",  title:"Introduction to Analytics",             credits:3, difficulty:"Moderate", type:["IT","Analytics"], prereqs:["IT 230L"] }, // simulated
    { code:"IT 420",  title:"Network and Mobile Forensics",          credits:3, difficulty:"Hard",     type:["IT","Forensics"], prereqs:["IT 220"] }, // simulated
    { code:"IT 421",  title:"Digital Forensics/Malware Analysis",    credits:3, difficulty:"Hard",     type:["IT","Forensics"], prereqs:["IT 220"] }, // simulated
    { code:"IT 425L", title:"Project Management",                    credits:3, difficulty:"Moderate", type:["IT","Project"], prereqs:["IT 110"] }, // simulated
    { code:"IT 428L", title:"Information System Security",           credits:3, difficulty:"Hard",     type:["IT","Security"], prereqs:["IT 246","IT 244"] }, // simulated
    { code:"IT 442",  title:"Windows System Administration",         credits:3, difficulty:"Moderate", type:["IT","Systems"], prereqs:["IT 341"] }, // simulated
    { code:"IT 443",  title:"Network Security Administration I",     credits:3, difficulty:"Hard",     type:["IT","Security"], prereqs:["IT 246"] }, // simulated
    { code:"IT 444",  title:"Network Security Administration II",    credits:3, difficulty:"Hard",     type:["IT","Security"], prereqs:["IT 443"] }, // simulated
    { code:"IT 456",  title:"Information Storage and Management",    credits:3, difficulty:"Moderate", type:["IT"], prereqs:["IT 230L"] }, // simulated
    { code:"IT 460",  title:"Integration Methodologies and Tools",   credits:3, difficulty:"Moderate", type:["IT"], prereqs:["IT 360"] }, // simulated
    { code:"IT 461L", title:"Systems Analysis and Design",           credits:3, difficulty:"Moderate", type:["IT"], prereqs:["IT 230L"] }, // simulated
    { code:"IT 471",  title:"Data Warehousing for Business Intelligence", credits:3, difficulty:"Hard", type:["IT","Analytics"], prereqs:["IT 230L"] }, // simulated
    { code:"IT 472",  title:"Data Mining for Management Applications",    credits:3, difficulty:"Hard", type:["IT","Analytics"], prereqs:["IT 471"] }, // simulated
    { code:"IT 478",  title:"Independent Study",                     credits:3, difficulty:"Moderate", type:["IT"], prereqs:[] },
    { code:"IT 480",  title:"Special Topics",                        credits:3, difficulty:"Moderate", type:["IT"], prereqs:[] },
    { code:"IT 485",  title:"Information Technology Capstone",       credits:3, difficulty:"Hard",     type:["IT","Capstone"], prereqs:["IT 425L","IT 461L"] }, // simulated

    // --------------------------
    // CS COURSES (your provided list)
    // --------------------------
    { code:"HIST 371",  title:"An Introduction to Computer Concepts",   credits:3, difficulty:"Easy",     type:["CS"], prereqs:[] },
    { code:"CS 109",  title:"Computer Programming for Engineers",     credits:3, difficulty:"Moderate", type:["CS"], prereqs:[] },
    { code:"CS 110",  title:"Introduction to Computing",             credits:4, difficulty:"Moderate", type:["CS"], prereqs:[] },
    { code:"CS 114L", title:"Introduction To Java",                  credits:3, difficulty:"Moderate", type:["CS","Programming"], prereqs:[] },
    { code:"CS 119",  title:"Computer Language Supplement",          credits:2, difficulty:"Easy",     type:["CS"], prereqs:[] },
    { code:"CS 187SL",title:"Science Gateway Seminar I",             credits:1, difficulty:"Easy",     type:["CS","Seminar"], prereqs:[] },
    { code:"CS 188SL",title:"Science Gateway Seminar II",            credits:1, difficulty:"Easy",     type:["CS","Seminar"], prereqs:["CS 187SL"] },
    { code:"CS 210",  title:"Intermediate Computing with Data Structures", credits:4, difficulty:"Hard", type:["CS"], prereqs:["CS 110"] },
    { code:"CS 220",  title:"Applied Discrete Mathematics",          credits:3, difficulty:"Hard",     type:["CS","Math"], prereqs:["CS 110"] },
    { code:"CS 240",  title:"Programming in C",                      credits:3, difficulty:"Hard",     type:["CS","Programming"], prereqs:["CS 210"] },
    { code:"CS 271L", title:"Introduction to Cognitive Science",     credits:3, difficulty:"Moderate", type:["CS"], prereqs:[] },
    { code:"CS 285L", title:"Social Issues and Ethics in Computing", credits:3, difficulty:"Easy",     type:["CS","Ethics"], prereqs:[] },
    { code:"CS 310",  title:"Advanced Data Structures and Algorithms",credits:3, difficulty:"Hard",     type:["CS"], prereqs:["CS 210","CS 220"] },
    { code:"CS 341",  title:"Computer Architecture and Organization",credits:3, difficulty:"Hard",     type:["CS"], prereqs:["CS 240"] },
    { code:"CS 410",  title:"An Introduction to Software Engineering",credits:3, difficulty:"Moderate", type:["CS"], prereqs:["CS 310"] },
    { code:"CS 413",  title:"Applied Cryptography",                  credits:3, difficulty:"Hard",     type:["CS","Security"], prereqs:["CS 310"] },
    { code:"CS 415",  title:"User Interface Design",                 credits:3, difficulty:"Moderate", type:["CS"], prereqs:["CS 210"] },
    { code:"CS 420",  title:"An Introduction to the Theory of Computation", credits:3, difficulty:"Hard", type:["CS"], prereqs:["CS 220"] },
    { code:"CS 430",  title:"Database Management",                   credits:3, difficulty:"Moderate", type:["CS","Database"], prereqs:["CS 210"] },
    { code:"CS 435",  title:"Recommender Systems",                   credits:3, difficulty:"Hard",     type:["CS","AI"], prereqs:["CS 310"] },
    { code:"CS 436",  title:"Database Application Development",      credits:3, difficulty:"Moderate", type:["CS","Database"], prereqs:["CS 430"] },
    { code:"CS 437",  title:"Database-Backed Web Sites & Web Services", credits:3, difficulty:"Moderate", type:["CS","Web"], prereqs:["CS 430"] },
    { code:"CS 438",  title:"Applied Machine Learning",              credits:3, difficulty:"Hard",     type:["CS","AI"], prereqs:["CS 310"] },
    { code:"CS 442",  title:"Cybersecurity in the Internet of Things",credits:3, difficulty:"Hard",     type:["CS","Security"], prereqs:["CS 449"] },
    { code:"CS 443",  title:"Mobile Applications",                   credits:3, difficulty:"Moderate", type:["CS"], prereqs:["CS 210"] },
    { code:"CS 444",  title:"An Introduction to Operating Systems",  credits:3, difficulty:"Hard",     type:["CS","Systems"], prereqs:["CS 341","CS 310"] },
    { code:"CS 446",  title:"Introduction to Internetworking",       credits:3, difficulty:"Hard",     type:["CS","Networks"], prereqs:["CS 210"] },
    { code:"CS 449",  title:"Introduction to Computer Security",     credits:3, difficulty:"Hard",     type:["CS","Security"], prereqs:["CS 310"] },
    { code:"CS 450",  title:"The Structure of Higher Level Languages",credits:3, difficulty:"Moderate", type:["CS"], prereqs:["CS 310"] },
    { code:"CS 451",  title:"Compilers",                             credits:3, difficulty:"Hard",     type:["CS"], prereqs:["CS 450"] },
    { code:"CS 460",  title:"Graphics",                              credits:3, difficulty:"Moderate", type:["CS"], prereqs:["CS 210"] },
    { code:"CS 461",  title:"Computer Games Programming",            credits:3, difficulty:"Moderate", type:["CS"], prereqs:["CS 210"] },
    { code:"CS 470",  title:"An Introduction to Artificial Intelligence", credits:3, difficulty:"Hard", type:["CS","AI"], prereqs:["CS 310"] },
    { code:"CS 478",  title:"Independent Study",                     credits:1, difficulty:"Moderate", type:["CS"], prereqs:[] },
    { code:"CS 480",  title:"Special Topics",                        credits:3, difficulty:"Moderate", type:["CS"], prereqs:[] },
    { code:"CS 495",  title:"Practicum in Computer Science",          credits:1, difficulty:"Moderate", type:["CS"], prereqs:["CS 310"] },
    { code:"CS 498",  title:"Honors Thesis",                         credits:3, difficulty:"Hard",     type:["CS"], prereqs:["CS 310"] },

    
    // --------------------------
    
    // --------------------------

    // --------------------------
    // COLLEGE OF SCIENCE & MATHEMATICS COURSES (added)
    // --------------------------

    // BIOCHM COURSES
    { code:"BIOCHM 383", title:"Biochemistry I", credits:3, difficulty:"Hard", type:["BIOCHM"], prereqs:[] },
    { code:"BIOCHM 384", title:"Biochemistry II", credits:3, difficulty:"Hard", type:["BIOCHM"], prereqs:[] },
    { code:"BIOCHM 385", title:"Biochemistry Lab I", credits:3, difficulty:"Hard", type:["BIOCHM","Lab"], prereqs:[] },
    { code:"BIOCHM 386", title:"Biochemistry Lab II", credits:3, difficulty:"Hard", type:["BIOCHM","Lab"], prereqs:[] },
    { code:"BIOCHM 471", title:"Readings in Biochemistry I", credits:1, difficulty:"Hard", type:["BIOCHM","Independent"], prereqs:[] },
    { code:"BIOCHM 472", title:"Readings in Biochemistry II", credits:1, difficulty:"Hard", type:["BIOCHM","Independent"], prereqs:[] },
    { code:"BIOCHM 491", title:"Directed Research in Biochemistry I", credits:1, difficulty:"Hard", type:["BIOCHM"], prereqs:[] },
    { code:"BIOCHM 492", title:"Directed Research in Biochemistry II", credits:1, difficulty:"Hard", type:["BIOCHM"], prereqs:[] },

    // BIOL COURSES
    { code:"BIOL 101", title:"The Basis of Life", credits:3, difficulty:"Easy", type:["BIOL"], prereqs:[] },
    { code:"BIOL 102", title:"Evolutionary Biology", credits:3, difficulty:"Easy", type:["BIOL"], prereqs:[] },
    { code:"BIOL 108", title:"Introduction to Nutrition", credits:3, difficulty:"Easy", type:["BIOL"], prereqs:[] },
    { code:"BIOL 111", title:"General Biology I", credits:3, difficulty:"Easy", type:["BIOL"], prereqs:[] },
    { code:"BIOL 112", title:"General Biology II", credits:3, difficulty:"Easy", type:["BIOL"], prereqs:[] },
    { code:"BIOL 187S", title:"Gateway Seminar I", credits:1, difficulty:"Moderate", type:["BIOL","Seminar"], prereqs:[] },
    { code:"BIOL 188S", title:"Gateway Seminar II", credits:1, difficulty:"Moderate", type:["BIOL","Seminar"], prereqs:[] },
    { code:"BIOL 207", title:"Anatomy and Physiology I", credits:4, difficulty:"Moderate", type:["BIOL"], prereqs:[] },
    { code:"BIOL 208", title:"Anatomy and Physiology II", credits:4, difficulty:"Moderate", type:["BIOL"], prereqs:[] },
    { code:"BIOL 209", title:"Medical Microbiology", credits:4, difficulty:"Moderate", type:["BIOL"], prereqs:[] },
    { code:"BIOL 210", title:"Cell Biology", credits:4, difficulty:"Moderate", type:["BIOL"], prereqs:[] },
    { code:"BIOL 212", title:"Cell Biology (Lecture)", credits:3, difficulty:"Moderate", type:["BIOL"], prereqs:[] },
    { code:"BIOL 252", title:"Genetics", credits:4, difficulty:"Moderate", type:["BIOL"], prereqs:[] },
    { code:"BIOL 254", title:"Genetics (Lecture)", credits:3, difficulty:"Moderate", type:["BIOL"], prereqs:[] },
    { code:"BIOL 290", title:"Population Biology", credits:3, difficulty:"Moderate", type:["BIOL"], prereqs:[] },
    { code:"BIOL 304", title:"Microbiology (Lecture)", credits:3, difficulty:"Hard", type:["BIOL"], prereqs:[] },
    { code:"BIOL 306", title:"Marine & Coastal Ecological Research", credits:3, difficulty:"Hard", type:["BIOL"], prereqs:[] },
    { code:"BIOL 307", title:"Advanced Human Anatomy and Human Physiology I", credits:3, difficulty:"Hard", type:["BIOL"], prereqs:[] },
    { code:"BIOL 308", title:"Advanced Human Anatomy and Human Physiology II", credits:3, difficulty:"Hard", type:["BIOL"], prereqs:[] },
    { code:"BIOL 309", title:"Advanced Human Anatomy and Physiology I Lab", credits:1, difficulty:"Hard", type:["BIOL","Lab"], prereqs:[] },
    { code:"BIOL 310", title:"Advanced Human Anatomy and Physiology II Lab", credits:1, difficulty:"Hard", type:["BIOL","Lab"], prereqs:[] },
    { code:"BIOL 311", title:"Marine Biology & Ecology", credits:3, difficulty:"Hard", type:["BIOL"], prereqs:[] },
    { code:"BIOL 312", title:"Marine Biology & Ecology Lab", credits:1, difficulty:"Hard", type:["BIOL","Lab"], prereqs:[] },
    { code:"BIOL 313", title:"Developmental Biology and Embryology", credits:3, difficulty:"Hard", type:["BIOL"], prereqs:[] },
    { code:"BIOL 314", title:"Developmental Biol", credits:3, difficulty:"Hard", type:["BIOL"], prereqs:[] },
    { code:"BIOL 315", title:"Developmental Biology Lab", credits:1, difficulty:"Hard", type:["BIOL","Lab"], prereqs:[] },
    { code:"BIOL 316", title:"Neurobiology", credits:4, difficulty:"Hard", type:["BIOL"], prereqs:[] },
    { code:"BIOL 318", title:"Neurobiology (Lecture)", credits:3, difficulty:"Hard", type:["BIOL"], prereqs:[] },
    { code:"BIOL 319", title:"Endocrinology (Lecture)", credits:3, difficulty:"Hard", type:["BIOL"], prereqs:[] },
    { code:"BIOL 321", title:"Plant Physiology", credits:4, difficulty:"Hard", type:["BIOL"], prereqs:[] },
    { code:"BIOL 323", title:"Plant Physiology (Lecture)", credits:3, difficulty:"Hard", type:["BIOL"], prereqs:[] },
    { code:"BIOL 328", title:"Plant Life", credits:3, difficulty:"Hard", type:["BIOL"], prereqs:[] },
    { code:"BIOL 329", title:"Plant Life (Lecture)", credits:3, difficulty:"Hard", type:["BIOL"], prereqs:[] },
    { code:"BIOL 330", title:"Biology of Fishes", credits:3, difficulty:"Hard", type:["BIOL"], prereqs:[] },
    { code:"BIOL 332", title:"Biology of Marine Invertebrates Laboratory", credits:1, difficulty:"Hard", type:["BIOL","Lab"], prereqs:[] },
    { code:"BIOL 333", title:"Biology of Marine Invertebrates (Lecture)", credits:3, difficulty:"Hard", type:["BIOL"], prereqs:[] },
    { code:"BIOL 334", title:"Microbiology", credits:4, difficulty:"Hard", type:["BIOL"], prereqs:[] },
    { code:"BIOL 335", title:"Genomics: Microbes, Human Biome and Other Metagenomes", credits:3, difficulty:"Hard", type:["BIOL"], prereqs:[] },
    { code:"BIOL 336L", title:"Ecosystems Ecology", credits:1, difficulty:"Hard", type:["BIOL","Lab"], prereqs:[] },
    { code:"BIOL 337", title:"Comparative Animal Physiology", credits:4, difficulty:"Hard", type:["BIOL"], prereqs:[] },
    { code:"BIOL 338", title:"Insect Life", credits:3, difficulty:"Hard", type:["BIOL"], prereqs:[] },
    { code:"BIOL 339", title:"Comparative Animal Physiology (Lecture)", credits:3, difficulty:"Hard", type:["BIOL"], prereqs:[] },
    { code:"BIOL 340", title:"Marine Mammal Biology", credits:3, difficulty:"Hard", type:["BIOL"], prereqs:[] },
    { code:"BIOL 342", title:"Ecology", credits:3, difficulty:"Hard", type:["BIOL"], prereqs:[] },
    { code:"BIOL 343", title:"Ecology Laboratory", credits:2, difficulty:"Hard", type:["BIOL","Lab"], prereqs:[] },
    { code:"BIOL 344", title:"Ornithology", credits:3, difficulty:"Hard", type:["BIOL"], prereqs:[] },
    { code:"BIOL 345", title:"Ornithology Laboratory", credits:1, difficulty:"Hard", type:["BIOL","Lab"], prereqs:[] },
    { code:"BIOL 347", title:"Animal Behavior Laboratory", credits:1, difficulty:"Hard", type:["BIOL","Lab"], prereqs:[] },
    { code:"BIOL 348", title:"Animal Behavior", credits:3, difficulty:"Hard", type:["BIOL"], prereqs:[] },
    { code:"BIOL 352", title:"Evolution", credits:3, difficulty:"Hard", type:["BIOL"], prereqs:[] },
    { code:"BIOL 353", title:"Evolution Laboratory", credits:2, difficulty:"Hard", type:["BIOL","Lab"], prereqs:[] },
    { code:"BIOL 354", title:"The Ecology and Evolution of Infectious Diseases", credits:3, difficulty:"Hard", type:["BIOL"], prereqs:[] },
    { code:"BIOL 355", title:"Introduction to Data Science in Biology", credits:3, difficulty:"Hard", type:["BIOL"], prereqs:[] },
    { code:"BIOL 356", title:"Introduction to Data Science for Biology Lab", credits:1, difficulty:"Hard", type:["BIOL","Lab"], prereqs:[] },
    { code:"BIOL 357", title:"Comparative and Ecological Immunology", credits:3, difficulty:"Hard", type:["BIOL"], prereqs:[] },
    { code:"BIOL 358", title:"Microbiome and Disease Ecology Research Lab", credits:1, difficulty:"Hard", type:["BIOL","Lab"], prereqs:[] },
    { code:"BIOL 360", title:"Bioinformatics", credits:3, difficulty:"Hard", type:["BIOL"], prereqs:[] },
    { code:"BIOL 361", title:"Bioinformatics Laboratory", credits:1, difficulty:"Hard", type:["BIOL","Lab"], prereqs:[] },
    { code:"BIOL 362", title:"Simulating Life", credits:4, difficulty:"Hard", type:["BIOL"], prereqs:[] },
    { code:"BIOL 363", title:"Conservation Biology", credits:3, difficulty:"Hard", type:["BIOL"], prereqs:[] },
    { code:"BIOL 364", title:"Conservation Biology Lab", credits:1, difficulty:"Hard", type:["BIOL","Lab"], prereqs:[] },
    { code:"BIOL 365", title:"Microbial Genomics Laboratory", credits:1, difficulty:"Hard", type:["BIOL","Lab"], prereqs:[] },
    { code:"BIOL 366", title:"Stem Cells and Regeneration", credits:3, difficulty:"Hard", type:["BIOL"], prereqs:[] },
    { code:"BIOL 370", title:"Molecular Biology", credits:4, difficulty:"Hard", type:["BIOL"], prereqs:[] },
    { code:"BIOL 372", title:"Molecular Biology (Lecture)", credits:3, difficulty:"Hard", type:["BIOL"], prereqs:[] },
    { code:"BIOL 376", title:"Virology", credits:3, difficulty:"Hard", type:["BIOL"], prereqs:[] },
    { code:"BIOL 377", title:"Cancer Biology", credits:3, difficulty:"Hard", type:["BIOL"], prereqs:[] },
    { code:"BIOL 378", title:"Introduction to Immunology", credits:4, difficulty:"Hard", type:["BIOL"], prereqs:[] },
    { code:"BIOL 380", title:"Introduction to Immunology (Lecture)", credits:3, difficulty:"Hard", type:["BIOL"], prereqs:[] },
    { code:"BIOL 381", title:"Special Topics", credits:3, difficulty:"Hard", type:["BIOL","Topics"], prereqs:[] },
    { code:"BIOL 382", title:"Special Topics Laboratory", credits:1, difficulty:"Hard", type:["BIOL","Lab","Topics"], prereqs:[] },
    { code:"BIOL 390", title:"Survey of Human Physiology", credits:3, difficulty:"Hard", type:["BIOL"], prereqs:[] },
    { code:"BIOL 395", title:"Biotechnology", credits:3, difficulty:"Hard", type:["BIOL"], prereqs:[] },
    { code:"BIOL 444", title:"Cooperative Education", credits:3, difficulty:"Hard", type:["BIOL","Co-op"], prereqs:[] },
    { code:"BIOL 478", title:"Independent Study", credits:1, difficulty:"Hard", type:["BIOL","Independent"], prereqs:[] },
    { code:"BIOL 479", title:"Independent Study II", credits:1, difficulty:"Hard", type:["BIOL","Independent"], prereqs:[] },

    // CHEM COURSES
    { code:"CHEM 105", title:"Supplemental Chemistry", credits:1, difficulty:"Easy", type:["CHEM"], prereqs:[] },
    { code:"CHEM 111L", title:"Environmental Concerns and Chemical Solutions", credits:3, difficulty:"Easy", type:["CHEM","Lab"], prereqs:[] },
    { code:"CHEM 115", title:"Chemical Principles I Lecture", credits:3, difficulty:"Easy", type:["CHEM"], prereqs:[] },
    { code:"CHEM 116", title:"Chemical Principles II Lecture", credits:3, difficulty:"Easy", type:["CHEM"], prereqs:[] },
    { code:"CHEM 117", title:"Chemical Principles I Laboratory", credits:3, difficulty:"Easy", type:["CHEM","Lab"], prereqs:[] },
    { code:"CHEM 118", title:"Chemical Principles II Laboratory", credits:3, difficulty:"Easy", type:["CHEM","Lab"], prereqs:[] },
    { code:"CHEM 130", title:"Physiological Chemistry", credits:4, difficulty:"Moderate", type:["CHEM"], prereqs:[] },
    { code:"CHEM 187S", title:"Science Gateway Seminar I", credits:1, difficulty:"Moderate", type:["CHEM","Seminar"], prereqs:[] },
    { code:"CHEM 188S", title:"Science Gateway Seminar II", credits:1, difficulty:"Moderate", type:["CHEM","Seminar"], prereqs:[] },
    { code:"CHEM 251", title:"Organic Chemistry I Lecture", credits:3, difficulty:"Moderate", type:["CHEM"], prereqs:[] },
    { code:"CHEM 252", title:"Organic Chemistry II Lecture", credits:3, difficulty:"Moderate", type:["CHEM"], prereqs:[] },
    { code:"CHEM 255", title:"Organic Chemistry I Laboratory", credits:3, difficulty:"Moderate", type:["CHEM","Lab"], prereqs:[] },
    { code:"CHEM 256", title:"Organic Chemistry II Laboratory", credits:3, difficulty:"Moderate", type:["CHEM","Lab"], prereqs:[] },
    { code:"CHEM 311", title:"Analytical Chemistry", credits:4, difficulty:"Hard", type:["CHEM"], prereqs:[] },
    { code:"CHEM 312", title:"Physical Chemistry", credits:4, difficulty:"Hard", type:["CHEM"], prereqs:[] },
    { code:"CHEM 313", title:"Analytical Chemistry Laboratory", credits:2, difficulty:"Hard", type:["CHEM","Lab"], prereqs:[] },
    { code:"CHEM 314", title:"Physical Chemistry Laboratory", credits:2, difficulty:"Hard", type:["CHEM","Lab"], prereqs:[] },
    { code:"CHEM 351", title:"Organic Qualitative Analysis", credits:3, difficulty:"Hard", type:["CHEM"], prereqs:[] },
    { code:"CHEM 354", title:"Biochemistry", credits:3, difficulty:"Hard", type:["CHEM"], prereqs:[] },
    { code:"CHEM 361", title:"Analytical Instrumentation", credits:4, difficulty:"Hard", type:["CHEM"], prereqs:[] },
    { code:"CHEM 369", title:"Chemical Structure", credits:4, difficulty:"Hard", type:["CHEM"], prereqs:[] },
    { code:"CHEM 370", title:"Inorganic Chemistry", credits:4, difficulty:"Hard", type:["CHEM"], prereqs:[] },
    { code:"CHEM 371", title:"Inorganic Chemistry Laboratory", credits:2, difficulty:"Hard", type:["CHEM","Lab"], prereqs:[] },
    { code:"CHEM 379", title:"Chemical Structure Lab", credits:2, difficulty:"Hard", type:["CHEM","Lab"], prereqs:[] },
    { code:"CHEM 397", title:"Special Topics in Chemistry", credits:3, difficulty:"Hard", type:["CHEM","Topics"], prereqs:[] },
    { code:"CHEM 408", title:"Data Analysis in chemistry", credits:3, difficulty:"Hard", type:["CHEM"], prereqs:[] },
    { code:"CHEM 431", title:"Chemical Toxicology", credits:3, difficulty:"Hard", type:["CHEM"], prereqs:[] },
    { code:"CHEM 444", title:"Cooperative Education Field Experience in Chemistry", credits:3, difficulty:"Hard", type:["CHEM","Co-op"], prereqs:[] },
    { code:"CHEM 458", title:"Medicinal Chemistry", credits:3, difficulty:"Hard", type:["CHEM"], prereqs:[] },
    { code:"CHEM 471", title:"Introduction to Green Chemistry", credits:3, difficulty:"Hard", type:["CHEM"], prereqs:[] },
    { code:"CHEM 478", title:"Readings in Chemistry", credits:1, difficulty:"Hard", type:["CHEM","Independent"], prereqs:[] },
    { code:"CHEM 479", title:"Readings in Chemistry", credits:1, difficulty:"Hard", type:["CHEM","Independent"], prereqs:[] },
    { code:"CHEM 481", title:"Advanced Laboratory in Chemistry I", credits:1, difficulty:"Hard", type:["CHEM","Lab"], prereqs:[] },
    { code:"CHEM 482", title:"Advanced Laboratory in Chemistry II", credits:1, difficulty:"Hard", type:["CHEM","Lab"], prereqs:[] },
    { code:"CHEM 498", title:"Senior Thesis I", credits:2, difficulty:"Hard", type:["CHEM","Thesis"], prereqs:[] },
    { code:"CHEM 499", title:"Senior Thesis II", credits:2, difficulty:"Hard", type:["CHEM","Thesis"], prereqs:[] },

    // ENGIN COURSES
    { code:"ENGIN 103", title:"Introduction to Engineering", credits:3, difficulty:"Easy", type:["ENGIN"], prereqs:[] },
    { code:"ENGIN 104", title:"Introduction to Electrical and Computer Engineering", credits:3, difficulty:"Easy", type:["ENGIN"], prereqs:[] },
    { code:"ENGIN 211L", title:"Engineering Mathematics", credits:1, difficulty:"Moderate", type:["ENGIN","Lab"], prereqs:[] },
    { code:"ENGIN 231", title:"Circuit Analysis I", credits:3, difficulty:"Moderate", type:["ENGIN"], prereqs:[] },
    { code:"ENGIN 232", title:"Circuit Analysis II", credits:3, difficulty:"Moderate", type:["ENGIN"], prereqs:[] },
    { code:"ENGIN 241", title:"Digital Systems with Lab", credits:4, difficulty:"Moderate", type:["ENGIN","Lab"], prereqs:[] },
    { code:"ENGIN 246", title:"Computer Organization and Assembly Language", credits:3, difficulty:"Moderate", type:["ENGIN"], prereqs:[] },
    { code:"ENGIN 271", title:"Circuit Lab I", credits:1, difficulty:"Moderate", type:["ENGIN","Lab"], prereqs:[] },
    { code:"ENGIN 272", title:"Circuit Lab II", credits:1, difficulty:"Moderate", type:["ENGIN","Lab"], prereqs:[] },
    { code:"ENGIN 304", title:"Engineering Design", credits:3, difficulty:"Hard", type:["ENGIN"], prereqs:[] },
    { code:"ENGIN 321", title:"Signals and Systems", credits:3, difficulty:"Hard", type:["ENGIN"], prereqs:[] },
    { code:"ENGIN 322", title:"Probability and Random Processes", credits:3, difficulty:"Hard", type:["ENGIN"], prereqs:[] },
    { code:"ENGIN 331", title:"Fields and Waves", credits:3, difficulty:"Hard", type:["ENGIN"], prereqs:[] },
    { code:"ENGIN 341", title:"Advanced Digital Design", credits:3, difficulty:"Hard", type:["ENGIN"], prereqs:[] },
    { code:"ENGIN 342", title:"Computer Communications and Security", credits:3, difficulty:"Hard", type:["ENGIN"], prereqs:[] },
    { code:"ENGIN 344", title:"Introduction to Cyber-Physical Energy Systems", credits:3, difficulty:"Hard", type:["ENGIN"], prereqs:[] },
    { code:"ENGIN 346", title:"Embedded Systems", credits:3, difficulty:"Hard", type:["ENGIN"], prereqs:[] },
    { code:"ENGIN 351", title:"Fundamentals of Semiconductor Devices", credits:3, difficulty:"Hard", type:["ENGIN"], prereqs:[] },
    { code:"ENGIN 353", title:"Introduction to Computational Modeling for Renewable Energy", credits:3, difficulty:"Hard", type:["ENGIN"], prereqs:[] },
    { code:"ENGIN 365", title:"Electronics I with Lab", credits:4, difficulty:"Hard", type:["ENGIN","Lab"], prereqs:[] },
    { code:"ENGIN 366", title:"Electronics II with Lab", credits:4, difficulty:"Hard", type:["ENGIN","Lab"], prereqs:[] },
    { code:"ENGIN 435", title:"Antenna Design", credits:3, difficulty:"Hard", type:["ENGIN"], prereqs:[] },
    { code:"ENGIN 442", title:"Internet of Things", credits:3, difficulty:"Hard", type:["ENGIN"], prereqs:[] },
    { code:"ENGIN 444", title:"Cyber-Physical Systems Security", credits:3, difficulty:"Hard", type:["ENGIN"], prereqs:[] },
    { code:"ENGIN 448", title:"Operating Systems", credits:3, difficulty:"Hard", type:["ENGIN"], prereqs:[] },
    { code:"ENGIN 451", title:"Semiconductor Device Design, Simulation and Fabrication", credits:3, difficulty:"Hard", type:["ENGIN"], prereqs:[] },
    { code:"ENGIN 471", title:"RF/Microwave Circuits", credits:3, difficulty:"Hard", type:["ENGIN"], prereqs:[] },
    { code:"ENGIN 478", title:"Independent Study", credits:1, difficulty:"Hard", type:["ENGIN","Independent"], prereqs:[] },
    { code:"ENGIN 480", title:"Special Topics", credits:3, difficulty:"Hard", type:["ENGIN","Topics"], prereqs:[] },
    { code:"ENGIN 491", title:"Senior Design Project I", credits:3, difficulty:"Hard", type:["ENGIN"], prereqs:[] },
    { code:"ENGIN 492", title:"Senior Design Project II", credits:3, difficulty:"Hard", type:["ENGIN"], prereqs:[] },

    // MATH COURSES
    { code:"MATH 114QR", title:"Quantitative Reasoning", credits:3, difficulty:"Easy", type:["MATH"], prereqs:[] },
    { code:"MATH 115", title:"College Algebra", credits:3, difficulty:"Easy", type:["MATH"], prereqs:[] },
    { code:"MATH 115R", title:"College Algb-Reduced", credits:3, difficulty:"Easy", type:["MATH"], prereqs:[] },
    { code:"MATH 125", title:"Introductory Statistics", credits:3, difficulty:"Moderate", type:["MATH"], prereqs:[] },
    { code:"MATH 129", title:"Pre-Calculus for Management and Social Science Students", credits:3, difficulty:"Moderate", type:["MATH"], prereqs:[] },
    { code:"MATH 130", title:"Precalculus", credits:3, difficulty:"Moderate", type:["MATH"], prereqs:[] },
    { code:"MATH 130R", title:"Precalc-Reduced Crdt", credits:2, difficulty:"Moderate", type:["MATH"], prereqs:[] },
    { code:"MATH 134", title:"Managerial Calculus", credits:3, difficulty:"Moderate", type:["MATH"], prereqs:[] },
    { code:"MATH 135", title:"Survey of Calculus", credits:3, difficulty:"Moderate", type:["MATH"], prereqs:[] },
    { code:"MATH 135R", title:"Survey of Calculus - Reduced Credit", credits:1, difficulty:"Moderate", type:["MATH"], prereqs:[] },
    { code:"MATH 140", title:"Calculus I", credits:4, difficulty:"Moderate", type:["MATH"], prereqs:[] },
    { code:"MATH 140R", title:"Calculus I - Reduced Credit", credits:2, difficulty:"Moderate", type:["MATH"], prereqs:[] },
    { code:"MATH 141", title:"Calculus II", credits:4, difficulty:"Moderate", type:["MATH"], prereqs:[] },
    { code:"MATH 141R", title:"Calculus II - Reduced Credit", credits:2, difficulty:"Moderate", type:["MATH"], prereqs:[] },
    { code:"MATH 145", title:"Calculus I for Life & Environmental Sciences", credits:3, difficulty:"Moderate", type:["MATH"], prereqs:[] },
    { code:"MATH 145R", title:"Calculus I for Life and Environmental Sciences - Reduced Credits", credits:3, difficulty:"Moderate", type:["MATH"], prereqs:[] },
    { code:"MATH 211L", title:"Engineering Mathematics", credits:1, difficulty:"Moderate", type:["MATH","Lab"], prereqs:[] },
    { code:"MATH 240", title:"Multivariable Calculus", credits:3, difficulty:"Moderate", type:["MATH"], prereqs:[] },
    { code:"MATH 242", title:"Multivariable and Vector Calculus", credits:4, difficulty:"Moderate", type:["MATH"], prereqs:[] },
    { code:"MATH 242R", title:"Multivariable and Vector Calculus - Reduced Credit", credits:1, difficulty:"Moderate", type:["MATH"], prereqs:[] },
    { code:"MATH 260", title:"Linear Algebra", credits:3, difficulty:"Moderate", type:["MATH"], prereqs:[] },
    { code:"MATH 265", title:"Discrete Structures in Mathematics", credits:3, difficulty:"Moderate", type:["MATH"], prereqs:[] },
    { code:"MATH 270", title:"Applied Ordinary Differential Equations", credits:3, difficulty:"Moderate", type:["MATH"], prereqs:[] },
    { code:"MATH 291", title:"Mathematical Software. An introduction to computer assisted math modeling and problem solving", credits:3, difficulty:"Moderate", type:["MATH"], prereqs:[] },
    { code:"MATH 309", title:"Financial Mathematics", credits:3, difficulty:"Hard", type:["MATH"], prereqs:[] },
    { code:"MATH 314", title:"Introduction to Proofs: a Transition to Advanced Mathematics", credits:3, difficulty:"Hard", type:["MATH"], prereqs:[] },
    { code:"MATH 345", title:"Probability and Statistics", credits:3, difficulty:"Hard", type:["MATH"], prereqs:[] },
    { code:"MATH 350", title:"Applied Partial Differential Equations", credits:3, difficulty:"Hard", type:["MATH"], prereqs:[] },
    { code:"MATH 358", title:"An Introduction to Complex Analysis", credits:3, difficulty:"Hard", type:["MATH"], prereqs:[] },
    { code:"MATH 360", title:"Abstract Algebra", credits:3, difficulty:"Hard", type:["MATH"], prereqs:[] },
    { code:"MATH 361", title:"Abstract Algebra II", credits:3, difficulty:"Hard", type:["MATH"], prereqs:[] },
    { code:"MATH 370", title:"History of Mathematics", credits:3, difficulty:"Hard", type:["MATH"], prereqs:[] },
    { code:"MATH 380", title:"Introduction to Computational Algebraic Geometry", credits:3, difficulty:"Hard", type:["MATH"], prereqs:[] },
    { code:"MATH 390", title:"Mathematical Problem Solving Seminar", credits:1, difficulty:"Hard", type:["MATH","Seminar"], prereqs:[] },
    { code:"MATH 420", title:"Mathematics Capstone", credits:3, difficulty:"Hard", type:["MATH","Capstone"], prereqs:[] },
    { code:"MATH 425", title:"Numerical Analysis", credits:3, difficulty:"Hard", type:["MATH"], prereqs:[] },
    { code:"MATH 426", title:"Numerical Linear Algebra", credits:3, difficulty:"Hard", type:["MATH"], prereqs:[] },
    { code:"MATH 440", title:"General Topology", credits:3, difficulty:"Hard", type:["MATH"], prereqs:[] },
    { code:"MATH 447", title:"Probability Models", credits:3, difficulty:"Hard", type:["MATH"], prereqs:[] },
    { code:"MATH 448", title:"Computational Statistics", credits:3, difficulty:"Hard", type:["MATH"], prereqs:[] },
    { code:"MATH 450", title:"An Introduction to Real Analysis", credits:3, difficulty:"Hard", type:["MATH"], prereqs:[] },
    { code:"MATH 455", title:"An Introduction to Statistical Machine Learning", credits:3, difficulty:"Hard", type:["MATH"], prereqs:[] },
    { code:"MATH 458", title:"Theory of Numbers", credits:3, difficulty:"Hard", type:["MATH"], prereqs:[] },
    { code:"MATH 460", title:"Survey of Geometry", credits:3, difficulty:"Hard", type:["MATH"], prereqs:[] },
    { code:"MATH 470", title:"Mathematical Logic", credits:3, difficulty:"Hard", type:["MATH"], prereqs:[] },
    { code:"MATH 478", title:"Independent Study", credits:1, difficulty:"Hard", type:["MATH","Independent"], prereqs:[] },
    { code:"MATH 480", title:"Special Topics", credits:3, difficulty:"Hard", type:["MATH","Topics"], prereqs:[] },
    { code:"MATH 490", title:"Thesis Research", credits:1, difficulty:"Hard", type:["MATH","Thesis"], prereqs:[] },

    // PHYSIC COURSES
    { code:"PHYSIC 101", title:"Introduction to Physics", credits:1, difficulty:"Easy", type:["PHYSIC"], prereqs:[] },
    { code:"PHYSIC 107", title:"College Physics I", credits:3, difficulty:"Easy", type:["PHYSIC"], prereqs:[] },
    { code:"PHYSIC 108", title:"College Physics II", credits:3, difficulty:"Easy", type:["PHYSIC"], prereqs:[] },
    { code:"PHYSIC 113", title:"Fundamentals of Physics I", credits:4, difficulty:"Easy", type:["PHYSIC"], prereqs:[] },
    { code:"PHYSIC 114", title:"Fundamentals of Physics II", credits:4, difficulty:"Easy", type:["PHYSIC"], prereqs:[] },
    { code:"PHYSIC 121", title:"Introduction to Astronomy", credits:3, difficulty:"Moderate", type:["PHYSIC"], prereqs:[] },
    { code:"PHYSIC 126", title:"Solar System Astronomy", credits:3, difficulty:"Moderate", type:["PHYSIC"], prereqs:[] },
    { code:"PHYSIC 134", title:"Energy for the Future", credits:3, difficulty:"Moderate", type:["PHYSIC"], prereqs:[] },
    { code:"PHYSIC 171", title:"Introductory Physics Lab for Life Sciences I", credits:1, difficulty:"Moderate", type:["PHYSIC","Lab"], prereqs:[] },
    { code:"PHYSIC 172", title:"Introductory Physics Lab II for Life Sciences", credits:1, difficulty:"Moderate", type:["PHYSIC","Lab"], prereqs:[] },
    { code:"PHYSIC 181", title:"Physics Laboratory I", credits:3, difficulty:"Moderate", type:["PHYSIC","Lab"], prereqs:[] },
    { code:"PHYSIC 182", title:"Physics Laboratory II", credits:3, difficulty:"Moderate", type:["PHYSIC","Lab"], prereqs:[] },
    { code:"PHYSIC 197", title:"Special Topics in Physics", credits:1, difficulty:"Moderate", type:["PHYSIC","Topics"], prereqs:[] },
    { code:"PHYSIC 198", title:"Special Topics Laboratory", credits:1, difficulty:"Moderate", type:["PHYSIC","Lab","Topics"], prereqs:[] },
    { code:"PHYSIC 211", title:"Introduction to Contemporary Physics", credits:3, difficulty:"Moderate", type:["PHYSIC"], prereqs:[] },
    { code:"PHYSIC 214", title:"Thermodynamics", credits:3, difficulty:"Moderate", type:["PHYSIC"], prereqs:[] },
    { code:"PHYSIC 247", title:"Quantum Information I: Fundamentals of Quantum Physics", credits:3, difficulty:"Moderate", type:["PHYSIC"], prereqs:[] },
    { code:"PHYSIC 281", title:"Physical Laboratory I", credits:3, difficulty:"Moderate", type:["PHYSIC","Lab"], prereqs:[] },
    { code:"PHYSIC 297", title:"Special Topics in Physics", credits:3, difficulty:"Moderate", type:["PHYSIC","Topics"], prereqs:[] },
    { code:"PHYSIC 298", title:"Special Topics Laboratory", credits:1, difficulty:"Moderate", type:["PHYSIC","Lab","Topics"], prereqs:[] },
    { code:"PHYSIC 312", title:"Mechanics", credits:3, difficulty:"Hard", type:["PHYSIC"], prereqs:[] },
    { code:"PHYSIC 321", title:"Theory of Electricity and Magnetism I", credits:3, difficulty:"Hard", type:["PHYSIC"], prereqs:[] },
    { code:"PHYSIC 322", title:"Theory of Electricity and Magnetism II", credits:3, difficulty:"Hard", type:["PHYSIC"], prereqs:[] },
    { code:"PHYSIC 331", title:"Optics", credits:3, difficulty:"Hard", type:["PHYSIC"], prereqs:[] },
    { code:"PHYSIC 347", title:"Quantum Information II: Quantum Computation", credits:3, difficulty:"Hard", type:["PHYSIC"], prereqs:[] },
    { code:"PHYSIC 350", title:"Statistical Physics", credits:3, difficulty:"Hard", type:["PHYSIC"], prereqs:[] },
    { code:"PHYSIC 351", title:"Quantum Information III: Physics and Information", credits:3, difficulty:"Hard", type:["PHYSIC"], prereqs:[] },
    { code:"PHYSIC 362", title:"Computational Science", credits:4, difficulty:"Hard", type:["PHYSIC"], prereqs:[] },
    { code:"PHYSIC 382", title:"Intermediate Laboratory", credits:3, difficulty:"Hard", type:["PHYSIC","Lab"], prereqs:[] },
    { code:"PHYSIC 397", title:"Special Topics in Physics", credits:1, difficulty:"Hard", type:["PHYSIC","Topics"], prereqs:[] },
    { code:"PHYSIC 398", title:"Special Topics Laboratory", credits:1, difficulty:"Hard", type:["PHYSIC","Lab","Topics"], prereqs:[] },
    { code:"PHYSIC 421", title:"Atomic Physics and Introduction to Quantum Mechanics", credits:3, difficulty:"Hard", type:["PHYSIC"], prereqs:[] },
    { code:"PHYSIC 447", title:"Quantum Information IV: Quantum Science Applications", credits:3, difficulty:"Hard", type:["PHYSIC"], prereqs:[] },
    { code:"PHYSIC 479", title:"Readings in Physics I", credits:1, difficulty:"Hard", type:["PHYSIC","Independent"], prereqs:[] },
    { code:"PHYSIC 480", title:"Readings in Physics II", credits:1, difficulty:"Hard", type:["PHYSIC","Independent"], prereqs:[] },
    { code:"PHYSIC 482", title:"Adv Projects Lab", credits:4, difficulty:"Hard", type:["PHYSIC","Lab"], prereqs:[] },
    { code:"PHYSIC 487", title:"Research in Physics I", credits:1, difficulty:"Hard", type:["PHYSIC"], prereqs:[] },
    { code:"PHYSIC 488", title:"Research Physics II", credits:1, difficulty:"Hard", type:["PHYSIC"], prereqs:[] },
    { code:"PHYSIC 497", title:"Special Topics in Physics", credits:1, difficulty:"Hard", type:["PHYSIC","Topics"], prereqs:[] },
    { code:"PHYSIC 498", title:"Special Topics Laboratory", credits:1, difficulty:"Hard", type:["PHYSIC","Lab","Topics"], prereqs:[] },
    // MSIS COURSES
    // --------------------------
    { code:"MSIS 110", title:"Introduction to Computers and Information Systems", credits:3, difficulty:"Moderate", type:["MSIS"], prereqs:[] },
    { code:"MSIS 111L", title:"Managerial Statistics", credits:3, difficulty:"Moderate", type:["MSIS","Statistics"], prereqs:["MSIS 110"] }, // simulated
    { code:"MSIS 212", title:"Managerial Decision Making", credits:3, difficulty:"Moderate", type:["MSIS"], prereqs:["MSIS 110"] }, // simulated
    { code:"MSIS 230L", title:"Relational Databases", credits:3, difficulty:"Moderate", type:["MSIS","Database"], prereqs:["MSIS 110"] }, // simulated
    { code:"MSIS 301", title:"Operations Management", credits:3, difficulty:"Moderate", type:["MSIS","Operations"], prereqs:["MSIS 110"] }, // simulated
    { code:"MSIS 310", title:"Introduction to Coding for Business", credits:3, difficulty:"Moderate", type:["MSIS","Programming"], prereqs:["MSIS 110"] }, // simulated
    { code:"MSIS 411", title:"Advanced Database Systems", credits:3, difficulty:"Hard", type:["MSIS","Database"], prereqs:["MSIS 230L"] }, // simulated
    { code:"MSIS 415", title:"Advanced Coding for Analytics", credits:3, difficulty:"Hard", type:["MSIS","Analytics"], prereqs:["MSIS 310"] }, // simulated
    { code:"MSIS 425L", title:"Project Management", credits:3, difficulty:"Moderate", type:["MSIS","Project"], prereqs:["MSIS 110"] }, // simulated
    { code:"MSIS 428L", title:"Information System Security", credits:3, difficulty:"Hard", type:["MSIS","Security"], prereqs:["MSIS 110"] }, // simulated
    { code:"MSIS 454L", title:"Supply Chain Management", credits:3, difficulty:"Moderate", type:["MSIS","Supply Chain"], prereqs:["MSIS 301"] }, // simulated
    { code:"MSIS 461L", title:"Systems Analysis and Design", credits:3, difficulty:"Moderate", type:["MSIS"], prereqs:["MSIS 230L"] }, // simulated
    { code:"MSIS 478", title:"Special Topics in Management Science and Information Systems", credits:3, difficulty:"Moderate", type:["MSIS"], prereqs:[] }, // simulated
    { code:"MSIS 480", title:"Management Science and Information Systems Internship", credits:3, difficulty:"Moderate", type:["MSIS","Internship"], prereqs:[] },
    { code:"MSIS 488", title:"Independent Study", credits:3, difficulty:"Moderate", type:["MSIS"], prereqs:[] },
    { code:"MSIS 498", title:"College of Management Honors Research Seminar", credits:3, difficulty:"Moderate", type:["MSIS","Honors"], prereqs:[] },
    { code:"MSIS 499", title:"College of Management Honors Thesis Seminar", credits:3, difficulty:"Hard", type:["MSIS","Honors"], prereqs:["MSIS 498"] }, // simulated

    // --------------------------
    // SCSM COURSES
    // --------------------------
    { code:"SCSM 350", title:"Strategic Operations", credits:3, difficulty:"Moderate", type:["SCSM","Operations"], prereqs:["MSIS 301"] }, // simulated
    { code:"SCSM 450", title:"Service Operations Management", credits:3, difficulty:"Hard", type:["SCSM","Operations"], prereqs:["SCSM 350"] }, // simulated
    { code:"SCSM 451", title:"Operational Risk Management", credits:3, difficulty:"Hard", type:["SCSM","Risk"], prereqs:["SCSM 350"] }, // simulated
    { code:"SCSM 454L", title:"Supply Chain Management", credits:3, difficulty:"Moderate", type:["SCSM","Supply Chain"], prereqs:["SCSM 350"] }, // simulated
    { code:"SCSM 495", title:"Lean Operations and Process Improvement", credits:3, difficulty:"Hard", type:["SCSM","Process"], prereqs:["SCSM 350"] }, // simulated
    { code:"SCSM 498", title:"College of Management Honors Research Seminar", credits:3, difficulty:"Moderate", type:["SCSM","Honors"], prereqs:[] },
    { code:"SCSM 499", title:"College of Management Honors Thesis Seminar", credits:3, difficulty:"Hard", type:["SCSM","Honors"], prereqs:["SCSM 498"] }, // simulated

    // --------------------------
    // BC COURSES
    // --------------------------
    { code:"BC 230", title:"Fundamentals of Business Communication & Critical Analysis", credits:3, difficulty:"Moderate", type:["BC","Writing"], prereqs:["ENGL 101"] }, // simulated
    { code:"BC 290", title:"Professional Written Communication & Critical Analysis", credits:3, difficulty:"Moderate", type:["BC","Writing"], prereqs:["ENGL 102"] }, // simulated
    { code:"BC 295", title:"Communication, Negotiation, & Conflict Interactions", credits:3, difficulty:"Moderate", type:["BC"], prereqs:["BC 230"] }, // simulated
    { code:"BC 298", title:"Presentation Skills for Business", credits:3, difficulty:"Moderate", type:["BC"], prereqs:["BC 230"] }, // simulated

    // --------------------------
    // BUSADM COURSES (First-Year Seminar)
    // --------------------------
    { code:"BUSADM 101", title:"College of Management Transition and Success Seminar", credits:1, difficulty:"Easy", type:["BUSADM","Seminar"], prereqs:[] },
    { code:"BUSADM 120G", title:"Beacon to Business: Opportunities and Challenges", credits:4, difficulty:"Easy", type:["BUSADM","Seminar"], prereqs:[] },

    // --------------------------
    // CAPS / NAV / PRFTRN COURSES (added)
    // --------------------------
    { code:"CAPS 112",  title:"University Success Course", credits:1, difficulty:"Easy",     type:["CAPS"], prereqs:[] },
    { code:"CAPS 118",  title:"Special Topics",           credits:3, difficulty:"Moderate", type:["CAPS","Topics"], prereqs:[] },
    { code:"CAPS 131",  title:"Business of Sports",       credits:3, difficulty:"Moderate", type:["CAPS"], prereqs:[] },
    { code:"CAPS 178",  title:"Independent Study",        credits:3, difficulty:"Moderate", type:["CAPS","Independent"], prereqs:[] },
    { code:"CAPS 218",  title:"Special Topics (200-level)", credits:3, difficulty:"Moderate", type:["CAPS","Topics"], prereqs:[] },
    { code:"CAPS 318",  title:"Special Topics (300-level)", credits:3, difficulty:"Hard",    type:["CAPS","Topics"], prereqs:["CAPS 112"] }, // simulated progression
    { code:"NAV 101",   title:"Navitas Study Skills",     credits:1, difficulty:"Easy",     type:["NAV"], prereqs:[] },
    { code:"PRFTRN 163",title:"Careers in Offshore Wind (Module 3)", credits:1, difficulty:"Easy", type:["PRFTRN"], prereqs:[] },


    // --------------------------
    // COLLEGE OF NURSING & HEALTH SCIENCES COURSES (added)
    // --------------------------
    // EHS — Exercise and Health Science
    { code:"EHS 120", title:"Careers in Exercise & Health", credits:3, difficulty:"Easy", type:["EHS"], prereqs:[] },
    { code:"EHS 150", title:"Introduction to Nutrition", credits:3, difficulty:"Easy", type:["EHS"], prereqs:[] },
    { code:"EHS 160", title:"Fitness & Wellness", credits:3, difficulty:"Easy", type:["EHS"], prereqs:[] },
    { code:"EHS 230", title:"Strength and Conditioning", credits:3, difficulty:"Moderate", type:["EHS"], prereqs:["EHS 160"] }, // simulated
    { code:"EHS 240", title:"Prevention and Care of Sport Injuries", credits:3, difficulty:"Moderate", type:["EHS"], prereqs:["EHS 160"] }, // simulated
    { code:"EHS 250", title:"Nutrition for Sports & Performance", credits:3, difficulty:"Moderate", type:["EHS"], prereqs:["EHS 150"] }, // simulated
    { code:"EHS 260", title:"Physical Activity & Health", credits:3, difficulty:"Moderate", type:["EHS"], prereqs:["EHS 160"] }, // simulated
    { code:"EHS 280", title:"Statistics for Health Professionals", credits:3, difficulty:"Moderate", type:["EHS","Statistics"], prereqs:[] },
    { code:"EHS 297", title:"Special Topics", credits:3, difficulty:"Moderate", type:["EHS","Topics"], prereqs:[] },
    { code:"EHS 300", title:"Health Fitness Assessment", credits:4, difficulty:"Hard", type:["EHS"], prereqs:["EHS 260"] }, // simulated
    { code:"EHS 310", title:"Applied Kinesiology", credits:3, difficulty:"Hard", type:["EHS"], prereqs:["EHS 260"] }, // simulated
    { code:"EHS 320", title:"Adapted Physical Activity", credits:3, difficulty:"Moderate", type:["EHS"], prereqs:["EHS 260"] }, // simulated
    { code:"EHS 330", title:"Conditioning for Performance", credits:3, difficulty:"Hard", type:["EHS"], prereqs:["EHS 230"] }, // simulated
    { code:"EHS 345", title:"Health Behavior Change", credits:3, difficulty:"Moderate", type:["EHS"], prereqs:["EHS 260"] }, // simulated
    { code:"EHS 350", title:"Obesity and Weight Management", credits:3, difficulty:"Moderate", type:["EHS"], prereqs:["EHS 150"] }, // simulated
    { code:"EHS 365", title:"Integrative Physiology", credits:3, difficulty:"Hard", type:["EHS"], prereqs:["EHS 260"] }, // simulated
    { code:"EHS 370", title:"Exercise Program Design", credits:3, difficulty:"Hard", type:["EHS"], prereqs:["EHS 300"] }, // simulated
    { code:"EHS 385", title:"Exercise Physiology I", credits:3, difficulty:"Hard", type:["EHS"], prereqs:["EHS 365"] }, // simulated
    { code:"EHS 386", title:"Exercise Physiology I Laboratory", credits:1, difficulty:"Hard", type:["EHS","Lab"], prereqs:["EHS 385"] }, // simulated
    { code:"EHS 400", title:"Practicum in Adult Fitness", credits:3, difficulty:"Hard", type:["EHS","Practicum"], prereqs:["EHS 370"] }, // simulated
    { code:"EHS 410", title:"Exercise & Aging", credits:3, difficulty:"Moderate", type:["EHS"], prereqs:["EHS 385"] }, // simulated
    { code:"EHS 420", title:"Pediatric Exercise", credits:3, difficulty:"Moderate", type:["EHS"], prereqs:["EHS 385"] }, // simulated
    { code:"EHS 421", title:"Pediatric Exercise Externship", credits:3, difficulty:"Hard", type:["EHS","Externship"], prereqs:["EHS 420"] }, // simulated
    { code:"EHS 440", title:"Health Fitness Management", credits:3, difficulty:"Moderate", type:["EHS","Management"], prereqs:["EHS 300"] }, // simulated
    { code:"EHS 460", title:"Research Methods I", credits:3, difficulty:"Hard", type:["EHS","Research"], prereqs:["EHS 280"] }, // simulated
    { code:"EHS 470", title:"Research Methods II", credits:3, difficulty:"Hard", type:["EHS","Research"], prereqs:["EHS 460"] }, // simulated
    { code:"EHS 485", title:"Independent Study", credits:1, difficulty:"Moderate", type:["EHS","Independent"], prereqs:[] },
    { code:"EHS 490", title:"Internship in Exercise Physiology", credits:12, difficulty:"Hard", type:["EHS","Internship"], prereqs:["EHS 385"] }, // simulated
    { code:"EHS 491", title:"Internship in Exercise and Health Sciences", credits:6, difficulty:"Hard", type:["EHS","Internship"], prereqs:["EHS 385"] }, // simulated
    { code:"EHS 497", title:"Special Topics", credits:3, difficulty:"Hard", type:["EHS","Topics"], prereqs:["EHS 300"] }, // simulated

    // GERON — Gerontology Undergraduate
    { code:"GERON 150", title:"Introduction to Aging and the Life Course", credits:3, difficulty:"Easy", type:["GERON"], prereqs:[] },
    { code:"GERON 160", title:"International Perspectives on Population Aging", credits:3, difficulty:"Moderate", type:["GERON"], prereqs:["GERON 150"] }, // simulated
    { code:"GERON 170", title:"Sexuality and Aging", credits:3, difficulty:"Moderate", type:["GERON"], prereqs:["GERON 150"] }, // simulated
    { code:"GERON 180", title:"Diversity and Aging", credits:3, difficulty:"Moderate", type:["GERON"], prereqs:["GERON 150"] }, // simulated
    { code:"GERON 190", title:"Death and Dying", credits:3, difficulty:"Moderate", type:["GERON"], prereqs:["GERON 150"] }, // simulated
    { code:"GERON 240", title:"Policy and Aging", credits:3, difficulty:"Moderate", type:["GERON"], prereqs:["GERON 150"] }, // simulated
    { code:"GERON 250", title:"Mental Health and Aging", credits:3, difficulty:"Moderate", type:["GERON"], prereqs:["GERON 150"] }, // simulated
    { code:"GERON 260", title:"Health and Physical Aspects of Aging", credits:3, difficulty:"Moderate", type:["GERON"], prereqs:["GERON 150"] }, // simulated
    { code:"GERON 280", title:"Technology and Aging", credits:3, difficulty:"Easy", type:["GERON","Technology"], prereqs:["GERON 150"] }, // simulated
    { code:"GERON 325", title:"Applied Research in Aging", credits:3, difficulty:"Hard", type:["GERON","Research"], prereqs:["GERON 150"] }, // simulated
    { code:"GERON 342L", title:"Aging and Society", credits:3, difficulty:"Moderate", type:["GERON"], prereqs:["GERON 150"] }, // simulated
    { code:"GERON 350", title:"Families in Later Life", credits:3, difficulty:"Moderate", type:["GERON"], prereqs:["GERON 150"] }, // simulated
    { code:"GERON 355", title:"Service Delivery Issues for Aging Populations", credits:3, difficulty:"Moderate", type:["GERON"], prereqs:["GERON 150"] }, // simulated
    { code:"GERON 370", title:"Arts, Culture & Aging", credits:3, difficulty:"Easy", type:["GERON","Arts"], prereqs:["GERON 150"] }, // simulated
    { code:"GERON 401", title:"Field Placement I", credits:3, difficulty:"Hard", type:["GERON","Field Placement"], prereqs:["GERON 325"] }, // simulated
    { code:"GERON 441", title:"Global Aging Field Placement II", credits:3, difficulty:"Hard", type:["GERON","Field Placement"], prereqs:["GERON 401"] }, // simulated

    // HLTH — Health
    { code:"HLTH 107G", title:"Understanding Human Immunodeficiency Virus (HIV)", credits:3, difficulty:"Easy", type:["HLTH"], prereqs:[] },
    { code:"HLTH 201", title:"Pathophysiology", credits:3, difficulty:"Hard", type:["HLTH"], prereqs:[] },
    { code:"HLTH 212", title:"Health Promotion and Teaching", credits:3, difficulty:"Moderate", type:["HLTH"], prereqs:[] },
    { code:"HLTH 230", title:"Lifespan Growth and Development", credits:3, difficulty:"Moderate", type:["HLTH"], prereqs:[] },
    { code:"HLTH 314", title:"Pharmacology", credits:3, difficulty:"Hard", type:["HLTH"], prereqs:["HLTH 201"] }, // simulated
    { code:"HLTH 344", title:"Global Perspectives on Health: Exploring the intersection of Equity, Economics, and Culture", credits:3, difficulty:"Moderate", type:["HLTH"], prereqs:["HLTH 212"] }, // simulated

    // NURSNG — Nursing
    { code:"NURSNG 220", title:"Health Assessment", credits:4, difficulty:"Hard", type:["NURSNG"], prereqs:[] },
    { code:"NURSNG 226", title:"Introduction to Nursing Practice", credits:6, difficulty:"Moderate", type:["NURSNG"], prereqs:[] },
    { code:"NURSNG 270", title:"Introduction to the Concepts of Nursing", credits:3, difficulty:"Moderate", type:["NURSNG"], prereqs:[] }, // simulated
    { code:"NURSNG 271", title:"Principles of Pathophysiology and Pharmacology for the Nurse", credits:3, difficulty:"Hard", type:["NURSNG"], prereqs:["NURSNG 270"] }, // simulated
    { code:"NURSNG 272", title:"Applying Nursing Process", credits:3, difficulty:"Hard", type:["NURSNG"], prereqs:["NURSNG 270"] }, // simulated
    { code:"NURSNG 273", title:"Assessment and Health Promotion", credits:3, difficulty:"Hard", type:["NURSNG"], prereqs:["NURSNG 272"] }, // simulated
    { code:"NURSNG 310", title:"Adult Health Nursing", credits:9, difficulty:"Hard", type:["NURSNG"], prereqs:["NURSNG 272"] }, // simulated
    { code:"NURSNG 314", title:"Pharmacology in Nursing", credits:3, difficulty:"Hard", type:["NURSNG"], prereqs:["NURSNG 271"] }, // simulated
    { code:"NURSNG 320", title:"Research", credits:3, difficulty:"Moderate", type:["NURSNG","Research"], prereqs:[] },
    { code:"NURSNG 332", title:"Legal, Ethical and Health Policy Issues in Nursing", credits:3, difficulty:"Moderate", type:["NURSNG","Ethics"], prereqs:["NURSNG 270"] }, // simulated
    { code:"NURSNG 335", title:"Maternity and Women's Health Nursing", credits:6, difficulty:"Hard", type:["NURSNG"], prereqs:["NURSNG 310"] }, // simulated
    { code:"NURSNG 345", title:"Mental Health Nursing", credits:6, difficulty:"Hard", type:["NURSNG"], prereqs:["NURSNG 310"] }, // simulated
    { code:"NURSNG 360", title:"Professional Issues in Nursing for RNs", credits:6, difficulty:"Moderate", type:["NURSNG"], prereqs:[] },
    { code:"NURSNG 361", title:"Health Assessment and Promotion", credits:6, difficulty:"Moderate", type:["NURSNG"], prereqs:["NURSNG 220"] }, // simulated
    { code:"NURSNG 362", title:"Research and Evidence-based Practice", credits:6, difficulty:"Moderate", type:["NURSNG","Research"], prereqs:["NURSNG 320"] }, // simulated
    { code:"NURSNG 370", title:"Healthcare Participant", credits:3, difficulty:"Moderate", type:["NURSNG"], prereqs:["NURSNG 272"] }, // simulated
    { code:"NURSNG 371", title:"Evidence-Based Nursing Practice", credits:3, difficulty:"Moderate", type:["NURSNG","Research"], prereqs:["NURSNG 370"] }, // simulated
    { code:"NURSNG 372", title:"Concepts of Heath and Illness I", credits:3, difficulty:"Hard", type:["NURSNG"], prereqs:["NURSNG 272"] }, // simulated
    { code:"NURSNG 373", title:"Concepts of Health and Illness II", credits:3, difficulty:"Hard", type:["NURSNG"], prereqs:["NURSNG 372"] }, // simulated
    { code:"NURSNG 405", title:"Independent Study", credits:1, difficulty:"Moderate", type:["NURSNG","Independent"], prereqs:[] },
    { code:"NURSNG 430", title:"Nursing in the Community", credits:6, difficulty:"Hard", type:["NURSNG"], prereqs:["NURSNG 373"] }, // simulated
    { code:"NURSNG 435", title:"Nursing Care of Children", credits:6, difficulty:"Hard", type:["NURSNG"], prereqs:["NURSNG 373"] }, // simulated
    { code:"NURSNG 455", title:"Nursing Synthesis and Capstone", credits:3, difficulty:"Hard", type:["NURSNG","Capstone"], prereqs:["NURSNG 430"] }, // simulated
    { code:"NURSNG 456", title:"Leadership and Professional Practice Accelerated Option", credits:3, difficulty:"Hard", type:["NURSNG","Leadership"], prereqs:["NURSNG 373"] }, // simulated
    { code:"NURSNG 461", title:"Community Health for Registered Nurses", credits:6, difficulty:"Moderate", type:["NURSNG"], prereqs:[] },
    { code:"NURSNG 462", title:"Legal, Ethical and Health Policy and Capstone for RNs", credits:6, difficulty:"Hard", type:["NURSNG","Capstone","Ethics"], prereqs:[] },
    { code:"NURSNG 470", title:"Professional Nursing Concepts", credits:3, difficulty:"Moderate", type:["NURSNG"], prereqs:["NURSNG 373"] },
    { code:"NURSNG 471", title:"Active and Engaged Nursing Practice", credits:3, difficulty:"Moderate", type:["NURSNG"], prereqs:["NURSNG 470"] }, // simulated
    { code:"NURSNG 472", title:"Concepts of Health and Illness III", credits:3, difficulty:"Hard", type:["NURSNG"], prereqs:["NURSNG 373"] }, // simulated
    { code:"NURSNG 473", title:"Concepts of Heath and Illness IV", credits:3, difficulty:"Hard", type:["NURSNG"], prereqs:["NURSNG 472"] }, // simulated
    // GENED — Generic electives to help majors reach total-credit requirements
                                                                                                // PUBHTH — Public Health
    { code:"PUBHTH 101", title:"History and Foundations of Public Health", credits:3, difficulty:"Easy", type:["PUBHTH"], prereqs:[] },
    { code:"PUBHTH 102", title:"Introduction to Environmental Health", credits:3, difficulty:"Easy", type:["PUBHTH"], prereqs:[] },
    { code:"PUBHTH 203", title:"Pandemics and Climate Change", credits:3, difficulty:"Moderate", type:["PUBHTH"], prereqs:[] },
    { code:"PUBHTH 220", title:"Introduction to Epidemiology", credits:3, difficulty:"Moderate", type:["PUBHTH"], prereqs:["PUBHTH 101"] }, // simulated
    { code:"PUBHTH 240", title:"Social Determinants of Health", credits:3, difficulty:"Moderate", type:["PUBHTH"], prereqs:["PUBHTH 101"] }, // simulated
    { code:"PUBHTH 265", title:"Special Topics in Urban Public Health", credits:3, difficulty:"Moderate", type:["PUBHTH","Topics"], prereqs:[] },
    { code:"PUBHTH 330", title:"Racism as a Public Health Problem", credits:3, difficulty:"Hard", type:["PUBHTH"], prereqs:["PUBHTH 240"] }, // simulated
    { code:"PUBHTH 350", title:"US Healthcare Systems", credits:3, difficulty:"Moderate", type:["PUBHTH"], prereqs:["PUBHTH 101"] }, // simulated
    { code:"PUBHTH 355", title:"Health Communications", credits:3, difficulty:"Moderate", type:["PUBHTH"], prereqs:["PUBHTH 101"] }, // simulated
    { code:"PUBHTH 356", title:"Urbanization and Public Health", credits:3, difficulty:"Moderate", type:["PUBHTH"], prereqs:["PUBHTH 101"] }, // simulated
    { code:"PUBHTH 360", title:"Applied Biostatistics", credits:3, difficulty:"Hard", type:["PUBHTH","Statistics"], prereqs:["PUBHTH 101"] }, // simulated
    { code:"PUBHTH 365", title:"Special Topics in Urban Public Health", credits:3, difficulty:"Hard", type:["PUBHTH","Topics"], prereqs:["PUBHTH 101"] }, // simulated
    { code:"PUBHTH 380", title:"Public Health Issues in Aging Societies", credits:3, difficulty:"Moderate", type:["PUBHTH"], prereqs:["PUBHTH 240"] }, // simulated
    { code:"PUBHTH 400", title:"Research Methods for Public Health", credits:3, difficulty:"Hard", type:["PUBHTH","Research"], prereqs:["PUBHTH 220"] }, // simulated
    { code:"PUBHTH 465", title:"Special Topics in Urban Public Health", credits:3, difficulty:"Hard", type:["PUBHTH","Topics"], prereqs:["PUBHTH 240"] }, // simulated
    { code:"PUBHTH 480", title:"Capstone in Urban Public Health", credits:3, difficulty:"Hard", type:["PUBHTH","Capstone"], prereqs:["PUBHTH 400"] }, // simulated
    { code:"PUBHTH 498", title:"Independent Study in Urban Public Health", credits:3, difficulty:"Moderate", type:["PUBHTH","Independent"], prereqs:[] },

// --------------------------
    // HONORS / CEHD COURSES (added)
    // --------------------------
    { code:"HONORS 101", title:"Honors First-year Seminar", credits:3, difficulty:"Easy", type:["HONORS","Seminar"], prereqs:[] },
    { code:"HONORS 210G", title:"Honors Intermediate Seminar", credits:3, difficulty:"Moderate", type:["HONORS","Seminar"], prereqs:["HONORS 101"] },
    { code:"HONORS 290", title:"Special Topics", credits:3, difficulty:"Moderate", type:["HONORS","Topics"], prereqs:[] },
    { code:"HONORS 291", title:"Honors Topic in Arts", credits:3, difficulty:"Moderate", type:["HONORS","Arts"], prereqs:[] },
    { code:"HONORS 292", title:"Honors Topic in Humanities", credits:3, difficulty:"Moderate", type:["HONORS","Humanities"], prereqs:[] },
    { code:"HONORS 293", title:"Honors Topic in Social and Behavioral Sciences", credits:3, difficulty:"Moderate", type:["HONORS","Social Science"], prereqs:[] },
    { code:"HONORS 294", title:"Honors Topic in World Cultures", credits:3, difficulty:"Moderate", type:["HONORS","World Cultures"], prereqs:[] },
    { code:"HONORS 295", title:"Honors Topics in the Natural Science", credits:3, difficulty:"Moderate", type:["HONORS","Natural Science"], prereqs:[] },
    { code:"HONORS 380", title:"Honors Colloquium", credits:3, difficulty:"Moderate", type:["HONORS","Colloquium"], prereqs:["HONORS 210G"] },
    { code:"HONORS 490", title:"Special Topics", credits:3, difficulty:"Moderate", type:["HONORS","Topics"], prereqs:[] },

    { code:"ASAMST 110G", title:"Global Diasporas: Roots and Routes", credits:3, difficulty:"Moderate", type:["ASAMST"], prereqs:[] },
    { code:"ASAMST 200", title:"Introduction to Asian American Studies", credits:3, difficulty:"Moderate", type:["ASAMST"], prereqs:[] },
    { code:"ASAMST 220", title:"Special Topics", credits:3, difficulty:"Moderate", type:["ASAMST","Topics"], prereqs:[] },
    { code:"ASAMST 221L", title:"Introduction to Asian American Writing", credits:3, difficulty:"Moderate", type:["ASAMST","Writing"], prereqs:[] },
    { code:"ASAMST 223L", title:"Asians in the United States", credits:3, difficulty:"Moderate", type:["ASAMST"], prereqs:[] },
    { code:"ASAMST 225L", title:"Southeast Asians in the United States", credits:3, difficulty:"Moderate", type:["ASAMST"], prereqs:[] },
    { code:"ASAMST 226", title:"Becoming South Asians", credits:3, difficulty:"Moderate", type:["ASAMST"], prereqs:[] },
    { code:"ASAMST 228L", title:"Asian Women in the United States", credits:3, difficulty:"Moderate", type:["ASAMST"], prereqs:[] },
    { code:"ASAMST 238L", title:"Asian American Psychology", credits:3, difficulty:"Moderate", type:["ASAMST"], prereqs:[] },
    { code:"ASAMST 250G", title:"Rise Up! Asian American Leadership and Social Change", credits:3, difficulty:"Moderate", type:["ASAMST","Leadership"], prereqs:[] },
    { code:"ASAMST 265L", title:"World War II Internment of Japanese Americans (A)", credits:3, difficulty:"Moderate", type:["ASAMST","History"], prereqs:[] },
    { code:"ASAMST 270", title:"Cambodian American Culture and Community", credits:3, difficulty:"Moderate", type:["ASAMST"], prereqs:[] },
    { code:"ASAMST 294", title:"Resources for Vietnamese American Studies", credits:3, difficulty:"Moderate", type:["ASAMST"], prereqs:[] },
    { code:"ASAMST 315L", title:"Asian American Cinema", credits:3, difficulty:"Moderate", type:["ASAMST","Cinema"], prereqs:[] },
    { code:"ASAMST 326L", title:"Multiracial Experiences", credits:3, difficulty:"Moderate", type:["ASAMST"], prereqs:[] },
    { code:"ASAMST 333", title:"Asian American Politics and Social Movements", credits:3, difficulty:"Moderate", type:["ASAMST","Politics"], prereqs:[] },
    { code:"ASAMST 345", title:"Asian American Cultures and Health Practices", credits:3, difficulty:"Moderate", type:["ASAMST","Health"], prereqs:[] },
    { code:"ASAMST 350L", title:"Asian-American Literary Voices", credits:3, difficulty:"Moderate", type:["ASAMST","Literature"], prereqs:[] },
    { code:"ASAMST 353L", title:"Community Economic Development in the U.S.: Class, Race, Ethnicity", credits:3, difficulty:"Moderate", type:["ASAMST"], prereqs:[] },
    { code:"ASAMST 355L", title:"Asian Americans and the Law", credits:3, difficulty:"Moderate", type:["ASAMST","Law"], prereqs:[] },
    { code:"ASAMST 370", title:"Asian American Media Literacy", credits:3, difficulty:"Moderate", type:["ASAMST","Media"], prereqs:[] },
    { code:"ASAMST 375L", title:"Indian Cinema", credits:3, difficulty:"Moderate", type:["ASAMST","Cinema"], prereqs:[] },
    { code:"ASAMST 390", title:"Asian American Community Internships I", credits:3, difficulty:"Moderate", type:["ASAMST","Internship"], prereqs:["ASAMST 200"] },
    { code:"ASAMST 391", title:"Asian American Community Internships II", credits:3, difficulty:"Moderate", type:["ASAMST","Internship"], prereqs:["ASAMST 390"] },
    { code:"ASAMST 397", title:"Applied Research in Asian American Studies I", credits:3, difficulty:"Hard", type:["ASAMST","Research"], prereqs:["ASAMST 200"] },
    { code:"ASAMST 398", title:"Applied Research in Asian American Studies II", credits:3, difficulty:"Hard", type:["ASAMST","Research"], prereqs:["ASAMST 397"] },
    { code:"ASAMST 420", title:"Advanced Topics", credits:3, difficulty:"Hard", type:["ASAMST","Topics"], prereqs:["ASAMST 200"] },
    { code:"ASAMST 423", title:"Boston's Asian American Communities", credits:3, difficulty:"Moderate", type:["ASAMST"], prereqs:["ASAMST 200"] },
    { code:"ASAMST 478", title:"Independent Study I", credits:1, difficulty:"Moderate", type:["ASAMST","Independent"], prereqs:[] },
    { code:"ASAMST 479", title:"Independent Study II", credits:1, difficulty:"Moderate", type:["ASAMST","Independent"], prereqs:["ASAMST 478"] },
    { code:"ASAMST 497", title:"Teaching and Learning in Asian American Studies I", credits:3, difficulty:"Hard", type:["ASAMST","Teaching"], prereqs:["ASAMST 200"] },
    { code:"ASAMST 498", title:"Teaching and Learning in Asian American Studies II", credits:3, difficulty:"Hard", type:["ASAMST","Teaching"], prereqs:["ASAMST 497"] },

    { code:"COUNSL 110G", title:"Sexual Ethics", credits:3, difficulty:"Moderate", type:["COUNSL"], prereqs:[] },

    { code:"CSP 216L", title:"Therapeutic Mentoring", credits:3, difficulty:"Moderate", type:["CSP"], prereqs:[] },
    { code:"CSP 301", title:"Work & Play: Counseling Skills for Life", credits:1, difficulty:"Moderate", type:["CSP"], prereqs:[] },
    { code:"CSP 302L", title:"Psychology of Sexual Orientation and Gender Identities", credits:3, difficulty:"Moderate", type:["CSP"], prereqs:[] },

    { code:"ECHD 101G", title:"Young Children, Play, and Early Childhood Policy", credits:4, difficulty:"Moderate", type:["ECHD"], prereqs:[] },
    { code:"ECHD 201", title:"Foundations of Early Intervention and Education for All Young Children", credits:3, difficulty:"Moderate", type:["ECHD"], prereqs:[] },
    { code:"ECHD 208", title:"Introduction to Infant and Toddler Care and Education", credits:3, difficulty:"Moderate", type:["ECHD"], prereqs:[] },
    { code:"ECHD 211", title:"Child Growth and Development, Birth to Age Eight - including Special Needs", credits:3, difficulty:"Hard", type:["ECHD"], prereqs:[] },
    { code:"ECHD 221", title:"Supporting Young Children's Social Interactions and Emotional Growth", credits:3, difficulty:"Moderate", type:["ECHD"], prereqs:["ECHD 211"] },
    { code:"ECHD 250G", title:"Teaching Superpowers: The Science of Building Resilience in Early Education and Care Settings", credits:3, difficulty:"Moderate", type:["ECHD"], prereqs:[] },
    { code:"ECHD 290", title:"Internship in Early Education and Care", credits:3, difficulty:"Moderate", type:["ECHD","Internship"], prereqs:["ECHD 201"] },
    { code:"ECHD 317", title:"Responsibility and Ethics in Early Education and Care", credits:3, difficulty:"Moderate", type:["ECHD","Ethics"], prereqs:[] },
    { code:"ECHD 420", title:"Instructional Strategies For All Young Children With A Focus On Creative Arts", credits:3, difficulty:"Moderate", type:["ECHD"], prereqs:["ECHD 201"] },
    { code:"ECHD 422", title:"Observing, Documenting & Assessing in Early Childhood", credits:3, difficulty:"Moderate", type:["ECHD"], prereqs:["ECHD 201"] },
    { code:"ECHD 430", title:"Technology for all Young Children", credits:3, difficulty:"Easy", type:["ECHD","Technology"], prereqs:[] },
    { code:"ECHD 435", title:"Family Systems, Support, and Engagement", credits:3, difficulty:"Moderate", type:["ECHD"], prereqs:[] },
    { code:"ECHD 440", title:"Language Development & Literacy in Early Childhood", credits:3, difficulty:"Moderate", type:["ECHD","Writing"], prereqs:["ECHD 201"] },
    { code:"ECHD 441", title:"Science & Mathematics Instruction for all Young Children", credits:3, difficulty:"Moderate", type:["ECHD","Math"], prereqs:["ECHD 201"] },
    { code:"ECHD 450", title:"Leadership in Early Education & Care", credits:3, difficulty:"Moderate", type:["ECHD","Leadership"], prereqs:["ECHD 201"] },
    { code:"ECHD 453", title:"Team collaboration and Service Delivery Models", credits:3, difficulty:"Moderate", type:["ECHD"], prereqs:["ECHD 201"] },
    { code:"ECHD 454", title:"Instructional Leadership and Quality Improvement in Early Care and Education", credits:3, difficulty:"Hard", type:["ECHD","Leadership"], prereqs:["ECHD 450"] },
    { code:"ECHD 455", title:"Introduction to Focus on Pre-K", credits:3, difficulty:"Moderate", type:["ECHD"], prereqs:[] },
    { code:"ECHD 459", title:"Administration & Supervision of Programs for Young Children", credits:3, difficulty:"Moderate", type:["ECHD","Administration"], prereqs:["ECHD 450"] },
    { code:"ECHD 466", title:"Early Intervention: Curriculum, Methods, and Services", credits:3, difficulty:"Hard", type:["ECHD"], prereqs:["ECHD 201"] },
    { code:"ECHD 490", title:"Planning Curriculum in Early Childhood", credits:3, difficulty:"Hard", type:["ECHD"], prereqs:["ECHD 466"] },
    { code:"ECHD 493", title:"Internship in Early Education and Care II", credits:9, difficulty:"Hard", type:["ECHD","Internship"], prereqs:["ECHD 290"] },
    { code:"ECHD 494", title:"Teacher Inquiry/Practicum II", credits:9, difficulty:"Hard", type:["ECHD","Practicum"], prereqs:["ECHD 290"] },
    { code:"ECHD 496", title:"Independent Study: Early Education and Care in Inclusive Settings", credits:1, difficulty:"Moderate", type:["ECHD","Independent"], prereqs:[] },
    { code:"ECHD 497", title:"Special Topics: Early Education and Care in Inclusive Settings", credits:3, difficulty:"Moderate", type:["ECHD","Topics"], prereqs:[] },

    { code:"EDC U 212", title:"Coding for Non-Coders", credits:3, difficulty:"Easy", type:["EDC U","Programming"], prereqs:[] },
    { code:"EDC U 220", title:"Human Development for Educators", credits:3, difficulty:"Moderate", type:["EDC U"], prereqs:[] },
    { code:"EDC U 230", title:"Introduction to Special Education and Inclusion", credits:3, difficulty:"Moderate", type:["EDC U"], prereqs:[] },
    { code:"EDC U 241", title:"Introduction to Urban Education", credits:3, difficulty:"Moderate", type:["EDC U"], prereqs:[] },
    { code:"EDC U 270", title:"UTeach: Knowing and Learning in Mathematics and Science", credits:3, difficulty:"Moderate", type:["EDC U","UTeach"], prereqs:[] },
    { code:"EDC U 275", title:"UTeach: Classroom Interactions", credits:3, difficulty:"Moderate", type:["EDC U","UTeach"], prereqs:["EDC U 270"] },
    { code:"EDC U 310", title:"Technology & Education", credits:3, difficulty:"Moderate", type:["EDC U","Technology"], prereqs:[] },
    { code:"EDC U 370", title:"UTeach: Perspectives on Science and Mathematics", credits:3, difficulty:"Moderate", type:["EDC U","UTeach"], prereqs:["EDC U 270"] },
    { code:"EDC U 375", title:"UTeach: Functions and Modeling", credits:3, difficulty:"Hard", type:["EDC U","UTeach","Math"], prereqs:["EDC U 270"] },
    { code:"EDC U 406", title:"Sociocultural Perspectives: Building School, Family & Community Relationships", credits:3, difficulty:"Moderate", type:["EDC U"], prereqs:[] },
    { code:"EDC U 422", title:"Middle & Secondary Pre-Practicum", credits:3, difficulty:"Moderate", type:["EDC U","Practicum"], prereqs:[] },
    { code:"EDC U 446", title:"Understanding Reading: Principles & Practices", credits:3, difficulty:"Moderate", type:["EDC U","Writing"], prereqs:[] },
    { code:"EDC U 451", title:"Rethinking Equity and Teaching for English Language Learners", credits:3, difficulty:"Moderate", type:["EDC U"], prereqs:[] },
    { code:"EDC U 460", title:"Designing Curriculum and Instruction Strategies", credits:3, difficulty:"Hard", type:["EDC U"], prereqs:[] },
    { code:"EDC U 466", title:"Teaching and Learning in the Discipline History and Social Studies", credits:3, difficulty:"Moderate", type:["EDC U"], prereqs:[] },
    { code:"EDC U 467", title:"Teaching & Learning in the Discipline English", credits:3, difficulty:"Moderate", type:["EDC U","Writing"], prereqs:[] },
    { code:"EDC U 470", title:"UTeach: Research Methods", credits:3, difficulty:"Hard", type:["EDC U","UTeach","Research"], prereqs:["EDC U 270"] },
    { code:"EDC U 475", title:"UTeach: Project-Based Instruction", credits:3, difficulty:"Moderate", type:["EDC U","UTeach","Project"], prereqs:["EDC U 270"] },
    { code:"EDC U 497", title:"Special Topics", credits:3, difficulty:"Moderate", type:["EDC U","Topics"], prereqs:[] },
    { code:"EDC U 499", title:"Practicum & Seminar", credits:12, difficulty:"Hard", type:["EDC U","Practicum","Seminar"], prereqs:["EDC U 422"] },

    { code:"SL 101", title:"Foundations of Sport Leadership", credits:3, difficulty:"Moderate", type:["SL"], prereqs:[] },
    { code:"SL 110", title:"Sport and the Environment", credits:3, difficulty:"Easy", type:["SL"], prereqs:[] },
    { code:"SL 160", title:"Personal Branding for a Competitive Edge", credits:3, difficulty:"Easy", type:["SL"], prereqs:[] },
    { code:"SL 180", title:"Career Exploration and Development in the Sport Industry", credits:3, difficulty:"Easy", type:["SL"], prereqs:[] },
    { code:"SL 201", title:"Sport in Society", credits:3, difficulty:"Moderate", type:["SL"], prereqs:["SL 101"] },
    { code:"SL 202", title:"Introduction to Sport Psychology", credits:3, difficulty:"Moderate", type:["SL"], prereqs:["SL 101"] },
    { code:"SL 204", title:"Coaching, Athletic Administration, and Equity Mindedness", credits:3, difficulty:"Moderate", type:["SL"], prereqs:["SL 101"] },
    { code:"SL 206", title:"Community Sport", credits:3, difficulty:"Moderate", type:["SL"], prereqs:["SL 101"] },
    { code:"SL 280", title:"Internship I: Sport Practicum", credits:3, difficulty:"Moderate", type:["SL","Internship"], prereqs:["SL 201"] },
    { code:"SL 297", title:"Sport Media", credits:3, difficulty:"Moderate", type:["SL","Media"], prereqs:["SL 101"] },
    { code:"SL 301", title:"Sport Operations", credits:3, difficulty:"Hard", type:["SL","Operations"], prereqs:["SL 201"] },
    { code:"SL 302", title:"Sport Marketing and Sales", credits:3, difficulty:"Moderate", type:["SL","Marketing"], prereqs:["SL 201"] },
    { code:"SL 331", title:"Gender and Sport", credits:3, difficulty:"Moderate", type:["SL"], prereqs:["SL 201"] },
    { code:"SL 380", title:"Internship II: Domestic", credits:6, difficulty:"Hard", type:["SL","Internship"], prereqs:["SL 280"] },
    { code:"SL 381", title:"Internship III: International", credits:6, difficulty:"Hard", type:["SL","Internship"], prereqs:["SL 280"] },
    { code:"SL 401", title:"Sport Law, Ethics, and Equity", credits:3, difficulty:"Hard", type:["SL","Law","Ethics"], prereqs:["SL 201"] },
    { code:"SL 410", title:"Sport Activism, Advocacy, and Agency", credits:3, difficulty:"Moderate", type:["SL"], prereqs:["SL 201"] },
    { code:"SL 420", title:"Sport and Globalization", credits:3, difficulty:"Moderate", type:["SL"], prereqs:["SL 201"] },
    { code:"SL 498", title:"Capstone: Sport and Social Change", credits:3, difficulty:"Hard", type:["SL","Capstone"], prereqs:["SL 301"] },



// AF COURSES (Accounting & Finance — added from user list)
    // --------------------------
    { code:"AF 210",  title:"Financial Accounting", credits:3, difficulty:"Moderate", type:["AF","Accounting"], prereqs:[] },
    { code:"AF 211",  title:"Managerial Accounting", credits:3, difficulty:"Moderate", type:["AF","Accounting"], prereqs:["AF 210"] },
    { code:"AF 301",  title:"Introduction to Financial Management", credits:3, difficulty:"Moderate", type:["AF","Finance"], prereqs:["AF 210"] },
    { code:"AF 310",  title:"Intermediate Accounting I", credits:3, difficulty:"Hard", type:["AF","Accounting"], prereqs:["AF 210","AF 211"] },
    { code:"AF 311",  title:"Intermediate Accounting II", credits:3, difficulty:"Hard", type:["AF","Accounting"], prereqs:["AF 310"] },
    { code:"AF 315",  title:"Accounting Information Systems", credits:3, difficulty:"Moderate", type:["AF","Accounting","Systems"], prereqs:["AF 210"] },
    { code:"AF 317",  title:"Data Analytics for Accounting", credits:3, difficulty:"Moderate", type:["AF","Accounting","Analytics"], prereqs:["AF 315"] },
    { code:"AF 325",  title:"Theory of Corporate Finance", credits:3, difficulty:"Hard", type:["AF","Finance"], prereqs:["AF 301"] },
    { code:"AF 330",  title:"Business Law", credits:3, difficulty:"Moderate", type:["AF","Law"], prereqs:[] },
    { code:"AF 335",  title:"Investments", credits:3, difficulty:"Hard", type:["AF","Finance"], prereqs:["AF 301"] },
    { code:"AF 363",  title:"Cost Accounting", credits:3, difficulty:"Hard", type:["AF","Accounting"], prereqs:["AF 211"] },
    { code:"AF 405",  title:"Sport Finance", credits:3, difficulty:"Moderate", type:["AF","Finance"], prereqs:["AF 301"] },
    { code:"AF 426",  title:"Financial Modeling", credits:3, difficulty:"Hard", type:["AF","Finance","Modeling"], prereqs:["AF 325"] },
    { code:"AF 435",  title:"Derivative Securities", credits:3, difficulty:"Hard", type:["AF","Finance"], prereqs:["AF 335","AF 325"] },
    { code:"AF 444",  title:"Asset Management Practicum", credits:3, difficulty:"Hard", type:["AF","Finance","Practicum"], prereqs:["AF 335"] },
    { code:"AF 445",  title:"Markets and Financial Institutions", credits:3, difficulty:"Moderate", type:["AF","Finance"], prereqs:["AF 301"] },
    { code:"AF 450",  title:"Federal Taxation I", credits:3, difficulty:"Moderate", type:["AF","Tax"], prereqs:["AF 210"] },
    { code:"AF 451",  title:"Federal Taxation II", credits:3, difficulty:"Hard", type:["AF","Tax"], prereqs:["AF 450"] },
    { code:"AF 410",  title:"Accounting Elective", credits:3, difficulty:"Hard", type:["AF"], prereqs:["AF 315"] },
    { code:"AF 455",  title:"International Financial Management", credits:3, difficulty:"Hard", type:["AF","Finance"], prereqs:["AF 301"] },
    { code:"AF 470",  title:"Financial Auditing", credits:3, difficulty:"Hard", type:["AF","Auditing"], prereqs:["AF 310"] },
    { code:"AF 475",  title:"Real Estate Finance & Investment", credits:3, difficulty:"Moderate", type:["AF","Finance"], prereqs:["AF 301"] },
    { code:"AF 478",  title:"Special Topics in Finance", credits: 2, difficulty:"Moderate", type:["AF","Finance"], prereqs:["AF 301"] },
    { code:"AF 480",  title:"Accounting Internship", credits:3, difficulty:"Moderate", type:["AF","Internship"], prereqs:["AF 210"] },
    { code:"AF 488",  title:"Independent Study", credits:1, difficulty:"Moderate", type:["AF","Independent"], prereqs:[] },
    { code:"AF 490",  title:"Current Topics in Accounting", credits:3, difficulty:"Moderate", type:["AF","Accounting"], prereqs:["AF 310"] },
    { code:"AF 495",  title:"Financial Policy", credits:3, difficulty:"Hard", type:["AF","Finance"], prereqs:["AF 325"] },
    { code:"AF 498",  title:"College of Management Honors Research Seminar", credits:3, difficulty:"Moderate", type:["AF","Honors"], prereqs:[] },
    { code:"AF 499",  title:"College of Management Honors Thesis Seminar", credits:3, difficulty:"Hard", type:["AF","Honors"], prereqs:["AF 498"] },

// --------------------------
    
    // --------------------------
    // Management (MGT) COURSES
    // --------------------------
    { code:"MGT 130",  title:"Introduction to Business", credits:3, difficulty:"Moderate", type:["MGT"], prereqs:[] },
    { code:"MGT 303",  title:"Managing Organizations", credits:3, difficulty:"Moderate", type:["MGT"], prereqs:[] },
    { code:"MGT 330",  title:"Business Environments and Public Policy", credits:3, difficulty:"Moderate", type:["MGT"], prereqs:[] },
    { code:"MGT 331",  title:"Managerial Ethics and Social Issues", credits:3, difficulty:"Moderate", type:["MGT"], prereqs:[] },
    { code:"MGT 350",  title:"Organizational Events Management", credits:3, difficulty:"Moderate", type:["MGT"], prereqs:[] },
    { code:"MGT 401",  title:"Intro Human Resource Management", credits:3, difficulty:"Moderate", type:["MGT"], prereqs:[] },
    { code:"MGT 415",  title:"Sport Entrepreneurship: Innovation, Design and Start-Up of Sport-Themed Enterprises", credits:3, difficulty:"Moderate", type:["MGT"], prereqs:[] },
    { code:"MGT 421",  title:"Management Practices", credits:3, difficulty:"Moderate", type:["MGT"], prereqs:[] },
    { code:"MGT 431",  title:"The Legal Environment of Business", credits:3, difficulty:"Moderate", type:["MGT"], prereqs:[] },
    { code:"MGT 434",  title:"Managing Global Environment", credits:3, difficulty:"Moderate", type:["MGT"], prereqs:[] },
    { code:"MGT 450",  title:"Advanced Topics in Managing Organizations", credits:3, difficulty:"Moderate", type:["MGT"], prereqs:[] },
    { code:"MGT 470",  title:"Entrepreneurship and Innovation in Organizations", credits:3, difficulty:"Moderate", type:["MGT"], prereqs:[] },
    { code:"MGT 474",  title:"Entrepreneurship Practicum to Launch Your Own Business", credits:3, difficulty:"Moderate", type:["MGT"], prereqs:[] },
    { code:"MGT 478",  title:"Special Topics in Management", credits:3, difficulty:"Moderate", type:["MGT"], prereqs:[] },
    { code:"MGT 480",  title:"Management Internship", credits:3, difficulty:"Moderate", type:["MGT"], prereqs:[] },
    { code:"MGT 481L",  title:"Introduction to Environmental Management and Clean Energy", credits:3, difficulty:"Moderate", type:["MGT"], prereqs:[] },
    { code:"MGT 488",  title:"Independent Study", credits:3, difficulty:"Moderate", type:["MGT"], prereqs:[] },
    { code:"MGT 490",  title:"Strategic Management", credits:3, difficulty:"Moderate", type:["MGT"], prereqs:[] },
    { code:"MGT 498",  title:"College of Management Honors Research Seminar", credits:3, difficulty:"Moderate", type:["MGT"], prereqs:[] },
    { code:"MGT 499",  title:"College of Management Honors Thesis Seminar", credits:3, difficulty:"Moderate", type:["MGT"], prereqs:[] },

    // --------------------------
    // Marketing (MKT) COURSES
    // --------------------------
    { code:"MKT 301",  title:"Principles of Marketing", credits:3, difficulty:"Moderate", type:["MKT"], prereqs:[] },
    { code:"MKT 310",  title:"Data Analysis for Marketing Management", credits:3, difficulty:"Moderate", type:["MKT"], prereqs:[] },
    { code:"MKT 403",  title:"Integrated Marketing Communication", credits:3, difficulty:"Moderate", type:["MKT"], prereqs:[] },
    { code:"MKT 405",  title:"Web Page Marketing", credits:3, difficulty:"Moderate", type:["MKT"], prereqs:[] },
    { code:"MKT 407",  title:"Services Marketing", credits:3, difficulty:"Moderate", type:["MKT"], prereqs:[] },
    { code:"MKT 408",  title:"Consumer Behavior", credits:3, difficulty:"Moderate", type:["MKT"], prereqs:[] },
    { code:"MKT 409",  title:"Customer Relationship Management", credits:3, difficulty:"Moderate", type:["MKT"], prereqs:[] },
    { code:"MKT 425",  title:"Sport Marketing & Sponsorship", credits:3, difficulty:"Moderate", type:["MKT"], prereqs:[] },
    { code:"MKT 430",  title:"International Marketing", credits:3, difficulty:"Moderate", type:["MKT"], prereqs:[] },
    { code:"MKT 435",  title:"Sport Business Analytics", credits:3, difficulty:"Moderate", type:["MKT"], prereqs:[] },
    { code:"MKT 441",  title:"Social Media & E-Services", credits:3, difficulty:"Moderate", type:["MKT"], prereqs:[] },
    { code:"MKT 458",  title:"Marketing Analytics", credits:3, difficulty:"Moderate", type:["MKT"], prereqs:[] },
    { code:"MKT 465",  title:"Entrepreneurship Sales & Marketing", credits:3, difficulty:"Moderate", type:["MKT"], prereqs:[] },
    { code:"MKT 478",  title:"Special Topics in Marketing", credits:3, difficulty:"Moderate", type:["MKT"], prereqs:[] },
    { code:"MKT 479",  title:"Digital Marketing", credits:3, difficulty:"Moderate", type:["MKT"], prereqs:[] },
    { code:"MKT 480",  title:"Marketing Internship", credits:3, difficulty:"Moderate", type:["MKT"], prereqs:[] },
    { code:"MKT 488",  title:"Independent Study", credits:1, difficulty:"Moderate", type:["MKT"], prereqs:[] },
    { code:"MKT 498",  title:"College of Management Honors Research Seminar", credits:3, difficulty:"Moderate", type:["MKT"], prereqs:[] },
    { code:"MKT 499",  title:"College of Management Honors Thesis Seminar", credits:3, difficulty:"Moderate", type:["MKT"], prereqs:[] },

    // --------------------------
    // SCHOOL FOR THE ENVIRONMENT COURSES (added)
    // ENVSCI / ENVSTY / UPCD / USEA
    // --------------------------
    { code:"ENVSCI 101", title:"The Global Environment", credits:3, difficulty:"Easy", type:["ENVSCI"], prereqs:[] },
    { code:"ENVSCI 102", title:"World Regional Geography", credits:3, difficulty:"Easy", type:["ENVSCI"], prereqs:[] },
    { code:"ENVSCI 104", title:"Dinosaurs: A Natural History", credits:3, difficulty:"Easy", type:["ENVSCI"], prereqs:[] },
    { code:"ENVSCI 105", title:"Sustainability: It Is Not Easy Being Green", credits:3, difficulty:"Easy", type:["ENVSCI"], prereqs:[] },
    { code:"ENVSCI 114", title:"Introduction to Sustainable Marine Aquaculture", credits:3, difficulty:"Easy", type:["ENVSCI"], prereqs:[] },
    { code:"ENVSCI 116L", title:"Quantitative Reasoning and the Environment", credits:3, difficulty:"Easy", type:["ENVSCI"], prereqs:[] },
    { code:"ENVSCI 120", title:"Introduction to Environmental Science", credits:3, difficulty:"Easy", type:["ENVSCI"], prereqs:[] },
    { code:"ENVSCI 121", title:"Introduction to Environmental Science Lab", credits:1, difficulty:"Easy", type:["ENVSCI", "Lab"], prereqs:["ENVSCI 120"] },
    { code:"ENVSCI 122", title:"Introduction to Environmental Policy & Management", credits:3, difficulty:"Easy", type:["ENVSCI", "Policy"], prereqs:[] },
    { code:"ENVSCI 124", title:"Aquaculture Production", credits:3, difficulty:"Easy", type:["ENVSCI"], prereqs:[] },
    { code:"ENVSCI 134", title:"Basic Start up Business Techniques for Aquaculture Operations", credits:3, difficulty:"Easy", type:["ENVSCI"], prereqs:[] },
    { code:"ENVSCI 150L", title:"Introduction to Climate Change", credits:3, difficulty:"Easy", type:["ENVSCI"], prereqs:[] },
    { code:"ENVSCI 179G", title:"First-Year Seminar in Sustainability", credits:4, difficulty:"Easy", type:["ENVSCI", "Seminar"], prereqs:[] },
    { code:"ENVSCI 185GL", title:"The Urban Ocean", credits:3, difficulty:"Easy", type:["ENVSCI"], prereqs:[] },
    { code:"ENVSCI 187S", title:"First Year Seminar in Environmental Science I", credits:2, difficulty:"Easy", type:["ENVSCI", "Seminar"], prereqs:[] },
    { code:"ENVSCI 188S", title:"First Year Seminar in Environmental Science II", credits:2, difficulty:"Easy", type:["ENVSCI", "Seminar"], prereqs:[] },
    { code:"ENVSCI 203", title:"Field Trips in Environmental Science", credits:3, difficulty:"Moderate", type:["ENVSCI"], prereqs:["ENVSCI 120"] },
    { code:"ENVSCI 210", title:"Earth's Dynamic Systems", credits:4, difficulty:"Moderate", type:["ENVSCI"], prereqs:["ENVSCI 120"] },
    { code:"ENVSCI 214GL", title:"Ecological Economics", credits:3, difficulty:"Easy", type:["ENVSCI"], prereqs:[] },
    { code:"ENVSCI 215", title:"Biology and Production: Aquaculture Nutrition", credits:3, difficulty:"Moderate", type:["ENVSCI"], prereqs:["ENVSCI 120"] },
    { code:"ENVSCI 216", title:"Sustainable Seaweed Aquaculture", credits:3, difficulty:"Moderate", type:["ENVSCI"], prereqs:["ENVSCI 120"] },
    { code:"ENVSCI 225", title:"Weather and Climate", credits:3, difficulty:"Moderate", type:["ENVSCI"], prereqs:["ENVSCI 120"] },
    { code:"ENVSCI 226", title:"Introduction to Oceanography", credits:3, difficulty:"Moderate", type:["ENVSCI"], prereqs:["ENVSCI 120"] },
    { code:"ENVSCI 256", title:"Health and Medical Geography", credits:3, difficulty:"Moderate", type:["ENVSCI"], prereqs:["ENVSCI 120"] },
    { code:"ENVSCI 260", title:"Global Environmental Change", credits:3, difficulty:"Moderate", type:["ENVSCI"], prereqs:["ENVSCI 120"] },
    { code:"ENVSCI 261", title:"Statistics for Environmental Science", credits:3, difficulty:"Moderate", type:["ENVSCI"], prereqs:["ENVSCI 120"] },
    { code:"ENVSCI 267L", title:"Introduction to Coastal Biological Systems", credits:3, difficulty:"Easy", type:["ENVSCI"], prereqs:[] },
    { code:"ENVSCI 270", title:"Cities and the Environment", credits:3, difficulty:"Moderate", type:["ENVSCI"], prereqs:["ENVSCI 120"] },
    { code:"ENVSCI 280", title:"Global Society and the Environment", credits:3, difficulty:"Moderate", type:["ENVSCI"], prereqs:["ENVSCI 120"] },
    { code:"ENVSCI 281", title:"Introduction to Geographic Information Systems", credits:4, difficulty:"Moderate", type:["ENVSCI", "GIS"], prereqs:["ENVSCI 120"] },
    { code:"ENVSCI 305", title:"Hydrology", credits:3, difficulty:"Moderate", type:["ENVSCI"], prereqs:["ENVSCI 120"] },
    { code:"ENVSCI 315L", title:"Introduction to Environmental Health", credits:3, difficulty:"Easy", type:["ENVSCI"], prereqs:[] },
    { code:"ENVSCI 316", title:"Coastal and Marine Pollution", credits:3, difficulty:"Moderate", type:["ENVSCI"], prereqs:["ENVSCI 120"] },
    { code:"ENVSCI 317", title:"Coastal and Marine Pollution Laboratory", credits:1, difficulty:"Moderate", type:["ENVSCI", "Lab"], prereqs:["ENVSCI 120"] },
    { code:"ENVSCI 318", title:"Environmental Toxicology", credits:3, difficulty:"Moderate", type:["ENVSCI"], prereqs:["ENVSCI 120"] },
    { code:"ENVSCI 321L", title:"Spiders of Nantucket", credits:4, difficulty:"Easy", type:["ENVSCI"], prereqs:[] },
    { code:"ENVSCI 324", title:"Coastal Zone Management", credits:3, difficulty:"Moderate", type:["ENVSCI"], prereqs:["ENVSCI 120"] },
    { code:"ENVSCI 325", title:"Introduction to Biological Oceanography", credits:3, difficulty:"Moderate", type:["ENVSCI"], prereqs:["ENVSCI 120"] },
    { code:"ENVSCI 327", title:"Coastal Geology", credits:3, difficulty:"Moderate", type:["ENVSCI"], prereqs:["ENVSCI 120"] },
    { code:"ENVSCI 336L", title:"Ecosystems Ecology", credits:3, difficulty:"Easy", type:["ENVSCI"], prereqs:[] },
    { code:"ENVSCI 340L", title:"Planning and Land Use Law", credits:3, difficulty:"Easy", type:["ENVSCI"], prereqs:[] },
    { code:"ENVSCI 341", title:"The Geochemistry of a Habitable Planet", credits:3, difficulty:"Moderate", type:["ENVSCI"], prereqs:["ENVSCI 120"] },
    { code:"ENVSCI 342", title:"Laboratory for the Geochemistry of a Habitable Planet", credits:1, difficulty:"Moderate", type:["ENVSCI", "Lab"], prereqs:["ENVSCI 120"] },
    { code:"ENVSCI 345L", title:"Natural Resources & Sustainability", credits:3, difficulty:"Easy", type:["ENVSCI"], prereqs:[] },
    { code:"ENVSCI 349L", title:"Economic Approaches to Environmental Problems", credits:3, difficulty:"Easy", type:["ENVSCI"], prereqs:[] },
    { code:"ENVSCI 350L", title:"Green Germany: Environmental Thought and Policy", credits:3, difficulty:"Easy", type:["ENVSCI", "Policy"], prereqs:[] },
    { code:"ENVSCI 359", title:"Wildlife Ecology", credits:3, difficulty:"Moderate", type:["ENVSCI"], prereqs:["ENVSCI 120"] },
    { code:"ENVSCI 368", title:"Social-Ecological Systems Dynamics", credits:3, difficulty:"Moderate", type:["ENVSCI"], prereqs:["ENVSCI 120"] },
    { code:"ENVSCI 372", title:"Introduction to Remote Sensing", credits:3, difficulty:"Moderate", type:["ENVSCI"], prereqs:["ENVSCI 120"] },
    { code:"ENVSCI 375L", title:"Urban Planning", credits:3, difficulty:"Easy", type:["ENVSCI"], prereqs:[] },
    { code:"ENVSCI 381", title:"GIS Applications and Spatial Databases", credits:4, difficulty:"Moderate", type:["ENVSCI", "GIS"], prereqs:["ENVSCI 120"] },
    { code:"ENVSCI 383", title:"Water Resources Management: Principles, practices, and problems.", credits:3, difficulty:"Moderate", type:["ENVSCI"], prereqs:["ENVSCI 120"] },
    { code:"ENVSCI 384", title:"Climate and Energy: Law, Policy, and Management", credits:3, difficulty:"Moderate", type:["ENVSCI", "Policy"], prereqs:["ENVSCI 120"] },
    { code:"ENVSCI 387", title:"Climate Change Adaptation Planning", credits:3, difficulty:"Moderate", type:["ENVSCI"], prereqs:["ENVSCI 120"] },
    { code:"ENVSCI 395L", title:"Immersive Field Trip: Exploring Individuals, Societies, and Natural Systems", credits:3, difficulty:"Easy", type:["ENVSCI"], prereqs:[] },
    { code:"ENVSCI 405", title:"Environmental Modeling", credits:3, difficulty:"Hard", type:["ENVSCI"], prereqs:["ENVSCI 120"] },
    { code:"ENVSCI 422", title:"Zooplankton Ecology", credits:3, difficulty:"Hard", type:["ENVSCI"], prereqs:["ENVSCI 120"] },
    { code:"ENVSCI 432", title:"Groundwater Hydrology", credits:3, difficulty:"Hard", type:["ENVSCI"], prereqs:["ENVSCI 120"] },
    { code:"ENVSCI 440", title:"Chemistry of Natural Waters", credits:3, difficulty:"Hard", type:["ENVSCI"], prereqs:["ENVSCI 120"] },
    { code:"ENVSCI 444", title:"Cooperative Education Field Experiences", credits:3, difficulty:"Hard", type:["ENVSCI", "Internship"], prereqs:["ENVSCI 120"] },
    { code:"ENVSCI 445", title:"Cooperative Education II", credits:3, difficulty:"Hard", type:["ENVSCI", "Internship"], prereqs:["ENVSCI 120"] },
    { code:"ENVSCI 450", title:"Physical Oceanography", credits:3, difficulty:"Hard", type:["ENVSCI"], prereqs:["ENVSCI 120"] },
    { code:"ENVSCI 462", title:"Geological Oceanography", credits:3, difficulty:"Hard", type:["ENVSCI"], prereqs:["ENVSCI 120"] },
    { code:"ENVSCI 470", title:"Ocean Biogeochemical Cycles", credits:3, difficulty:"Hard", type:["ENVSCI"], prereqs:["ENVSCI 120"] },
    { code:"ENVSCI 476", title:"Environmental Science Capstone", credits:3, difficulty:"Hard", type:["ENVSCI", "Capstone"], prereqs:["ENVSCI 260"] },
    { code:"ENVSCI 478", title:"Independent Study", credits:1, difficulty:"Hard", type:["ENVSCI"], prereqs:["ENVSCI 120"] },
    { code:"ENVSCI 480", title:"Special Topics", credits:3, difficulty:"Hard", type:["ENVSCI"], prereqs:["ENVSCI 120"] },
    { code:"ENVSCI 481", title:"Capstone Independent Study", credits:3, difficulty:"Hard", type:["ENVSCI", "Capstone"], prereqs:["ENVSCI 476"] },
    { code:"ENVSCI 498", title:"Honors in Environmental Science", credits:3, difficulty:"Hard", type:["ENVSCI", "Honors"], prereqs:["ENVSCI 120"] },
    { code:"ENVSCI 499", title:"Practicum", credits:3, difficulty:"Hard", type:["ENVSCI"], prereqs:["ENVSCI 120"] },

    { code:"ENVSTY 101", title:"The Nature of Environmental Problems", credits:3, difficulty:"Easy", type:["ENVSTY"], prereqs:[] },
    { code:"ENVSTY 102", title:"Introduction to Biomimicry", credits:3, difficulty:"Easy", type:["ENVSTY"], prereqs:[] },
    { code:"ENVSTY 111L", title:"Environmental Concerns and Chemical Solutions", credits:3, difficulty:"Easy", type:["ENVSTY"], prereqs:[] },
    { code:"ENVSTY 116L", title:"Quantitative Reasoning and the Environment", credits:3, difficulty:"Easy", type:["ENVSTY"], prereqs:[] },
    { code:"ENVSTY 120L", title:"Boston: Social Justice and the City", credits:3, difficulty:"Easy", type:["ENVSTY"], prereqs:[] },
    { code:"ENVSTY 130L", title:"Sustainable Urban Development in Local Contexts Globally", credits:3, difficulty:"Easy", type:["ENVSTY"], prereqs:[] },
    { code:"ENVSTY 150L", title:"Introduction to Climate Change", credits:3, difficulty:"Easy", type:["ENVSTY"], prereqs:[] },
    { code:"ENVSTY 179GL", title:"First-Year Seminar in the School for the Environment", credits:3, difficulty:"Easy", type:["ENVSTY", "Seminar"], prereqs:[] },
    { code:"ENVSTY 185GL", title:"The Urban Ocean", credits:3, difficulty:"Easy", type:["ENVSTY"], prereqs:[] },
    { code:"ENVSTY 210", title:"Second-Year Seminar: Conflict and Resolution", credits:1, difficulty:"Moderate", type:["ENVSTY", "Seminar"], prereqs:["ENVSTY 101"] },
    { code:"ENVSTY 222L", title:"Religion and the Environment: Global Stewardship and Practices of Faith Communities", credits:3, difficulty:"Easy", type:["ENVSTY"], prereqs:[] },
    { code:"ENVSTY 230", title:"Introduction to Sustainability", credits:3, difficulty:"Moderate", type:["ENVSTY"], prereqs:["ENVSTY 101"] },
    { code:"ENVSTY 267L", title:"Introduction to Coastal Biological Systems", credits:3, difficulty:"Easy", type:["ENVSTY"], prereqs:[] },
    { code:"ENVSTY 270GL", title:"Writing and the Environment", credits:3, difficulty:"Easy", type:["ENVSTY"], prereqs:[] },
    { code:"ENVSTY 280", title:"Special Topics in Environmental Studies", credits:3, difficulty:"Moderate", type:["ENVSTY"], prereqs:["ENVSTY 101"] },
    { code:"ENVSTY 301", title:"Internship in Environmental Studies", credits:1, difficulty:"Moderate", type:["ENVSTY", "Internship"], prereqs:["ENVSTY 101"] },
    { code:"ENVSTY 310", title:"Third-Year Seminar: Professional Development", credits:1, difficulty:"Moderate", type:["ENVSTY", "Seminar"], prereqs:["ENVSTY 230"] },
    { code:"ENVSTY 321L", title:"Spiders of Nantucket", credits:4, difficulty:"Easy", type:["ENVSTY"], prereqs:[] },
    { code:"ENVSTY 323", title:"Introduction to Permaculture", credits:3, difficulty:"Moderate", type:["ENVSTY"], prereqs:["ENVSTY 101"] },
    { code:"ENVSTY 331", title:"Feeding the Next Two Billion: Solutions for Food Security", credits:3, difficulty:"Moderate", type:["ENVSTY"], prereqs:["ENVSTY 101"] },
    { code:"ENVSTY 345L", title:"Environmental Communication", credits:3, difficulty:"Easy", type:["ENVSTY"], prereqs:[] },
    { code:"ENVSTY 350L", title:"Green Germany: Environmental Thought and Policy", credits:3, difficulty:"Easy", type:["ENVSTY", "Policy"], prereqs:[] },
    { code:"ENVSTY 351L", title:"Architecture and Human Built Environment Interactions", credits:3, difficulty:"Easy", type:["ENVSTY"], prereqs:[] },
    { code:"ENVSTY 356L", title:"Economic Development and Environmental Justice", credits:3, difficulty:"Easy", type:["ENVSTY"], prereqs:[] },
    { code:"ENVSTY 364L", title:"Environmental Justice", credits:3, difficulty:"Easy", type:["ENVSTY"], prereqs:[] },
    { code:"ENVSTY 371", title:"Telling the Story: broadcast multi-media communications about natural, built, and human environments", credits:3, difficulty:"Moderate", type:["ENVSTY"], prereqs:["ENVSTY 101"] },
    { code:"ENVSTY 380", title:"Special Topics in Environmental Studies", credits:3, difficulty:"Moderate", type:["ENVSTY"], prereqs:["ENVSTY 101"] },
    { code:"ENVSTY 395L", title:"Immersive Field Trip: Exploring Individuals, Societies, and Natural Systems", credits:3, difficulty:"Easy", type:["ENVSTY"], prereqs:[] },
    { code:"ENVSTY 401", title:"Environmental Problem Analysis and Policy Formulation", credits:3, difficulty:"Hard", type:["ENVSTY", "Policy"], prereqs:["ENVSTY 101"] },
    { code:"ENVSTY 410", title:"Fourth-Year Seminar: Environmental Issues", credits:1, difficulty:"Hard", type:["ENVSTY", "Seminar"], prereqs:["ENVSTY 310"] },
    { code:"ENVSTY 478", title:"Independent Study", credits:1, difficulty:"Easy", type:["ENVSTY"], prereqs:["ENVSTY 101"] },
    { code:"ENVSTY 479", title:"Independent Study", credits:1, difficulty:"Easy", type:["ENVSTY"], prereqs:["ENVSTY 101"] },
    { code:"ENVSTY 481L", title:"Introduction to Environmental Management and Clean Energy", credits:3, difficulty:"Easy", type:["ENVSTY"], prereqs:[] },

    { code:"UPCD 120L", title:"Boston: Social Justice and the City", credits:3, difficulty:"Easy", type:["UPCD"], prereqs:[] },
    { code:"UPCD 130L", title:"Sustainable Urban Development in Local Contexts Globally", credits:3, difficulty:"Easy", type:["UPCD"], prereqs:[] },
    { code:"UPCD 179GL", title:"First-Year Seminar in the School for the Environment", credits:3, difficulty:"Easy", type:["UPCD", "Seminar"], prereqs:[] },
    { code:"UPCD 201", title:"History and Theory of Community Development", credits:3, difficulty:"Moderate", type:["UPCD"], prereqs:["UPCD 201"] },
    { code:"UPCD 210", title:"Community Health and Environment", credits:3, difficulty:"Moderate", type:["UPCD"], prereqs:["UPCD 201"] },
    { code:"UPCD 280", title:"Lower Level Special Topics in Community Development", credits:3, difficulty:"Moderate", type:["UPCD"], prereqs:["UPCD 201"] },
    { code:"UPCD 301", title:"Introduction to Research Methods and Community Analysis", credits:3, difficulty:"Moderate", type:["UPCD"], prereqs:["UPCD 201"] },
    { code:"UPCD 303", title:"Quantitative Methods for Community Development", credits:3, difficulty:"Moderate", type:["UPCD"], prereqs:["UPCD 201"] },
    { code:"UPCD 315L", title:"Introduction to Environmental Health", credits:3, difficulty:"Easy", type:["UPCD"], prereqs:[] },
    { code:"UPCD 321", title:"Fundamentals of Housing", credits:3, difficulty:"Moderate", type:["UPCD"], prereqs:["UPCD 201"] },
    { code:"UPCD 340L", title:"Planning and Land Use Law", credits:3, difficulty:"Easy", type:["UPCD"], prereqs:[] },
    { code:"UPCD 351L", title:"Architecture and Human Built Environment Interactions", credits:3, difficulty:"Easy", type:["UPCD"], prereqs:[] },
    { code:"UPCD 353L", title:"Community Economic Development in the U.S.: Class, Race, Ethnicity", credits:3, difficulty:"Easy", type:["UPCD"], prereqs:[] },
    { code:"UPCD 356L", title:"Economic Development and Environmental Justice", credits:3, difficulty:"Easy", type:["UPCD"], prereqs:[] },
    { code:"UPCD 364L", title:"Environmental Justice", credits:3, difficulty:"Easy", type:["UPCD"], prereqs:[] },
    { code:"UPCD 371", title:"Organizational Behavior for Public and Nonprofit Organizations", credits:3, difficulty:"Moderate", type:["UPCD"], prereqs:["UPCD 201"] },
    { code:"UPCD 375L", title:"Urban Planning", credits:3, difficulty:"Easy", type:["UPCD"], prereqs:[] },
    { code:"UPCD 380", title:"Upper Level Special Topics in Community Development", credits:3, difficulty:"Moderate", type:["UPCD"], prereqs:["UPCD 201"] },
    { code:"UPCD 457", title:"Internship in Community Development", credits:3, difficulty:"Hard", type:["UPCD", "Internship"], prereqs:["UPCD 201"] },
    { code:"UPCD 459", title:"Capstone in Community Development", credits:3, difficulty:"Hard", type:["UPCD", "Capstone"], prereqs:["UPCD 301"] },
    { code:"UPCD 478", title:"Independent Study in Community Development", credits:1, difficulty:"Moderate", type:["UPCD"], prereqs:["UPCD 201"] },
    { code:"UPCD 498", title:"Honors in Community Development", credits:3, difficulty:"Hard", type:["UPCD", "Honors"], prereqs:["UPCD 201"] },

    { code:"USEA 100", title:"Boating Basics", credits:2, difficulty:"Easy", type:["USEA"], prereqs:[] },
    { code:"USEA 106", title:"Underwater Research Methods Using SCUBA", credits:2, difficulty:"Easy", type:["USEA"], prereqs:[] },

  
  {code:"AFRSTY 100", title:"Introduction to African-American Literature", credits:3, difficulty:"Moderate", type:["AFRSTY"], prereqs:[]},
  {code:"AFRSTY 101", title:"Introduction to Africana Studies", credits:3, difficulty:"Moderate", type:["AFRSTY"], prereqs:[] },
  {code:"AFRSTY 108", title:"African-American Social Movements", credits:3, difficulty:"Moderate", type:["AFRSTY"], prereqs:[]},
  {code:"AFRSTY 110", title:"African-American History I", credits:3, difficulty:"Moderate", type:["AFRSTY"], prereqs:[] },
  {code:"AFRSTY 111", title:"African-American History II", credits:3, difficulty:"Moderate", type:["AFRSTY"], prereqs:[] },
  {code:"AFRSTY 113", title:"Islam and the African World", credits:3, difficulty:"Moderate", type:["AFRSTY"], prereqs:[]},
  {code:"AFRSTY 115G", title:"Black Consciousness", credits:4, difficulty:"Moderate", type:["AFRSTY"], prereqs:[]},
  {code:"AFRSTY 122", title:"Black Cinema: American Myth, Racial Ideology, and Hollywood", credits:3, difficulty:"Moderate", type:["AFRSTY"], prereqs:[]},
  {code:"AFRSTY 141", title:"Haitian Creole I for Beginners", credits:3, difficulty:"Moderate", type:["AFRSTY"], prereqs:[]},
  {code:"AFRSTY 142", title:"Cape Verdean Language I for Beginners", credits:3, difficulty:"Moderate", type:["AFRSTY"], prereqs:[]},
  {code:"AFRSTY 150", title:"African Images in Literature", credits:3, difficulty:"Moderate", type:["AFRSTY"], prereqs:[]},
  {code:"AFRSTY 200", title:"Living While Black: Contemporary Issues in the African Diaspora", credits:3, difficulty:"Moderate", type:["AFRSTY"], prereqs:[]},
  {code:"AFRSTY 225", title:"The Origins of Caribbean Civilizations", credits:3, difficulty:"Moderate", type:["AFRSTY"], prereqs:[]},
  {code:"AFRSTY 230", title:"African-American Women's History", credits:3, difficulty:"Moderate", type:["AFRSTY"], prereqs:[]},
  {code:"AFRSTY 241", title:"Haitian Creole II for Intermediate Learners", credits:3, difficulty:"Moderate", type:["AFRSTY"], prereqs:[]},
  {code:"AFRSTY 250", title:"The Civil Rights Movement", credits:3, difficulty:"Moderate", type:["AFRSTY"], prereqs:[]},
  {code:"AFRSTY 251L", title:"African-American Art", credits:3, difficulty:"Moderate", type:["AFRSTY"], prereqs:[]},
  {code:"AFRSTY 270", title:"The Black Image on Stage and Screen", credits:3, difficulty:"Moderate", type:["AFRSTY"], prereqs:[]},
  {code:"AFRSTY 280", title:"Special Topics in Africana Studies", credits:3, difficulty:"Moderate", type:["AFRSTY"], prereqs:[]},
  {code:"AFRSTY 292G", title:"African Caribbean Literature", credits:3, difficulty:"Moderate", type:["AFRSTY"], prereqs:[]},
  {code:"AFRSTY 300L", title:"Women in African Cultures", credits:3, difficulty:"Moderate", type:["AFRSTY"], prereqs:[]},
  {code:"AFRSTY 301", title:"African-American Intellectual Thought", credits:3, difficulty:"Moderate", type:["AFRSTY"], prereqs:[]},
  {code:"AFRSTY 308", title:"Africana Feminisms in the Black Diaspora", credits:3, difficulty:"Moderate", type:["AFRSTY"], prereqs:[]},
  {code:"AFRSTY 310", title:"Modern Caribbean Society", credits:3, difficulty:"Moderate", type:["AFRSTY"], prereqs:[]},
  {code:"AFRSTY 320", title:"Problems in Urban Education", credits:3, difficulty:"Moderate", type:["AFRSTY"], prereqs:[]},
  {code:"AFRSTY 326L", title:"Multiracial Experiences", credits:3, difficulty:"Moderate", type:["AFRSTY"], prereqs:[]},
  {code:"AFRSTY 341", title:"Haitian Creole III for Advanced Learners", credits:3, difficulty:"Moderate", type:["AFRSTY"], prereqs:[]},
  {code:"AFRSTY 343L", title:"African Diaspora Archaeology: Uncovering Roots, Routes, and Resistance", credits:3, difficulty:"Moderate", type:["AFRSTY"], prereqs:[]},
  {code:"AFRSTY 350L", title:"Race, Class, and Gender: Issues in US Diversity", credits:3, difficulty:"Moderate", type:["AFRSTY"], prereqs:[]},
  {code:"AFRSTY 352L", title:"Harlem Renaissance", credits:3, difficulty:"Moderate", type:["AFRSTY"], prereqs:[]},
  {code:"AFRSTY 355L", title:"Black Popular Culture", credits:3, difficulty:"Moderate", type:["AFRSTY"], prereqs:[]},
  {code:"AFRSTY 440", title:"Post-Colonial Literature: Africa and the Caribbean", credits:3, difficulty:"Moderate", type:["AFRSTY"], prereqs:[]},
  {code:"AFRSTY 441", title:"Techniques of Haitian Creole Translation", credits:3, difficulty:"Moderate", type:["AFRSTY"], prereqs:[]},
  {code:"AFRSTY 478", title:"Independent Study", credits:1, difficulty:"Moderate", type:["AFRSTY"], prereqs:[]},
  {code:"AFRSTY 479", title:"Independent Study", credits:1, difficulty:"Moderate", type:["AFRSTY"], prereqs:[]},
  {code:"AFRSTY 480", title:"Topics in Africana Studies", credits:3, difficulty:"Moderate", type:["AFRSTY"], prereqs:[]},
  
  {code:"AMST 100", title:"American Identities", credits:3, difficulty:"Moderate", type:["AMST"], prereqs:[] },
  {code:"AMST 101", title:"Popular Culture in America", credits:3, difficulty:"Moderate", type:["AMST"], prereqs:[] },
  {code:"AMST 110G", title:"US Society and Culture since 1945", credits:4, difficulty:"Moderate", type:["AMST"], prereqs:[] },
  {code:"AMST 200", title:"Special Topics", credits:3, difficulty:"Moderate", type:["AMST"], prereqs:[]},
  {code:"AMST 201L", title:"Imagining Latinidad: Historical Trajectories and Everyday Lives", credits:3, difficulty:"Moderate", type:["AMST"], prereqs:[]},
  {code:"AMST 203", title:"The Thirties", credits:3, difficulty:"Moderate", type:["AMST"], prereqs:[]},
  {code:"AMST 206", title:"The Sixties", credits:3, difficulty:"Moderate", type:["AMST"], prereqs:[]},
  {code:"AMST 209", title:"The 1990s", credits:3, difficulty:"Moderate", type:["AMST"], prereqs:[]},
  {code:"AMST 210", title:"American Society and Culture, 1600-1860", credits:3, difficulty:"Moderate", type:["AMST"], prereqs:[]},
  {code:"AMST 211", title:"U.S. Society and Culture, 1860-1940", credits:3, difficulty:"Moderate", type:["AMST"], prereqs:[]},
  {code:"AMST 212G", title:"The US in the Eighties", credits:3, difficulty:"Moderate", type:["AMST"], prereqs:[]},
  {code:"AMST 217", title:"American Superheroes", credits:3, difficulty:"Moderate", type:["AMST"], prereqs:[]},
  {code:"AMST 223L", title:"Asians in the United States", credits:3, difficulty:"Moderate", type:["AMST"], prereqs:[]},
  {code:"AMST 225L", title:"Southeast Asians in the United States", credits:3, difficulty:"Moderate", type:["AMST"], prereqs:[]},
  {code:"AMST 228L", title:"Asian Women in the United States", credits:3, difficulty:"Moderate", type:["AMST"], prereqs:[]},
  {code:"AMST 235", title:"The Social History of Popular Music", credits:3, difficulty:"Moderate", type:["AMST"], prereqs:[]},
  {code:"AMST 240G", title:"War in American Culture", credits:3, difficulty:"Moderate", type:["AMST"], prereqs:[]},
  {code:"AMST 263", title:"The History of Hip Hop and Hip Hop as History", credits:3, difficulty:"Moderate", type:["AMST"], prereqs:[]},
  {code:"AMST 268L", title:"The Italian-American Experience", credits:3, difficulty:"Moderate", type:["AMST"], prereqs:[]},
  {code:"AMST 270L", title:"Native Peoples of North America", credits:3, difficulty:"Moderate", type:["AMST"], prereqs:[]},
  {code:"AMST 278L", title:"U.S. Documentary Photography", credits:3, difficulty:"Moderate", type:["AMST"], prereqs:[]},
  {code:"AMST 285L", title:"Food in American Culture", credits:3, difficulty:"Moderate", type:["AMST"], prereqs:[]},
  {code:"AMST 310", title:"Television in American Life", credits:3, difficulty:"Moderate", type:["AMST"], prereqs:[]},
  {code:"AMST 311L", title:"American Oral History", credits:3, difficulty:"Moderate", type:["AMST"], prereqs:[]},
  {code:"AMST 315L", title:"Asian American Cinema", credits:3, difficulty:"Moderate", type:["AMST"], prereqs:[]},
  {code:"AMST 325L", title:"Sexual Identities in American Culture", credits:3, difficulty:"Moderate", type:["AMST"], prereqs:[]},
  {code:"AMST 335", title:"Music And Politics", credits:3, difficulty:"Moderate", type:["AMST"], prereqs:[]},
  {code:"AMST 343L", title:"The Cultural Politics of HIV/AIDS", credits:3, difficulty:"Moderate", type:["AMST"], prereqs:[]},
  {code:"AMST 349L", title:"The Cold War: Rise and Fall", credits:3, difficulty:"Moderate", type:["AMST"], prereqs:[]},
  {code:"AMST 350L", title:"Race, Class, and Gender: Issues in US Diversity", credits:3, difficulty:"Moderate", type:["AMST"], prereqs:[]},
  {code:"AMST 352L", title:"Harlem Renaissance", credits:3, difficulty:"Moderate", type:["AMST"], prereqs:[]},
  {code:"AMST 353L", title:"Borderlands, Diasporas, and Transnational Identities", credits:3, difficulty:"Moderate", type:["AMST"], prereqs:[]},
  {code:"AMST 355L", title:"Black Popular Culture", credits:3, difficulty:"Moderate", type:["AMST"], prereqs:[]},
  {code:"AMST 360", title:"Work, Society, and Culture in Modern America", credits:3, difficulty:"Moderate", type:["AMST"], prereqs:[]},
  {code:"AMST 372L", title:"American Women Writers and American Culture", credits:3, difficulty:"Moderate", type:["AMST"], prereqs:[]},
  {code:"AMST 375", title:"Best Sellers in American Society", credits:3, difficulty:"Moderate", type:["AMST"], prereqs:[]},
  {code:"AMST 376L", title:"Women of Color", credits:3, difficulty:"Moderate", type:["AMST"], prereqs:[]},
  {code:"AMST 380", title:"Kennedys Of Boston", credits:3, difficulty:"Moderate", type:["AMST"], prereqs:[]},
  {code:"AMST 383L", title:"Masculinities", credits:3, difficulty:"Moderate", type:["AMST"], prereqs:[]},
  {code:"AMST 394L", title:"Radical Voices of Resistance: Gender, Race and US Social Movements", credits:3, difficulty:"Moderate", type:["AMST"], prereqs:[]},
  {code:"AMST 402L", title:"History of US Visual Media", credits:3, difficulty:"Moderate", type:["AMST"], prereqs:[]},
  {code:"AMST 405", title:"The Immigrant Experience", credits:3, difficulty:"Moderate", type:["AMST"], prereqs:[]},
  {code:"AMST 411L", title:"Post 9/11 Culture: Rumors, Stories and Songs", credits:3, difficulty:"Moderate", type:["AMST"], prereqs:[]},
  {code:"AMST 430", title:"Music & Amer Lit", credits:3, difficulty:"Moderate", type:["AMST"], prereqs:[]},
  {code:"AMST 440L", title:"United States in a Global Context", credits:3, difficulty:"Moderate", type:["AMST"], prereqs:[]},
  {code:"AMST 470L", title:"New England Literature and Culture", credits:3, difficulty:"Moderate", type:["AMST"], prereqs:[]},
  {code:"AMST 471L", title:"The City in American Literature and Culture", credits:3, difficulty:"Moderate", type:["AMST"], prereqs:[]},
  {code:"AMST 476L", title:"Current Issues in Native America", credits:3, difficulty:"Moderate", type:["AMST"], prereqs:[]},
  {code:"AMST 478", title:"Independent Study", credits:1, difficulty:"Moderate", type:["AMST"], prereqs:[]},
  {code:"AMST 479", title:"Independent Study", credits:1, difficulty:"Moderate", type:["AMST"], prereqs:[]},
  {code:"AMST 490", title:"Internship in American Studies", credits:3, difficulty:"Moderate", type:["AMST"], prereqs:[]},
  {code:"AMST 498", title:"Honors", credits:1, difficulty:"Moderate", type:["AMST"], prereqs:[]},
  {code:"AMST 499", title:"Honors II", credits:3, difficulty:"Moderate", type:["AMST"], prereqs:[]},

  {code:"ANTH 105", title:"Introduction to Biological Anthropology", credits:3, difficulty:"Moderate", type:["ANTH"], prereqs:[] },
  {code:"ANTH 106", title:"Introduction to Cultural Anthropology", credits:3, difficulty:"Moderate", type:["ANTH"], prereqs:[] },
  {code:"ANTH 107", title:"Intro To Archaeology", credits:3, difficulty:"Moderate", type:["ANTH"], prereqs:[]},
  {code:"ANTH 112G", title:"Understanding Human Behavior", credits:4, difficulty:"Moderate", type:["ANTH"], prereqs:[]},
  {code:"ANTH 113G", title:"Food and Society", credits:4, difficulty:"Moderate", type:["ANTH"], prereqs:[]},
  {code:"ANTH 120L", title:"Sports and Inequality: Race, Class, Gender, and the Labor of Sweat", credits:3, difficulty:"Moderate", type:["ANTH"], prereqs:[]},
  {code:"ANTH 210L", title:"Labor and Working Class History in the United States", credits:3, difficulty:"Moderate", type:["ANTH"], prereqs:[]},
  {code:"ANTH 211", title:"Human Origins", credits:3, difficulty:"Moderate", type:["ANTH"], prereqs:[]},
  {code:"ANTH 220G", title:"Indigenous Peoples and Cultural Change in Amazonia", credits:3, difficulty:"Moderate", type:["ANTH"], prereqs:[]},
  {code:"ANTH 223G", title:"Afro-Caribbean Religions", credits:3, difficulty:"Moderate", type:["ANTH"], prereqs:[]},
  {code:"ANTH 224G", title:"The Rise and Fall of the Maya", credits:3, difficulty:"Moderate", type:["ANTH"], prereqs:[]},
  {code:"ANTH 230", title:"Archaeological Myth & Mystery", credits:3, difficulty:"Moderate", type:["ANTH"], prereqs:[]},
  {code:"ANTH 232", title:"The Viking World", credits:3, difficulty:"Moderate", type:["ANTH"], prereqs:[]},
  {code:"ANTH 238", title:"Anthropology Proseminar / Elective", credits:3, difficulty:"Moderate", type:["ANTH"], prereqs:[]},
  {code:"ANTH 312", title:"Anthropology Upper-Level Elective", credits:3, difficulty:"Hard", type:["ANTH"], prereqs:[]},
  {code:"ANTH 313", title:"Anthropology Upper-Level Elective", credits:3, difficulty:"Hard", type:["ANTH"], prereqs:[]},
  {code:"ANTH 240L", title:"Work, Environment, and Revolution in Latin America", credits:3, difficulty:"Moderate", type:["ANTH"], prereqs:[]},
  {code:"ANTH 243L", title:"Rethinking the Family: Cross-Cultural Perspectives", credits:3, difficulty:"Moderate", type:["ANTH"], prereqs:[]},
  {code:"ANTH 247", title:"Ancient Cities & States", credits:3, difficulty:"Moderate", type:["ANTH"], prereqs:[]},
  {code:"ANTH 250L", title:"The Hands that Feed Us: Food, Labor, Race, and Migration in the U.S.", credits:3, difficulty:"Moderate", type:["ANTH"], prereqs:[]},
  {code:"ANTH 256", title:"Anthropology of Mass Violence", credits:3, difficulty:"Moderate", type:["ANTH"], prereqs:[]},
  {code:"ANTH 260", title:"Anthropology On Film", credits:3, difficulty:"Moderate", type:["ANTH"], prereqs:[]},
  {code:"ANTH 262", title:"Dreams & Dreaming", credits:3, difficulty:"Moderate", type:["ANTH"], prereqs:[]},
  {code:"ANTH 263", title:"Environmental Anthropology", credits:3, difficulty:"Moderate", type:["ANTH"], prereqs:[]},
  {code:"ANTH 264", title:"Shamanisms: Anthropological Perspectives", credits:3, difficulty:"Moderate", type:["ANTH"], prereqs:[]},
  {code:"ANTH 268", title:"Wine and Culture: An Anthropological Perspective", credits:3, difficulty:"Moderate", type:["ANTH"], prereqs:[]},
  {code:"ANTH 269L", title:"Anthropology of the Objects and the Objectified: an Interdisciplinary Approach to Things", credits:3, difficulty:"Moderate", type:["ANTH"], prereqs:[]},
  {code:"ANTH 270L", title:"Native Peoples of North America", credits:3, difficulty:"Moderate", type:["ANTH"], prereqs:[]},
  {code:"ANTH 272", title:"Peoples and Cultures of Africa", credits:3, difficulty:"Moderate", type:["ANTH"], prereqs:[]},
  {code:"ANTH 273", title:"Peoples and Cultures of Mesoamerica (Mexico and Guatemala)", credits:3, difficulty:"Moderate", type:["ANTH"], prereqs:[]},
  {code:"ANTH 274", title:"Peoples and Cultures of the Caribbean", credits:3, difficulty:"Moderate", type:["ANTH"], prereqs:[]},
  {code:"ANTH 275L", title:"Peoples and Cultures of China", credits:3, difficulty:"Moderate", type:["ANTH"], prereqs:[]},
  {code:"ANTH 277", title:"US Immigration: Contemporary Issues and Debates", credits:3, difficulty:"Moderate", type:["ANTH"], prereqs:[]},
  {code:"ANTH 278L", title:"Introduction to Native American and Indigenous Studies", credits:3, difficulty:"Moderate", type:["ANTH"], prereqs:[]},
  {code:"ANTH 279", title:"Peoples and Cultures of the Andes: Colombia, Ecuador, Peru, Bolivia, Chile", credits:3, difficulty:"Moderate", type:["ANTH"], prereqs:[]},
  {code:"ANTH 295L", title:"Introduction to Human Rights", credits:3, difficulty:"Moderate", type:["ANTH"], prereqs:[]},
  {code:"ANTH 314", title:"Forensic Anthropology", credits:3, difficulty:"Moderate", type:["ANTH"], prereqs:[]},
  {code:"ANTH 316", title:"Nutrition, Growth and Behavior", credits:3, difficulty:"Moderate", type:["ANTH"], prereqs:[]},
  {code:"ANTH 317", title:"Human Epidemiology", credits:3, difficulty:"Moderate", type:["ANTH"], prereqs:[]},
  {code:"ANTH 324", title:"A Biocultural Approach to War", credits:3, difficulty:"Moderate", type:["ANTH"], prereqs:[]},
  {code:"ANTH 330", title:"Archaeology of colonialism in Native North America", credits:3, difficulty:"Moderate", type:["ANTH"], prereqs:[]},
  {code:"ANTH 333L", title:"Indigenous and Colonial Heritage in Popular Music", credits:3, difficulty:"Moderate", type:["ANTH"], prereqs:[]},
  {code:"ANTH 340", title:"Historical Archaeology", credits:3, difficulty:"Moderate", type:["ANTH"], prereqs:[]},
  {code:"ANTH 341", title:"Archaeological Method and Theory with Laboratory", credits:3, difficulty:"Moderate", type:["ANTH"], prereqs:[]},
  {code:"ANTH 343L", title:"African Diaspora Archaeology: Uncovering Roots, Routes, and Resistance", credits:3, difficulty:"Moderate", type:["ANTH"], prereqs:[]},
  {code:"ANTH 345", title:"Theory in Sociocultural Anthropology", credits:3, difficulty:"Moderate", type:["ANTH"], prereqs:[]},
  {code:"ANTH 346", title:"Culture, Globalization, and the Environment", credits:3, difficulty:"Moderate", type:["ANTH"], prereqs:[]},
  {code:"ANTH 347L", title:"Indigenous Research Methodologies", credits:3, difficulty:"Moderate", type:["ANTH"], prereqs:[]},
  {code:"ANTH 348", title:"Ethnographic Inquiry: Introduction to Qualitative Field Research", credits:3, difficulty:"Moderate", type:["ANTH"], prereqs:[]},
  {code:"ANTH 352", title:"Applied Social Anthropology", credits:3, difficulty:"Moderate", type:["ANTH"], prereqs:[]},
  {code:"ANTH 353", title:"Urban Anthropology", credits:3, difficulty:"Moderate", type:["ANTH"], prereqs:[]},
  {code:"ANTH 356", title:"African Diaspora Art in the City", credits:3, difficulty:"Moderate", type:["ANTH"], prereqs:[]},
  {code:"ANTH 357", title:"Culture, Disease, and Healing", credits:3, difficulty:"Moderate", type:["ANTH"], prereqs:[]},
  {code:"ANTH 358", title:"Social Determinants of Health and Health Disparities", credits:3, difficulty:"Moderate", type:["ANTH"], prereqs:[]},
  {code:"ANTH 359", title:"Economies and cultures in comparative perspective", credits:3, difficulty:"Moderate", type:["ANTH"], prereqs:[]},
  {code:"ANTH 361L", title:"Indigenous Film and Critical Visual Studies", credits:3, difficulty:"Moderate", type:["ANTH"], prereqs:[]},
  {code:"ANTH 364", title:"Anthropology of Adolescence: Biocultural Interactions", credits:3, difficulty:"Moderate", type:["ANTH"], prereqs:[]},
  {code:"ANTH 366", title:"The Anthropology of Religion", credits:3, difficulty:"Moderate", type:["ANTH"], prereqs:[]},
  {code:"ANTH 367", title:"Social and Cultural Perspectives on Witchcraft and Sorcery", credits:3, difficulty:"Moderate", type:["ANTH"], prereqs:[]},
  {code:"ANTH 368", title:"Myth in Cultural Context", credits:3, difficulty:"Moderate", type:["ANTH"], prereqs:[]},
  {code:"ANTH 372", title:"Anthropology of Death", credits:3, difficulty:"Moderate", type:["ANTH"], prereqs:[]},
  {code:"ANTH 385", title:"Language and Culture", credits:3, difficulty:"Moderate", type:["ANTH"], prereqs:[]},
  {code:"ANTH 412", title:"Issues in Biological Anthropology", credits:3, difficulty:"Moderate", type:["ANTH"], prereqs:[]},
  {code:"ANTH 425", title:"Contemporary Issues in Anthropology", credits:3, difficulty:"Moderate", type:["ANTH"], prereqs:[]},
  {code:"ANTH 444", title:"Cooperative Education for Anthropology Majors", credits:3, difficulty:"Moderate", type:["ANTH"], prereqs:[]},
  {code:"ANTH 476L", title:"Current Issues in Native America", credits:3, difficulty:"Moderate", type:["ANTH"], prereqs:[]},
  {code:"ANTH 477L", title:"LLOP Research Seminar", credits:3, difficulty:"Moderate", type:["ANTH"], prereqs:[]},
  {code:"ANTH 478", title:"Directed Study I", credits:1, difficulty:"Moderate", type:["ANTH"], prereqs:[]},
  {code:"ANTH 479", title:"Directed Study II", credits:1, difficulty:"Moderate", type:["ANTH"], prereqs:[]},
  {code:"ANTH 485", title:"Field Research in Archaeology", credits:3, difficulty:"Moderate", type:["ANTH"], prereqs:[]},
  {code:"ANTH 488", title:"Internship in Anthropology", credits:3, difficulty:"Moderate", type:["ANTH"], prereqs:[]},
  {code:"ANTH 490", title:"Independent Rsrch I", credits:3, difficulty:"Moderate", type:["ANTH"], prereqs:[]},
  {code:"ANTH 491", title:"Independent Research II", credits:3, difficulty:"Moderate", type:["ANTH"], prereqs:[]},

  {code:"ARABIC 101", title:"Elementary Arabic I", credits:4, difficulty:"Moderate", type:["ARABIC"], prereqs:[] },
  {code:"ARABIC 102", title:"Elementary Arabic II", credits:4, difficulty:"Moderate", type:["ARABIC"], prereqs:[] },
  {code:"ARABIC 201", title:"Intermediate Arabic I", credits:4, difficulty:"Moderate", type:["ARABIC"], prereqs:[]},
  {code:"ARABIC 202", title:"Intermediate Arabic II", credits:4, difficulty:"Moderate", type:["ARABIC"], prereqs:[]},
  {code:"ARABIC 252L", title:"Global Refugee Narratives", credits:3, difficulty:"Moderate", type:["ARABIC"], prereqs:[]},
  {code:"ARABIC 260L", title:"Imagining the Modern Middle East", credits:3, difficulty:"Moderate", type:["ARABIC"], prereqs:[]},
  {code:"ARABIC 290", title:"Special Topics", credits:3, difficulty:"Moderate", type:["ARABIC"], prereqs:[]},
  {code:"ARABIC 320", title:"Modern Arabic Literature", credits:3, difficulty:"Moderate", type:["ARABIC"], prereqs:[]},
  {code:"ARABIC 378", title:"Independent Study", credits:1, difficulty:"Moderate", type:["ARABIC"], prereqs:[]},
  {code:"ARABIC 379", title:"Independent Study", credits:1, difficulty:"Moderate", type:["ARABIC"], prereqs:[]},
  {code:"ARABIC 478", title:"Readings and Research", credits:1, difficulty:"Moderate", type:["ARABIC"], prereqs:[]},
  {code:"ARABIC 479", title:"Readings and Research", credits:1, difficulty:"Moderate", type:["ARABIC"], prereqs:[]},

  {code:"ART 100", title:"The Language of Art", credits:3, difficulty:"Moderate", type:["ART"], prereqs:[] },
  {code:"ART 101", title:"Ancient and Medieval Art", credits:3, difficulty:"Moderate", type:["ART"], prereqs:[]},
  {code:"ART 102", title:"Renaissance to Modern Art", credits:3, difficulty:"Moderate", type:["ART"], prereqs:[]},
  {code:"ART 104L", title:"Introduction to East Asian Art", credits:3, difficulty:"Moderate", type:["ART"], prereqs:[]},
  {code:"ART 199", title:"Visual Thinking", credits:3, difficulty:"Moderate", type:["ART"], prereqs:[]},
  {code:"ART 208", title:"Introduction to Contemporary Practices in Fiber Art", credits:3, difficulty:"Moderate", type:["ART"], prereqs:[]},
  {code:"ART 210", title:"Special Topics", credits:3, difficulty:"Moderate", type:["ART"], prereqs:[]},
  {code:"ART 212L", title:"Traditional Japanese Architecture", credits:3, difficulty:"Moderate", type:["ART"], prereqs:[]},
  {code:"ART 213L", title:"The Art of Editing ", credits:3, difficulty:"Moderate", type:["ART"], prereqs:[]},
  {code:"ART 220", title:"Introduction to Graphic Design", credits:3, difficulty:"Moderate", type:["ART"], prereqs:[] },
  {code:"ART 222", title:"Survey of American Art", credits:3, difficulty:"Moderate", type:["ART"], prereqs:[]},
  {code:"ART 224", title:"Museum Practices", credits:3, difficulty:"Moderate", type:["ART"], prereqs:[]},
  {code:"ART 230", title:"Architecture, Design, and Society", credits:3, difficulty:"Moderate", type:["ART"], prereqs:[]},
  {code:"ART 235", title:"History of Global Design", credits:3, difficulty:"Moderate", type:["ART"], prereqs:[]},
  {code:"ART 245", title:"Great Directors", credits:3, difficulty:"Moderate", type:["ART"], prereqs:[]},
  {code:"ART 250", title:"Art of the Twentieth Century", credits:3, difficulty:"Moderate", type:["ART"], prereqs:[]},
  {code:"ART 251L", title:"African-American Art", credits:3, difficulty:"Moderate", type:["ART"], prereqs:[]},
  {code:"ART 252", title:"American Art in Boston", credits:3, difficulty:"Moderate", type:["ART"], prereqs:[]},
  {code:"ART 256", title:"The Arts of Japan", credits:3, difficulty:"Moderate", type:["ART"], prereqs:[]},
  {code:"ART 258", title:"The Arts of China", credits:3, difficulty:"Moderate", type:["ART"], prereqs:[]},
  {code:"ART 262L", title:"Greek Art and Architecture", credits:3, difficulty:"Moderate", type:["ART"], prereqs:[]},
  {code:"ART 269L", title:"Anthropology of the Objects and the Objectified: an Interdisciplinary Approach to Things", credits:3, difficulty:"Moderate", type:["ART"], prereqs:[]},
  {code:"ART 278L", title:"U.S. Documentary Photography", credits:3, difficulty:"Moderate", type:["ART"], prereqs:[]},
  {code:"ART 281", title:"Drawing I", credits:3, difficulty:"Moderate", type:["ART"], prereqs:[]},
  {code:"ART 283", title:"Introduction to the Materials, Techniques and Concepts of Painting", credits:3, difficulty:"Moderate", type:["ART"], prereqs:[]},
  {code:"ART 286", title:"Materials, Processes, and Ideas: Introduction to Contemporary Sculptural Practices", credits:3, difficulty:"Moderate", type:["ART"], prereqs:[]},
  {code:"ART 287", title:"Introduction to Printmaking", credits:3, difficulty:"Moderate", type:["ART"], prereqs:[]},
  {code:"ART 293L", title:"Photography I", credits:3, difficulty:"Moderate", type:["ART"], prereqs:[]},
  {code:"ART 295L", title:"Introduction to Video", credits:3, difficulty:"Moderate", type:["ART"], prereqs:[]},
  {code:"ART 297", title:"Introduction to Digital Media Art", credits:3, difficulty:"Moderate", type:["ART"], prereqs:[]},
  {code:"ART 305", title:"Early Medieval Art", credits:3, difficulty:"Moderate", type:["ART"], prereqs:[]},
  {code:"ART 306", title:"Romanesque and Gothic Art", credits:3, difficulty:"Moderate", type:["ART"], prereqs:[]},
  {code:"ART 309", title:"Northern Renaissance Art", credits:3, difficulty:"Moderate", type:["ART"], prereqs:[]},
  {code:"ART 310", title:"Special Topics", credits:3, difficulty:"Moderate", type:["ART"], prereqs:[]},
  {code:"ART 311", title:"Early Italian Renaissance Art", credits:3, difficulty:"Moderate", type:["ART"], prereqs:[]},
  {code:"ART 312", title:"Late Italian Renaissance Art", credits:3, difficulty:"Moderate", type:["ART"], prereqs:[]},
  {code:"ART 313L", title:"The Art of Early Modern Venice: Myths and Realities of a Floating City", credits:3, difficulty:"Moderate", type:["ART"], prereqs:[]},
  {code:"ART 315", title:"Eighteenth-Century European Art", credits:3, difficulty:"Moderate", type:["ART"], prereqs:[]},
  {code:"ART 317", title:"Nineteenth-Century Art in Europe and the United States", credits:3, difficulty:"Moderate", type:["ART"], prereqs:[]},
  {code:"ART 318L", title:"Women and Experimental Cinema", credits:3, difficulty:"Moderate", type:["ART"], prereqs:[]},
  {code:"ART 320", title:"Graphic Design Workshop", credits:3, difficulty:"Moderate", type:["ART"], prereqs:[]},
  {code:"ART 327L", title:"Hellenistic Art and Culture", credits:3, difficulty:"Moderate", type:["ART"], prereqs:[]},
  {code:"ART 368", title:"History of Photography: 1839-Present", credits:3, difficulty:"Moderate", type:["ART"], prereqs:[]},
  {code:"ART 369", title:"American Women Photographers", credits:3, difficulty:"Moderate", type:["ART"], prereqs:[]},
  {code:"ART 370L", title:"Studies in Experimental Film and Video Art", credits:3, difficulty:"Moderate", type:["ART"], prereqs:[]},
  {code:"ART 375", title:"Contemporary Art: c. 1989-Present", credits:3, difficulty:"Moderate", type:["ART"], prereqs:[]},
  {code:"ART 380", title:"Special Topics", credits:3, difficulty:"Moderate", type:["ART"], prereqs:[]},
  {code:"ART 381W", title:"Drawing Workshop", credits:3, difficulty:"Moderate", type:["ART"], prereqs:[]},
  {code:"ART 382", title:"Digital Drawing", credits:3, difficulty:"Moderate", type:["ART"], prereqs:[]},
  {code:"ART 383", title:"Painting Workshop", credits:3, difficulty:"Moderate", type:["ART"], prereqs:[]},
  {code:"ART 386", title:"Sculpture Workshop", credits:3, difficulty:"Moderate", type:["ART"], prereqs:[]},
  {code:"ART 387", title:"Printmaking Workshop", credits:3, difficulty:"Moderate", type:["ART"], prereqs:[]},
  {code:"ART 393L", title:"Photography Workshop", credits:3, difficulty:"Moderate", type:["ART"], prereqs:[]},
  {code:"ART 395L", title:"Video Workshop", credits:3, difficulty:"Moderate", type:["ART"], prereqs:[]},
  {code:"ART 397", title:"Digital Media Workshop", credits:3, difficulty:"Moderate", type:["ART"], prereqs:[]},
  {code:"ART 478", title:"Independent Study", credits:1, difficulty:"Moderate", type:["ART"], prereqs:[]},
  {code:"ART 479", title:"Independent Study", credits:1, difficulty:"Moderate", type:["ART"], prereqs:[]},
  {code:"ART 481", title:"Studio Art Capstone", credits:3, difficulty:"Moderate", type:["ART"], prereqs:[]},
  {code:"ART 482", title:"Art History Capstone", credits:3, difficulty:"Moderate", type:["ART"], prereqs:[]},
  {code:"ART 488", title:"Special Problems: Field Work", credits:1, difficulty:"Moderate", type:["ART"], prereqs:[]},
  {code:"ART 489", title:"Special Problems: Field Work", credits:1, difficulty:"Moderate", type:["ART"], prereqs:[]},
  {code:"ART 491", title:"Honors Project", credits:3, difficulty:"Moderate", type:["ART"], prereqs:[]},
  {code:"ART 492", title:"Honors Project", credits:3, difficulty:"Moderate", type:["ART"], prereqs:[]},

  {code:"ASIAN 104L", title:"Introduction to East Asian Art", credits:3, difficulty:"Moderate", type:["ASIAN"], prereqs:[]},
  {code:"ASIAN 112L", title:"Religions of Asia", credits:3, difficulty:"Moderate", type:["ASIAN"], prereqs:[]},
  {code:"ASIAN 115L", title:"Survey of South Asia", credits:3, difficulty:"Moderate", type:["ASIAN"], prereqs:[]},
  {code:"ASIAN 155L", title:"Great Books of East Asia: Classics of Love and War", credits:3, difficulty:"Moderate", type:["ASIAN"], prereqs:[]},
  {code:"ASIAN 160L", title:"East Asian Civilizations to 1850", credits:3, difficulty:"Moderate", type:["ASIAN"], prereqs:[] },
  {code:"ASIAN 161L", title:"East Asian Civilizations since 1850", credits:3, difficulty:"Moderate", type:["ASIAN"], prereqs:[]},
  {code:"ASIAN 212L", title:"Traditional Japanese Architecture", credits:3, difficulty:"Moderate", type:["ASIAN"], prereqs:[]},
  {code:"ASIAN 215L", title:"Introduction to Buddhism", credits:3, difficulty:"Moderate", type:["ASIAN"], prereqs:[]},
  {code:"ASIAN 222L", title:"Introduction to Japanese Music", credits:3, difficulty:"Moderate", type:["ASIAN"], prereqs:[]},
  {code:"ASIAN 227GL", title:"Gender & Sexuality in South Asia", credits:3, difficulty:"Moderate", type:["ASIAN"], prereqs:[]},
  {code:"ASIAN 233L", title:"Introduction to Islam", credits:3, difficulty:"Moderate", type:["ASIAN"], prereqs:[]},
  {code:"ASIAN 235L", title:"Yoga in History, Philosophy, and Practice", credits:3, difficulty:"Moderate", type:["ASIAN"], prereqs:[]},
  {code:"ASIAN 239L", title:"Hindu Myth and Narrative: the Epics and Puranas", credits:3, difficulty:"Moderate", type:["ASIAN"], prereqs:[]},
  {code:"ASIAN 251L", title:"South Asia and the India Ocean World", credits:3, difficulty:"Moderate", type:["ASIAN"], prereqs:[]},
  {code:"ASIAN 252L", title:"Premodern Japanese Culture:From Ancient Times to 1868", credits:3, difficulty:"Moderate", type:["ASIAN"], prereqs:[]},
  {code:"ASIAN 265L", title:"Icons of East Asia: Stereotypes, gender, and cultural history from geisha girls to martial masters", credits:3, difficulty:"Moderate", type:["ASIAN"], prereqs:[]},
  {code:"ASIAN 275L", title:"Peoples and Cultures of China", credits:3, difficulty:"Moderate", type:["ASIAN"], prereqs:[]},
  {code:"ASIAN 280", title:"Southeast Asian Cultures", credits:3, difficulty:"Moderate", type:["ASIAN"], prereqs:[]},
  {code:"ASIAN 314L", title:"Meditation traditions of Asia", credits:3, difficulty:"Moderate", type:["ASIAN"], prereqs:[]},
  {code:"ASIAN 335L", title:"Literature and the Arts of the Islamic World", credits:3, difficulty:"Moderate", type:["ASIAN"], prereqs:[]},
  {code:"ASIAN 345L", title:"Gender, Religion and Politics in South Asia", credits:3, difficulty:"Moderate", type:["ASIAN"], prereqs:[]},
  {code:"ASIAN 351L", title:"Religion and the Arts", credits:3, difficulty:"Moderate", type:["ASIAN"], prereqs:[]},
  {code:"ASIAN 357L", title:"Women in South Asian Religions: Gender Ideology and Practice in Hinduism, Buddhism, and Islam", credits:3, difficulty:"Moderate", type:["ASIAN"], prereqs:[]},
  {code:"ASIAN 358L", title:"Psychology, Politics, and Philosophy in East Asia", credits:3, difficulty:"Moderate", type:["ASIAN"], prereqs:[]},
  {code:"ASIAN 359L", title:"Women in Modern China", credits:3, difficulty:"Moderate", type:["ASIAN"], prereqs:[]},
  {code:"ASIAN 361L", title:"The History of Modern China", credits:3, difficulty:"Moderate", type:["ASIAN"], prereqs:[]},
  {code:"ASIAN 363L", title:"Modern Japan", credits:3, difficulty:"Moderate", type:["ASIAN"], prereqs:[]},
  {code:"ASIAN 364L", title:"India since 1857", credits:3, difficulty:"Moderate", type:["ASIAN"], prereqs:[]},
  {code:"ASIAN 365L", title:"The Muslim World Since 1979", credits:3, difficulty:"Moderate", type:["ASIAN"], prereqs:[]},
  {code:"ASIAN 366L", title:"Re-made in Asia: Tellings and re-tellings from the Buddha to Godzilla", credits:3, difficulty:"Moderate", type:["ASIAN"], prereqs:[]},
  {code:"ASIAN 367L", title:"Food and Culture in Japan: National Identity and Diversity, Past and Present", credits:3, difficulty:"Moderate", type:["ASIAN"], prereqs:[]},
  {code:"ASIAN 478", title:"Independent Study", credits:1, difficulty:"Moderate", type:["ASIAN"], prereqs:[]},
  {code:"ASIAN 480", title:"Topics in Asian Studies", credits:3, difficulty:"Moderate", type:["ASIAN"], prereqs:[]},
  {code:"ASIAN 488L", title:"The Idea of Asia", credits:3, difficulty:"Moderate", type:["ASIAN"], prereqs:[]},

  {code:"CHINSE 101", title:"Elementary Chinese I", credits:4, difficulty:"Moderate", type:["CHINSE"], prereqs:[] },
  {code:"CHINSE 102", title:"Elementary Chinese II", credits:4, difficulty:"Moderate", type:["CHINSE"], prereqs:[] },
  {code:"CHINSE 201", title:"Intermediate Chinese I", credits:3, difficulty:"Moderate", type:["CHINSE"], prereqs:[]},
  {code:"CHINSE 202", title:"Intermediate Chinese II", credits:3, difficulty:"Moderate", type:["CHINSE"], prereqs:[]},
  {code:"CHINSE 253", title:"Is Culture Power? Re-thinking 'Traditional' Chinese Culture", credits:3, difficulty:"Moderate", type:["CHINSE"], prereqs:[]},
  {code:"CHINSE 276", title:"Modern Chinese Cinema", credits:3, difficulty:"Moderate", type:["CHINSE"], prereqs:[]},
  {code:"CHINSE 301", title:"Advanced Chinese I", credits:3, difficulty:"Moderate", type:["CHINSE"], prereqs:[]},
  {code:"CHINSE 302", title:"Advanced Chinese II", credits:3, difficulty:"Moderate", type:["CHINSE"], prereqs:[]},
  {code:"CHINSE 305", title:"Readings in Chinese: Classical", credits:3, difficulty:"Moderate", type:["CHINSE"], prereqs:[]},
  {code:"CHINSE 315", title:"Chinese Popular Music", credits:3, difficulty:"Moderate", type:["CHINSE"], prereqs:[]},
  {code:"CHINSE 320", title:"Introduction to Teaching Chinese Language", credits:3, difficulty:"Moderate", type:["CHINSE"], prereqs:[]},
  {code:"CHINSE 378", title:"Independent Study", credits:1, difficulty:"Moderate", type:["CHINSE"], prereqs:[]},
  {code:"CHINSE 379", title:"Independent Study", credits:1, difficulty:"Moderate", type:["CHINSE"], prereqs:[]},
  {code:"CHINSE 479", title:"Readings & Research", credits:3, difficulty:"Moderate", type:["CHINSE"], prereqs:[]},

  {code:"CINE 101", title:"Introduction to Cinema Studies", credits:3, difficulty:"Moderate", type:["CINE"], prereqs:[] },
  {code:"CINE 121G", title:"Space, Place, and Cinema", credits:4, difficulty:"Moderate", type:["CINE"], prereqs:[]},
  {code:"CINE 201", title:"History of International Cinema: Origins to 1945", credits:3, difficulty:"Moderate", type:["CINE"], prereqs:[]},
  {code:"CINE 202", title:"History of International Cinema: 1945-the present", credits:3, difficulty:"Moderate", type:["CINE"], prereqs:[]},
  {code:"CINE 205L", title:"Latin American Film", credits:3, difficulty:"Moderate", type:["CINE"], prereqs:[]},
  {code:"CINE 225", title:"Film Adaptations", credits:3, difficulty:"Moderate", type:["CINE"], prereqs:[]},
  {code:"CINE 235L", title:"Postwar European Cinema", credits:3, difficulty:"Moderate", type:["CINE"], prereqs:[]},
  {code:"CINE 245", title:"Contemporary Cinema", credits:3, difficulty:"Moderate", type:["CINE"], prereqs:[]},
  {code:"CINE 258L", title:"21st Century World Cinema", credits:3, difficulty:"Moderate", type:["CINE"], prereqs:[]},
  {code:"CINE 260L", title:"Improvisation and the Art of Comedy", credits:3, difficulty:"Moderate", type:["CINE"], prereqs:[]},
  {code:"CINE 265L", title:"Acting for the Camera", credits:3, difficulty:"Moderate", type:["CINE"], prereqs:[]},
  {code:"CINE 275L", title:"Introduction to Screen and Television Writing", credits:3, difficulty:"Moderate", type:["CINE"], prereqs:[]},
  {code:"CINE 276L", title:"Italian Cinema", credits:3, difficulty:"Moderate", type:["CINE"], prereqs:[]},
  {code:"CINE 289", title:"Special Topics in Cinema Studies", credits:3, difficulty:"Moderate", type:["CINE"], prereqs:[]},
  {code:"CINE 292L", title:"Cinema, Sex, and Censorship", credits:3, difficulty:"Moderate", type:["CINE"], prereqs:[]},
  {code:"CINE 300L", title:"Scenic Design for Theatre and Entertainment", credits:3, difficulty:"Moderate", type:["CINE"], prereqs:[]},
  {code:"CINE 304", title:"Understanding Television", credits:3, difficulty:"Moderate", type:["CINE"], prereqs:[]},
  {code:"CINE 315L", title:"Asian American Cinema", credits:3, difficulty:"Moderate", type:["CINE"], prereqs:[]},
  {code:"CINE 316L", title:"Cult Cinema", credits:3, difficulty:"Moderate", type:["CINE"], prereqs:[]},
  {code:"CINE 317L", title:"American Independent Cinema", credits:3, difficulty:"Moderate", type:["CINE"], prereqs:[]},
  {code:"CINE 318L", title:"Women and Experimental Cinema", credits:3, difficulty:"Moderate", type:["CINE"], prereqs:[]},
  {code:"CINE 320", title:"Film Directors", credits:3, difficulty:"Moderate", type:["CINE"], prereqs:[]},
  {code:"CINE 325L", title:"Film Festivals", credits:3, difficulty:"Moderate", type:["CINE"], prereqs:[]},
  {code:"CINE 337L", title:"Disney's European Fairy Tales", credits:3, difficulty:"Moderate", type:["CINE"], prereqs:[]},
  {code:"CINE 341L", title:"Gender and Film: Multidisciplinary Perspectives", credits:3, difficulty:"Moderate", type:["CINE"], prereqs:[]},
  {code:"CINE 350", title:"Film Genres", credits:3, difficulty:"Moderate", type:["CINE"], prereqs:[]},
  {code:"CINE 355", title:"American Cinema", credits:3, difficulty:"Moderate", type:["CINE"], prereqs:[]},
  {code:"CINE 361L", title:" Indigenous Film and Critical Visual Studies", credits:3, difficulty:"Moderate", type:["CINE"], prereqs:[]},
  {code:"CINE 370L", title:"Studies in Experimental Film and Video Art", credits:3, difficulty:"Moderate", type:["CINE"], prereqs:[]},
  {code:"CINE 372L", title:"German Cinema", credits:3, difficulty:"Moderate", type:["CINE"], prereqs:[]},
  {code:"CINE 375L", title:"Indian Cinema", credits:3, difficulty:"Moderate", type:["CINE"], prereqs:[]},
  {code:"CINE 385L", title:"Topics in Japanese Cinema", credits:3, difficulty:"Moderate", type:["CINE"], prereqs:[]},
  {code:"CINE 412L", title:"Gender, Human Rights, and Global Cinema", credits:3, difficulty:"Moderate", type:["CINE"], prereqs:[]},
  {code:"CINE 420", title:"Political Cinema Across Cultures", credits:3, difficulty:"Moderate", type:["CINE"], prereqs:[]},
  {code:"CINE 470", title:"Independent Study", credits:1, difficulty:"Moderate", type:["CINE"], prereqs:[]},
  {code:"CINE 480", title:"Internship in Cinema Studies", credits:3, difficulty:"Moderate", type:["CINE"], prereqs:[]},

  {code:"CLSICS 125G", title:"The Myth of the Hero", credits:3, difficulty:"Moderate", type:["CLSICS"], prereqs:[]},
  {code:"CLSICS 161", title:"Demystifying Language: English Vocabulary", credits:3, difficulty:"Moderate", type:["CLSICS"], prereqs:[]},
  {code:"CLSICS 175G", title:"Athenian Democracy", credits:4, difficulty:"Moderate", type:["CLSICS"], prereqs:[] },
  {code:"CLSICS 180", title:"Poets, Warriors and Sages: The Greeks", credits:3, difficulty:"Moderate", type:["CLSICS"], prereqs:[]},
  {code:"CLSICS 212G", title:"Women in Ancient Greece", credits:3, difficulty:"Moderate", type:["CLSICS"], prereqs:[]},
  {code:"CLSICS 215G", title:"Women of Rome", credits:3, difficulty:"Moderate", type:["CLSICS"], prereqs:[]},
  {code:"CLSICS 218G", title:"Soul & Self in Ancient Greece", credits:3, difficulty:"Moderate", type:["CLSICS"], prereqs:[]},
  {code:"CLSICS 230L", title:"Ancient Egypt", credits:3, difficulty:"Moderate", type:["CLSICS"], prereqs:[]},
  {code:"CLSICS 233L", title:"The Homeric Warrior", credits:3, difficulty:"Moderate", type:["CLSICS"], prereqs:[]},
  {code:"CLSICS 240G", title:"What's So Funny? Greek Comedy and Beyond", credits:3, difficulty:"Moderate", type:["CLSICS"], prereqs:[]},
  {code:"CLSICS 241L", title:"Myth, History, and Prophecy: Old Testament", credits:3, difficulty:"Moderate", type:["CLSICS"], prereqs:[]},
  {code:"CLSICS 242L", title:"Origins of Christianity: From Jesus to Constantine", credits:3, difficulty:"Moderate", type:["CLSICS"], prereqs:[]},
  {code:"CLSICS 262L", title:"Greek Art and Architecture", credits:3, difficulty:"Moderate", type:["CLSICS"], prereqs:[]},
  {code:"CLSICS 271", title:"Paganism and Christianity", credits:3, difficulty:"Moderate", type:["CLSICS"], prereqs:[]},
  {code:"CLSICS 280", title:"Special Topics", credits:3, difficulty:"Moderate", type:["CLSICS"], prereqs:[]},
  {code:"CLSICS 281", title:"Greek Civilization: Multi-Cultural Perspectives", credits:3, difficulty:"Moderate", type:["CLSICS"], prereqs:[]},
  {code:"CLSICS 282", title:"Roman Civilization", credits:3, difficulty:"Moderate", type:["CLSICS"], prereqs:[]},
  {code:"CLSICS 284", title:"Greek and Roman Mythology", credits:3, difficulty:"Moderate", type:["CLSICS"], prereqs:[]},
  {code:"CLSICS 285", title:"Greek and Roman Tragedy", credits:3, difficulty:"Moderate", type:["CLSICS"], prereqs:[]},
  {code:"CLSICS 286", title:"Greek and Roman Comedy", credits:3, difficulty:"Moderate", type:["CLSICS"], prereqs:[]},
  {code:"CLSICS 294", title:"Magic and Science in Greece and Rome", credits:3, difficulty:"Moderate", type:["CLSICS"], prereqs:[]},
  {code:"CLSICS 301L", title:"Ancient Greek History", credits:3, difficulty:"Moderate", type:["CLSICS"], prereqs:[]},
  {code:"CLSICS 302L", title:"Roman History", credits:3, difficulty:"Moderate", type:["CLSICS"], prereqs:[]},
  {code:"CLSICS 303L", title:"The Archaeology of Ancient Greece", credits:3, difficulty:"Moderate", type:["CLSICS"], prereqs:[]},
  {code:"CLSICS 311L", title:"The Fall of Rome", credits:3, difficulty:"Moderate", type:["CLSICS"], prereqs:[]},
  {code:"CLSICS 320L", title:"Bronze Age Aegean Archaeology", credits:3, difficulty:"Moderate", type:["CLSICS"], prereqs:[]},
  {code:"CLSICS 327L", title:"Hellenistic Art and Culture", credits:3, difficulty:"Moderate", type:["CLSICS"], prereqs:[]},
  {code:"CLSICS 380", title:"Special Topics", credits:3, difficulty:"Moderate", type:["CLSICS"], prereqs:[]},
  {code:"CLSICS 383", title:"Heroes, Wars and Quests", credits:3, difficulty:"Moderate", type:["CLSICS"], prereqs:[]},
  {code:"CLSICS 385L", title:"Greek & Roman Religion", credits:3, difficulty:"Moderate", type:["CLSICS"], prereqs:[]},
  {code:"CLSICS 387", title:"The Golden Age of Athens", credits:3, difficulty:"Moderate", type:["CLSICS"], prereqs:[]},
  {code:"CLSICS 388", title:"The Golden Age of Rome", credits:3, difficulty:"Moderate", type:["CLSICS"], prereqs:[]},
  {code:"CLSICS 478", title:"Independent Study", credits:1, difficulty:"Moderate", type:["CLSICS"], prereqs:[]},
  {code:"CLSICS 479", title:"Independent Study", credits:1, difficulty:"Moderate", type:["CLSICS"], prereqs:[]},
  {code:"CLSICS 490", title:"Honors Program", credits:3, difficulty:"Moderate", type:["CLSICS"], prereqs:[]},
  {code:"CLSICS 491", title:"Honors Program", credits:3, difficulty:"Moderate", type:["CLSICS"], prereqs:[]},
  {code:"CLSICS 495", title:"Senior Seminar", credits:3, difficulty:"Moderate", type:["CLSICS"], prereqs:[]},


  {code:"COMM 100", title:"Introduction to Communication", credits:3, difficulty:"Moderate", type:["COMM"], prereqs:[] },
  {code:"COMM 105", title:"Public Speaking and Professional Communication", credits:3, difficulty:"Moderate", type:["COMM"], prereqs:[] },
  {code:"COMM 200", title:"New Media Society", credits:3, difficulty:"Moderate", type:["COMM"], prereqs:[]},
  {code:"COMM 215L", title:"Gender & Communication", credits:3, difficulty:"Moderate", type:["COMM"], prereqs:[]},
  {code:"COMM 220", title:"Interpersonal Communication", credits:3, difficulty:"Moderate", type:["COMM"], prereqs:[]},
  {code:"COMM 230", title:"Intercultural Communication", credits:3, difficulty:"Moderate", type:["COMM"], prereqs:[]},
  {code:"COMM 240", title:"Organizational communication", credits:3, difficulty:"Moderate", type:["COMM"], prereqs:[]},
  {code:"COMM 250", title:"Analyzing Media", credits:3, difficulty:"Moderate", type:["COMM"], prereqs:[]},
  {code:"COMM 260", title:"Psychological Effects of Mass Media", credits:3, difficulty:"Moderate", type:["COMM"], prereqs:[]},
  {code:"COMM 270", title:"Introduction to Strategic Communication", credits:3, difficulty:"Moderate", type:["COMM"], prereqs:[]},
  {code:"COMM 280", title:"Special Topics", credits:3, difficulty:"Moderate", type:["COMM"], prereqs:[]},
  {code:"COMM 300", title:"Information Technology and Human Communication", credits:3, difficulty:"Moderate", type:["COMM"], prereqs:[]},
  {code:"COMM 305", title:"Communication in Diverse Organizations", credits:3, difficulty:"Moderate", type:["COMM"], prereqs:[]},
  {code:"COMM 310L", title:"Love, Sex, and Media Effects", credits:3, difficulty:"Moderate", type:["COMM"], prereqs:[]},
  {code:"COMM 315", title:"New Media, Identity & Self", credits:3, difficulty:"Moderate", type:["COMM"], prereqs:[]},
  {code:"COMM 320", title:"Social Influence and Compliance Gaining", credits:3, difficulty:"Moderate", type:["COMM"], prereqs:[]},
  {code:"COMM 325", title:"Relational Communication", credits:3, difficulty:"Moderate", type:["COMM"], prereqs:[]},
  {code:"COMM 330", title:"Health Communication", credits:3, difficulty:"Moderate", type:["COMM"], prereqs:[]},
  {code:"COMM 335", title:"Lying & Deception", credits:3, difficulty:"Moderate", type:["COMM"], prereqs:[]},
  {code:"COMM 340", title:"Communication and Community Mobilization", credits:3, difficulty:"Moderate", type:["COMM"], prereqs:[]},
  {code:"COMM 345L", title:"Environmental Communication", credits:3, difficulty:"Moderate", type:["COMM"], prereqs:[]},
  {code:"COMM 350", title:"Political communication", credits:3, difficulty:"Moderate", type:["COMM"], prereqs:[]},
  {code:"COMM 351", title:"Communication Research Methods", credits:3, difficulty:"Moderate", type:["COMM"], prereqs:[]},
  {code:"COMM 355", title:"Strategic Communication in Negotiation", credits:3, difficulty:"Moderate", type:["COMM"], prereqs:[]},
  {code:"COMM 360", title:"Crisis Communication", credits:3, difficulty:"Moderate", type:["COMM"], prereqs:[]},
  {code:"COMM 365", title:"Digital Media Analytics", credits:3, difficulty:"Moderate", type:["COMM"], prereqs:[]},
  {code:"COMM 370", title:"Advertising/PR Campaign Planning", credits:3, difficulty:"Moderate", type:["COMM"], prereqs:[]},
  {code:"COMM 372", title:"Social Media and Strategic Communication", credits:3, difficulty:"Moderate", type:["COMM"], prereqs:[]},
  {code:"COMM 375L", title:"Indian Cinema", credits:3, difficulty:"Moderate", type:["COMM"], prereqs:[]},
  {code:"COMM 380", title:"Special Topics", credits:3, difficulty:"Moderate", type:["COMM"], prereqs:[]},
  {code:"COMM 478", title:"Independent Study", credits:1, difficulty:"Moderate", type:["COMM"], prereqs:[]},
  {code:"COMM 479", title:"Research Practicum", credits:1, difficulty:"Moderate", type:["COMM"], prereqs:[]},
  {code:"COMM 480", title:"Communication Seminar", credits:3, difficulty:"Moderate", type:["COMM"], prereqs:[]},
  {code:"COMM 490", title:"Communication Internship", credits:3, difficulty:"Moderate", type:["COMM"], prereqs:[]},

  {code:"DANCE 130", title:"Understanding Dance", credits:3, difficulty:"Moderate", type:["DANCE"], prereqs:[] },
  {code:"DANCE 131", title:"Musical Theatre Dance", credits:3, difficulty:"Moderate", type:["DANCE"], prereqs:[]},
  {code:"DANCE 132", title:"Ballet I", credits:3, difficulty:"Moderate", type:["DANCE"], prereqs:[]},
  {code:"DANCE 133", title:"Jazz Dance I", credits:3, difficulty:"Moderate", type:["DANCE"], prereqs:[]},
  {code:"DANCE 134", title:"Modern Dance I", credits:3, difficulty:"Moderate", type:["DANCE"], prereqs:[]},
  {code:"DANCE 135", title:"Multicultural Dance", credits:3, difficulty:"Moderate", type:["DANCE"], prereqs:[]},
  {code:"DANCE 136", title:"Hip Hop Dance", credits:3, difficulty:"Moderate", type:["DANCE"], prereqs:[]},
  {code:"DANCE 181", title:"Topics in Dance", credits:3, difficulty:"Moderate", type:["DANCE"], prereqs:[]},
  {code:"DANCE 225", title:"Dance Composition and Choreography", credits:3, difficulty:"Moderate", type:["DANCE"], prereqs:[]},
  {code:"DANCE 232", title:"Ballet II", credits:3, difficulty:"Moderate", type:["DANCE"], prereqs:[]},
  {code:"DANCE 233", title:"Jazz Dance II", credits:3, difficulty:"Moderate", type:["DANCE"], prereqs:[]},
  {code:"DANCE 234", title:"Modern Dance II", credits:3, difficulty:"Moderate", type:["DANCE"], prereqs:[]},
  {code:"DANCE 325", title:"Dance Theatre Workshop", credits:4, difficulty:"Moderate", type:["DANCE"], prereqs:[]},
  {code:"DANCE 330", title:"The Pedagogy of Dance", credits:3, difficulty:"Moderate", type:["DANCE"], prereqs:[]},
  {code:"DANCE 332", title:"Ballet III", credits:3, difficulty:"Moderate", type:["DANCE"], prereqs:[]},
  {code:"DANCE 435", title:"Dance Internship", credits:3, difficulty:"Moderate", type:["DANCE"], prereqs:[]},
  {code:"DANCE 478", title:"Independent Study", credits:1, difficulty:"Moderate", type:["DANCE"], prereqs:[]},
  {code:"DANCE 479", title:"Independent Study", credits:1, difficulty:"Moderate", type:["DANCE"], prereqs:[]},

  {code:"ECON 101", title:"Introduction to Microeconomics", credits:3, difficulty:"Moderate", type:["ECON"], prereqs:[] },
  {code:"ECON 102", title:"Introduction to Macroeconomics", credits:3, difficulty:"Moderate", type:["ECON"], prereqs:[] },
  {code:"ECON 110G", title:"Economic Ideas", credits:4, difficulty:"Moderate", type:["ECON"], prereqs:[]},
  {code:"ECON 201", title:"Microeconomic Theory", credits:3, difficulty:"Moderate", type:["ECON"], prereqs:[]},
  {code:"ECON 202", title:"Macroeconomic Theory", credits:3, difficulty:"Moderate", type:["ECON"], prereqs:[]},
  {code:"ECON 205", title:"Statistical Methods", credits:3, difficulty:"Moderate", type:["ECON"], prereqs:[]},
  {code:"ECON 212G", title:"Economics of the Metropolitan Area", credits:3, difficulty:"Moderate", type:["ECON"], prereqs:[]},
  {code:"ECON 214GL", title:"Ecological Economics", credits:3, difficulty:"Moderate", type:["ECON"], prereqs:[]},
  {code:"ECON 305", title:"Introduction to Data Modeling through Data Visualization", credits:3, difficulty:"Moderate", type:["ECON"], prereqs:[]},
  {code:"ECON 308", title:"History of Economic Thought", credits:3, difficulty:"Moderate", type:["ECON"], prereqs:[]},
  {code:"ECON 310", title:"Introduction to Marxist Analysis", credits:3, difficulty:"Moderate", type:["ECON"], prereqs:[]},
  {code:"ECON 318", title:"The Economics of State and Local Governments", credits:3, difficulty:"Moderate", type:["ECON"], prereqs:[]},
  {code:"ECON 327", title:"Political Economy of Development in Africa", credits:3, difficulty:"Moderate", type:["ECON"], prereqs:[]},
  {code:"ECON 331", title:"Money and Financial Institutions", credits:3, difficulty:"Moderate", type:["ECON"], prereqs:[]},
  {code:"ECON 334", title:"International Trade", credits:3, difficulty:"Moderate", type:["ECON"], prereqs:[]},
  {code:"ECON 335", title:"International Finance", credits:3, difficulty:"Moderate", type:["ECON"], prereqs:[]},
  {code:"ECON 336", title:"Economic Development", credits:3, difficulty:"Moderate", type:["ECON"], prereqs:[]},
  {code:"ECON 337", title:"Emerging Economies in Asia", credits:3, difficulty:"Moderate", type:["ECON"], prereqs:[]},
  {code:"ECON 338", title:"The Latin American Economy", credits:3, difficulty:"Moderate", type:["ECON"], prereqs:[]},
  {code:"ECON 339", title:"Political Economy of International Migration", credits:3, difficulty:"Moderate", type:["ECON"], prereqs:[]},
  {code:"ECON 343", title:"The Political Economy of Race and Racism", credits:3, difficulty:"Moderate", type:["ECON"], prereqs:[]},
  {code:"ECON 370", title:"Special Topics", credits:3, difficulty:"Moderate", type:["ECON"], prereqs:[]},
  {code:"ECON 372", title:"Comparative Economic Systems", credits:3, difficulty:"Moderate", type:["ECON"], prereqs:[]},
  {code:"ECON 381", title:"Economics of Global Health", credits:3, difficulty:"Moderate", type:["ECON"], prereqs:[]},
  {code:"ECON 385", title:"Economics of Education", credits:3, difficulty:"Moderate", type:["ECON"], prereqs:[]},
  {code:"ECON 390", title:"Labor Market Economics", credits:3, difficulty:"Moderate", type:["ECON"], prereqs:[]},
  {code:"ECON 391", title:"Unions and Collective Bargaining", credits:3, difficulty:"Moderate", type:["ECON"], prereqs:[]},
  {code:"ECON 395", title:"The Economics of Social Welfare", credits:3, difficulty:"Moderate", type:["ECON"], prereqs:[]},
  {code:"ECON 396", title:"The Economics of Inequality", credits:3, difficulty:"Moderate", type:["ECON"], prereqs:[]},
  {code:"ECON 407", title:"Advanced Topics in Development Economics", credits:3, difficulty:"Moderate", type:["ECON"], prereqs:[]},
  {code:"ECON 413", title:"Advanced Topics in Urban Economics", credits:3, difficulty:"Moderate", type:["ECON"], prereqs:[]},
  {code:"ECON 420", title:"Gender and Economics", credits:3, difficulty:"Moderate", type:["ECON"], prereqs:[]},
  {code:"ECON 452", title:"Econometrics", credits:4, difficulty:"Moderate", type:["ECON"], prereqs:[]},
  {code:"ECON 453", title:"Advanced Macroeconomics", credits:3, difficulty:"Moderate", type:["ECON"], prereqs:[]},
  {code:"ECON 470", title:"Special Topics", credits:3, difficulty:"Moderate", type:["ECON"], prereqs:[]},
  {code:"ECON 476", title:"Internship in Economics", credits:3, difficulty:"Moderate", type:["ECON"], prereqs:[]},
  {code:"ECON 479", title:"Independent Study", credits:1, difficulty:"Moderate", type:["ECON"], prereqs:[]},
  {code:"ECON 480", title:"Health Economics", credits:3, difficulty:"Moderate", type:["ECON"], prereqs:[]},
  {code:"ECON 481", title:"Senior Independent Study", credits:3, difficulty:"Moderate", type:["ECON"], prereqs:[]},
  {code:"ECON 489", title:"Senior Honors Project", credits:3, difficulty:"Moderate", type:["ECON"], prereqs:[]},
  {code:"ECON 490", title:"Senior Honors Thesis", credits:3, difficulty:"Moderate", type:["ECON"], prereqs:[]},
  {code:"ECON 330", title:"Environmental Economics", credits:3, difficulty:"Moderate", type:["ECON","SB"], prereqs:[]},

  {code:"ENGL 101", title:"Composition I", credits:3, difficulty:"Moderate", type:["ENGL"], prereqs:[] },
  {code:"ENGL 102", title:"Composition II", credits:3, difficulty:"Moderate", type:["ENGL"], prereqs:[] },
  {code:"ENGL 110", title:"Reading Like a Writer", credits:3, difficulty:"Moderate", type:["ENGL"], prereqs:[]},
  {code:"ENGL 111E", title:"Language, Writing, and Cultural Exchange", credits:0, difficulty:"Moderate", type:["ENGL"], prereqs:[]},
  {code:"ENGL 124", title:"Science Fiction: Cross-Cultural Perspectives", credits:3, difficulty:"Moderate", type:["ENGL"], prereqs:[]},
  {code:"ENGL 125G", title:"Defining Freedom", credits:4, difficulty:"Moderate", type:["ENGL"], prereqs:[]},
  {code:"ENGL 126", title:"Young Adult Literature", credits:3, difficulty:"Moderate", type:["ENGL"], prereqs:[]},
  {code:"ENGL 126G", title:"Aging & Wisdom", credits:4, difficulty:"Moderate", type:["ENGL"], prereqs:[]},
  {code:"ENGL 127G", title:"Food Matters", credits:4, difficulty:"Moderate", type:["ENGL"], prereqs:[]},
  {code:"ENGL 130", title:"Vikings!: The Literature of Scandinavia, Medieval and Postmodern", credits:3, difficulty:"Moderate", type:["ENGL"], prereqs:[]},
  {code:"ENGL 135", title:"Love and Death in American Literature", credits:3, difficulty:"Moderate", type:["ENGL"], prereqs:[]},
  {code:"ENGL 179GL", title:"Sexuality in Nature and Culture", credits:3, difficulty:"Moderate", type:["ENGL"], prereqs:[]},
  {code:"ENGL 181G", title:"Literature and the Visual Arts", credits:4, difficulty:"Moderate", type:["ENGL"], prereqs:[]},
  {code:"ENGL 183G", title:"Literature and Society", credits:4, difficulty:"Moderate", type:["ENGL"], prereqs:[]},
  {code:"ENGL 185G", title:"Literature and Film", credits:4, difficulty:"Moderate", type:["ENGL"], prereqs:[]},
  {code:"ENGL 186G", title:"Exploring Thompson Island: On the Ground and in the Archives", credits:4, difficulty:"Moderate", type:["ENGL"], prereqs:[]},
  {code:"ENGL 187G", title:"Schooled: Rethinking Education", credits:4, difficulty:"Moderate", type:["ENGL"], prereqs:[]},
  {code:"ENGL 188G", title:"Literature, Medicine, and Culture", credits:3, difficulty:"Moderate", type:["ENGL"], prereqs:[]},
  {code:"ENGL 189G", title:"War in Literature", credits:3, difficulty:"Moderate", type:["ENGL"], prereqs:[]},
  {code:"ENGL 200", title:"Introduction to Literary Studies", credits:3, difficulty:"Moderate", type:["ENGL"], prereqs:[] },
  {code:"ENGL 201", title:"Five British Authors", credits:3, difficulty:"Moderate", type:["ENGL"], prereqs:[]},
  {code:"ENGL 202", title:"Six American Authors", credits:3, difficulty:"Moderate", type:["ENGL"], prereqs:[]},
  {code:"ENGL 203", title:"Writing Craft/Context/Design", credits:3, difficulty:"Moderate", type:["ENGL"], prereqs:[]},
  {code:"ENGL 204", title:"Professional Writing", credits:3, difficulty:"Moderate", type:["ENGL"], prereqs:[]},
  {code:"ENGL 209", title:"Writing on Local Issues, Arts, and Culture", credits:3, difficulty:"Moderate", type:["ENGL"], prereqs:[]},
  {code:"ENGL 210", title:"Introduction to Creative Writing", credits:3, difficulty:"Moderate", type:["ENGL"], prereqs:[] },
  {code:"ENGL 211", title:"Creative Writing: Poetry", credits:3, difficulty:"Moderate", type:["ENGL"], prereqs:[]},
  {code:"ENGL 212", title:"Creative Writing: Fiction", credits:3, difficulty:"Moderate", type:["ENGL"], prereqs:[]},
  {code:"ENGL 216", title:"Reading and Writing Journalism", credits:3, difficulty:"Moderate", type:["ENGL"], prereqs:[]},
  {code:"ENGL 221L", title:"Introduction to Asian American Writing", credits:3, difficulty:"Moderate", type:["ENGL"], prereqs:[]},
  {code:"ENGL 223L", title:"Latino/Latina/Latinx Literature", credits:3, difficulty:"Moderate", type:["ENGL"], prereqs:[]},
  {code:"ENGL 225", title:"Graphic Novels", credits:3, difficulty:"Moderate", type:["ENGL"], prereqs:[]},
  {code:"ENGL 236", title:"Reading, Writing, and Archives: Literary Boston", credits:3, difficulty:"Moderate", type:["ENGL"], prereqs:[]},
  {code:"ENGL 242", title:"Grammar for Every Writer", credits:3, difficulty:"Moderate", type:["ENGL"], prereqs:[]},
  {code:"ENGL 248", title:"Utopia/Dystopia Across Culture", credits:3, difficulty:"Moderate", type:["ENGL"], prereqs:[]},
  {code:"ENGL 262G", title:"The Art of Literature", credits:3, difficulty:"Moderate", type:["ENGL"], prereqs:[]},
  {code:"ENGL 268", title:"Outbreak! On Reading Narratives of Infectious Disease", credits:3, difficulty:"Moderate", type:["ENGL"], prereqs:[]},
  {code:"ENGL 270GL", title:"Writing and the Environment", credits:3, difficulty:"Moderate", type:["ENGL"], prereqs:[]},
  {code:"ENGL 272G", title:"The Art of Poetry", credits:3, difficulty:"Moderate", type:["ENGL"], prereqs:[]},
  {code:"ENGL 273G", title:"The Art of Fiction", credits:3, difficulty:"Moderate", type:["ENGL"], prereqs:[]},
  {code:"ENGL 274G", title:"The Art of Drama", credits:3, difficulty:"Moderate", type:["ENGL"], prereqs:[]},
  {code:"ENGL 284", title:"Language, Literacy and Community", credits:3, difficulty:"Moderate", type:["ENGL"], prereqs:[]},
  {code:"ENGL 285", title:"Tutor Training: ESL", credits:3, difficulty:"Moderate", type:["ENGL"], prereqs:[]},
  {code:"ENGL 293L", title:"Literature and Human Rights", credits:3, difficulty:"Moderate", type:["ENGL"], prereqs:[]},
  {code:"ENGL 300", title:"Intermediate Creative Writing Workshop", credits:3, difficulty:"Moderate", type:["ENGL"], prereqs:[]},
  {code:"ENGL 301", title:"Advanced Poetry Workshop", credits:3, difficulty:"Moderate", type:["ENGL"], prereqs:[]},
  {code:"ENGL 302", title:"Advanced Fiction Workshop", credits:3, difficulty:"Moderate", type:["ENGL"], prereqs:[]},
  {code:"ENGL 303", title:"Advanced Special Topics in Creative Writing", credits:3, difficulty:"Moderate", type:["ENGL"], prereqs:[]},
  {code:"ENGL 304", title:"Creative Writing for Children's Literature", credits:3, difficulty:"Moderate", type:["ENGL"], prereqs:[]},
  {code:"ENGL 306", title:"Advanced Nonfiction Writing", credits:3, difficulty:"Moderate", type:["ENGL"], prereqs:[]},
  {code:"ENGL 307", title:"Journalism and Media Writing", credits:3, difficulty:"Moderate", type:["ENGL"], prereqs:[]},
  {code:"ENGL 308", title:"Professional Editing", credits:3, difficulty:"Moderate", type:["ENGL"], prereqs:[]},
  {code:"ENGL 309", title:"Multimedia Authoring", credits:3, difficulty:"Moderate", type:["ENGL"], prereqs:[]},
  {code:"ENGL 312", title:"Digital Culture and Composition", credits:3, difficulty:"Moderate", type:["ENGL"], prereqs:[]},
  {code:"ENGL 316L", title:"Cult Cinema", credits:3, difficulty:"Moderate", type:["ENGL"], prereqs:[]},
  {code:"ENGL 317L", title:"American Independent Cinema", credits:3, difficulty:"Moderate", type:["ENGL"], prereqs:[]},
  {code:"ENGL 320", title:"Memoir and Autobiography", credits:3, difficulty:"Moderate", type:["ENGL"], prereqs:[]},
  {code:"ENGL 322", title:"The Rise of the Novel", credits:3, difficulty:"Moderate", type:["ENGL"], prereqs:[]},
  {code:"ENGL 324", title:"Short Story", credits:3, difficulty:"Moderate", type:["ENGL"], prereqs:[]},
  {code:"ENGL 326", title:"Stage and Page: Drama Before 1642", credits:3, difficulty:"Moderate", type:["ENGL"], prereqs:[]},
  {code:"ENGL 327", title:"Stage and Page: Drama, 1660-1900", credits:3, difficulty:"Moderate", type:["ENGL"], prereqs:[]},
  {code:"ENGL 328", title:"Stage and Page: Drama, 1900-Today", credits:3, difficulty:"Moderate", type:["ENGL"], prereqs:[]},
  {code:"ENGL 331", title:"Satire", credits:3, difficulty:"Moderate", type:["ENGL"], prereqs:[]},
  {code:"ENGL 332", title:"Comedy", credits:3, difficulty:"Moderate", type:["ENGL"], prereqs:[]},
  {code:"ENGL 333", title:"Tragedy", credits:3, difficulty:"Moderate", type:["ENGL"], prereqs:[]},
  {code:"ENGL 334", title:"Science Fiction", credits:3, difficulty:"Moderate", type:["ENGL"], prereqs:[]},
  {code:"ENGL 335", title:"Children's Literature", credits:3, difficulty:"Moderate", type:["ENGL"], prereqs:[]},
  {code:"ENGL 337", title:"Short Novel", credits:3, difficulty:"Moderate", type:["ENGL"], prereqs:[]},
  {code:"ENGL 340", title:"Literature and Visual Media", credits:3, difficulty:"Moderate", type:["ENGL"], prereqs:[]},
  {code:"ENGL 341L", title:"Gender and Film: Multidisciplinary Perspectives", credits:3, difficulty:"Moderate", type:["ENGL"], prereqs:[]},
  {code:"ENGL 343", title:"Literature, Culture and Environment", credits:3, difficulty:"Moderate", type:["ENGL"], prereqs:[]},
  {code:"ENGL 350L", title:"Asian-American Literary Voices", credits:3, difficulty:"Moderate", type:["ENGL"], prereqs:[]},
  {code:"ENGL 351", title:"Early African-American Literature", credits:3, difficulty:"Moderate", type:["ENGL"], prereqs:[]},
  {code:"ENGL 352L", title:"Harlem Renaissance", credits:3, difficulty:"Moderate", type:["ENGL"], prereqs:[]},
  {code:"ENGL 354", title:"Race in American Literature", credits:3, difficulty:"Moderate", type:["ENGL"], prereqs:[]},
  {code:"ENGL 357", title:"African-American Women Writers", credits:3, difficulty:"Moderate", type:["ENGL"], prereqs:[]},
  {code:"ENGL 365", title:"The British Novel and the Nineteenth Century", credits:3, difficulty:"Moderate", type:["ENGL"], prereqs:[]},
  {code:"ENGL 369", title:"Post-1945 American Fiction", credits:3, difficulty:"Moderate", type:["ENGL"], prereqs:[]},
  {code:"ENGL 370", title:"Reading Sexualities: Queer Theory", credits:3, difficulty:"Moderate", type:["ENGL"], prereqs:[]},
  {code:"ENGL 371", title:"The Coming-of-Age Novel", credits:3, difficulty:"Moderate", type:["ENGL"], prereqs:[]},
  {code:"ENGL 376", title:"Literature and the Political Imagination", credits:3, difficulty:"Moderate", type:["ENGL"], prereqs:[]},
  {code:"ENGL 378", title:"Millennial Angst: Reading Precarity in the Twenty-First Century", credits:3, difficulty:"Moderate", type:["ENGL"], prereqs:[]},
  {code:"ENGL 379", title:"Special Topics I", credits:3, difficulty:"Moderate", type:["ENGL"], prereqs:[]},
  {code:"ENGL 380", title:"Special Topics II", credits:3, difficulty:"Moderate", type:["ENGL"], prereqs:[]},
  {code:"ENGL 382", title:"William Shakespeare's Early Works", credits:3, difficulty:"Moderate", type:["ENGL"], prereqs:[]},
  {code:"ENGL 383", title:"William Shakespeare's Later Works", credits:3, difficulty:"Moderate", type:["ENGL"], prereqs:[]},
  {code:"ENGL 396", title:"Jane Austen", credits:3, difficulty:"Moderate", type:["ENGL"], prereqs:[]},
  {code:"ENGL 397", title:"Queer Romanticism", credits:3, difficulty:"Moderate", type:["ENGL"], prereqs:[]},
  {code:"ENGL 401", title:"The Medieval Period", credits:3, difficulty:"Moderate", type:["ENGL"], prereqs:[]},
  {code:"ENGL 402", title:"The Renaissance in England", credits:3, difficulty:"Moderate", type:["ENGL"], prereqs:[]},
  {code:"ENGL 406", title:"The Victorian Age", credits:3, difficulty:"Moderate", type:["ENGL"], prereqs:[]},
  {code:"ENGL 408", title:"American Romanticism", credits:3, difficulty:"Moderate", type:["ENGL"], prereqs:[]},
  {code:"ENGL 410", title:"The Modern Period", credits:3, difficulty:"Moderate", type:["ENGL"], prereqs:[]},
  {code:"ENGL 411", title:"Postcolonial Literary Studies", credits:3, difficulty:"Moderate", type:["ENGL"], prereqs:[]},
  {code:"ENGL 412", title:"Contemporary British Fiction and Film", credits:3, difficulty:"Moderate", type:["ENGL"], prereqs:[]},
  {code:"ENGL 415", title:"Irish Literature", credits:3, difficulty:"Moderate", type:["ENGL"], prereqs:[]},
  {code:"ENGL 418", title:"The Modern Irish Novel", credits:3, difficulty:"Moderate", type:["ENGL"], prereqs:[]},
  {code:"ENGL 437", title:"Reading the Gothic: Transatlantic Terrors", credits:3, difficulty:"Moderate", type:["ENGL"], prereqs:[]},
  {code:"ENGL 438", title:"Reading the Graphic: Texts and Images", credits:3, difficulty:"Moderate", type:["ENGL"], prereqs:[]},
  {code:"ENGL 440", title:"History of the English Language", credits:3, difficulty:"Moderate", type:["ENGL"], prereqs:[]},
  {code:"ENGL 442", title:"Global Englishes and Language Diversity", credits:3, difficulty:"Moderate", type:["ENGL"], prereqs:[]},
  {code:"ENGL 444", title:"Literary Translation and Interpretation", credits:3, difficulty:"Moderate", type:["ENGL"], prereqs:[]},
  {code:"ENGL 448", title:"Perspectives on Literacy", credits:3, difficulty:"Moderate", type:["ENGL"], prereqs:[]},
  {code:"ENGL 450", title:"Teaching Literature", credits:3, difficulty:"Moderate", type:["ENGL"], prereqs:[]},
  {code:"ENGL 451", title:"Teaching Writing", credits:3, difficulty:"Moderate", type:["ENGL"], prereqs:[]},
  {code:"ENGL 452", title:"Teaching English With Digital Technology", credits:3, difficulty:"Moderate", type:["ENGL"], prereqs:[]},
  {code:"ENGL 454", title:"English Internship", credits:3, difficulty:"Moderate", type:["ENGL"], prereqs:[]},
  {code:"ENGL 455", title:"Independent Study I", credits:1, difficulty:"Moderate", type:["ENGL"], prereqs:[]},
  {code:"ENGL 456", title:"Independent Study II", credits:1, difficulty:"Moderate", type:["ENGL"], prereqs:[]},
  {code:"ENGL 457", title:"Undergraduate Colloquium: Career Development for English Majors", credits:1, difficulty:"Moderate", type:["ENGL"], prereqs:[]},
  {code:"ENGL 458", title:"Undergraduate Colloquium: Literature in Public Spaces", credits:1, difficulty:"Moderate", type:["ENGL"], prereqs:[]},
  {code:"ENGL 459", title:"Writing Center Pedagogy, Theory, and Research", credits:3, difficulty:"Moderate", type:["ENGL"], prereqs:[]},
  {code:"ENGL 465", title:"Advanced Studies in Literature and Society", credits:3, difficulty:"Moderate", type:["ENGL"], prereqs:[]},
  {code:"ENGL 466", title:"Advanced Special Topics", credits:3, difficulty:"Moderate", type:["ENGL"], prereqs:[]},
  {code:"ENGL 470", title:"New England Literature and Culture", credits:3, difficulty:"Moderate", type:["ENGL"], prereqs:[]},
  {code:"ENGL 471L", title:"The City in American Literature and Culture", credits:3, difficulty:"Moderate", type:["ENGL"], prereqs:[]},
  {code:"ENGL 475", title:"Professional and News Media Writing Capstone Internship", credits:3, difficulty:"Moderate", type:["ENGL"], prereqs:[]},
  {code:"ENGL 477", title:"Professional and New Media Writing Internship II", credits:3, difficulty:"Moderate", type:["ENGL"], prereqs:[]},
  {code:"ENGL 489", title:"Terrorism and the Novel", credits:3, difficulty:"Moderate", type:["ENGL"], prereqs:[]},
  {code:"ENGL 496", title:"Creative Writing Honors Seminar", credits:3, difficulty:"Moderate", type:["ENGL"], prereqs:[]},
  {code:"ENGL 497", title:"Creative Writing Honors Thesis", credits:3, difficulty:"Moderate", type:["ENGL"], prereqs:[]},
  {code:"ENGL 498", title:"English Honors Seminar", credits:3, difficulty:"Moderate", type:["ENGL"], prereqs:[]},
  {code:"ENGL 499", title:"English Honors Thesis", credits:3, difficulty:"Moderate", type:["ENGL"], prereqs:[]},

    // --------------------------
    // COLLEGE OF LIBERAL ARTS (additional courses)
    // --------------------------
    { code:"FRENCH 100", title:"Intensive Elementary French", credits:8, difficulty:"Hard", type:["FRENCH"], prereqs:[] },
    { code:"FRENCH 101", title:"Elementary French I", credits:4, difficulty:"Easy", type:["FRENCH"], prereqs:[] },
    { code:"FRENCH 102", title:"Elementary French II", credits:4, difficulty:"Easy", type:["FRENCH"], prereqs:[] },
    { code:"FRENCH 201", title:"Intermediate French I", credits:4, difficulty:"Moderate", type:["FRENCH"], prereqs:[] },
    { code:"FRENCH 202", title:"Intermediate French II", credits:4, difficulty:"Moderate", type:["FRENCH"], prereqs:[] },
    { code:"FRENCH 301", title:"Composition et stylistique", credits:3, difficulty:"Hard", type:["FRENCH"], prereqs:[] },
    { code:"FRENCH 303", title:"Intro Lit & Cult II", credits:3, difficulty:"Hard", type:["FRENCH"], prereqs:[] },
    { code:"FRENCH 304", title:"French Conversation", credits:3, difficulty:"Hard", type:["FRENCH"], prereqs:[] },
    { code:"FRENCH 307", title:"French and Francophone Popular Culture", credits:3, difficulty:"Hard", type:["FRENCH"], prereqs:[] },
    { code:"FRENCH 310", title:"French for Heritage Speakers", credits:3, difficulty:"Hard", type:["FRENCH"], prereqs:[] },
    { code:"FRENCH 312", title:"French in the Professional and Business World", credits:3, difficulty:"Hard", type:["FRENCH"], prereqs:[] },
    { code:"FRENCH 314L", title:"Women of the Caribbean: Literature, Art, and Resistance", credits:3, difficulty:"Moderate", type:["FRENCH"], prereqs:[] },
    { code:"FRENCH 337L", title:"Disney's European Fairy Tales", credits:3, difficulty:"Moderate", type:["FRENCH"], prereqs:[] },
    { code:"FRENCH 340L", title:"Moving Across Borders: Migration and Diversity", credits:3, difficulty:"Moderate", type:["FRENCH"], prereqs:[] },
    { code:"FRENCH 345L", title:"Dreams and Visions", credits:3, difficulty:"Moderate", type:["FRENCH"], prereqs:[] },
    { code:"FRENCH 355L", title:"European Crime Fiction", credits:3, difficulty:"Moderate", type:["FRENCH"], prereqs:[] },
    { code:"FRENCH 360", title:"Maps, Monsters, and Monarchs", credits:3, difficulty:"Hard", type:["FRENCH"], prereqs:[] },
    { code:"FRENCH 374L", title:"Love Stories: A Historical Handbook to Happily Ever After", credits:3, difficulty:"Moderate", type:["FRENCH"], prereqs:[] },
    { code:"FRENCH 377L", title:"Rebellion! On Being Young in European Fiction", credits:3, difficulty:"Moderate", type:["FRENCH"], prereqs:[] },
    { code:"FRENCH 378", title:"Independent Study", credits:1, difficulty:"Easy", type:["FRENCH"], prereqs:[] },
    { code:"FRENCH 379", title:"Independent Study", credits:1, difficulty:"Easy", type:["FRENCH"], prereqs:[] },
    { code:"FRENCH 411", title:"Theme et version", credits:3, difficulty:"Hard", type:["FRENCH"], prereqs:[] },
    { code:"FRENCH 440", title:"Cartography and Empire", credits:3, difficulty:"Hard", type:["FRENCH"], prereqs:[] },
    { code:"FRENCH 464", title:"Roman Du 20e Siecle", credits:3, difficulty:"Hard", type:["FRENCH"], prereqs:[] },
    { code:"FRENCH 465", title:"20th Century French Theater", credits:3, difficulty:"Hard", type:["FRENCH"], prereqs:[] },
    { code:"FRENCH 478", title:"Readings & Research", credits:1, difficulty:"Moderate", type:["FRENCH"], prereqs:[] },
    { code:"FRENCH 479", title:"Readings & Research", credits:1, difficulty:"Moderate", type:["FRENCH"], prereqs:[] },
    { code:"FRENCH 480", title:"Images of Otherness in French and Francophone Literature", credits:3, difficulty:"Hard", type:["FRENCH"], prereqs:[] },
    { code:"FRENCH 490", title:"Special Topics", credits:3, difficulty:"Hard", type:["FRENCH"], prereqs:[] },
    { code:"FRENCH 498", title:"Honors Research Project", credits:3, difficulty:"Hard", type:["FRENCH"], prereqs:[] },
    { code:"FRENCH 499", title:"Senior Honors Thesis", credits:3, difficulty:"Hard", type:["FRENCH"], prereqs:[] },

    { code:"GERMAN 100", title:"Intensive Elementary German", credits:8, difficulty:"Hard", type:["GERMAN"], prereqs:[] },
    { code:"GERMAN 101", title:"Elementary German I", credits:4, difficulty:"Easy", type:["GERMAN"], prereqs:[] },
    { code:"GERMAN 102", title:"Elementary German II", credits:4, difficulty:"Easy", type:["GERMAN"], prereqs:[] },
    { code:"GERMAN 200", title:"Intensive Intermediate German", credits:8, difficulty:"Hard", type:["GERMAN"], prereqs:[] },
    { code:"GERMAN 225L", title:"Berlin: Crossroads of History", credits:3, difficulty:"Moderate", type:["GERMAN"], prereqs:[] },
    { code:"GERMAN 255L", title:"Pacting with the Devil: The Faust Tradition", credits:3, difficulty:"Moderate", type:["GERMAN"], prereqs:[] },
    { code:"GERMAN 280", title:"Special Topics in German Literary and Cultural History", credits:3, difficulty:"Moderate", type:["GERMAN"], prereqs:[] },
    { code:"GERMAN 337L", title:"Disney's European Fairy Tales", credits:3, difficulty:"Moderate", type:["GERMAN"], prereqs:[] },
    { code:"GERMAN 340L", title:"Moving Across Borders: Migration and Diversity", credits:3, difficulty:"Moderate", type:["GERMAN"], prereqs:[] },
    { code:"GERMAN 345L", title:"Dreams and Visions", credits:3, difficulty:"Moderate", type:["GERMAN"], prereqs:[] },
    { code:"GERMAN 350L", title:"Green Germany: Environmental Thought and Policy", credits:3, difficulty:"Moderate", type:["GERMAN"], prereqs:[] },
    { code:"GERMAN 355L", title:"European Crime Fiction", credits:3, difficulty:"Moderate", type:["GERMAN"], prereqs:[] },
    { code:"GERMAN 365L", title:"German Pop Culture", credits:3, difficulty:"Moderate", type:["GERMAN"], prereqs:[] },
    { code:"GERMAN 372L", title:"German Cinema", credits:3, difficulty:"Moderate", type:["GERMAN"], prereqs:[] },
    { code:"GERMAN 374L", title:"Love Stories: A Historical Handbook to Happily Ever After", credits:3, difficulty:"Moderate", type:["GERMAN"], prereqs:[] },
    { code:"GERMAN 377L", title:"Rebellion! On Being Young in European Fiction", credits:3, difficulty:"Moderate", type:["GERMAN"], prereqs:[] },
    { code:"GERMAN 379", title:"Independent Study", credits:1, difficulty:"Easy", type:["GERMAN"], prereqs:[] },

    { code:"GLBAFF 220", title:"Introduction to Global Affairs", credits:3, difficulty:"Moderate", type:["GLBAFF"], prereqs:[] },
    { code:"GLBAFF 301", title:"Contemporary Issues in Global Affairs", credits:3, difficulty:"Hard", type:["GLBAFF"], prereqs:[] },
    { code:"GLBAFF 305", title:"Global Communications and Information", credits:3, difficulty:"Hard", type:["GLBAFF"], prereqs:[] },
    { code:"GLBAFF 308", title:"Human Security", credits:3, difficulty:"Hard", type:["GLBAFF"], prereqs:[] },
    { code:"GLBAFF 309", title:"International Terrorism", credits:3, difficulty:"Hard", type:["GLBAFF"], prereqs:[] },
    { code:"GLBAFF 310", title:"Global Financial Markets", credits:3, difficulty:"Hard", type:["GLBAFF"], prereqs:[] },
    { code:"GLBAFF 311", title:"Global Health Issues", credits:3, difficulty:"Hard", type:["GLBAFF"], prereqs:[] },
    { code:"GLBAFF 312", title:"International Institutions and Management of Development", credits:3, difficulty:"Hard", type:["GLBAFF"], prereqs:[] },
    { code:"GLBAFF 313", title:"Regional Political Economy", credits:3, difficulty:"Hard", type:["GLBAFF"], prereqs:[] },
    { code:"GLBAFF 350", title:"Research and Methods in Global Affairs", credits:3, difficulty:"Hard", type:["GLBAFF"], prereqs:[] },
    { code:"GLBAFF 424", title:"Foreign Policy Analysis", credits:3, difficulty:"Hard", type:["GLBAFF"], prereqs:[] },
    { code:"GLBAFF 450", title:"Special Topics in Global Affairs", credits:3, difficulty:"Hard", type:["GLBAFF"], prereqs:[] },
    { code:"GLBAFF 478", title:"Independent Study in Global Affairs", credits:1, difficulty:"Easy", type:["GLBAFF"], prereqs:[] },
    { code:"GLBAFF 490", title:"Capstone/Internship in Global Affairs", credits:3, difficulty:"Hard", type:["GLBAFF"], prereqs:[] },

    { code:"GREEK 101", title:"Elementary Classical Greek I", credits:4, difficulty:"Moderate", type:["GREEK"], prereqs:[] },
    { code:"GREEK 102", title:"Elementary Classical Greek II", credits:4, difficulty:"Moderate", type:["GREEK"], prereqs:[] },
    { code:"GREEK 211", title:"Intermediate Greek", credits:3, difficulty:"Moderate", type:["GREEK"], prereqs:[] },
    { code:"GREEK 220", title:"Readings in Greek Literature", credits:3, difficulty:"Moderate", type:["GREEK"], prereqs:[] },
    { code:"GREEK 222", title:"Intermediate Greek II: Homer", credits:3, difficulty:"Moderate", type:["GREEK"], prereqs:[] },
    { code:"GREEK 301", title:"Attic Orators", credits:3, difficulty:"Hard", type:["GREEK"], prereqs:[] },
    { code:"GREEK 302", title:"Plato", credits:3, difficulty:"Hard", type:["GREEK"], prereqs:[] },
    { code:"GREEK 303", title:"Aeschylus", credits:3, difficulty:"Hard", type:["GREEK"], prereqs:[] },
    { code:"GREEK 305", title:"Euripides", credits:3, difficulty:"Hard", type:["GREEK"], prereqs:[] },
    { code:"GREEK 309", title:"Lyric Poetry", credits:3, difficulty:"Hard", type:["GREEK"], prereqs:[] },
    { code:"GREEK 310", title:"Epic Poetry", credits:3, difficulty:"Hard", type:["GREEK"], prereqs:[] },
    { code:"GREEK 397", title:"Special Topics", credits:3, difficulty:"Hard", type:["GREEK"], prereqs:[] },
    { code:"GREEK 478", title:"Independent Study", credits:1, difficulty:"Easy", type:["GREEK"], prereqs:[] },
    { code:"GREEK 479", title:"Independent Study", credits:1, difficulty:"Easy", type:["GREEK"], prereqs:[] },
    { code:"GREEK 490", title:"Honors", credits:1, difficulty:"Hard", type:["GREEK"], prereqs:[] },

    { code:"HIST 101", title:"Introduction to Historical Thinking and Analysis", credits:3, difficulty:"Easy", type:["HIST"], prereqs:[] },
    { code:"HIST 115L", title:"Survey of South Asia", credits:3, difficulty:"Moderate", type:["HIST"], prereqs:[] },
    { code:"HIST 125L", title:"Jerusalem: Sacred Space, Contested Space", credits:3, difficulty:"Moderate", type:["HIST"], prereqs:[] },
    { code:"HIST 150", title:"Food and Empire", credits:3, difficulty:"Easy", type:["HIST"], prereqs:[] },
    { code:"HIST 152", title:"Crime, Corruption, and Scandal in Historical Perspective", credits:3, difficulty:"Easy", type:["HIST"], prereqs:[] },
    { code:"HIST 155", title:"Propaganda in History", credits:3, difficulty:"Easy", type:["HIST"], prereqs:[] },
    { code:"HIST 160L", title:"East Asian Civilizations to 1850", credits:3, difficulty:"Moderate", type:["HIST"], prereqs:[] },
    { code:"HIST 161L", title:"East Asian Civilizations since 1850", credits:3, difficulty:"Moderate", type:["HIST"], prereqs:[] },
    { code:"HIST 171", title:"Leeches to Lasers: Medicine and Health in the United States", credits:3, difficulty:"Easy", type:["HIST"], prereqs:[] },
    { code:"HIST 173", title:"Baseball and American History", credits:3, difficulty:"Easy", type:["HIST"], prereqs:[] },
    { code:"HIST 175", title:"Comic Books in America: The History of Comic Books and American Society since 1938", credits:3, difficulty:"Easy", type:["HIST"], prereqs:[] },
    { code:"HIST 178", title:"Special Topics in History", credits:3, difficulty:"Easy", type:["HIST"], prereqs:[] },
    { code:"HIST 182", title:"Touring the City: An Introduction to Public History", credits:3, difficulty:"Easy", type:["HIST"], prereqs:[] },
    { code:"HIST 185", title:"Mascots, Monuments, Massacres: Native American History in the Public Sphere", credits:3, difficulty:"Easy", type:["HIST"], prereqs:[] },
    { code:"HIST 186", title:"Road to Black Lives Matter: History of Violence Towards African Americans", credits:3, difficulty:"Easy", type:["HIST"], prereqs:[] },
    { code:"HIST 210L", title:"Labor and Working Class History in the United States", credits:3, difficulty:"Moderate", type:["HIST"], prereqs:[] },
    { code:"HIST 211", title:"Europe to 1600", credits:3, difficulty:"Moderate", type:["HIST"], prereqs:[] },
    { code:"HIST 212", title:"Modern Europe", credits:3, difficulty:"Moderate", type:["HIST"], prereqs:[] },
    { code:"HIST 213", title:"World History to 1800", credits:3, difficulty:"Moderate", type:["HIST"], prereqs:[] },
    { code:"HIST 214", title:"Modern World History", credits:3, difficulty:"Moderate", type:["HIST"], prereqs:[] },
    { code:"HIST 219", title:"History of the Mediterranean", credits:3, difficulty:"Moderate", type:["HIST"], prereqs:[] },
    { code:"HIST 220", title:"History of European Empires", credits:3, difficulty:"Moderate", type:["HIST"], prereqs:[] },
    { code:"HIST 225L", title:"Berlin: Crossroads of History", credits:3, difficulty:"Moderate", type:["HIST"], prereqs:[] },
    { code:"HIST 230L", title:"Ancient Egypt", credits:3, difficulty:"Moderate", type:["HIST"], prereqs:[] },
    { code:"HIST 233L", title:"The Homeric Warrior", credits:3, difficulty:"Moderate", type:["HIST"], prereqs:[] },
    { code:"HIST 251L", title:"South Asia and the India Ocean World", credits:3, difficulty:"Moderate", type:["HIST"], prereqs:[] },
    { code:"HIST 252", title:"African History to 1800", credits:3, difficulty:"Moderate", type:["HIST"], prereqs:[] },
    { code:"HIST 253", title:"African History since 1800", credits:3, difficulty:"Moderate", type:["HIST"], prereqs:[] },
    { code:"HIST 255L", title:"Gods and Slaves: Latin America before 1800", credits:3, difficulty:"Moderate", type:["HIST"], prereqs:[] },
    { code:"HIST 256L", title:"Skyscrapers and Shantytowns: Latin America since 1800", credits:3, difficulty:"Moderate", type:["HIST"], prereqs:[] },
    { code:"HIST 262L", title:"American Indian History to 1783", credits:3, difficulty:"Moderate", type:["HIST"], prereqs:[] },
    { code:"HIST 263L", title:"Modern American Indian Social and Political History: From the American Revolution to Standing Rock", credits:3, difficulty:"Moderate", type:["HIST"], prereqs:[] },
    { code:"HIST 265", title:"American History before 1877", credits:3, difficulty:"Moderate", type:["HIST"], prereqs:[] },
    { code:"HIST 266", title:"American History since 1877", credits:3, difficulty:"Moderate", type:["HIST"], prereqs:[] },
    { code:"HIST 271", title:"SURVEY OF AFRO-AMERICAN HISTORY", credits:3, difficulty:"Moderate", type:["HIST"], prereqs:[] },
    { code:"HIST 275L", title:"Learning to Labor: Work and Education in US History", credits:3, difficulty:"Moderate", type:["HIST"], prereqs:[] },
    { code:"HIST 276", title:"This Land is Your Land: A Survey of American Environmental History", credits:3, difficulty:"Moderate", type:["HIST"], prereqs:[] },
    { code:"HIST 278L", title:"Introduction to Native American and Indigenous Studies", credits:3, difficulty:"Moderate", type:["HIST"], prereqs:[] },
    { code:"HIST 280", title:"Special Topics", credits:3, difficulty:"Moderate", type:["HIST"], prereqs:[] },
    { code:"HIST 285L", title:"Food in American Culture", credits:3, difficulty:"Moderate", type:["HIST"], prereqs:[] },
    { code:"HIST 290G", title:"Globalization in Historical Perspective", credits:3, difficulty:"Moderate", type:["HIST"], prereqs:[] },
    { code:"HIST 301L", title:"Ancient Greek History", credits:3, difficulty:"Moderate", type:["HIST"], prereqs:[] },
    { code:"HIST 302L", title:"Roman History", credits:3, difficulty:"Moderate", type:["HIST"], prereqs:[] },
    { code:"HIST 303L", title:"The Archaeology of Ancient Greece", credits:3, difficulty:"Moderate", type:["HIST"], prereqs:[] },
    { code:"HIST 304", title:"Early Middle Ages: Europe 300-1000", credits:3, difficulty:"Hard", type:["HIST"], prereqs:[] },
    { code:"HIST 305", title:"Later Middle Ages: Europe 1000-1450", credits:3, difficulty:"Hard", type:["HIST"], prereqs:[] },
    { code:"HIST 307", title:"Renaissance and Reformation", credits:3, difficulty:"Hard", type:["HIST"], prereqs:[] },
    { code:"HIST 311L", title:"The Fall of Rome", credits:3, difficulty:"Moderate", type:["HIST"], prereqs:[] },
    { code:"HIST 312", title:"Cities in Early Modern Europe", credits:3, difficulty:"Hard", type:["HIST"], prereqs:[] },
    { code:"HIST 314", title:"Health and Healing in Early Modern Europe", credits:3, difficulty:"Hard", type:["HIST"], prereqs:[] },
    { code:"HIST 315", title:"Europe 1900-1945", credits:3, difficulty:"Hard", type:["HIST"], prereqs:[] },
    { code:"HIST 318", title:"Advanced Topics in History", credits:3, difficulty:"Hard", type:["HIST"], prereqs:[] },
    { code:"HIST 320L", title:"Bronze Age Aegean Archaeology", credits:3, difficulty:"Moderate", type:["HIST"], prereqs:[] },
    { code:"HIST 322", title:"Shakespeare's London", credits:3, difficulty:"Hard", type:["HIST"], prereqs:[] },
    { code:"HIST 324", title:"Russia and the Soviet Union: From the 1917 Revolution to Putin", credits:3, difficulty:"Hard", type:["HIST"], prereqs:[] },
    { code:"HIST 326", title:"Hitler, A Man and His Times", credits:3, difficulty:"Hard", type:["HIST"], prereqs:[] },
    { code:"HIST 330", title:"The French Revolution", credits:3, difficulty:"Hard", type:["HIST"], prereqs:[] },
    { code:"HIST 331", title:"Liberty, Equality, Fraternity? A History of Modern France", credits:3, difficulty:"Hard", type:["HIST"], prereqs:[] },
    { code:"HIST 337", title:"Making a \"Second Sex\": Women and Gender in Modern European History", credits:3, difficulty:"Hard", type:["HIST"], prereqs:[] },
    { code:"HIST 342", title:"Cinema in Hitler's Germany: Movies, Propaganda, Politics in Weimar and Nazi Germany 1919-1945", credits:3, difficulty:"Hard", type:["HIST"], prereqs:[] },
    { code:"HIST 346", title:"Women & Gender in African History", credits:3, difficulty:"Hard", type:["HIST"], prereqs:[] },
    { code:"HIST 347", title:"Feast to Famine: Food in African History", credits:3, difficulty:"Hard", type:["HIST"], prereqs:[] },
    { code:"HIST 349L", title:"The Cold War: Rise and Fall", credits:3, difficulty:"Moderate", type:["HIST"], prereqs:[] },
    { code:"HIST 350", title:"Mexico since 1850", credits:3, difficulty:"Hard", type:["HIST"], prereqs:[] },
    { code:"HIST 351", title:"Histories of Brazil", credits:3, difficulty:"Hard", type:["HIST"], prereqs:[] },
    { code:"HIST 352", title:"Topics in African History", credits:3, difficulty:"Hard", type:["HIST"], prereqs:[] },
    { code:"HIST 357", title:"The Vietnam War", credits:3, difficulty:"Hard", type:["HIST"], prereqs:[] },
    { code:"HIST 359L", title:"Women in Modern China", credits:3, difficulty:"Moderate", type:["HIST"], prereqs:[] },
    { code:"HIST 361L", title:"The History of Modern China", credits:3, difficulty:"Moderate", type:["HIST"], prereqs:[] },
    { code:"HIST 363L", title:"Modern Japan", credits:3, difficulty:"Moderate", type:["HIST"], prereqs:[] },
    { code:"HIST 364L", title:"India since 1857", credits:3, difficulty:"Moderate", type:["HIST"], prereqs:[] },
    { code:"HIST 365L", title:"The Muslim World Since 1979", credits:3, difficulty:"Moderate", type:["HIST"], prereqs:[] },
    { code:"HIST 368", title:"ANTEBELLUM AFRICAN AMERICAN HISTORY", credits:3, difficulty:"Hard", type:["HIST"], prereqs:[] },
    { code:"HIST 371", title:"The American Revolution, 1763-1789", credits:3, difficulty:"Hard", type:["HIST"], prereqs:[] },
    { code:"HIST 372", title:"The Early Republic", credits:3, difficulty:"Hard", type:["HIST"], prereqs:[] },
    { code:"HIST 375", title:"The US Civil War and Reconstruction", credits:3, difficulty:"Hard", type:["HIST"], prereqs:[] },
    { code:"HIST 377", title:"The American Progressive Era, 1890-1920", credits:3, difficulty:"Hard", type:["HIST"], prereqs:[] },
    { code:"HIST 378", title:"Colliding Cultures: America in the 1920s", credits:3, difficulty:"Hard", type:["HIST"], prereqs:[] },
    { code:"HIST 380", title:"The United States Since 1945", credits:3, difficulty:"Hard", type:["HIST"], prereqs:[] },
    { code:"HIST 384", title:"E Pluribus Unum?: American Immigration and Ethnicity", credits:3, difficulty:"Hard", type:["HIST"], prereqs:[] },
    { code:"HIST 386", title:"Native American Health in Historical Perspective", credits:3, difficulty:"Hard", type:["HIST"], prereqs:[] },
    { code:"HIST 390L", title:"Working-Class Boston", credits:3, difficulty:"Moderate", type:["HIST"], prereqs:[] },
    { code:"HIST 392", title:"American Women in Biography", credits:3, difficulty:"Hard", type:["HIST"], prereqs:[] },
    { code:"HIST 395", title:"The History of Boston", credits:3, difficulty:"Hard", type:["HIST"], prereqs:[] },
    { code:"HIST 402L", title:"History of US Visual Media", credits:3, difficulty:"Moderate", type:["HIST"], prereqs:[] },
    { code:"HIST 411L", title:"Post 9/11 Culture: Rumors, Stories and Songs", credits:3, difficulty:"Moderate", type:["HIST"], prereqs:[] },
    { code:"HIST 413", title:"Saints, Witches and Heretics", credits:3, difficulty:"Hard", type:["HIST"], prereqs:[] },
    { code:"HIST 433", title:"Mussolini", credits:3, difficulty:"Hard", type:["HIST"], prereqs:[] },
    { code:"HIST 440L", title:"United States in a Global Context", credits:3, difficulty:"Moderate", type:["HIST"], prereqs:[] },
    { code:"HIST 462", title:"A Nation in Turmoil: The United States, 1815-1850", credits:3, difficulty:"Hard", type:["HIST"], prereqs:[] },
    { code:"HIST 468", title:"Age of FDR: America in Depression and War", credits:3, difficulty:"Hard", type:["HIST"], prereqs:[] },
    { code:"HIST 478", title:"Special Topics Seminar in History", credits:3, difficulty:"Hard", type:["HIST"], prereqs:[] },
    { code:"HIST 481", title:"Research & Methods: Senior Research Methods in History", credits:3, difficulty:"Hard", type:["HIST"], prereqs:[] },
    { code:"HIST 487", title:"Cooperative Education/Internship, History", credits:3, difficulty:"Hard", type:["HIST"], prereqs:[] },
    { code:"HIST 488", title:"Independent Reading", credits:1, difficulty:"Easy", type:["HIST"], prereqs:[] },
    { code:"HIST 489", title:"Independent Reading", credits:1, difficulty:"Easy", type:["HIST"], prereqs:[] },
    { code:"HIST 490", title:"Honors Thesis", credits:3, difficulty:"Hard", type:["HIST"], prereqs:[] },

    { code:"HUMAN 255L", title:"Pacting with the Devil: The Faust Tradition", credits:3, difficulty:"Moderate", type:["HUMAN"], prereqs:[] },

    { code:"HUMCTR 220", title:"The Life Cycle and the Environment", credits:3, difficulty:"Moderate", type:["HUMCTR"], prereqs:[] },
    { code:"HUMCTR 230", title:"History of Social Welfare", credits:3, difficulty:"Moderate", type:["HUMCTR"], prereqs:[] },
    { code:"HUMCTR 320", title:"Intervention with Individuals and Small Groups", credits:3, difficulty:"Hard", type:["HUMCTR"], prereqs:[] },
    { code:"HUMCTR 322", title:"Intervention with Large Systems", credits:3, difficulty:"Hard", type:["HUMCTR"], prereqs:[] },
    { code:"HUMCTR 330", title:"Human Service Systems for Contemporary Families", credits:3, difficulty:"Hard", type:["HUMCTR"], prereqs:[] },
    { code:"HUMCTR 345", title:"Professional Responsibility and Ethics", credits:3, difficulty:"Hard", type:["HUMCTR"], prereqs:[] },
    { code:"HUMCTR 370", title:"Human Services Special Topics", credits:3, difficulty:"Hard", type:["HUMCTR"], prereqs:[] },
    { code:"HUMCTR 371", title:"Diversity and Cultural Competence", credits:3, difficulty:"Hard", type:["HUMCTR"], prereqs:[] },
    { code:"HUMCTR 372", title:"Human Services Directed Study for Credit", credits:3, difficulty:"Hard", type:["HUMCTR"], prereqs:[] },
    { code:"HUMCTR 401", title:"Research and Information for Evidence-based Practice", credits:3, difficulty:"Hard", type:["HUMCTR"], prereqs:[] },
    { code:"HUMCTR 420", title:"Professional Internship Seminar", credits:3, difficulty:"Hard", type:["HUMCTR"], prereqs:[] },
    { code:"HUMCTR 421", title:"Human Service Policy and Practice (Capstone)", credits:3, difficulty:"Hard", type:["HUMCTR"], prereqs:[] },
    { code:"HUMCTR 425", title:"Case Management", credits:3, difficulty:"Hard", type:["HUMCTR"], prereqs:[] },

    { code:"IR 499L", title:"Seminar in International Relations (B)", credits:3, difficulty:"Moderate", type:["IR"], prereqs:[] },

    { code:"ITAL 100", title:"Intensive Elementary Italian", credits:8, difficulty:"Hard", type:["ITAL"], prereqs:[] },
    { code:"ITAL 101", title:"Elementary Italian I", credits:4, difficulty:"Easy", type:["ITAL"], prereqs:[] },
    { code:"ITAL 102", title:"Elementary Italian II", credits:4, difficulty:"Easy", type:["ITAL"], prereqs:[] },
    { code:"ITAL 201", title:"Intermediate Italian Language Through Film and Television", credits:3, difficulty:"Moderate", type:["ITAL"], prereqs:[] },
    { code:"ITAL 202", title:"Intermediate Italian II", credits:3, difficulty:"Moderate", type:["ITAL"], prereqs:[] },
    { code:"ITAL 267", title:"The Renaissance View of Man: Princes, Prostitutes, Poets, and Painters", credits:3, difficulty:"Moderate", type:["ITAL"], prereqs:[] },
    { code:"ITAL 268L", title:"The Italian-American Experience", credits:3, difficulty:"Moderate", type:["ITAL"], prereqs:[] },
    { code:"ITAL 270", title:"Dante's Divine Comedy", credits:3, difficulty:"Moderate", type:["ITAL"], prereqs:[] },
    { code:"ITAL 276L", title:"Italian Cinema", credits:3, difficulty:"Moderate", type:["ITAL"], prereqs:[] },
    { code:"ITAL 301", title:"Italian Composition and Conversation", credits:3, difficulty:"Hard", type:["ITAL"], prereqs:[] },
    { code:"ITAL 305", title:"Language of Modern Italy", credits:3, difficulty:"Hard", type:["ITAL"], prereqs:[] },
    { code:"ITAL 311", title:"Introduction to Italian Literature I", credits:3, difficulty:"Hard", type:["ITAL"], prereqs:[] },
    { code:"ITAL 313L", title:"The Art of Early Modern Venice: Myths and Realities of a Floating City", credits:3, difficulty:"Moderate", type:["ITAL"], prereqs:[] },
    { code:"ITAL 337L", title:"Disney's European Fairy Tales", credits:3, difficulty:"Moderate", type:["ITAL"], prereqs:[] },
    { code:"ITAL 340L", title:"Moving Across Borders: Migration and Diversity", credits:3, difficulty:"Moderate", type:["ITAL"], prereqs:[] },
    { code:"ITAL 345L", title:"Dreams and Visions", credits:3, difficulty:"Moderate", type:["ITAL"], prereqs:[] },
    { code:"ITAL 355L", title:"European Crime Fiction", credits:3, difficulty:"Moderate", type:["ITAL"], prereqs:[] },
    { code:"ITAL 374L", title:"Love Stories: A Historical Handbook to Happily Ever After", credits:3, difficulty:"Moderate", type:["ITAL"], prereqs:[] },
    { code:"ITAL 377L", title:"Rebellion! On Being Young in European Fiction", credits:3, difficulty:"Moderate", type:["ITAL"], prereqs:[] },
    { code:"ITAL 378", title:"Independent Study", credits:1, difficulty:"Easy", type:["ITAL"], prereqs:[] },
    { code:"ITAL 379", title:"Independent Study", credits:1, difficulty:"Easy", type:["ITAL"], prereqs:[] },
    { code:"ITAL 479", title:"Readings & Research", credits:3, difficulty:"Moderate", type:["ITAL"], prereqs:[] },
    { code:"ITAL 476", title:"Capstone Seminar in Italian Studies", credits:3, difficulty:"Hard", type:["ITAL","Capstone"], prereqs:[] },
    { code:"ITAL 498", title:"Honors Research Project", credits:3, difficulty:"Hard", type:["ITAL"], prereqs:[] },
    { code:"ITAL 499", title:"Senior Honors Thesis", credits:3, difficulty:"Hard", type:["ITAL"], prereqs:[] },

    { code:"JAPAN 100", title:"Intensive Elementary Japanese", credits:8, difficulty:"Hard", type:["JAPAN"], prereqs:[] },
    { code:"JAPAN 101", title:"Elementary Japanese I", credits:4, difficulty:"Easy", type:["JAPAN"], prereqs:[] },
    { code:"JAPAN 102", title:"Elementary Japanese II", credits:4, difficulty:"Moderate", type:["JAPAN"], prereqs:[] },
    { code:"JAPAN 201", title:"Intermediate Japanese I", credits:3, difficulty:"Moderate", type:["JAPAN"], prereqs:[] },
    { code:"JAPAN 202", title:"Intermediate Japanese II", credits:3, difficulty:"Moderate", type:["JAPAN"], prereqs:[] },
    { code:"JAPAN 222L", title:"Introduction to Japanese Music", credits:3, difficulty:"Moderate", type:["JAPAN"], prereqs:[] },
    { code:"JAPAN 252L", title:"Premodern Japanese Culture: From Ancient Times to 1868", credits:3, difficulty:"Moderate", type:["JAPAN"], prereqs:[] },
    { code:"JAPAN 260", title:"Japanese Theatre", credits:3, difficulty:"Moderate", type:["JAPAN"], prereqs:[] },
    { code:"JAPAN 270", title:"Contemporary Japan", credits:3, difficulty:"Moderate", type:["JAPAN"], prereqs:[] },
    { code:"JAPAN 290", title:"Special Topics", credits:3, difficulty:"Moderate", type:["JAPAN"], prereqs:[] },
    { code:"JAPAN 301", title:"Advanced Intermediate Japanese I", credits:3, difficulty:"Hard", type:["JAPAN"], prereqs:[] },
    { code:"JAPAN 302", title:"Advanced Intermediate Japanese II", credits:3, difficulty:"Hard", type:["JAPAN"], prereqs:[] },
    { code:"JAPAN 367L", title:"Food and Culture in Japan: National Identity and Diversity, Past and Present", credits:3, difficulty:"Moderate", type:["JAPAN"], prereqs:[] },
    { code:"JAPAN 378", title:"Independent Study", credits:1, difficulty:"Easy", type:["JAPAN"], prereqs:[] },
    { code:"JAPAN 379", title:"Independent Study", credits:1, difficulty:"Easy", type:["JAPAN"], prereqs:[] },
    { code:"JAPAN 385L", title:"Topics in Japanese Cinema", credits:3, difficulty:"Moderate", type:["JAPAN"], prereqs:[] },
    { code:"JAPAN 479", title:"Readings & Research", credits:3, difficulty:"Hard", type:["JAPAN"], prereqs:[] },

    { code:"LABOR 111G", title:"Work and Society", credits:4, difficulty:"Moderate", type:["LABOR"], prereqs:[] },
    { code:"LABOR 120L", title:"Sports and Inequality: Race, Class, Gender, and the Labor of Sweat", credits:3, difficulty:"Moderate", type:["LABOR"], prereqs:[] },
    { code:"LABOR 180", title:"Special Topics in Labor Studies", credits:3, difficulty:"Easy", type:["LABOR"], prereqs:[] },
    { code:"LABOR 210L", title:"Labor and Working Class History in the United States", credits:3, difficulty:"Moderate", type:["LABOR"], prereqs:[] },
    { code:"LABOR 222G", title:"Labor and Migration", credits:3, difficulty:"Moderate", type:["LABOR"], prereqs:[] },
    { code:"LABOR 240L", title:"Work, Environment, and Revolution in Latin America", credits:3, difficulty:"Moderate", type:["LABOR"], prereqs:[] },
    { code:"LABOR 250L", title:"The Hands that Feed Us: Food, Labor, Race, and Migration in the U.S.", credits:3, difficulty:"Moderate", type:["LABOR"], prereqs:[] },
    { code:"LABOR 275L", title:"Learning to Labor: Work and Education in US History", credits:3, difficulty:"Moderate", type:["LABOR"], prereqs:[] },
    { code:"LABOR 315", title:"Labor, Community, and Social Justice Organizing", credits:3, difficulty:"Hard", type:["LABOR"], prereqs:[] },
    { code:"LABOR 325", title:"Workers' Rights and Human Rights", credits:3, difficulty:"Hard", type:["LABOR"], prereqs:[] },
    { code:"LABOR 330", title:"Race, Class, and Gender at Work: Divisions in Labor", credits:3, difficulty:"Hard", type:["LABOR"], prereqs:[] },
    { code:"LABOR 335", title:"Globalization and Labor", credits:3, difficulty:"Hard", type:["LABOR"], prereqs:[] },
    { code:"LABOR 340", title:"Field Placements in Workers' Organizations", credits:3, difficulty:"Hard", type:["LABOR"], prereqs:[] },
    { code:"LABOR 390L", title:"Working-Class Boston", credits:3, difficulty:"Moderate", type:["LABOR"], prereqs:[] },
    { code:"LABOR 480", title:"Independent Study", credits:1, difficulty:"Moderate", type:["LABOR"], prereqs:[] },

  // ===== College of Liberal Arts (added) =====
    { code:"LATAM 101", title:"Latin America: Contemporary Society and Culture", credits:3, difficulty:"Easy", type:["LATAM"], prereqs:[] },
    { code:"LATAM 160", title:"Building Language Justice: Translation, Migration, and Linguistic Human Rights", credits:3, difficulty:"Easy", type:["LATAM"], prereqs:[] },
    { code:"LATAM 205L", title:"Latin American Film", credits:3, difficulty:"Moderate", type:["LATAM", "Lab"], prereqs:[] },
    { code:"LATAM 210G", title:"Food, Culture, and Society in Latin America", credits:3, difficulty:"Moderate", type:["LATAM", "GenEd"], prereqs:[] },
    { code:"LATAM 240L", title:"Work, Environment, and Revolution in Latin America", credits:3, difficulty:"Moderate", type:["LATAM", "Lab"], prereqs:[] },
    { code:"LATAM 255L", title:"Gods and Slaves: Latin America before 1800", credits:3, difficulty:"Moderate", type:["LATAM", "Lab"], prereqs:[] },
    { code:"LATAM 256L", title:"Skyscrapers and Shantytowns: Latin America since 1800", credits:3, difficulty:"Moderate", type:["LATAM", "Lab"], prereqs:[] },
    { code:"LATAM 262L", title:"Latin American, Iberian, and Afro-Luso-Brazilian Literatures in Translation", credits:3, difficulty:"Moderate", type:["LATAM", "Lab"], prereqs:[] },
    { code:"LATAM 270", title:"Human Rights in Latin America", credits:3, difficulty:"Moderate", type:["LATAM"], prereqs:[] },
    { code:"LATAM 303", title:"Reform and Revolution in Latin America", credits:3, difficulty:"Hard", type:["LATAM"], prereqs:[] },
    { code:"LATAM 305", title:"The Caribbean: Culture and Society", credits:3, difficulty:"Hard", type:["LATAM"], prereqs:[] },
    { code:"LATAM 360", title:"Language and Power in the Americas", credits:3, difficulty:"Hard", type:["LATAM"], prereqs:[] },
    { code:"LATAM 375L", title:"Afro-Luso-Brazilian Cultures", credits:3, difficulty:"Hard", type:["LATAM", "Lab"], prereqs:[] },
    { code:"LATAM 454L", title:"Argentina", credits:3, difficulty:"Hard", type:["LATAM", "Lab"], prereqs:[] },
    { code:"LATAM 478", title:"Independent Study", credits:1, difficulty:"Easy", type:["LATAM"], prereqs:[] },
    { code:"LATAM 479", title:"Independent Study", credits:1, difficulty:"Easy", type:["LATAM"], prereqs:[] },
    { code:"LATAM 485", title:"Special Topics", credits:3, difficulty:"Hard", type:["LATAM"], prereqs:[] },
    { code:"LATAM 490L", title:"Internship Course in Latin American and Iberian Studies", credits:3, difficulty:"Hard", type:["LATAM", "Lab", "Internship"], prereqs:[] },

    { code:"LATIN 101", title:"Fundamentals of Latin I", credits:4, difficulty:"Easy", type:["LATIN"], prereqs:[] },
    { code:"LATIN 102", title:"Fundamentals of Latin II", credits:4, difficulty:"Easy", type:["LATIN"], prereqs:[] },
    { code:"LATIN 201", title:"Intermed Latin", credits:3, difficulty:"Moderate", type:["LATIN"], prereqs:[] },
    { code:"LATIN 202", title:"Ovid-Metamorphoses", credits:3, difficulty:"Moderate", type:["LATIN"], prereqs:[] },
    { code:"LATIN 220", title:"Readings in Latin Literature", credits:3, difficulty:"Moderate", type:["LATIN"], prereqs:[] },
    { code:"LATIN 300", title:"Roma Aeterna: Latin Reading Fluency", credits:3, difficulty:"Hard", type:["LATIN"], prereqs:[] },
    { code:"LATIN 301", title:"Cicero", credits:3, difficulty:"Hard", type:["LATIN"], prereqs:[] },
    { code:"LATIN 303", title:"Roman Comedy", credits:3, difficulty:"Hard", type:["LATIN"], prereqs:[] },
    { code:"LATIN 309", title:"Lucretius", credits:3, difficulty:"Hard", type:["LATIN"], prereqs:[] },
    { code:"LATIN 310", title:"Virgil", credits:3, difficulty:"Hard", type:["LATIN"], prereqs:[] },
    { code:"LATIN 311", title:"The Roman Novel: Petronius and Apuleius", credits:3, difficulty:"Hard", type:["LATIN"], prereqs:[] },
    { code:"LATIN 320", title:"Latin Letters", credits:3, difficulty:"Hard", type:["LATIN"], prereqs:[] },
    { code:"LATIN 321", title:"Advanced Readings in Latin Literature", credits:3, difficulty:"Hard", type:["LATIN"], prereqs:[] },
    { code:"LATIN 325", title:"Literature in the Age of Nero", credits:3, difficulty:"Hard", type:["LATIN"], prereqs:[] },
    { code:"LATIN 376", title:"Latin Prose Composition", credits:3, difficulty:"Hard", type:["LATIN"], prereqs:[] },
    { code:"LATIN 397", title:"Special Topics", credits:3, difficulty:"Hard", type:["LATIN"], prereqs:[] },
    { code:"LATIN 415", title:"Methods of Teaching in the Latin Language", credits:3, difficulty:"Hard", type:["LATIN"], prereqs:[] },
    { code:"LATIN 478", title:"Independent Study", credits:1, difficulty:"Easy", type:["LATIN"], prereqs:[] },
    { code:"LATIN 479", title:"Independent Study", credits:1, difficulty:"Easy", type:["LATIN"], prereqs:[] },
    { code:"LATIN 490", title:"Honors", credits:1, difficulty:"Moderate", type:["LATIN", "Honors"], prereqs:[] },

    { code:"LATSTY 150", title:"Special Topics: Latindades", credits:3, difficulty:"Easy", type:["LATSTY"], prereqs:[] },
    { code:"LATSTY 201L", title:"Imagining Latinidad: Historical Trajectories and Everyday Lives", credits:3, difficulty:"Moderate", type:["LATSTY", "Lab"], prereqs:[] },
    { code:"LATSTY 223L", title:"Latino/Latina/Latinx Literature", credits:3, difficulty:"Moderate", type:["LATSTY", "Lab"], prereqs:[] },
    { code:"LATSTY 225L", title:"Latinas in the United States", credits:3, difficulty:"Moderate", type:["LATSTY", "Lab"], prereqs:[] },
    { code:"LATSTY 229L", title:"Latinx Sexualities", credits:3, difficulty:"Moderate", type:["LATSTY", "Lab"], prereqs:[] },
    { code:"LATSTY 260L", title:"Latina/nos and the Law", credits:3, difficulty:"Moderate", type:["LATSTY", "Lab"], prereqs:[] },
    { code:"LATSTY 353L", title:"Borderlands, Diasporas, and Transnational Identities", credits:3, difficulty:"Hard", type:["LATSTY", "Lab"], prereqs:[] },
    { code:"LATSTY 477L", title:"LLOP Research Seminar", credits:3, difficulty:"Hard", type:["LATSTY", "Lab"], prereqs:[] },

    { code:"LING 479", title:"Independent Study", credits:1, difficulty:"Easy", type:["LING"], prereqs:[] },

    { code:"MLLC 150G", title:"Self and Other", credits:3, difficulty:"Easy", type:["MLLC", "GenEd"], prereqs:[] },
    { code:"MLLC 155L", title:"Great Books of East Asia: Classics of Love and War", credits:3, difficulty:"Easy", type:["MLLC", "Lab"], prereqs:[] },
    { code:"MLLC 200", title:"Discovering Your Dream Job", credits:3, difficulty:"Moderate", type:["MLLC"], prereqs:[] },
    { code:"MLLC 210G", title:"Great Books", credits:3, difficulty:"Moderate", type:["MLLC", "GenEd"], prereqs:[] },
    { code:"MLLC 225L", title:"Berlin: Crossroads of History", credits:3, difficulty:"Moderate", type:["MLLC", "Lab"], prereqs:[] },
    { code:"MLLC 235L", title:"Postwar European Cinema", credits:3, difficulty:"Moderate", type:["MLLC", "Lab"], prereqs:[] },
    { code:"MLLC 250G", title:"Witches and Witch-Hunts", credits:3, difficulty:"Moderate", type:["MLLC", "GenEd"], prereqs:[] },
    { code:"MLLC 252L", title:"Global Refugee Narratives", credits:3, difficulty:"Moderate", type:["MLLC", "Lab"], prereqs:[] },
    { code:"MLLC 255L", title:"Pacting with the Devil: The Faust Tradition", credits:3, difficulty:"Moderate", type:["MLLC", "Lab"], prereqs:[] },
    { code:"MLLC 260L", title:"Imagining the Modern Middle East", credits:3, difficulty:"Moderate", type:["MLLC", "Lab"], prereqs:[] },
    { code:"MLLC 265L", title:"Icons of East Asia: Stereotypes, gender, and cultural history from geisha girls to martial masters", credits:3, difficulty:"Moderate", type:["MLLC", "Lab"], prereqs:[] },
    { code:"MLLC 270", title:"Global Food Studies", credits:3, difficulty:"Moderate", type:["MLLC"], prereqs:[] },
    { code:"MLLC 276L", title:"Italian Cinema", credits:3, difficulty:"Moderate", type:["MLLC", "Lab"], prereqs:[] },
    { code:"MLLC 290", title:"Special Topics", credits:3, difficulty:"Moderate", type:["MLLC"], prereqs:[] },
    { code:"MLLC 314L", title:"Women of the Caribbean: Literature, Art, and Resistance", credits:3, difficulty:"Hard", type:["MLLC", "Lab"], prereqs:[] },
    { code:"MLLC 325L", title:"Film Festivals", credits:3, difficulty:"Hard", type:["MLLC", "Lab"], prereqs:[] },
    { code:"MLLC 337L", title:"Disney's European Fairy Tales", credits:3, difficulty:"Hard", type:["MLLC", "Lab"], prereqs:[] },
    { code:"MLLC 340L", title:"Moving Across Borders: Migration and Diversity", credits:3, difficulty:"Hard", type:["MLLC", "Lab"], prereqs:[] },
    { code:"MLLC 345L", title:"Dreams and Visions", credits:3, difficulty:"Hard", type:["MLLC", "Lab"], prereqs:[] },
    { code:"MLLC 350L", title:"Green Germany: Environmental Thought and Policy", credits:3, difficulty:"Hard", type:["MLLC", "Lab"], prereqs:[] },
    { code:"MLLC 355L", title:"European Crime Fiction", credits:3, difficulty:"Hard", type:["MLLC", "Lab"], prereqs:[] },
    { code:"MLLC 365L", title:"German Pop Culture", credits:3, difficulty:"Hard", type:["MLLC", "Lab"], prereqs:[] },
    { code:"MLLC 366L", title:"Re-made in Asia: Tellings and re-tellings from the Buddha to Godzilla", credits:3, difficulty:"Hard", type:["MLLC", "Lab"], prereqs:[] },
    { code:"MLLC 372L", title:"German Cinema", credits:3, difficulty:"Hard", type:["MLLC", "Lab"], prereqs:[] },
    { code:"MLLC 374L", title:"Love Stories: A Historical Handbook to Happily Ever After", credits:3, difficulty:"Hard", type:["MLLC", "Lab"], prereqs:[] },
    { code:"MLLC 377L", title:"Rebellion! On Being Young in European Fiction", credits:3, difficulty:"Hard", type:["MLLC", "Lab"], prereqs:[] },
    { code:"MLLC 378", title:"Independent Study", credits:1, difficulty:"Easy", type:["MLLC"], prereqs:[] },
    { code:"MLLC 379", title:"Independent Study", credits:1, difficulty:"Easy", type:["MLLC"], prereqs:[] },
    { code:"MLLC 390", title:"Special Topics", credits:3, difficulty:"Hard", type:["MLLC"], prereqs:[] },
    { code:"MLLC 478", title:"Readings and Research", credits:3, difficulty:"Hard", type:["MLLC"], prereqs:[] },
    { code:"MLLC 480", title:"Internship in Modern Languages, Literatures and Cultures", credits:3, difficulty:"Hard", type:["MLLC", "Internship"], prereqs:[] },
    { code:"MLLC 488L", title:"The Idea of Asia", credits:3, difficulty:"Hard", type:["MLLC", "Lab"], prereqs:[] },

    { code:"MUSIC 101", title:"University Chorus", credits:1, difficulty:"Easy", type:["MUSIC"], prereqs:[] },
    { code:"MUSIC 102", title:"Chamber Singers", credits:1, difficulty:"Easy", type:["MUSIC"], prereqs:[] },
    { code:"MUSIC 104", title:"Jazz Band", credits:1, difficulty:"Easy", type:["MUSIC"], prereqs:[] },
    { code:"MUSIC 105G", title:"Music of the World", credits:4, difficulty:"Easy", type:["MUSIC", "GenEd"], prereqs:[] },
    { code:"MUSIC 106", title:"Chamber Orchestra", credits:1, difficulty:"Easy", type:["MUSIC"], prereqs:[] },
    { code:"MUSIC 109", title:"Music Collaboratory", credits:1, difficulty:"Easy", type:["MUSIC"], prereqs:[] },
    { code:"MUSIC 111", title:"An Introduction to Music", credits:3, difficulty:"Easy", type:["MUSIC"], prereqs:[] },
    { code:"MUSIC 115", title:"World Music", credits:3, difficulty:"Easy", type:["MUSIC"], prereqs:[] },
    { code:"MUSIC 117", title:"History of Country Music in America", credits:3, difficulty:"Easy", type:["MUSIC"], prereqs:[] },
    { code:"MUSIC 121", title:"Theory I", credits:3, difficulty:"Easy", type:["MUSIC"], prereqs:[] },
    { code:"MUSIC 122", title:"Theory II", credits:3, difficulty:"Easy", type:["MUSIC"], prereqs:[] },
    { code:"MUSIC 123", title:"Ear Training and Sight Singing I", credits:2, difficulty:"Easy", type:["MUSIC"], prereqs:[] },
    { code:"MUSIC 124", title:"Ear Training and Sight Singing II", credits:2, difficulty:"Easy", type:["MUSIC"], prereqs:[] },
    { code:"MUSIC 131", title:"Elements: Keyboard I", credits:2, difficulty:"Easy", type:["MUSIC"], prereqs:[] },
    { code:"MUSIC 132", title:"Elements: Keyboard II", credits:2, difficulty:"Easy", type:["MUSIC"], prereqs:[] },
    { code:"MUSIC 184", title:"Applied Music Lesson", credits:1, difficulty:"Easy", type:["MUSIC"], prereqs:[] },
    { code:"MUSIC 185", title:"Applied Music", credits:1, difficulty:"Easy", type:["MUSIC"], prereqs:[] },
    { code:"MUSIC 200", title:"Masterpieces of Western Art Music", credits:3, difficulty:"Moderate", type:["MUSIC"], prereqs:[] },
    { code:"MUSIC 201", title:"Music Production", credits:3, difficulty:"Moderate", type:["MUSIC"], prereqs:[] },
    { code:"MUSIC 205G", title:"Introduction to Ethnomusicology", credits:3, difficulty:"Moderate", type:["MUSIC", "GenEd"], prereqs:[] },
    { code:"MUSIC 221", title:"Theory III", credits:3, difficulty:"Moderate", type:["MUSIC"], prereqs:[] },
    { code:"MUSIC 222", title:"Theory IV", credits:3, difficulty:"Moderate", type:["MUSIC"], prereqs:[] },
    { code:"MUSIC 223", title:"Ear Training and Sight Singing III", credits:2, difficulty:"Moderate", type:["MUSIC"], prereqs:[] },
    { code:"MUSIC 224", title:"Ear Training and Sight Singing IV", credits:2, difficulty:"Moderate", type:["MUSIC"], prereqs:[] },
    { code:"MUSIC 241", title:"American Music", credits:3, difficulty:"Moderate", type:["MUSIC"], prereqs:[] },
    { code:"MUSIC 248", title:"Universe of Music", credits:3, difficulty:"Moderate", type:["MUSIC"], prereqs:[] },
    { code:"MUSIC 251", title:"The History and Development of Jazz in America", credits:3, difficulty:"Moderate", type:["MUSIC"], prereqs:[] },
    { code:"MUSIC 253G", title:"Black American Music", credits:3, difficulty:"Moderate", type:["MUSIC", "GenEd"], prereqs:[] },
    { code:"MUSIC 268", title:"Music of Latin America", credits:3, difficulty:"Moderate", type:["MUSIC"], prereqs:[] },
    { code:"MUSIC 300", title:"Masterpieces of Western Music for Music Minors", credits:3, difficulty:"Hard", type:["MUSIC"], prereqs:[] },
    { code:"MUSIC 302", title:"Medieval to Baroque", credits:3, difficulty:"Hard", type:["MUSIC"], prereqs:[] },
    { code:"MUSIC 303", title:"Classical to Modern", credits:3, difficulty:"Hard", type:["MUSIC"], prereqs:[] },
    { code:"MUSIC 315", title:"Seminar in World Music", credits:3, difficulty:"Hard", type:["MUSIC"], prereqs:[] },
    { code:"MUSIC 401", title:"String Techniques", credits:3, difficulty:"Hard", type:["MUSIC"], prereqs:[] },
    { code:"MUSIC 402", title:"Woodwind Techniques", credits:2, difficulty:"Hard", type:["MUSIC"], prereqs:[] },
    { code:"MUSIC 403", title:"Brass Techniques", credits:2, difficulty:"Hard", type:["MUSIC"], prereqs:[] },
    { code:"MUSIC 404", title:"Percussion Techniques", credits:2, difficulty:"Hard", type:["MUSIC"], prereqs:[] },
    { code:"MUSIC 440", title:"Instrumental Methods and Literature in the Teaching of Music", credits:3, difficulty:"Hard", type:["MUSIC"], prereqs:[] },
    { code:"MUSIC 441", title:"Choral and General Music Methods and Literature", credits:3, difficulty:"Hard", type:["MUSIC"], prereqs:[] },
    { code:"MUSIC 442", title:"Conducting", credits:3, difficulty:"Hard", type:["MUSIC"], prereqs:[] },
    { code:"MUSIC 443", title:"Sociocultural Perspectives in Music Education", credits:3, difficulty:"Hard", type:["MUSIC"], prereqs:[] },
    { code:"MUSIC 478", title:"Independent Study", credits:1, difficulty:"Easy", type:["MUSIC"], prereqs:[] },
    { code:"MUSIC 479", title:"Independent Study", credits:1, difficulty:"Easy", type:["MUSIC"], prereqs:[] },
    { code:"MUSIC 480", title:"Special Topics", credits:3, difficulty:"Hard", type:["MUSIC"], prereqs:[] },
    { code:"MUSIC 483", title:"Orchestration", credits:3, difficulty:"Hard", type:["MUSIC"], prereqs:[] },
    { code:"MUSIC 498", title:"Senior Honors", credits:1, difficulty:"Moderate", type:["MUSIC", "Honors"], prereqs:[] },
    { code:"MUSIC 499", title:"Pre-Practicum in Music", credits:1, difficulty:"Moderate", type:["MUSIC"], prereqs:[] },

    { code:"NAIS 262L", title:"American Indian History to 1783", credits:3, difficulty:"Moderate", type:["NAIS", "Lab"], prereqs:[] },
    { code:"NAIS 263L", title:"Modern American Indian Social and Political History: From the American Revolution to Standing Rock", credits:3, difficulty:"Moderate", type:["NAIS", "Lab"], prereqs:[] },
    { code:"NAIS 278L", title:"Introduction to Native American and Indigenous Studies", credits:3, difficulty:"Moderate", type:["NAIS", "Lab"], prereqs:[] },
    { code:"NAIS 333L", title:"Indigenous and Colonial Heritage in Popular Music", credits:3, difficulty:"Hard", type:["NAIS", "Lab"], prereqs:[] },
    { code:"NAIS 347L", title:"Indigenous Research Methodologies", credits:3, difficulty:"Hard", type:["NAIS", "Lab"], prereqs:[] },
    { code:"NAIS 488", title:"Working for Native Communities: Internship/Directed Study", credits:3, difficulty:"Hard", type:["NAIS", "Internship"], prereqs:[] },

    { code:"PHIL 100", title:"Introduction to Philosophy", credits:3, difficulty:"Easy", type:["PHIL"], prereqs:[] },
    { code:"PHIL 108", title:"Moral and Social Problems", credits:3, difficulty:"Easy", type:["PHIL"], prereqs:[] },
    { code:"PHIL 109G", title:"Moral Debate in Society", credits:4, difficulty:"Moderate", type:["PHIL", "GenEd"], prereqs:[] },
    { code:"PHIL 130G", title:"Privacy", credits:4, difficulty:"Moderate", type:["PHIL", "GenEd"], prereqs:[] },
    { code:"PHIL 140G", title:"Philosophy through Film", credits:4, difficulty:"Moderate", type:["PHIL", "GenEd"], prereqs:[] },
    { code:"PHIL 150", title:"Critical Thinking", credits:3, difficulty:"Easy", type:["PHIL"], prereqs:[] },
    { code:"PHIL 200", title:"African Philosophy", credits:3, difficulty:"Moderate", type:["PHIL"], prereqs:[] },
    { code:"PHIL 207G", title:"The Meaning of Life", credits:3, difficulty:"Moderate", type:["PHIL", "GenEd"], prereqs:[] },
    { code:"PHIL 208", title:"Existential Themes in Philosophy and Literature", credits:3, difficulty:"Moderate", type:["PHIL"], prereqs:[] },
    { code:"PHIL 211", title:"Ancient Philosophy", credits:3, difficulty:"Moderate", type:["PHIL"], prereqs:[] },
    { code:"PHIL 212", title:"Modern Philosophy", credits:3, difficulty:"Moderate", type:["PHIL"], prereqs:[] },
    { code:"PHIL 215", title:"Philosophical Foundations of Public Policy", credits:3, difficulty:"Moderate", type:["PHIL"], prereqs:[] },
    { code:"PHIL 216", title:"The History of Ethics", credits:3, difficulty:"Moderate", type:["PHIL"], prereqs:[] },
    { code:"PHIL 218", title:"Major Social and Political Thinkers", credits:3, difficulty:"Moderate", type:["PHIL"], prereqs:[] },
    { code:"PHIL 220", title:"Environmental Ethics", credits:3, difficulty:"Moderate", type:["PHIL"], prereqs:[] },
    { code:"PHIL 222", title:"Moral Issues in Medicine", credits:3, difficulty:"Moderate", type:["PHIL"], prereqs:[] },
    { code:"PHIL 224", title:"The Philosophy of Art", credits:3, difficulty:"Moderate", type:["PHIL"], prereqs:[] },
    { code:"PHIL 225L", title:"The Philosophy of Religion", credits:3, difficulty:"Moderate", type:["PHIL", "Lab"], prereqs:[] },
    { code:"PHIL 227", title:"Existentialism and Phenomenology", credits:3, difficulty:"Moderate", type:["PHIL"], prereqs:[] },
    { code:"PHIL 228", title:"Minds & Machines", credits:3, difficulty:"Moderate", type:["PHIL"], prereqs:[] },
    { code:"PHIL 230", title:"Philosophy and Feminism", credits:3, difficulty:"Moderate", type:["PHIL"], prereqs:[] },
    { code:"PHIL 250", title:"Formal Logic", credits:3, difficulty:"Moderate", type:["PHIL"], prereqs:[] },
    { code:"PHIL 255", title:"The Mystery of Consciousness", credits:3, difficulty:"Moderate", type:["PHIL"], prereqs:[] },
    { code:"PHIL 265", title:"Sanity and Madness", credits:3, difficulty:"Moderate", type:["PHIL"], prereqs:[] },
    { code:"PHIL 281", title:"Special Topics", credits:3, difficulty:"Moderate", type:["PHIL"], prereqs:[] },
    { code:"PHIL 286", title:"What is Freedom?", credits:3, difficulty:"Moderate", type:["PHIL"], prereqs:[] },
    { code:"PHIL 287", title:"Equality", credits:3, difficulty:"Moderate", type:["PHIL"], prereqs:[] },
    { code:"PHIL 290", title:"The Philosophy of Law", credits:3, difficulty:"Moderate", type:["PHIL"], prereqs:[] },
    { code:"PHIL 295", title:"Caribbean Philosophy", credits:3, difficulty:"Moderate", type:["PHIL"], prereqs:[] },
    { code:"PHIL 297", title:"Asian Philosophy", credits:3, difficulty:"Moderate", type:["PHIL"], prereqs:[] },
    { code:"PHIL 311", title:"Medieval Philosophy: Islamic, Jewish, Christian", credits:3, difficulty:"Hard", type:["PHIL"], prereqs:[] },
    { code:"PHIL 318", title:"Race and Racism", credits:3, difficulty:"Hard", type:["PHIL"], prereqs:[] },
    { code:"PHIL 327", title:"Meaning and Being", credits:3, difficulty:"Hard", type:["PHIL"], prereqs:[] },
    { code:"PHIL 333", title:"Ethical Theory", credits:3, difficulty:"Hard", type:["PHIL"], prereqs:[] },
    { code:"PHIL 344", title:"The Philosophy of Mind", credits:3, difficulty:"Hard", type:["PHIL"], prereqs:[] },
    { code:"PHIL 345", title:"Theory of Knowledge", credits:3, difficulty:"Hard", type:["PHIL"], prereqs:[] },
    { code:"PHIL 346", title:"The Philosophy of Science", credits:3, difficulty:"Hard", type:["PHIL"], prereqs:[] },
    { code:"PHIL 347", title:"Problems of Metaphysics", credits:3, difficulty:"Hard", type:["PHIL"], prereqs:[] },
    { code:"PHIL 348", title:"The Self", credits:3, difficulty:"Hard", type:["PHIL"], prereqs:[] },
    { code:"PHIL 351", title:"Plato", credits:3, difficulty:"Hard", type:["PHIL"], prereqs:[] },
    { code:"PHIL 364", title:"Philosophy of War and Peace", credits:3, difficulty:"Hard", type:["PHIL"], prereqs:[] },
    { code:"PHIL 376", title:"Consent", credits:3, difficulty:"Hard", type:["PHIL"], prereqs:[] },
    { code:"PHIL 379", title:"Reality and Illusion, East and West", credits:3, difficulty:"Hard", type:["PHIL"], prereqs:[] },
    { code:"PHIL 380", title:"Social & Political Philosophy", credits:3, difficulty:"Hard", type:["PHIL"], prereqs:[] },
    { code:"PHIL 381", title:"Special Topics", credits:3, difficulty:"Hard", type:["PHIL"], prereqs:[] },
    { code:"PHIL 395", title:"International Ethics", credits:3, difficulty:"Hard", type:["PHIL"], prereqs:[] },
    { code:"PHIL 397", title:"Marxist Philosophy", credits:3, difficulty:"Hard", type:["PHIL"], prereqs:[] },
    { code:"PHIL 418", title:"The End of Democracy", credits:3, difficulty:"Hard", type:["PHIL"], prereqs:[] },
    { code:"PHIL 440", title:"Philosophy of Language", credits:3, difficulty:"Hard", type:["PHIL"], prereqs:[] },
    { code:"PHIL 450", title:"Rights", credits:3, difficulty:"Hard", type:["PHIL"], prereqs:[] },
    { code:"PHIL 455", title:"Hegel and German Idealism", credits:3, difficulty:"Hard", type:["PHIL"], prereqs:[] },
    { code:"PHIL 462", title:"The Critical Philosophy of Immanuel Kant", credits:3, difficulty:"Hard", type:["PHIL"], prereqs:[] },
    { code:"PHIL 475", title:"Philosophy Capstone", credits:3, difficulty:"Hard", type:["PHIL"], prereqs:[] },
    { code:"PHIL 478", title:"Independent Study I", credits:3, difficulty:"Easy", type:["PHIL"], prereqs:[] },
    { code:"PHIL 479", title:"Independent Study II", credits:1, difficulty:"Easy", type:["PHIL"], prereqs:[] },

    { code:"PHILLAW 210", title:"Legislative Labyrinth", credits:3, difficulty:"Moderate", type:["PHILLAW"], prereqs:[] },
    { code:"PHILLAW 240", title:"Introduction to Civil Rights Law: History, Doctrine, and Practice", credits:3, difficulty:"Moderate", type:["PHILLAW"], prereqs:[] },
    { code:"PHILLAW 260L", title:"Latina/nos and the Law", credits:3, difficulty:"Moderate", type:["PHILLAW", "Lab"], prereqs:[] },
    { code:"PHILLAW 300", title:"Basic Legal Rsng&Rsr", credits:3, difficulty:"Hard", type:["PHILLAW"], prereqs:[] },
    { code:"PHILLAW 355L", title:"Asian Americans and the Law", credits:3, difficulty:"Hard", type:["PHILLAW", "Lab"], prereqs:[] },

    { code:"POLSCI 101", title:"Introduction to Politics", credits:3, difficulty:"Easy", type:["POLSCI"], prereqs:[] },
    { code:"POLSCI 102", title:"Government and Politics of the United States", credits:3, difficulty:"Easy", type:["POLSCI"], prereqs:[] },
    { code:"POLSCI 103", title:"Introduction to Political Theory", credits:3, difficulty:"Easy", type:["POLSCI"], prereqs:[] },
    { code:"POLSCI 113G", title:"Issues of Political Identity at the Turn of the Century", credits:4, difficulty:"Easy", type:["POLSCI", "GenEd"], prereqs:[] },
    { code:"POLSCI 202", title:"Comparative Politics", credits:3, difficulty:"Moderate", type:["POLSCI"], prereqs:[] },
    { code:"POLSCI 203", title:"Public Policy (A)", credits:3, difficulty:"Moderate", type:["POLSCI"], prereqs:[] },
    { code:"POLSCI 220", title:"International Relations (B)", credits:3, difficulty:"Moderate", type:["POLSCI"], prereqs:[] },
    { code:"POLSCI 230G", title:"Globalization and Its Discontents", credits:3, difficulty:"Moderate", type:["POLSCI", "GenEd"], prereqs:[] },
    { code:"POLSCI 251", title:"Ancient and Medieval Political Thought (D)", credits:3, difficulty:"Moderate", type:["POLSCI"], prereqs:[] },
    { code:"POLSCI 252", title:"Modern Political Thought (D)", credits:3, difficulty:"Moderate", type:["POLSCI"], prereqs:[] },
    { code:"POLSCI 265L", title:"World War II Internment of Japanese Americans (A)", credits:3, difficulty:"Moderate", type:["POLSCI", "Lab"], prereqs:[] },
    { code:"POLSCI 309", title:"Political Behavior", credits:3, difficulty:"Moderate", type:["POLSCI"], prereqs:[] },
    { code:"POLSCI 311", title:"Political Parties (A)", credits:3, difficulty:"Moderate", type:["POLSCI"], prereqs:[] },
    { code:"POLSCI 318", title:"The Legislative Process (A)", credits:3, difficulty:"Moderate", type:["POLSCI"], prereqs:[] },
    { code:"POLSCI 320", title:"Women, Politics, and Policy", credits:3, difficulty:"Moderate", type:["POLSCI"], prereqs:[] },
    { code:"POLSCI 325", title:"Public Administration (A)", credits:3, difficulty:"Moderate", type:["POLSCI"], prereqs:[] },
    { code:"POLSCI 329", title:"American Constitutional Law and Theory (A)", credits:3, difficulty:"Moderate", type:["POLSCI"], prereqs:[] },
    { code:"POLSCI 330", title:"Presidential Elections (A)", credits:3, difficulty:"Moderate", type:["POLSCI"], prereqs:[] },
    { code:"POLSCI 332", title:"Civil Liberties in the United States (A)", credits:3, difficulty:"Moderate", type:["POLSCI"], prereqs:[] },
    { code:"POLSCI 333", title:"Terrorism", credits:3, difficulty:"Hard", type:["POLSCI"], prereqs:[] },
    { code:"POLSCI 335", title:"Law and Public Policy (A)", credits:3, difficulty:"Moderate", type:["POLSCI"], prereqs:[] },
    { code:"POLSCI 340", title:"Boston: Cooperation and Conflict in the Urban Environment (A)", credits:3, difficulty:"Hard", type:["POLSCI"], prereqs:[] },
    { code:"POLSCI 343", title:"Feminist Political Thought", credits:3, difficulty:"Moderate", type:["POLSCI"], prereqs:[] },
    { code:"POLSCI 344", title:"Problems of Urban Politics (A)", credits:3, difficulty:"Moderate", type:["POLSCI"], prereqs:[] },
    { code:"POLSCI 345", title:"Sports, Politics, & Policy", credits:3, difficulty:"Moderate", type:["POLSCI"], prereqs:[] },
    { code:"POLSCI 350", title:"Political Research Methods", credits:3, difficulty:"Moderate", type:["POLSCI"], prereqs:[] },
    { code:"POLSCI 355", title:"Political Corruption in Comparative Perspective", credits:3, difficulty:"Moderate", type:["POLSCI"], prereqs:[] },
    { code:"POLSCI 365", title:"Japan and the United States", credits:3, difficulty:"Moderate", type:["POLSCI"], prereqs:[] },
    { code:"POLSCI 368", title:"Immigration Politics in Comparative Perspective", credits:3, difficulty:"Moderate", type:["POLSCI"], prereqs:[] },
    { code:"POLSCI 369", title:"Politics of the Middle East (C)", credits:3, difficulty:"Moderate", type:["POLSCI"], prereqs:[] },
    { code:"POLSCI 370", title:"Human Rights, Immigration and Gender in Mexico", credits:3, difficulty:"Moderate", type:["POLSCI"], prereqs:[] },
    { code:"POLSCI 371", title:"Latin American Poltc", credits:3, difficulty:"Moderate", type:["POLSCI"], prereqs:[] },
    { code:"POLSCI 372", title:"Central American Politics (C)", credits:3, difficulty:"Moderate", type:["POLSCI"], prereqs:[] },
    { code:"POLSCI 375", title:"Third World Development (C)", credits:3, difficulty:"Moderate", type:["POLSCI"], prereqs:[] },
    { code:"POLSCI 377", title:"Special Topics in Politics", credits:3, difficulty:"Hard", type:["POLSCI"], prereqs:[] },
    { code:"POLSCI 380", title:"Theories of International Relations", credits:3, difficulty:"Moderate", type:["POLSCI"], prereqs:[] },
    { code:"POLSCI 387", title:"The Government and Politics of China (C)", credits:3, difficulty:"Moderate", type:["POLSCI"], prereqs:[] },
    { code:"POLSCI 390", title:"A Comparative Analysis of Inequality and Redistribution", credits:3, difficulty:"Moderate", type:["POLSCI"], prereqs:[] },
    { code:"POLSCI 393L", title:"Latino/a/x/e Politics", credits:3, difficulty:"Moderate", type:["POLSCI", "Lab"], prereqs:[] },
    { code:"POLSCI 402", title:"World Politics and World Order (B)", credits:3, difficulty:"Hard", type:["POLSCI"], prereqs:[] },
    { code:"POLSCI 404", title:"The Politics of the Arab-Israeli Conflict", credits:3, difficulty:"Hard", type:["POLSCI"], prereqs:[] },
    { code:"POLSCI 407", title:"US-Latin American Relations", credits:3, difficulty:"Hard", type:["POLSCI"], prereqs:[] },
    { code:"POLSCI 410", title:"Pol Intrnatnl Econ", credits:3, difficulty:"Hard", type:["POLSCI"], prereqs:[] },
    { code:"POLSCI 415", title:"Law and International Relations (B)", credits:3, difficulty:"Hard", type:["POLSCI"], prereqs:[] },
    { code:"POLSCI 421", title:"War (B)", credits:3, difficulty:"Hard", type:["POLSCI"], prereqs:[] },
    { code:"POLSCI 422", title:"Nationalism (C)", credits:3, difficulty:"Hard", type:["POLSCI"], prereqs:[] },
    { code:"POLSCI 435", title:"Foreign Policy Analysis", credits:3, difficulty:"Hard", type:["POLSCI"], prereqs:[] },
    { code:"POLSCI 439", title:"Thinking Islamophobia and the War Terror", credits:3, difficulty:"Hard", type:["POLSCI"], prereqs:[] },
    { code:"POLSCI 450", title:"Decolonial Theory", credits:3, difficulty:"Hard", type:["POLSCI"], prereqs:[] },
    { code:"POLSCI 451", title:"Queer Theory & Politics", credits:3, difficulty:"Hard", type:["POLSCI"], prereqs:[] },
    { code:"POLSCI 453", title:"Democratic Theory (D)", credits:3, difficulty:"Hard", type:["POLSCI"], prereqs:[] },
    { code:"POLSCI 455", title:"Problems in Political Thought (D)", credits:3, difficulty:"Hard", type:["POLSCI"], prereqs:[] },
    { code:"POLSCI 458", title:"From Biopolitics to Necropolitcs", credits:3, difficulty:"Hard", type:["POLSCI"], prereqs:[] },
    { code:"POLSCI 478", title:"Independent Study", credits:1, difficulty:"Easy", type:["POLSCI"], prereqs:[] },
    { code:"POLSCI 479", title:"Independent Study", credits:1, difficulty:"Easy", type:["POLSCI"], prereqs:[] },
    { code:"POLSCI 488", title:"Field Work in Politics", credits:3, difficulty:"Hard", type:["POLSCI", "Internship"], prereqs:[] },
    { code:"POLSCI 489", title:"Field Work in Politics", credits:3, difficulty:"Hard", type:["POLSCI", "Internship"], prereqs:[] },
    { code:"POLSCI 490", title:"Special Issues", credits:3, difficulty:"Hard", type:["POLSCI"], prereqs:[] },
    { code:"POLSCI 491", title:"Special Issues", credits:3, difficulty:"Hard", type:["POLSCI"], prereqs:[] },
    { code:"POLSCI 492", title:"Directed Readings in Politics", credits:3, difficulty:"Hard", type:["POLSCI"], prereqs:[] },
    { code:"POLSCI 495", title:"Field Practicum in Politics", credits:9, difficulty:"Hard", type:["POLSCI"], prereqs:[] },
    { code:"POLSCI 499L", title:"Seminar in International Relations (B)", credits:3, difficulty:"Hard", type:["POLSCI", "Lab"], prereqs:[] },

    { code:"PORT 101", title:"Elementary Portuguese I", credits:4, difficulty:"Easy", type:["PORT"], prereqs:[] },
    { code:"PORT 102", title:"Elementary Portuguese II", credits:4, difficulty:"Easy", type:["PORT"], prereqs:[] },
    { code:"PORT 201", title:"Intermediate Portuguese I", credits:3, difficulty:"Moderate", type:["PORT"], prereqs:[] },
    { code:"PORT 202", title:"Intermediate Portuguese II", credits:3, difficulty:"Moderate", type:["PORT"], prereqs:[] },
    { code:"PORT 279", title:"Writing for Heritage Speakers of Portuguese", credits:3, difficulty:"Moderate", type:["PORT"], prereqs:[] },
    { code:"PORT 304", title:"Advanced Portuguese", credits:3, difficulty:"Hard", type:["PORT"], prereqs:[] },
    { code:"PORT 375L", title:"Afro-Luso-Brazilian Cultures", credits:3, difficulty:"Hard", type:["PORT", "Lab"], prereqs:[] },
    { code:"PORT 378", title:"Portuguese Independent Study", credits:3, difficulty:"Hard", type:["PORT"], prereqs:[] },
    { code:"PORT 385", title:"Special Topics in Portuguese Studies", credits:3, difficulty:"Hard", type:["PORT"], prereqs:[] },
    { code:"PORT 490L", title:"Internship Course in Latin American and Iberian Studies", credits:3, difficulty:"Hard", type:["PORT", "Lab", "Internship"], prereqs:[] },


  // --- College of Liberal Arts: PSYCH/RELSTY/RUSS/SOCIOL/SPAN/THRART/VIET/WGS (added) ---
  { subject: "PSYCH", code: "PSYCH 100", title: "Introductory Psychology", credits: 3, difficulty: "Moderate", prereqs: [] },
  { subject: "PSYCH", code: "PSYCH 101", title: "Introductory Psychology", credits: 3, difficulty: "Moderate", prereqs: [] },
  { subject: "PSYCH", code: "PSYCH 131G", title: "Personal and Social Determinants of Health: Disparity, Equity, and Health Promotion", credits: 4, difficulty: "Moderate", prereqs: [] },
  { subject: "PSYCH", code: "PSYCH 201", title: "Introduction to Behavioral Research", credits: 3, difficulty: "Moderate", prereqs: [] },
  { subject: "PSYCH", code: "PSYCH 210", title: "Personality", credits: 3, difficulty: "Moderate", prereqs: [] },
  { subject: "PSYCH", code: "PSYCH 215", title: "Mental Health and Psychological Distress", credits: 3, difficulty: "Moderate", prereqs: [] },
  { subject: "PSYCH", code: "PSYCH 216L", title: "Therapeutic Mentoring", credits: 3, difficulty: "Moderate", prereqs: [] },
  { subject: "PSYCH", code: "PSYCH 230", title: "Social Psychology", credits: 3, difficulty: "Moderate", prereqs: [] },
  { subject: "PSYCH", code: "PSYCH 231", title: "Psychology and Social Justice", credits: 3, difficulty: "Moderate", prereqs: [] },
  { subject: "PSYCH", code: "PSYCH 234", title: "Psychology of Cross-cultural Relations", credits: 3, difficulty: "Moderate", prereqs: [] },
  { subject: "PSYCH", code: "PSYCH 235", title: "Psychology and the Black Experience", credits: 3, difficulty: "Moderate", prereqs: [] },
  { subject: "PSYCH", code: "PSYCH 236", title: "The Psychology of Women", credits: 3, difficulty: "Moderate", prereqs: [] },
  { subject: "PSYCH", code: "PSYCH 238L", title: "Asian American Psychology", credits: 3, difficulty: "Moderate", prereqs: [] },
  { subject: "PSYCH", code: "PSYCH 241", title: "Infancy and Childhood Development", credits: 3, difficulty: "Moderate", prereqs: [] },
  { subject: "PSYCH", code: "PSYCH 242", title: "Adolescence", credits: 3, difficulty: "Moderate", prereqs: [] },
  { subject: "PSYCH", code: "PSYCH 250", title: "Learning and Memory", credits: 3, difficulty: "Moderate", prereqs: [] },
  { subject: "PSYCH", code: "PSYCH 255", title: "Perception", credits: 3, difficulty: "Moderate", prereqs: [] },
  { subject: "PSYCH", code: "PSYCH 260", title: "Introduction to Neuroscience", credits: 3, difficulty: "Moderate", prereqs: [] },
  { subject: "PSYCH", code: "PSYCH 271L", title: "Introduction to Cognitive Science", credits: 3, difficulty: "Moderate", prereqs: [] },
  { subject: "PSYCH", code: "PSYCH 286", title: "Introductory Research Apprenticeship", credits: 3, difficulty: "Moderate", prereqs: [] },
  { subject: "PSYCH", code: "PSYCH 290", title: "Special Topics in Psychology", credits: 3, difficulty: "Moderate", prereqs: [] },
  { subject: "PSYCH", code: "PSYCH 295", title: "Introduction to therapeutic Mentoring", credits: 3, difficulty: "Moderate", prereqs: [] },
  { subject: "PSYCH", code: "PSYCH 301", title: "Psychological Testing", credits: 3, difficulty: "Moderate", prereqs: [] },
  { subject: "PSYCH", code: "PSYCH 302", title: "Human Motives and Emotions", credits: 3, difficulty: "Moderate", prereqs: [] },
  { subject: "PSYCH", code: "PSYCH 333", title: "Group Dynamics", credits: 3, difficulty: "Moderate", prereqs: [] },
  { subject: "PSYCH", code: "PSYCH 335", title: "Social Attitudes and Public Opinion", credits: 3, difficulty: "Moderate", prereqs: [] },
  { subject: "PSYCH", code: "PSYCH 337", title: "Communication and Society", credits: 3, difficulty: "Moderate", prereqs: [] },
  { subject: "PSYCH", code: "PSYCH 338", title: "Community Psychology", credits: 3, difficulty: "Moderate", prereqs: [] },
  { subject: "PSYCH", code: "PSYCH 339", title: "Psychology Of Law", credits: 3, difficulty: "Moderate", prereqs: [] },
  { subject: "PSYCH", code: "PSYCH 343", title: "The Psychology of Adult Development and Human Aging", credits: 3, difficulty: "Moderate", prereqs: [] },
  { subject: "PSYCH", code: "PSYCH 350", title: "Cognitive Neuroscience", credits: 3, difficulty: "Moderate", prereqs: [] },
  { subject: "PSYCH", code: "PSYCH 360", title: "Behavioral Neuroscience", credits: 3, difficulty: "Moderate", prereqs: [] },
  { subject: "PSYCH", code: "PSYCH 370", title: "Statistics", credits: 3, difficulty: "Moderate", prereqs: [] },
  { subject: "PSYCH", code: "PSYCH 406", title: "Race, culture, and relationships: An applied psychological perspective", credits: 3, difficulty: "Moderate", prereqs: [] },
  { subject: "PSYCH", code: "PSYCH 415", title: "Psychological Trauma: Individual and Society", credits: 3, difficulty: "Moderate", prereqs: [] },
  { subject: "PSYCH", code: "PSYCH 420", title: "Principles of Psychotherapy", credits: 3, difficulty: "Moderate", prereqs: [] },
  { subject: "PSYCH", code: "PSYCH 430", title: "Internship in Psychology", credits: 6, difficulty: "Moderate", prereqs: [] },
  { subject: "PSYCH", code: "PSYCH 436", title: "Religion, Spirituality, and Health", credits: 3, difficulty: "Moderate", prereqs: [] },
  { subject: "PSYCH", code: "PSYCH 441", title: "The Family and the Child: A Psychological View", credits: 3, difficulty: "Moderate", prereqs: [] },
  { subject: "PSYCH", code: "PSYCH 445", title: "The Transition to Adulthood", credits: 3, difficulty: "Moderate", prereqs: [] },
  { subject: "PSYCH", code: "PSYCH 447", title: "Cognitive Development", credits: 3, difficulty: "Moderate", prereqs: [] },
  { subject: "PSYCH", code: "PSYCH 460", title: "The Neuropsychology of Higher Cognitive Processes", credits: 3, difficulty: "Moderate", prereqs: [] },
  { subject: "PSYCH", code: "PSYCH 462", title: "Psychopharmacology", credits: 3, difficulty: "Moderate", prereqs: [] },
  { subject: "PSYCH", code: "PSYCH 464", title: "Biological Rhythms in Brain and Behavior", credits: 3, difficulty: "Moderate", prereqs: [] },
  { subject: "PSYCH", code: "PSYCH 466", title: "Hormones and Behavior", credits: 3, difficulty: "Moderate", prereqs: [] },
  { subject: "PSYCH", code: "PSYCH 468", title: "Science of Human Sexuality", credits: 3, difficulty: "Moderate", prereqs: [] },
  { subject: "PSYCH", code: "PSYCH 470", title: "History, Systems, and Theories of Psychology", credits: 3, difficulty: "Moderate", prereqs: [] },
  { subject: "PSYCH", code: "PSYCH 474", title: "Using Qualitative Methods to Study the Stories of People's Lives", credits: 3, difficulty: "Moderate", prereqs: [] },
  { subject: "PSYCH", code: "PSYCH 475", title: "Experimental Methods: Learning and Perception", credits: 3, difficulty: "Moderate", prereqs: [] },
  { subject: "PSYCH", code: "PSYCH 476", title: "Experimental Methods: Physiological", credits: 3, difficulty: "Moderate", prereqs: [] },
  { subject: "PSYCH", code: "PSYCH 477", title: "Experimental Methods: Social", credits: 3, difficulty: "Moderate", prereqs: [] },
  { subject: "PSYCH", code: "PSYCH 484", title: "Field Placement in Child and Adolescent Development", credits: 3, difficulty: "Moderate", prereqs: [] },
  { subject: "PSYCH", code: "PSYCH 486", title: "Research Apprenticeship in Psychology", credits: 3, difficulty: "Moderate", prereqs: [] },
  { subject: "PSYCH", code: "PSYCH 488", title: "Directed Study in Psychology", credits: 1, difficulty: "Moderate", prereqs: [] },
  { subject: "PSYCH", code: "PSYCH 489", title: "Directed Study in Psychology", credits: 1, difficulty: "Moderate", prereqs: [] },
  { subject: "PSYCH", code: "PSYCH 490", title: "Special Topics in Psychology", credits: 3, difficulty: "Moderate", prereqs: [] },
  { subject: "PSYCH", code: "PSYCH 496", title: "Honors Research", credits: 3, difficulty: "Moderate", prereqs: [] },
  { subject: "PSYCH", code: "PSYCH 497", title: "Honors Research", credits: 3, difficulty: "Moderate", prereqs: [] },
  { subject: "PSYCH", code: "PSYCH 498", title: "Senior Honors Seminar I", credits: 3, difficulty: "Moderate", prereqs: [] },
  { subject: "PSYCH", code: "PSYCH 499", title: "Senior Honors Seminar II", credits: 3, difficulty: "Moderate", prereqs: [] },

  { subject: "RELSTY", code: "RELSTY 109", title: "Symbol, Myth and Ritual: Cultural Studies in Religion", credits: 3, difficulty: "Moderate", prereqs: [] },
  { subject: "RELSTY", code: "RELSTY 111", title: "Religions of the West", credits: 3, difficulty: "Moderate", prereqs: [] },
  { subject: "RELSTY", code: "RELSTY 112L", title: "Religions of Asia", credits: 3, difficulty: "Moderate", prereqs: [] },
  { subject: "RELSTY", code: "RELSTY 115G", title: "Religion, Politics, Sex & Violence", credits: 4, difficulty: "Moderate", prereqs: [] },
  { subject: "RELSTY", code: "RELSTY 125L", title: "Jerusalem: Sacred Space, Contested Space", credits: 3, difficulty: "Moderate", prereqs: [] },
  { subject: "RELSTY", code: "RELSTY 215L", title: "Introduction to Buddhism", credits: 3, difficulty: "Moderate", prereqs: [] },
  { subject: "RELSTY", code: "RELSTY 218G", title: "Religion and Film", credits: 3, difficulty: "Moderate", prereqs: [] },
  { subject: "RELSTY", code: "RELSTY 222L", title: "Religion and the Environment: Global Stewardship and Practices of Faith Communities", credits: 3, difficulty: "Moderate", prereqs: [] },
  { subject: "RELSTY", code: "RELSTY 225L", title: "The Philosophy of Religion", credits: 3, difficulty: "Moderate", prereqs: [] },
  { subject: "RELSTY", code: "RELSTY 233L", title: "Introduction to Islam", credits: 3, difficulty: "Moderate", prereqs: [] },
  { subject: "RELSTY", code: "RELSTY 235L", title: "Yoga in History, Philosophy, and Practice", credits: 3, difficulty: "Moderate", prereqs: [] },
  { subject: "RELSTY", code: "RELSTY 239L", title: "Hindu Myth and Narrative: the Epics and Puranas", credits: 3, difficulty: "Moderate", prereqs: [] },
  { subject: "RELSTY", code: "RELSTY 241L", title: "Myth, History, and Prophecy: Old Testament", credits: 3, difficulty: "Moderate", prereqs: [] },
  { subject: "RELSTY", code: "RELSTY 242L", title: "Origins of Christianity: From Jesus to Constantine", credits: 3, difficulty: "Moderate", prereqs: [] },
  { subject: "RELSTY", code: "RELSTY 245", title: "The History of Christianity", credits: 3, difficulty: "Moderate", prereqs: [] },
  { subject: "RELSTY", code: "RELSTY 280", title: "Special Topics", credits: 3, difficulty: "Moderate", prereqs: [] },
  { subject: "RELSTY", code: "RELSTY 310", title: "Apocalypse and the End of the World", credits: 3, difficulty: "Moderate", prereqs: [] },
  { subject: "RELSTY", code: "RELSTY 311L", title: "The Fall of Rome", credits: 3, difficulty: "Moderate", prereqs: [] },
  { subject: "RELSTY", code: "RELSTY 312", title: "Mysticism", credits: 3, difficulty: "Moderate", prereqs: [] },
  { subject: "RELSTY", code: "RELSTY 314L", title: "Meditation traditions of Asia", credits: 3, difficulty: "Moderate", prereqs: [] },
  { subject: "RELSTY", code: "RELSTY 335L", title: "Literature and the Arts of the Islamic World", credits: 3, difficulty: "Moderate", prereqs: [] },
  { subject: "RELSTY", code: "RELSTY 351L", title: "Religion and the Arts", credits: 3, difficulty: "Moderate", prereqs: [] },
  { subject: "RELSTY", code: "RELSTY 357L", title: "Women in South Asian Religions: Gender Ideology and Practice in Hinduism, Buddhism, and Islam", credits: 3, difficulty: "Moderate", prereqs: [] },
  { subject: "RELSTY", code: "RELSTY 358L", title: "Psychology, Politics, and Philosophy in East Asia", credits: 3, difficulty: "Moderate", prereqs: [] },
  { subject: "RELSTY", code: "RELSTY 385L", title: "Greek & Roman Religion", credits: 3, difficulty: "Moderate", prereqs: [] },
  { subject: "RELSTY", code: "RELSTY 478", title: "Independent Study", credits: 1, difficulty: "Moderate", prereqs: [] },
  { subject: "RELSTY", code: "RELSTY 479", title: "Independent Study", credits: 1, difficulty: "Moderate", prereqs: [] },

  { subject: "RUSS", code: "RUSS 101", title: "Elementary Russian I", credits: 4, difficulty: "Moderate", prereqs: [] },
  { subject: "RUSS", code: "RUSS 102", title: "Elementary Russian II", credits: 4, difficulty: "Moderate", prereqs: [] },
  { subject: "RUSS", code: "RUSS 378", title: "Independent Study", credits: 1, difficulty: "Moderate", prereqs: [] },

  { subject: "SOCIOL", code: "SOCIOL 101", title: "Introduction to Sociology", credits: 3, difficulty: "Moderate", prereqs: [] },
  { subject: "SOCIOL", code: "SOCIOL 102", title: "Sociology in Boston", credits: 3, difficulty: "Moderate", prereqs: [] },
  { subject: "SOCIOL", code: "SOCIOL 104", title: "Introduction to Systems of Criminal Justice", credits: 3, difficulty: "Moderate", prereqs: [] },
  { subject: "SOCIOL", code: "SOCIOL 110G", title: "Insiders/Outsiders", credits: 4, difficulty: "Moderate", prereqs: [] },
  { subject: "SOCIOL", code: "SOCIOL 120G", title: "Sociology of Popular Culture", credits: 4, difficulty: "Moderate", prereqs: [] },
  { subject: "SOCIOL", code: "SOCIOL 160", title: "Social Problems", credits: 3, difficulty: "Moderate", prereqs: [] },
  { subject: "SOCIOL", code: "SOCIOL 200", title: "Sociology of Race & Racism", credits: 3, difficulty: "Moderate", prereqs: [] },
  { subject: "SOCIOL", code: "SOCIOL 201", title: "Sociological Theory", credits: 3, difficulty: "Moderate", prereqs: [] },
  { subject: "SOCIOL", code: "SOCIOL 202", title: "Methods of Sociological Research", credits: 3, difficulty: "Moderate", prereqs: [] },
  { subject: "SOCIOL", code: "SOCIOL 211G", title: "Race and Power in the US", credits: 3, difficulty: "Moderate", prereqs: [] },
  { subject: "SOCIOL", code: "SOCIOL 226", title: "Youth & Society", credits: 3, difficulty: "Moderate", prereqs: [] },
  { subject: "SOCIOL", code: "SOCIOL 230", title: "Race, Incarceration, and Deportation", credits: 3, difficulty: "Moderate", prereqs: [] },
  { subject: "SOCIOL", code: "SOCIOL 238", title: "Sociology of Education", credits: 3, difficulty: "Moderate", prereqs: [] },
  { subject: "SOCIOL", code: "SOCIOL 242", title: "Sociology of Family", credits: 3, difficulty: "Moderate", prereqs: [] },
  { subject: "SOCIOL", code: "SOCIOL 260", title: "Ethics in Justice", credits: 3, difficulty: "Moderate", prereqs: [] },
  { subject: "SOCIOL", code: "SOCIOL 261", title: "Deviance and Social Control", credits: 3, difficulty: "Moderate", prereqs: [] },
  { subject: "SOCIOL", code: "SOCIOL 262", title: "Criminology", credits: 3, difficulty: "Moderate", prereqs: [] },
  { subject: "SOCIOL", code: "SOCIOL 281", title: "Society and the Individual", credits: 3, difficulty: "Moderate", prereqs: [] },
  { subject: "SOCIOL", code: "SOCIOL 300", title: "Sociology of Media and Communication", credits: 3, difficulty: "Moderate", prereqs: [] },
  { subject: "SOCIOL", code: "SOCIOL 305", title: "Sociology of Culture", credits: 3, difficulty: "Moderate", prereqs: [] },
  { subject: "SOCIOL", code: "SOCIOL 311", title: "Inequality in Cities", credits: 3, difficulty: "Moderate", prereqs: [] },
  { subject: "SOCIOL", code: "SOCIOL 316", title: "Family Violence", credits: 3, difficulty: "Moderate", prereqs: [] },
  { subject: "SOCIOL", code: "SOCIOL 331", title: "Activism, Protests, and Social Movements", credits: 3, difficulty: "Moderate", prereqs: [] },
  { subject: "SOCIOL", code: "SOCIOL 333L", title: "Sociology of Migration", credits: 3, difficulty: "Moderate", prereqs: [] },
  { subject: "SOCIOL", code: "SOCIOL 337", title: "The Police in Society", credits: 3, difficulty: "Moderate", prereqs: [] },
  { subject: "SOCIOL", code: "SOCIOL 338", title: "Criminal Courts", credits: 3, difficulty: "Moderate", prereqs: [] },
  { subject: "SOCIOL", code: "SOCIOL 339", title: "Sociology of Law", credits: 3, difficulty: "Moderate", prereqs: [] },
  { subject: "SOCIOL", code: "SOCIOL 342L", title: "Aging and Society", credits: 3, difficulty: "Moderate", prereqs: [] },
  { subject: "SOCIOL", code: "SOCIOL 346", title: "The Self in Society: Studies of Autobiographies", credits: 3, difficulty: "Moderate", prereqs: [] },
  { subject: "SOCIOL", code: "SOCIOL 350", title: "Social Statistics", credits: 3, difficulty: "Moderate", prereqs: [] },
  { subject: "SOCIOL", code: "SOCIOL 352", title: "Criminological Statistics and Data Analysis", credits: 3, difficulty: "Moderate", prereqs: [] },
  { subject: "SOCIOL", code: "SOCIOL 355L", title: "Gender, Development, &Globalization", credits: 3, difficulty: "Moderate", prereqs: [] },
  { subject: "SOCIOL", code: "SOCIOL 356", title: "Qualitative Methodology", credits: 3, difficulty: "Moderate", prereqs: [] },
  { subject: "SOCIOL", code: "SOCIOL 361", title: "The Nature of Offending over the Life Course", credits: 3, difficulty: "Moderate", prereqs: [] },
  { subject: "SOCIOL", code: "SOCIOL 362", title: "Juvenile Delinquency", credits: 3, difficulty: "Moderate", prereqs: [] },
  { subject: "SOCIOL", code: "SOCIOL 363", title: "Punishment and Corrections", credits: 3, difficulty: "Moderate", prereqs: [] },
  { subject: "SOCIOL", code: "SOCIOL 364", title: "Internet, Society, and Cyber Crime", credits: 3, difficulty: "Moderate", prereqs: [] },
  { subject: "SOCIOL", code: "SOCIOL 365", title: "Victimology", credits: 3, difficulty: "Moderate", prereqs: [] },
  { subject: "SOCIOL", code: "SOCIOL 367", title: "Drugs and Society", credits: 3, difficulty: "Moderate", prereqs: [] },
  { subject: "SOCIOL", code: "SOCIOL 368", title: "Substance Use, Abuse, and Addiction", credits: 3, difficulty: "Moderate", prereqs: [] },
  { subject: "SOCIOL", code: "SOCIOL 372", title: "Globalization and Social Change", credits: 3, difficulty: "Moderate", prereqs: [] },
  { subject: "SOCIOL", code: "SOCIOL 375L", title: "Indian Cinema", credits: 3, difficulty: "Moderate", prereqs: [] },
  { subject: "SOCIOL", code: "SOCIOL 380", title: "Special Topics", credits: 3, difficulty: "Moderate", prereqs: [] },
  { subject: "SOCIOL", code: "SOCIOL 382", title: "The Sociology of Gender", credits: 3, difficulty: "Moderate", prereqs: [] },
  { subject: "SOCIOL", code: "SOCIOL 383L", title: "Masculinities", credits: 3, difficulty: "Moderate", prereqs: [] },
  { subject: "SOCIOL", code: "SOCIOL 384", title: "Sociology of Health, Illness, and Health Care", credits: 3, difficulty: "Moderate", prereqs: [] },
  { subject: "SOCIOL", code: "SOCIOL 386", title: "The Sociology of Mental Health and Illness", credits: 3, difficulty: "Moderate", prereqs: [] },
  { subject: "SOCIOL", code: "SOCIOL 460", title: "Internship: Sociology in the City", credits: 6, difficulty: "Moderate", prereqs: [] },
  { subject: "SOCIOL", code: "SOCIOL 461", title: "Internship in Law and Criminal Justice", credits: 6, difficulty: "Moderate", prereqs: [] },
  { subject: "SOCIOL", code: "SOCIOL 470", title: "Senior Seminar in Sociology", credits: 3, difficulty: "Moderate", prereqs: [] },
  { subject: "SOCIOL", code: "SOCIOL 474", title: "Senior Seminar in Criminology and Criminal Justice", credits: 3, difficulty: "Moderate", prereqs: [] },
  { subject: "SOCIOL", code: "SOCIOL 478", title: "Directed Study in Sociology", credits: 1, difficulty: "Moderate", prereqs: [] },
  { subject: "SOCIOL", code: "SOCIOL 479", title: "Directed Study in Sociology", credits: 1, difficulty: "Moderate", prereqs: [] },

  { subject: "SPAN", code: "SPAN 101", title: "Elementary Spanish I", credits: 4, difficulty: "Moderate", prereqs: [] },
  { subject: "SPAN", code: "SPAN 102", title: "Elementary Spanish II", credits: 4, difficulty: "Moderate", prereqs: [] },
  { subject: "SPAN", code: "SPAN 160G", title: "Exile: The Latin American Experience", credits: 4, difficulty: "Moderate", prereqs: [] },
  { subject: "SPAN", code: "SPAN 200G", title: "Boston Speaks", credits: 4, difficulty: "Moderate", prereqs: [] },
  { subject: "SPAN", code: "SPAN 201", title: "Intermediate Spanish I", credits: 3, difficulty: "Moderate", prereqs: [] },
  { subject: "SPAN", code: "SPAN 202", title: "Intermediate Spanish II", credits: 3, difficulty: "Moderate", prereqs: [] },
  { subject: "SPAN", code: "SPAN 230", title: "Spanish Composition and Conversation I", credits: 3, difficulty: "Moderate", prereqs: [] },
  { subject: "SPAN", code: "SPAN 262L", title: "Latin American, Iberian, and Afro-Luso-Brazilian Literatures in Translation", credits: 3, difficulty: "Moderate", prereqs: [] },
  { subject: "SPAN", code: "SPAN 280", title: "Spanish for Heritage Speakers", credits: 3, difficulty: "Moderate", prereqs: [] },
  { subject: "SPAN", code: "SPAN 289", title: "Writing for Heritage Speakers of Spanish", credits: 3, difficulty: "Moderate", prereqs: [] },
  { subject: "SPAN", code: "SPAN 301", title: "Adv Rdg,Wrtg &Spkng", credits: 3, difficulty: "Moderate", prereqs: [] },
  { subject: "SPAN", code: "SPAN 304", title: "Spanish for Majors and Minors", credits: 3, difficulty: "Moderate", prereqs: [] },
  { subject: "SPAN", code: "SPAN 316", title: "Advanced Spanish Grammar", credits: 3, difficulty: "Moderate", prereqs: [] },
  { subject: "SPAN", code: "SPAN 317", title: "Introduction to Translation Studies (Spanish/English)", credits: 3, difficulty: "Moderate", prereqs: [] },
  { subject: "SPAN", code: "SPAN 320", title: "Varieties of Spanish in the Americas", credits: 3, difficulty: "Moderate", prereqs: [] },
  { subject: "SPAN", code: "SPAN 333", title: "Intermediate Translation Spanish/English", credits: 3, difficulty: "Moderate", prereqs: [] },
  { subject: "SPAN", code: "SPAN 352", title: "History of Spanish-American Literature", credits: 3, difficulty: "Moderate", prereqs: [] },
  { subject: "SPAN", code: "SPAN 362", title: "Spanish-American Short Story", credits: 3, difficulty: "Moderate", prereqs: [] },
  { subject: "SPAN", code: "SPAN 364", title: "Spanish-American Essay", credits: 3, difficulty: "Moderate", prereqs: [] },
  { subject: "SPAN", code: "SPAN 370", title: "Women in Spanish Literature", credits: 3, difficulty: "Moderate", prereqs: [] },
  { subject: "SPAN", code: "SPAN 374", title: "Readings in Hispanic Literature", credits: 3, difficulty: "Moderate", prereqs: [] },
  { subject: "SPAN", code: "SPAN 380", title: "Topics in Latin American, Iberian, and Afro-Luso-Brazilian Studies", credits: 3, difficulty: "Moderate", prereqs: [] },
  { subject: "SPAN", code: "SPAN 403", title: "Advanced Translation: Applied Technique", credits: 3, difficulty: "Moderate", prereqs: [] },
  { subject: "SPAN", code: "SPAN 408", title: "Adv Tech&Skls Trans", credits: 6, difficulty: "Moderate", prereqs: [] },
  { subject: "SPAN", code: "SPAN 409", title: "Advanced Practice of Translation", credits: 6, difficulty: "Moderate", prereqs: [] },
  { subject: "SPAN", code: "SPAN 432", title: "The World of Don Quixote", credits: 3, difficulty: "Moderate", prereqs: [] },
  { subject: "SPAN", code: "SPAN 450", title: "Major Writers Hispanic Literature", credits: 3, difficulty: "Moderate", prereqs: [] },
  { subject: "SPAN", code: "SPAN 452", title: "The Practice of Autobiography in Spanish and Latin-American Culture", credits: 3, difficulty: "Moderate", prereqs: [] },
  { subject: "SPAN", code: "SPAN 454L", title: "Argentina", credits: 3, difficulty: "Moderate", prereqs: [] },
  { subject: "SPAN", code: "SPAN 478", title: "Independent Study", credits: 1, difficulty: "Moderate", prereqs: [] },
  { subject: "SPAN", code: "SPAN 479", title: "Independent Study", credits: 1, difficulty: "Moderate", prereqs: [] },
  { subject: "SPAN", code: "SPAN 490L", title: "Internship Course in Latin American and Iberian Studies", credits: 3, difficulty: "Moderate", prereqs: [] },
  { subject: "SPAN", code: "SPAN 491", title: "Honors Thesis", credits: 3, difficulty: "Moderate", prereqs: [] },

  { subject: "THRART", code: "THRART 100", title: "Introduction to Theatre", credits: 3, difficulty: "Moderate", prereqs: [] },
  { subject: "THRART", code: "THRART 105", title: "Theatre Practicum 1", credits: 1, difficulty: "Moderate", prereqs: [] },
  { subject: "THRART", code: "THRART 108G", title: "Plays from Page to Stage", credits: 4, difficulty: "Moderate", prereqs: [] },
  { subject: "THRART", code: "THRART 109", title: "Multicultural American Drama", credits: 3, difficulty: "Moderate", prereqs: [] },
  { subject: "THRART", code: "THRART 115", title: "Makeup Artistry", credits: 3, difficulty: "Moderate", prereqs: [] },
  { subject: "THRART", code: "THRART 122", title: "Costume Construction", credits: 3, difficulty: "Moderate", prereqs: [] },
  { subject: "THRART", code: "THRART 123", title: "Theatre Crafts I", credits: 3, difficulty: "Moderate", prereqs: [] },
  { subject: "THRART", code: "THRART 124", title: "Theatre Crafts II: Stage Management", credits: 3, difficulty: "Moderate", prereqs: [] },
  { subject: "THRART", code: "THRART 125", title: "Introduction to Theatrical Design", credits: 3, difficulty: "Moderate", prereqs: [] },
  { subject: "THRART", code: "THRART 136", title: "Introduction to Acting", credits: 3, difficulty: "Moderate", prereqs: [] },
  { subject: "THRART", code: "THRART 201", title: "Theatre History: Origins-1660", credits: 3, difficulty: "Moderate", prereqs: [] },
  { subject: "THRART", code: "THRART 202", title: "Theatre History: 1660-Present", credits: 3, difficulty: "Moderate", prereqs: [] },
  { subject: "THRART", code: "THRART 205", title: "Theatre Practicum 2", credits: 1, difficulty: "Moderate", prereqs: [] },
  { subject: "THRART", code: "THRART 236", title: "Acting 1", credits: 3, difficulty: "Moderate", prereqs: [] },
  { subject: "THRART", code: "THRART 251", title: "Playwriting I", credits: 3, difficulty: "Moderate", prereqs: [] },
  { subject: "THRART", code: "THRART 260L", title: "Improvisation and the Art of Comedy", credits: 3, difficulty: "Moderate", prereqs: [] },
  { subject: "THRART", code: "THRART 265L", title: "Acting for the Camera", credits: 3, difficulty: "Moderate", prereqs: [] },
  { subject: "THRART", code: "THRART 275L", title: "Introduction to Screen and Television Writing", credits: 3, difficulty: "Moderate", prereqs: [] },
  { subject: "THRART", code: "THRART 300L", title: "Scenic Design for Theatre and Entertainment", credits: 3, difficulty: "Moderate", prereqs: [] },
  { subject: "THRART", code: "THRART 301", title: "Contemporary American Drama", credits: 3, difficulty: "Moderate", prereqs: [] },
  { subject: "THRART", code: "THRART 303", title: "Musical Theatre", credits: 3, difficulty: "Moderate", prereqs: [] },
  { subject: "THRART", code: "THRART 305", title: "Theatre Practicum 3", credits: 1, difficulty: "Moderate", prereqs: [] },
  { subject: "THRART", code: "THRART 316", title: "The Elizabethan Stage", credits: 3, difficulty: "Moderate", prereqs: [] },
  { subject: "THRART", code: "THRART 318", title: "Modern European Drama", credits: 3, difficulty: "Moderate", prereqs: [] },
  { subject: "THRART", code: "THRART 320", title: "Shakespearean Acting", credits: 3, difficulty: "Moderate", prereqs: [] },
  { subject: "THRART", code: "THRART 324", title: "Movement for the Actor", credits: 3, difficulty: "Moderate", prereqs: [] },
  { subject: "THRART", code: "THRART 329", title: "Theatre in London", credits: 3, difficulty: "Moderate", prereqs: [] },
  { subject: "THRART", code: "THRART 336", title: "Acting 2", credits: 3, difficulty: "Moderate", prereqs: [] },
  { subject: "THRART", code: "THRART 337", title: "Directing I", credits: 3, difficulty: "Moderate", prereqs: [] },
  { subject: "THRART", code: "THRART 338", title: "Voice for the Actor", credits: 3, difficulty: "Moderate", prereqs: [] },
  { subject: "THRART", code: "THRART 355", title: "Lighting Design", credits: 3, difficulty: "Moderate", prereqs: [] },
  { subject: "THRART", code: "THRART 361", title: "Introduction to Costume Design", credits: 3, difficulty: "Moderate", prereqs: [] },
  { subject: "THRART", code: "THRART 405", title: "Theatre Practicum 4", credits: 1, difficulty: "Moderate", prereqs: [] },
  { subject: "THRART", code: "THRART 410", title: "Topics in Dramatic Literature", credits: 3, difficulty: "Moderate", prereqs: [] },
  { subject: "THRART", code: "THRART 435", title: "Theatre Arts Internship", credits: 3, difficulty: "Moderate", prereqs: [] },
  { subject: "THRART", code: "THRART 436", title: "Advanced Acting", credits: 3, difficulty: "Moderate", prereqs: [] },
  { subject: "THRART", code: "THRART 478", title: "Independent Study", credits: 1, difficulty: "Moderate", prereqs: [] },
  { subject: "THRART", code: "THRART 479", title: "Independent Study", credits: 1, difficulty: "Moderate", prereqs: [] },
  { subject: "THRART", code: "THRART 481", title: "Selected Topics", credits: 3, difficulty: "Moderate", prereqs: [] },

  { subject: "VIET", code: "VIET 101", title: "Elementary Vietnamese I", credits: 4, difficulty: "Moderate", prereqs: [] },
  { subject: "VIET", code: "VIET 102", title: "Elementary Vietnamese II", credits: 4, difficulty: "Moderate", prereqs: [] },

  { subject: "WGS", code: "WGS 100", title: "Introduction to Women, Gender, and Sexualities in the United States", credits: 3, difficulty: "Moderate", prereqs: [] },
  { subject: "WGS", code: "WGS 110", title: "Gender in Global Context", credits: 3, difficulty: "Moderate", prereqs: [] },
  { subject: "WGS", code: "WGS 120G", title: "Women and Men in Families", credits: 4, difficulty: "Moderate", prereqs: [] },
  { subject: "WGS", code: "WGS 150", title: "Women, Culture and Identity", credits: 3, difficulty: "Moderate", prereqs: [] },
  { subject: "WGS", code: "WGS 179GL", title: "Sexuality in Nature and Culture", credits: 3, difficulty: "Moderate", prereqs: [] },
  { subject: "WGS", code: "WGS 200", title: "Feminist Literature in the US: An Intersectional Approach", credits: 3, difficulty: "Moderate", prereqs: [] },
  { subject: "WGS", code: "WGS 201", title: "Introduction to Sexuality Studies", credits: 3, difficulty: "Moderate", prereqs: [] },
  { subject: "WGS", code: "WGS 210G", title: "Gendered Bodies", credits: 3, difficulty: "Moderate", prereqs: [] },
  { subject: "WGS", code: "WGS 215L", title: "Gender & Communication", credits: 3, difficulty: "Moderate", prereqs: [] },
  { subject: "WGS", code: "WGS 220", title: "Women and the Media", credits: 3, difficulty: "Moderate", prereqs: [] },
  { subject: "WGS", code: "WGS 225L", title: "Latinas in the United States", credits: 3, difficulty: "Moderate", prereqs: [] },
  { subject: "WGS", code: "WGS 227GL", title: "Gender & Sexuality in South Asia", credits: 3, difficulty: "Moderate", prereqs: [] },
  { subject: "WGS", code: "WGS 229L", title: "Latinx Sexualities", credits: 3, difficulty: "Moderate", prereqs: [] },
  { subject: "WGS", code: "WGS 230G", title: "Reproductive Rights and Wrongs", credits: 3, difficulty: "Moderate", prereqs: [] },
  { subject: "WGS", code: "WGS 240", title: "Educating Women", credits: 3, difficulty: "Moderate", prereqs: [] },
  { subject: "WGS", code: "WGS 243L", title: "Rethinking the Family: Cross-Cultural Perspectives", credits: 3, difficulty: "Moderate", prereqs: [] },
  { subject: "WGS", code: "WGS 250", title: "Gender, Race, and Justice", credits: 3, difficulty: "Moderate", prereqs: [] },
  { subject: "WGS", code: "WGS 260", title: "Gender, Sexuality, and Health: Feminist Perspectives", credits: 3, difficulty: "Moderate", prereqs: [] },
  { subject: "WGS", code: "WGS 263G", title: "Transgender Studies: Scholarly and Community Perspectives", credits: 3, difficulty: "Moderate", prereqs: [] },
  { subject: "WGS", code: "WGS 268", title: "Global Bodies: Sex, Families, and Reproductive Rights in Transnational Perspective", credits: 3, difficulty: "Moderate", prereqs: [] },
  { subject: "WGS", code: "WGS 270", title: "Native American Women in North America", credits: 3, difficulty: "Moderate", prereqs: [] },
  { subject: "WGS", code: "WGS 280", title: "Special Topics in Women's Studies (Intermediate)", credits: 3, difficulty: "Moderate", prereqs: [] },
  { subject: "WGS", code: "WGS 290", title: "The Legal Rights of Women", credits: 3, difficulty: "Moderate", prereqs: [] },
  { subject: "WGS", code: "WGS 291", title: "Family Law", credits: 3, difficulty: "Moderate", prereqs: [] },
  { subject: "WGS", code: "WGS 292", title: "Family Law Practice", credits: 3, difficulty: "Moderate", prereqs: [] },
  { subject: "WGS", code: "WGS 293L", title: "Literature and Human Rights", credits: 3, difficulty: "Moderate", prereqs: [] },
  { subject: "WGS", code: "WGS 295L", title: "Introduction to Human Rights", credits: 3, difficulty: "Moderate", prereqs: [] },
  { subject: "WGS", code: "WGS 300L", title: "Women in African Cultures", credits: 3, difficulty: "Moderate", prereqs: [] },
  { subject: "WGS", code: "WGS 302L", title: "Psychology of Sexual Orientation and Gender Identities", credits: 3, difficulty: "Moderate", prereqs: [] },
  { subject: "WGS", code: "WGS 310L", title: "Love, Sex, and Media Effects", credits: 3, difficulty: "Moderate", prereqs: [] },
  { subject: "WGS", code: "WGS 311L", title: "American Oral History", credits: 3, difficulty: "Moderate", prereqs: [] },
  { subject: "WGS", code: "WGS 320", title: "Sexuality Education in the United States", credits: 3, difficulty: "Moderate", prereqs: [] },
  { subject: "WGS", code: "WGS 325L", title: "Sexual Identities in American Culture", credits: 3, difficulty: "Moderate", prereqs: [] },
  { subject: "WGS", code: "WGS 333L", title: "Sociology of Migration", credits: 3, difficulty: "Moderate", prereqs: [] },
  { subject: "WGS", code: "WGS 341L", title: "Gender and Film: Multidisciplinary Perspectives", credits: 3, difficulty: "Moderate", prereqs: [] },
  { subject: "WGS", code: "WGS 343L", title: "The Cultural Politics of HIV/AIDS", credits: 3, difficulty: "Moderate", prereqs: [] },
  { subject: "WGS", code: "WGS 345L", title: "Gender, Religion and Politics in South Asia", credits: 3, difficulty: "Moderate", prereqs: [] },
  { subject: "WGS", code: "WGS 347", title: "Feminisms, Intersectionality and Social Justice: Histories, Debates, Futures", credits: 3, difficulty: "Moderate", prereqs: [] },
  { subject: "WGS", code: "WGS 350", title: "Topics in Queer and Transgender Studies", credits: 3, difficulty: "Moderate", prereqs: [] },
  { subject: "WGS", code: "WGS 355L", title: "Gender, Development, &Globalization", credits: 3, difficulty: "Moderate", prereqs: [] },
  { subject: "WGS", code: "WGS 357L", title: "Women in South Asian Religions: Gender Ideology and Practice in Hinduism, Buddhism, and Islam", credits: 3, difficulty: "Moderate", prereqs: [] },
  { subject: "WGS", code: "WGS 359L", title: "Women in Modern China", credits: 3, difficulty: "Moderate", prereqs: [] },
  { subject: "WGS", code: "WGS 360", title: "Gender, Culture, and Power", credits: 3, difficulty: "Moderate", prereqs: [] },
  { subject: "WGS", code: "WGS 370", title: "Feminist Research Seminar", credits: 3, difficulty: "Moderate", prereqs: [] },
  { subject: "WGS", code: "WGS 373", title: "Sex and the City: The Politics of Race, Sexuality, and Mobility", credits: 3, difficulty: "Moderate", prereqs: [] },
  { subject: "WGS", code: "WGS 376L", title: "Women of Color", credits: 3, difficulty: "Moderate", prereqs: [] },
  { subject: "WGS", code: "WGS 394L", title: "Radical Voices of Resistance: Gender, Race and US Social Movements", credits: 3, difficulty: "Moderate", prereqs: [] },
  { subject: "WGS", code: "WGS 401", title: "Advanced Topics in Human Rights", credits: 3, difficulty: "Moderate", prereqs: [] },
  { subject: "WGS", code: "WGS 411", title: "Transnational Feminisms: Contexts, Conflicts, and Solidarity", credits: 3, difficulty: "Moderate", prereqs: [] },
  { subject: "WGS", code: "WGS 412L", title: "Gender, Human Rights, and Global Cinema", credits: 3, difficulty: "Moderate", prereqs: [] },
  { subject: "WGS", code: "WGS 420", title: "Queer of Color Critique", credits: 3, difficulty: "Moderate", prereqs: [] },
  { subject: "WGS", code: "WGS 478", title: "Independent Study", credits: 1, difficulty: "Moderate", prereqs: [] },
  { subject: "WGS", code: "WGS 479", title: "Independent Study", credits: 1, difficulty: "Moderate", prereqs: [] },
  { subject: "WGS", code: "WGS 490", title: "Internship in Women's Studies", credits: 3, difficulty: "Moderate", prereqs: [] },
  { subject: "WGS", code: "WGS 491", title: "Internship Placement", credits: 3, difficulty: "Moderate", prereqs: [] },
  { subject: "WGS", code: "WGS 498", title: "Honors Research Tutorial", credits: 3, difficulty: "Moderate", prereqs: [] },
  { subject: "WGS", code: "WGS 499", title: "Honors Paper Tutorial", credits: 3, difficulty: "Moderate", prereqs: [] },

];



  // =====================================================
  // ✅ GLOBAL DB EXPORT (used by journey.html and other pages)
  // =====================================================
  
  // =====================================================
  // CREDIT-CAP SAFETY (Accounting - BS Major)
  // Ensures: 8 terms × 5 courses, and no term ever exceeds 16 credits.
  // Keeps the same set of courses; only reorders between terms if needed.
  // =====================================================
  (function enforceAccountingCreditCap(){
    try{
      const creditMap = {};
      (allCourses || []).forEach(c => { if(c && c.code) creditMap[c.code] = Number(c.credits || 0); });

      const creditsOf = (code) => {
        if(!code) return 0;
        const s = String(code).trim();
        if(s === "ELECTIVE" || s.startsWith("ELECTIVE")) return 3;
        return Number(creditMap[s] || 0);
      };

      const split8x5 = (flat) => {
        const terms = [];
        for(let i=0;i<8;i++) terms.push(flat.slice(i*5, i*5 + 5));
        return terms;
      };

      const flatten8x5 = (terms) => terms.flat().slice(0, 40);

      const termCredits = (term) => term.reduce((sum, code) => sum + creditsOf(code), 0);

      const rebalance = (flat, cap) => {
        if(!Array.isArray(flat) || flat.length !== 40) return flat;
        const terms = split8x5(flat);

        // Try swapping a course from an overloaded term with a course in an underloaded term.
        // Deterministic + guarded so we never loop forever.
        for(let guard=0; guard<400; guard++){
          const crs = terms.map(termCredits);
          const overIdx = crs.findIndex(v => v > cap);
          if(overIdx < 0) break;

          // Find the best underloaded term to swap into
          let bestUnder = -1;
          let bestSlack = -1;
          for(let j=0;j<8;j++){
            if(j === overIdx) continue;
            const slack = cap - crs[j];
            if(slack > bestSlack) { bestSlack = slack; bestUnder = j; }
          }
          if(bestUnder < 0 || bestSlack <= 0) break;

          // Pick a swappable course in the overloaded term (prefer highest credit first)
          const overTerm = terms[overIdx];
          const underTerm = terms[bestUnder];

          const overCandidates = overTerm
            .map((code, idx) => ({ code, idx, cr: creditsOf(code) }))
            .sort((a,b) => b.cr - a.cr);

          const underCandidates = underTerm
            .map((code, idx) => ({ code, idx, cr: creditsOf(code) }))
            .sort((a,b) => a.cr - b.cr);

          let swapped = false;
          for(const o of overCandidates){
            for(const u of underCandidates){
              // Swap if it reduces the overloaded term enough and doesn't break the other term.
              const newOver = crs[overIdx] - o.cr + u.cr;
              const newUnder = crs[bestUnder] - u.cr + o.cr;
              if(newOver <= cap && newUnder <= cap){
                const tmp = overTerm[o.idx];
                overTerm[o.idx] = underTerm[u.idx];
                underTerm[u.idx] = tmp;
                swapped = true;
                break;
              }
            }
            if(swapped) break;
          }

          // If we couldn't find a perfect swap, try pushing a higher-credit course into the term with the most slack.
          if(!swapped){
            const j = bestUnder;
            const slackTerm = terms[j];
            for(const o of overCandidates){
              if(o.cr <= 0) continue;
              // Find a lower/equal credit course to swap with (so slack term won't exceed cap)
              const u = slackTerm
                .map((code, idx) => ({ code, idx, cr: creditsOf(code) }))
                .sort((a,b)=>a.cr-b.cr)
                .find(x => (crs[j] - x.cr + o.cr) <= cap);
              if(!u) continue;
              const newOver = crs[overIdx] - o.cr + u.cr;
              if(newOver <= cap){
                const tmp = overTerm[o.idx];
                overTerm[o.idx] = slackTerm[u.idx];
                slackTerm[u.idx] = tmp;
                swapped = true;
                break;
              }
            }
          }

          if(!swapped) break;
        }

        return flatten8x5(terms);
      };

      const m = (demoMajors || []).find(x => x && x.name === "Accounting - BS Major");
      if(!m) return;

      const cap = Number(m.creditCap || 16) || 16;
      const src = (Array.isArray(m.roadmapFlat) && m.roadmapFlat.length === 40)
        ? m.roadmapFlat.slice()
        : (Array.isArray(m.required) ? m.required.slice(0,40) : []);

      if(src.length !== 40) return;

      const out = rebalance(src, cap);

      // Keep both in sync so journey.html works regardless of which field it reads.
      m.roadmapFlat = out.slice();
      
    }catch(e){}
  })();



// =====================================================
// FIRST YEAR SEMINARS (FYS)
// - Adds "FYS | First Year Seminars" as a selectable Subject filter
// - Ensures ALL listed first-year seminar courses show up under the "FYS" filter
// - Adds any missing FYS courses without removing any existing course data
// =====================================================
const FIRST_YEAR_SEMINAR_CODES = new Set(["AFRSTY 115G", "AMST 110G", "ANTH 112G", "ANTH 113G", "BUSADM 120G", "CINE 121G", "ECHD 101G", "ECON 110G", "ENGL 125G", "ENGL 126G", "ENGL 127G", "ENGL 181G", "ENGL 183G", "ENGL 185G", "ENGL 186G", "ENGL 187G", "ENVSCI 179G", "LABOR 111G", "MUSIC 105G", "PHIL 130G", "POLSCI 113G", "PSYCH 131G", "RELSTY 115G", "SEMINR 114G", "SEMINR 120G", "SOCIOL 110G", "SOCIOL 120G", "SPAN 160G", "WGS 120G"]);

// Add any FYS courses that were not already in the catalog
const missingFirstYearSeminars = [
    { code:"PSYCH 131G", title:"Personal and Social Determinants of Health: Disparity, Equity, and Health Promotion", credits:4, difficulty:"Easy", type:["PSYCH","FYS","First Year Seminar"], prereqs:[], fys:true },
    { code:"RELSTY 115G", title:"Religion, Politics, Sex & Violence", credits:4, difficulty:"Easy", type:["RELSTY","FYS","First Year Seminar"], prereqs:[], fys:true },
    { code:"SEMINR 114G", title:"Invest Across Curriculum", credits:4, difficulty:"Easy", type:["SEMINR","FYS","First Year Seminar"], prereqs:[], fys:true },
    { code:"SEMINR 120G", title:"Mind-Body Connection", credits:4, difficulty:"Easy", type:["SEMINR","FYS","First Year Seminar"], prereqs:[], fys:true },
    { code:"SOCIOL 110G", title:"Insiders/Outsiders", credits:4, difficulty:"Easy", type:["SOCIOL","FYS","First Year Seminar"], prereqs:[], fys:true },
    { code:"SOCIOL 120G", title:"Sociology of Popular Culture", credits:4, difficulty:"Easy", type:["SOCIOL","FYS","First Year Seminar"], prereqs:[], fys:true },
    { code:"SPAN 160G", title:"Exile: The Latin American Experience", credits:4, difficulty:"Easy", type:["SPAN","FYS","First Year Seminar"], prereqs:[], fys:true },
    { code:"WGS 120G", title:"Women and Men in Families", credits:4, difficulty:"Easy", type:["WGS","FYS","First Year Seminar"], prereqs:[], fys:true },
];
missingFirstYearSeminars.forEach(c => {
  if(!allCourses.some(x => (x.code || "").toUpperCase() === c.code.toUpperCase())) {
    allCourses.push(c);
  }
});

// Tag all existing (and newly added) FYS courses so the "FYS" subject filter works
allCourses.forEach(c => {
  if(!c || !c.code) return;
  if(FIRST_YEAR_SEMINAR_CODES.has(c.code)) {
    c.fys = true;
    if(!Array.isArray(c.type)) c.type = [];
    if(!c.type.includes("FYS")) c.type.push("FYS");
    if(!c.type.includes("First Year Seminar")) c.type.push("First Year Seminar");
  }
});

// =====================================================
// INTERMEDIATE SEMINARS (IMS)
// - Adds "IMS | Intermediate Seminars" as a selectable Subject filter
// - Ensures ALL listed intermediate seminar courses show up under the "IMS" filter
// - Adds any missing IMS courses without removing any existing course data
// =====================================================
const INTERMEDIATE_SEMINAR_CODES = new Set([
  "AFRSTY 292G",
  "AMST 240G",
  "ANTH 220G",
  "ANTH 224G",
  "ASAMST 250G",
  "ASIAN 227GL",
  "CLSICS 218G",
  "CLSICS 240G",
  "ECON 212G",
  "ECON 214GL",
  "ENGL 262G",
  "ENGL 272G",
  "ENGL 273G",
  "ENGL 274G",
  "ENVSCI 214GL",
  "HIST 290G",
  "HONORS 210G",
  "LABOR 222G",
  "MLLC 210G",
  "MLLC 250G",
  "MUSIC 205G",
  "PHIL 207G",
  "WGS 210G",
  "WGS 227GL",
  "WGS 230G",
  "WGS 263G"
]);

// Add any IMS courses that were not already in the catalog
const missingIntermediateSeminars = [
  { code:"AFRSTY 292G",  title:"African Caribbean Literature", credits:3, difficulty:"Moderate", type:["AFRSTY","IMS","Intermediate Seminar"], prereqs:[], ims:true },
  { code:"AMST 240G",    title:"War in American Culture", credits:3, difficulty:"Moderate", type:["AMST","IMS","Intermediate Seminar"], prereqs:[], ims:true },
  { code:"ANTH 220G",    title:"Indigenous Peoples and Cultural Change in Amazonia", credits:4, difficulty:"Moderate", type:["ANTH","IMS","Intermediate Seminar"], prereqs:[], ims:true },
  { code:"ANTH 224G",    title:"The Rise and Fall of the Maya", credits:3, difficulty:"Moderate", type:["ANTH","IMS","Intermediate Seminar"], prereqs:[], ims:true },
  { code:"ASAMST 250G",  title:"Rise Up! Asian American Leadership and Social Change", credits:4, difficulty:"Moderate", type:["ASAMST","IMS","Intermediate Seminar"], prereqs:[], ims:true },
  { code:"ASIAN 227GL",  title:"Gender & Sexuality in South Asia", credits:3, difficulty:"Moderate", type:["ASIAN","IMS","Intermediate Seminar","Lab"], prereqs:[], ims:true },
  { code:"CLSICS 218G",  title:"Soul & Self in Ancient Greece", credits:3, difficulty:"Moderate", type:["CLSICS","IMS","Intermediate Seminar"], prereqs:[], ims:true },
  { code:"CLSICS 240G",  title:"What's So Funny? Greek Comedy and Beyond", credits:3, difficulty:"Moderate", type:["CLSICS","IMS","Intermediate Seminar"], prereqs:[], ims:true },
  { code:"ECON 212G",    title:"Economics of the Metropolitan Area", credits:3, difficulty:"Moderate", type:["ECON","IMS","Intermediate Seminar"], prereqs:[], ims:true },
  { code:"ECON 214GL",   title:"Ecological Economics", credits:3, difficulty:"Moderate", type:["ECON","IMS","Intermediate Seminar","Lab"], prereqs:[], ims:true },
  { code:"ENGL 262G",    title:"The Art of Literature", credits:3, difficulty:"Moderate", type:["ENGL","IMS","Intermediate Seminar"], prereqs:[], ims:true },
  { code:"ENGL 272G",    title:"The Art of Poetry", credits:3, difficulty:"Moderate", type:["ENGL","IMS","Intermediate Seminar"], prereqs:[], ims:true },
  { code:"ENGL 273G",    title:"The Art of Fiction", credits:3, difficulty:"Moderate", type:["ENGL","IMS","Intermediate Seminar"], prereqs:[], ims:true },
  { code:"ENGL 274G",    title:"The Art of Drama", credits:3, difficulty:"Moderate", type:["ENGL","IMS","Intermediate Seminar"], prereqs:[], ims:true },
  { code:"ENVSCI 214GL", title:"Ecological Economics", credits:4, difficulty:"Moderate", type:["ENVSCI","IMS","Intermediate Seminar","Lab"], prereqs:[], ims:true },
  { code:"HIST 290G",    title:"Globalization in Historical Perspective", credits:3, difficulty:"Moderate", type:["HIST","IMS","Intermediate Seminar"], prereqs:[], ims:true },
  { code:"HONORS 210G",  title:"Honors Intermediate Seminar", credits:3, difficulty:"Moderate", type:["HONORS","IMS","Intermediate Seminar"], prereqs:[], ims:true },
  { code:"LABOR 222G",   title:"Labor and Migration", credits:3, difficulty:"Moderate", type:["LABOR","IMS","Intermediate Seminar"], prereqs:[], ims:true },
  { code:"MLLC 210G",    title:"Great Books", credits:3, difficulty:"Moderate", type:["MLLC","IMS","Intermediate Seminar"], prereqs:[], ims:true },
  { code:"MLLC 250G",    title:"Witches and Witch-Hunts", credits:3, difficulty:"Moderate", type:["MLLC","IMS","Intermediate Seminar"], prereqs:[], ims:true },
  { code:"MUSIC 205G",   title:"Introduction to Ethnomusicology", credits:3, difficulty:"Moderate", type:["MUSIC","IMS","Intermediate Seminar"], prereqs:[], ims:true },
  { code:"PHIL 207G",    title:"The Meaning of Life", credits:3, difficulty:"Moderate", type:["PHIL","IMS","Intermediate Seminar"], prereqs:[], ims:true },
  { code:"WGS 210G",     title:"Gendered Bodies", credits:3, difficulty:"Moderate", type:["WGS","IMS","Intermediate Seminar"], prereqs:[], ims:true },
  { code:"WGS 227GL",    title:"Gender & Sexuality in South Asia", credits:3, difficulty:"Moderate", type:["WGS","IMS","Intermediate Seminar","Lab"], prereqs:[], ims:true },
  { code:"WGS 230G",     title:"Reproductive Rights and Wrongs", credits:3, difficulty:"Moderate", type:["WGS","IMS","Intermediate Seminar"], prereqs:[], ims:true },
  { code:"WGS 263G",     title:"Transgender Studies: Scholarly and Community Perspectives", credits:3, difficulty:"Moderate", type:["WGS","IMS","Intermediate Seminar"], prereqs:[], ims:true },
];

missingIntermediateSeminars.forEach(c => {
  if(!allCourses.some(x => (x.code || "").toUpperCase() === c.code.toUpperCase())) {
    allCourses.push(c);
  }
});

// Tag all existing (and newly added) IMS courses so the "IMS" subject filter works
allCourses.forEach(c => {
  if(!c || !c.code) return;
  if(INTERMEDIATE_SEMINAR_CODES.has(c.code)) {
    c.ims = true;
    if(!Array.isArray(c.type)) c.type = [];
    if(!c.type.includes("IMS")) c.type.push("IMS");
    if(!c.type.includes("Intermediate Seminar")) c.type.push("Intermediate Seminar");
  }
});

// =====================================================
// SAMPLE 4-YEAR PLANS (starter templates — optional)
// Notes: These are *examples only*. Students should verify with an advisor.
// =====================================================
const samplePlans = {
  "Accounting (AF)": {
    major: "Accounting (AF)",
    notes: "Sample plan only — verify requirements and prerequisites with UMass Boston.",
    years: [
      {
        year: 1,
        label: "Foundation (General Education & Intro Business)",
        terms: {
          Fall: ["ENGL 101", "MATH 134/135 (Math requirement)", "Intro Psych/Soc (Gen Ed)", "First Year Seminar", "Gen Ed Elective"],
          Spring: ["ENGL 102", "ECON 101 (Micro)", "MSIS 110 (Excel)", "Gen Ed / Accounting elective", "Foreign Language (if required)"]
        }
      },
      {
        year: 2,
        label: "Core Business & Introduction to Accounting",
        terms: {
          Fall: ["ECON 102 (Macro)", "AF 210", "MSIS 111 (Stats)", "MKT 301", "Gen Ed"],
          Spring: ["AF 211", "AF 301", "MSIS 212", "MGT 303", "Gen Ed"]
        }
      },
      {
        year: 3,
        label: "Advanced Accounting Core",
        terms: {
          Fall: ["AF 363", "AF 330", "MGT 330", "LATAM 100", "MUSIC 100"],
          Spring: ["AF 310", "AF 311", "Finance 301 (or AF elective)", "LATAM 100", "MUSIC 100"]
        }
      },
      {
        year: 4,
        label: "Specialized Electives & Graduation Prep",
        terms: {
          Fall: ["AF 470 (Auditing)", "AF 450 (Federal Taxation I)", "Management elective", "General electives", "Apply for graduation (WISER)"],
          Spring: ["Capstone / Advanced AF elective", "AF elective (AF 451/478/480/488)", "Final general electives", "Commencement"]
        }
      }
    ]
  },
"Management (MGT)": {
    major: "Management (MGT)",
    notes: "Sample plan only — verify requirements and prerequisites with UMass Boston.",
    years: [
      { year: 1, label: "Foundation & General Education", terms: { Fall: ["ENGL 101","MATH 114/115","Gen Ed","First-Year Seminar","LATAM 100"], Spring: ["ENGL 102","MSIS 110","ECON 101","Gen Ed","LATAM 100"] } },
      { year: 2, label: "Business Core & Foundation", terms: { Fall: ["AF 210","ECON 102","MSIS 111L","Gen Ed","LATAM 100"], Spring: ["AF 211","MGT 303","MSIS 212","Gen Ed","LATAM 100"] } },
      { year: 3, label: "Management Core", terms: { Fall: ["MKT 301","AF 301","MGT 330","Gen Ed","LATAM 100"], Spring: ["MSIS 301","MGT 331","Major Elective","Gen Ed","LATAM 100"] } },
      { year: 4, label: "Specialization & Graduation", terms: { Fall: ["Management Elective","Management Elective","Gen Ed","LATAM 100"], Spring: ["MGT 490 (Capstone)","Management Elective","LATAM 100","LATAM 100"] } }
    ],
    requirements: [
      "Complete the Management Achievement Program (MAP).",
      "Residency: at least six management core courses completed at UMass Boston.",
      "Minimum cumulative GPA: 2.0.",
      "Apply to graduate in WISER by the deadline."
    ]
  },
"Marketing (MKT)": {
    major: "Marketing (MKT)",
    notes: "Sample plan only — verify requirements and prerequisites with UMass Boston.",
    years: [
      { year: 1, label: "Foundations", terms: { Fall: ["Intro Academic Writing","College Algebra/Calculus","ECON 101","Gen Ed"], Spring: ["Critical Reading/Writing","ECON 102","MGT 101","Gen Ed"] } },
      { year: 2, label: "Business Core", terms: { Fall: ["AF 210","MSIS 111","MKT 301","Gen Ed"], Spring: ["AF 211","MSIS (MIS)","MGT 303","MKT 408 (Elective)"] } },
      { year: 3, label: "Advanced Marketing Core", terms: { Fall: ["Marketing Research","FIN 301","MSIS 301 (Ops)","Gen Ed"], Spring: ["MKT 403","MKT 441 (Elective)","Gen Ed"] } },
      { year: 4, label: "Specialization & Internship", terms: { Fall: ["MKT 478","MKT 479 (Elective)","Electives"], Spring: ["MKT 480 (Internship) or MKT 430","Final Gen Ed"] } }
    ],
    notesList: [
      "Key electives (choose 4): MKT 405, MKT 407, MKT 408, MKT 441, MKT 479, etc."
    ]
  }
,
  "Management Science & Information Systems (MSIS)": {
    major: "Management Science & Information Systems (MSIS)",
    notes: "Sample plan only — verify requirements and prerequisites with UMass Boston.",
    years: [
      { year: 1, label: "Foundation", terms: { Fall: ["BUSADM 101 or BUSADM 120G", "ENGL 101", "MATH 134/135 (or math requirement)", "ECON 101", "Gen Ed"], Spring: ["ENGL 102", "MSIS 110", "ECON 102", "Gen Ed", "Gen Ed"] } },
      { year: 2, label: "MSIS Core", terms: { Fall: ["MSIS 111L", "MSIS 212", "AF 210", "Gen Ed", "LATAM 100"], Spring: ["MSIS 230L", "MSIS 301", "AF 211", "Gen Ed", "LATAM 100"] } },
      { year: 3, label: "Analytics / Systems", terms: { Fall: ["MSIS 310", "MSIS 425L", "Major Elective", "LATAM 100", "LATAM 100"], Spring: ["MSIS 461L", "Major Elective", "LATAM 100", "LATAM 100"] } },
      { year: 4, label: "Advanced + Experience", terms: { Fall: ["MSIS 411 or MSIS 415", "Major Elective", "Electives"], Spring: ["MSIS 480 (Internship)", "Electives"] } }
    ]
  },
  "Supply Chain & Service Management (SCSM)": {
    major: "Supply Chain & Service Management (SCSM)",
    notes: "Sample plan only — verify requirements and prerequisites with UMass Boston.",
    years: [
      { year: 1, label: "Foundation", terms: { Fall: ["BUSADM 101 or BUSADM 120G", "ENGL 101", "Math/Stats", "ECON 101", "Gen Ed"], Spring: ["ENGL 102", "ECON 102", "MSIS 110", "Gen Ed", "LATAM 100"] } },
      { year: 2, label: "Business Core", terms: { Fall: ["AF 210", "MKT 301", "MGT 303", "Gen Ed", "LATAM 100"], Spring: ["AF 211", "MSIS 301", "BC 290", "Gen Ed", "LATAM 100"] } },
      { year: 3, label: "SCSM Concentration", terms: { Fall: ["SCSM 350", "SCSM 454L", "LATAM 100", "LATAM 100"], Spring: ["SCSM 495", "SCSM 450 or SCSM 451", "LATAM 100", "LATAM 100"] } },
      { year: 4, label: "Finish + Experience", terms: { Fall: ["Electives", "Electives"], Spring: ["Internship or Electives", "Electives"] } }
    ]
  },
  "Business Communications (BC)": {
    major: "Business Communications (BC)",
    notes: "Sample plan only — verify requirements and prerequisites with UMass Boston.",
    years: [
      { year: 1, label: "Writing Foundations", terms: { Fall: ["ENGL 101", "Gen Ed", "Gen Ed", "BUSADM 101/120G"], Spring: ["ENGL 102", "Gen Ed", "Gen Ed"] } },
      { year: 2, label: "BC Core", terms: { Fall: ["BC 230", "Business Core", "Gen Ed"], Spring: ["BC 290", "Business Core", "Gen Ed"] } },
      { year: 3, label: "BC Skills", terms: { Fall: ["BC 295 (optional)", "Electives"], Spring: ["BC 298 (optional)", "Electives"] } }
    ]
  },
  "Business Administration (BUSADM)": {
    major: "Business Administration (BUSADM)",
    notes: "These seminars are intended for students with fewer than 30 credits and help first-semester students transition and learn core business concepts.",
    years: [
      { year: 1, label: "First-Year Seminar + Gen Ed", terms: { Fall: ["BUSADM 101 or BUSADM 120G", "ENGL 101", "ECON 101/102", "MATH 134/135", "Gen Ed"], Spring: ["ENGL 102", "Core Business", "Gen Ed", "Gen Ed"] } }
    ]
  }

};




  // =====================================================
  // STATE
  // =====================================================

  // Start EMPTY (user must select major and add courses manually)
  let plan = [];

  // Selected major / subject / track (user-driven)
  let selectedMajorName = "";     // e.g., "Information Technology"
  let selectedSubjectCode = "";   // e.g., "IT"
  let selectedTrackName = "";     // e.g., "Information Architecture"


  // =====================================================
  // DOM ELEMENTS (Dashboard)
  // =====================================================
  const elCourseList = document.getElementById("courseList");
  const elPlanList = document.getElementById("planList");

  // Existing: course search (by code/title)
  const elSearch = document.getElementById("searchInput");

  // Existing: credit amount filter (exact match)
  const creditFilterInput = document.getElementById("creditFilterInput");


  // NEW (Dashboard): major search (type/pick)
  // Support multiple possible IDs so the majors dropdown always works.
  const majorSearchInput =
    document.getElementById("majorSearchInput") ||
    document.getElementById("majorSearch") ||
    document.querySelector('input[list="majorList"]') ||
    document.querySelector('input[list="majorsList"]');

  const majorList =
    document.getElementById("majorList") ||
    document.getElementById("majorsList") ||
    document.querySelector("datalist#majorList") ||
    document.querySelector("datalist#majorsList");

  // NEW (Dashboard): subject search (type/pick)
  const subjectSearchInput = document.getElementById("subjectSearchInput"); // <input list="subjectList">
  const subjectList = document.getElementById("subjectList");               // <datalist id="subjectList">

  // NEW (Dashboard): track search (type/pick)
  const trackSearchInput = document.getElementById("trackSearchInput"); // <input list="trackList">
  const trackList = document.getElementById("trackList");               // <datalist id="trackList">

  

  const totalCreditsEl = document.getElementById("totalCredits");
  const sumCreditsEl = document.getElementById("sumCredits");
  const sumCoursesEl = document.getElementById("sumCourses");
  const sumHardEl = document.getElementById("sumHard");
  const sumLabEl = document.getElementById("sumLab");
  const sumWriteEl = document.getElementById("sumWrite");
  const suggestionTextEl = document.getElementById("suggestionText");
  const prereqHintEl = document.getElementById("prereqHint");
  const needle = document.getElementById("needle");

  const donutEarned = document.getElementById("donutEarned");
  const donutTop = document.getElementById("donutTop");
  const earnedTxt = document.getElementById("earnedTxt");
  const neededTxt = document.getElementById("neededTxt");
  const earnedLegend = document.getElementById("earnedLegend");
  const leftLegend = document.getElementById("leftLegend");
  const earnedInput = document.getElementById("earnedInput");
  const neededInput = document.getElementById("neededInput");

  const themeSwitch = document.getElementById("themeSwitch");


  // =====================================================
  // HELPERS
  // =====================================================
  const uniqByCode = (arr) => {
    const seen = new Set();
    return arr.filter(c => (seen.has(c.code) ? false : (seen.add(c.code), true)));
  };

  function getSubjectFromCourseCode(code){
    const raw = (code || "").trim();

    // Handle two-part subject codes like "EDC U 212"
    if(raw.toUpperCase().startsWith("EDC U ")) return "EDC U";

    // Default: first token (e.g., "IT 110" -> "IT")
    return raw.split(/\s+/)[0] || "";
  }

  function normalize(str){
    return (str || "").trim().toLowerCase();
  }

  function upper(str){
    return (str || "").trim().toUpperCase();
  }

  function compactUpper(str){
    return (str || "").replace(/\s+/g, "").toUpperCase();
  }


// =====================================================
// SUBJECT DROPDOWN (No datalist) + CLEAR BUTTON (theme-adaptive)
// - Uses CSS variables so it matches light/dark mode automatically
// - Shows a clear (remove) button as soon as a major auto-selects a subject,
//   and whenever the subject input has a value.
// =====================================================

function buildSubjectDisplayMap(){
  const map = {};
  const lines = (subjectCatalog || "").trim().split("\n").map(l => l.trim()).filter(Boolean);
  for(const line of lines){
    const parts = line.split("|").map(p => p.trim());
    if(!parts.length) continue;
    const code = (parts[0] || "").trim();
    if(!code) continue;
    map[code.toUpperCase()] = line; // "CODE | Name"
  }
  return map;
}

const SUBJECT_DISPLAY_MAP = buildSubjectDisplayMap();

function setupSubjectDropdown(){
  const input =
    document.getElementById("subjectSearchInput") ||
    document.getElementById("subjectSearch");

  if(!input) return;

  // Remove native datalist behavior if present
  input.removeAttribute("list");
  input.setAttribute("autocomplete", "off");

  // Avoid duplicating dropdown if init runs twice
  if(input.__ssDropdownAttached) return;
  input.__ssDropdownAttached = true;

  // Create dropdown container
  const dropdown = document.createElement("div");
  dropdown.style.position = "absolute";
  dropdown.style.background = "var(--panel)";
  dropdown.style.color = "var(--text)";
  dropdown.style.border = "1px solid var(--line)";
  dropdown.style.borderRadius = "8px";
  dropdown.style.boxShadow = "0 10px 25px rgba(0,0,0,0.08)";
  dropdown.style.maxHeight = "250px";
  dropdown.style.overflowY = "auto";
  dropdown.style.width = input.offsetWidth + "px";
  dropdown.style.zIndex = "999";
  dropdown.style.display = "none";

  const parent = input.parentNode;
  if(parent && parent.style) parent.style.position = parent.style.position || "relative";
  parent.appendChild(dropdown);

  const subjects = (subjectCatalog || "")
    .trim()
    .split("\n")
    .map(line => line.trim())
    .filter(Boolean);

  function renderList(filter=""){
    dropdown.innerHTML = "";
    const f = filter.toLowerCase();

    const filtered = subjects.filter(s => s.toLowerCase().includes(f));
    for(const subject of filtered){
      const item = document.createElement("div");
      item.textContent = subject;
      item.style.padding = "10px 14px";
      item.style.cursor = "pointer";
      item.style.fontSize = "14px";
      item.style.color = "var(--text)";
      item.style.background = "transparent";

      item.addEventListener("mouseenter", () => { item.style.background = "var(--line)"; });
      item.addEventListener("mouseleave", () => { item.style.background = "transparent"; });

      item.addEventListener("click", () => {
        input.value = subject;
        dropdown.style.display = "none";
        input.dispatchEvent(new Event("change"));
      });

      dropdown.appendChild(item);
    }

    dropdown.style.display = filtered.length ? "block" : "none";
  }

  input.addEventListener("focus", () => renderList(input.value || ""));
  input.addEventListener("input", (e) => renderList(e.target.value || ""));

  // Keep width correct if input resizes
  window.addEventListener("resize", () => { dropdown.style.width = input.offsetWidth + "px"; });

  // Close on outside click
  document.addEventListener("click", (e) => {
    if(!input.contains(e.target) && !dropdown.contains(e.target)){
      dropdown.style.display = "none";
    }
  });
}

function setupSubjectClearButton(){
  const input =
    document.getElementById("subjectSearchInput") ||
    document.getElementById("subjectSearch");

  if(!input) return;

  // Try to use an existing clear button (so the look stays the same)
  const existing =
    document.getElementById("subjectClearBtn") ||
    document.getElementById("subjectClear") ||
    document.getElementById("clearSubjectBtn") ||
    document.getElementById("subjectRemoveBtn");

  let btn = existing;

  // If there isn't one in the HTML, create a minimal one that matches the app theme.
  if(!btn){
    btn = document.createElement("button");
    btn.type = "button";
    btn.setAttribute("aria-label","Clear subject");
    btn.innerHTML = "&times;";

    // Theme-adaptive styling (keeps the visual consistent across light/dark)
    btn.style.position = "absolute";
    btn.style.right = "8px";
    btn.style.top = "50%";
    btn.style.transform = "translateY(-50%)";
    btn.style.width = "28px";
    btn.style.height = "28px";
    btn.style.borderRadius = "999px";
    btn.style.border = "1px solid var(--line)";
    btn.style.background = "var(--panel)";
    btn.style.color = "var(--muted)";
    btn.style.cursor = "pointer";
    btn.style.display = "none";
    btn.style.lineHeight = "1";
    btn.style.fontSize = "18px";
    btn.style.padding = "0";
    btn.style.userSelect = "none";

    btn.addEventListener("mouseenter", () => { btn.style.background = "var(--line)"; });
    btn.addEventListener("mouseleave", () => { btn.style.background = "var(--panel)"; });

    const parent = input.parentNode;
    if(parent && parent.style) parent.style.position = parent.style.position || "relative";
    parent.appendChild(btn);

    // Ensure the text doesn't overlap the button if the input has no padding-right
    try{
      const currentPR = parseFloat(getComputedStyle(input).paddingRight) || 0;
      if(currentPR < 40) input.style.paddingRight = "44px";
    }catch(_e){}
  }

  function show(){
    btn.style.display = "flex";
    btn.style.alignItems = "center";
    btn.style.justifyContent = "center";
  }

  function hide(){
    btn.style.display = "none";
  }

  function sync(){
    const hasValue = !!String(input.value || "").trim();
    if(hasValue) show(); else hide();
  }

  // Clear action
  btn.addEventListener("click", () => {
    input.value = "";
    selectedSubjectCode = "";
    hide();
    renderCourseList();
    // Keep focus on the input for quick re-entry
    input.focus();
    input.dispatchEvent(new Event("change"));
  });

  // Keep visibility up-to-date
  input.addEventListener("input", sync);
  input.addEventListener("change", sync);

  // Expose a tiny helper for major-change auto-fills
  input.__ssSyncClear = sync;

  // Initialize state
  sync();
}

function setSubjectFromMajor(majorObj){
  if(!majorObj) return;
  const input =
    document.getElementById("subjectSearchInput") ||
    document.getElementById("subjectSearch");
  if(!input) return;

  const code = String(majorObj.subject || "").trim().toUpperCase();
  if(!code) return;

  selectedSubjectCode = code;
  input.value = SUBJECT_DISPLAY_MAP[code] || code;

  // Show the clear button immediately (keep same look if HTML provides it)
  if(typeof input.__ssSyncClear === "function") input.__ssSyncClear();
}


  function isITSignal(text){
    const t = normalize(text);
    return t.includes("it") || t.includes("information technology");
  }

  function courseIconClass(code){
    const pick = code.charCodeAt(0) % 4;
    return ["i-green","i-blue","i-orange","i-red"][pick];
  }

  function courseIconSvg(typeArr){
    const t = (typeArr||[]).join(" ").toLowerCase();
    if(t.includes("lab")) return `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 3h6v2h-1v5.2l4.8 7.9A3 3 0 0 1 16.2 22H7.8a3 3 0 0 1-2.6-3.9L10 10.2V5H9V3Zm2.1 9-4.2 6.9c-.4.7.1 1.6.9 1.6h8.4c.8 0 1.3-.9.9-1.6L12.9 12h-1.8Z"/></svg>`;
    if(t.includes("writing")) return `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 3h12a2 2 0 0 1 2 2v10h-2V5H4v14h8v2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Zm17.7 12.3-6.9 6.9-2.8.5.5-2.8 6.9-6.9 2.3 2.3Zm-2.3-2.3 1.4-1.4a1 1 0 0 1 1.4 0l.9.9a1 1 0 0 1 0 1.4L21.7 15l-2.3-2.3Z"/></svg>`;
    if(t.includes("math")) return `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 5h10v2H7V5Zm0 6h10v2H7v-2Zm0 6h10v2H7v-2Z"/></svg>`;
    if(t.includes("security")) return `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2 4 5.5V11c0 5 3.4 9.4 8 11 4.6-1.6 8-6 8-11V5.5L12 2Zm0 18c-3.3-1.3-6-4.9-6-9V6.7l6-2.6 6 2.6V11c0 4.1-2.7 7.7-6 9Z"/></svg>`;
    return `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3 1 9l11 6 9-4.9V17h2V9L12 3Zm0 9.8L4.2 9 12 5.2 19.8 9 12 12.8Z"/><path d="M6 13.5V17c0 2.2 3.1 4 6 4s6-1.8 6-4v-3.5l-6 3.2-6-3.2Z"/></svg>`;
  }

  function prereqsMet(course, takenSet){
    const prereqs = course.prereqs || [];
    return prereqs.every(p => takenSet.has(p));
  }


  // =====================================================
  // POPULATE DATALISTS
  // =====================================================
  function populateMajorList(){
    if(!majorList) return;
    majorList.innerHTML = demoMajors
      .map(m => `<option value="${m.name}"></option>`)
      .join("");
  }


  // =====================================================
  // MAJOR DROPDOWN (custom, so it opens on click even when empty)
  // =====================================================
  function setupMajorDropdown(){
    if(!majorSearchInput) return;

    // Prevent double-init across pages / hot reload
    if (majorSearchInput.__majorDropdownBound) return;
    majorSearchInput.__majorDropdownBound = true;

    // Always populate datalist too (helps on some browsers when typing)
    try{ populateMajorList(); }catch(e){}

    const panel = document.createElement("div");
    panel.id = "majorDropdownPanel";
    panel.style.position = "absolute";
    panel.style.zIndex = "9999";
    panel.style.display = "none";
    panel.style.maxHeight = "280px";
    panel.style.overflowY = "auto";
    panel.style.background = "var(--panel, #101a2f)";
    panel.style.border = "1px solid var(--line, #23304a)";
    panel.style.borderRadius = "12px";
    panel.style.boxShadow = "0 12px 28px rgba(0,0,0,.28)";
    panel.style.padding = "6px";
    panel.style.minWidth = "260px";

    // Small, safe default text color
    panel.style.color = "var(--text, #e5e7eb)";

    document.body.appendChild(panel);

    let isOpen = false;

    function positionPanel(){
      const r = majorSearchInput.getBoundingClientRect();
      const top = r.bottom + window.scrollY + 6;
      const left = r.left + window.scrollX;
      panel.style.top = top + "px";
      panel.style.left = left + "px";
      panel.style.width = Math.max(r.width, 260) + "px";
    }

    function renderList(){
      const q = (majorSearchInput.value || "").trim().toLowerCase();
      const items = demoMajors
        .map(m => m && m.name ? m.name : "")
        .filter(Boolean)
        .filter(name => !q || name.toLowerCase().includes(q));

      if(!items.length){
        panel.innerHTML = `<div style="padding:10px 10px; opacity:.8; font-size:13px;">No matches</div>`;
        return;
      }

      panel.innerHTML = items.map(name => (
        `<div data-major-name="${name.replace(/"/g,'&quot;')}"
              style="padding:10px 10px; border-radius:10px; cursor:pointer; font-size:13px; line-height:1.2;">
            ${name}
         </div>`
      )).join("");

      // Hover effect
      Array.from(panel.querySelectorAll("[data-major-name]")).forEach(row => {
        row.addEventListener("mouseenter", ()=>{ row.style.background = "rgba(255,255,255,.06)"; });
        row.addEventListener("mouseleave", ()=>{ row.style.background = "transparent"; });
      });
    }

    function openPanel(){
      renderList();
      positionPanel();
      panel.style.display = "block";
      isOpen = true;
    }

    function closePanel(){
      panel.style.display = "none";
      isOpen = false;
    }

    // Keep input focused when clicking inside the panel
    panel.addEventListener("mousedown", (e)=> e.preventDefault());

    panel.addEventListener("click", (e)=>{
      const row = e.target.closest("[data-major-name]");
      if(!row) return;
      const name = row.getAttribute("data-major-name") || "";
      majorSearchInput.value = name;

      // Trigger the existing change handler in your app
      majorSearchInput.dispatchEvent(new Event("change", { bubbles:true }));

      closePanel();
    });

    majorSearchInput.addEventListener("focus", openPanel);
    majorSearchInput.addEventListener("click", openPanel);
    majorSearchInput.addEventListener("input", ()=>{
      if(!isOpen) openPanel();
      else { renderList(); positionPanel(); }
    });

    window.addEventListener("resize", ()=>{ if(isOpen) positionPanel(); });
    window.addEventListener("scroll", ()=>{ if(isOpen) positionPanel(); }, true);

    document.addEventListener("click", (e)=>{
      if(!isOpen) return;
      if(e.target === majorSearchInput) return;
      if(panel.contains(e.target)) return;
      closePanel();
    });
  }

  function populateSubjectList(){
    if(!subjectList) return;
    const lines = subjectCatalog.split("\n").map(x => x.trim()).filter(Boolean);
    subjectList.innerHTML = lines.map(line => {
      const parts = line.split("|").map(s => s.trim());
      const code = parts[0] || line;
      const name = parts[1] ? ` | ${parts[1]}` : "";
      return `<option value="${code}${name}"></option>`;
    }).join("");
  }

  function setTrackUIEnabled(isEnabled){
    if(!trackSearchInput) return;
    trackSearchInput.disabled = !isEnabled;
    trackSearchInput.placeholder = isEnabled
      ? "Search a track / concentration..."
      : "Tracks only available for selected majors";
    if(!isEnabled){
      trackSearchInput.value = "";
      selectedTrackName = "";
      if(trackList) trackList.innerHTML = "";
    }
  }

  function populateTrackListForMajor(majorName){
    if(!trackList) return;
    const tracks = demoTracksByMajor[majorName] || [];
    trackList.innerHTML = tracks.map(t => `<option value="${t}"></option>`).join("");
  }


  // =====================================================
  // RENDER: COURSE LIST (Left panel)
  // =====================================================
  function renderCourseList(){
    if(!elCourseList) return;

    const qRaw = elSearch?.value || "";
    const qLower = normalize(qRaw);
    const qUpper = upper(qRaw);
    const qCompact = compactUpper(qRaw);

    // Treat letters-only queries like "IT", "CS", "MATH" as a subject query
    // Use compact form so "EDC U" or extra spaces still works.
    const isLettersOnly = /^[A-Z]{1,12}$/.test(qCompact);
    const subjectQuery = isLettersOnly ? qCompact : "";

    // keep existing variable name used elsewhere
    const qText = qLower;

    const majorText = normalize(majorSearchInput?.value);
    const subjectText = normalize(subjectSearchInput?.value);
const creditRaw = (creditFilterInput?.value || "").trim();
    const creditVal = creditRaw === "" ? null : parseInt(creditRaw, 10);

    const forceIT =
      isITSignal(qText) ||
      isITSignal(majorText) ||
      isITSignal(subjectText) ||
      selectedMajorName === "Information Technology" ||
      selectedSubjectCode === "IT";

    const takenSet = new Set(plan.map(p => p.code));

    const filtered = allCourses.filter(c => {
      const code = c.code.toLowerCase();
      const title = (c.title || "").toLowerCase();
      const subject = getSubjectFromCourseCode(c.code).toLowerCase();

      if(forceIT){
        const matchesCredits = creditVal === null ? true : (c.credits === creditVal);
        return subject === "it" && matchesCredits;
      }

      const codeUpper = (c.code || "").toUpperCase();           // e.g., "IT 220"
      const codeCompact = compactUpper(c.code);                // e.g., "IT220"
      const titleLower = (c.title || "").toLowerCase();
      const subjectUpper = upper(getSubjectFromCourseCode(c.code)); // e.g., "IT", "CS", "MATH", "EDC U"
      const subjectUpperCompact = compactUpper(getSubjectFromCourseCode(c.code));

      const matchesText =
        qText === "" ? true : (
          codeUpper.includes(qUpper) ||          // supports "IT 220" (any casing)
          codeCompact.includes(qCompact) ||      // supports "IT220"
          titleLower.includes(qText) ||          // supports title search
          (subjectQuery !== "" && subjectUpperCompact.startsWith(subjectQuery)) // supports "IT" (letters only)
        );

      const bypassPickers = subjectQuery !== "";

      const subjFilter = normalize(selectedSubjectCode || "");
      const matchesSubject =
        bypassPickers ? true : (subjFilter === "" ? true : (
          // Special virtual subjects: FYS (First Year Seminars) and IMS (Intermediate Seminars)
          subjFilter.toUpperCase() === "FYS"
            ? (c.fys === true || (Array.isArray(c.type) && (c.type.includes("FYS") || c.type.includes("First Year Seminar"))))
            : (subjFilter.toUpperCase() === "IMS"
              ? (c.ims === true || (Array.isArray(c.type) && (c.type.includes("IMS") || c.type.includes("Intermediate Seminar"))))
              : (subject === subjFilter.toLowerCase())
            )
        ));

      const majorSubj = demoMajors.find(m => m.name === selectedMajorName)?.subject || "";
      const matchesMajor =
        bypassPickers ? true : (selectedMajorName === "" ? true : (subject === normalize(majorSubj)));

      const matchesCredits =
        creditVal === null ? true : (c.credits === creditVal);

      return matchesText && matchesCredits && matchesSubject && matchesMajor;
    });

    elCourseList.innerHTML = filtered.map(c => {
      const inPlan = plan.some(p => p.code === c.code);
      const ok = prereqsMet(c, takenSet);

      const prereqBadge = (c.prereqs && c.prereqs.length)
        ? (ok
            ? `<span class="chip" style="margin-left:8px;">Prereqs OK</span>`
            : `<span class="chip" style="margin-left:8px; border-color: rgba(239,68,68,.35); background: rgba(239,68,68,.10); color:#ef4444;">Needs prereq</span>`
          )
        : "";

      return `
        <div class="courseRow">
          <div>
            <div class="cname">
              ${c.code}
              <span style="color:var(--muted);font-weight:700;">- ${c.title}</span>
              ${prereqBadge}
            </div>
            <div class="ctitle">${c.credits} credits • ${c.difficulty}</div>
          </div>
          <button class="btn" ${inPlan ? "disabled" : ""} data-add="${c.code}">Add</button>
        </div>
      `;
    }).join("");

    elCourseList.querySelectorAll("[data-add]").forEach(btn => {
      btn.addEventListener("click", () => addCourse(btn.dataset.add));
    });
  }


  // =====================================================
  // RENDER: PLAN (Middle panel)
  // =====================================================
  function renderPlan(){
    if(!elPlanList) return;

    if(plan.length === 0){
      elPlanList.innerHTML = `
        <div class="subtle" style="padding:14px 4px;">
          No courses yet — add a class from the left to start the simulation.
        </div>
      `;
      if(prereqHintEl) prereqHintEl.textContent = "";
    } else {
      const takenSet = new Set(plan.map(p => p.code));

      elPlanList.innerHTML = plan.map(c => {
        const cls = courseIconClass(c.code);
        const ok = prereqsMet(c, takenSet);

        const prereqLine = (c.prereqs && c.prereqs.length)
          ? `<div class="hint" style="margin-top:8px; ${ok ? "" : "color:#ef4444; font-weight:900;"}">
              Prereq: ${c.prereqs.join(", ")} ${ok ? "(OK)" : "(Not met yet — warning only)"}
            </div>`
          : "";

        const chips = [
          `${c.credits} Credits`,
          c.difficulty,
          ...c.type
        ].map(x => `<span class="chip">${x}</span>`).join("");

        return `
          <div class="planItem">
            <div class="icon ${cls}">${courseIconSvg(c.type)}</div>
            <div class="meta">
              <div class="code">${c.code}</div>
              <div class="title">${c.title}</div>
              <div class="chips">${chips}</div>
              ${prereqLine}
            </div>
            <button class="remove" title="Remove" data-remove="${c.code}">✕</button>
          </div>
        `;
      }).join("");

      elPlanList.querySelectorAll("[data-remove]").forEach(btn => {
        btn.addEventListener("click", () => removeCourse(btn.dataset.remove));
      });

      if(prereqHintEl) prereqHintEl.textContent = "Prereqs are simulated (warnings only).";
    }

    updateAnalysis();
  }

  function addCourse(code){
    const c = allCourses.find(x => x.code === code);
    if(!c) return;
    if(plan.some(p => p.code === code)) return;
    plan = uniqByCode([...plan, c]);
    renderCourseList();
    renderPlan();
  }

  function removeCourse(code){
    plan = plan.filter(p => p.code !== code);
    renderCourseList();
    renderPlan();
  }


  // =====================================================
  // WORKLOAD LOGIC (Right panel)
  // =====================================================
  function computeWorkload(){
    let credits = 0, hard = 0, lab = 0, writing = 0, score = 0;

    for(const c of plan){
      credits += c.credits;

      const diff = (c.difficulty || "").toLowerCase();
      if(diff.includes("hard")) { score += 2; hard += 1; }
      else if(diff.includes("moderate")) score += 1;

      const types = (c.type || []).map(t => t.toLowerCase());
      if(types.includes("lab")) { score += 2; lab += 1; }
      if(types.includes("writing")) { score += 1; writing += 1; }

      score += Math.max(0, c.credits - 2) * 0.6;
    }

    let label = "Light";
    if(score >= 10 && score < 16) label = "Normal";
    else if(score >= 16 && score < 21) label = "Heavy";
    else if(score >= 21) label = "Overload";

    return { credits, hard, lab, writing, score, label };
  }

  function updateAnalysis(){
    const { credits, hard, lab, writing, score, label } = computeWorkload();

    if(totalCreditsEl) totalCreditsEl.textContent = credits;
    if(sumCreditsEl) sumCreditsEl.textContent = credits;
    if(sumCoursesEl) sumCoursesEl.textContent = plan.length;
    if(sumHardEl) sumHardEl.textContent = hard;
    if(sumLabEl) sumLabEl.textContent = lab;
    if(sumWriteEl) sumWriteEl.textContent = writing;

    if(suggestionTextEl){
      if(plan.length === 0){
        suggestionTextEl.textContent = "Add courses to see workload suggestions.";
      } else {
        const msg = {
          "Light": "Looks light — you could add another course if you want.",
          "Normal": "Balanced semester — good mix of credits and difficulty.",
          "Heavy": "This is getting heavy — consider swapping a hard course for an easier one.",
          "Overload": "Overload risk — reduce hard/lab courses to avoid burnout."
        }[label];
        suggestionTextEl.textContent = msg;
      }
    }

  if(needle){
  // NEVER let needle go past Overload
  const MAX_SCORE_FOR_SCALE = 21; // overload threshold
  const normalized = Math.max(0, Math.min(score, MAX_SCORE_FOR_SCALE));

  // Map to arc range (-90deg left → +90deg right)
  const angle = -90 + (normalized / MAX_SCORE_FOR_SCALE) * 180;

  needle.setAttribute("transform", `rotate(${angle} 140 150)`);
}
    updateCreditDonut();

  }

  // =====================================================
  // CREDIT DONUT (Right panel)
  // =====================================================
  function updateCreditDonut(){
    if(!donutEarned || !donutTop || !earnedInput || !neededInput) return;

    let earned = parseInt(earnedInput.value || "0", 10);
    let needed = parseInt(neededInput.value || "120", 10);
    if(isNaN(earned)) earned = 0;
    if(isNaN(needed) || needed < 1) needed = 1;
    earned = Math.max(0, Math.min(earned, needed));

    const left = Math.max(0, needed - earned);

    if(earnedTxt) earnedTxt.textContent = earned;
    if(neededTxt) neededTxt.textContent = needed;
    if(earnedLegend) earnedLegend.textContent = earned;
    if(leftLegend) leftLegend.textContent = left;

    donutTop.textContent = `${earned} / ${needed}`;

    const r = 46;
    const c = 2 * Math.PI * r;
    const pct = needed === 0 ? 0 : earned / needed;
    donutEarned.style.strokeDasharray = `${(pct*c).toFixed(1)} ${(c).toFixed(1)}`;
  }


  // =====================================================
  // BUTTONS
  // =====================================================
  const clearBtn = document.getElementById("clearBtn");
  if(clearBtn){
    clearBtn.addEventListener("click", () => {
      plan = [];
      renderCourseList();
      renderPlan();
    });
  }

  const saveBtn = document.getElementById("saveBtn");
  if(saveBtn){
    saveBtn.addEventListener("click", () => {
      alert("Simulation only: this demo doesn’t use accounts yet.\n\nNext step: save to localStorage or a database.");
    });
  }

  const suggestBtn = document.getElementById("suggestBtn");
  if(suggestBtn){
    suggestBtn.addEventListener("click", () => {
      const { label, hard, lab, writing, credits } = computeWorkload();
      const tips = [];
      if(label === "Overload" || label === "Heavy"){
        if(hard >= 2) tips.push("Try replacing one Hard course with a Moderate/Easy course.");
        if(lab >= 1) tips.push("Labs add time — avoid stacking multiple labs in one term.");
        if(writing >= 1) tips.push("Writing courses need steady weekly time — balance with lighter classes.");
        if(credits >= 16) tips.push("Consider dropping 1 course or taking fewer credits.");
      } else if(label === "Light"){
        tips.push("If you want to graduate sooner, you could add a course or increase credits.");
        tips.push("Add 1 requirement/gen-ed course to stay on track.");
      } else {
        tips.push("Your plan looks balanced — keep a mix of course types.");
        tips.push("Avoid adding another Hard + Lab on top of this schedule.");
      }
      alert(`Suggestions (${label}):\n\n• ${tips.join("\n• ")}`);
    });
  }


  // =====================================================
  // SEARCH + FILTER EVENTS
  // =====================================================
  if(elSearch) elSearch.addEventListener("input", renderCourseList);

  if(creditFilterInput) creditFilterInput.addEventListener("input", renderCourseList);

  if(majorSearchInput){
    majorSearchInput.addEventListener("change", () => {
      const typed = (majorSearchInput.value || "").trim();
      if(!typed){
        selectedMajorName = "";
        setTrackUIEnabled(false);
        renderCourseList();
        return;
      }

      const found = demoMajors.find(m => normalize(m.name) === normalize(typed));
      if(!found){
        selectedMajorName = typed;
        const hasTracks = majorsWithTracks.has(typed);
        setTrackUIEnabled(hasTracks);
        if(hasTracks) populateTrackListForMajor(typed);
        renderCourseList();
        return;
      }

      selectedMajorName = found.name;

      // Auto-select the matching Subject when a Major is chosen
      setSubjectFromMajor(found);

      const hasTracks = majorsWithTracks.has(selectedMajorName);
      setTrackUIEnabled(hasTracks);
      if(hasTracks) populateTrackListForMajor(selectedMajorName);

      renderCourseList();
    });
  }

  if(subjectSearchInput){
    subjectSearchInput.addEventListener("change", () => {
      const typed = (subjectSearchInput.value || "").trim();
      if(!typed){
        selectedSubjectCode = "";
        renderCourseList();
        return;
      }

      const code = typed.split("|")[0].trim().split(/\s+/)[0].trim();
      selectedSubjectCode = code.toUpperCase();

      renderCourseList();
    });
  }

  if(trackSearchInput){
    trackSearchInput.addEventListener("change", () => {
      selectedTrackName = (trackSearchInput.value || "").trim();
      renderCourseList();
    });
  }


  // =====================================================
  // THEME (same behavior as before)
  // =====================================================
  function setTheme(mode){
    const root = document.documentElement;
    if(mode === "dark"){
      root.setAttribute("data-theme","dark");
      if(themeSwitch) themeSwitch.setAttribute("aria-checked","true");
    } else {
      root.removeAttribute("data-theme");
      if(themeSwitch) themeSwitch.setAttribute("aria-checked","false");
    }
    localStorage.setItem("smartschedule_theme", mode);
  }

  function toggleTheme(){
    const isDark = document.documentElement.getAttribute("data-theme") === "dark";
    setTheme(isDark ? "light" : "dark");
  }

  if(themeSwitch){
    themeSwitch.addEventListener("click", toggleTheme);
    themeSwitch.addEventListener("keydown", (e) => {
      if(e.key === "Enter" || e.key === " "){ e.preventDefault(); toggleTheme(); }
    });
  }


  // =====================================================
  // ✅ EXPORT DATABASE FOR journey.html
  // =====================================================
  // Journey can now do:
  // const { allCourses, demoMajors } = window.SS_DB;
  
  // =====================================================
  // =====================================================
  // ROADMAP GENERATION (CLEAN + EVEN)
  // =====================================================
  // Goal:
  // - 8 terms (Freshman–Senior Fall/Spring)
  // - 5 courses per term
  // - 15–16 credits max per term (never over 16)
  // - No auto-numbering (NO "ELECTIVE 9xx" codes)
  // - First Year Seminar only in Freshman Fall
  // - Intermediate Seminar only in Sophomore Fall

  // Ensure a stable 3-credit elective placeholder exists in the catalog.
  (function ensureElectiveCourse(){
    if(!allCourses.some(c => c.code === "ELECTIVE")){
      allCourses.push({
        code: "ELECTIVE",
        title: "Elective (choose any approved course)",
        credits: 3,
        difficulty: "Easy",
        type: ["GENED"],
        prereqs: []
      });
    }
  })();

  function isElectivePlaceholder(code){
    return String(code || "").trim().toUpperCase() === "ELECTIVE";
  }

  function courseCredits(code){
    const c = allCourses.find(x => x.code === code);
    return c ? (Number(c.credits) || 0) : 0;
  }

  // Split a flat roadmap into exactly 8 terms of exactly 5 courses each.
  function splitIntoTerms(flatCodes){
    const terms = [];
    const flat = Array.isArray(flatCodes) ? flatCodes.slice() : [];
    for(let i=0; i<8; i++){
      terms.push(flat.slice(i*5, i*5 + 5));
    }
    // Always return 8 arrays
    while(terms.length < 8) terms.push([]);
    return terms;
  }

  function flattenTerms(terms){
    return (Array.isArray(terms) ? terms : []).flat();
  }

  function findFirstYearSeminarCode(){
    // Prefer SEMINR 126G if present, else SEMINR 120G
    if(allCourses.some(c=>c.code==="SEMINR 126G")) return "SEMINR 126G";
    if(allCourses.some(c=>c.code==="SEMINR 120G")) return "SEMINR 120G";
    // Fallback: keep a named placeholder but still 3 credits
    if(!allCourses.some(c=>c.code==="SEMINR 126G")){
      allCourses.push({code:"SEMINR 126G", title:"First Year Seminar", credits:4, difficulty:"Easy", type:["SEMINR"], prereqs:[]});
    }
    return "SEMINR 126G";
  }

  function findIntermediateSeminarCode(){
    // Use one of the common Intermediate Seminar listings if present
    if(allCourses.some(c=>c.code==="AMST 240G")) return "AMST 240G";
    if(allCourses.some(c=>c.code==="ECON 212G")) return "ECON 212G";
    if(allCourses.some(c=>c.code==="ENGL 262G")) return "ENGL 262G";
    // Fallback placeholder
    if(!allCourses.some(c=>c.code==="INTERMD 200G")){
      allCourses.push({code:"INTERMD 200G", title:"Intermediate Seminar", credits:3, difficulty:"Easy", type:["SEMINR"], prereqs:[]});
    }
    return "INTERMD 200G";
  }

  function buildEvenElectiveRoadmapFlat(){
    const terms = Array.from({length: 8}, () => Array.from({length: 5}, () => "ELECTIVE"));

    // Freshman Fall: First Year Seminar only here
    terms[0][0] = findFirstYearSeminarCode();

    // Sophomore Fall: Intermediate Seminar only here
    terms[2][0] = findIntermediateSeminarCode();

    // Safety: cap each term at 16 credits (should be 15 with 3-credit electives)
    for(let t=0; t<8; t++){
      let guard = 0;
      while(guard++ < 10){
        const cr = terms[t].reduce((s,code)=>s+courseCredits(code),0);
        if(cr <= 16) break;
        // If somehow >16 (e.g., seminar is 4 credits), swap another course to ELECTIVE (3).
        const idx = terms[t].findIndex(code => code !== "ELECTIVE" && code !== terms[0][0] && code !== terms[2][0]);
        if(idx >= 0) terms[t][idx] = "ELECTIVE";
        else break;
      }
    }

    return flattenTerms(terms);
  }

  // Degree type is still derived from the major name, used elsewhere in the UI.
  function degreeTypeForMajor(major){
    return getDegreeTypeFromMajorName(major.name);
  }

  // CLEAN default roadmap: ALWAYS even electives + fixed seminars.
  function buildDefaultRoadmapForMajor(major){
    return buildEvenElectiveRoadmapFlat();
  }

  // Back-compat: If other parts of the file call this, keep it as a no-op that
  // simply guarantees an even roadmap.
  function topUpDist2InExistingRoadmap(major){
    if(!major) return major;
    major.required = buildEvenElectiveRoadmapFlat();
    return major;
  }


// =====================================================
// CLEAN SUBJECT DROPDOWN (No datalist) — DARK MODE READY
// =====================================================
function setupSubjectDropdown() {
  const input =
    document.getElementById("subjectSearchInput") ||
    document.getElementById("subjectSearch");

  if (!input) return;

  input.removeAttribute("list"); // remove datalist behavior
  input.setAttribute("autocomplete", "off");

  // Create dropdown container
  const dropdown = document.createElement("div");
  dropdown.style.position = "absolute";

  // ✅ Theme-adaptive colors (works with [data-theme="dark"] variables)
  dropdown.style.background = "var(--panel)";
  dropdown.style.color = "var(--text)";
  dropdown.style.border = "1px solid var(--line)";

  dropdown.style.borderRadius = "8px";
  dropdown.style.boxShadow = "0 10px 25px rgba(0,0,0,0.08)";
  dropdown.style.maxHeight = "250px";
  dropdown.style.overflowY = "auto";
  dropdown.style.width = input.offsetWidth + "px";
  dropdown.style.zIndex = "999";
  dropdown.style.display = "none";

  input.parentNode.style.position = "relative";
  input.parentNode.appendChild(dropdown);

  const subjects = subjectCatalog
    .trim()
    .split("\n")
    .map(line => line.trim());

  function renderList(filter = "") {
    dropdown.innerHTML = "";

    const filtered = subjects.filter(s =>
      s.toLowerCase().includes(filter.toLowerCase())
    );

    filtered.forEach(subject => {
      const item = document.createElement("div");
      item.textContent = subject;
      item.style.padding = "10px 14px";
      item.style.cursor = "pointer";
      item.style.fontSize = "14px";
      item.style.color = "var(--text)";
      item.style.background = "transparent";

      // ✅ Theme-adaptive hover
      item.addEventListener("mouseenter", () => {
        item.style.background = "var(--line)";
      });

      item.addEventListener("mouseleave", () => {
        item.style.background = "transparent";
      });

      item.addEventListener("click", () => {
        input.value = subject;
        dropdown.style.display = "none";
        input.dispatchEvent(new Event("change"));
      });

      dropdown.appendChild(item);
    });

    dropdown.style.display = filtered.length ? "block" : "none";
  }

  // Keep width correct if window resizes
  window.addEventListener("resize", () => {
    dropdown.style.width = input.offsetWidth + "px";
  });

  input.addEventListener("focus", () => renderList());
  input.addEventListener("input", e => renderList(e.target.value));

  document.addEventListener("click", e => {
    if (!input.contains(e.target) && !dropdown.contains(e.target)) {
      dropdown.style.display = "none";
    }
  });
}

// IMPORTANT: Call inside your existing DOMContentLoaded
document.addEventListener("DOMContentLoaded", setupSubjectDropdown);
  

// =====================================================
  // INIT
  // =====================================================
  (function init(){
    // NOTE: app.js is shared across multiple pages (home/dashboard/journey).
    // Only run page-specific wiring when the required DOM nodes exist.
    try{
      // Populate shared datalists if present (Dashboard + Journey)
      if (majorSearchInput || majorList) {
        populateMajorList();
        setupMajorDropdown();
      }
      if (document.getElementById("subjectSearchInput")) {
        populateSubjectList();
        setupSubjectDropdown();
        setupSubjectClearButton();
      }

      // Track UI exists only on some pages
      if (typeof setTrackUIEnabled === "function") {
        const hasTrack = !!document.getElementById("trackSearchInput");
        setTrackUIEnabled(hasTrack);
      }

      // Dashboard-only rendering requires these containers
      const hasDashboard =
        document.getElementById("courseList") &&
        document.getElementById("planList");

      if (hasDashboard) {
        renderCourseList();
        renderPlan();
        if (typeof updateCreditDonut === "function") updateCreditDonut();
      }
    }catch(err){
  // Fail-safe: never allow a missing element on one page to break the whole app
  console.warn("app.js init skipped/partial:", err);
}
})();


// =====================================================
// GLOBAL DB EXPORT (used by journey.html)
// =====================================================

window.SS_DB = window.SS_DB || {};

window.SS_DB.allCourses = allCourses;
window.SS_DB.subjectCatalog = subjectCatalog;
window.SS_DB.getDist2AreasForCourse = getDist2AreasForCourse;

})();
