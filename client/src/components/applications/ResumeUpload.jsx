import UploadFileOutlinedIcon from '@mui/icons-material/UploadFileOutlined'
import { Alert, Box, Button, LinearProgress, Stack, Typography } from '@mui/material'
import { useRef, useState } from 'react'

const maxSizeBytes = 5 * 1024 * 1024

function ResumeUpload({ disabled, file, onChange }) {
  const inputRef = useRef(null)
  const [error, setError] = useState('')

  const handleFileChange = (event) => {
    const nextFile = event.target.files?.[0]
    setError('')

    if (!nextFile) {
      onChange(null)
      return
    }

    if (nextFile.type !== 'application/pdf') {
      setError('Upload a PDF resume.')
      onChange(null)
      return
    }

    if (nextFile.size > maxSizeBytes) {
      setError('Resume must be 5 MB or smaller.')
      onChange(null)
      return
    }

    onChange(nextFile)
  }

  return (
    <Stack spacing={1.5}>
      <Box
        sx={{
          alignItems: 'center',
          border: '1px dashed',
          borderColor: error ? 'error.main' : 'divider',
          borderRadius: 2,
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          gap: 2,
          justifyContent: 'space-between',
          p: 3,
        }}
      >
        <Stack direction="row" spacing={1.5}>
          <UploadFileOutlinedIcon color="primary" />
          <Box>
            <Typography fontWeight={800}>
              {file ? file.name : 'Upload resume'}
            </Typography>
            <Typography color="text.secondary" variant="body2">
              PDF only, maximum 5 MB.
            </Typography>
          </Box>
        </Stack>
        <Button
          disabled={disabled}
          onClick={() => inputRef.current?.click()}
          variant="outlined"
        >
          Choose PDF
        </Button>
        <input
          accept="application/pdf"
          hidden
          ref={inputRef}
          type="file"
          onChange={handleFileChange}
        />
      </Box>
      {disabled ? <LinearProgress /> : null}
      {error ? <Alert severity="error">{error}</Alert> : null}
    </Stack>
  )
}

export default ResumeUpload
