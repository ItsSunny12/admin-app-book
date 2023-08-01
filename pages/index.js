import { useEffect, useState } from "react";
import styles from "../styles/create.module.css";
export default function Home() {
  const initialBookState = { name: "", author: "", price: 0 };
  const initialMovementState = { type: "Compra", quantity: 0 };
  const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
  const [selectedBookId, setSelectedBookId] = useState();
  const [book, setBook] = useState(initialBookState);
  const [movement, setMovement] = useState(initialMovementState);
  const [books, setBooks] = useState([]);

  const handleChange = (e) => {
    const inputValue = e.target.value;
    const inputName = e.target.name;

    setBook({
      ...book,
      [inputName]: inputValue,
    });
  };
  const handleMovementChange = (e) => {
    const inputValue = e.target.value;

    setMovement({
      ...movement,
      quantity: +inputValue,
    });
  };

  const handleSelectType = (type) => {
    setMovement({ ...movement, type });
  };

  const handleCreateBook = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${baseUrl}/books`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(book),
      });
      const data = await res.json();
      setBook(initialBookState);
      const newBook = [data.book, ...books];
      setBooks(newBook);
      //fetchBooks();
    } catch (error) {
      console.log({ error });
    }
  };

  const handleCreateMovement = async (e) => {
    try {
      const res = await fetch(`${baseUrl}/books/movement/${selectedBookId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(movement),
      });
      const data = await res.json();
      setMovement(initialMovementState);
      setSelectedBookId(null);
      fetchBooks();
    } catch (error) {
      console.log({ error });
    }
  };

  const fetchBooks = () => {
    fetch(`${baseUrl}/books`)
      .then((res) => res.json())
      .then(({ books }) => {
        setBooks(books);
      });
  };

  useEffect(() => {
    fetchBooks();
  }, []);
  return (
    <>
      <div className={`${styles.container} ${styles.df} ${styles.jcsa}`}>
        <div className={`${styles.df} ${styles.fdc}`}>
          <h2 className={styles.h2}>Crear un nuevo libro</h2>
          <form className={styles.form}>
            <input
              className={styles.input}
              type="text"
              name="name"
              value={book.name}
              onChange={handleChange}
            />
            <input
              className={styles.input}
              type="text"
              name="author"
              value={book.author}
              onChange={handleChange}
            />
            <input
              className={styles.input}
              type="number"
              name="price"
              value={book.price}
              onChange={handleChange}
            />

            <button className={styles.button} onClick={handleCreateBook}>
              Crear Libro
            </button>
          </form>
          <h2 className={styles.h2}>Crear movimiento stock</h2>
          <div className={`${styles.df} ${styles.aic} ${styles.mb5}`}>
            {["Compra", "Venta"].map((type) => (
              <div
                onClick={() => handleSelectType(type)}
                className={` ${styles.br5} ${styles.shadow} ${styles.p5} ${styles.mr5} ${styles.cursorp}`}
                key={type}
                style={{
                  backgroundColor:
                    type === movement.type ? "lightblue" : "white",
                }}
              >
                <span>{type}</span>
              </div>
            ))}
          </div>
          <input
            className={styles.input}
            type="number"
            name="quantity"
            value={movement.quantity}
            onChange={handleMovementChange}
          />

          <button className={styles.button} onClick={handleCreateMovement}>
            Crear movimiento de stock
          </button>
        </div>
        <div className={styles.booksContainer}>
          {books.map((b) => (
            <div
              onClick={() => setSelectedBookId(b._id)}
              style={{
                backgroundColor:
                  selectedBookId === b._id ? "lightblue" : "white",
              }}
              className={`${styles.shadow} ${styles.df} ${styles.aic} ${styles.jcsb} ${styles.p5} ${styles.mb5} ${styles.br5} ${styles.cursorp}`}
              key={b._id}
            >
              <span className={styles.mr5}>{b.name}</span>
              <span className={styles.mr5}>{b.author}</span>
              <div className={`${styles.df} ${styles.aic}`}>
                <div className={`${styles.mr5} ${styles.fdc} ${styles.df}`}>
                  <span>${b.price}</span>
                  <span>Stock: {b.stock}</span>
                </div>

                <i
                  className={`${styles.delete} fa fa-trash`}
                  onClick={() => {
                    fetch(`${baseUrl}/books/${b._id}`, { method: "DELETE" })
                      .then((res) => res.json())
                      .then((data) => {
                        console.log({ data });
                      });
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
