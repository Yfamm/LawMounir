import type { Person } from "@/content/people";
import { Portrait } from "./Portrait";
import styles from "./TeamCard.module.css";

type Props = { person: Person; number: string; showBio?: boolean };

export function TeamCard({ person, number, showBio = false }: Props) {
  return (
    <article className={styles.card} data-team-card>
      <div className={styles.media} data-card-media>
        <div className={styles.inner} data-card-inner>
          <div className={styles.zoom}>
            <Portrait name={person.name} image={person.image} sizes="(min-width: 1100px) 30vw, (min-width: 640px) 50vw, 100vw" />
          </div>
        </div>
        <div className={styles.shade} aria-hidden="true" />
        <div className={styles.overlay}>
          <div className={styles.mask}>
            <span className={`label ${styles.role}`}>{person.role}</span>
          </div>
          <div className={styles.mask}>
            <h3 className={`serif ${styles.name}`}>{person.name}</h3>
          </div>
        </div>
        <span className={styles.line} aria-hidden="true" />
      </div>

      <div className={styles.caption}>
        <span className="label tabular">{number}</span>
        <span className={styles.practice}>{person.practice}</span>
      </div>
      {showBio && <p className={styles.bio}>{person.bio}</p>}
    </article>
  );
}
