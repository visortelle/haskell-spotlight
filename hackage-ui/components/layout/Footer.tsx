import s from './Footer.module.css';
import SvgIcon from '../icons/SVGIcon';
import githubIcon from '!!raw-loader!../icons/github.svg';
import twitterIcon from '!!raw-loader!../icons/twitter.svg';
import discourseIcon from '!!raw-loader!../icons/discourse.svg';

const Footer = () => {
  return (
    <footer className={s.footer}>
      <div className={s.footerContent}>
        <div className={s.footerColumn}>
          <h3 className={s.footerColumnHeader}>Haskell</h3>
          <a href="https://haskell.foundation/">Haskell Foundation</a>
          <a href="https://hackage.haskell.org/">Hackage</a>
          <a href="https://haskell.org/">haskell.org</a>
        </div>

        <div className={s.footerColumn}>
          <h3 className={s.footerColumnHeader}>Get Help</h3>
          <a href="https://hackage.haskell.org/upload">Upload a Package</a>
          <a href="https://cabal.readthedocs.io/">Cabal User Guide</a>
          <a href="https://cabal.readthedocs.io/en/latest/cabal-package.html#pkg-field-maintainer">Cabal Package Description</a>
          <a href="https://github.com/Gabriel439/post-rfc/blob/main/sotu.md">State of the Haskell ecosystem</a>
        </div>

        <div className={s.footerColumn}>
          <h3 className={s.footerColumnHeader}>Policies</h3>
          <a href="https://pvp.haskell.org/">Package Versioning Policy</a>
        </div>

        <div className={s.footerColumn}>
          <h3 className={s.footerColumnHeader}>Social</h3>
          <a href="https://twitter.com/HackageUI"><SvgIcon svg={twitterIcon} />@HackageUI</a>
          <a href="https://github.com/visortelle/hackage-ui"><SvgIcon svg={githubIcon} />visortelle/hackage-ui</a>
          <a href="https://twitter.com/haskellfound"><SvgIcon svg={twitterIcon} />@haskellfound</a>
          <a href="https://discourse.haskell.org/c/haskell-foundation"><SvgIcon svg={discourseIcon} />discourse.haskell.org</a>
        </div>
      </div>
    </footer>
  )
}

export default Footer;
