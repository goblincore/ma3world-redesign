'use client'
import React from 'react'

export const VideoThumbnail: React.FC<{ doc: any }> = ({ doc }) => {
  const { url, mimeType } = doc

  if (mimeType?.startsWith('video/') && url) {
    return (
      <video
        src={url}
        muted
        playsInline
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          borderRadius: '2px',
        }}
        onMouseOver={(e) => (e.currentTarget.play())}
        onMouseOut={(e) => {
          e.currentTarget.pause()
          e.currentTarget.currentTime = 0
        }}
      />
    )
  }

  return (
    <img
      src={url}
      alt=""
      style={{
        width: '100%',
        height: '100%',
        objectFit: 'cover',
        borderRadius: '2px',
      }}
    />
  )
}

export default VideoThumbnail
