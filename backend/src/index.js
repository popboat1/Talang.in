import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import authRoutes from './routes/auth.js'
import groupRoutes from './routes/groups.js'
import transactionRoutes from './routes/transactions.js'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3000

app.use(cors())
app.use(express.json())

app.use('/api/auth', authRoutes)
app.use('/api/groups', groupRoutes)
app.use('/api/transactions', transactionRoutes)

app.get('/', (req, res) => res.json({ message: 'Talang.in API is running!' }))

app.listen(PORT, () => console.log(`Server running on port ${PORT}`))