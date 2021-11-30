// BUILD YOUR SERVER HERE
const express = require('express')
const User = require('./users/model')
const server = express()
server.use(express.json())

server.put("/api/users/:id", async ( req, res ) => {
    try{
        const { id } = req.params
        const { name, bio } = req.body
        
        if(!name || !bio) {
            res.status(400).json( { message: "Please provide name and bio for the user" } )

        } else {
            const updateUser = await User.update(id, { name, bio })

            if(updateUser) {
                res.status(200).json(updateUser)

            } else {
                res.status(404).json( { message: "The user with the specified ID does not exist" } )
            }
        }
    } catch (error) {
        res.status(500).json( { message: "The user information could not be modified" } )
    }
})

server.delete('/api/users/:id', async (req, res) => {
try {
    const possibleUser = await User.findById(req.params.id)
    if (!possibleUser) {
        res.status(404).json({ message: "The user with the specified ID does not exist" })
    } else {
        const deletedUser = await User.remove(possibleUser.id)
        res.status(200).json(deletedUser)
    }
} catch (err) { 
    res.status(500).json({
    message: 'error creating user',
    err: err.message
})

}
})

server.post('/api/users', (req, res) => {
    const user = req.body;
    if (!user.name || !user.bio) {
        res.status(400).json({ message: "Please provide name and bio for the user" })
    } else {
        User.insert(user)
        .then(createdUser => {
            res.status(201).json(createdUser)
        })
        .catch(err => {
            res.status(500).json({
                message: 'error creating user',
                err: err.message
            })
        })
    }
    User.insert(user)
})

server.get('/api/users', (req, res) => {
    User.find()
    .then(users => {
        res.json(users)
    })
    .catch(err => {
        res.status(500).json({
            message: 'error getting users',
            err: err.message
        })
    })
})

server.get('/api/users/:id', (req, res) => {
    User.findById(req.params.id)
    .then(user => {
        if (!user) {
            res.status(404).json({ message: "The user with the specified ID does not exist" })
        }
        res.json(user)
    })
    .catch(err => {
        res.status(500).json({
            message: 'error getting user',
            err: err.message
        })
    })
})

server.use('*', (req, res) => {
    res.status(404).json({
        message: "not found"
    })
})

module.exports = server; // EXPORT YOUR SERVER instead of {}
