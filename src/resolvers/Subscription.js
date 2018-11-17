const Subscription = {
    count: {
        subscribe(parent, args, { pubsub }, info) {
            let count = 0

            setInterval(() => {
                count++
                pubsub.publish('count', {
                    count
                })
            }, 1000)

            return pubsub.asyncIterator('count')
        }
    },
    comment: {
        subscribe(parent, args, { pubsub, db }, info) {
            const { postId } = args
            const post = db.posts.find(post => post.id === postId && post.published)
            if (!post) {
                throw new Error('Post does not exist.')
            }
            return pubsub.asyncIterator(`comment ${postId}`)
        }
    }
}

export default Subscription