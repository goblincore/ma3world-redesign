'use client'
import React from 'react'
import { useFormFields } from '@payloadcms/ui'

export const SubmissionView: React.FC = () => {
  const name = useFormFields(([fields]) => fields?.name?.value as string)
  const email = useFormFields(([fields]) => fields?.email?.value as string)
  const message = useFormFields(([fields]) => fields?.message?.value as string)
  
  return (
    <div style={{ 
      padding: '1.5rem', 
      backgroundColor: 'var(--theme-elevation-50)', 
      borderRadius: '4px',
      marginBottom: '1rem'
    }}>
      <div style={{ marginBottom: '1rem' }}>
        <strong style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', opacity: 0.7 }}>
          From:
        </strong>
        <div style={{ fontSize: '1rem' }}>
          {name || 'N/A'} ({email || 'N/A'})
        </div>
      </div>
      
      <div>
        <strong style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', opacity: 0.7 }}>
          Message:
        </strong>
        <div style={{ 
          fontSize: '1rem', 
          whiteSpace: 'pre-wrap', 
          lineHeight: '1.6',
          padding: '1rem',
          backgroundColor: 'var(--theme-elevation-100)',
          borderRadius: '4px'
        }}>
          {message || 'N/A'}
        </div>
      </div>
    </div>
  )
}

export default SubmissionView
