// Each scenario has one "best fit" emoji reaction, chosen by the game
// designer (standing in for an AI judgment call). Player picks the
// reaction they think fits best; closeness is scored simply as a match.
export const scenarios = [
  { id: 1, text: 'You finally sit down after a long day and your favorite show is on.', best: '😌', options: ['😌', '😡', '😱', '🥱'] },
  { id: 2, text: 'Your friend surprises you with your favorite meal for no reason.', best: '🥹', options: ['🥹', '😴', '😤', '🤔'] },
  { id: 3, text: 'You take a sip of coffee thinking it is cold, but it is scalding hot.', best: '😳', options: ['😳', '😌', '🥳', '🙄'] },
  { id: 4, text: 'You realize you left your umbrella at home just as it starts pouring.', best: '😩', options: ['😩', '😍', '😇', '🥱'] },
  { id: 5, text: "It's your grandchild's first day of school and they wave excitedly.", best: '🥰', options: ['🥰', '😒', '😬', '😐'] },
  { id: 6, text: 'You hear a loud, unexpected noise behind you in a quiet room.', best: '😨', options: ['😨', '😴', '😋', '🥳'] },
  { id: 7, text: 'You finish a crossword puzzle you have been stuck on for days.', best: '🎉', options: ['🎉', '😭', '😑', '🤯'] },
  { id: 8, text: 'Someone cuts in line right in front of you at the store.', best: '😤', options: ['😤', '🥰', '😴', '😇'] },
  { id: 9, text: 'You are watching a movie and the plot twist catches you completely off guard.', best: '😱', options: ['😱', '😌', '🥱', '🙂'] },
  { id: 10, text: 'You wake up naturally, well-rested, with nowhere you need to be.', best: '😌', options: ['😌', '😡', '😰', '😤'] },
]

export function getMoodScenarios() {
  return scenarios
}
