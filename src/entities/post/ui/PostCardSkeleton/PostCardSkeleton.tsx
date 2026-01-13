import s from './PostCardSkeleton.module.scss'

const PostCardSkeleton = () => {
  return (
    <div className={s.container}>
      <div className={s.grid}>
        {[...Array(10)].map((_, i) => (
          <div key={i} className={s.item}>
            <div className={s['skeleton-card']}>
              {/* Изображение с навигацией */}
              <div className={s['image-placeholder']}>
                {/* Индикаторы точек */}
                <div className={s.dots}>
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className={`${s.dot} ${i === 0 ? s.active : ''}`}></div>
                  ))}
                </div>
              </div>

              {/* Контент под изображением */}
              <div className={s.content}>
                <div className={s.header}>
                  <div className={s.avatar}></div>
                  <div className={s.name}></div>
                </div>
                <div className={s['text-line']}></div>
                <div className={s['text-line']}></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default PostCardSkeleton
