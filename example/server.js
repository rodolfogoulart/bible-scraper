"use strict";

const BibleScraper = require("../lib");
const express = require('express');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');
const app = express();

// Middleware para processar JSON
app.use(express.json());

// Configuração do Swagger
const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Bible Scraper API',
            version: '1.0.0',
            description: 'API for YouVersion.',
        },
    },
    apis: ['./example/server.js'], // path of endpoints
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

/**
 * @swagger
 * /getChapter:
 *   get:
 *     summary: Return the chapter in JSON format.
 *     parameters:
 *       - in: query
 *         name: translation
 *         required: true
 *         schema:
 *           type: string
 *         description: "Bible translation code. Example: https://www.bible.com/bible/1715/MAT.2.BDO1573. [BDO1573] is the code, or you can pass the ID (1715)."
 *       - in: query
 *         name: book
 *         required: true
 *         schema:
 *           type: string
 *         description: Bible book code. Call `getBooks` to retrieve the book code.
 *       - in: query
 *         name: chapter
 *         required: true
 *         schema:
 *           type: string
 *         description: Bible chapter.
 *       - in: query
 *         name: addNote
 *         required: false
 *         schema:
 *           type: bool
 *         description: If add the notes to the verse.
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 result:
 *                   type: object
 *                   properties:
 *                     verses:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           content:
 *                             type: array
 *                             items:
 *                               type: object
 *                               properties:
 *                                 text:
 *                                   type: string
 *                                 type:
 *                                   type: string
 *                                 note:
 *                                   type: string
 *                           reference:
 *                             type: string
 *                     version:
 *                       type: string
 *                     reference:
 *                       type: string
 *                     audioBibleUrl:
 *                       type: string
 *                     copyright:
 *                       type: string
 *                     audioBibleCopyright:
 *                       type: string
 */

// Endpoint 'getChapter'
app.get('/getChapter', async (req, res) => {
    try {
        
        const { translation, book, chapter, addNotes } = req.query;
        
        if (!translation || !book || !chapter) {
            return res.status(400).json({ error: 'args [translation], [book], [chapter] can be null or empty!' });
        }
        let id;
        if(BibleScraper.TRANSLATIONS[translation] == null){
            id = translation;
        }else{
            id = BibleScraper.TRANSLATIONS[translation];
        }

        console.log(`GET getChapter {translation:${translation}, book:${book}, chapter:${chapter}, addNotes:${addNotes}}`);

        
        const version = new BibleScraper(id);
        const value = await version.chapterFormated(`${book}.${chapter}`, addNotes.toLowerCase() === "true");
        
        res.status(200).json({ result: value });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error to process request.' });
    }
});

/**
 * @swagger
 * /getTranslations:
 *   get:
 *     summary: Return the available translations.
 *     responses:
 *       200:
 *         description: Sucess
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 translations:
 *                   type: object
 */
// Endpoint 'getTranslations'
app.get('/getTranslations', (req, res) => {
    try {
        const translations = BibleScraper.TRANSLATIONS; // Retorna as traduções disponíveis
        res.status(200).json({ translations });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Ocorreu um erro ao processar sua solicitação.' });
    }
});

/**
 * @swagger
 * /getBooks:
 *   get:
 *     summary: Return the available books..
 *     responses:
 *       200:
 *         description: Sucess
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 books:
 *                   type: object
 */

// Endpoint 'getBooks'
app.get('/getBooks', (req, res) => {
    try {
        const books = BibleScraper.BOOKSWITHCODES; // Retorna os livros disponíveis
        res.status(200).json({ books });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Ocorreu um erro ao processar sua solicitação.' });
    }
});


/**
 * @swagger
 * /getChapter:
 *   get:
 *     summary: Return a specific chapter..
 *     parameters:
 *       - in: query
 *         name: translation
 *         required: true
 *         schema:
 *           type: string
 *         description: Bible translation (Version).
 *       - in: query
 *         name: book
 *         required: true
 *         schema:
 *           type: string
 *         description: Book of the Bible.
 *       - in: query
 *         name: chapter
 *         required: true
 *         schema:
 *           type: string
 *         description: Chapter of the book.
 *     responses:
 *       200:
 *         description: Sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 result:
 *                   type: object
 */

// Porta do servidor
const port = 3000;

app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});