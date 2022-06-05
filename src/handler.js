const { nanoid } = require('nanoid');
const bookData = require('./book');

// Add books function handler

const addBookHandler = (request, h) => {
  // Get data from payload
  const {
    name, year, author, summary, publisher, pageCount, readPage, reading,
  } = request.payload;
  // generate book id from nanoid package
  const id = nanoid(16);
  // get data insert from datetime now
  const insertedAt = new Date().toISOString();
  const updatedAt = insertedAt;
  const finished = false;
  const newBook = {
    id,
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
    finished,
    insertedAt,
    updatedAt,
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
  bookData.push(newBook);
  const isSuccess = bookData.filter((x) => x.id === id).length > 0;
  const bookId = id;
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

const getAllBooksHandler2 = (request) => {
  const { name, reading, finished } = request.query;
  if (name !== undefined) {
    // const book = bookData.filter((x) => x.name.toLowerCase() === name.toLowerCase());
    const book = bookData.filter((obj) => JSON.stringify(obj.name)
      .toLowerCase().includes(name.toLowerCase()));
    const books = book.map((x) => ({
      id: x.id, name: x.name, publisher: x.publisher,
    }));
    return {
      status: 'success',
      data: {
        books,
      },
    };
  }
  // End of logic
  // Logic if reading query is inserted
  if (parseInt(reading, 10) === 1) {
    const book = bookData.filter((x) => x.reading === true);
    const books = book.map((x) => ({
      id: x.id, name: x.name, publisher: x.publisher,
    }));
    return {
      status: 'success',
      data: {
        books,
      },
    };
  } if (parseInt(reading, 10) === 0) {
    const book = bookData.filter((x) => x.reading === false);
    const books = book.map((x) => ({
      id: x.id, name: x.name, publisher: x.publisher,
    }));
    return {
      status: 'success',
      data: {
        books,
      },
    };
  }
  // End of logic
  // Logic if reading query is inserted
  if (parseInt(finished, 10) === 1) {
    const book = bookData.filter((x) => x.finished === true);
    const books = book.map((x) => ({
      id: x.id, name: x.name, publisher: x.publisher,
    }));
    return {
      status: 'success',
      data: {
        books,
      },
    };
  }
  if (parseInt(finished, 10) === 0) {
    const book = bookData.filter((x) => x.finished === false);
    const books = book.map((x) => ({
      id: x.id, name: x.name, publisher: x.publisher,
    }));
    return {
      status: 'success',
      data: {
        books,
      },
    };
  }
  // End of logic
  const books = bookData.map((x) => ({
    id: x.id, name: x.name, publisher: x.publisher,
  }));
  return {
    status: 'success',
    data: {
      books,
    },
  };
};
// Function to get by id
const getBookByIdHandler = (request, h) => {
  const { bookId } = request.params;
  const book = bookData.filter((x) => x.id === bookId)[0];

  if (book !== undefined) {
    return {
      status: 'success',
      data: {
        book,
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
const editBookByIdHandler = (request, h) => {
  const { bookId } = request.params;
  const {
    name, year, author, summary, publisher, pageCount, readPage, reading,
  } = request.payload;
  const updatedAt = new Date().toISOString();
  const index = bookData.findIndex((book) => book.id === bookId);
  // Check if name is not defined
  if (name === undefined) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. Mohon isi nama buku',
    });
    response.code(400);
    return response;
  }
  // Check if pageread is more than pagecount
  if (readPage > pageCount) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
    });
    response.code(400);
    return response;
  }
  // if bookID is found and name and pageread ok
  if (index !== -1) {
    bookData[index] = {
      ...bookData[index],
      name,
      year,
      author,
      summary,
      publisher,
      pageCount,
      readPage,
      reading,
      updatedAt,
    };
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil diperbarui',
    });
    response.code(200);
    return response;
  }
  // if bookID is not found
  const response = h.response({
    status: 'fail',
    message: 'Gagal memperbarui buku. Id tidak ditemukan',
  });
  response.code(404);
  return response;
};

// Function to delete
const deleteBookByIdHandler = (request, h) => {
  const { bookId } = request.params;
  const index = bookData.findIndex((x) => x.id === bookId);

  if (index !== -1) {
    bookData.splice(index, 1);
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil dihapus',
    });
    response.code(200);
    return response;
  }
  const response = h.response({
    status: 'fail',
    message: 'Buku gagal dihapus. Id tidak ditemukan',
  });
  response.code(404);
  return response;
};

module.exports = {
  addBookHandler,
  getBookByIdHandler,
  deleteBookByIdHandler,
  getAllBooksHandler2,
  editBookByIdHandler,
};
