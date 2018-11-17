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
    updateUser(parent, args, { db }, info) {
        const { id, data } = args
        const user = db.users.find(user => user.id === id)

        if (!user) {
            throw new Error('Author does not exist')
        }

        if (typeof data.email === 'string') {
            const emailTaken = db.users.some(user => user.email === data.email)
            if (emailTaken) {
                throw new Error('Email already in use')
            }

            user.email = data.email
        }

        if (typeof data.name === 'string') {
            user.name = data.name
        }

        if (typeof data.age !== 'undefined') {
            user.age = data.age
        }

        return user

    },
    createPost(parent, args, { db, pubsub }, info) {
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
        if (post.published) {
            pubsub.publish('post', { post })
        }
        return post
    },
    deletePost(parent, args, { db }, info) {
        const postToDeleteIndex = db.posts.findIndex(post => post.id === args.id)

        if (postToDeleteIndex === -1) {
            throw new Error('Post does not exist.')
        }

        const deletedPosts = db.posts.splice(postToDeleteIndex, 1)

        db.comments = db.comments.filter(comment => comment.post !== args.id)
        return deletedPosts[0]
    },
    updatePost(parent, args, { db }, info) {
        const { data } = args
        const post = db.posts.find(post => post.id === args.id)

        if (!post) {
            throw new Error('Post does not exist.')
        }

        if (typeof data.title === 'string') {
            post.title = data.title
        }

        if (typeof data.body === 'string') {
            post.body = data.body
        }

        if (typeof data.published === 'boolean') {
            post.published = data.published
        }

        return post

    },
    createComment(parent, args, { db, pubsub }, info) {
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
        pubsub.publish(`comment ${args.data.post}`, { comment })
        return comment
    },
    updateComment(parents, args, { db }, info) {
        const { data, id } = args
        const comment = db.comments.find(comment => comment.id === id)
        if (!comment) {
            throw new Error('Comment does not exist.')
        }

        if (typeof data.body === 'string') {
            comment.body = data.body
        }

        return comment
    }
}

export default Mutation