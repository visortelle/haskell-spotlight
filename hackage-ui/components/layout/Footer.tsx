import s from './Footer.module.css';

const Footer = () => {
  return (
    <>
      <footer className={s.footer}>
        <div className={s.footerContent}>
          <div className={s.block}>
            <a href="#">hackage.haskell.org</a>
          </div>

          <div className={s.block}>
            <a href="#">Privacy Policy</a>
          </div>

          <div className={s.block}>
            <a href="#">Terms & Conditions</a>
          </div>

          <div className={s.block}>
            <a href="mailto:contact@haskell.org">contact@haskell.org</a>
          </div>
        </div>

      </footer>
    </>
  )
}


export default Footer;
