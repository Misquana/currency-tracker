import { Router } from 'express'
import { validateCreateNote, validateUpdateNote } from '../validators/note-validator.js'
import { listNotes, getNoteById, createNote, updateNote, deleteNote } from '../../repository.js'

export const notesRouter = Router()

notesRouter.get('/', (req, res) => {
  const currencyCode = req.query.currency ? String(req.query.currency).toUpperCase() : undefined
  const notes = listNotes({ currencyCode })
  res.json({ data: notes })
})

notesRouter.get('/:id', (req, res) => {
  const id = Number(req.params.id)
  const note = getNoteById(id)

  if (!note) {
    return res.status(404).json({
      error: 'Not Found',
      message: `Note with id ${id} not found`,
    })
  }

  res.json({ data: note })
})

notesRouter.post('/', (req, res, next) => {
  const validation = validateCreateNote(req.body)

  if (!validation.valid) {
    return res.status(400).json({
      error: 'Bad Request',
      message: validation.errors[0],
    })
  }

  try {
    const note = createNote({
      currencyCode: validation.value.currency_code,
      text: validation.value.text,
    })

    res.status(201).json({ data: note })
  } catch (error) {
    if (error.code === 'SQLITE_CONSTRAINT_FOREIGNKEY') {
      return res.status(400).json({
        error: 'Bad Request',
        message: `Currency ${validation.value.currency_code} not found`,
      })
    }
    next(error)
  }
})

notesRouter.put('/:id', (req, res) => {
  const id = Number(req.params.id)
  const existingNote = getNoteById(id)

  if (!existingNote) {
    return res.status(404).json({
      error: 'Not Found',
      message: `Note with id ${id} not found`,
    })
  }

  const validation = validateUpdateNote(req.body)

  if (!validation.valid) {
    return res.status(400).json({
      error: 'Bad Request',
      message: validation.errors[0],
    })
  }

  const updatedNote = updateNote(id, { text: validation.value.text })

  res.json({ data: updatedNote })
})

notesRouter.delete('/:id', (req, res) => {
  const id = Number(req.params.id)
  const existingNote = getNoteById(id)

  if (!existingNote) {
    return res.status(404).json({
      error: 'Not Found',
      message: `Note with id ${id} not found`,
    })
  }

  deleteNote(id)

  res.json({ message: `Note with id ${id} successfully deleted` })
})
