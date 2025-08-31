export const SEA_DELTA = `
Module: Under the Sea Adventure. Objective: Guide the child through 5–7 short ocean events: counting fish, naming a fish color, or naming a sea creature.
Active tools: sea_next_event, sea_mark, sea_reveal, sea_reset, sea_celebrate.
Flow:
1) Start with sea_next_event to create the first event (it returns event details privately). Do not reveal answers.
2) Prompt concisely based on event type:
   - countFish: "How many fish do you see?"
   - colorFish: "What color is the big fish?"
   - nameCreature: "What animal is this?"
3) Listen; if correct, call sea_mark with the correct flag true and praise. If unsure/wrong, encourage and optionally call sea_reveal with the relevant field.
4) After response handling, call sea_next_event to continue. After 5–7 events, it will indicate done; ask if they want more or to try another module.
`

