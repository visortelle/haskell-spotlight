import Layout from './layout/Layout';
import Greeting from "./layout/Greeting";
import s from './HomePage.module.css';
import SectionHeader from './layout/SectionHeader';
import SmallCard, { SmallCardsRow } from './layout/SmallCard';

const screenName = 'HomePage';

const Home = () => {
  return (
    <Layout analytics={{ screenName }}>
      <Greeting />
      <div className={s.page}>

        <div className={s.content}>

          <SectionHeader text='Why Haskell?' align='left' />
          <SmallCardsRow>
            <SmallCard
              title='Reliability'
              description='Advanced type system makes it possible to eliminate the wide class of bugs at compile-time. The pure nature allows to build parallel and concurrent programs much easier than in other languages.'
              link={{
                href: '#',
                text: 'Learn how it works',
                type: 'external',
                openInNewTab: false
              }}
            />

            <SmallCard
              title='Performance'
              description='Haskell compiler can produce either native code or LLVM code of your choice. Its performance is at least on par with the fastest languages with garbage collection runtime.'
              link={{
                href: '#',
                text: 'See benchmark results',
                type: 'external',
                openInNewTab: false
              }}
            />

            <SmallCard
              title='Awesomeness'
              description='Haskell is incredibly productive and incredibly fun. It relies on mathematical foundations, allowing you to create incredibly powerful abstractions when needed.'
              link={{
                href: '#',
                text: 'Become community member',
                type: 'external',
                openInNewTab: false
              }}
            />
          </SmallCardsRow>
        </div>
      </div>
    </Layout>
  );
}

export default Home;
