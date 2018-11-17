import { GraphQLServer } from 'graphql-yoga'
import uuidv4 from 'uuid/v4'

// Demo user data
const users = [{
    id: '1',
    name: 'Jonathan',
    email: 'jonathan@gmail.com',
    age: 23,
},
{
    id: '2',
    name: 'Sarah',
    email: 'sarah@gmail.com',
    age: 24
},
{
    id: '3',
    name: 'Tanner',
    email: 'tanner@gmail.com'
}
]

const posts = [{
    id: '1',
    title: 'The man',
    body: 'asdasdqwetr',
    published: true,
    author: '1'
},
{
    id: '2',
    title: 'TJOi qwe',
    body: 'qwreio qeilrew ',
    published: false,
    author: '1'
},
{
    id: '3',
    title: 'bt jiot r',
    body: 'qwrr r r rreio qeilrr r  ',
    published: true,
    author: '2'
}
]

const comments = [{
    id: '4',
    body: 'Great post my dawg!',
    post: '1',
    author: '2'
},
{
    id: '7',
    body: 'Love it',
    post: '1',
    author: '3'
},
{
    id: '10',
    body: 'So true!',
    post: '3',
    author: '3'
}
]



// Type definitions (schema)
const typeDefs = `
    type Query {
        users(query: String): [User!]!
        me: User!
        post: Post!,
        posts(query: String): [Post!]!
        comments: [Comment!]!
    }

    type Mutation {
        createUser(name: String!, email: String!, age: Int): User!
        createPost(title: String!, body: String!, published: Boolean!, author: ID!): Post!
        createComment(body: String!, post: String!, author: ID!): Comment!
    }

    type User {
        id: ID!
        name: String!
        email: String!
        age: Int
        posts: [Post!]!
        comments: [Comment!]!
    }

    type Post {
        id: ID!
        title: String!
        body: String!
        published: Boolean!
        author: User!
        comments: [Comment]
    }

    type Comment {
        id: ID!
        body: String!
        post: Post!
        author: User!
    }
`
// Resolvers

const resolvers = {
    Query: {
        users(parent, args, ctx, info) {
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
        posts(parent, args, ctx, info) {
            if (args.query) {
                const query = args.query.toLowerCase()
                return posts.filter(
                    post =>
                        post.title.toLowerCase().includes(query)
                        ||
                        post.body.toLowerCase().includes(query)
                )
            }
            return posts
        },
        comments(parent, args, ctx, info) {
            return comments
        }
    },
    Mutation: {
        createUser(parent, args, ctx, info) {
            const { name, email, age } = args
            const emailTaken = users.some(user => user.email === email)
            if (emailTaken) {
                throw new Error('Email is already in use.')
            }
            const user = { id: uuidv4(), name, email, age }
            users.push(user)

            return user
        },
        createPost(parent, args, ctx, info) {

            const isValidAuthor = users.some(user => user.id === args.author)

            if (!isValidAuthor) {
                throw new Error('That author is not a user.')
            }

            const { title, body, published, author } = args

            const post = {
                id: uuidv4(),
                title,
                body,
                author,
                published
            }

            posts.push(post)
            return post
        },
        createComment(parent, args, ctx, info) {
            const { body, post, author } = args
            const isValidAuthor = users.some(user => user.id === author)
            const postExists = posts.some(currentPost => currentPost.id === post && currentPost.published)
            if (!isValidAuthor) {
                throw new Error('That author is not a user.')
            } else if (!postExists) {
                throw new Error('Cannot add comment to unpublished post')
            }

            const comment = {
                id: uuidv4(),
                body,
                author,
                post
            }

            comments.push(comment)
            return comment
        }
    },
    Post: {
        author(parent, args, ctx, info) {
            return users.find(user => user.id === parent.author)
        },
        comments(parent, args, ctx, info) {
            return comments.filter(comment => comment.post === parent.id)
        }
    },
    User: {
        posts(parent, args, ctx, info) {
            return posts.filter(post => post.author === parent.id)
        },
        comments(parent, args, ctx, info) {
            return comments.filter(comment => comment.author === parent.id)
        }
    },
    Comment: {
        author(parent, args, ctx, info) {
            return users.find(user => user.id === parent.author)
        },
        post(parent, args, ctx, info) {
            return posts.find(post => post.id === parent.post)
        }
    }
}

const server = new GraphQLServer({
    typeDefs,
    resolvers
})

server.start(() => {
    console.log('Server is up!')
})