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
    apis: ['./example/server.js'], // Caminho para o arquivo onde está a configuração dos endpoints
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

/**
 * @swagger
 * /getChapter:
 *   get:
 *     summary: Return the chapter in json format.
 *     parameters:
 *       - in: query
 *         name: translation
 *         required: true
 *         schema:
 *           type: string
 *         description: Tradução da Bíblia.
 *       - in: query
 *         name: book
 *         required: true
 *         schema:
 *           type: string
 *         description: Livro da Bíblia.
 *       - in: query
 *         name: chapter
 *         required: true
 *         schema:
 *           type: string
 *         description: Capítulo da Bíblia.
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

// Endpoint 'getChapter'
app.get('/getChapter', async (req, res) => {
    try {
        // Obtendo os valores enviados como parâmetros
        const { translation, book, chapter } = req.query;

        // Validando os valores recebidos
        if (!translation || !book || !chapter) {
            return res.status(400).json({ error: 'Por favor, forneça os parâmetros translation, book e chapter.' });
        }

        // Executando a função com os valores fornecidos
        const version = new BibleScraper(BibleScraper.TRANSLATIONS [translation]); // Adapte conforme sua implementação
        const value = await version.chapterWithTitle(`${book}.${chapter}`);

        // Retornando o resultado
        res.status(200).json({ result: value });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Ocorreu um erro ao processar sua solicitação.' });
    }
});

/**
 * @swagger
 * /getTranslations:
 *   get:
 *     summary: Return the available translations.
 *     responses:
 *       200:
 *         description: Sucesso
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