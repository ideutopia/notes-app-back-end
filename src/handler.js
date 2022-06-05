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

const getAllBooksHandler2 = (request) => {
  const { name, reading, finished } = request.query;
  if (name !== undefined) {
    const book = books.filter((x) => x.name.toLowerCase() === name.toLowerCase());
    console.log(book);
    return {
      status: 'success',
      data: {
        book,
      },
    };
  }
  // End of logic
  // Logic if reading query is inserted
  if (parseInt(reading, 10) === 1) {
    const book = books.filter((x) => x.reading === true);
    return {
      status: 'success',
      data: {
        book,
      },
    };
  } if (parseInt(reading, 10) === 0) {
    const book = books.filter((x) => x.reading === false);
    return {
      status: 'success',
      data: {
        book,
      },
    };
  }
  // End of logic
  // Logic if reading query is inserted
  if (parseInt(finished, 10) === 1) {
    const book = books.filter((x) => x.finished === true);
    return {
      status: 'success',
      data: {
        book,
      },
    };
  }
  if (parseInt(finished, 10) === 0) {
    const book = books.filter((x) => x.finished === false);
    return {
      status: 'success',
      data: {
        book,
      },
    };
  }
  // End of logic
  return {
    status: 'success',
    data: {
      books,
    },
  };
};

// const getAllBooksHandler = (request, h) => {
//   // const nameQuery = request.query.name;
//   // const readingQuery = request.query.reading;
//   // const finished= request.query.finished;
//   const book = []
//   const {name, reading, finished} = request.query
//   console.log(request.query);
//   if (name !== undefined) {
//     console.log(name);
//     // return book with name
//     const bookFiltered = books.filter((x) => x.name === name);
//     book.push(bookFiltered)
//     return {
//       status: 'success',
//       data: {
//         bookFiltered,
//       },
//     };
//   }
//   if (reading!== undefined) {
//     console.log(reading=== '1');
//     console.log(reading);
//     if (reading === 1) {
//       console.log('reading true');
//       const bookReaded = books.filter((x) => x.reading === true);
//       return {
//         status: 'success',
//         data: {
//           bookReaded,
//         },
//       };
//     // eslint-disable-next-line no-else-return
//     } else {
//       console.log('reading false');
//       return {
//         status: 'success',
//         data: {
//           books.filter((x) => x.reading === false),
//         },
//       };
//     }
//   }

//   if (finished!== undefined) {
//     if (finished=== 1) {
//       console.log('finished true');
//       const bookFinished = books.filter((x) => x.finished === true);
//       return {
//         status: 'success',
//         data: {
//           bookFinished,
//         },
//       };
//     }
//     console.log('finished false');
//     const bookFinishing = books.filter((x) => x.finished === false);
//     console.log(bookFinishing);
//     return {
//       status: 'success',
//       data: {
//         bookFinishing,
//       },
//     };
//   }
//   const response = h.response({
//     status: 'fail',
//     message: 'Buku tidak ditemukan',
//   });
//   response.code(404);
//   return response;
//   // return {
//   //   status: 'success',
//   //   data: {
//   //     books,
//   //   },
//   // };
// };
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
  addBookHandler, getBookByIdHandler, deleteBookByIdHandler, getAllBooksHandler2,
};
