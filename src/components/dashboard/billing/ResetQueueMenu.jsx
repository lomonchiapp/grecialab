import React, { useState, useEffect } from 'react'
import { Menu, MenuItem, ListItemText } from '@mui/material'
import { useGlobalState } from '../../../hooks/global/useGlobalState'

export const ResetQueueMenu = ({ anchorEl, open, handleClose, onQueueSelect }) => {

    const { queues } = useGlobalState()

  return (
    <Menu
      anchorEl={anchorEl}
      open={open}
      onClose={handleClose}
    >
      {queues.map((queue) => (
        <MenuItem 
          key={queue.id} 
          onClick={() => {
            onQueueSelect(queue.id)
            handleClose()
          }}
        >
          <ListItemText primary={queue.name || `Cola ${queue.id}`} />
        </MenuItem>
      ))}
    </Menu>
  )
} 