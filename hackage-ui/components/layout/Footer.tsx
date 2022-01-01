import s from './Footer.module.css';

const Footer = () => {
  return (
    <footer className={s.footer}>
      <div className={s.footerContent}>
        <div className={s.footerColumn}>
          <h3 className={s.footerColumnHeader}>Haskell</h3>
          <a href="#">hackage.haskell.org</a>
          <a href="#">Privacy Policy</a>
          <a href="#">Terms & Conditions</a>
          <a href="mailto:contact@haskell.org">contact@haskell.org</a>
        </div>

        <div className={s.footerColumn}>
          <h3 className={s.footerColumnHeader}>Get Help</h3>
          <a href="#">hackage.haskell.org</a>
          <a href="#">Privacy Policy</a>
          <a href="#">Terms & Conditions</a>
          <a href="mailto:contact@haskell.org">contact@haskell.org</a>
        </div>

        <div className={s.footerColumn}>
          <h3 className={s.footerColumnHeader}>Policies</h3>
          <a href="#">hackage.haskell.org</a>
          <a href="#">Privacy Policy</a>
          <a href="#">Terms & Conditions</a>
          <a href="mailto:contact@haskell.org">contact@haskell.org</a>
        </div>

        <div className={s.footerColumn}>
          <h3 className={s.footerColumnHeader}>Social</h3>
          <a href="#">haskell/hackage</a>
          <a href="#">Privacy Policy</a>
          <a href="#">Terms & Conditions</a>
          <a href="mailto:contact@haskell.org">contact@haskell.org</a>
        </div>
      </div>
    </footer>
  )
}

export default Footer;
