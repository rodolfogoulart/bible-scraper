"use strict";

const scrapeIt = require("scrape-it")

// Bible version ID's were found on https://www.bible.com/versions.
const ENGLISH_BIBLE_VERSION_IDS = {
    AMP: 1588,
    AMPC: 8,
    ASV: 12,
    BOOKS: 31,
    BSB: 3034,
    CEB: 37,
    CEV: 392,
    CEVDCI: 303,
    CEVUK: 294,
    CJB: 1275,
    CPDV: 42,
    CSB: 1713,
    DARBY: 478,
    DRC1752: 55,
    EASY: 2079,
    ERV: 406,
    ESV: 59,
    FBV: 1932,
    FNVNT: 3633,
    GNBDC: 416,
    GNBDK: 431,
    GNBUK: 296,
    GNT: 68,
    GNTD: 69,
    GNV: 2163,
    GW: 70,
    GWC: 1047,
    HCSB: 72,
    ICB: 1359,
    JUB: 1077,
    KJV: 1,
    KJVAAE: 546,
    KJVAE: 547,
    LEB: 90,
    LSB: 3345,
    MEV: 1171,
    MP1650: 1365,
    MP1781: 3051,
    MSG: 97,
    NABRE: 463,
    NASB1995: 100,
    NASB2020: 2692,
    NCV: 105,
    NET: 107,
    NIRV: 110,
    NIV: 111,
    NIVUK: 113,
    NKJV: 114,
    NLT: 116,
    NMV: 2135,
    NRSV: 2015,
    NRSVUE: 3523,
    PEV: 2530,
    RAD: 2753,
    RSV: 2017,
    RSVCI: 3548,
    RV1885: 477,
    RV1895: 1922,
    TCENT: 3427,
    TEG: 3010,
    TLV: 314,
    TOJB2011: 130,
    TPT: 1849,
    TS2009: 316,
    WBMS: 2407,
    WEBBE: 1204,
    WEBUS: 206,
    WMB: 1209,
    WMBBE: 1207,
    YLT98: 821
}

//Portuguese
const PORTUGUESE_BIBLE_VERSIONS_IDS = {
    A21: 2645,
    ARA: 1608,
    ARC: 212,
    BLT: 324,
    MZNVI: 4094,
    NAA: 1840,
    NBV_P: 1966,
    NTLH: 211,
    NVI: 129,
    NVT: 1930,
    TC60DO: 3658,
    TB: 277,
    VFL: 200,
}

const TRANSLATIONS = Object.assign(ENGLISH_BIBLE_VERSION_IDS, {
    VULG: 823,
    ICL00D: 1196,
    NR06: 122,
}, PORTUGUESE_BIBLE_VERSIONS_IDS)

module.exports.TRANSLATIONS = TRANSLATIONS;

// Bible book names each have a short code called a USFM code.
// These can be found here: https://ubsicap.github.io/usfm/identification/books.html
const booksAndUsfmShortcodes = {
    'Genesis': 'GEN',
    'Exodus': 'EXO',
    'Leviticus': 'LEV',
    'Numbers': 'NUM',
    'Deuteronomy': 'DEU',
    'Joshua': 'JOS',
    'Judges': 'JDG',
    'Ruth': 'RUT',
    '1 Samuel': '1SA',
    '2 Samuel': '2SA',
    '1 Kings': '1KI',
    '2 Kings': '2KI',
    '1 Chronicles': '1CH',
    '2 Chronicles': '2CH',
    'Ezra': 'EZR',
    'Nehemiah': 'NEH',
    'Esther': 'EST',
    'Job': 'JOB',
    'Psalms': 'PSA',
    'Psalm': 'PSA',
    'Proverbs': 'PRO',
    'Ecclesiastes': 'ECC',
    'Song of Solomon': 'SNG',
    'Isaiah': 'ISA',
    'Jeremiah': 'JER',
    'Lamentations': 'LAM',
    'Ezekiel': 'EZK',
    'Daniel': 'DAN',
    'Hosea': 'HOS',
    'Joel': 'JOL',
    'Amos': 'AMO',
    'Obadiah': 'OBA',
    'Jonah': 'JON',
    'Micah': 'MIC',
    'Nahum': 'NAM',
    'Habakkuk': 'HAB',
    'Zephaniah': 'ZEP',
    'Haggai': 'HAG',
    'Zechariah': 'ZEC',
    'Malachi': 'MAL',
    'Matthew': 'MAT',
    'Mark': 'MRK',
    'Luke': 'LUK',
    'John': 'JHN',
    'Acts': 'ACT',
    'Romans': 'ROM',
    '1 Corinthians': '1CO',
    '2 Corinthians': '2CO',
    'Galatians': 'GAL',
    'Ephesians': 'EPH',
    'Philippians': 'PHP',
    'Colossians': 'COL',
    '1 Thessalonians': '1TH',
    '2 Thessalonians': '2TH',
    '1 Timothy': '1TI',
    '2 Timothy': '2TI',
    'Titus': 'TIT',
    'Philemon': 'PHM',
    'Hebrews': 'HEB',
    'James': 'JAS',
    '1 Peter': '1PE',
    '2 Peter': '2PE',
    '1 John': '1JN',
    '2 John': '2JN',
    '3 John': '3JN',
    'Jude': 'JUD',
    'Revelation': 'REV'
}

/**
 * BibleScraper
 *
 * Retrieves verses from bible.com, provided by YouVersion. Initializes the `BibleScraper` instance.
 *
 * @class
 * @name BibleScraper
 *
 * @param {Number} translationId - The translation id from bible.com.
 *
 * @example
 * const NLTBibleScraper = new BibleScraper(BibleScraper.TRANSLATIONS.NLT);
 * const reference = NLTBibleScraper.getBibleReference({
 *   book: BibleScraper.BOOKS.GENESIS,
 *   chapter: 1,
 *   verseNumStart: 1,
 *   verseNumEnd: 3
 * });
 * console.log(reference);
 * // Output: "GEN.1.1-3.116"
 *
 * const verseData = await NLTBibleScraper.verse(reference);
 * console.log(verseData);
 * // Output: { content: "In the beginning God created the heavens and the earth.", reference: "Genesis 1:1" }
 *
 * const chapterData = await NLTBibleScraper.chapter('GEN.1');
 * console.log(chapterData);
 * // Output: { verses: [ { content: "In the beginning God created the heavens and the earth.", reference: "Genesis 1:1" }, ... ] }
 */
module.exports = class BibleScraper {
    /**
     * Constructor for the class.
     *
     * @param {type} translationId - the ID of the Bible translation.
     *
     * @throws {Error} - if translationId is not provided.
     */
    constructor(translationId) {
        if (!translationId) {
            throw new Error('Bible translation ID is required and is available via `BibleScraper.TRANSLATIONS`.')
        }

        this.translation_id = translationId
    }

    /**
     * url
     * Returns the Bible url reference from bible.com.
     *
     * @param {String} reference The Bible reference to get the url for.
     * @returns {String} The reference url.
     */
    url(reference) {
        // TODO Validation
        return `https://www.bible.com/bible/${this.translation_id}/${reference}`
    }

    /**
     * Generates a bible reference based on the provided book, chapter, and verse range.
     *
     * @param {Object} params - The parameters object.
     * @param {string} params.book - The name of the book.
     * @param {number} params.chapter - The chapter number.
     * @param {number} [params.verseNumStart] - The starting verse number (optional).
     * @param {number} [params.verseNumEnd] - The ending verse number (optional).
     *
     * @return {string} The generated bible reference.
     */
    getBibleReference({ book, chapter, verseNumStart, verseNumEnd }) {
        if (!BibleScraper.BOOKS.includes(book)) {
            console.warn('Please provide a valid book name using the `BibleScraper.BOOKS` array.')
        }

        if (!chapter) {
            console.warn('Please provide a chapter number.')
        }

        let bibleReference = `${booksAndUsfmShortcodes[book]}.${chapter}`;

        if (verseNumStart && verseNumEnd) {
            bibleReference = `${bibleReference}.${verseNumStart}-${verseNumEnd}.${this.translation_id}`;
        } else if (verseNumStart && !verseNumEnd) {
            bibleReference = `${bibleReference}.${verseNumStart}.${this.translation_id}`;
        }

        return bibleReference
    }

    /**
     * verse
     * Fetches the verse.
     *
     * @param {String} ref The Bible.com verse reference.
     * @returns {Promise} A promise resolving the verse object.
     */
    async verse(ref) {
        const verse = {
            content: '',
            reference: '',
            version: '',
        }

        // This is a more robust way to get the verse. The old way
        // was fragile. If a className changed, then it'd break this
        // entire package. Bible.com is built using NextJS and on this
        // page the __NEXT_DATA__ provides us with all the verse data
        // we need. In the event that this method fails, there is a fallback
        // to the old way.
        const { data: nextJSDataString } = await scrapeIt(this.url(ref), {
            json: {
                selector: "script#__NEXT_DATA__",
                eq: 0
            },
        })

        if (nextJSDataString) {
            const nextJSData = JSON.parse(nextJSDataString.json || '{}')
            const content = nextJSData.props.pageProps.verses[0].content
            const reference = nextJSData.props.pageProps.verses[0].reference.human
            const version = nextJSData.props.pageProps.version.local_abbreviation

            verse.version = version
            verse.content = content
            verse.reference = reference + ' ' + version

            if (verse.content && verse.reference) {

                return verse
            }
        }

        // fallback to old way
        const { data } = await scrapeIt(this.url(ref), {
            content: {
                selector: "p.text-19",
                eq: 0
            },
            reference: {
                selector: "h2.mbe-2",
                eq: 0
            }
        })

        return data
    }

    /**
     * chapter
     * Fetches the chapter verses.
     *
     * @param {String} ref The Bible.com chapter reference.
     * @returns {Promise} A promise resolving the chapter object.
     */
    async chapter(ref) {
        const chapter = {
            verses: [{
                content: '',
                reference: '',
            }],
            version: '',
            reference: '',
            audioBibleUrl: '',
            copyright: '',
            audioBibleCopyright: '',
        }

        const { data } = await scrapeIt(this.url(ref), {
            verses: {
                listItem: 'span[data-usfm][class*="ChapterContent_verse_"]',
                data: {
                    content: {
                        selector: 'span[class*="ChapterContent_content_"]',
                        how: "text"
                    },
                    reference: {
                        attr: "data-usfm"
                    }
                }
            },
            nextJSDataString: {
                selector: "script#__NEXT_DATA__",
                eq: 0
            },
        })

        let bibleReferenceWithoutVersion = '';
        if (data.nextJSDataString) {
            const nextJSData = JSON.parse(data.nextJSDataString || '{}')

            bibleReferenceWithoutVersion = nextJSData.props.pageProps.chapterInfo.reference.human
            let audioBibleUrl
            try {
                audioBibleUrl = nextJSData.props.pageProps.chapterInfo.audioChapterInfo[0].download_urls.format_mp3_32k;
            } catch (error) {
                audioBibleUrl = null
            }

            chapter.version = nextJSData.props.pageProps.versionData.local_abbreviation
            chapter.reference = bibleReferenceWithoutVersion + ' ' + chapter.version
            try {
                chapter.audioBibleUrl = audioBibleUrl.replace('//', 'https://');
            } catch (error) {
                chapter.audioBibleUrl = null
            }
            chapter.copyright = nextJSData.props.pageProps.chapterInfo.copyright.text
            try {
                chapter.audioBibleCopyright = nextJSData.props.pageProps.audioVersionInfo.copyright_short.text;
            } catch (error) {
                chapter.audioBibleCopyright = null
            }
        }

        chapter.verses = (data.verses || []).reduce((acc, c) => {
            const latest = acc[acc.length - 1]

            if (latest && latest.reference === c.reference) {
                latest.content = (latest.content + " " + c.content).trim()
            } else {
                acc.push(c)
            }

            return acc
        }, [])

        // Adding a readable verse reference to each verse.
        chapter.verses.forEach((verse) => {
            const verseNum = verse.reference.split('.')[2]
            verse.reference = `${bibleReferenceWithoutVersion}:${verseNum}`
        })

        return chapter
    }

    /**
     * chapter
     * Fetches the chapter verses WITH titles.
     *
     * @param {String} ref The Bible.com chapter reference.
     * @returns {Promise} A promise resolving the chapter object.
     */
    async chapterWithTitle(ref) {
        const chapter = {
            verses: [{
                content: [
                    {
                        text: '',
                        //type can be 'v' to verse or 't' to title
                        type: '',
                        //for notes
                        note: '',
                    }
                ],
                reference: '',
            }],
            version: '',
            reference: '',
            audioBibleUrl: '',
            copyright: '',
            audioBibleCopyright: '',
        }

        const { data } = await scrapeIt(this.url(ref), {
            // Select verse elements using the ChapterContent_verse_ class
            verses: {
                listItem: 'span[class*="ChapterContent_"]',
                data: {
                    classes: {
                        attr: "class"
                    },
                    reference: {
                        attr: "data-usfm"
                    },
                    content: {
                        trim: false,
                        how: "text",
                    },
                    verse: {
                        selector: 'span[class*="ChapterContent_content_"]',
                        trim: false,
                        how: "text"
                    },
                    // title: {
                    //     content: {
                    //         selector: 'span[class*="ChapterContent_heading_"]',
                    //         how: "text",
                    //         eq: 0
                    //     }                        
                    // },
                },
            },
            // Extract Next.js data for additional verse information
            nextJSDataString: {
                selector: "script#__NEXT_DATA__",
                eq: 0
            },
            // Also look for headings that might be present in the chapter
            allHeadings: {
                listItem: 'span[class*="ChapterContent_heading_"]',
                data: {
                    content: {
                        how: "text"
                    }
                }
            }
        })

        let bibleReferenceWithoutVersion = '';
        if (data.nextJSDataString) {
            const nextJSData = JSON.parse(data.nextJSDataString || '{}')

            bibleReferenceWithoutVersion = nextJSData.props.pageProps.chapterInfo.reference.human
            let audioBibleUrl
            try {
                audioBibleUrl = nextJSData.props.pageProps.chapterInfo.audioChapterInfo[0].download_urls.format_mp3_32k;
            } catch (error) {
                audioBibleUrl = null
            }

            chapter.version = nextJSData.props.pageProps.versionData.local_abbreviation
            chapter.reference = bibleReferenceWithoutVersion + ' ' + chapter.version
            try {
                chapter.audioBibleUrl = audioBibleUrl.replace('//', 'https://');
            } catch (error) {
                chapter.audioBibleUrl = null
            }
            chapter.copyright = nextJSData.props.pageProps.chapterInfo.copyright.text
            try {
                chapter.audioBibleCopyright = nextJSData.props.pageProps.audioVersionInfo.copyright_short.text;
            } catch (error) {
                chapter.audioBibleCopyright = null
            }
        }

        //
        verses: [{
            content: [
                {
                    text: '',
                    //type can be 'v' to verse or 't' to title
                    type: '',
                    //for notes
                    note: '',
                }
            ],
            reference: '',
        }];
        chapter.verses = [];
        var ref = '';
        var content = [];
        var isNote = false;
        var isHeading = false;
        //to get the titles that are from the next verse, this happens because the title is in sequence and ref is not filled
        var contentTitles = [];
        var isNewVerse = false;
        var currentRef = '';
        var isSpecialFormat = false;
        var scLevel = 0;
        var noteStack = '';

        for (let i = 0; i < data.verses.length; i++) {
            if (data.verses[i].classes.includes('ChapterContent_label_')) {
                if (isNote) {
                    //label # end the notes
                    if (data.verses[i].content == "#") {
                        isNote = false;
                    }
                }
            }
            if (data.verses[i].classes.includes('ChapterContent_note_')) {
                isNote = true;
                if (content.length == 0) {
                    noteStack = noteStack + data.verses[i].content;
                }
                if (!isHeading && content.length > 0) {
                    content.at(-1).note = content.at(-1).note + ' ' + data.verses[i].content;
                }
            }
            if (data.verses[i].classes.includes('ChapterContent_verse_')) {
                // if(ref == ''){
                //     ref = data.verses[i].reference;
                // }
                isSpecialFormat = false;
                if (ref != data.verses[i].reference) {
                    if (ref != '') {
                        isNewVerse = true;
                        currentRef = ref;
                    }
                    if (data.verses[i].reference != '') {
                        ref = data.verses[i].reference;
                    }
                }
            }
            //if sc the verse is broke because they format the word separeted
            //ChapterContent_sc_ special format break line after 1 word upper
            //ChapterContent_bd_ special format break line after 1 word bold
            if (data.verses[i].classes.includes('ChapterContent_sc_') || data.verses[i].classes.includes('ChapterContent_bd_')) {
                isSpecialFormat = true;
                scLevel = 0;
            }
            //ref == '' when the content of the verse is not yeat included, this happing on the beggining of the array, when has some title
            //ref will be filled right after, and will not be set to '' again
            //check PSAL 4 on NVT
            if (data.verses[i].classes.includes('ChapterContent_heading_') || ref == '' && data.verses[i].content != '') {
                // console.log('title: ' + data.verses[i].content)
                if (isNote && isHeading) {
                    content.at(-1).note = content.at(-1).note + ' ' + data.verses[i].content;
                } else {
                    if (data.verses[i].content != '') {
                        content.push({
                            text: data.verses[i].content,
                            type: 't',
                            note: noteStack,
                        });
                        noteStack = '';
                    }

                }
                isHeading = true;
                //
            } else {

                if (data.verses[i].classes.includes('ChapterContent_content_')) {
                    isNote = false;
                    isHeading = false;
                    //
                    var verseText = data.verses[i].content;
                    if (verseText == '') {
                        continue;
                    }
                    // if(ref != ''){
                    if (isNewVerse && content.length > 0) {
                        // if (ref != data.verses[i].reference){
                        //
                        if (content.at(-1).type == 't') {
                            for (let index = content.length; index > 0; index--) {
                                if (content[index - 1].type == 'v') {
                                    break;
                                } else {
                                    contentTitles.push(content.pop());
                                }
                            }
                        }

                        //
                        chapter.verses.push({
                            content: content,
                            reference: currentRef
                        },);
                        isNewVerse = false;
                        console.log(ref);
                        console.log(content.map(c => c.type == 'v' ? 'v: ' + c.text : 't:' + c.text).join('\n'));
                        //
                        content = [];
                        if (contentTitles.length > 0) {
                            content = content.concat(contentTitles);
                            contentTitles = [];
                        }
                        // isSpecialFormat = false;
                        noteStack = '';
                        //
                        isNote = false;
                    }
                    if (data.verses[i].reference != '') {
                        ref = data.verses[i].reference;
                    }
                    if (!isSpecialFormat) {
                        content.push({
                            text: verseText,
                            type: 'v',
                            note: noteStack,
                        });
                        noteStack = '';
                    }
                    else {
                        //when tag ChapterContent_sc_ the content is break in new line to add style, but here is not necessary to break the line
                        if (content.length > 0) {
                            if (content.at(-1).type == 'v') {
                                //for some reason the scrap-it trim all the strings, so the scLevel is a way to control the space
                                //see the word 'Senhor' in portuguese, youversion present 'SENHOR' but breaks into S enhor and do a css style after
                                content.at(-1).text = content.at(-1).text + (scLevel == 0 ? '' : ' ') + verseText;
                                // isSC = false;                            
                                scLevel++;
                                if (scLevel > 1) {
                                    isSpecialFormat = false;
                                }
                            } else {
                                content.push({
                                    text: verseText,
                                    type: 'v',
                                    note: noteStack,
                                });

                            }
                        } else {
                            content.push({
                                text: verseText,
                                type: 'v',
                                note: noteStack,
                            });
                            noteStack = '';
                        }
                    }
                } else {
                    //notes, labels etc.
                }
            }

        }
        //to add the last verse        
        if (content.length > 0) {
            chapter.verses.push({
                content: content,
                reference: ref
            },);
            console.log(ref);
            console.log(content.map(c => c.type == 'v' ? 'v: ' + c.text : 't:' + c.text).join('\n'));
            content = [];
        }

        // Adding a readable verse reference to each verse.
        chapter.verses.forEach((verse) => {
            const verseNum = verse.reference.split('.')[2]
            verse.reference = `${bibleReferenceWithoutVersion}:${verseNum}`
        })

        return chapter
    }
}

/**
 * The available books from bible.com.
 *
 * @name BibleScraper.BOOKS
 * @type {BOOKS<booksAndUsfmShortcodes>}
 * @readonly
 *
 */
module.exports.BOOKS = Object.keys(booksAndUsfmShortcodes);

/**
 * 
 * @name BibleScraper.BOOKSWITHCODES
 * @type {BOOKS{booksAndUsfmShortcodes}}
 * @readonly
 * 
 * 
 */
module.exports.BOOKSWITHCODES = booksAndUsfmShortcodes;

/**
 * The translation ID's from bible.com.
 *
 * @name BibleScraper.TRANSLATIONS
 * @type {TRANSLATIONS}
 * @readonly
 *
 */
module.exports.TRANSLATIONS = TRANSLATIONS;


module.exports.BOOK_NAMES = Object.keys(booksAndUsfmShortcodes)
