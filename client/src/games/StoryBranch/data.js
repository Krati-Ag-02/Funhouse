// Local fallback bank — used when Groq isn't configured or is unreachable.
// Exactly one choice per scenario is "best", one "good", one "poor".
export const stories = [
  {
    scenario: 'Your neighbor asks to borrow a tool you rarely use, but you\'re worried it might not come back.',
    choices: [
      { id: 'a', text: 'Lend it and let it go', outcome: 'They return it the next day with a thank-you note.', quality: 'best' },
      { id: 'b', text: 'Say you need it this week', outcome: 'A small white lie — it works, but feels a bit awkward.', quality: 'good' },
      { id: 'c', text: 'Pretend you\'re not home', outcome: 'They see you through the window. Awkward.', quality: 'poor' },
    ],
  },
  {
    scenario: 'You get an email meant for someone else with sensitive information in it.',
    choices: [
      { id: 'a', text: 'Reply and let the sender know', outcome: 'They thank you and fix the mistake.', quality: 'best' },
      { id: 'b', text: 'Just delete it and move on', outcome: 'Simple, but the sender never finds out.', quality: 'good' },
      { id: 'c', text: 'Forward it to a friend as a joke', outcome: 'Not great — now more people have seen it.', quality: 'poor' },
    ],
  },
  {
    scenario: 'You notice a small mistake in a group project right before it\'s due.',
    choices: [
      { id: 'a', text: 'Flag it calmly and offer to help fix it', outcome: 'Fixed in ten minutes, no hard feelings.', quality: 'best' },
      { id: 'b', text: 'Fix it yourself quietly', outcome: 'It gets fixed, but nobody learns what went wrong.', quality: 'good' },
      { id: 'c', text: 'Say nothing and hope no one notices', outcome: 'It gets noticed later, at a worse time.', quality: 'poor' },
    ],
  },
  {
    scenario: 'A friend cancels plans on you for the second time this month.',
    choices: [
      { id: 'a', text: 'Tell them honestly how it feels', outcome: 'They apologize and you reschedule for real.', quality: 'best' },
      { id: 'b', text: 'Say it\'s fine but feel a bit hurt', outcome: 'It\'s fine for now, but the feeling lingers.', quality: 'good' },
      { id: 'c', text: 'Stop responding to their texts', outcome: 'The friendship gets awkward for no clear reason.', quality: 'poor' },
    ],
  },
]

export function getStoryBank() {
  return stories
}
