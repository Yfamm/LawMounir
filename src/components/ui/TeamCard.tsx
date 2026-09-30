import type { PersonView } from "@/lib/cms/repository";
import { Arabic } from "./Arabic";
import { Portrait } from "./Portrait";
import styles from "./TeamCard.module.css";

type Props = { person: PersonView; number: string; showBio?: boolean };

export function TeamCard({ person, number, showBio = false }: Props) {
  const details = [
    { label: "Education", value: person.education },
    { label: "Languages", value: person.languages },
    { label: "Admission", value: person.admission },
  ].filter((d) => d.value.trim());

  return (
    <article className={styles.card} data-team-card>
      <div className={styles.media} data-card-media>
        <div className={styles.inner} data-card-inner>
          <div className={styles.zoom}>
            <Portrait
              name={person.name}
              image={person.image}
              alt={person.imageAlt}
              sizes="(min-width: 1100px) 30vw, (min-width: 640px) 50vw, 100vw"
            />
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
      {showBio && (person.nameAr || person.roleAr) && (
        <p className={styles.arabic}>
          <Arabic>{[person.nameAr, person.roleAr].filter(Boolean).join(" — ")}</Arabic>
        </p>
      )}
      {showBio && <p className={styles.bio}>{person.bio}</p>}
      {showBio && person.bioFull && <p className={styles.bio}>{person.bioFull}</p>}
      {showBio && details.length > 0 && (
        <dl className={styles.details}>
          {details.map((d) => (
            <div key={d.label}>
              <dt className="label">{d.label}</dt>
              <dd>{d.value}</dd>
            </div>
          ))}
        </dl>
      )}
    </article>
  );
}
