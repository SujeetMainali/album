import express from 'express'
import sanitizeHtml from 'sanitize-html'
import middleware from '../middlewares'
const app = express()
app.use((_, res, next) => {
  res.locals.sanitizeHtml = sanitizeHtml
  next()
})

middleware(app)

export default app
