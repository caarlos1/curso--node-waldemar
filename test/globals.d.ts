declare namespace NodeJS {
    interface Global {
        // Para conseguir sobrescrever tipos globais é necessário importar por inline.
        testRequest: import('supertest').SuperTest <import('supertest').Test>
    }
}