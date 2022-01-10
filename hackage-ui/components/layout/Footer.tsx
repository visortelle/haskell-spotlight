import s from './Footer.module.css';
import SvgIcon from '../icons/SVGIcon';
import githubIcon from '!!raw-loader!../icons/github.svg';
import twitterIcon from '!!raw-loader!../icons/twitter.svg';
import discourseIcon from '!!raw-loader!../icons/discourse-monochrome.svg';
import * as lib from '@hackage-ui/react-lib';
import { ReactNode } from 'react';

const FooterLink = (props: { href: string, children: ReactNode }) => {
  return <lib.links.ExtA {...props} analytics={{ featureName: 'FooterLink', eventParams: { screen_name: 'All' } }} />
}

const Footer = () => {
  return (
    <footer className={s.footer}>
      <div className={s.footerContent}>
        <div className={s.footerColumn}>
          <h3 className={s.footerColumnHeader}>Haskell</h3>
          <FooterLink href="https://haskell.foundation/">Haskell Foundation</FooterLink>
          <FooterLink href="https://hackage.haskell.org/">Hackage</FooterLink>
          <FooterLink href="https://haskell.org/">haskell.org</FooterLink>
        </div>

        <div className={s.footerColumn}>
          <h3 className={s.footerColumnHeader}>Get Help</h3>
          <FooterLink href="https://hackage.haskell.org/upload">Upload a Package</FooterLink>
          <FooterLink href="https://cabal.readthedocs.io/">Cabal User Guide</FooterLink>
          <FooterLink href="https://cabal.readthedocs.io/en/latest/cabal-package.html#pkg-field-maintainer">Cabal Package Description</FooterLink>
          <FooterLink href="https://github.com/Gabriel439/post-rfc/blob/main/sotu.md">State of the Haskell ecosystem</FooterLink>
        </div>

        <div className={s.footerColumn}>
          <h3 className={s.footerColumnHeader}>Policies</h3>
          <FooterLink href="https://pvp.haskell.org/">Package Versioning Policy</FooterLink>
        </div>

        <div className={s.footerColumn}>
          <h3 className={s.footerColumnHeader}>Social</h3>
          <FooterLink href="https://twitter.com/HackageUI"><SvgIcon svg={twitterIcon} />@HackageUI</FooterLink>
          <FooterLink href="https://github.com/visortelle/hackage-ui"><SvgIcon svg={githubIcon} />visortelle/hackage-ui</FooterLink>
          <FooterLink href="https://twitter.com/haskellfound"><SvgIcon svg={twitterIcon} />@haskellfound</FooterLink>
          <FooterLink href="https://discourse.haskell.org/c/haskell-foundation"><SvgIcon svg={discourseIcon} />discourse.haskell.org</FooterLink>
        </div>
      </div>
    </footer>
  )
}

export default Footer;
