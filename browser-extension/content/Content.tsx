console.log('APP_CONTEXT', SearchInputWidget);

const zIndexUpperBound = '2147483647';

const Content = () => {
  return (
    <div style={{ width: '50px', height: '50px', position: 'fixed', top: '0', left: '0', right: '0', background: '#0f0', zIndex: zIndexUpperBound }}>
      abc
      {/* <SearchInputWidget /> */}
    </div>
  );
}

export default Content;
