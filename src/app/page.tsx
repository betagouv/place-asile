import styles from "./page.module.css";
import { Button } from "./components/Button";

export default function Home() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <Button title="TEST" />
      </main>
    </div>
  );
}
