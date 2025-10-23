type PostModalProps = {
  params: { postId: string }
}

export default function PostModal({ params }: PostModalProps) {
  const { postId } = params

  return (
    <div className="post-modal">
      <h2>Пост {postId}</h2>
      {/* Контент модалки поста */}
    </div>
  )
}
