import Layout from './layout/Layout';
import Greeting from "./layout/Greeting";
import s from './HomePage.module.css';
import SectionHeader from './layout/SectionHeader';
import SmallCard, { SmallCardsRow } from './layout/SmallCard';
import welcomeIllustration from '!!raw-loader!../../illustrations/welcome.svg';
import fastIllustration from '!!raw-loader!../../illustrations/fast.svg';
import reliableIllustration from '!!raw-loader!../../illustrations/reliable.svg';
import BigCard, { BigCardsRow } from './layout/BigCard';

const screenName = 'HomePage';

const Home = () => {
  return (
    <Layout analytics={{ screenName }}>
      <Greeting />
      <div className={s.page}>

        <div className={s.content}>

          <SectionHeader text='Why Haskell?' align='left' />
          <BigCardsRow>
            <BigCard
              title='Reliability'
              description='Advanced type system makes it possible to eliminate the wide class of bugs at compile-time. The pure nature allows to build parallel and concurrent programs much easier than in other languages.'
              link={{
                href: '#',
                text: 'Learn how it works',
                type: 'external',
                openInNewTab: false
              }}
              iconFormat='svg'
              icon={reliableIllustration}
              iconSize='big'
            />

            <BigCard
              title='Performance'
              description='Haskell compiler can produce either native code or LLVM code of your choice. Its performance is at least on par with the fastest languages with garbage collection runtime.'
              link={{
                href: '#',
                text: 'See benchmark results',
                type: 'external',
                openInNewTab: false
              }}
              iconFormat='svg'
              icon={fastIllustration}
              iconSize='big'
            />

            <BigCard
              title='Awesomeness'
              description='Haskell is incredibly productive and incredibly fun. It relies on mathematical foundations, allowing you to create incredibly powerful abstractions when needed.'
              link={{
                href: '#',
                text: 'Become community member',
                type: 'external',
                openInNewTab: false
              }}
              iconFormat='svg'
              icon={welcomeIllustration}
              iconSize='big'
            />
          </BigCardsRow>
        </div>
      </div>
    </Layout>
  );
}

export default Home;
