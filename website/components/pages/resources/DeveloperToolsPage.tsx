import * as lib from "@haskell-spotlight/react-lib";
import { useContext, useEffect } from "react";
import s from './DeveloperToolsPage.module.css';
import BigCard, { BigCardsRow } from "./layout/BigCard";
import SmallCard, { SmallCardsRow } from "./layout/SmallCard";
import SVGIcon from "../../icons/SVGIcon";
import HaskellIcon from "../../branding/HaskellIcon";
import vscodeIcon from "!!raw-loader!../../icons/vscode.svg";
import emacsIcon from "!!raw-loader!../../icons/emacs.svg";
import intellijIcon from "!!raw-loader!../../icons/intellij.svg";
import vimIcon from "!!raw-loader!../../icons/vim.svg";
import firefoxIcon from "!!raw-loader!../../icons/firefox.svg";
import chromeIcon from "!!raw-loader!../../icons/chrome.svg";
import safariIcon from "!!raw-loader!../../icons/safari.svg";
import ghcupIconAddon from "!!raw-loader!../../icons/download.svg";
import playgroundIconAddon from "!!raw-loader!../../icons/play.svg";
import haskellSpotlightIconAddon from "!!raw-loader!../../icons/search.svg";
import Layout from "./layout/Layout";
import PageHeader from "./layout/PageHeader";
import SectionHeader from './layout/SectionHeader';
import Link from './layout/Link';

export type DevelopmentEnvironmentPageProps = {

}

const screenName = 'DeveloperToolsPage';

const DevelopmentEnvironmentPage = (props: DevelopmentEnvironmentPageProps) => {
  const appContext = useContext(lib.appContext.AppContext);

  useEffect(() => {
    appContext.analytics?.gtag('event', 'screen_view', { screen_name: screenName });
  }, []);

  return (
    <Layout analytics={{ screenName }}>
      <div className={s.page}>
<PageHeader
        text="Developer tools"
        secondaryText="Install compiler, prepare your favorite code editor and more."
      />

      <BigCardsRow>
        <BigCard
          title="GHCup"
          description="GHCup is a Haskell toolset installer and version management tool. It's similar to RVM for Ruby, NVM for Node, or SDKMAN for Java."
          icon={<HaskellIcon iconAddonSvg={ghcupIconAddon} />}
          iconFormat="react"
          link={{
            href: "https://www.haskell.org/ghcup/",
            text: "View installation instructions",
            type: "external",
            openInNewTab: true
          }}
        />

        <BigCard
          title="Haskell Playground (planned)"
          description="The playground allows you to experiment with Haskell in browser without installing it locally. It allows embedding runnable code examples into tutorials and documentation."
          icon={<HaskellIcon iconAddonSvg={playgroundIconAddon} />}
          iconFormat="react"
          disabled
        />
      </BigCardsRow>

      <SectionHeader
        text="Code editor add-ons"
        secondaryText="Bring Haskell code highlighting and auto-completion to your favorite editor."
      />

      <SmallCardsRow>
        <SmallCard
          title="VSCode"
          description="Official extension for VSCode."
          icon={vscodeIcon}
          iconFormat="svg"
          link={{
            href: "https://marketplace.visualstudio.com/items?itemName=haskell.haskell",
            text: "View in Visual Studio Marketplace",
            type: "external",
            openInNewTab: true
          }}
        />

        <SmallCard
          title="IntelliJ Platform"
          description="Plugin for IDEs based on IntelliJ Platform."
          icon={intellijIcon}
          iconFormat="svg"
          link={{
            href: "https://plugins.jetbrains.com/plugin/8258-intellij-haskell",
            text: "View in JetBrains Marketplace",
            type: "external",
            openInNewTab: true
          }}
        />

        <SmallCard
          title="Emacs"
          description="Haskell mode for GNU Emacs."
          icon={emacsIcon}
          iconFormat="svg"
          link={{
            href: "https://github.com/haskell/haskell-mode",
            text: "View on GitHub",
            type: "external",
            openInNewTab: true
          }}
        />

        <SmallCard
          title="VIM"
          description="Use Haskell Language Server with VIM or Neovim."
          icon={vimIcon}
          iconFormat="svg"
          link={{
            href: "https://haskell-language-server.readthedocs.io/en/latest/configuration.html#vim-or-neovim",
            text: "Learn how to",
            type: "external",
            openInNewTab: true
          }}
        />
      </SmallCardsRow>

      <SectionHeader
        text="More tools"
        secondaryText="Be productive as much as possible."
      />

      <BigCardsRow>
        <BigCard
          title="Haskell Spotlight"
          description="Keep the search widget of this site right under your fingers."
          icon={<HaskellIcon iconAddonSvg={haskellSpotlightIconAddon} />}
          iconFormat="react"
          secondaryContent={(
            <div style={{ display: 'flex', flexDirection: 'column', flex: '1', justifyContent: 'flex-end' }}>
              {[(
                <Link
                  key="vscode"
                  text={<><SVGIcon svg={vscodeIcon} /><div style={{ width: '140rem' }}>Get for VSCode</div></>}
                  href="https://marketplace.visualstudio.com/items?itemName=visortelle.haskell-spotlight"
                  type="external"
                  openInNewTab={true}
                />
              ), (
                <Link
                  key="chrome"
                  text={<><SVGIcon svg={chromeIcon} /><div style={{ width: '140rem' }}>Get for Chrome</div></>}
                  href="https://chrome.google.com/webstore/detail/haskell-spotlight/npadgihccblidebeflijkcgfpklgalkj"
                  type="external"
                  openInNewTab={true}
                />
              ), (
                <Link
                  key="firefox"
                  text={<><SVGIcon svg={firefoxIcon} /><div style={{ width: '140rem' }}>Get for Firefox</div></>}
                  href="https://addons.mozilla.org/en-US/firefox/addon/haskell-spotlight/"
                  type="external"
                  openInNewTab={true}
                />), (
                <Link
                  key="safari"
                  text={<><SVGIcon svg={safariIcon} /><div style={{ width: '140rem' }}>Get for Safari</div></>}
                  href="#"
                  type="external"
                  openInNewTab={true}
                  disabled
                />
              )].map(el => <div key={el.key} style={{ marginBottom: '8rem', display: 'flex', justifyContent: 'flex-end' }}>{el}</div>)}
            </div>
          )}
        />
      </BigCardsRow>

      </div>
          </Layout>
  );
}

export default DevelopmentEnvironmentPage;

