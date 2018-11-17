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

const db = {
    users,
    posts,
    comments
}

export default db