const Query = {
    users(parent, args, { db }, info) {
        const { users } = db
        if (args.query) {
            return users.filter(user => user.name.toLowerCase().includes(args.query.toLowerCase()))
        }
        return users
    },
    me() {
        return {
            id: '1',
            name: 'Jonathan',
            email: 'jonpuc.dev@gmail.com',
            age: null
        }
    },
    post() {
        return {
            id: '4',
            title: 'Today I...',
            body: 'Hello guys back at it again',
            published: true
        }
    },
    posts(parent, args, { db }, info) {
        if (args.query) {
            const query = args.query.toLowerCase()
            return db.posts.filter(
                post =>
                    post.title.toLowerCase().includes(query)
                    ||
                    post.body.toLowerCase().includes(query)
            )
        }
        return db.posts
    },
    comments(parent, args, { db }, info) {
        return db.comments
    }
}

export default Query