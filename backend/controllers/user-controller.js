import bcrypt from 'bcryptjs';
import { errorHandler } from '../utils/error.js';
import User from '../models/user-model.js';
import Listing from '../models/listing-model.js';

export const testUser = (req, res, next) => {
    res.send('User route works!');
}

export const updateUser = async (req, res, next) => {
    if (req.params.id !== req.user.id) {
        return next(errorHandler(401, 'Unauthorized'));
    }
    try {
        if (req.body.password) {
            req.body.password = bcrypt.hashSync(req.body.password, 10)
        }

        const updatedUser = await User.findByIdAndUpdate(req.params.id, {
            $set: {
                username: req.body.username,
                email: req.body.email,
                password: req.body.password,
                avatar: req.body.avatar    
            }
        }, {new: true})

        const { password, ...rest } = updatedUser._doc
        res.status(200).json(rest)
    } catch (error) {
        next(error)
    }
}

export const deleteUser = async (req, res, next) => {
    if (req.params.id !== req.user.id) {
        return next(errorHandler(401, 'Unauthorized'));
    }
    try {
        await User.findByIdAndDelete(req.params.id)
        res.status(200).json('User deleted!')
    } catch (error) {
        next(error)
    }
}

export const getUserListings = async (req, res, next) => {
    const userId = req.params.userId
    if (req.user.id !== userId) {
        return next(errorHandler(401, 'Unauthorized'));
    }
    try {
        const userListing = await Listing.find({userRef: userId})
        res.status(200).json(userListing)
    } catch (error) {
        next(error)
    }
}

export const getUser = async (req, res, next) => {
    try {
        const userId = req.params.id
        const user = await User.findById(userId)
        if (!user) {
            return next(errorHandler(404, 'User not Found'))
        }
        res.status(200).json(user)
    } catch (error) {
        next(error)
    }
}
