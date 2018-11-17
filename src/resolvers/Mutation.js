import uuidv4 from 'uuid/v4'

const Mutation = {
    createUser(parent, args, { db }, info) {
        const { data } = args
        const emailTaken = db.users.some(user => user.email === data.email)
        if (emailTaken) {
            throw new Error('Email is already in use.')
        }
        const user = { id: uuidv4(), ...data }
        db.users.push(user)

        return user
    },
    createPost(parent, args, { db }, info) {
        const { data } = args
        const isValidAuthor = db.users.some(user => user.id === data.author)

        if (!isValidAuthor) {
            throw new Error('That author is not a user.')
        }

        const post = {
            id: uuidv4(),
            ...data
        }

        db.posts.push(post)
        return post
    },
    createComment(parent, args, { db }, info) {
        const { data } = args
        const isValidAuthor = db.users.some(user => user.id === data.author)
        const postExists = db.posts.some(currentPost => currentPost.id === data.post && currentPost.published)
        if (!isValidAuthor) {
            throw new Error('That author is not a user.')
        } else if (!postExists) {
            throw new Error('Cannot add comment to unpublished post')
        }

        const comment = {
            id: uuidv4(),
            ...data
        }

        db.comments.push(comment)
        return comment
    },
    deleteUser(parent, args, { db }, info) {
        const userToDeleteIndex = db.users.findIndex(user => user.id === args.id)

        if (userToDeleteIndex === -1) {
            throw new Error('No user was found')
        }

        const deletedUsers = db.users.splice(userToDeleteIndex, 1)

        db.posts = db.posts.filter(post => {
            const match = post.author === args.id
            if (match) {
                db.comments = db.comments.filter(comment => comment.post !== post.id)
            }
            return !match
        })

        db.comments = db.comments.filter(post => post.author !== args.id)

        return deletedUsers[0]
    },
    deletePost(parent, args, { db }, info) {
        const postToDeleteIndex = db.posts.findIndex(post => post.id === args.id)

        if (!postToDeleteIndex) {
            throw new Error('Post does not exist.')
        }

        const deletedPosts = db.posts.splice(postToDeleteIndex, 1)

        db.comments = db.comments.filter(comment => comment.post !== args.id)
        return deletedPosts[0]
    }
}

export default Mutation