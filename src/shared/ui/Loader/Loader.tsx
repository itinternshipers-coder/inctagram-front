import s from './Loader.module.scss'

type LoaderProps = {
  children?: React.ReactNode
}

export const Loader = ({ children }: LoaderProps) => {
  return (
    <div className={s.overlay}>
      <div className={s.contentLoader}>
        <span className={s.loader}></span>
        <p>{children}</p>
      </div>
    </div>
  )
}

export default Loader
