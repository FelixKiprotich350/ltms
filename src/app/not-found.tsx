import styles from "./not-found.module.css";

export default function NotFound() {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>404 - Page Not Found</h1>
      <p className={styles.text}>
        Sorry, the page you are looking for does not exist.
      </p>
      <a href="/" className={styles.button}>
        Go Back Home
      </a>
    </div>
  );
}
