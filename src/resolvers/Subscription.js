const Subscription = {
    comment: {
        subscribe(parent, args, { pubsub, db }, info) {
            const { postId } = args
            const post = db.posts.find(post => post.id === postId && post.published)
            if (!post) {
                throw new Error('Post does not exist.')
            }
            return pubsub.asyncIterator(`comment ${postId}`)
        }
    },
    post: {
        subscribe(parent, args, { pubsub }, info) {
            return pubsub.asyncIterator('post')
        }
    }
}

export default Subscription