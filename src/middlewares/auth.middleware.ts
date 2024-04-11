import { NextFunction, Request, Response } from 'express'
import jwt, { JwtPayload } from 'jsonwebtoken'
import User from '../schemas/user.schema'

//check if the user is authenticated
export async function authenticate(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const token = req.cookies.jwt
    if (!token) {
      return res.status(401).json({ message: 'Please login to continue' })
    }

    const jwtSecret = process.env.JWT_SECRET || ''
    const decoded = jwt.verify(token, jwtSecret) as JwtPayload
    if (!decoded || !decoded.userId) {
      return res.status(401).json({ message: 'You are not authorized' })
    }

    const user = await User.findOne({ _id: decoded.userId })
    if (!user) {
      res.status(401).json({ message: 'Unauthorized, username not found' })
    }
    next()
  } catch (error: any) {
    console.error('Failed to authenticate user', error.message)
    res.status(500).json({ message: 'Internal server error' })
  }
}
