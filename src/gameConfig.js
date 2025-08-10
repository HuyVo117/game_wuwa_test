export const GAME_CONFIG = {
  gridSize: 10,
  colors: ["#E74C3C", "#2ECC71", "#3498DB", "#F1C40F", "#9B59B6"],
  difficulties: {
    easy: { moves: 6, colorCount: 3 },
    normal: { moves: 4, colorCount: 4 },
    difficult: { moves: 3, colorCount: 5 }
  },
  levelSets: [
    { id: 1, name: 'Khu vườn kẹo', difficulty: 'easy' },
    { id: 2, name: 'Thác ngọt ngào', difficulty: 'easy' },
    { id: 3, name: 'Đồi chocolate', difficulty: 'normal' },
    { id: 4, name: 'Núi kem', difficulty: 'normal' },
    { id: 5, name: 'Lâu đài soda', difficulty: 'difficult' }
  ]
};
