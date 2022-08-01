export const getBooks = () => {
    const books = localStorage.getItem('books');

    if (books) {
        return JSON.parse(books);
    } else {
        return [];
    }
}

export const insertBook = (books, newBook) => {
    books.push(newBook);
    localStorage.setItem('books', JSON.stringify(books));
}

export const updateStatus = (id) => {
    let books = getBooks();
    const updatedBooks = books.map(item => {
        if (item.id == id) {
            return { ...item, 'isComplete': !item.isComplete };
        } else {
            return item;
        }
    });

    localStorage.setItem('books', JSON.stringify(updatedBooks));
}

export const deleteBook = (id) => {
    const books = getBooks();
    const filteredBooks = books.filter(book => book.id != id);
    localStorage.setItem('books', JSON.stringify(filteredBooks));
}