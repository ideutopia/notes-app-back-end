const { nanoid } = require('nanoid');
const books = require('./book');

// Add books function handler

const addBookHandler = (request, h) => {
  // Get data from payload
  const {
    name, year, author, summary, publiser, pageCount, readPage, reading,
  } = request.payload;
  // generate book id from nanoid package
  const bookId = nanoid(16);
  // get data insert from datetime now
  const insertedAt = new Date().toISOString();
  const updatedAt = insertedAt;
  const finished = false;
  const newBook = {
    name,
    year,
    author,
    summary,
    publiser,
    pageCount,
    readPage,
    reading,
    finished,
    insertedAt,
    updatedAt,
    bookId,
  };
  // check whether read page is not bigger than total page
  if (readPage > pageCount) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
    });
    response.code(400);
    return response;
  }

  // check whether bookname is undefined
  if (name === undefined) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. Mohon isi nama buku',
    });
    response.code(400);
    return response;
  }
  if (readPage === pageCount) {
    newBook.finished = true;
  }
  books.push(newBook);
  const isSuccess = books.filter((x) => x.bookId === bookId).length > 0;
  if (isSuccess) {
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil ditambahkan',
      data: {
        bookId,
      },
    });
    response.code(201);
    return response;
  }
  const response = h.response({
    status: 'fail',
    message: 'Buku gagal ditambahkan',
  });
  response.code(500);
  return response;
};

const getAllBooksHandler = (request, h) => {
  const nameQuery = request.query.name;
  const readingQuery = request.query.reading;
  const finishedQuery = request.query.finished;
  console.log(request.query);
  if (nameQuery !== undefined) {
    console.log(nameQuery);
    // return book with name
    const bookFiltered = books.filter((x) => x.name === nameQuery);
    return {
      status: 'success',
      data: {
        bookFiltered,
      },
    };
  }
  if (readingQuery !== undefined) {
    if (readingQuery === 1) {
      console.log('reading true');
      const bookReaded = books.filter((x) => x.reading === true);
      return {
        status: 'success',
        data: {
          bookReaded,
        },
      };
    }
    console.log('reading false');
    const bookOnGoing = books.filter((x) => x.reading === false);
    return {
      status: 'success',
      data: {
        bookOnGoing,
      },
    };
  }

  if (finishedQuery !== undefined) {
    if (finishedQuery === 1) {
      console.log('finished true');
      const bookFinished = books.filter((x) => x.finished === true);
      return {
        status: 'success',
        data: {
          bookFinished,
        },
      };
    }
    console.log('finished false');
    const bookFinishing = books.filter((x) => x.finished === false);
    console.log(bookFinishing);
    return {
      status: 'success',
      data: {
        bookFinishing,
      },
    };
  }
};
// Function to get by id
const getBookByIdHandler = (request, h) => {
  const { bookId } = request.params;
  const bookDetail = books.filter((x) => x.bookId === bookId)[0];

  if (bookDetail !== undefined) {
    return {
      status: 'success',
      data: {
        books,
      },
    };
  }
  const response = h.response({
    status: 'fail',
    message: 'Buku tidak ditemukan',
  });
  response.code(404);
  return response;
};

// Function to update

// Function to delete
const deleteBookByIdHandler = (request, h) => {
  const { id } = request.params;
  const index = books.findIndex((x) => x.id === id);

  if (index !== -1) {
    books.splice(index, 1);
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil dihapus',
    });
    response.code(200);
    return response;
  }
  const response = h.response({
    status: 'fail',
    message: 'Buku gagal dihapus. ID tidak ditemukan',
  });
  response.code(404);
  return response;
};

module.exports = {
  addBookHandler, getAllBooksHandler, getBookByIdHandler, deleteBookByIdHandler,
};
