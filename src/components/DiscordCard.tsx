import { useLanyard } from 'react-use-lanyard'
import { useEffect, useState } from 'react'

const DISCORD_USER_ID = '593390384785391637'

interface StatusIndicatorProps {
  status: string
}

const StatusIndicator = ({ status }: StatusIndicatorProps) => {
  const statusColors = {
    online: 'bg-green-500',
    idle: 'bg-yellow-500',
    dnd: 'bg-red-500',
    offline: 'bg-gray-500',
  }

  const statusColor =
    statusColors[status as keyof typeof statusColors] || statusColors.offline

  return (
    <div
      className={`absolute -right-1 -bottom-1 h-6 w-6 ${statusColor} rounded-full border-4 border-white dark:border-gray-800`}
    />
  )
}

const DiscordCard = () => {
  const { loading, status } = useLanyard({
    userId: DISCORD_USER_ID,
    socket: true,
  })

  const [currentTime, setCurrentTime] = useState(Date.now())

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(Date.now())
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  // Function to format elapsed time
  const formatElapsedTime = (startTimestamp: number): string => {
    const elapsed = currentTime - startTimestamp
    const seconds = Math.floor(elapsed / 1000)
    const minutes = Math.floor(seconds / 60)
    const hours = Math.floor(minutes / 60)

    if (hours > 0) {
      return `${hours.toString().padStart(2, '0')}:${(minutes % 60).toString().padStart(2, '0')}:${(seconds % 60).toString().padStart(2, '0')} elapsed`
    } else {
      return `${minutes.toString().padStart(2, '0')}:${(seconds % 60).toString().padStart(2, '0')} elapsed`
    }
  }

  if (loading) {
    return (
      <div className="bg-card text-card-foreground relative h-full overflow-hidden rounded-lg border p-6">
        <div className="flex h-full items-center justify-center">
          <div className="text-muted-foreground text-sm">
            Loading Discord status...
          </div>
        </div>
      </div>
    )
  }

  if (!status) {
    return (
      <div className="bg-card text-card-foreground relative h-full overflow-hidden rounded-lg border p-6">
        <div className="flex h-full items-center justify-center">
          <div className="text-muted-foreground text-sm">
            Unable to load Discord status
          </div>
        </div>
      </div>
    )
  }

  const avatarUrl = `https://cdn.discordapp.com/avatars/${status.discord_user.id}/${status.discord_user.avatar}.png?size=128`
  const username = status.discord_user.username
  const displayName =
    (status.discord_user as any).display_name ||
    (status.discord_user as any).global_name ||
    username
  const discordStatus = status.discord_status

  // Get current activity
  const activity = status.activities?.find(
    (activity: any) => activity.type === 0,
  ) // Type 0 = Playing

  return (
    <div className="bg-card text-card-foreground relative h-full overflow-hidden rounded-lg border p-6">
      <div className="flex h-full flex-col items-start justify-start space-y-5">
        {/* Profile Picture with Name - Desktop */}
        <div className="hidden w-full items-start space-x-4 lg:flex">
          <div className="relative flex-shrink-0">
            <img
              src={avatarUrl}
              alt={`${displayName}'s Discord avatar`}
              className="h-20 w-20 rounded-full object-cover"
              onError={(e) => {
                e.currentTarget.src = `https://cdn.discordapp.com/embed/avatars/${parseInt(status.discord_user.discriminator) % 5}.png`
              }}
            />
            <StatusIndicator status={discordStatus} />
          </div>

          <div className="min-w-0 flex-1 pt-1">
            {/* Name and Username */}
            <div className="text-foreground truncate text-lg font-semibold">
              {displayName}
            </div>
            {displayName !== username && (
              <div className="text-muted-foreground mb-2 truncate text-sm">
                @{username}
              </div>
            )}

            {/* Discord Badge - Desktop */}
            <div className="bg-muted/30 inline-block rounded-md">
              <img
                src="/static/discord_badges.svg"
                alt="Discord Badge"
                className="h-7 w-auto object-contain opacity-80 transition-opacity hover:opacity-100"
              />
            </div>
          </div>
        </div>

        {/* Profile Picture with Name - Mobile */}
        <div className="w-full sm:hidden">
          <div className="flex items-center space-x-4">
            <div className="relative flex-shrink-0">
              <img
                src={avatarUrl}
                alt={`${displayName}'s Discord avatar`}
                className="h-20 w-20 rounded-full object-cover"
                onError={(e) => {
                  e.currentTarget.src = `https://cdn.discordapp.com/embed/avatars/${parseInt(status.discord_user.discriminator) % 5}.png`
                }}
              />
              <StatusIndicator status={discordStatus} />
            </div>

            {/* Name and Username */}
            <div className="min-w-0 flex-1">
              <div className="text-foreground truncate text-lg font-semibold">
                {displayName}
              </div>
              {displayName !== username && (
                <div className="text-muted-foreground truncate text-sm">
                  @{username}
                </div>
              )}
              
              {/* Discord Badge - Mobile */}
              <div className="bg-muted/30 mt-2 inline-block rounded-md">
                <img
                  src="/static/discord_badges.svg"
                  alt="Discord Badge"
                  className="h-6 w-auto object-contain opacity-80 transition-opacity hover:opacity-100"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Profile Picture with Badge - Tablet */}
        <div className="hidden w-full sm:flex lg:hidden">
          <div className="flex w-full items-start space-x-4">
            <div className="relative flex-shrink-0">
              <img
                src={avatarUrl}
                alt={`${displayName}'s Discord avatar`}
                className="h-20 w-20 rounded-full object-cover"
                onError={(e) => {
                  e.currentTarget.src = `https://cdn.discordapp.com/embed/avatars/${parseInt(status.discord_user.discriminator) % 5}.png`
                }}
              />
              <StatusIndicator status={discordStatus} />
            </div>

            {/* Name and Username */}
            <div className="min-w-0 flex-1 pt-1">
              <div className="text-foreground truncate text-lg font-semibold">
                {displayName}
              </div>
              {displayName !== username && (
                <div className="text-muted-foreground mb-2 truncate text-sm">
                  @{username}
                </div>
              )}

              {/* Discord Badge - Tablet */}
              <div className="bg-muted/30 inline-block rounded-md">
                <img
                  src="/static/discord_badges.svg"
                  alt="Discord Badge"
                  className="h-6 w-auto object-contain opacity-80 transition-opacity hover:opacity-100"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Name Section - Tablet Only (REMOVED) */}

        {/* Status Section */}
        <div className="bg-muted/30 w-full rounded-lg px-3 py-3">
          {activity && (
            <div className="flex items-start space-x-2">
              {/* Activity Image */}
              <div className="flex-shrink-0">
                {activity.assets?.large_image && (
                  <img
                    src={`https://cdn.discordapp.com/app-assets/${activity.application_id}/${activity.assets.large_image}.png?size=64`}
                    alt={activity.name}
                    className="h-16 w-16 rounded-lg object-cover"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none'
                    }}
                  />
                )}
              </div>

              {/* Activity Text */}
              <div className="min-w-0 flex-1">
                <div className="text-foreground truncate text-sm font-semibold">
                  {activity.name}
                </div>
                {activity.details && (
                  <div className="text-muted-foreground mt-1 truncate text-xs">
                    {activity.details}
                  </div>
                )}
                {activity.state && (
                  <div className="text-muted-foreground truncate text-xs">
                    {activity.state}
                  </div>
                )}
                {activity.timestamps?.start && (
                  <div className="text-muted-foreground mt-1 truncate text-xs">
                    {formatElapsedTime(activity.timestamps.start)}
                  </div>
                )}
              </div>
            </div>
          )}

          
          {!activity && (
            <div className="flex h-16 items-center justify-center space-x-3">
              <img
                src="/static/discord-cat-status.svg"
                alt="No status"
                className="h-25 w-25 object-contain opacity-70"
              />
              <div className="text-muted-foreground text-sm">No Status !</div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default DiscordCard