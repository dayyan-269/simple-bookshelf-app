import { getBooks, insertBook, updateStatus, deleteBook } from "./DAO.js";

let ReadBooks = [];
let NotReadBooks = [];
let Books = [];

document.addEventListener("DOMContentLoaded", () => {
  setBooksData();
  populateContainer();

  document
    .querySelector("#form-input")
    .addEventListener("submit", inputBookHandler);

  document
    .querySelector("#btn-search")
    .addEventListener("click", searchBookHandler);

  document
    .querySelector("#btn-delete-confirm")
    .addEventListener("click", deleteBookHandler);

  document
    .querySelector("#btn-delete-cancel")
    .addEventListener("click", toggleModal);
});

const inputBookHandler = (e) => {
  e.preventDefault();

  const titleField = document.querySelector("#title");
  const authorField = document.querySelector("#author");
  const yearField = document.querySelector("#year");
  const statusField = document.querySelector("#is-complete");

  const newBook = {
    id: Date.now(),
    title: titleField.value,
    author: authorField.value,
    year: yearField.value,
    isComplete: statusField.checked,
  };

  insertBook(Books, newBook);
  setBooksData();
  populateContainer();
  resetForm();
  alert("new book added!");
};

const searchBookHandler = () => {
  setBooksData();
  const searchField = document.querySelector("#search");

  if (searchField.value) {
    ReadBooks = ReadBooks.filter((book) => book.title === searchField.value);
    NotReadBooks = NotReadBooks.filter(
      (book) => book.title === searchField.value
    );
  }

  document.querySelector("#read-container").innerHTML = "";
  document.querySelector("#not-read-container").innerHTML = "";

  setElements("#read-container", ReadBooks);
  setElements("#not-read-container", NotReadBooks, "not-read");
  populateContainer();
};

const showDeleteHandler = (e) => {
  const id = e.target.id;
  const splittedId = id.split("-");

  toggleModal(splittedId[1]);
};

const deleteBookHandler = () => {
  const idField = document.querySelector("#book-id");

  deleteBook(idField.value);
  toggleModal();
  setBooksData();
  populateContainer();
};

const updateBookHandler = (e) => {
  const id = e.target.id;
  const splittedId = id.split("-");

  updateStatus(splittedId[1]);
  setBooksData();
  populateContainer();
};

const setBooksData = () => {
  Books = getBooks(Books);
  ReadBooks = Books.filter((book) => book.isComplete == true);
  NotReadBooks = Books.filter((book) => book.isComplete == false);
};

const resetForm = () => {
  document.querySelector("#title").value = "";
  document.querySelector("#author").value = "";
  document.querySelector("#year").value = "";
  document.querySelector("#is-complete").checked = false;
};

const resetContainer = () => {
  document.querySelector("#read-container").innerHTML = "";
  document.querySelector("#not-read-container").innerHTML = "";
};

const createElement = (book, prefix) => {
  const authorText = document.createElement("p");
  authorText.classList.add("text--md");
  authorText.innerHTML = "Penulis: ";

  const authorVal = document.createElement("p");
  authorVal.classList.add("text--md");
  authorVal.innerHTML = book.author;

  const authorContainer = document.createElement("div");
  authorContainer.classList.add("flex", "flex--row");
  authorContainer.append(authorText, authorVal);

  const yearText = document.createElement("p");
  yearText.classList.add("text--md");
  yearText.innerHTML = "Tahun: ";

  const yearVal = document.createElement("p");
  yearVal.classList.add("text--md");
  yearVal.innerHTML = book.year;

  const yearContainer = document.createElement("div");
  yearContainer.classList.add("flex", "flex--row");
  yearContainer.append(yearText, yearVal);

  const title = document.createElement("h4");
  title.innerHTML = book.title;

  const contentContainer = document.createElement("div");
  contentContainer.classList.add("flex--1", "flex", "flex--col", "gap--sm");
  contentContainer.append(title, authorContainer, yearContainer);

  const btnUpdate = document.createElement("button");
  btnUpdate.classList.add(
    "btn",
    "pointer",
    "py--1",
    "px--1",
    "bg--orange",
    "rounded",
    "text--white",
    "btn-update"
  );
  btnUpdate.setAttribute("id", `update-${book.id}`);
  btnUpdate.innerHTML = "Update Status";
  btnUpdate.addEventListener("click", updateBookHandler);

  const btnDelete = document.createElement("button");
  btnDelete.classList.add(
    "btn",
    "pointer",
    "py--1",
    "px--1",
    "bg--red",
    "rounded",
    "text--white",
    "btn-delete"
  );
  btnDelete.setAttribute("id", `delete-${book.id}`);
  btnDelete.innerHTML = "Delete Book";
  btnDelete.addEventListener("click", showDeleteHandler);

  const btnContainer = document.createElement("div");
  btnContainer.classList.add("flex", "flex--col", "gap--md");
  btnContainer.append(btnUpdate, btnDelete);

  const itemContainer = document.createElement("article");
  itemContainer.classList.add(
    "flex",
    "flex--row",
    "align--center",
    "content--between",
    "gap--sm",
    "mt--2",
    "px--4",
    "py--3",
    "bg--white",
    "rounded",
    "shadow"
  );
  itemContainer.append(contentContainer, btnContainer);
  itemContainer.setAttribute("id", `${prefix}-${book.id}`);

  return itemContainer;
};

const setElements = (selector, books, prefix = "read") => {
  const booksContainer = document.querySelector(selector);

  books.forEach((book) => {
    const bookElement = createElement(book, prefix);
    booksContainer.append(bookElement);
  });
};

const populateContainer = () => {
  resetContainer();
  setElements("#read-container", ReadBooks);
  setElements("#not-read-container", NotReadBooks, "not-read");
};

const toggleModal = (bookId = "") => {
  const backdrop = document.querySelector("#backdrop");
  const idField = document.querySelector("#book-id");

  backdrop.classList.toggle("modal--active");
  document.body.classList.toggle("no-scroll");
  idField.value = bookId;
};
