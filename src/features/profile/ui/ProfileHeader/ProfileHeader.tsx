'use client'

import Image from 'next/image'
import Link from 'next/link'
import { ROUTES } from '@/shared/config/routes'
import { Button } from '@/shared/ui/Button/Button'
import { Typography } from '@/shared/ui/Typography/Typography'
import type { Profile } from '@/features/profile/model/type'
import s from './ProfileHeader.module.scss'

type Props = {
  profile: Profile['response']
  postsCount: number
  isOwner: boolean
  isLoggedIn: boolean
  isFollowActionPending?: boolean
  onFollow?: () => void
  onUnfollow?: () => void
  onSendMessage?: () => void
}

const formatCount = (value?: number) => (value ?? 0).toLocaleString('ru-RU')

export const ProfileHeader = ({
  profile,
  postsCount,
  isOwner,
  isLoggedIn,
  isFollowActionPending,
  onFollow,
  onUnfollow,
  onSendMessage,
}: Props) => {
  const avatarUrl = profile.avatar?.[0]?.url
  const userName = `${profile.firstName} ${profile.lastName}`.trim() || profile.username
  const aboutMe =
    profile.aboutMe ||
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.'
  const isFollowed = !!profile.isFollowed

  const handleFollowClick = () => {
    if (isFollowed) {
      onUnfollow?.()
    } else {
      onFollow?.()
    }
  }

  return (
    <div className={s.header}>
      <div className={s.avatarWrapper}>
        {avatarUrl ? (
          <Image src={avatarUrl} alt={userName} width={192} height={192} className={s.avatar} />
        ) : (
          <div className={s.avatarPlaceholder}>{userName?.charAt(0)?.toUpperCase()}</div>
        )}
      </div>

      <div className={s.info}>
        <div className={s.nameRow}>
          <Typography variant="h1" as="h1" className={s.userName}>
            {userName}
          </Typography>

          {isOwner && isLoggedIn && (
            <Button as={Link} href={ROUTES.DYNAMIC.SETTINGS_TAB('')} variant="secondary" className={s.settingsButton}>
              Profile Settings
            </Button>
          )}

          {!isOwner && isLoggedIn && (
            <div className={s.actionButtons}>
              <Button
                variant={isFollowed ? 'tertiary' : 'primary'}
                onClick={handleFollowClick}
                disabled={isFollowActionPending}
              >
                {isFollowed ? 'Unfollow' : 'Follow'}
              </Button>
              <Button variant="secondary" onClick={onSendMessage}>
                Send Message
              </Button>
            </div>
          )}
        </div>

        <div className={s.stats}>
          <div className={s.statItem}>
            <Typography variant="h2" as="span" className={s.statNumber}>
              {formatCount(profile.followingCount)}
            </Typography>
            <Button as={Link} href={ROUTES.DYNAMIC.FOLLOWING_MODAL(profile.userId)} variant="link">
              <Typography variant="small_text" as="span" className={s.statLabel}>
                Following
              </Typography>
            </Button>
          </div>
          <div className={s.statItem}>
            <Typography variant="h2" as="span" className={s.statNumber}>
              {formatCount(profile.followersCount)}
            </Typography>
            <Button as={Link} href={ROUTES.DYNAMIC.FOLLOWERS_MODAL(profile.userId)} variant="link">
              <Typography variant="small_text" as="span" className={s.statLabel}>
                Followers
              </Typography>
            </Button>
          </div>
          <div className={s.statItem}>
            <Typography variant="h2" as="span" className={s.statNumber}>
              {formatCount(postsCount)}
            </Typography>
            <Typography variant="small_text" as="span" className={s.statLabel}>
              Publications
            </Typography>
          </div>
        </div>

        <Typography variant="regular_text_16" className={s.about}>
          {aboutMe}
        </Typography>
      </div>
    </div>
  )
}
