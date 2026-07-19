// Maps recipe categories to a visual identity (emoji + gradient) so cards read
// well without photography. Matching is case-insensitive; the first category
// that has a mapping wins, otherwise a neutral fallback is used.

interface CategoryStyle {
  emoji: string
  gradient: string
}

const STYLES: Record<string, CategoryStyle> = {
  bread: { emoji: "🥖", gradient: "linear-gradient(135deg, #e8b774, #c98a3c)" },
  pizza: { emoji: "🍕", gradient: "linear-gradient(135deg, #f0a35e, #d75a3a)" },
  chicken: { emoji: "🍗", gradient: "linear-gradient(135deg, #eaa96b, #b5652f)" },
  pork: { emoji: "🥓", gradient: "linear-gradient(135deg, #e88a8a, #b34a53)" },
  dessert: { emoji: "🍰", gradient: "linear-gradient(135deg, #f2a6c2, #c85f97)" },
  breakfast: { emoji: "🥞", gradient: "linear-gradient(135deg, #f4c26b, #d98b3a)" },
  lunch: { emoji: "🥙", gradient: "linear-gradient(135deg, #e6b566, #b9822f)" },
  dinner: { emoji: "🍲", gradient: "linear-gradient(135deg, #e0955c, #a85a2c)" },
  coffee: { emoji: "☕", gradient: "linear-gradient(135deg, #b98a5e, #6f4426)" },
  snack: { emoji: "🍪", gradient: "linear-gradient(135deg, #e9b877, #bd7f43)" },
  sauce: { emoji: "🥫", gradient: "linear-gradient(135deg, #e78a5a, #b8432f)" },
  vegan: { emoji: "🥗", gradient: "linear-gradient(135deg, #8ec98a, #4f9d5a)" },
  vegetarian: { emoji: "🥗", gradient: "linear-gradient(135deg, #8ec98a, #4f9d5a)" },
  airfryer: { emoji: "🍤", gradient: "linear-gradient(135deg, #f0b46b, #cf7a34)" },
  "one pot": { emoji: "🍲", gradient: "linear-gradient(135deg, #e6a86b, #b56a34)" },
}

const FALLBACK: CategoryStyle = {
  emoji: "🍽️",
  gradient: "linear-gradient(135deg, #7fa8d0, #004686)",
}

export const getCategoryStyle = (categories: string[]): CategoryStyle => {
  for (const category of categories) {
    const style = STYLES[category.trim().toLowerCase()]
    if (style) return style
  }
  return FALLBACK
}
