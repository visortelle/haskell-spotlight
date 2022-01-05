import s from './Footer.module.css';

const Footer = () => {
  return (
    <footer className={s.footer}>
      <div className={s.footerContent}>
        <div className={s.footerColumn}>
          <h3 className={s.footerColumnHeader}>Haskell</h3>
          -
        </div>

        <div className={s.footerColumn}>
          <h3 className={s.footerColumnHeader}>Get Help</h3>
          -
        </div>

        <div className={s.footerColumn}>
          <h3 className={s.footerColumnHeader}>Policies</h3>
          -
        </div>

        <div className={s.footerColumn}>
          <h3 className={s.footerColumnHeader}>Social</h3>
          -
        </div>
      </div>
    </footer>
  )
}

export default Footer;
