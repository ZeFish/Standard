´´´css
/* Base rhythm spacing (paragraph breaks) */
.prose > * + * {
  margin-block-start: var(--baseline); /* 1rlh = proper paragraph spacing */
}

/* Adjacent paragraphs = single line break */
.prose p + p {
  margin-block-start: calc(var(--leading) * -1);
  /* or if trimmed: margin-block-start: 0; */
}
´´´