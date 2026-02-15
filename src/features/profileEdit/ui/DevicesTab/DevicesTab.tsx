'use client'

import { ChromeIcon, CloseOutlineIcon, LogOutOutlineIcon } from '@/shared/icons/svgComponents'
import PcIcon from '@/shared/icons/svgComponents/icons/PcIcon'
import { Button } from '@/shared/ui/Button/Button'
import { Card } from '@/shared/ui/Card/Card'
import { Typography } from '@/shared/ui/Typography/Typography'
import s from './DevicesTab.module.scss'
import PhoneIcon from '@/shared/icons/svgComponents/icons/PhoneIcon'
import {
  useGetSessionsQuery,
  useTerminateAllSessionsMutation,
  useTerminateSessionMutation,
} from '@/features/session/api/sessions-api'
import { formatDate } from '../../lib/utils/date'
import { useRef, useState } from 'react'
import { Alert } from '@/shared/ui/Alert/Alert'

type AlertMessage = {
  id: number
  status: 'success' | 'error'
  text: string
  position: 'bottom-left' | 'bottom-right' | 'top-left' | 'top-right'
}

export function DevicesTab() {
  const { data: sessionsData, isLoading, error, refetch } = useGetSessionsQuery()
  const [terminateAllSessions] = useTerminateAllSessionsMutation()
  const [terminateSession] = useTerminateSessionMutation()

  const [terminatingSessionId, setTerminatingSessionId] = useState<string | null>(null)

  const alertIdRef = useRef(0)
  const [alerts, setAlerts] = useState<AlertMessage[]>([])

  const addAlert = (status: 'success' | 'error', text: string, position: AlertMessage['position'] = 'top-right') => {
    const id = alertIdRef.current++
    setAlerts((prev) => [...prev, { id, status, text, position }])

    setTimeout(() => {
      setAlerts((prev) => prev.filter((alert) => alert.id !== id))
    }, 3000)
  }

  const renderDeviceIcon = (deviceType: string) => {
    switch (deviceType) {
      case 'mobile':
        return <PhoneIcon />
      case 'desktop':
      case 'tablet':
        return <PcIcon />
      case 'browser':
      default:
        return <ChromeIcon />
    }
  }

  const handleLogout = async (deviceId: string) => {
    try {
      setTerminatingSessionId(deviceId)
      await terminateSession({ deviceId }).unwrap()
      addAlert('success', 'Session successfully terminated')
    } catch (err) {
      addAlert('error', 'Failed to terminate session')
    } finally {
      setTerminatingSessionId(null)
    }
  }

  const handleTerminateAll = async () => {
    try {
      await terminateAllSessions().unwrap()
      addAlert('success', 'All other sessions successfully terminated')
    } catch (err) {
      addAlert('error', 'Failed to terminate all sessions')
    }
  }

  if (isLoading) {
    return (
      <div className={s.loadingContainer}>
        <Typography>Loading sessions...</Typography>
      </div>
    )
  }

  if (error) {
    return (
      <Card as="div" className={s.errorCard}>
        <Typography variant="bold_text_16" color="error">
          Failed to load sessions
        </Typography>
        <Button type="button" variant="secondary" onClick={() => refetch()}>
          Retry
        </Button>
      </Card>
    )
  }

  const currentSession = sessionsData?.current
  const otherSessions = sessionsData?.others || []

  return (
    <>
      <div>
        {alerts.map((alert) => (
          <Alert key={alert.id} status={alert.status} text={alert.text} position={(alert.position = 'bottom-left')} />
        ))}
      </div>
      {currentSession && (
        <div>
          <Typography>Current device</Typography>
          <Card as="div" className={s.currentDeviceCard}>
            <div>{renderDeviceIcon(currentSession.deviceType)}</div>
            <div className={s.deviceInfo}>
              <Typography as="div" variant="bold_text_16">
                {currentSession.browserName}
              </Typography>
              <Typography as="div" variant="regular_text_14">
                IP:
              </Typography>
            </div>
          </Card>
        </div>
      )}

      <div>
        {otherSessions.length > 0 ? (
          <div className={s.activeSessionsSection}>
            <Button type="button" variant="tertiary" onClick={handleTerminateAll}>
              Terminate all other session
            </Button>
          </div>
        ) : (
          ''
        )}
        <Typography>Active sessions</Typography>
        {otherSessions.length > 0 ? (
          <>
            {otherSessions.map((session) => (
              <Card as="div" key={session.deviceId} className={s.activeSessionCard}>
                <div className={s.sessionContainer}>
                  <div className={s.deviceIcon}>{renderDeviceIcon(session.deviceType)}</div>
                  <div className={s.session}>
                    <Typography as="div" variant="bold_text_16" className={s.deviceName}>
                      {session.browserName}
                    </Typography>
                    <Typography as="div" variant="regular_text_14">
                      IP:
                    </Typography>
                    <Typography as="div" variant="regular_text_14">
                      Last visit: {formatDate(session.lastActive)}
                    </Typography>
                  </div>
                </div>
                <div className={s.logoutButtonWrapper}>
                  <Button
                    type="button"
                    variant="link"
                    className={s.logOutButton}
                    onClick={() => handleLogout(session.deviceId)}
                    disabled={terminatingSessionId === session.deviceId}
                  >
                    {terminatingSessionId === session.deviceId ? (
                      <>
                        <span className={s.logoutIcon}>
                          <CloseOutlineIcon />
                        </span>
                        <span>Logging out...</span>
                      </>
                    ) : (
                      <>
                        <span className={s.logoutIcon}>
                          <LogOutOutlineIcon />
                        </span>
                        <span>Log Out</span>
                      </>
                    )}
                  </Button>
                </div>
              </Card>
            ))}
          </>
        ) : (
          <Typography as="div" variant="h3" className={s.noSessionsMessage}>
            You have not yet logged in from other devices
          </Typography>
        )}
      </div>
    </>
  )
}
