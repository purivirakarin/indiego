import Chip from '@mui/material/Chip'

const rankColors: Record<string, { bg: string; color: string }> = {
  Observer: { bg: '#6b5e53', color: '#fff' },
  Storyteller: { bg: '#b53a2a', color: '#fff' },
  Curator: { bg: '#c49a3c', color: '#1a1411' },
  Visionary: { bg: '#7b2d8e', color: '#fff' },
}

interface Props {
  rank: string
  size?: 'small' | 'medium'
}

export default function RankBadge({ rank, size = 'small' }: Props) {
  const colors = rankColors[rank] || rankColors.Observer
  return (
    <Chip
      label={rank}
      size={size}
      sx={{
        bgcolor: colors.bg,
        color: colors.color,
        fontWeight: 700,
        fontSize: size === 'small' ? 10 : 12,
        letterSpacing: 0.5,
      }}
    />
  )
}
